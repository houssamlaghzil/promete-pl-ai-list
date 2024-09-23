import React, { useState, useEffect } from 'react';
import { redirectToSpotifyLogin, getAccessTokenFromUrl } from '../services/spotifyAuth';
import { generatePlaylist, getSpotifyTrackUris, getSpotifyUserProfile, createSpotifyPlaylist } from '../services/apiService';

const PlaylistGenerator = () => {
    const [personality, setPersonality] = useState('');
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState('');
    const [accessToken, setAccessToken] = useState(null);
    const [userId, setUserId] = useState(null);

    // Vérifie si un token d'accès est disponible dans l'URL après l'authentification
    useEffect(() => {
        const token = getAccessTokenFromUrl();
        if (token) {
            setAccessToken(token);
            fetchUserProfile(token);
        }
    }, []);

    // Récupère le profil utilisateur Spotify
    const fetchUserProfile = async (token) => {
        try {
            const userProfile = await getSpotifyUserProfile(token);
            setUserId(userProfile.id);
        } catch (error) {
            setError('Erreur lors de la récupération du profil utilisateur Spotify.');
        }
    };

    // Gère la génération de playlist et l'ajout sur Spotify
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!accessToken) {
            redirectToSpotifyLogin(); // Redirige pour la connexion Spotify si aucun token n'est disponible
            return;
        }

        try {
            const generatedTrackNames = await generatePlaylist(personality);
            const trackUris = await getSpotifyTrackUris(generatedTrackNames, accessToken);
            await createSpotifyPlaylist(accessToken, userId, trackUris);
            setPlaylist(generatedTrackNames);
        } catch (error) {
            setError('Une erreur est survenue lors de la création de la playlist.');
        }
    };

    return (
        <div className="playlist-generator">
            <form onSubmit={handleSubmit}>
                <label htmlFor="personality">Décris ta personnalité :</label>
                <textarea
                    id="personality"
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    required
                />
                <button type="submit">Générer et ajouter la playlist sur Spotify</button>
            </form>

            {error && <p>{error}</p>}

            {playlist && (
                <div>
                    <h3>Playlist générée</h3>
                    <ul>
                        {playlist.map((track, index) => (
                            <li key={index}>{track}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PlaylistGenerator;
