/**
 * Rotates the guitar GLB upright (neck pointing up +Y) by editing the GLB
 * JSON chunk directly — no three.js load/re-export needed, so embedded
 * textures are preserved untouched. Run with FLIP=1 to flip 180° after the
 * upright rotation (if the headstock ends up pointing down).
 *
 * Run: node scripts/upright-guitar-glb.mjs
 */
import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "public", "models", "guitar.glb");
const buf = fs.readFileSync(file);

// --- parse GLB ---
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.toString("utf8", 20, 20 + jsonLen);
const json = JSON.parse(jsonStr);

// quaternion for -90° about Z (upright): [x, y, z, w]
let qz = -Math.SQRT1_2; // sin(-45°)
let qw = Math.SQRT1_2; // cos(-45°)
if (process.env.FLIP === "1") {
  qz = -qz; // flip the rotation direction
  qw = -qw;
}

const scene = json.scenes[0];
const roots = scene.nodes;

// Build a wrapper node that parents every scene root and holds the rotation.
const wrapperIndex = json.nodes.length;
json.nodes.push({
  name: "upright_root",
  rotation: [0, 0, qz, qw],
  children: roots,
});
scene.nodes = [wrapperIndex];

// --- re-serialize JSON chunk (pad with spaces to 4 bytes) ---
let newJson = JSON.stringify(json);
newJson = newJson.padEnd(newJson.length + ((4 - (newJson.length % 4)) % 4), " ");
const newJsonLen = newJson.length;

// --- locate BIN chunk ---
const binLen = buf.readUInt32LE(20 + jsonLen);
const binStart = 20 + jsonLen + 8;
const binData = buf.subarray(binStart, binStart + binLen);

// --- rebuild GLB ---
const totalLen = 12 + 8 + newJsonLen + 8 + binLen;
const out = Buffer.alloc(totalLen);
out.write("glTF", 0, "utf8");
out.writeUInt32LE(2, 4);
out.writeUInt32LE(totalLen, 8);
out.writeUInt32LE(newJsonLen, 12);
out.write("JSON", 16, "utf8");
out.write(newJson, 20, "utf8");
out.writeUInt32LE(binLen, 20 + newJsonLen);
out.write("BIN\u0000", 20 + newJsonLen + 4, "utf8");
binData.copy(out, 20 + newJsonLen + 8);

fs.writeFileSync(file, out);
console.log(
  `Wrote upright GLB (${out.length} bytes). FLIP=${process.env.FLIP ?? "0"}`,
);
