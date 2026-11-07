/* ===== WATCH HISTORY START ===== */
var CXH = (function () {
  var key = function () {
    return "cx_hist_" + CX.uid();
  };
  var H = {
    list: function () {
      return CX.read(key(), []);
    },
    enabled: function () {
      return CX.read("cx_prefs", {}).history !== false;
    },
    add: function (id, ep) {
      if (!H.enabled()) return;
      var l = H.list().filter(function (h) {
        return h.id !== id;
      });
      l.unshift({ id: id, ep: ep || 0, at: Date.now() });
      CX.write(key(), l.slice(0, 100));
    },
    remove: function (id) {
      CX.write(
        key(),
        H.list().filter(function (h) {
          return h.id !== id;
        }),
      );
      H.renderPage();
    },
    clear: function () {
      CX.write(key(), []);
      H.renderPage();
    },
    renderPage: function () {
      var el = document.getElementById("histList");
      if (!el) return;
      var l = H.list().filter(function (h) {
        return CX.get(h.id);
      });
      el.innerHTML = l
        .map(function (h) {
          var c = CX.get(h.id);
          return CX.item(
            c,
            "<div><small>" +
              new Date(h.at).toLocaleString() +
              '</small><div class="row"><a class="btn" href="' +
              CX.watchUrl(c, h.ep) +
              '">Continue Watching</a><button class="btn ghost" data-rm="' +
              c.id +
              '">Remove</button></div></div>',
            CX.watchUrl(c, h.ep),
          );
        })
        .join("");
      document.getElementById("histNone").hidden = l.length > 0;
      var cb = document.getElementById("clearHist");
      if (cb) cb.hidden = !l.length;
    },
  };
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("histList")) CX.requireLogin(H.renderPage);
    var cb = document.getElementById("clearHist");
    if (cb)
      cb.onclick = function () {
        if (confirm("Clear all watch history?")) H.clear();
      };
    var el = document.getElementById("histList");
    if (el)
      el.addEventListener("click", function (e) {
        var b = e.target.closest("[data-rm]");
        if (b) H.remove(b.dataset.rm);
      });
  });
  return H;
})();
/* ===== WATCH HISTORY END ===== */
