/**
 * Generates a stylized low-poly electric guitar as a GLB at /public/models/guitar.glb.
 * Self-contained (no external asset). P&B-friendly materials: the dithered
 * render reads luminance, so we use a white body, black pickguard, white strings.
 *
 * Run: node scripts/generate-guitar-glb.mjs
 */
import * as THREE from "three";
import fs from "node:fs";
import path from "node:path";

// Node 24 has no FileReader; GLTFExporter relies on it for blob reads.
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
        this.onloadend?.({ target: { result: this.result } });
      });
    }
  };
}

const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");

const group = new THREE.Group();

// ---- Materials (P&B: luminance is what the dither will read) ----
const mBody = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.55, metalness: 0.1 });
const mNeck = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 });
const mPickguard = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
const mPickup = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4 });
const mMetal = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.25, metalness: 0.7 });
const mString = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.4 });

// ---- Body (angular rock guitar), neck points up (+Y) ----
// Sharp straight edges survive dithering. Think Ibanez RG / Explorer hybrid.
const bodyShape = new THREE.Shape();
// Start bottom center (strap button)
bodyShape.moveTo(0, -0.64);
// Right lower wing
bodyShape.lineTo(0.48, -0.46);
bodyShape.lineTo(0.52, -0.12);
// Right upper wing (short horn)
bodyShape.lineTo(0.44, 0.08);
bodyShape.lineTo(0.30, 0.36);
bodyShape.lineTo(0.18, 0.38);
bodyShape.lineTo(0.06, 0.30);
// Neck joint right
bodyShape.lineTo(0.02, 0.26);
// Neck joint left
bodyShape.lineTo(-0.02, 0.26);
bodyShape.lineTo(-0.06, 0.30);
// Left upper wing (long angular horn)
bodyShape.lineTo(-0.18, 0.50);
bodyShape.lineTo(-0.38, 0.44);
bodyShape.lineTo(-0.48, 0.14);
// Left lower wing
bodyShape.lineTo(-0.46, -0.18);
bodyShape.lineTo(-0.36, -0.52);
// Back to bottom
bodyShape.lineTo(0, -0.64);
bodyShape.closePath();
const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
  depth: 0.14, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.012, bevelThickness: 0.012,
});
bodyGeo.translate(0, 0.04, -0.07);
const body = new THREE.Mesh(bodyGeo, mBody);
group.add(body);

// ---- Pickguard (angular dark plate) ----
const pickShape = new THREE.Shape();
pickShape.moveTo(-0.02, -0.34);
pickShape.lineTo(0.22, -0.28);
pickShape.lineTo(0.28, -0.02);
pickShape.lineTo(0.20, 0.22);
pickShape.lineTo(-0.04, 0.30);
pickShape.lineTo(-0.26, 0.24);
pickShape.lineTo(-0.20, -0.10);
pickShape.closePath();
const pickGeo = new THREE.ExtrudeGeometry(pickShape, { depth: 0.012, bevelEnabled: false });
pickGeo.translate(0.03, 0.02, 0.05);
const pickguard = new THREE.Mesh(pickGeo, mPickguard);
group.add(pickguard);

// ---- Pickups (3 single coils) ----
for (const py of [-0.08, 0.12, 0.32]) {
  const pu = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.075, 0.03), mPickup);
  pu.position.set(-0.02, py, 0.075);
  group.add(pu);
}

// ---- Bridge + tailpiece ----
const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.03), mMetal);
bridge.position.set(0.05, -0.28, 0.075);
group.add(bridge);
const tail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.02), mMetal);
tail.position.set(0.05, -0.42, 0.075);
group.add(tail);

// ---- Volume knobs ----
for (const kx of [-0.18, -0.12]) {
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16), mMetal);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(kx, -0.42, 0.05);
  group.add(knob);
}

// ---- Neck (from top of body up) ----
const neck = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.86, 0.07), mNeck);
neck.position.set(-0.01, 0.63, 0);
group.add(neck);

// ---- Fretboard (darker strip on top of neck) ----
const fretboard = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.015), mPickguard);
fretboard.position.set(-0.03, 0.62, 0.045);
group.add(fretboard);

// ---- Frets (thin bright bars) ----
for (let i = 1; i <= 9; i++) {
  const y = 0.32 + i * 0.085;
  const fret = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.008, 0.02), mMetal);
  fret.position.set(-0.03, y, 0.035);
  group.add(fret);
}

// ---- Headstock (wider, angled like a real Strat headstock) ----
const headShape = new THREE.Shape();
headShape.moveTo(-0.06, 0.9);
headShape.lineTo(0.05, 0.9);
headShape.lineTo(0.12, 0.97);
headShape.lineTo(0.13, 1.14);
headShape.lineTo(-0.02, 1.26);
headShape.lineTo(-0.10, 1.22);
headShape.lineTo(-0.12, 1.05);
headShape.closePath();
const headGeo = new THREE.ExtrudeGeometry(headShape, {
  depth: 0.06, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006,
});
headGeo.translate(-0.01, 0, -0.03);
const head = new THREE.Mesh(headGeo, mNeck);
group.add(head);

// ---- Tuning pegs (6) ----
for (let i = 0; i < 6; i++) {
  const y = 1.0 + i * 0.045;
  for (const side of [-1, 1]) {
    const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 12), mMetal);
    peg.rotation.z = Math.PI / 2;
    peg.position.set(side * 0.13, y, 0);
    group.add(peg);
  }
}

// ---- Strings (6 thin cylinders from bridge to headstock) ----
for (let i = 0; i < 6; i++) {
  const off = (i - 2.5) * 0.018;
  const from = new THREE.Vector3(0.05 + off * 0.4, -0.3, 0.06);
  const to = new THREE.Vector3(-0.01 + off, 1.2, 0.05);
  const len = from.distanceTo(to);
  const str = new THREE.Mesh(new THREE.CylinderGeometry(0.0032, 0.0032, len, 6), mString);
  str.position.copy(from).add(to).multiplyScalar(0.5);
  str.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  group.add(str);
}

// ---- Slight tilt so the dither reads 3D depth (neck leans toward viewer) ----
group.rotation.x = -0.32;

// ---- Normalize: center + scale longest side to 1 ----
const box = new THREE.Box3().setFromObject(group);
const size = new THREE.Vector3();
box.getSize(size);
const longest = Math.max(size.x, size.y, size.z);
group.scale.setScalar(1 / longest);
const center = new THREE.Vector3();
box.getCenter(center);
group.position.sub(center);

// ---- Export GLB ----
const exporter = new GLTFExporter();
const glb = await new Promise((resolve, reject) => {
  exporter.parse(
    group,
    (res) => resolve(res),
    (err) => reject(err),
    { binary: true, onlyVisible: true },
  );
});

const outDir = path.join(process.cwd(), "public", "models");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "guitar.glb");
fs.writeFileSync(out, Buffer.from(glb));
console.log(`Wrote ${out} (${fs.statSync(out).size} bytes). Longest side normalized to 1.0; use scale~2.3 in DitheredObject.`);
