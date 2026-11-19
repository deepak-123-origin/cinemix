/* ===== AUTH SERVICE START ===== */
/* =====================================================================
   AUTH SERVICE  -  the ONLY file that knows HOW accounts work.
   =====================================================================
   Whole site talks to accounts through window.AuthService. To move to REAL authentication,
   rewrite just this file (keep the same method names and return shapes) and call your backend.

   CONTRACT
     AuthService.ready                 Promise, resolves when the current user is known
                                       (real version: await fetch("/api/me") here and cache the user)
     AuthService.currentUser()         -> { id, name, username, email, photo } | null   (synchronous, from cache)
     AuthService.signup({name,username,email,password})   -> Promise<{ok:true} | {ok:false,error}>
     AuthService.login({identifier,password,remember})    -> Promise<{ok:true,user} | {ok:false,error}>
     AuthService.logout()                                 -> Promise
     AuthService.updateProfile({name?,username?,photo?})  -> Promise<{ok:true} | {ok:false,error}>
     AuthService.changePassword(current,next)             -> Promise<{ok:true} | {ok:false,error}>
     AuthService.requestPasswordReset(email)              -> Promise<{ok:true,message}>
     AuthService.deleteAccount()                          -> Promise<{ok:true}>

   Real backend: use fetch(..., {credentials:"include"}) with HttpOnly session cookies or tokens, hash
   passwords server-side (bcrypt/argon2) and enforce access on the SERVER. Hiding videos only in the
   browser is a UX gate, not security.

   CURRENT PROVIDER: "demo-localstorage" (browser-only, for development).
   ===================================================================== */
var AuthService = (function () {
  var UK = "cx_users",
    SK = "cx_session";
  function users() {
    try {
      return JSON.parse(localStorage.getItem(UK)) || [];
    } catch (e) {
      return [];
    }
  }
  function save(u) {
    try {
      localStorage.setItem(UK, JSON.stringify(u));
    } catch (e) {
      alert("Browser storage is full or blocked.");
    }
  }
  function hash(pw, salt) {
    var txt = salt + ":" + pw;
    if (window.crypto && crypto.subtle) {
      return crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(txt))
        .then(function (b) {
          return Array.prototype.map
            .call(new Uint8Array(b), function (x) {
              return ("0" + x.toString(16)).slice(-2);
            })
            .join("");
        });
    }
    var h = 5381;
    for (var i = 0; i < txt.length; i++)
      h = ((h << 5) + h + txt.charCodeAt(i)) | 0;
    return Promise.resolve("f" + h); /* weak fallback, demo only */
  }
  function pub(u) {
    return u
      ? {
          id: u.id,
          name: u.name,
          username: u.username,
          email: u.email,
          photo: u.photo || "",
        }
      : null;
  }
  function sid() {
    try {
      var s = JSON.parse(localStorage.getItem(SK));
      if (s && s.exp > Date.now()) return s.id;
    } catch (e) {}
    localStorage.removeItem(SK);
    return null;
  }
  function raw() {
    var id = sid();
    return id
      ? users().filter(function (u) {
          return u.id === id;
        })[0] || null
      : null;
  }
  function fail(e) {
    return Promise.resolve({ ok: false, error: e });
  }
  function patchMe(fn) {
    var me = raw(),
      all = users();
    all.forEach(function (x) {
      if (me && x.id === me.id) fn(x);
    });
    save(all);
  }

  return {
    provider: "demo-localstorage",
    ready: Promise.resolve(),
    currentUser: function () {
      return pub(raw());
    },
    signup: function (d) {
      var all = users(),
        email = String(d.email).trim().toLowerCase(),
        un = String(d.username).trim();
      if (
        all.some(function (u) {
          return u.email === email;
        })
      )
        return fail(
          "An account with this email already exists. Try logging in.",
        );
      if (
        all.some(function (u) {
          return u.username.toLowerCase() === un.toLowerCase();
        })
      )
        return fail("That username is taken.");
      var salt = Math.random().toString(36).slice(2);
      return hash(d.password, salt).then(function (h) {
        all.push({
          id: "u" + Date.now().toString(36),
          name: String(d.name).trim(),
          username: un,
          email: email,
          salt: salt,
          hash: h,
          photo: "",
        });
        save(all);
        return { ok: true };
      });
    },
    login: function (d) {
      var id = String(d.identifier).trim().toLowerCase();
      var u = users().filter(function (x) {
        return x.email === id || x.username.toLowerCase() === id;
      })[0];
      if (!u) return fail("No account found. Check your details or sign up.");
      return hash(d.password, u.salt).then(function (h) {
        if (h !== u.hash) return { ok: false, error: "Incorrect password." };
        localStorage.removeItem(SK);
        sessionStorage.removeItem(SK);
        localStorage.setItem(
          SK,
          JSON.stringify({
            id: u.id,
            exp: Date.now() + (d.remember ? 30 : 0.5) * 864e5,
          }),
        ); /* remember me: 30 days, otherwise 12 hours */
        return { ok: true, user: pub(u) };
      });
    },
    logout: function () {
      localStorage.removeItem(SK);
      sessionStorage.removeItem(SK);
      return Promise.resolve();
    },
    updateProfile: function (p) {
      var me = raw();
      if (!me) return fail("Please log in.");
      if (
        p.username !== undefined &&
        users().some(function (x) {
          return (
            x.id !== me.id &&
            x.username.toLowerCase() === String(p.username).toLowerCase()
          );
        })
      )
        return fail("That username is taken.");
      patchMe(function (x) {
        ["name", "username", "photo"].forEach(function (k) {
          if (p[k] !== undefined) x[k] = p[k];
        });
      });
      return Promise.resolve({ ok: true });
    },
    changePassword: function (cur, next) {
      var me = raw();
      if (!me) return fail("Please log in.");
      return hash(cur, me.salt).then(function (h) {
        if (h !== me.hash)
          return { ok: false, error: "Current password is incorrect." };
        var salt = Math.random().toString(36).slice(2);
        return hash(next, salt).then(function (nh) {
          patchMe(function (x) {
            x.salt = salt;
            x.hash = nh;
          });
          return { ok: true };
        });
      });
    },
    requestPasswordReset: function () {
      return Promise.resolve({
        ok: true,
        message:
          "Password reset needs an email backend, which this demo does not have.",
      });
    },
    deleteAccount: function () {
      var me = raw();
      if (!me) return fail("Please log in.");
      save(
        users().filter(function (x) {
          return x.id !== me.id;
        }),
      );
      localStorage.removeItem("cx_saved_" + me.id);
      localStorage.removeItem("cx_hist_" + me.id);
      localStorage.removeItem(SK);
      sessionStorage.removeItem(SK);
      return Promise.resolve({ ok: true });
    },
  };
})();
/* ===== AUTH SERVICE END ===== */
