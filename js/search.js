/* ===== SEARCH START (reads everything from CONTENT; no per-video edits needed) ===== */
document.addEventListener("DOMContentLoaded", function () {
  var q = document.getElementById("q");
  if (!q) return;

  var params = new URLSearchParams(location.search);
  var requestedCategory = params.get("cat") || "All";
  var cat =
    requestedCategory === "All" || CATEGORIES.indexOf(requestedCategory) > -1
      ? requestedCategory
      : "All";
  var sort = params.get("sort") === "new" ? "new" : "relevance";
  var chips = document.getElementById("chips");
  var out = document.getElementById("results");
  var none = document.getElementById("none");
  var sugg = document.getElementById("sugg");
  var clr = document.getElementById("clearQ");
  var form = document.getElementById("searchForm");
  var categoryFilter = document.getElementById("categoryFilter");
  var sortFilter = document.getElementById("sortFilter");
  var sortResults = document.getElementById("sortResults");
  var count = document.getElementById("count");
  var reset = document.getElementById("resetSearch");
  var suggestions = [];
  var activeSuggestion = -1;

  form.addEventListener("click", function (event) {
    if (event.target !== q) q.focus();
  });

  q.value = params.get("q") || "";
  sortResults.value = sort;
  chips.innerHTML = ["All"]
    .concat(CATEGORIES)
    .map(function (category) {
      return (
        '<button type="button" data-c="' +
        CX.esc(category) +
        '" aria-pressed="false">' +
        CX.esc(category) +
        "</button>"
      );
    })
    .join("");

  function haystack(content) {
    return (
      content.title +
      " " +
      content.cat +
      " " +
      content.genre +
      " " +
      content.type +
      " " +
      content.year +
      " " +
      content.desc
    ).toLowerCase();
  }

  function find() {
    var terms = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var results = CONTENT.filter(function (content) {
      return (
        (cat === "All" || content.cat === cat) &&
        terms.every(function (term) {
          return haystack(content).indexOf(term) > -1;
        })
      );
    });

    if (sort === "new") {
      results.sort(function (a, b) {
        return b.added.localeCompare(a.added) || b.i - a.i;
      });
    }

    return results;
  }

  function hideSuggestions() {
    sugg.hidden = true;
    q.setAttribute("aria-expanded", "false");
    q.removeAttribute("aria-activedescendant");
    activeSuggestion = -1;
  }

  function updateActiveSuggestion() {
    var options = sugg.querySelectorAll('[role="option"]');
    options.forEach(function (option, index) {
      var isActive = index === activeSuggestion;
      option.setAttribute("aria-selected", String(isActive));
      option.classList.toggle("act", isActive);
    });

    if (activeSuggestion > -1 && suggestions[activeSuggestion]) {
      q.setAttribute(
        "aria-activedescendant",
        "search-suggestion-" + activeSuggestion,
      );
    } else {
      q.removeAttribute("aria-activedescendant");
    }
  }

  function render() {
    var results = find();
    if (clr) clr.hidden = !q.value;
    categoryFilter.value = cat === "All" ? "" : cat;
    sortFilter.value = sort === "new" ? "new" : "";

    chips.querySelectorAll("button").forEach(function (button) {
      var isActive = button.dataset.c === cat;
      button.classList.toggle("on", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    CX.mount(out, results.map(CX.card).join(""));
    none.hidden = results.length > 0;
    count.textContent =
      results.length +
      (results.length === 1 ? " title" : " titles") +
      (cat === "All" ? "" : " in " + cat);
  }

  function suggest() {
    var value = q.value.trim().toLowerCase();
    if (!value) {
      suggestions = [];
      sugg.innerHTML = "";
      hideSuggestions();
      return;
    }

    var seen = {};
    suggestions = CONTENT.filter(function (content) {
      var title = content.title.toLowerCase();
      if (title.indexOf(value) === -1 || seen[title]) return false;
      seen[title] = true;
      return true;
    }).slice(0, 6);

    sugg.innerHTML = suggestions
      .map(function (content, index) {
        return (
          '<li id="search-suggestion-' +
          index +
          '" role="option" aria-selected="false" data-index="' +
          index +
          '"><span class="suggestion-title">' +
          CX.esc(content.title) +
          "</span><small>" +
          CX.esc(content.cat) +
          "</small></li>"
        );
      })
      .join("");
    sugg.hidden = suggestions.length === 0;
    q.setAttribute("aria-expanded", String(suggestions.length > 0));
    activeSuggestion = -1;
    updateActiveSuggestion();
  }

  function selectSuggestion(index) {
    var content = suggestions[index];
    if (!content) return;
    q.value = content.title;
    hideSuggestions();
    render();
  }

  q.addEventListener("input", function () {
    suggest();
    render();
  });

  q.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideSuggestions();
      return;
    }

    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      activeSuggestion = (activeSuggestion + 1) % suggestions.length;
      updateActiveSuggestion();
    } else if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      activeSuggestion =
        activeSuggestion <= 0 ? suggestions.length - 1 : activeSuggestion - 1;
      updateActiveSuggestion();
    } else if (
      event.key === "Enter" &&
      activeSuggestion > -1 &&
      suggestions.length
    ) {
      event.preventDefault();
      selectSuggestion(activeSuggestion);
    }
  });

  sugg.addEventListener("click", function (event) {
    var option = event.target.closest('[role="option"]');
    if (option) selectSuggestion(Number(option.dataset.index));
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".sbox")) hideSuggestions();
  });

  chips.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-c]");
    if (!button) return;
    cat = button.dataset.c;
    hideSuggestions();
    render();
  });

  sortResults.addEventListener("change", function () {
    sort = sortResults.value === "new" ? "new" : "relevance";
    render();
  });

  if (clr) {
    clr.addEventListener("click", function () {
      q.value = "";
      hideSuggestions();
      render();
      q.focus();
    });
  }

  reset.addEventListener("click", function () {
    q.value = "";
    cat = "All";
    sort = "relevance";
    sortResults.value = sort;
    hideSuggestions();
    render();
    q.focus();
  });

  form.addEventListener("submit", function () {
    hideSuggestions();
  });

  render();
  suggest();
  if (params.has("q")) {
    q.focus();
    q.setSelectionRange(q.value.length, q.value.length);
  }
});
/* ===== SEARCH END ===== */
