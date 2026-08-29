/**
 * Transforms the Ibanez Jem GLB: rotates it upright (neck pointing up +Y),
 * centers it and normalizes the longest side to 1 so the DitheredObject
 * `scale` prop controls the final size.
 *
 * Run: node scripts/transform-guitar-glb.mjs
 */
import * as THREE from "three";
import fs from "node:fs";
import path from "node:path";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = ab;
        this.onload?.({ target: { result: ab } });
        this.onloadend?.({ target: { result: ab } });
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result =
          "data:application/octet-stream;base64," +
          Buffer.from(ab).toString("base64");
        this.onload?.({ target: { result: this.result } });
      });
    }
  };
}

const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");

const inPath = path.join(process.cwd(), "public", "models", "guitar.glb");
const buffer = fs.readFileSync(inPath);
const data = buffer.buffer.slice(
  buffer.byteOffset,
  buffer.byteOffset + buffer.byteLength,
);

const loader = new GLTFLoader();
const gltf = await loader.parseAsync(data, "");
const root = gltf.scene;

// Inspect orientation
root.updateMatrixWorld(true);
const box = new THREE.Box3().setFromObject(root);
const size = new THREE.Vector3();
box.getSize(size);
const center = new THREE.Vector3();
box.getCenter(center);
console.log("Before — size:", size.toArray().map((n) => +n.toFixed(3)), "center:", center.toArray().map((n) => +n.toFixed(3)));

// Rotate the longest horizontal axis onto +Y so the guitar stands up.
const axes = [
  { name: "X", v: size.x },
  { name: "Y", v: size.y },
  { name: "Z", v: size.z },
].sort((a, b) => b.v - a.v);
console.log("Longest axis:", axes[0].name);

if (axes[0].name === "X") {
  // X -> Y : rotate around Z by -90deg maps (x,y,z)->(y,-x,z), so +X -> -Y
  root.rotation.z = -Math.PI / 2;
} else if (axes[0].name === "Z") {
  // Z -> Y : rotate around X by +90deg maps (x,y,z)->(x,-z,y)
  root.rotation.x = Math.PI / 2;
}
// (if already Y, no rotation needed)

root.updateMatrixWorld(true);

// If the headstock ends up pointing DOWN (body at top), flip 180deg around Z.
// Heuristic: the headstock is the narrower end. We detect it by comparing the
// width (X) of the top 10% vs the bottom 10% of the bounding box after upright.
const b2 = new THREE.Box3().setFromObject(root);
const s2 = new THREE.Vector3();
b2.getSize(s2);
const c2 = new THREE.Vector3();
b2.getCenter(c2);
const topY = c2.y + s2.y / 2;
const bottomY = c2.y - s2.y / 2;

function avgWidthAt(ySlice) {
  // sample vertices within a y band and average |x|
  const posAttr = [];
  let sum = 0;
  let n = 0;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry) return;
    const pos = obj.geometry.attributes.position;
    const mat = obj.matrixWorld;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      v.applyMatrix4(mat);
      if (v.y >= ySlice) {
        sum += Math.abs(v.x);
        n++;
      }
    }
  });
  return n ? sum / n : 0;
}

const topWidth = avgWidthAt(topY - s2.y * 0.12);
const bottomWidth = avgWidthAt(bottomY + s2.y * 0.12);
console.log("top width:", +topWidth.toFixed(3), "bottom width:", +bottomWidth.toFixed(3));
if (bottomWidth > topWidth * 1.3) {
  // body (wide) is at the bottom already — headstock up. good.
  console.log("Orientation OK: headstock up.");
} else {
  // body seems at top -> flip
  console.log("Flipping 180 so headstock points up.");
  const flip = new THREE.Object3D();
  flip.rotation.z = Math.PI;
  flip.add(root);
  gltf.scene = flip;
}

gltf.scene.updateMatrixWorld(true);

// Normalize: scale longest side to 1 and center at origin
const b3 = new THREE.Box3().setFromObject(gltf.scene);
const s3 = new THREE.Vector3();
b3.getSize(s3);
const c3 = new THREE.Vector3();
b3.getCenter(c3);
const longest = Math.max(s3.x, s3.y, s3.z);
gltf.scene.scale.setScalar(1 / longest);
gltf.scene.position.sub(c3);
console.log("After — size:", s3.toArray().map((n) => +n.toFixed(3)), "longest normalized to 1.");

// Re-export as GLB
const exporter = new GLTFExporter();
const out = await new Promise((resolve, reject) => {
  exporter.parse(
    gltf.scene,
    (res) => resolve(res),
    (err) => reject(err),
    { binary: true, onlyVisible: true },
  );
});
fs.writeFileSync(inPath, Buffer.from(out));
console.log(`Wrote ${inPath} (${fs.statSync(inPath).size} bytes).`);
