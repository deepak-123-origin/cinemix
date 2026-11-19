/* ===== NAVBAR ACCOUNT STATE START ===== */
document.addEventListener("DOMContentLoaded", function () {
  AuthService.ready.then(function () {
    var u = CX.session();
    document.body.classList.toggle("signed-in", !!u);
    document.querySelectorAll(".guest-only").forEach(function (e) {
      e.hidden = !!u;
    });
    document.querySelectorAll(".user-only").forEach(function (e) {
      e.hidden = !u;
    });
    if (u) document.getElementById("navAvatar").src = u.photo || CX.avatar;
    var btn = document.getElementById("acctBtn"),
      menu = document.getElementById("acctMenu");
    if (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
      };
      document.addEventListener("click", function (e) {
        if (!menu.contains(e.target)) menu.hidden = true;
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") menu.hidden = true;
      });
    }
    var doLogout = function () {
      CX.logout().then(function () {
        location.href = CX.home;
      });
    };
    ["logoutBtn", "logout2"].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.onclick = doLogout;
    });
    var bg = document.getElementById("burger");
    if (bg)
      bg.onclick = function () {
        document.getElementById("links").classList.toggle("open");
      };
  });
});
/* ===== NAVBAR ACCOUNT STATE END ===== */
