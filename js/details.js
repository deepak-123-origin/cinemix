/* ===== DETAILS PAGES (movie / series / anime) START ===== */
document.addEventListener("DOMContentLoaded", function () {
  CX.requireLogin(function () {
    var root = document.getElementById("details");
    if (!root) return;
    var c = CX.get(new URLSearchParams(location.search).get("id"));
    if (!c) {
      root.innerHTML =
        '<div class="wrap"><p class="empty">Video not found. <a href="search.html">Browse all videos</a></p></div>';
      return;
    }
    var want = CX.detailsUrl(c);
    if (location.pathname.split("/").pop() !== want.split("?")[0]) {
      location.replace(want);
      return;
    }
    document.title = c.title + " | CINEMIX";
    var eps = CX.episodes(c),
      first = eps.length ? CX.watchUrl(c, 0) : CX.watchUrl(c);
    var badges = [
      c.year,
      c.genre,
      c.dur,
      c.rating ? "Rating " + c.rating + "/10" : "",
    ].filter(Boolean);
    if (c.seasons)
      badges.push(
        c.seasons.length + " season" + (c.seasons.length > 1 ? "s" : ""),
        eps.length + " episodes",
      );
    var heroImage = CX.thumbUrl(c).replace(/[()'"\\\s]/g, function (char) {
      return encodeURIComponent(char);
    });
    var html =
      '<section class="d-hero" style="--h:' +
      c.h +
      '"><div class="bg" style="background-image:url(' +
      heroImage +
      ')"></div><div class="wrap">' +
      '<div class="d-poster thumb" style="--h:' +
      c.h +
      '">' +
      CX.thumb(c) +
      '</div><div><span class="cat-tag">' +
      c.cat +
      "</span><h1>" +
      CX.esc(c.title) +
      "</h1>" +
      '<div class="badges">' +
      badges
        .map(function (b) {
          return "<span>" + b + "</span>";
        })
        .join("") +
      "</div><p>" +
      CX.esc(c.desc) +
      "</p>" +
      '<div class="row"><a class="btn big" href="' +
      first +
      '">Watch Now</a><button class="btn ghost save" type="button" data-id="' +
      CX.esc(c.id) +
      '" data-title="' +
      CX.esc(c.title) +
      '" aria-label="Save ' +
      CX.esc(c.title) +
      '" aria-pressed="false" title="Save ' +
      CX.esc(c.title) +
      '">' +
      CX.saveIcon +
      '<span class="save-label">Save</span></button><button class="btn ghost" id="share">Share</button></div><p class="msg" id="shareMsg" role="status"></p></div></div></section>';
    if (c.seasons)
      html +=
        '<section class="wrap"><h2>Episodes</h2><select class="seasel" id="seasel" aria-label="Select season">' +
        c.seasons
          .map(function (s) {
            return (
              '<option value="' + s.n + '">' + CX.esc(s.name) + "</option>"
            );
          })
          .join("") +
        '</select><div class="eps" id="eps"></div></section>';
    var rel = CX.shuffle(
      CONTENT.filter(function (x) {
        return x.id !== c.id && x.type === c.type;
      }),
    );
    if (rel.length < 3)
      rel = rel.concat(
        CX.shuffle(
          CONTENT.filter(function (x) {
            return x.id !== c.id && x.type !== c.type;
          }),
        ),
      );
    html +=
      '<section class="wrap"><h2>Related videos</h2><div class="grid">' +
      rel.slice(0, 3).map(CX.card).join("") +
      "</div></section>";
    CX.mount(root, html);
    function showSeason(n) {
      var offset = 0;
      c.seasons.forEach(function (s) {
        if (s.n < n) offset += s.eps.length;
      });
      CX.mount(
        document.getElementById("eps"),
        c.seasons[n - 1].eps
          .map(function (e, i) {
            return (
              '<div class="item"><a class="thumb" style="--h:' +
              c.h +
              '" href="' +
              CX.watchUrl(c, offset + i) +
              '">' +
              CX.thumb({
                title: e.t,
                yt: e.yt,
                thumbnail: e.thumbnail || c.thumbnail,
              }) +
              '</a><div><h4><span class="ep-n">E' +
              (i + 1) +
              "</span> " +
              CX.esc(e.t) +
              "</h4><small>" +
              e.d +
              '</small></div><a class="btn" href="' +
              CX.watchUrl(c, offset + i) +
              '">Watch Episode</a></div>'
            );
          })
          .join(""),
      );
    }
    if (c.seasons) {
      var sel = document.getElementById("seasel");
      sel.onchange = function () {
        showSeason(+sel.value);
      };
      showSeason(1);
    }
    if (/^https?:$/.test(location.protocol))
      (
        window.requestIdleCallback ||
        function (f) {
          setTimeout(f, 1500);
        }
      )(function () {
        var w = document.createElement("iframe");
        w.src =
          "https://www.youtube-nocookie.com/embed/" +
          c.yt +
          "?controls=0&rel=0";
        w.referrerPolicy = "strict-origin-when-cross-origin";
        w.tabIndex = -1;
        w.setAttribute("aria-hidden", "true");
        w.style.cssText =
          "position:absolute;width:1px;height:1px;border:0;opacity:0;pointer-events:none";
        document.body.appendChild(w);
      });
    document.getElementById("share").onclick = function () {
      CXShare(c, document.getElementById("shareMsg"));
    };
  });
});
/* ===== DETAILS PAGES END ===== */
