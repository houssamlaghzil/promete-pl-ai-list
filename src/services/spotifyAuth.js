import axios from 'axios';

// Redirige l'utilisateur vers l'URL d'authentification OAuth de Spotify
export const redirectToSpotifyLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // URL où l'utilisateur sera redirigé après authentification
    const scopes = 'playlist-modify-public playlist-modify-private'; // Scopes pour la gestion des playlists

    console.log('Redirection vers Spotify pour l\'authentification...');

    // Redirection vers l'URL d'autorisation Spotify
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
};

// Récupère le token d'accès à partir de l'URL de redirection après l'authentification
export const getAccessTokenFromUrl = () => {
    const hash = window.location.hash; // Obtient le hash fragment de l'URL
    let token = null;

    if (hash) {
        token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
        console.log('Token d\'accès obtenu:', token);
        window.location.hash = '';  // Efface le hash après avoir récupéré le token
    } else {
        console.log('Aucun token trouvé dans l\'URL.');
    }

    return token;
};
