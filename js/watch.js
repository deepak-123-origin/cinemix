/* ===== WATCH PAGE START (branded CINEMIX player; plays through the YouTube IFrame API with its own controls) ===== */

/* ===== YOUTUBE UI CROP (NEW) =====
   YouTube ka upar ka title/channel bar aur niche ka logo/link/watch-later crop karke chhupata hai.
   Normal AUR fullscreen dono mein kaam karta hai. Video player ko poora bharta hai (cover) aur thoda zoom hota hai.
   Adjust karne ke liye neeche ke 4 numbers/switch badlo. */
var CX_CROP = 22; /* upar-niche crop % (video height ka) */
var CX_CROP_MIN_PX = 64; /* chhoti/phone screen par kam se kam itne px crop */
var CX_ZOOM = 1.12; /* video zoom (1 = zoom nahi, 1.1 = 10%, 1.2 = 20%) */
var CX_COVER = true; /* true = video poori screen/player ko bhar de, false = poora video dikhe */
(function () {
  var s = document.createElement("style");
  s.textContent =
    "#stage.cx-crop{overflow:hidden}" +
    "#cxClip{position:absolute!important;left:0!important;top:0!important;width:100%!important;height:100%!important;overflow:hidden!important}" +
    "#cxClip iframe{position:absolute!important;max-width:none!important;border:0!important;transform:none!important;margin:0!important}";
  document.head.appendChild(s);
})();
function cxCropFit(stage) {
  if (!stage.classList.contains("cx-crop")) return;
  var clip = stage.querySelector("#cxClip"),
    f = clip && clip.querySelector("iframe");
  if (!f) return;
  var sW = clip.clientWidth,
    sH = clip.clientHeight;
  if (!sW || !sH) return;
  /* cover = poora bhar de; contain = poora video dikhe.
     Bahut lambi (portrait) screen par cover nahi lagta. */
  var cover = CX_COVER && sW / sH >= 1.3,
    baseH = cover ? Math.max(sH, (sW * 9) / 16) : Math.min(sH, (sW * 9) / 16),
    H = baseH * CX_ZOOM,
    W = (H * 16) / 9,
    c = Math.max((H * CX_CROP) / 100, CX_CROP_MIN_PX),
    ih = H + 2 * c;
  var set = function (k, v) {
    f.style.setProperty(k, v, "important");
  };
  set("width", W + "px");
  set("height", ih + "px");
  set("left", (sW - W) / 2 + "px");
  set("top", (sH - ih) / 2 + "px");
}
function cxCropInit(stage) {
  var host = document.getElementById("ytHost");
  if (host && !stage.querySelector("#cxClip")) {
    if (getComputedStyle(stage).position === "static")
      stage.style.position = "relative";
    var clip = document.createElement("div");
    clip.id = "cxClip";
    host.parentNode.insertBefore(clip, host);
    clip.appendChild(host);
  }
  var run = function () {
    cxCropFit(stage);
  };
  if (window.ResizeObserver) new ResizeObserver(run).observe(stage);
  window.addEventListener("resize", run);
  window.addEventListener("orientationchange", run);
  ["fullscreenchange", "webkitfullscreenchange"].forEach(function (ev) {
    document.addEventListener(ev, function () {
      setTimeout(run, 150);
    });
  });
  if (window.MutationObserver)
    new MutationObserver(run).observe(stage, { childList: true, subtree: true });
  [0, 300, 1000, 2500].forEach(function (t) {
    setTimeout(run, t);
  });
}
/* ===== END YOUTUBE UI CROP ===== */

document.addEventListener("DOMContentLoaded", function () {
  CX.requireLogin(function () {
    var P = new URLSearchParams(location.search),
      c = CX.get(P.get("id")),
      $ = function (i) {
        return document.getElementById(i);
      };
    if (!c) {
      $("stage").hidden = true;
      $("wTitle").textContent = "Video not found";
      $("wDesc").innerHTML = '<a href="search.html">Browse all videos</a>';
      $("prevEp").hidden =
        $("nextEp").hidden =
        $("wSave").hidden =
        $("wShare").hidden =
          true;
      return;
    }
    var eps = CX.episodes(c),
      ep = Math.max(0, Math.min(eps.length - 1, +P.get("ep") || 0)),
      cur = eps[ep];
    $("wTitle").textContent =
      c.title +
      (cur
        ? " - S" +
          cur.s +
          " E" +
          cur.n +
          (cur.t && cur.t !== "Episode " + cur.n ? ": " + cur.t : "")
        : "");
    document.title = $("wTitle").textContent + " | CINEMIX";
    $("wMeta").textContent = [c.cat, c.genre, c.year, cur ? cur.d : c.dur]
      .filter(Boolean)
      .join(" - ");
    $("wDesc").textContent = (cur && cur.desc) || c.desc;
    $("wSave").dataset.id = c.id;
    $("wSave").dataset.title = c.title;
    CXW.sync();
    [
      ["prevEp", ep - 1],
      ["nextEp", ep + 1],
    ].forEach(function (a) {
      var b = $(a[0]);
      if (a[1] < 0 || a[1] >= eps.length) {
        b.disabled = true;
        b.title = eps.length ? "No more episodes" : "Only available for series";
        b.style.opacity = 0.5;
      } else
        b.onclick = function () {
          location.href = CX.watchUrl(c, a[1]);
        };
    });
    $("wShare").onclick = function () {
      CXShare(c, $("wMsg"));
    };
    var rel = CX.shuffle(
      CONTENT.filter(function (x) {
        return x.id !== c.id && x.type === c.type;
      }),
    );
    if (rel.length < 4)
      rel = rel.concat(
        CX.shuffle(
          CONTENT.filter(function (x) {
            return x.id !== c.id && x.type !== c.type;
          }),
        ),
      );
    CX.mount(
      $("related"),
      rel
        .slice(0, 5)
        .map(function (x) {
          return CX.item(x, "", CX.watchUrl(x));
        })
        .join(""),
    );
    CX.hrow(
      $("moreRow"),
      CX.shuffle(
        CONTENT.filter(function (x) {
          return x.id !== c.id;
        }),
      ),
    );
    if (c.seasons && eps.length)
      buildEpisodes(c, eps, ep); /* episode video detected automatically */
    CXH.add(c.id, ep);
    initPlayer(
      (cur && cur.yt) || c.yt,
      ep + 1 < eps.length ? CX.watchUrl(c, ep + 1) : "",
      cur ? cur.thumbnail : c.thumbnail,
    );
  });
});

/* ---- episodes panel: appears only for videos that have seasons/episodes ---- */
function buildEpisodes(c, eps, ep) {
  var $ = function (i) {
      return document.getElementById(i);
    },
    cur = eps[ep],
    sel = $("epsSeason");
  $("epsBox").hidden = false;
  $("epsNow").textContent =
    cur.sname +
    " - Episode " +
    cur.n +
    " of " +
    c.seasons[cur.s - 1].eps.length +
    " (" +
    eps.length +
    " episodes in all)";
  sel.innerHTML = c.seasons
    .map(function (s) {
      return (
        '<option value="' +
        s.n +
        '">' +
        CX.esc(s.name) +
        " (" +
        s.eps.length +
        " episodes)</option>"
      );
    })
    .join("");
  sel.value = cur.s;
  function list() {
    var n = +sel.value,
      off = 0;
    c.seasons.forEach(function (s) {
      if (s.n < n) off += s.eps.length;
    });
    $("epsList").innerHTML = c.seasons[n - 1].eps
      .map(function (e, i) {
        var idx = off + i,
          now = idx === ep;
        return (
          '<a class="epi' +
          (now ? " now" : "") +
          '" href="' +
          CX.watchUrl(c, idx) +
          '"><span class="thumb" style="--h:' +
          c.h +
          '">' +
          CX.thumb({ title: e.t, yt: e.yt, thumbnail: e.thumbnail }) +
          '</span><span class="et"><b>' +
          (i + 1) +
          ". " +
          CX.esc(e.t) +
          "</b><small>" +
          (now ? "Now playing" : CX.esc(e.d)) +
          "</small></span></a>"
        );
      })
      .join("");
  }
  function setOpen(o) {
    $("epsPanel").hidden = !o;
    $("epsToggle").setAttribute("aria-expanded", o);
    $("epsToggle").textContent = o ? "Hide episodes" : "All episodes";
    sessionStorage.setItem("cx_eps_open", o ? "1" : "0");
  }
  sel.onchange = list;
  list();
  setOpen(sessionStorage.getItem("cx_eps_open") === "1");
  $("epsToggle").onclick = function () {
    setOpen($("epsPanel").hidden);
  };
  var now = $("epsList").querySelector(".now");
  if (now && !$("epsPanel").hidden) now.scrollIntoView({ block: "nearest" });
}

function initPlayer(vid, nextUrl, thumbnail) {
  var $ = function (i) {
      return document.getElementById(i);
    },
    stage = $("stage"),
    yt,
    timer,
    idleT,
    dragging = false,
    wantPlay = false; /* plays only when the viewer presses Play */
  stage.classList.add("cx-crop"); /* NEW: YouTube UI crop on (fallback mode mein apne aap hat jaata hai) */
  cxCropInit(stage);
  var fmt = function (s) {
    s = Math.max(0, Math.floor(s || 0));
    var h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60),
      x = ("0" + (s % 60)).slice(-2);
    return (h ? h + ":" + ("0" + m).slice(-2) : m) + ":" + x;
  };
  /* phones/tablets: browsers only start a video when the viewer taps the real player itself, so the first tap passes
     straight through our poster (CSS .touch) to the player; after that our own controls work. YouTube's own look stays hidden. */
  var native =
    (window.matchMedia && matchMedia("(pointer: coarse)").matches) ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (native) stage.classList.add("touch");
  if (!native && !(stage.requestFullscreen || stage.webkitRequestFullscreen))
    $("cFs").hidden = true;
  var orientationLockPending = false;
  function orientationError(error) {
    orientationLockPending = false;
    var expected =
      error &&
      /^(NotSupportedError|SecurityError|AbortError)$/.test(error.name);
    if (error && !expected)
      console.warn("CINEMIX: could not change fullscreen orientation.", error);
    if (
      native &&
      isFullscreen() &&
      matchMedia("(orientation: portrait)").matches
    ) {
      enterFallbackFullscreen();
    }
  }
  function isFullscreen() {
    return (
      stage.classList.contains("mobile-fullscreen") ||
      document.fullscreenElement === stage ||
      document.webkitFullscreenElement === stage
    );
  }
  function updateFullscreenButton() {
    $("cFs").textContent = isFullscreen() ? "Exit fullscreen" : "Fullscreen";
  }
  function lockLandscape() {
    if (!native || orientationLockPending) return;
    if (!screen.orientation || typeof screen.orientation.lock !== "function") {
      if (matchMedia("(orientation: portrait)").matches)
        enterFallbackFullscreen();
      return;
    }
    orientationLockPending = true;
    try {
      var lock = screen.orientation.lock("landscape");
      if (lock && typeof lock.then === "function") {
        lock
          .then(function () {
            if (matchMedia("(orientation: portrait)").matches)
              enterFallbackFullscreen();
          })
          .catch(orientationError);
      } else {
        orientationLockPending = false;
        if (matchMedia("(orientation: portrait)").matches)
          enterFallbackFullscreen();
      }
    } catch (error) {
      orientationError(error);
    }
  }
  function activateFallbackFullscreen() {
    stage.classList.add("mobile-fullscreen");
    document.body.classList.add("player-fullscreen");
    updateFullscreenButton();
  }
  function enterFallbackFullscreen() {
    if (!native) return;
    var fullscreen = document.fullscreenElement === stage ||
      document.webkitFullscreenElement === stage;
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!fullscreen || !exit) {
      activateFallbackFullscreen();
      return;
    }
    var complete = false;
    function finish() {
      if (complete) return;
      complete = true;
      document.removeEventListener("fullscreenchange", finish);
      document.removeEventListener("webkitfullscreenchange", finish);
      activateFallbackFullscreen();
    }
    document.addEventListener("fullscreenchange", finish);
    document.addEventListener("webkitfullscreenchange", finish);
    try {
      var result = exit.call(document);
      if (result && typeof result.then === "function")
        result.then(finish).catch(function (error) {
          document.removeEventListener("fullscreenchange", finish);
          document.removeEventListener("webkitfullscreenchange", finish);
          console.error("CINEMIX: could not switch to mobile fullscreen.", error);
        });
      else setTimeout(finish, 100);
    } catch (error) {
      document.removeEventListener("fullscreenchange", finish);
      document.removeEventListener("webkitfullscreenchange", finish);
      console.error("CINEMIX: could not switch to mobile fullscreen.", error);
    }
  }
  function exitFullscreen() {
    if (stage.classList.contains("mobile-fullscreen")) {
      stage.classList.remove("mobile-fullscreen");
      document.body.classList.remove("player-fullscreen");
      updateFullscreenButton();
      return;
    }
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) {
      var result = exit.call(document);
      if (result && typeof result.then === "function")
        result
          .then(updateFullscreenButton)
          .catch(function (error) {
            console.error("CINEMIX: could not exit fullscreen.", error);
          });
    }
  }
  function onFullscreenChange() {
    if (isFullscreen()) lockLandscape();
    else if (screen.orientation && screen.orientation.unlock) {
      try {
        screen.orientation.unlock();
      } catch (error) {
        orientationError(error);
      }
      orientationLockPending = false;
    }
    updateFullscreenButton();
  }
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  var poster =
    thumbnail && /^https?:\/\/\S+$/i.test(thumbnail)
      ? thumbnail
      : "https://i.ytimg.com/vi/" + encodeURIComponent(vid) + "/hqdefault.jpg";
  poster = poster.replace(/[()'"\\\s]/g, function (char) {
    return encodeURIComponent(char);
  });
  stage.style.setProperty("--poster", "url(" + poster + ")");
  if (nextUrl) {
    $("endNext").href = nextUrl;
    $("endNext").hidden = false;
  }

  function fallback() {
    /* API unreachable: plain embed so the video still plays */
    stage.className = "player";
    stage.innerHTML =
      '<iframe id="ytHost" title="CINEMIX Video Player" src="https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(vid) +
      '?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  }
  function toggle() {
    if (!yt || !yt.getPlayerState) {
      wantPlay = true;
      $("spin").hidden = false;
      return;
    } /* clicked before player is ready: start as soon as it is */
    var s = yt.getPlayerState();
    if (s === 1 || s === 3) yt.pauseVideo();
    else yt.playVideo();
  }
  function tick() {
    if (!yt || !yt.getDuration || dragging) return;
    var d = yt.getDuration(),
      t = yt.getCurrentTime();
    if (d) $("cSeek").value = Math.round((t / d) * 1000);
    $("cTime").textContent = fmt(t) + " / " + fmt(d);
  }
  function onState(e) {
    var s = e.data,
      playing = s === 1 || s === 3;
    $("spin").hidden = s !== 3;
    stage.classList.toggle("playing", playing);
    if (s === 1) {
      stage.classList.add("started");
      $("cover").hidden = true;
      $("cover").classList.remove("fresh");
      $("endCard").hidden = true;
      $("cPlay").textContent = "Pause";
      clearInterval(timer);
      timer = setInterval(tick, 250);
    }
    if (s === 2) {
      $("cover").hidden = false;
      $("cPlay").textContent = "Play";
      tick();
    }
    if (s === 0) {
      $("endCard").hidden = false;
      $("cover").hidden = true;
      $("cPlay").textContent = "Play";
      clearInterval(timer);
    }
  }
  function onError(e) {
    var code = e && e.data,
      why =
        {
          2: "This video link is not valid.",
          5: "Your browser could not play this video. Please try again.",
          100: "This video is unavailable. It may be private, removed, or the link is wrong.",
          101: "The owner has turned off playing this video on other websites.",
          150: "The owner has turned off playing this video on other websites.",
          153: "This video cannot load on this page. Open the site over http:// (Live Server), not as a file.",
        }[code] || "This video can't be played right now.";
    console.error(
      "CINEMIX: video " +
        vid +
        " failed (YouTube error " +
        code +
        "). Run videos/check-links.html to find bad links.",
    );
    $("cover").hidden = false;
    $("cover").classList.remove("fresh");
    $("bigPlay").hidden = true;
    $("spin").hidden = true;
    $("coverMsg").textContent = why + " (code " + code + ")";
    if (nextUrl) {
      $("errNext").href = nextUrl;
      $("errNext").hidden = false;
    }
  }
  function build() {
    var vars = {
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      playsinline: 1,
    };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    yt = new YT.Player("ytHost", {
      host: "https://www.youtube-nocookie.com",
      videoId: vid,
      width: "100%",
      height: "100%",
      playerVars: vars,
      events: {
        onReady: function () {
          $("bigPlay").disabled = false;
          $("bigPlay").textContent = "Play";
          if (wantPlay) yt.playVideo();
        },
        onStateChange: onState,
        onError: onError,
      },
    });
  }
  var done = false,
    t = setTimeout(function () {
      if (!done) {
        done = true;
        fallback();
      }
    }, 10000);
  function fire() {
    if (done) return;
    done = true;
    clearTimeout(t);
    build();
  }
  if (window.YT && YT.Player) fire();
  else if (window.__ytq) {
    if (window.__ytok) fire();
    else window.__ytq.push(fire);
    var chk = setInterval(function () {
      if (done) clearInterval(chk);
      else if (window.__yterr) {
        clearInterval(chk);
        done = true;
        clearTimeout(t);
        fallback();
      }
    }, 300);
  } else fallback();
  /* controls */
  ["shield", "cover"].forEach(function (id) {
    $(id).onclick = toggle;
  });
  $("shield").ondblclick = function () {
    $("cFs").click();
  };
  $("cPlay").onclick = toggle;
  $("replay").onclick = function () {
    $("endCard").hidden = true;
    yt.seekTo(0, true);
    yt.playVideo();
  };
  $("cSeek").oninput = function () {
    dragging = true;
    var d = yt.getDuration();
    $("cTime").textContent = fmt((d * this.value) / 1000) + " / " + fmt(d);
  };
  $("cSeek").onchange = function () {
    yt.seekTo((yt.getDuration() * this.value) / 1000, true);
    dragging = false;
  };
  $("cMute").onclick = function () {
    if (yt.isMuted()) {
      yt.unMute();
      this.textContent = "Mute";
    } else {
      yt.mute();
      this.textContent = "Unmute";
    }
  };
  $("cVol").oninput = function () {
    yt.setVolume(+this.value);
    if (+this.value > 0 && yt.isMuted()) {
      yt.unMute();
      $("cMute").textContent = "Mute";
    }
  };
  $("cSpeed").onchange = function () {
    yt.setPlaybackRate(+this.value);
  };
  $("cFs").onclick = function () {
    if (isFullscreen()) {
      exitFullscreen();
      return;
    }
    var request = stage.requestFullscreen || stage.webkitRequestFullscreen;
    if (!request) {
      enterFallbackFullscreen();
      return;
    }
    try {
      var result = request.call(stage);
      if (result && typeof result.then === "function") {
        result
          .then(function () {
            lockLandscape();
            updateFullscreenButton();
          })
          .catch(enterFallbackFullscreen);
      } else {
        lockLandscape();
        updateFullscreenButton();
      }
    } catch (error) {
      if (native) enterFallbackFullscreen();
      else throw error;
    }
  };
  stage.onmousemove = function () {
    stage.classList.remove("idle");
    clearTimeout(idleT);
    idleT = setTimeout(function () {
      stage.classList.add("idle");
    }, 2500);
  };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && stage.classList.contains("mobile-fullscreen")) {
      e.preventDefault();
      exitFullscreen();
      return;
    }
    if (
      !yt ||
      !yt.getPlayerState ||
      /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)
    )
      return;
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "f") $("cFs").click();
    else if (e.key === "m") $("cMute").click();
    else if (e.key === "ArrowRight") yt.seekTo(yt.getCurrentTime() + 10, true);
    else if (e.key === "ArrowLeft") yt.seekTo(yt.getCurrentTime() - 10, true);
  });
}
/* ===== WATCH PAGE END ===== */