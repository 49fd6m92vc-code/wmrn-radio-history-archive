document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");

  if (!searchInput || !resultsContainer) return;

  fetch("/index.json")
    .then(response => response.json())
    .then(data => {
      const idx = lunr(function () {
        this.ref("uri");
        this.field("title");
        this.field("contents");
        this.field("section");

        data.forEach(doc => this.add(doc));
      });

      const params = new URLSearchParams(window.location.search);
      const query = params.get("q");

      if (!query) return;

      searchInput.value = query;

      const results = idx.search(query);

      if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      resultsContainer.innerHTML = results.map(result => {
        const item = data.find(d => d.uri === result.ref);
        return `
          <article>
            <h3><a href="${item.uri}">${item.title}</a></h3>
            <p>${item.contents.substring(0, 200)}…</p>
          </article>
        `;
      }).join("");
    });
});