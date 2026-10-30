const path = require("path");
const fs = require("fs");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://1arley.me"
).replace(/\/+$/, "");

const routes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/?lang=en", changefreq: "daily", priority: "0.9" },
  { path: "/sobre", changefreq: "monthly", priority: "0.7" },
  { path: "/sobre?lang=en", changefreq: "monthly", priority: "0.6" },
];

const outputPath = path.resolve("public", "sitemap.xml");
let existingLastMod = null;
if (fs.existsSync(outputPath)) {
  const existing = fs.readFileSync(outputPath, "utf8");
  const match = existing.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/);
  if (match) existingLastMod = match[1];
}

const now = existingLastMod || new Date().toISOString().slice(0, 10);

const formatUrl = (routePath) => {
  const normalizedPath = routePath === "/" ? "/" : routePath.replace(/\/+$/, "");
  return `${baseUrl}${normalizedPath}`;
};

const xmlEntries = routes
  .map(({ path: routePath, changefreq, priority }) => {
    const loc = formatUrl(routePath);
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n\n");

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  xmlEntries,
  "</urlset>",
  "",
].join("\n");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sitemapXml, "utf8");

console.log(`Sitemap gerado em: ${outputPath}`);
