/* ===== PROFILE / ACCOUNT PAGE START (talks only to AuthService) ===== */
document.addEventListener("DOMContentLoaded", function () {
  CX.requireLogin(function () {
    var $ = function (s) {
        return document.getElementById(s);
      },
      f = $("profForm").elements,
      u;
    function say(id, t, ok) {
      var m = $(id);
      m.textContent = t;
      m.className = "msg " + (ok ? "ok" : "err");
    }
    function fill() {
      u = CX.session();
      $("bigAvatar").src = u.photo || CX.avatar;
      $("navAvatar").src = u.photo || CX.avatar;
      f.name.value = u.name;
      f.user.value = u.username;
      f.email.value = u.email;
      $("profileDisplayName").textContent = u.name || "My Profile";
      $("profileDisplayUsername").textContent = u.username
        ? "@" + u.username
        : "";
      $("cSaved").textContent = CXW.list().length;
      $("cHist").textContent = CXH.list().length;
      $("librarySavedCount").textContent = CXW.list().length;
      $("libraryHistoryCount").textContent = CXH.list().length;
    }
    function update(patch, id, okText) {
      AuthService.updateProfile(patch).then(function (r) {
        if (!r.ok) return say(id, r.error);
        fill();
        say(id, okText, true);
      });
    }
    $("profForm").onsubmit = function (e) {
      e.preventDefault();
      var n = f.name.value.trim(),
        un = f.user.value.trim();
      if (!n) return say("profMsg", "Name cannot be empty.");
      if (!/^[A-Za-z0-9_]{3,20}$/.test(un))
        return say(
          "profMsg",
          "Username must be 3-20 letters, numbers or underscores.",
        );
      update({ name: n, username: un }, "profMsg", "Profile updated.");
    };
    $("photoIn").onchange = function () {
      var file = this.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type))
        return say("photoMsg", "Choose an image file.");
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          var c = document.createElement("canvas"),
            s = Math.min(img.width, img.height);
          c.width = c.height = 256;
          c.getContext("2d").drawImage(
            img,
            (img.width - s) / 2,
            (img.height - s) / 2,
            s,
            s,
            0,
            0,
            256,
            256,
          );
          update(
            { photo: c.toDataURL("image/jpeg", 0.85) },
            "photoMsg",
            "Photo updated.",
          );
        };
        img.onerror = function () {
          say("photoMsg", "That image could not be read.");
        };
        img.src = r.result;
      };
      r.readAsDataURL(file);
    };
    $("photoRm").onclick = function () {
      update({ photo: "" }, "photoMsg", "Photo removed.");
    };
    $("delAcct").onclick = function () {
      if (
        !confirm(
          "Delete your account and its saved videos and history? This cannot be undone.",
        )
      )
        return;
      AuthService.deleteAccount().then(function () {
        location.href = CX.home;
      });
    };
    fill();
  });
});
/* ===== PROFILE / ACCOUNT PAGE END ===== */
