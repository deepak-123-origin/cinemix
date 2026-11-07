/* =====================================================================
   CINEMIX VIDEO LIST
   All video data is managed in this single file.

   NEW VIDEO ADD KARNE KE LIYE:
   1. Neeche kisi bhi { ... } video block ko copy karo.
   2. List ke END mein paste karo.
   3. Previous video block ke baad comma (,) lagana mat bhoolna.
   4. "url" mein YouTube link paste karo.
   5. Title, description aur baaki details update karo.
   6. File save karke page refresh karo.

   Thumbnail, Search, Details Page aur Watch Page automatically
   video data se generate honge.

   ---------------------------------------------------------------------
   AVAILABLE FIELDS
   ---------------------------------------------------------------------

   url          Required  YouTube video link.
   thumbnail    Optional  Direct image URL for this video's thumbnail.
   title        Required  Video title.
   type         Required  movie | series | anime | cartoon |
                          documentary | short | other

   year         Optional  Release year.
   genre        Optional  Video genre.
   duration     Optional  Example: "1h 48m"
   rating       Optional  Rating between 0 and 10.
   added        Optional  Format: "YYYY-MM-DD"
   featured     Optional  true / false
   description  Optional  Video description.

   Example:
   {
       url: "https://youtu.be/XXXXXXXXXXX",
       thumbnail: "https://example.com/my-poster.jpg",
       title: "My Video",
       type: "movie"
   }

   ---------------------------------------------------------------------
   SERIES / ANIME SEASONS FORMAT
   ---------------------------------------------------------------------

   seasons: [
       [
           {
               title: "Episode 1",
               url: "https://youtu.be/XXXXXXXXXXX",
               thumbnail: "https://example.com/episode-1.jpg",
               duration: "24 min"
           },
           {
               title: "Episode 2",
               url: "https://youtu.be/YYYYYYYYYYY",
               duration: "24 min"
           }
       ], // Season 1

       [
           {
               title: "Episode 1",
               url: "https://youtu.be/ZZZZZZZZZZZ",
               duration: "24 min"
           }
       ] // Season 2
   ]

   ---------------------------------------------------------------------
   IMPORTANT
   ---------------------------------------------------------------------

   Neeche diye gaye videos SAMPLE DATA hain.
   Apne authorized videos ke links se replace karna.

   ===================================================================== */

/* =====================================================================
   SECTION 01: EPISODE HELPER FUNCTION - START
   ---------------------------------------------------------------------
   Ek hi YouTube link se multiple sample episodes generate karta hai.
   Real series ke liye alag-alag episode URLs use karna.
   ===================================================================== */

function EP(url, count, duration, thumbnail) {
  var episodes = [];

  for (var i = 1; i <= count; i++) {
    episodes.push({
      title: "Episode " + i,
      url: url,
      duration: duration,
      thumbnail: thumbnail || "",
    });
  }

  return episodes;
}

/* ================= SECTION 01: END ================= */

/* =====================================================================
   SECTION 02: MAIN VIDEO DATABASE - START
   ---------------------------------------------------------------------
   CINEMIX ke saare videos yahan add honge.
   ===================================================================== */

window.VIDEOS = [
  /* ================================================================
       MOVIES
       ================================================================ */

  {
    url: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
    title: "Neon Harbor",
    type: "movie",
    year: 2024,
    genre: "Thriller",
    duration: "1h 48m",
    rating: 8.1,
    added: "2026-10-28",
    featured: true,

    description:
      "A night-shift dockworker finds a ledger that names half the city and has until sunrise to decide who to trust.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/eRsGyueVLvQ",
    title: "The Last Lighthouse",
    type: "movie",
    year: 2023,
    genre: "Drama",
    duration: "1h 56m",
    rating: 7.8,
    added: "2026-10-10",
    featured: true,

    description:
      "Three generations argue over whether to sell the family lighthouse as a storm closes the coast road.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/R6MlUcmOul8",
    title: "Orbit Zero",
    type: "movie",
    year: 2025,
    genre: "Sci-Fi",
    duration: "2h 03m",
    rating: 8.4,
    added: "2026-10-30",
    featured: false,

    description:
      "A salvage crew boards a silent station that is still counting down to something.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/TLkA0RELQ1g",
    title: "Crimson Alley",
    type: "movie",
    year: 2022,
    genre: "Crime",
    duration: "1h 41m",
    rating: 7.2,
    added: "2026-08-02",
    featured: false,

    description:
      "A street photographer's last roll of film shows a crime nobody reported.",
  },

  /* ================================================================
       WEB SERIES
       ================================================================ */

  {
    url: "https://www.youtube-nocookie.com/embed/Y-rmzh0PI3c",
    title: "Paper Kingdoms",
    type: "series",
    year: 2025,
    genre: "Fantasy",
    duration: "42 min",
    rating: 8.6,
    added: "2026-10-25",
    featured: true,

    description:
      "A cartographer's apprentice discovers her maps redraw the borders of real kingdoms.",
  },

  /* ============================================================
        CINEMIX — CARTOON VIDEO COLLECTION
        TOTAL: 8 VIDEOS
      ============================================================ */

  /* ============================================================
        01. OGGY AND THE COCKROACHES
      ============================================================ */

  {
    url: "https://www.youtube-nocookie.com/embed/1DKZhf7EEjI",
    title: "New Born of Oggy and the Cockroaches",
    type: "cartoon",
    genre: "Comedy, Adventure",
    duration: "1 hour 30 min",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description: "Enjoy the entertaining world of Oggy and the Cockroaches.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/vpCabRq8ZSQ",
    title: "Oggy and the Cockroaches - Episode 1",
    type: "cartoon",
    genre: "Comedy, Adventure",
    duration: "",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description: "Enjoy the hilarious adventures of Oggy and the Cockroaches.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/2UYFbGwDoDo",
    title: "Oggy and the Cockroaches - Episode 2",
    type: "cartoon",
    genre: "Comedy, Adventure",
    duration: "",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description: "Enjoy the hilarious adventures of Oggy and the Cockroaches.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/_-y3AYHEBQc",
    title: "Oggy and the Cockroaches - Episode 3",
    type: "cartoon",
    genre: "Comedy, Adventure",
    duration: "",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description: "Enjoy the hilarious adventures of Oggy and the Cockroaches.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/ldouKXyJQZM",
    title: "Oggy and the Cockroaches - Episode 4",
    type: "cartoon",
    genre: "Comedy, Adventure",
    duration: "",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description: "Enjoy the hilarious adventures of Oggy and the Cockroaches.",
  },

  /* ========================================================
       02. DORAEMON MOVIES
    ======================================================== */

  {
    url: "https://www.youtube-nocookie.com/embed/AEK9rTdgrNs",
    title: "Doraemon Movie - Nobita's Great Adventure in Antarctica",
    type: "cartoon",
    genre: "Adventure, Comedy, Fantasy",
    duration: "",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description:
      "Nobita and Doraemon travel to Antarctica for a mysterious adventure.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/4nxlGN4VgYw",
    title: "Doraemon Movie - Nobita The Explorer Bow! Bow!",
    type: "cartoon",
    year: 2025,
    genre: "Adventure, Comedy, Animation",
    duration: "",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description: "Join Doraemon and Nobita on an exciting adventure.",
  },

  {
    url: "https://www.youtube-nocookie.com/embed/FXP8FY_gjyg",
    title: "Doraemon Movie - Castle of the Undersea Devil",
    type: "cartoon",
    genre: "Adventure, Comedy, Fantasy",
    duration: "",
    rating: 7.0,
    added: "2026-11-04",
    featured: false,
    description:
      "Doraemon and Nobita embark on an exciting underwater adventure.",
  },

  /* ============================================================
    BHOOT AND FRIENDS (2010)
    ============================================================ */

  {
    url: "https://www.youtube-nocookie.com/embed/i4PKYlWms6g",

    title: "Bhoot and Friends",

    type: "movie",

    year: 2010,

    genre: "Adventure, Comedy, Fantasy",

    duration: "",

    rating: 7.0,

    added: "2026-11-05",

    featured: false,

    description:
      "A friendly ghost helps a group of teenagers search for a lost treasure. As they uncover the mystery, they must overcome dangerous challenges to save everyone's lives. Starring Jackie Shroff, Nishikant Dixit, Ashish Kattar, Faiz Khan, Aditya Lakhia and Ashwin Mushran. Directed by Karanjeet Saluja.",
  },

  {
    url: "https://youtu.be/0ofLpar5eUc?si=MYlnfRjhF6P_9ZlA",
    title: "Cartoon Episode",
    type: "cartoon",
    genre: "Comedy, Adventure",
    duration: "24 min",
    rating: 7.0,
    added: "2026-11-06",
    featured: false,
    description: "Enjoy this entertaining cartoon episode.",
  },

  /* ================================================================
       ADD NEW VIDEO HERE
       ----------------------------------------------------------------
       1. Har naye video ka unique YouTube URL use karo.
       2. Existing URL dobara use mat karo.
       3. Naya video object last entry ke baad comma laga kar add karo.
       ================================================================ */
];

/* ================= SECTION 02: END ================= */
