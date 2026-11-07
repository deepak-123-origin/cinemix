/* ===== CONTENT LOADER START =====
   Merges videos/videos.js (window.VIDEOS) and videos/episodes.js (window.EPISODE_VIDEOS) into window.CONTENT.
   A video that has "seasons" or "episodes" is detected as an episode video automatically.
   Do not add videos here. */
(function () {
  var CATS = {
    movie: "Movies",
    series: "Series",
    anime: "Anime",
    cartoon: "Cartoons",
    documentary: "Documentaries",
    short: "Short Films",
    other: "Other Videos",
  };
  function ytId(u) {
    var m = String(u || "").match(
      /(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/,
    );
    return m ? m[1] : /^[A-Za-z0-9_-]{11}$/.test(u) ? u : "";
  }
  var used = {};
  function slug(t) {
    var s =
        String(t)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "video",
      n = s,
      i = 2;
    while (used[n]) n = s + "-" + i++;
    used[n] = 1;
    return n;
  }
  /* accepts: seasons:[{name,episodes:[..]}] | seasons:[[..],[..]] | episodes:[..] (single season) */
  function seasonsOf(v) {
    var s =
      v.seasons && v.seasons.length
        ? v.seasons
        : v.episodes && v.episodes.length
          ? [{ name: "Season 1", episodes: v.episodes }]
          : null;
    if (!s) return null;
    return s
      .map(function (se, i) {
        var eps = Array.isArray(se) ? se : se.episodes || [];
        return {
          n: i + 1,
          name: (!Array.isArray(se) && se.name) || "Season " + (i + 1),
          eps: eps.map(function (e, k) {
            return {
              t: e.title || "Episode " + (k + 1),
              d: e.duration || "",
              yt: ytId(e.url),
              thumbnail: e.thumbnail || "",
              desc: e.description || "",
            };
          }),
        };
      })
      .filter(function (se) {
        return se.eps.length;
      });
  }
  window.CONTENT = (window.VIDEOS || [])
    .concat(window.EPISODE_VIDEOS || [])
    .map(function (v, i) {
      var seasons = seasonsOf(v),
        first = seasons && seasons[0] ? seasons[0].eps[0] : null;
      var yt = ytId(v.url) || (first && first.yt) || "";
      if (!yt) {
        console.warn("CINEMIX: no valid YouTube link for", v.title);
        return null;
      }
      var type = CATS[v.type] ? v.type : seasons ? "series" : "other";
      var c = {
        i: i,
        id: v.id || slug(v.title || yt),
        title: v.title || "Untitled",
        type: type,
        cat: CATS[type],
        year: v.year || "",
        genre: v.genre || "General",
        dur: v.duration || (first ? first.d : ""),
        rating: v.rating || null,
        added: v.added || "2026-01-01",
        featured: !!v.featured,
        desc: v.description || "",
        yt: yt,
        thumbnail: v.thumbnail || "",
        h: (i * 47) % 360,
      };
      if (seasons && seasons.length) {
        seasons.forEach(function (se) {
          se.eps.forEach(function (e) {
            if (!e.yt) e.yt = yt;
          });
        });
        c.seasons = seasons;
      }
      return c;
    })
    .filter(Boolean);
  window.CATEGORIES = [
    "Movies",
    "Series",
    "Anime",
    "Cartoons",
    "Documentaries",
    "Short Films",
    "Other Videos",
  ];
})();
/* ===== CONTENT LOADER END ===== */
