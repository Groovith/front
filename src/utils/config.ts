export const SPOTIFY_CLIENT_ID = "02e3d924240945c2842268c538817f6f";
export const SPOTIFY_REDIRECT_URI = "http://localhost:5173/callback";
export const SPOTIFY_SCOPES =
  "user-read-private user-read-email streaming user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-read-private";
export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI
)}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}`;
