/* ===== CORE HELPERS (CX) START: URLs, storage, session, shared card rendering ===== */
var CX = (function () {
  var isRoot = document.body.dataset.root === "1";
  var pages = isRoot ? "pages/" : "";
  var AVATAR =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#272c3a"/><circle cx="32" cy="25" r="11" fill="#9aa3b5"/><path d="M10 58c2-14 12-20 22-20s20 6 22 20z" fill="#9aa3b5"/></svg>',
    );
  var X = {
    pages: pages,
    home: isRoot ? "index.html" : "../index.html",
    avatar: AVATAR,
    saveIcon:
      '<svg class="save-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.75 3.75h10.5a1.5 1.5 0 0 1 1.5 1.5V21L12 16.5 5.25 21V5.25a1.5 1.5 0 0 1 1.5-1.5Z"></path></svg>',
    esc: function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c];
      });
    },
    shuffle: function (a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)),
          t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      return a;
    },
    get: function (id) {
      return CONTENT.filter(function (c) {
        return c.id === id;
      })[0];
    },
    read: function (k, d) {
      try {
        var v = JSON.parse(localStorage.getItem(k));
        return v == null ? d : v;
      } catch (e) {
        return d;
      }
    },
    write: function (k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {
        alert("Browser storage is full or blocked.");
      }
    },
    detailsUrl: function (c) {
      return (
        pages +
        ({ series: "series-details", anime: "anime-details" }[c.type] ||
          "movie-details") +
        ".html?id=" +
        c.id
      );
    },
    watchUrl: function (c, ep) {
      return pages + "watch.html?id=" + c.id + (ep ? "&ep=" + ep : "");
    },
    episodes: function (c) {
      var o = [];
      (c.seasons || []).forEach(function (s) {
        s.eps.forEach(function (e, i) {
          o.push({
            s: s.n,
            sname: s.name,
            n: i + 1,
            t: e.t,
            d: e.d,
            yt: e.yt,
            thumbnail: e.thumbnail || c.thumbnail,
            desc: e.desc,
          });
        });
      });
      return o;
    },
    /* ---- session (delegates to AuthService in account/auth-service.js) ---- */
    account: isRoot ? "account/" : "../account/",
    session: function () {
      return AuthService.currentUser();
    },
    uid: function () {
      var s = AuthService.currentUser();
      return s ? s.id : "guest";
    },
    nextPath: function () {
      var p = location.pathname.split("/"),
        f = p.pop(),
        d = p.pop();
      return (isRoot ? "" : d + "/") + f + location.search;
    },
    loginUrl: function (tab) {
      return (
        X.account +
        "auth.html?next=" +
        encodeURIComponent(X.nextPath()) +
        "#" +
        (tab || "login")
      );
    },
    requireLogin: function (cb) {
      AuthService.ready.then(function () {
        if (!X.session()) location.replace(X.loginUrl());
        else if (cb) cb();
      });
    },
    logout: function () {
      return AuthService.logout();
    },
    /* ---- shared rendering ---- */
    thumbUrl: function (c) {
      var image = String(c.thumbnail || "").trim();
      return /^https?:\/\/\S+$/i.test(image)
        ? image
        : "https://i.ytimg.com/vi/" +
            encodeURIComponent(c.yt) +
            "/hqdefault.jpg";
    },
    thumb: function (c) {
      var fallback =
        "https://i.ytimg.com/vi/" + encodeURIComponent(c.yt) + "/hqdefault.jpg";
      return (
        '<b class="ph">' +
        X.esc(c.title) +
        '</b><img loading="lazy" alt="" src="' +
        X.esc(X.thumbUrl(c)) +
        '" data-fallback="' +
        X.esc(fallback) +
        '" onerror="if(!this.dataset.fallbackUsed){this.dataset.fallbackUsed=\'1\';this.src=this.dataset.fallback}else{this.onerror=null;this.remove()}">'
      );
    },
    card: function (c) {
      return (
        '<article class="card"><a class="thumb" style="--h:' +
        c.h +
        '" href="' +
        X.watchUrl(c) +
        '" aria-label="' +
        X.esc(c.title) +
        '">' +
        X.thumb(c) +
        '<span class="home-card-tag">' +
        X.esc(c.cat) +
        "</span>" +
        '<span class="dur">' +
        c.dur +
        "</span></a>" +
        '<div class="cbody"><span class="cat-tag">' +
        c.cat +
        '</span><h3><a href="' +
        X.watchUrl(c) +
        '">' +
        X.esc(c.title) +
        '</a></h3><small class="mobile-card-meta' +
        (c.dur ? "" : " category-meta") +
        '">' +
        X.esc(c.dur || c.cat) +
        "</small><p>" +
        X.esc(c.desc) +
        "</p>" +
        '<div class="row"><a class="btn" href="' +
        X.watchUrl(c) +
        '">Watch Now</a><a class="btn ghost details" href="' +
        X.detailsUrl(c) +
        '">Details</a><button class="btn ghost save" type="button" data-id="' +
        X.esc(c.id) +
        '" data-title="' +
        X.esc(c.title) +
        '" aria-label="Save ' +
        X.esc(c.title) +
        '" aria-pressed="false" title="Save ' +
        X.esc(c.title) +
        '">' +
        X.saveIcon +
        '<span class="save-label">Save</span></button>' +
        '<button class="btn ghost share" type="button" data-id="' +
        X.esc(c.id) +
        '" aria-label="Share ' +
        X.esc(c.title) +
        '" title="Share"><svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.1"></path></svg></button></div><p class="msg share-msg" role="status" hidden></p></div></article>'
      );
    },
    item: function (c, extra, href) {
      return (
        '<div class="item"><a class="thumb" style="--h:' +
        c.h +
        '" href="' +
        (href || X.watchUrl(c)) +
        '">' +
        X.thumb(c) +
        '</a><div><h4><a href="' +
        (href || X.watchUrl(c)) +
        '">' +
        X.esc(c.title) +
        "</a></h4><small>" +
        c.cat +
        " - " +
        c.dur +
        "</small></div>" +
        (extra || "") +
        "</div>"
      );
    },
    hrow: function (el, list) {
      CX.mount(
        el,
        list
          .map(function (c) {
            return (
              '<a class="hcard" href="' +
              X.watchUrl(c) +
              '"><span class="thumb" style="--h:' +
              c.h +
              '">' +
              X.thumb(c) +
              '<span class="dur">' +
              c.dur +
              "</span></span><b>" +
              X.esc(c.title) +
              "</b><small>" +
              c.cat +
              "</small></a>"
            );
          })
          .join(""),
      );
    },
    mount: function (el, html) {
      el.innerHTML = html;
      if (window.CXW) CXW.sync();
    },
  };
  return X;
})();
function CXShare(c, msgEl) {
  var url = CX.watchUrl(c).replace(
    /^/,
    location.href.split("?")[0].replace(/[^/]*$/, ""),
  );
  var done = function (t) {
    msgEl.textContent = t;
    msgEl.className = "msg ok";
    msgEl.hidden = false;
  };
  var copyLink = function () {
    if (navigator.clipboard)
      navigator.clipboard.writeText(url).then(
        function () {
          done("Link copied.");
        },
        function () {
          done(url);
        },
      );
    else done(url);
  };
  msgEl.textContent = "";
  msgEl.hidden = true;
  if (navigator.share) {
    navigator.share({ title: c.title, url: url }).then(
      function () {
        done("Link shared.");
      },
      function (error) {
        if (!error || error.name !== "AbortError") copyLink();
      },
    );
    return;
  }
  copyLink();
}
document.addEventListener("click", function (e) {
  var b = e.target.closest(".share[data-id]");
  if (!b) return;
  var c = CX.get(b.dataset.id),
    card = b.closest(".card"),
    msg = card && card.querySelector(".share-msg");
  if (!c || !msg) return;
  CXShare(c, msg);
});
/* ---- horizontal rows: arrow buttons scroll the row ---- */
document.addEventListener("click", function (e) {
  var b = e.target.closest(".harr");
  if (!b) return;
  var row = b.parentNode.querySelector(".hrow");
  row.scrollBy({
    left: (b.classList.contains("l") ? -1 : 1) * row.clientWidth * 0.8,
    behavior: "smooth",
  });
});
/* ---- speed: warm up the player before the click ---- */
document.addEventListener("DOMContentLoaded", function () {
  if (!/^https?:$/.test(location.protocol) || document.getElementById("stage"))
    return;
  var add = function (rel, href, as) {
    var l = document.createElement("link");
    l.rel = rel;
    l.href = href;
    if (as) l.as = as;
    document.head.appendChild(l);
  };
  [
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://i.ytimg.com",
  ].forEach(function (h) {
    add("preconnect", h);
  });
  add("preload", "https://www.youtube.com/iframe_api", "script");
  if (!sessionStorage.getItem("cx_warm") && window.CONTENT && CONTENT.length)
    (
      window.requestIdleCallback ||
      function (f) {
        setTimeout(f, 1500);
      }
    )(function () {
      sessionStorage.setItem("cx_warm", "1");
      var w = document.createElement("iframe");
      w.src =
        "https://www.youtube-nocookie.com/embed/" +
        CONTENT[0].yt +
        "?controls=0&rel=0";
      w.referrerPolicy = "strict-origin-when-cross-origin";
      w.tabIndex = -1;
      w.setAttribute("aria-hidden", "true");
      w.style.cssText =
        "position:absolute;width:1px;height:1px;border:0;opacity:0;pointer-events:none";
      document.body.appendChild(w);
    });
  var seen = {};
  document.addEventListener("pointerover", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="watch.html"]');
    if (!a || seen[a.href]) return;
    seen[a.href] = 1;
    add("prefetch", a.href);
  });
});
/* ===== CORE HELPERS (CX) END ===== */
