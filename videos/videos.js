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
   /* ============================================================
        01. Hunny Bunny Cartoon
      ============================================================ */


  {
    url: "https://www.youtube-nocookie.com/embed/LupFLbOQFKI",
    title: "Hunny Bunny Cartoon",
    type: "cartoon",
    genre: "Comedy, Kids, Adventure",
    duration: "YouTube Video",
    rating: 7.0,
    added: "2026-11-19",
    featured: false,
    description: "Welcome to the magical world of Hunny Bunny! Enjoy fun-filled adventures, funny moments, entertaining stories, and exciting cartoon videos for kids.",
  },
    

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
