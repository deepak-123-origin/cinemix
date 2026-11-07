/* ===== HOMEPAGE INTERACTIONS START ===== */
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (id) {
    return document.getElementById(id);
  };
  if (!$("featGrid") || !CONTENT.length) return;

  var homeSearch = document.querySelector(".home-search");
  if (homeSearch) {
    var homeSearchInput = homeSearch.querySelector('input[name="q"]');
    var searchTimer;

    homeSearch.addEventListener("click", function (event) {
      if (event.target !== homeSearchInput) homeSearchInput.focus();
    });

    homeSearchInput.addEventListener("input", function () {
      window.clearTimeout(searchTimer);
      var query = homeSearchInput.value.trim();
      if (!query) return;

      searchTimer = window.setTimeout(function () {
        window.location.href =
          homeSearch.action + "?q=" + encodeURIComponent(query);
      }, 250);
    });

    homeSearch.addEventListener("submit", function (event) {
      window.clearTimeout(searchTimer);
      if (!homeSearchInput.value.trim()) {
        event.preventDefault();
        homeSearchInput.focus();
      }
    });

    homeSearchInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        window.clearTimeout(searchTimer);
        homeSearchInput.value = "";
      }
    });
  }

  var count = function (type) {
    return CONTENT.filter(function (c) {
      return c.type === type;
    }).length;
  };
  var episodes = CONTENT.reduce(function (total, c) {
    return total + CX.episodes(c).length;
  }, 0);
  $("stats").innerHTML = [
    ["Total Movies", count("movie")],
    ["Total Series", count("series")],
    ["Total Anime", count("anime")],
    ["Total Videos", CONTENT.length + episodes],
  ]
    .map(function (item) {
      return (
        '<div class="stat"><b>' +
        item[1] +
        "</b><span>" +
        item[0] +
        "</span></div>"
      );
    })
    .join("");

  var categories = [
    { name: "All", icon: "" },
    {
      name: "Movies",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h4v5H4zm6 0h4v5h-4zm6 0h4v5h-4zM3 10h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm3 2v7h2v-7zm5 0v7h2v-7zm5 0v7h2v-7z"/></svg>',
    },
    {
      name: "Anime",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5c4-2 8-2 12 0l4 4-2 2-3-2-2 3 3 2-2 4H8l-1-4 3-2-2-3-3 2-3-2zm3 1 2 2 1-3zm9 0-3-1 1 3zM8 16h8l1-2H7z"/></svg>',
    },
    {
      name: "Cartoons",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-3 7a1.4 1.4 0 1 1 0 2.8A1.4 1.4 0 0 1 9 10m6 0a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8m-7 5h8a4.5 4.5 0 0 1-8 0"/></svg>',
    },
    {
      name: "Series",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18v14H3zm2 2v10h14V6zm4 14h6v2H9z"/></svg>',
    },
    {
      name: "Documentaries",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m7.9 9h-3a15 15 0 0 0-1.2-6 8.03 8.03 0 0 1 4.2 6M12 4c1 1.4 1.8 4 2 7h-4c.2-3 1-5.6 2-7m-3.7 1a15 15 0 0 0-1.2 6h-3a8.03 8.03 0 0 1 4.2-6M4.1 13h3a15 15 0 0 0 1.2 6 8.03 8.03 0 0 1-4.2-6m7.9 7c-1-1.4-1.8-4-2-7h4c-.2 3-1 5.6-2 7m3.7-1a15 15 0 0 0 1.2-6h3a8.03 8.03 0 0 1-4.2 6"/></svg>',
    },
  ];
  $("cats").innerHTML = categories
    .map(function (category) {
      return (
        '<a class="cat" data-category="' +
        category.name +
        '" href="pages/search.html' +
        (category.name === "All"
          ? ""
          : "?cat=" + encodeURIComponent(category.name)) +
        '"><span class="cat-mark">' +
        category.icon +
        '</span><span class="cat-name">' +
        category.name +
        "</span></a>"
      );
    })
    .join("");

  var find = function (text) {
    var title = text.toLowerCase();
    return (
      CONTENT.filter(function (c) {
        return c.title.toLowerCase() === title;
      })[0] ||
      CONTENT.filter(function (c) {
        return c.title.toLowerCase().indexOf(title) > -1;
      })[0]
    );
  };
  var oggy3 = find("Oggy and the Cockroaches - Episode 3");
  var newOggy = find("New Born of Oggy and the Cockroaches");
  var doraemon = find(
    "Doraemon Movie - Nobita's Great Adventure in Antarctica",
  );
  var oggy1 = find("Oggy and the Cockroaches - Episode 1");
  var kingdom = find("Paper Kingdoms");
  var undersea = find("Doraemon Movie - Castle of the Undersea Devil");
  var crimson = find("Crimson Alley");
  var lighthouse = find("The Last Lighthouse");
  var neon = find("Neon Harbor");
  var oggy2 = find("Oggy and the Cockroaches - Episode 2");
  var curated = function (items, fallback, limit) {
    var unique = [];
    items.forEach(function (item) {
      if (item && unique.indexOf(item) < 0) unique.push(item);
    });
    fallback.forEach(function (item) {
      if (unique.length < limit && unique.indexOf(item) < 0) unique.push(item);
    });
    return unique.slice(0, limit);
  };

  var imageFor = function (c) {
    var custom = String(c.thumbnail || "").trim();
    return /^https?:\/\/\S+$/i.test(custom)
      ? custom
      : "https://i.ytimg.com/vi/" + encodeURIComponent(c.yt) + "/hqdefault.jpg";
  };
  var thumbnail = function (c) {
    var fallback =
      "https://i.ytimg.com/vi/" + encodeURIComponent(c.yt) + "/hqdefault.jpg";
    var src = imageFor(c);
    return (
      '<b class="ph">' +
      CX.esc(c.title) +
      '</b><img loading="lazy" alt="" src="' +
      CX.esc(src) +
      '" data-fallback="' +
      CX.esc(fallback) +
      '" onerror="if(!this.dataset.fallbackUsed){this.dataset.fallbackUsed=\'1\';this.src=this.dataset.fallback}else{this.onerror=null;this.remove()}">'
    );
  };
  var card = function (c) {
    var watch = CX.watchUrl(c),
      safeTitle = CX.esc(c.title),
      safeDescription = CX.esc(c.desc);
    return (
      '<article class="card"><a class="thumb" style="--h:' +
      c.h +
      '" href="' +
      watch +
      '" aria-label="' +
      safeTitle +
      '">' +
      thumbnail(c) +
      '<span class="dur">' +
      CX.esc(c.dur) +
      "</span></a>" +
      '<div class="cbody"><h3><a href="' +
      watch +
      '">' +
      safeTitle +
      '</a></h3><small class="mobile-card-meta' +
      (c.dur ? "" : " category-meta") +
      '">' +
      CX.esc(c.dur || "") +
      "</small><p>" +
      safeDescription +
      "</p>" +
      '<div class="row"><a class="btn" href="' +
      watch +
      '">▶ &nbsp;Watch Now</a><a class="btn ghost details" href="' +
      CX.detailsUrl(c) +
      '">Details</a>' +
      '<button class="btn ghost save" type="button" data-id="' +
      CX.esc(c.id) +
      '" data-title="' +
      safeTitle +
      '" aria-label="Save ' +
      safeTitle +
      '" aria-pressed="false" title="Save ' +
      safeTitle +
      '">' +
      CX.saveIcon +
      '<span class="save-label">Save</span></button>' +
      '<button class="btn ghost share" type="button" data-id="' +
      CX.esc(c.id) +
      '" aria-label="Share ' +
      safeTitle +
      '" title="Share"><svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.1"></path></svg></button></div><p class="msg share-msg" role="status" hidden></p></div></article>'
    );
  };
  var item = function (c, withPlay) {
    var play = withPlay
      ? '<a class="btn" href="' + CX.watchUrl(c) + '">Play</a>'
      : "";
    return (
      '<div class="item"><a class="thumb" style="--h:' +
      c.h +
      '" href="' +
      CX.watchUrl(c) +
      '">' +
      thumbnail(c) +
      "</a>" +
      '<div><h4><a href="' +
      CX.watchUrl(c) +
      '">' +
      CX.esc(c.title) +
      "</a></h4><small>" +
      CX.esc(c.cat + (c.dur ? " • " + c.dur : "")) +
      "</small></div>" +
      play +
      "</div>"
    );
  };

  var spotlightList = curated([kingdom, neon, lighthouse, crimson], CONTENT, 4);
  var spotlightIndex = Math.max(0, spotlightList.indexOf(kingdom));
  var hero = $("heroFeat");
  function showHero(c) {
    if (!c) return;
    hero.href = CX.watchUrl(c);
    hero.setAttribute("aria-label", "Watch " + c.title);
    hero.innerHTML =
      thumbnail(c) +
      '<span class="cap"><span class="spotlight-meta"><strong>' +
      CX.esc(c.cat) +
      "</strong><span>" +
      CX.esc(c.genre) +
      (c.dur ? " · " + CX.esc(c.dur) : "") +
      "</span><em>♥ 98% Match</em></span>" +
      "<b>" +
      CX.esc(c.title) +
      '</b><span class="spotlight-description">' +
      CX.esc(
        c.desc || "Discover your next favorite from the CINEMIX library.",
      ) +
      "</span></span>";
    var badge = document.createElement("div");
    badge.className = "home-spotlight-badges";
    badge.innerHTML = "<span>4K UHD</span><span>ATMOS</span>";
    hero.parentNode
      .querySelectorAll(
        ".home-spotlight-badges,.home-spotlight-actions,.home-spotlight-dots",
      )
      .forEach(function (node) {
        node.remove();
      });
    hero.parentNode.appendChild(badge);
    var actions = document.createElement("div");
    actions.className = "home-spotlight-actions";
    actions.innerHTML =
      '<a href="' +
      CX.watchUrl(c) +
      '">▶ &nbsp;Watch Now</a><a href="' +
      CX.detailsUrl(c) +
      '">ⓘ &nbsp;Explore</a>';
    hero.parentNode.appendChild(actions);
    var dots = document.createElement("div");
    dots.className = "home-spotlight-dots";
    dots.innerHTML = spotlightList
      .map(function (_, i) {
        return (
          '<button type="button" aria-label="Show featured title ' +
          (i + 1) +
          '" class="' +
          (i === spotlightIndex ? "active" : "") +
          '" data-index="' +
          i +
          '"></button>'
        );
      })
      .join("");
    hero.parentNode.appendChild(dots);
  }
  showHero(spotlightList[spotlightIndex]);
  $("heroFeat").parentNode.addEventListener("click", function (event) {
    var dot = event.target.closest(".home-spotlight-dots button");
    if (!dot) return;
    spotlightIndex = Number(dot.dataset.index);
    showHero(spotlightList[spotlightIndex]);
  });
  var featured = curated(
    [oggy3, newOggy, doraemon, oggy1, kingdom, undersea],
    CONTENT,
    6,
  );
  CX.mount($("featGrid"), featured.map(card).join(""));

  var popular = curated(
    [
      oggy3,
      doraemon,
      kingdom,
      crimson,
      lighthouse,
      neon,
      oggy2,
      newOggy,
      undersea,
    ],
    CONTENT,
    10,
  );
  $("trendingRow").innerHTML = popular
    .map(function (c, index) {
      return (
        '<a class="trend-card" href="' +
        CX.watchUrl(c) +
        '"><span class="trend-rank">' +
        (index + 1) +
        '</span><span class="trend-poster thumb">' +
        thumbnail(c) +
        '<span class="trend-copy"><small>' +
        CX.esc(c.cat) +
        "</small><b>" +
        CX.esc(c.title) +
        "</b></span></span></a>"
      );
    })
    .join("");

  var hubPicks = curated([oggy3, crimson, lighthouse, neon], CONTENT, 50);
  $("exploreList").innerHTML = hubPicks
    .map(function (c) {
      return item(c, true);
    })
    .join("");

  var posters = curated([lighthouse, neon, oggy2, crimson, oggy1], CONTENT, 50);
  $("posterGrid").innerHTML = posters
    .map(function (c) {
      var fallback =
        "https://i.ytimg.com/vi/" + encodeURIComponent(c.yt) + "/hqdefault.jpg";
      return (
        '<a class="poster-card" href="' +
        CX.watchUrl(c) +
        '"><img loading="lazy" src="' +
        CX.esc(imageFor(c)) +
        '" data-fallback="' +
        CX.esc(fallback) +
        '" onerror="if(!this.dataset.fallbackUsed){this.dataset.fallbackUsed=\'1\';this.src=this.dataset.fallback}else{this.onerror=null;this.remove()}" alt="' +
        CX.esc(c.title) +
        '">' +
        '<span class="poster-tag">' +
        CX.esc(c.cat) +
        '</span><span class="poster-play"><span>▶</span></span>' +
        '<span class="poster-copy"><b>' +
        CX.esc(c.title) +
        "</b><small>" +
        CX.esc(c.cat) +
        "</small></span></a>"
      );
    })
    .join("");

  function recent() {
    var list = CXH.list()
      .map(function (entry) {
        var c = CX.get(entry.id);
        return c ? { content: c, episode: entry.ep } : null;
      })
      .filter(Boolean)
      .slice(0, 2);
    $("recentWatched").innerHTML = list.length
      ? list
          .map(function (entry) {
            var c = entry.content,
              url = CX.watchUrl(c, entry.episode);
            return (
              '<div class="item"><a class="thumb" href="' +
              url +
              '">' +
              thumbnail(c) +
              '</a><div><h4><a href="' +
              url +
              '">' +
              CX.esc(c.title) +
              "</a></h4><small>" +
              CX.esc(c.cat + (c.dur ? " • " + c.dur : "")) +
              "</small></div></div>"
            );
          })
          .join("")
      : '<p class="empty">Videos you watch will show up here.</p>';
  }
  recent();

  var added = curated(
    [undersea, find("Doraemon Movie - Nobita The Explorer Bow! Bow!")],
    CONTENT.slice().sort(function (a, b) {
      return b.added.localeCompare(a.added) || b.i - a.i;
    }),
    3,
  );
  $("recentAdded").innerHTML = added
    .map(function (c) {
      return item(c, false);
    })
    .join("");

  var badgeClasses = {
    "": "",
    "teal-badge": "teal-badge",
    "green-badge": "green-badge",
  };
  var upcoming = (window.UPCOMING_RELEASES || []).filter(function (release) {
    return (
      release &&
      release.title &&
      release.image &&
      /^https?:\/\/\S+$/i.test(release.image)
    );
  });
  $("upcomingGrid").innerHTML = upcoming.length
    ? upcoming
        .map(function (release) {
          var badgeClass = badgeClasses[release.badgeClass] || "";
          return (
            '<article class="upcoming-card"><div class="upcoming-art"><img src="' +
            CX.esc(release.image) +
            '" alt="' +
            CX.esc(release.imageAlt || release.title) +
            '" loading="lazy" onerror="this.remove()"><span>' +
            CX.esc(release.release || "COMING SOON") +
            '</span><b class="' +
            badgeClass +
            '">' +
            CX.esc(release.badge || "Coming Soon") +
            '</b></div><div class="upcoming-copy"><small>' +
            CX.esc(release.meta || "") +
            "</small><h3>" +
            CX.esc(release.title) +
            "</h3><p>" +
            CX.esc(release.description || "") +
            '</p><button type="button" class="remind-button"><span>♧</span> Remind Me</button></div></article>'
          );
        })
        .join("")
    : '<p class="empty">No upcoming releases have been added yet.</p>';

  var watchlistBadge = $("watchlistBadge");
  function updateWatchlistBadge() {
    watchlistBadge.textContent = CXW.list().length;
  }
  updateWatchlistBadge();
  document.addEventListener("cx:saved", updateWatchlistBadge);
  document.addEventListener("click", function (event) {
    var remind = event.target.closest(".remind-button");
    if (remind) {
      var active = remind.classList.toggle("is-set");
      remind.innerHTML = active
        ? "✓ &nbsp; Reminder Set"
        : "♧ &nbsp; Remind Me";
    }
  });
});
/* ===== HOMEPAGE INTERACTIONS END ===== */
