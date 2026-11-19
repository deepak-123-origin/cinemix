/* ===== SHARED NAVIGATION START ===== */
(function () {
  var root = document.body.dataset.root === "1";
  var pageBase = root ? "pages/" : "";
  var footerPageBase = root
    ? "pages/"
    : /\/account\//i.test(location.pathname)
      ? "../pages/"
      : "";
  var homeHref = root ? "index.html" : "../index.html";

  function addFooterLinks() {
    var columns = document.querySelectorAll(".foot .foot-cols > div");
    var linksByHeading = {
      Information: [
        ["DMCA & Copyright Complaints", "copyright.html#dmca"],
      ],
      Support: [
        ["Report a Problem", "contact.html#report"],
        ["Request Content", "contact.html#request"],
        ["Accessibility Statement", "accessibility.html"],
      ],
      Legal: [["Content Policy", "community-guidelines.html#content-policy"]],
    };

    columns.forEach(function (column) {
      var heading = column.querySelector("h4");
      var links = heading && linksByHeading[heading.textContent.trim()];
      if (!links) return;

      links.forEach(function (item) {
        var exists = Array.from(column.querySelectorAll("a")).some(
          function (link) {
            return link.textContent.trim() === item[0];
          },
        );
        if (exists) return;

        var link = document.createElement("a");
        link.href = footerPageBase + item[1];
        link.textContent = item[0];
        column.appendChild(link);
      });
    });
  }

  function normalizeHeader() {
    var header = document.querySelector("header.nav");
    var nav = header && header.querySelector("#links");
    var inner = header && header.querySelector(".nav-in");
    if (!header || !nav || !inner) return;
    if (!window.matchMedia("(min-width: 1280px)").matches) {
      setActiveLink(nav);
      return;
    }

    var logo = inner.querySelector(":scope > .logo");
    if (logo && !logo.querySelector(".home-logo-mark")) {
      logo.innerHTML =
        '<span class="home-logo-mark" aria-hidden="true">C</span><span class="home-logo-word">CINE<span>MIX</span></span>';
    }

    var allLinks = Array.from(nav.querySelectorAll(":scope > a"));
    var homeLink = allLinks.find(function (link) {
      return link.textContent.trim().toLowerCase() === "home";
    });
    var searchLink = allLinks.find(function (link) {
      return link.classList.contains("nav-search");
    });
    var searchPageLink = allLinks.find(function (link) {
      return /search\.html/i.test(link.getAttribute("href") || "");
    });
    var searchHref = searchLink
      ? searchLink.getAttribute("href")
      : searchPageLink
        ? searchPageLink.getAttribute("href")
        : pageBase + "search.html";
    var searchPath = searchHref.split(/[?#]/)[0];

    var account = nav.querySelector(":scope > .acct.user-only");
    var savedLink =
      account && account.querySelector('.menu a[href*="saved-videos"]');
    var savedHref = savedLink && savedLink.getAttribute("href");
    var guestLinks = allLinks.filter(function (link) {
      return link.classList.contains("guest-only");
    });
    var labels = ["Movies", "Anime", "Cartoons", "Series", "Documentaries"];
    var categoryLinks = labels.map(function (label) {
      var link = allLinks.find(function (candidate) {
        var target = candidate.getAttribute("href") || "";
        var targetCategory = new URL(target, location.href).searchParams.get(
          "cat",
        );
        return (
          candidate.textContent.trim().toLowerCase() === label.toLowerCase() ||
          (targetCategory &&
            targetCategory.toLowerCase() === label.toLowerCase())
        );
      });

      if (!link) link = document.createElement("a");
      link.textContent = label;
      link.setAttribute(
        "href",
        searchPath + "?cat=" + encodeURIComponent(label),
      );
      link.classList.remove("nav-search", "btn", "ghost", "guest-only");
      return link;
    });

    if (!homeLink) {
      homeLink = document.createElement("a");
      homeLink.textContent = "Home";
    }
    homeLink.href = homeHref;
    homeLink.classList.remove("nav-search", "btn", "ghost", "guest-only");

    nav.replaceChildren(homeLink, ...categoryLinks);

    var controls = inner.querySelector(":scope > .home-nav-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "home-nav-controls";

      var form = document.createElement("form");
      form.className = "home-search";
      form.action = searchPath;
      form.method = "get";
      form.setAttribute("role", "search");
      form.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg><input type="search" name="q" placeholder="Search movies, series..." aria-label="Search movies and series" autocomplete="off">';
      controls.appendChild(form);

      var watchlist = document.createElement("a");
      watchlist.className = "home-watchlist-link";
      watchlist.href = savedHref || pageBase + "saved-videos.html";
      watchlist.setAttribute("aria-label", "Saved videos");
      watchlist.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.75L6 21z"></path></svg><span id="watchlistBadge">0</span>';
      controls.appendChild(watchlist);
      inner.appendChild(controls);
    }

    var guestActions = controls.querySelector(".home-auth-actions");
    if (!guestActions && guestLinks.length) {
      guestActions = document.createElement("div");
      guestActions.className = "home-auth-actions guest-only";
      guestLinks.forEach(function (link, index) {
        link.classList.remove("guest-only");
        link.classList.toggle("ghost", index === 0);
        guestActions.appendChild(link);
      });
      controls.appendChild(guestActions);
    }

    if (account && !controls.contains(account)) controls.appendChild(account);
    if (guestActions && guestActions.children.length === 0) {
      guestActions.remove();
    }

    setActiveLink(nav);
  }

  function setActiveLink(nav) {
    var path = location.pathname.replace(/\\/g, "/").toLowerCase();
    var file = path.slice(path.lastIndexOf("/") + 1);
    var category = new URLSearchParams(location.search).get("cat");
    var currentLabel = null;

    if (file === "index.html" || !file) currentLabel = "home";
    else if (file === "search.html" && category)
      currentLabel = category.toLowerCase();
    else if (file === "movie-details.html") currentLabel = "movies";
    else if (file === "anime-details.html") currentLabel = "anime";
    else if (file === "series-details.html") currentLabel = "series";

    nav.querySelectorAll(":scope > a").forEach(function (link) {
      var active = link.textContent.trim().toLowerCase() === currentLabel;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link || link.parentElement !== nav) return;
      nav.querySelectorAll(":scope > a").forEach(function (item) {
        item.removeAttribute("aria-current");
      });
      link.setAttribute("aria-current", "page");
    });
  }

  addFooterLinks();
  normalizeHeader();
})();
/* ===== SHARED NAVIGATION END ===== */
