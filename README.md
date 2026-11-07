# CINEMIX

All Entertainment. One Destination. A dark, cinematic streaming and discovery site. Videos play through YouTube embeds; no video files are hosted.

## Run it
1. Unzip the folder.
2. Open `index.html` in a browser (double-click works), or serve it: `python3 -m http.server 8000` then visit http://localhost:8000.
3. Internet is needed for thumbnails and the YouTube player.

## Add videos
- **Normal videos** (movie, cartoon, documentary, short): `videos/videos.js`
- **Episode videos** (series, anime): `videos/episodes.js`

Copy one `{ ... }` block, paste your YouTube link, title and description, save, refresh. The format is explained in the comment at the top of each file.
Any video that has `seasons` (or `episodes`) is detected as an episode video automatically: the watch page then shows an "All episodes" button and a Season dropdown, and Next/Previous Episode work across seasons.
The sample videos are open Blender Foundation films used as placeholders. Replace them with videos you are authorised to embed.

## Check your links
Open `videos/check-links.html` over `http://` (Live Server) and press **Check all links**. It tests every video and episode and lists the ones that cannot play (wrong or placeholder link, private or removed video, or embedding turned off by the owner).

## Random videos
Home (hero, Featured, Explore), Search and Related lists show videos in a new random order on every refresh. The hero also rotates every 6 seconds. Recently Added stays sorted by date.

## Login required to watch
You can browse the whole site as a guest. Clicking a video, Watch Now, Play or Save sends you to `account/auth.html`; after login you return to that video.
This gate is a browser-side demo. A real site must enforce access on the server.

## Replace with real authentication
All account logic is in `account/auth-service.js` (see the contract in its header comment). Rewrite only that file to call your backend; the rest of the site uses `AuthService` and needs no changes.

## What is included
Homepage with Video Hub, Login/Sign Up, Account (photo upload, profile, delete), Saved Videos, Watch History, Recently Watched / Added, Search with suggestions, Movie / Series / Anime details, Watch page, Settings (theme, language, notifications, privacy, password), footer and info/legal pages.

## Structure
`index.html`, `videos/` (`videos.js` normal videos, `episodes.js` series/anime), `account/` (login, signup, account page, auth service), `pages/` (other pages), `css/`, `js/`, `assets/`, `docs/`.

## Demo vs production
This is a frontend demo. Accounts, saved videos, history and the profile photo live in your browser's localStorage. Passwords are stored as salted SHA-256 hashes, never plaintext, but that is **not** production security: anyone with the browser can read the data, and there is no email verification or password reset.
A production site needs a backend with proper password hashing (bcrypt/argon2), sessions or tokens over HTTPS, a database (see `docs/DATABASE-STRUCTURE.md`) and an admin panel.
Legal pages are templates. Have them reviewed against your business details and applicable laws before launch.
