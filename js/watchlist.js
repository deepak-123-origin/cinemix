/* ===== WATCHLIST / SAVED VIDEOS START ===== */
var CXW = (function () {
  var key = function () {
    return "cx_saved_" + CX.uid();
  };
  var W = {
    list: function () {
      return CX.read(key(), []);
    },
    has: function (id) {
      return W.list().indexOf(id) > -1;
    },
    toggle: function (id) {
      if (!CX.session()) {
        location.href = CX.loginUrl();
        return;
      }
      var l = W.list(),
        i = l.indexOf(id);
      if (i > -1) l.splice(i, 1);
      else l.unshift(id);
      CX.write(key(), l);
      W.sync();
      document.dispatchEvent(new Event("cx:saved"));
    },
    sync: function () {
      document.querySelectorAll(".save[data-id]").forEach(function (b) {
        var on = W.has(b.dataset.id),
          title = b.dataset.title || "video";
        var label = b.querySelector(".save-label");
        if (label) label.textContent = on ? "Saved" : "Save";
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on);
        b.setAttribute(
          "aria-label",
          (on ? "Remove " : "Save ") + title + (on ? " from saved videos" : ""),
        );
        b.title =
          (on ? "Remove " : "Save ") + title + (on ? " from saved videos" : "");
      });
    },
    renderPage: function () {
      var g = document.getElementById("savedGrid");
      if (!g) return;
      var items = W.list().map(CX.get).filter(Boolean);
      CX.mount(g, items.map(CX.card).join(""));
      document.getElementById("savedNone").hidden = items.length > 0;
    },
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".save[data-id]");
    if (b) W.toggle(b.dataset.id);
  });
  document.addEventListener("DOMContentLoaded", function () {
    W.sync();
    if (document.getElementById("savedGrid")) CX.requireLogin(W.renderPage);
  });
  document.addEventListener("cx:saved", W.renderPage);
  return W;
})();
/* ===== WATCHLIST / SAVED VIDEOS END ===== */
