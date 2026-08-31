const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const multer = require("multer");
const { Pool } = require("pg");

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json({ limit: "8mb" }));

const PORT = parseInt(process.env.PORT || "3001", 10);
const EMAIL = (process.env.CMS_ADMIN_EMAIL || "").trim().toLowerCase();
const PASSWORD = (process.env.CMS_ADMIN_PASSWORD || "").trim();
const SECRET = process.env.CMS_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL nao definida.");
  process.exit(1);
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// ─── schema ───────────────────────────────────────────────────────
const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_content (
  locale TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT '',
  is_highlighted BOOLEAN DEFAULT FALSE,
  cover_image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  email TEXT DEFAULT '',
  area TEXT DEFAULT '',
  "group" TEXT DEFAULT '',
  avatar_url TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'USER',
  position TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  mime TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

async function initDb() {
  await pool.query(SCHEMA);
  console.log("db schema ok");
}
initDb().catch((e) => {
  console.error("db init failed", e);
  process.exit(1);
});

// ─── auth ─────────────────────────────────────────────────────────
function signToken(email) {
  const payload = { email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
  return b64 + "." + sig;
}

function verifyToken(token) {
  try {
    const [b64, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", SECRET).update(b64).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const p = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (p.exp < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ message: "Nao autorizado." });
  }
  next();
}

const router = express.Router();

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const e = String(email || "").trim().toLowerCase();
  if (!EMAIL || !PASSWORD) {
    return res.status(500).json({ message: "CMS admin nao configurado no servidor." });
  }
  if (e === EMAIL && String(password || "") === PASSWORD) {
    return res.json({
      access_token: signToken(e),
      user: { id: "admin", name: "Admin", email: e, role: "SUPERADMIN", position: "Owner" },
    });
  }
  res.status(401).json({ message: "Credenciais invalidas." });
});

router.post("/auth/refresh", (_req, res) => {
  res.status(401).json({ message: "Sessao expirada." });
});

router.get("/health", (_req, res) => res.json({ ok: true }));

// ─── site content (portfolio completo, PT/EN) ─────────────────────
router.get("/site", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT locale, data FROM site_content");
    const out = {};
    for (const row of rows) out[row.locale] = row.data;
    res.json({ data: out });
  } catch (e) {
    res.status(500).json({ message: "Falha ao carregar conteudo." });
  }
});

router.put("/site", requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    for (const locale of ["pt", "en"]) {
      const data = body[locale];
      if (!data) continue;
      await pool.query(
        `INSERT INTO site_content (locale, data, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (locale) DO UPDATE SET data = $2, updated_at = NOW()`,
        [locale, JSON.stringify(data)],
      );
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Falha ao salvar conteudo." });
  }
});

// ─── upload (imagem -> postgres) ──────────────────────────────────
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

router.post("/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Arquivo nao enviado." });
    const id = crypto.randomUUID();
    await pool.query("INSERT INTO images (id, mime, data) VALUES ($1, $2, $3)", [
      id,
      req.file.mimetype || "application/octet-stream",
      req.file.buffer,
    ]);
    res.json({ url: "/api/v1/images/" + id });
  } catch (e) {
    res.status(500).json({ message: "Falha no upload." });
  }
});

router.get("/images/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT mime, data FROM images WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Imagem nao encontrada." });
    res.set("Content-Type", rows[0].mime);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(rows[0].data);
  } catch (e) {
    res.status(500).json({ message: "Falha ao carregar imagem." });
  }
});

// ─── generic CRUD ─────────────────────────────────────────────────
const TABLES = {
  posts: {
    columns: ["title", "description", "content", "category", "is_highlighted", "cover_image"],
    mapRow: (r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      content: r.content,
      category: r.category,
      isHighlighted: r.is_highlighted,
      coverImage: r.cover_image,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }),
    fromBody: (b) => ({
      title: String(b.title || ""),
      description: String(b.description || ""),
      content: String(b.content || ""),
      category: String(b.category || ""),
      is_highlighted: Boolean(b.isHighlighted),
      cover_image: String(b.coverImage || ""),
    }),
    require: ["title"],
  },
  team: {
    table: "team",
    path: "team-members",
    columns: ["name", "role", "email", "area", '"group"', "avatar_url"],
    mapRow: (r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      email: r.email,
      area: r.area,
      group: r.group,
      avatarUrl: r.avatar_url,
    }),
    fromBody: (b) => ({
      name: String(b.name || ""),
      role: String(b.role || ""),
      email: String(b.email || ""),
      area: String(b.area || ""),
      group: String(b.group || ""),
      avatar_url: String(b.avatarUrl || ""),
    }),
    require: ["name"],
  },
  links: {
    table: "links",
    path: "quick-access",
    columns: ["title", "description", "url"],
    mapRow: (r) => ({ id: r.id, title: r.title, description: r.description, url: r.url }),
    fromBody: (b) => ({
      title: String(b.title || ""),
      description: String(b.description || ""),
      url: String(b.url || ""),
    }),
    require: ["title", "url"],
  },
  users: {
    columns: ["name", "email", "role", "position"],
    mapRow: (r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      position: r.position,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }),
    fromBody: (b) => ({
      name: String(b.name || ""),
      email: String(b.email || ""),
      role: String(b.role || "USER"),
      position: String(b.position || ""),
    }),
    require: ["name", "email"],
  },
};

for (const [key, cfg] of Object.entries(TABLES)) {
  const table = cfg.table || key;
  const path = cfg.path || key;

  router.get("/" + path, requireAdmin, async (_req, res) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY created_at DESC NULLS LAST, id`);
      res.json({ data: rows.map(cfg.mapRow) });
    } catch (e) {
      res.status(500).json({ message: "Falha ao listar." });
    }
  });

  router.post("/" + path, requireAdmin, async (req, res) => {
    try {
      const body = cfg.fromBody(req.body || {});
      for (const f of cfg.require) {
        if (!body[f]) return res.status(400).json({ message: f + " e obrigatorio." });
      }
      const id = crypto.randomUUID();
      const cols = ["id", ...cfg.columns];
      const vals = [id, ...cfg.columns.map((c) => body[c.replaceAll('"', "")])];
      const placeholders = cols.map((_, i) => "$" + (i + 1));
      await pool.query(
        `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders.join(", ")})`,
        vals,
      );
      res.json({ data: { id, ...body } });
    } catch (e) {
      res.status(500).json({ message: "Falha ao criar." });
    }
  });

  router.patch("/" + path + "/:id", requireAdmin, async (req, res) => {
    try {
      const body = cfg.fromBody(req.body || {});
      const sets = cfg.columns.map((c, i) => `${c} = $${i + 2}`);
      const vals = cfg.columns.map((c) => body[c.replaceAll('"', "")]);
      const hasUpdatedAt = key === "posts" || key === "users";
      const sql = hasUpdatedAt
        ? `UPDATE ${table} SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $1`
        : `UPDATE ${table} SET ${sets.join(", ")} WHERE id = $1`;
      await pool.query(sql, [req.params.id, ...vals]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ message: "Falha ao atualizar." });
    }
  });

  router.delete("/" + path + "/:id", requireAdmin, async (req, res) => {
    try {
      await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ message: "Falha ao remover." });
    }
  });
}

app.use("/api/v1", router);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log("cms-backend listening on port " + PORT);
  if (!EMAIL) console.warn("WARNING: CMS_ADMIN_EMAIL not set");
  if (!PASSWORD) console.warn("WARNING: CMS_ADMIN_PASSWORD not set");
});