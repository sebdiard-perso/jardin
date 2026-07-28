// --- Tabs ---
document.getElementById("tabs").addEventListener("click", e => {
  if (!e.target.classList.contains("tab-btn")) return;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  const tab = e.target.dataset.tab;
  document.getElementById("tab-calendrier").classList.toggle("hidden", tab !== "calendrier");
  document.getElementById("tab-planches").classList.toggle("hidden", tab !== "planches");
  document.getElementById("tab-sources").classList.toggle("hidden", tab !== "sources");
  if (tab === "planches") renderPlanches();
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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
