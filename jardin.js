const JARDIN_PLAN_KEY = "jardin-plan-v1";
const JARDIN_SNAP = 0.25;
const JARDIN_MIN_ZONE = 0.5;
const JARDIN_MIN_FREE_ZONE = 0.1;
const JARDIN_FREE_POINT_STEP = 0.05;
const JARDIN_COLORS = ["#66bb6a", "#8d6e63", "#42a5f5", "#ffa726", "#ab47bc", "#26a69a"];

let jardinPlan = loadJardinPlan();
let jardinScale = 48;
let jardinSelectedId = null;
let jardinDrawMode = null;
let jardinInteraction = null;
let jardinPreview = null;

function defaultJardinPlan() {
  return { largeur: 10, longueur: 8, zones: [] };
}

function normalizeJardinRotation(value) {
  return ((Math.round(Number(value) || 0) % 360) + 360) % 360;
}

function roundJardin(value, decimals = 3) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function cloneJardinZone(zone) {
  return {
    ...zone,
    points: Array.isArray(zone.points) ? zone.points.map(point => ({ ...point })) : undefined
  };
}

function loadJardinPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(JARDIN_PLAN_KEY));
    if (!saved || !Array.isArray(saved.zones)) return defaultJardinPlan();
    return {
      largeur: Math.max(1, Number(saved.largeur) || 10),
      longueur: Math.max(1, Number(saved.longueur) || 8),
      zones: saved.zones.map((savedZone, index) => {
        const points = Array.isArray(savedZone.points)
          ? savedZone.points
              .map(point => ({ x: Number(point.x), y: Number(point.y) }))
              .filter(point => Number.isFinite(point.x) && Number.isFinite(point.y))
          : [];
        const type = savedZone.type === "libre" && points.length >= 3 ? "libre" : "rectangle";
        return {
          id: String(savedZone.id || `zone-${index}-${Date.now()}`),
          nom: String(savedZone.nom || `Zone ${index + 1}`),
          type,
          x: Math.max(0, Number(savedZone.x) || 0),
          y: Math.max(0, Number(savedZone.y) || 0),
          largeur: Math.max(type === "libre" ? JARDIN_MIN_FREE_ZONE : JARDIN_MIN_ZONE, Number(savedZone.largeur) || 1),
          longueur: Math.max(type === "libre" ? JARDIN_MIN_FREE_ZONE : JARDIN_MIN_ZONE, Number(savedZone.longueur) || 1),
          rotation: normalizeJardinRotation(savedZone.rotation),
          couleur: savedZone.couleur || JARDIN_COLORS[index % JARDIN_COLORS.length],
          ...(type === "libre" ? { points } : {})
        };
      })
    };
  } catch (_) {
    return defaultJardinPlan();
  }
}

function saveJardinPlan() {
  localStorage.setItem(JARDIN_PLAN_KEY, JSON.stringify(jardinPlan));
}

function newJardinId() {
  return globalThis.crypto?.randomUUID?.() || `zone-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeJardinHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function snapJardin(value) {
  return Math.round(value / JARDIN_SNAP) * JARDIN_SNAP;
}

function clampJardin(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function formatJardinMetres(value) {
  return Number(value.toFixed(2)).toLocaleString("fr-FR") + " m";
}

function setJardinStatus(message) {
  const status = document.getElementById("jardin-status");
  if (status) status.textContent = message;
}

function setJardinDrawMode(mode) {
  jardinDrawMode = jardinDrawMode === mode ? null : mode;
  updateJardinDrawButtons();
  if (jardinDrawMode === "rectangle") {
    setJardinStatus("Glissez sur le quadrillage pour dessiner une zone rectangulaire.");
  } else if (jardinDrawMode === "libre") {
    setJardinStatus("Dessinez le contour de la zone au doigt ou à la souris, puis relâchez pour le fermer.");
  } else {
    setJardinStatus("Mode dessin terminé. Touchez une zone pour la déplacer, la tourner ou la modifier.");
  }
}

function updateJardinDrawButtons() {
  const rectangleButton = document.getElementById("btn-dessiner-zone");
  const freeButton = document.getElementById("btn-dessiner-libre");
  const canvas = document.getElementById("jardin-canvas");
  if (!rectangleButton || !freeButton || !canvas) return;
  rectangleButton.classList.toggle("active", jardinDrawMode === "rectangle");
  rectangleButton.setAttribute("aria-pressed", String(jardinDrawMode === "rectangle"));
  rectangleButton.textContent = jardinDrawMode === "rectangle" ? "✓ Rectangle actif" : "▭ Rectangle";
  freeButton.classList.toggle("active", jardinDrawMode === "libre");
  freeButton.setAttribute("aria-pressed", String(jardinDrawMode === "libre"));
  freeButton.textContent = jardinDrawMode === "libre" ? "✓ Tracé libre actif" : "✍️ Forme libre";
  canvas.classList.toggle("draw-mode", Boolean(jardinDrawMode));
  canvas.classList.toggle("free-draw-mode", jardinDrawMode === "libre");
}

function renderJardinPlancheOptions() {
  const select = document.getElementById("jardin-planche-select");
  const addButton = document.getElementById("btn-ajouter-planche-jardin");
  if (!select || !addButton) return;
  const planchesDisponibles = typeof mesPlanches !== "undefined" ? mesPlanches : [];
  if (!planchesDisponibles.length) {
    select.innerHTML = '<option value="">Créez d’abord une planche</option>';
    select.disabled = true;
    addButton.disabled = true;
    return;
  }
  select.disabled = false;
  addButton.disabled = false;
  select.innerHTML = planchesDisponibles.map((planche, index) =>
    `<option value="${index}">${escapeJardinHtml(planche.nom)} — ${formatJardinMetres(Number(planche.longueur))} × ${formatJardinMetres(Number(planche.largeur))}</option>`
  ).join("");
}

function renderJardinSelection() {
  const editor = document.getElementById("jardin-zone-editor");
  const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
  if (!editor) return;
  if (!zone) {
    editor.classList.add("hidden");
    return;
  }
  editor.classList.remove("hidden");
  document.getElementById("jardin-zone-type").textContent = zone.type === "libre" ? "Forme libre" : "Rectangle";
  document.getElementById("jardin-zone-nom").value = zone.nom;
  document.getElementById("jardin-zone-largeur").value = roundJardin(zone.largeur, 2);
  document.getElementById("jardin-zone-longueur").value = roundJardin(zone.longueur, 2);
  document.getElementById("jardin-zone-rotation").value = normalizeJardinRotation(zone.rotation);
  document.getElementById("jardin-zone-couleur").value = zone.couleur;
}

function gardenGridLines(margin, plotWidth, plotHeight) {
  const lines = [];
  const xSteps = Math.round(jardinPlan.largeur / JARDIN_SNAP);
  const ySteps = Math.round(jardinPlan.longueur / JARDIN_SNAP);
  for (let step = 0; step <= xSteps; step++) {
    const x = margin + step * JARDIN_SNAP * jardinScale;
    const major = step % 4 === 0;
    lines.push(`<line x1="${x}" y1="${margin}" x2="${x}" y2="${margin + plotHeight}" class="${major ? "grid-major" : "grid-minor"}"/>`);
  }
  for (let step = 0; step <= ySteps; step++) {
    const y = margin + step * JARDIN_SNAP * jardinScale;
    const major = step % 4 === 0;
    lines.push(`<line x1="${margin}" y1="${y}" x2="${margin + plotWidth}" y2="${y}" class="${major ? "grid-major" : "grid-minor"}"/>`);
  }
  return lines.join("");
}

function gardenRulers(margin, plotWidth, plotHeight) {
  const marks = [
    `<rect x="${margin}" y="0" width="${plotWidth}" height="${margin}" class="garden-ruler-bg"/>`,
    `<rect x="0" y="${margin}" width="${margin}" height="${plotHeight}" class="garden-ruler-bg"/>`
  ];
  const xSteps = Math.round(jardinPlan.largeur / JARDIN_SNAP);
  const ySteps = Math.round(jardinPlan.longueur / JARDIN_SNAP);
  for (let step = 0; step <= xSteps; step++) {
    const value = step * JARDIN_SNAP;
    const x = margin + value * jardinScale;
    const major = step % 4 === 0;
    marks.push(`<line x1="${x}" y1="${margin}" x2="${x}" y2="${margin - (major ? 14 : 7)}" class="garden-ruler-tick"/>`);
    if (major) marks.push(`<text x="${x}" y="17" class="garden-ruler-label" text-anchor="middle">${value} m</text>`);
  }
  for (let step = 0; step <= ySteps; step++) {
    const value = step * JARDIN_SNAP;
    const y = margin + value * jardinScale;
    const major = step % 4 === 0;
    marks.push(`<line x1="${margin}" y1="${y}" x2="${margin - (major ? 14 : 7)}" y2="${y}" class="garden-ruler-tick"/>`);
    if (major) marks.push(`<text x="${margin - 17}" y="${y + 3}" class="garden-ruler-label" text-anchor="middle">${value}</text>`);
  }
  return marks.join("");
}

function gardenZoneMarkup(zone, margin, preview = false) {
  const x = margin + zone.x * jardinScale;
  const y = margin + zone.y * jardinScale;
  const width = zone.largeur * jardinScale;
  const height = zone.longueur * jardinScale;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const rotation = normalizeJardinRotation(zone.rotation);
  const selected = zone.id === jardinSelectedId;
  const label = escapeJardinHtml(zone.nom || "Nouvelle zone");
  const dimensions = `${formatJardinMetres(zone.largeur)} × ${formatJardinMetres(zone.longueur)}${rotation ? ` · ${rotation}°` : ""}`;
  const shape = zone.type === "libre" && Array.isArray(zone.points)
    ? `<polygon points="${zone.points.map(point => `${x + point.x * jardinScale},${y + point.y * jardinScale}`).join(" ")}" fill="${escapeJardinHtml(zone.couleur || "#66bb6a")}" class="garden-zone-shape garden-zone-free"/>`
    : `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="5" fill="${escapeJardinHtml(zone.couleur || "#66bb6a")}" class="garden-zone-shape garden-zone-rect"/>`;
  const resizeControls = selected && !preview ? `<rect x="${x + width - 22}" y="${y + height - 22}" width="44" height="44" rx="8" class="garden-resize-hit" data-resize="true"><title>Redimensionner</title></rect><rect x="${x + width - 8}" y="${y + height - 8}" width="16" height="16" rx="3" class="garden-resize-handle"/>` : "";
  const rotateControls = selected && !preview ? `<line x1="${centerX}" y1="${y}" x2="${centerX}" y2="${y - 28}" class="garden-rotate-stem"/><circle cx="${centerX}" cy="${y - 30}" r="22" class="garden-rotate-hit" data-rotate="true"><title>Tourner librement</title></circle><circle cx="${centerX}" cy="${y - 30}" r="9" class="garden-rotate-handle"/><path d="M ${centerX - 4} ${y - 32} A 5 5 0 1 1 ${centerX + 4} ${y - 27}" class="garden-rotate-icon"/>` : "";
  return `<g class="garden-item${selected ? " selected" : ""}${preview ? " preview" : ""}" data-zone-id="${escapeJardinHtml(zone.id || "")}" transform="rotate(${rotation} ${centerX} ${centerY})">
    ${shape}
    <text x="${centerX}" y="${centerY - 2}" class="garden-zone-name" text-anchor="middle">${label}</text>
    <text x="${centerX}" y="${centerY + 13}" class="garden-zone-dims" text-anchor="middle">${dimensions}</text>
    ${resizeControls}
    ${rotateControls}
    <title>${label} — ${dimensions}</title>
  </g>`;
}

function renderJardinCanvas() {
  const svg = document.getElementById("jardin-canvas");
  if (!svg) return;
  const margin = 46;
  const endMargin = 14;
  const plotWidth = jardinPlan.largeur * jardinScale;
  const plotHeight = jardinPlan.longueur * jardinScale;
  const svgWidth = margin + plotWidth + endMargin;
  const svgHeight = margin + plotHeight + endMargin;
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);
  svg.innerHTML = `
    <rect width="${svgWidth}" height="${svgHeight}" class="garden-canvas-bg"/>
    ${gardenRulers(margin, plotWidth, plotHeight)}
    <rect x="${margin}" y="${margin}" width="${plotWidth}" height="${plotHeight}" class="garden-ground"/>
    ${gardenGridLines(margin, plotWidth, plotHeight)}
    ${jardinPlan.zones.map(zone => gardenZoneMarkup(zone, margin)).join("")}
    ${jardinPreview ? gardenZoneMarkup(jardinPreview, margin, true) : ""}
    ${!jardinPlan.zones.length && !jardinPreview ? `<text x="${margin + plotWidth / 2}" y="${margin + plotHeight / 2}" class="garden-empty-label" text-anchor="middle">Dessinez un rectangle, une forme libre ou ajoutez une planche</text>` : ""}
  `;
}

function renderJardin() {
  document.getElementById("jardin-largeur").value = jardinPlan.largeur;
  document.getElementById("jardin-longueur").value = jardinPlan.longueur;
  renderJardinPlancheOptions();
  renderJardinSelection();
  updateJardinDrawButtons();
  renderJardinCanvas();
}

function jardinPointFromEvent(event) {
  const svg = document.getElementById("jardin-canvas");
  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const svgX = (event.clientX - rect.left) * viewBox.width / rect.width;
  const svgY = (event.clientY - rect.top) * viewBox.height / rect.height;
  return {
    x: (svgX - 46) / jardinScale,
    y: (svgY - 46) / jardinScale
  };
}

function isInsideJardin(point) {
  return point.x >= 0 && point.y >= 0 && point.x <= jardinPlan.largeur && point.y <= jardinPlan.longueur;
}

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return pointDistance(point, start);
  const t = clampJardin(((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy), 0, 1);
  return pointDistance(point, { x: start.x + t * dx, y: start.y + t * dy });
}

function simplifyFreePoints(points, tolerance = 0.04) {
  if (points.length <= 2) return points;
  let maxDistance = 0;
  let splitIndex = 0;
  for (let index = 1; index < points.length - 1; index++) {
    const distance = distanceToSegment(points[index], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      splitIndex = index;
    }
  }
  if (maxDistance <= tolerance) return [points[0], points[points.length - 1]];
  const left = simplifyFreePoints(points.slice(0, splitIndex + 1), tolerance);
  const right = simplifyFreePoints(points.slice(splitIndex), tolerance);
  return [...left.slice(0, -1), ...right];
}

function buildFreeJardinZone(points, preview = false) {
  if (points.length < 2) return null;
  const minX = Math.min(...points.map(point => point.x));
  const minY = Math.min(...points.map(point => point.y));
  const maxX = Math.max(...points.map(point => point.x));
  const maxY = Math.max(...points.map(point => point.y));
  return {
    id: preview ? "preview" : newJardinId(),
    nom: preview ? "Contour libre" : `Zone ${jardinPlan.zones.length + 1}`,
    type: "libre",
    x: roundJardin(minX),
    y: roundJardin(minY),
    largeur: Math.max(JARDIN_MIN_FREE_ZONE, roundJardin(maxX - minX)),
    longueur: Math.max(JARDIN_MIN_FREE_ZONE, roundJardin(maxY - minY)),
    rotation: 0,
    couleur: preview ? "#81c784" : JARDIN_COLORS[jardinPlan.zones.length % JARDIN_COLORS.length],
    points: points.map(point => ({ x: roundJardin(point.x - minX), y: roundJardin(point.y - minY) }))
  };
}

function polygonJardinArea(points) {
  if (points.length < 3) return 0;
  return Math.abs(points.reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];
    return area + point.x * next.y - next.x * point.y;
  }, 0)) / 2;
}

function resizeJardinZoneFromOriginal(zone, original, largeur, longueur) {
  zone.largeur = largeur;
  zone.longueur = longueur;
  if (zone.type === "libre" && Array.isArray(original.points)) {
    const scaleX = largeur / Math.max(original.largeur, JARDIN_MIN_FREE_ZONE);
    const scaleY = longueur / Math.max(original.longueur, JARDIN_MIN_FREE_ZONE);
    zone.points = original.points.map(point => ({
      x: roundJardin(point.x * scaleX),
      y: roundJardin(point.y * scaleY)
    }));
  }
}

function rotatedJardinExtents(largeur, longueur, rotation) {
  const radians = normalizeJardinRotation(rotation) * Math.PI / 180;
  return {
    x: Math.abs(Math.cos(radians)) * largeur / 2 + Math.abs(Math.sin(radians)) * longueur / 2,
    y: Math.abs(Math.sin(radians)) * largeur / 2 + Math.abs(Math.cos(radians)) * longueur / 2
  };
}

function canJardinZoneFit(largeur, longueur, rotation) {
  const extents = rotatedJardinExtents(largeur, longueur, rotation);
  return extents.x * 2 <= jardinPlan.largeur + 0.0001 && extents.y * 2 <= jardinPlan.longueur + 0.0001;
}

function constrainJardinZone(zone) {
  const extents = rotatedJardinExtents(zone.largeur, zone.longueur, zone.rotation);
  if (extents.x * 2 > jardinPlan.largeur + 0.0001 || extents.y * 2 > jardinPlan.longueur + 0.0001) return false;
  const centerX = clampJardin(zone.x + zone.largeur / 2, extents.x, jardinPlan.largeur - extents.x);
  const centerY = clampJardin(zone.y + zone.longueur / 2, extents.y, jardinPlan.longueur - extents.y);
  zone.x = roundJardin(centerX - zone.largeur / 2);
  zone.y = roundJardin(centerY - zone.longueur / 2);
  return true;
}

function resizeJardinZoneFromCorner(zone, original, largeur, longueur) {
  const radians = normalizeJardinRotation(original.rotation) * Math.PI / 180;
  const originalCenter = {
    x: original.x + original.largeur / 2,
    y: original.y + original.longueur / 2
  };
  const anchor = {
    x: originalCenter.x - Math.cos(radians) * original.largeur / 2 + Math.sin(radians) * original.longueur / 2,
    y: originalCenter.y - Math.sin(radians) * original.largeur / 2 - Math.cos(radians) * original.longueur / 2
  };
  const applyAnchoredSize = (target, width, height) => {
    resizeJardinZoneFromOriginal(target, original, width, height);
    const centerX = anchor.x + Math.cos(radians) * width / 2 - Math.sin(radians) * height / 2;
    const centerY = anchor.y + Math.sin(radians) * width / 2 + Math.cos(radians) * height / 2;
    target.x = centerX - width / 2;
    target.y = centerY - height / 2;
  };
  const isInside = target => {
    const extents = rotatedJardinExtents(target.largeur, target.longueur, target.rotation);
    const centerX = target.x + target.largeur / 2;
    const centerY = target.y + target.longueur / 2;
    return centerX - extents.x >= -0.0001 && centerY - extents.y >= -0.0001
      && centerX + extents.x <= jardinPlan.largeur + 0.0001
      && centerY + extents.y <= jardinPlan.longueur + 0.0001;
  };

  const candidate = cloneJardinZone(original);
  applyAnchoredSize(candidate, largeur, longueur);
  let ratio = 1;
  if (!isInside(candidate)) {
    let low = 0;
    let high = 1;
    for (let iteration = 0; iteration < 24; iteration++) {
      const middle = (low + high) / 2;
      const test = cloneJardinZone(original);
      applyAnchoredSize(
        test,
        original.largeur + (largeur - original.largeur) * middle,
        original.longueur + (longueur - original.longueur) * middle
      );
      if (isInside(test)) low = middle;
      else high = middle;
    }
    ratio = low;
  }
  const finalWidth = original.largeur + (largeur - original.largeur) * ratio;
  const finalHeight = original.longueur + (longueur - original.longueur) * ratio;
  applyAnchoredSize(zone, finalWidth, finalHeight);
  return ratio > 0.0001;
}

function fitJardinZoneToGarden(zone) {
  const original = cloneJardinZone(zone);
  const extents = rotatedJardinExtents(zone.largeur, zone.longueur, zone.rotation);
  const scale = Math.min(1, jardinPlan.largeur / Math.max(extents.x * 2, 0.0001), jardinPlan.longueur / Math.max(extents.y * 2, 0.0001));
  if (scale < 1) {
    const safeScale = scale * 0.999;
    resizeJardinZoneFromOriginal(zone, original, roundJardin(zone.largeur * safeScale), roundJardin(zone.longueur * safeScale));
  }
  constrainJardinZone(zone);
}

function startJardinPointer(event) {
  const point = jardinPointFromEvent(event);
  const group = event.target.closest?.(".garden-item:not(.preview)");
  const zone = group ? jardinPlan.zones.find(item => item.id === group.dataset.zoneId) : null;

  if (zone) {
    jardinSelectedId = zone.id;
    const original = cloneJardinZone(zone);
    let type = "drag";
    if (event.target.dataset.rotate === "true") type = "rotate";
    else if (event.target.dataset.resize === "true") type = "resize";
    const center = { x: zone.x + zone.largeur / 2, y: zone.y + zone.longueur / 2 };
    jardinInteraction = {
      type,
      pointerId: event.pointerId,
      start: point,
      original,
      center,
      startAngle: Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    renderJardinSelection();
    renderJardinCanvas();
    const messages = {
      drag: "Déplacez librement la zone sur le terrain.",
      resize: "Tirez la poignée carrée pour changer les dimensions.",
      rotate: "Tirez la poignée ronde pour mettre la zone en biais."
    };
    setJardinStatus(messages[type]);
    return;
  }

  if (jardinDrawMode === "rectangle" && isInsideJardin(point)) {
    const start = {
      x: clampJardin(snapJardin(point.x), 0, jardinPlan.largeur),
      y: clampJardin(snapJardin(point.y), 0, jardinPlan.longueur)
    };
    jardinInteraction = { type: "draw-rectangle", pointerId: event.pointerId, start };
    jardinPreview = { id: "preview", nom: "Nouvelle zone", type: "rectangle", ...start, largeur: JARDIN_SNAP, longueur: JARDIN_SNAP, rotation: 0, couleur: "#81c784" };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    renderJardinCanvas();
    return;
  }

  if (jardinDrawMode === "libre" && isInsideJardin(point)) {
    const start = {
      x: clampJardin(roundJardin(point.x), 0, jardinPlan.largeur),
      y: clampJardin(roundJardin(point.y), 0, jardinPlan.longueur)
    };
    jardinInteraction = { type: "draw-free", pointerId: event.pointerId, points: [start] };
    jardinPreview = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    return;
  }

  jardinSelectedId = null;
  renderJardinSelection();
  renderJardinCanvas();
}

function moveJardinPointer(event) {
  if (!jardinInteraction || event.pointerId !== jardinInteraction.pointerId) return;
  const point = jardinPointFromEvent(event);

  if (jardinInteraction.type === "draw-rectangle") {
    const endX = clampJardin(snapJardin(point.x), 0, jardinPlan.largeur);
    const endY = clampJardin(snapJardin(point.y), 0, jardinPlan.longueur);
    const x = Math.min(jardinInteraction.start.x, endX);
    const y = Math.min(jardinInteraction.start.y, endY);
    jardinPreview = {
      id: "preview",
      nom: "Nouvelle zone",
      type: "rectangle",
      x,
      y,
      largeur: Math.max(JARDIN_SNAP, Math.abs(endX - jardinInteraction.start.x)),
      longueur: Math.max(JARDIN_SNAP, Math.abs(endY - jardinInteraction.start.y)),
      rotation: 0,
      couleur: "#81c784"
    };
  } else if (jardinInteraction.type === "draw-free") {
    const nextPoint = {
      x: clampJardin(roundJardin(point.x), 0, jardinPlan.largeur),
      y: clampJardin(roundJardin(point.y), 0, jardinPlan.longueur)
    };
    const points = jardinInteraction.points;
    if (pointDistance(points[points.length - 1], nextPoint) >= JARDIN_FREE_POINT_STEP) {
      points.push(nextPoint);
      jardinPreview = buildFreeJardinZone(points, true);
    }
  } else {
    const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
    if (!zone) return;
    const deltaX = point.x - jardinInteraction.start.x;
    const deltaY = point.y - jardinInteraction.start.y;
    if (jardinInteraction.type === "drag") {
      zone.x = roundJardin(jardinInteraction.original.x + deltaX);
      zone.y = roundJardin(jardinInteraction.original.y + deltaY);
      constrainJardinZone(zone);
    } else if (jardinInteraction.type === "resize") {
      const radians = normalizeJardinRotation(jardinInteraction.original.rotation) * Math.PI / 180;
      const localDeltaX = deltaX * Math.cos(radians) + deltaY * Math.sin(radians);
      const localDeltaY = -deltaX * Math.sin(radians) + deltaY * Math.cos(radians);
      const minSize = zone.type === "libre" ? JARDIN_MIN_FREE_ZONE : JARDIN_MIN_ZONE;
      const largeur = Math.max(minSize, roundJardin(jardinInteraction.original.largeur + localDeltaX, 2));
      const longueur = Math.max(minSize, roundJardin(jardinInteraction.original.longueur + localDeltaY, 2));
      resizeJardinZoneFromCorner(zone, jardinInteraction.original, largeur, longueur);
    } else if (jardinInteraction.type === "rotate") {
      const currentAngle = Math.atan2(point.y - jardinInteraction.center.y, point.x - jardinInteraction.center.x) * 180 / Math.PI;
      const previous = cloneJardinZone(zone);
      zone.rotation = normalizeJardinRotation(jardinInteraction.original.rotation + currentAngle - jardinInteraction.startAngle);
      if (!constrainJardinZone(zone)) Object.assign(zone, previous);
    }
  }
  event.preventDefault();
  renderJardinCanvas();
}

function endJardinPointer(event) {
  if (!jardinInteraction || event.pointerId !== jardinInteraction.pointerId) return;
  if (jardinInteraction.type === "draw-rectangle") {
    if (jardinPreview && jardinPreview.largeur >= JARDIN_MIN_ZONE && jardinPreview.longueur >= JARDIN_MIN_ZONE) {
      const zoneNumber = jardinPlan.zones.length + 1;
      const zone = {
        ...jardinPreview,
        id: newJardinId(),
        nom: `Zone ${zoneNumber}`,
        couleur: JARDIN_COLORS[(zoneNumber - 1) % JARDIN_COLORS.length]
      };
      jardinPlan.zones.push(zone);
      jardinSelectedId = zone.id;
      saveJardinPlan();
      setJardinStatus(`${zone.nom} créée. Utilisez la poignée ronde pour l’orienter librement.`);
    } else {
      setJardinStatus("Tracez au moins 0,5 m × 0,5 m pour créer une zone.");
    }
    jardinPreview = null;
  } else if (jardinInteraction.type === "draw-free") {
    const rawPoints = jardinInteraction.points;
    const endPoint = jardinPointFromEvent(event);
    if (isInsideJardin(endPoint) && pointDistance(rawPoints[rawPoints.length - 1], endPoint) >= JARDIN_FREE_POINT_STEP) {
      rawPoints.push({ x: roundJardin(endPoint.x), y: roundJardin(endPoint.y) });
    }
    const points = simplifyFreePoints(rawPoints);
    const zone = buildFreeJardinZone(points);
    if (zone && points.length >= 3 && polygonJardinArea(zone.points) >= 0.04) {
      jardinPlan.zones.push(zone);
      jardinSelectedId = zone.id;
      saveJardinPlan();
      setJardinStatus(`${zone.nom} créée avec un contour libre. Elle peut aussi être tournée et redimensionnée.`);
    } else {
      setJardinStatus("Le contour est trop petit. Tracez une boucle plus large avant de relâcher.");
    }
    jardinPreview = null;
  } else {
    saveJardinPlan();
    renderJardinSelection();
    setJardinStatus(jardinInteraction.type === "rotate" ? "Angle enregistré." : "Position et forme enregistrées.");
  }
  jardinInteraction = null;
  renderJardinSelection();
  renderJardinCanvas();
}

function cancelJardinPointer(event) {
  if (!jardinInteraction || event.pointerId !== jardinInteraction.pointerId) return;
  if (jardinInteraction.type.startsWith("draw-")) {
    jardinPreview = null;
  } else {
    const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
    if (zone) Object.assign(zone, cloneJardinZone(jardinInteraction.original));
  }
  jardinInteraction = null;
  renderJardinSelection();
  renderJardinCanvas();
  setJardinStatus("Geste annulé, aucune modification enregistrée.");
}

function applyJardinDimensions() {
  const largeur = clampJardin(Number(document.getElementById("jardin-largeur").value) || 10, 1, 50);
  const longueur = clampJardin(Number(document.getElementById("jardin-longueur").value) || 8, 1, 50);
  jardinPlan.largeur = snapJardin(largeur);
  jardinPlan.longueur = snapJardin(longueur);
  jardinPlan.zones.forEach(zone => fitJardinZoneToGarden(zone));
  saveJardinPlan();
  renderJardin();
  setJardinStatus("Dimensions du terrain enregistrées.");
}

function addPlancheToJardin() {
  const index = Number(document.getElementById("jardin-planche-select").value);
  const planchesDisponibles = typeof mesPlanches !== "undefined" ? mesPlanches : [];
  const planche = planchesDisponibles[index];
  if (!planche) return;
  const largeur = Math.max(JARDIN_MIN_ZONE, Number(planche.largeur) || 1);
  const longueur = Math.max(JARDIN_MIN_ZONE, Number(planche.longueur) || 1);
  if (largeur > jardinPlan.largeur || longueur > jardinPlan.longueur) {
    setJardinStatus(`« ${planche.nom} » mesure ${formatJardinMetres(largeur)} × ${formatJardinMetres(longueur)}. Agrandissez d’abord le terrain pour conserver son échelle.`);
    return;
  }
  const offset = jardinPlan.zones.length * JARDIN_SNAP;
  const zone = {
    id: newJardinId(),
    nom: planche.nom,
    type: "rectangle",
    x: clampJardin(snapJardin(offset), 0, jardinPlan.largeur - largeur),
    y: clampJardin(snapJardin(offset), 0, jardinPlan.longueur - longueur),
    largeur,
    longueur,
    rotation: 0,
    couleur: JARDIN_COLORS[jardinPlan.zones.length % JARDIN_COLORS.length]
  };
  jardinPlan.zones.push(zone);
  jardinSelectedId = zone.id;
  saveJardinPlan();
  renderJardinSelection();
  renderJardinCanvas();
  setJardinStatus(`${zone.nom} ajoutée à ses dimensions exactes. Placez-la puis utilisez la poignée ronde pour l’orienter.`);
}

function applyJardinZone() {
  const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
  if (!zone) return;
  const original = cloneJardinZone(zone);
  const candidate = cloneJardinZone(zone);
  candidate.nom = document.getElementById("jardin-zone-nom").value.trim() || zone.nom;
  const minSize = zone.type === "libre" ? JARDIN_MIN_FREE_ZONE : JARDIN_MIN_ZONE;
  const largeur = Math.max(minSize, Math.round((Number(document.getElementById("jardin-zone-largeur").value) || zone.largeur) * 100) / 100);
  const longueur = Math.max(minSize, Math.round((Number(document.getElementById("jardin-zone-longueur").value) || zone.longueur) * 100) / 100);
  resizeJardinZoneFromOriginal(candidate, original, largeur, longueur);
  candidate.rotation = normalizeJardinRotation(document.getElementById("jardin-zone-rotation").value);
  candidate.couleur = document.getElementById("jardin-zone-couleur").value;
  if (!canJardinZoneFit(candidate.largeur, candidate.longueur, candidate.rotation)) {
    renderJardinSelection();
    setJardinStatus("Ces dimensions ne tiennent pas dans le terrain avec cet angle.");
    return;
  }
  constrainJardinZone(candidate);
  Object.assign(zone, candidate);
  saveJardinPlan();
  renderJardinSelection();
  renderJardinCanvas();
  setJardinStatus("Zone mise à jour.");
}

function rotateSelectedJardinZone(delta) {
  const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
  if (!zone) return;
  const previous = cloneJardinZone(zone);
  zone.rotation = normalizeJardinRotation(zone.rotation + delta);
  if (!constrainJardinZone(zone)) {
    Object.assign(zone, previous);
    setJardinStatus("La zone est trop grande pour tenir dans le terrain avec cet angle.");
    return;
  }
  saveJardinPlan();
  renderJardinSelection();
  renderJardinCanvas();
  setJardinStatus(`Angle réglé à ${zone.rotation}°.`);
}

function deleteJardinZone() {
  const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
  if (!zone || !confirm(`Supprimer « ${zone.nom} » du plan ?`)) return;
  jardinPlan.zones = jardinPlan.zones.filter(item => item.id !== jardinSelectedId);
  jardinSelectedId = null;
  saveJardinPlan();
  renderJardinSelection();
  renderJardinCanvas();
  setJardinStatus("Zone supprimée du plan.");
}

function moveSelectedJardinZone(event) {
  const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
  if (!zone) return;
  const previous = cloneJardinZone(zone);
  const step = event.shiftKey ? 1 : JARDIN_SNAP;
  let handled = true;
  if (event.key === "ArrowLeft") zone.x -= step;
  else if (event.key === "ArrowRight") zone.x += step;
  else if (event.key === "ArrowUp") zone.y -= step;
  else if (event.key === "ArrowDown") zone.y += step;
  else if (event.key === "[") zone.rotation = normalizeJardinRotation(zone.rotation - 5);
  else if (event.key === "]") zone.rotation = normalizeJardinRotation(zone.rotation + 5);
  else handled = false;
  if (!handled) return;
  event.preventDefault();
  if (!constrainJardinZone(zone)) {
    Object.assign(zone, previous);
    return;
  }
  saveJardinPlan();
  renderJardinSelection();
  renderJardinCanvas();
}

function initJardin() {
  const svg = document.getElementById("jardin-canvas");
  jardinPlan.zones.forEach(zone => fitJardinZoneToGarden(zone));
  saveJardinPlan();
  document.getElementById("btn-appliquer-jardin").addEventListener("click", applyJardinDimensions);
  document.getElementById("btn-ajouter-planche-jardin").addEventListener("click", addPlancheToJardin);
  document.getElementById("btn-appliquer-zone").addEventListener("click", applyJardinZone);
  document.getElementById("btn-supprimer-zone").addEventListener("click", deleteJardinZone);
  document.getElementById("btn-dessiner-zone").addEventListener("click", () => setJardinDrawMode("rectangle"));
  document.getElementById("btn-dessiner-libre").addEventListener("click", () => setJardinDrawMode("libre"));
  document.getElementById("btn-zone-rotation-moins").addEventListener("click", () => rotateSelectedJardinZone(-5));
  document.getElementById("btn-zone-rotation-plus").addEventListener("click", () => rotateSelectedJardinZone(5));
  document.getElementById("btn-jardin-zoom-moins").addEventListener("click", () => {
    jardinScale = Math.max(28, jardinScale - 8);
    renderJardinCanvas();
  });
  document.getElementById("btn-jardin-zoom-plus").addEventListener("click", () => {
    jardinScale = Math.min(80, jardinScale + 8);
    renderJardinCanvas();
  });
  svg.addEventListener("pointerdown", startJardinPointer);
  svg.addEventListener("pointermove", moveJardinPointer);
  svg.addEventListener("pointerup", endJardinPointer);
  svg.addEventListener("pointercancel", cancelJardinPointer);
  svg.addEventListener("keydown", moveSelectedJardinZone);
  renderJardin();
}
