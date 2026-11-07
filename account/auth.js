/* ===== LOGIN & SIGNUP UI START (talks only to AuthService) ===== */
(function () {
  var $ = function (s) {
    return document.querySelector(s);
  };
  var L = $("#loginForm"),
    S = $("#signupForm");
  var nextRaw = new URLSearchParams(location.search).get("next") || "";
  /* only allow our own pages as redirect target (blocks open-redirect tricks) */
  var okNext =
    /^(index\.html|(pages|account)\/[\w-]+\.html(\?[\w=&%.-]*)?)$/.test(
      nextRaw,
    );
  function goNext() {
    location.href = okNext ? "../" + nextRaw : "../index.html";
  }
  AuthService.ready.then(function () {
    if (AuthService.currentUser()) goNext();
  });
  function show(w) {
    var login = w !== "signup";
    L.hidden = !login;
    S.hidden = login;
    $("#tabLogin").classList.toggle("on", login);
    $("#tabSignup").classList.toggle("on", !login);
  }
  $("#tabLogin").onclick = function () {
    show("login");
  };
  $("#tabSignup").onclick = function () {
    show("signup");
  };
  show(location.hash.replace("#", ""));
  function say(el, t, ok) {
    el.textContent = t;
    el.className = "msg " + (ok ? "ok" : "err");
  }
  if (okNext)
    say($("#loginMsg"), "Log in or create an account to watch videos.", true);
  document.querySelectorAll(".eye").forEach(function (b) {
    b.onclick = function () {
      var i = b.parentNode.querySelector("input");
      i.type = i.type === "password" ? "text" : "password";
      b.textContent = i.type === "password" ? "Show" : "Hide";
    };
  });
  $("#spw").oninput = function () {
    var p = this.value,
      s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    var bar = $("#meterBar");
    bar.style.width = s * 25 + "%";
    bar.style.background = [
      "#ff6b6b",
      "#ff6b6b",
      "#f0a43a",
      "#9ccc4a",
      "#3cc2b0",
    ][s];
    $("#meterTxt").textContent = p
      ? ["Very weak", "Weak", "Fair", "Good", "Strong"][s]
      : "Use 8+ characters with letters, numbers and symbols.";
  };
  S.onsubmit = function (e) {
    e.preventDefault();
    var f = S.elements,
      m = $("#signupMsg");
    var name = f.name.value.trim(),
      user = f.user.value.trim(),
      email = f.email.value.trim(),
      pw = f.pw.value;
    if (!name) return say(m, "Enter your full name.");
    if (!/^[A-Za-z0-9_]{3,20}$/.test(user))
      return say(m, "Username must be 3-20 letters, numbers or underscores.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return say(m, "Enter a valid email address.");
    if (pw.length < 8) return say(m, "Password must be at least 8 characters.");
    if (pw !== f.cpw.value) return say(m, "Passwords do not match.");
    if (!f.terms.checked)
      return say(m, "Please agree to the Terms to continue.");
    AuthService.signup({
      name: name,
      username: user,
      email: email,
      password: pw,
    }).then(function (r) {
      if (!r.ok) return say(m, r.error);
      AuthService.login({
        identifier: email,
        password: pw,
        remember: false,
      }).then(function (l) {
        if (l.ok) {
          say(m, "Account created. Taking you in...", true);
          setTimeout(goNext, 500);
        } else {
          say(m, "Account created. Please log in.", true);
          show("login");
        }
      });
    });
  };
  L.onsubmit = function (e) {
    e.preventDefault();
    var f = L.elements,
      m = $("#loginMsg");
    if (!f.id.value.trim() || !f.pw.value)
      return say(m, "Enter your email or username and password.");
    AuthService.login({
      identifier: f.id.value,
      password: f.pw.value,
      remember: f.rem.checked,
    }).then(function (r) {
      if (!r.ok) return say(m, r.error);
      say(m, "Welcome back, " + r.user.name.split(" ")[0] + ".", true);
      setTimeout(goNext, 400);
    });
  };
  $("#forgot").onclick = function (e) {
    e.preventDefault();
    AuthService.requestPasswordReset(f_id()).then(function (r) {
      say($("#loginMsg"), r.message, true);
    });
  };
  function f_id() {
    return L.elements.id.value;
  }
})();
/* ===== LOGIN & SIGNUP UI END ===== */
