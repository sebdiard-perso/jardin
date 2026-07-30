// Génère les icônes PNG sans dépendances externes
// Fond blanc cassé (#f1f8e9) avec un grand "P" vert stylisé
// (les emoji ne sont pas supportés par le canvas natif Node sans lib externe)

import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function makePNG(size) {
  const pixels = new Uint8Array(size * size * 4); // RGBA

  // Couleurs
  const bg     = [241, 248, 233, 255]; // #f1f8e9 fond vert très clair
  const green  = [ 46, 125,  50, 255]; // #2e7d32 vert foncé
  const lgreen = [ 76, 175,  80, 255]; // #4caf50 vert moyen
  const white  = [255, 255, 255, 255];

  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.47; // rayon du rond

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let color;

      if (dist > r + 1) {
        // Transparent hors du cercle
        color = [0, 0, 0, 0];
      } else if (dist > r - size * 0.035) {
        // Bordure verte foncée
        color = green;
      } else {
        // Fond intérieur blanc cassé
        color = bg;

        // Dessin : tige verticale (rectangle centré)
        const stemW = size * 0.07;
        const stemTop = cy - size * 0.05;
        const stemBot = cy + size * 0.28;
        if (Math.abs(dx) < stemW / 2 && y > stemTop && y < stemBot) {
          color = green;
        }

        // Feuille gauche (ellipse inclinée)
        const lx = dx + size * 0.11;
        const ly = dy + size * 0.05;
        const leafW = size * 0.16;
        const leafH = size * 0.09;
        if ((lx * lx) / (leafW * leafW) + (ly * ly) / (leafH * leafH) < 1) {
          color = lgreen;
        }

        // Feuille droite (ellipse inclinée autre côté)
        const rx2 = dx - size * 0.11;
        const ry2 = dy + size * 0.12;
        if ((rx2 * rx2) / (leafW * leafW) + (ry2 * ry2) / (leafH * leafH) < 1) {
          color = lgreen;
        }

        // Pousse du haut (ovale)
        const tx = dx;
        const ty = dy + size * 0.18;
        const topW = size * 0.08;
        const topH = size * 0.13;
        if ((tx * tx) / (topW * topW) + (ty * ty) / (topH * topH) < 1) {
          color = green;
        }
      }

      pixels[idx]     = color[0];
      pixels[idx + 1] = color[1];
      pixels[idx + 2] = color[2];
      pixels[idx + 3] = color[3];
    }
  }

  return encodePNG(pixels, size, size);
}

function encodePNG(rgba, width, height) {
  // Raw image data avec filtre None (0) pour chaque ligne
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filtre None
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4;
      const di = y * (1 + width * 4) + 1 + x * 4;
      raw[di]     = rgba[si];
      raw[di + 1] = rgba[si + 1];
      raw[di + 2] = rgba[si + 2];
      raw[di + 3] = rgba[si + 3];
    }
  }

  const compressed = deflateSync(raw, { level: 9 });

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.concat([typeB, data]);
    const crc = crc32(crcBuf);
    const crcOut = Buffer.alloc(4);
    crcOut.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, typeB, data, crcOut]);
  }

  const IHDR_data = Buffer.alloc(13);
  IHDR_data.writeUInt32BE(width, 0);
  IHDR_data.writeUInt32BE(height, 4);
  IHDR_data[8]  = 8;  // bit depth
  IHDR_data[9]  = 6;  // RGBA
  IHDR_data[10] = 0;
  IHDR_data[11] = 0;
  IHDR_data[12] = 0;

  const sig   = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const IHDR  = chunk('IHDR', IHDR_data);
  const IDAT  = chunk('IDAT', compressed);
  const IEND  = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, IHDR, IDAT, IEND]);
}

function crc32(buf) {
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })());
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

writeFileSync('icons/icon-192.png', makePNG(192));
writeFileSync('icons/icon-512.png', makePNG(512));
writeFileSync('icons/apple-touch-icon.png', makePNG(180));
console.log('✅ Icônes générées : icon-192.png, icon-512.png, apple-touch-icon.png');
