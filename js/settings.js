/* ===== SETTINGS & PREFERENCES START ===== */
document.addEventListener("DOMContentLoaded", function () {
  var el = function (id) {
    return document.getElementById(id);
  };
  if (!el("setTheme")) return;
  var p = CX.read("cx_prefs", {}),
    msg = el("setMsg");
  function save(t) {
    CX.write("cx_prefs", p);
    msg.textContent = t || "Saved.";
    msg.className = "msg ok";
  }
  el("setTheme").value = localStorage.getItem("cx_theme") || "dark";
  el("setTheme").onchange = function () {
    localStorage.setItem("cx_theme", this.value);
    document.documentElement.dataset.theme = this.value;
    save();
  };
  el("setLang").value = p.lang || "English";
  el("setLang").onchange = function () {
    p.lang = this.value;
    save("Language saved. Translations are not included in this demo.");
  };
  [
    ["nNew", "notifyNew", true],
    ["nEmail", "notifyEmail", false],
    ["pHist", "history", true],
  ].forEach(function (a) {
    var i = el(a[0]);
    i.checked = p[a[1]] === undefined ? a[2] : p[a[1]];
    i.onchange = function () {
      p[a[1]] = i.checked;
      save();
    };
  });
  el("pwForm").onsubmit = function (e) {
    e.preventDefault();
    var f = e.target.elements;
    msg.className = "msg err";
    if (!CX.session()) {
      msg.textContent = "Log in to change your password.";
      return;
    }
    if (f.new.value.length < 8) {
      msg.textContent = "New password must be at least 8 characters.";
      return;
    }
    AuthService.changePassword(f.cur.value, f.new.value).then(function (r) {
      if (!r.ok) {
        msg.textContent = r.error;
        return;
      }
      e.target.reset();
      save("Password changed.");
    });
  };
});
/* ===== SETTINGS & PREFERENCES END ===== */
