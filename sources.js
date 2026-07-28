function renderSources() {
  const list = document.getElementById("sources-list");
  list.innerHTML = `
    <header class="sources-header">
      <h2>📚 Sources scientifiques</h2>
      <p>Publications évaluées par les pairs reliées aux pratiques proposées. Les résultats dépendent du sol, du climat et du système de culture.</p>
    </header>
    <div class="sources-cards">
      ${SOURCES_SCIENTIFIQUES.map(source => `
        <article class="source-card">
          <span class="source-practice">${source.pratique}</span>
          <h3>${source.titre}</h3>
          <p class="source-citation">${source.auteurs} (${source.annee}). <em>${source.revue}</em>.</p>
          <a class="source-doi" href="${source.doi}" target="_blank" rel="noopener noreferrer">Lire l'article via DOI ↗</a>
          <p><strong>Résultat :</strong> ${source.resultat}</p>
          <p class="source-limit"><strong>À nuancer :</strong> ${source.limite}</p>
        </article>
      `).join("")}
    </div>`;
}

function initSources() {
  renderSources();
}
