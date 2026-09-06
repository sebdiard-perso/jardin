const JARDIN_PLAN_KEY = "jardin-plan-v1";
const JARDIN_SNAP = 0.25;
const JARDIN_MIN_ZONE = 0.5;
const JARDIN_COLORS = ["#66bb6a", "#8d6e63", "#42a5f5", "#ffa726", "#ab47bc", "#26a69a"];

let jardinPlan = loadJardinPlan();
let jardinScale = 48;
let jardinSelectedId = null;
let jardinDrawMode = false;
let jardinInteraction = null;
let jardinPreview = null;

function defaultJardinPlan() {
  return { largeur: 10, longueur: 8, zones: [] };
}

function loadJardinPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(JARDIN_PLAN_KEY));
    if (!saved || !Array.isArray(saved.zones)) return defaultJardinPlan();
    return {
      largeur: Math.max(1, Number(saved.largeur) || 10),
      longueur: Math.max(1, Number(saved.longueur) || 8),
      zones: saved.zones.map((zone, index) => ({
        id: String(zone.id || `zone-${index}-${Date.now()}`),
        nom: String(zone.nom || `Zone ${index + 1}`),
        x: Math.max(0, Number(zone.x) || 0),
        y: Math.max(0, Number(zone.y) || 0),
        largeur: Math.max(JARDIN_MIN_ZONE, Number(zone.largeur) || 1),
        longueur: Math.max(JARDIN_MIN_ZONE, Number(zone.longueur) || 1),
        couleur: zone.couleur || JARDIN_COLORS[index % JARDIN_COLORS.length]
      }))
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

function updateJardinDrawButton() {
  const button = document.getElementById("btn-dessiner-zone");
  const canvas = document.getElementById("jardin-canvas");
  if (!button || !canvas) return;
  button.classList.toggle("active", jardinDrawMode);
  button.setAttribute("aria-pressed", String(jardinDrawMode));
  button.textContent = jardinDrawMode ? "✓ Terminer le dessin" : "✏️ Dessiner une zone";
  canvas.classList.toggle("draw-mode", jardinDrawMode);
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
  document.getElementById("jardin-zone-nom").value = zone.nom;
  document.getElementById("jardin-zone-largeur").value = zone.largeur;
  document.getElementById("jardin-zone-longueur").value = zone.longueur;
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
  const selected = zone.id === jardinSelectedId;
  const label = escapeJardinHtml(zone.nom || "Nouvelle zone");
  const dimensions = `${formatJardinMetres(zone.largeur)} × ${formatJardinMetres(zone.longueur)}`;
  return `<g class="garden-item${selected ? " selected" : ""}${preview ? " preview" : ""}" data-zone-id="${escapeJardinHtml(zone.id || "")}">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="5" fill="${escapeJardinHtml(zone.couleur || "#66bb6a")}" class="garden-zone-rect"/>
    <text x="${x + width / 2}" y="${y + height / 2 - 2}" class="garden-zone-name" text-anchor="middle">${label}</text>
    <text x="${x + width / 2}" y="${y + height / 2 + 13}" class="garden-zone-dims" text-anchor="middle">${dimensions}</text>
    ${selected && !preview ? `<rect x="${x + width - 22}" y="${y + height - 22}" width="44" height="44" rx="8" class="garden-resize-hit" data-resize="true"><title>Redimensionner</title></rect><rect x="${x + width - 8}" y="${y + height - 8}" width="16" height="16" rx="3" class="garden-resize-handle"/>` : ""}
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
    ${!jardinPlan.zones.length && !jardinPreview ? `<text x="${margin + plotWidth / 2}" y="${margin + plotHeight / 2}" class="garden-empty-label" text-anchor="middle">Dessinez une zone ou ajoutez une planche</text>` : ""}
  `;
}

function renderJardin() {
  document.getElementById("jardin-largeur").value = jardinPlan.largeur;
  document.getElementById("jardin-longueur").value = jardinPlan.longueur;
  renderJardinPlancheOptions();
  renderJardinSelection();
  updateJardinDrawButton();
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

function startJardinPointer(event) {
  const point = jardinPointFromEvent(event);
  const group = event.target.closest?.(".garden-item:not(.preview)");
  const zone = group ? jardinPlan.zones.find(item => item.id === group.dataset.zoneId) : null;

  if (zone) {
    jardinSelectedId = zone.id;
    const resize = event.target.dataset.resize === "true";
    jardinInteraction = {
      type: resize ? "resize" : "drag",
      pointerId: event.pointerId,
      start: point,
      original: { ...zone }
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    renderJardinSelection();
    renderJardinCanvas();
    setJardinStatus(resize ? "Tirez la poignée pour changer les dimensions." : "Déplacez la zone sur la grille.");
    return;
  }

  if (jardinDrawMode && isInsideJardin(point)) {
    const start = {
      x: clampJardin(snapJardin(point.x), 0, jardinPlan.largeur),
      y: clampJardin(snapJardin(point.y), 0, jardinPlan.longueur)
    };
    jardinInteraction = { type: "draw", pointerId: event.pointerId, start };
    jardinPreview = { id: "preview", nom: "Nouvelle zone", ...start, largeur: JARDIN_SNAP, longueur: JARDIN_SNAP, couleur: "#81c784" };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    renderJardinCanvas();
    return;
  }

  jardinSelectedId = null;
  renderJardinSelection();
  renderJardinCanvas();
}

function moveJardinPointer(event) {
  if (!jardinInteraction || event.pointerId !== jardinInteraction.pointerId) return;
  const point = jardinPointFromEvent(event);
  const deltaX = point.x - jardinInteraction.start.x;
  const deltaY = point.y - jardinInteraction.start.y;

  if (jardinInteraction.type === "draw") {
    const endX = clampJardin(snapJardin(point.x), 0, jardinPlan.largeur);
    const endY = clampJardin(snapJardin(point.y), 0, jardinPlan.longueur);
    const x = Math.min(jardinInteraction.start.x, endX);
    const y = Math.min(jardinInteraction.start.y, endY);
    jardinPreview = {
      id: "preview",
      nom: "Nouvelle zone",
      x,
      y,
      largeur: Math.max(JARDIN_SNAP, Math.abs(endX - jardinInteraction.start.x)),
      longueur: Math.max(JARDIN_SNAP, Math.abs(endY - jardinInteraction.start.y)),
      couleur: "#81c784"
    };
  } else {
    const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
    if (!zone) return;
    if (jardinInteraction.type === "drag") {
      zone.x = clampJardin(snapJardin(jardinInteraction.original.x + deltaX), 0, jardinPlan.largeur - zone.largeur);
      zone.y = clampJardin(snapJardin(jardinInteraction.original.y + deltaY), 0, jardinPlan.longueur - zone.longueur);
    } else {
      zone.largeur = clampJardin(snapJardin(jardinInteraction.original.largeur + deltaX), JARDIN_MIN_ZONE, jardinPlan.largeur - zone.x);
      zone.longueur = clampJardin(snapJardin(jardinInteraction.original.longueur + deltaY), JARDIN_MIN_ZONE, jardinPlan.longueur - zone.y);
    }
  }
  event.preventDefault();
  renderJardinCanvas();
}

function endJardinPointer(event) {
  if (!jardinInteraction || event.pointerId !== jardinInteraction.pointerId) return;
  if (jardinInteraction.type === "draw") {
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
      setJardinStatus(`${zone.nom} créée. Vous pouvez la renommer ou la redimensionner.`);
    } else {
      setJardinStatus("Tracez au moins 0,5 m × 0,5 m pour créer une zone.");
    }
    jardinPreview = null;
  } else {
    saveJardinPlan();
    renderJardinSelection();
    setJardinStatus("Position enregistrée.");
  }
  jardinInteraction = null;
  renderJardinCanvas();
}

function cancelJardinPointer(event) {
  if (!jardinInteraction || event.pointerId !== jardinInteraction.pointerId) return;
  if (jardinInteraction.type === "draw") {
    jardinPreview = null;
  } else {
    const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
    if (zone) Object.assign(zone, jardinInteraction.original);
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
  jardinPlan.zones.forEach(zone => {
    zone.largeur = Math.min(zone.largeur, jardinPlan.largeur);
    zone.longueur = Math.min(zone.longueur, jardinPlan.longueur);
    zone.x = clampJardin(zone.x, 0, jardinPlan.largeur - zone.largeur);
    zone.y = clampJardin(zone.y, 0, jardinPlan.longueur - zone.longueur);
  });
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
    x: clampJardin(snapJardin(offset), 0, jardinPlan.largeur - largeur),
    y: clampJardin(snapJardin(offset), 0, jardinPlan.longueur - longueur),
    largeur,
    longueur,
    couleur: JARDIN_COLORS[jardinPlan.zones.length % JARDIN_COLORS.length]
  };
  jardinPlan.zones.push(zone);
  jardinSelectedId = zone.id;
  saveJardinPlan();
  renderJardinSelection();
  renderJardinCanvas();
  setJardinStatus(`${zone.nom} ajoutée à ses dimensions exactes. Faites-la glisser pour la placer.`);
}

function applyJardinZone() {
  const zone = jardinPlan.zones.find(item => item.id === jardinSelectedId);
  if (!zone) return;
  zone.nom = document.getElementById("jardin-zone-nom").value.trim() || zone.nom;
  const largeur = Math.round((Number(document.getElementById("jardin-zone-largeur").value) || zone.largeur) * 100) / 100;
  const longueur = Math.round((Number(document.getElementById("jardin-zone-longueur").value) || zone.longueur) * 100) / 100;
  zone.largeur = clampJardin(largeur, JARDIN_MIN_ZONE, jardinPlan.largeur - zone.x);
  zone.longueur = clampJardin(longueur, JARDIN_MIN_ZONE, jardinPlan.longueur - zone.y);
  zone.couleur = document.getElementById("jardin-zone-couleur").value;
  saveJardinPlan();
  renderJardinSelection();
  renderJardinCanvas();
  setJardinStatus("Zone mise à jour.");
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
  const step = event.shiftKey ? 1 : JARDIN_SNAP;
  let handled = true;
  if (event.key === "ArrowLeft") zone.x = clampJardin(zone.x - step, 0, jardinPlan.largeur - zone.largeur);
  else if (event.key === "ArrowRight") zone.x = clampJardin(zone.x + step, 0, jardinPlan.largeur - zone.largeur);
  else if (event.key === "ArrowUp") zone.y = clampJardin(zone.y - step, 0, jardinPlan.longueur - zone.longueur);
  else if (event.key === "ArrowDown") zone.y = clampJardin(zone.y + step, 0, jardinPlan.longueur - zone.longueur);
  else handled = false;
  if (!handled) return;
  event.preventDefault();
  saveJardinPlan();
  renderJardinCanvas();
}

function initJardin() {
  const svg = document.getElementById("jardin-canvas");
  document.getElementById("btn-appliquer-jardin").addEventListener("click", applyJardinDimensions);
  document.getElementById("btn-ajouter-planche-jardin").addEventListener("click", addPlancheToJardin);
  document.getElementById("btn-appliquer-zone").addEventListener("click", applyJardinZone);
  document.getElementById("btn-supprimer-zone").addEventListener("click", deleteJardinZone);
  document.getElementById("btn-dessiner-zone").addEventListener("click", () => {
    jardinDrawMode = !jardinDrawMode;
    updateJardinDrawButton();
    setJardinStatus(jardinDrawMode ? "Glissez sur le quadrillage pour dessiner une zone." : "Mode dessin terminé. Touchez une zone pour la modifier.");
  });
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
