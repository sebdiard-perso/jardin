// --- Tabs ---
const APP_TABS = ["calendrier", "planches", "jardin", "sources"];

document.getElementById("tabs").addEventListener("click", e => {
  const button = e.target.closest(".tab-btn");
  if (!button) return;
  document.querySelectorAll(".tab-btn").forEach(tabButton => tabButton.classList.remove("active"));
  button.classList.add("active");
  const tab = button.dataset.tab;
  APP_TABS.forEach(tabName => {
    document.getElementById(`tab-${tabName}`).classList.toggle("hidden", tabName !== tab);
  });
  if (tab === "planches") renderPlanches();
  if (tab === "jardin") renderJardin();
  if (tab === "sources") renderSources();
});

// --- Sliders soleil ---
const sliderMatin = document.getElementById("planche-hmatin");
const sliderAprem = document.getElementById("planche-haprem");
const valMatin = document.getElementById("hmatin-val");
const valAprem = document.getElementById("haprem-val");
const selectOrientation = document.getElementById("planche-orientation");

sliderMatin.addEventListener("input", () => { valMatin.textContent = sliderMatin.value + "h"; });
sliderAprem.addEventListener("input", () => { valAprem.textContent = sliderAprem.value + "h"; });

// Quand on change l'orientation, ajuster les sliders
selectOrientation.addEventListener("change", () => {
  const o = selectOrientation.value;
  if (o === "matin") {
    sliderAprem.value = 0; valAprem.textContent = "0h";
    if (parseInt(sliderMatin.value) < 3) { sliderMatin.value = 4; valMatin.textContent = "4h"; }
  } else if (o === "apres-midi") {
    sliderMatin.value = 0; valMatin.textContent = "0h";
    if (parseInt(sliderAprem.value) < 3) { sliderAprem.value = 4; valAprem.textContent = "4h"; }
  } else {
    if (parseInt(sliderMatin.value) === 0) { sliderMatin.value = 4; valMatin.textContent = "4h"; }
    if (parseInt(sliderAprem.value) === 0) { sliderAprem.value = 3; valAprem.textContent = "3h"; }
  }
});

// --- Init ---
initCalendrier();
initPlanches();
initSources();
initJardin();

if ("serviceWorker" in navigator) {
  const swUrl = new URL("./sw.js", document.currentScript.src);
  navigator.serviceWorker.register(swUrl).catch(error => {
    console.warn("Service worker non disponible :", error);
  });
}
