// Import modules
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import { Request, Response, Router } from 'express';
import store from 'store2';

// Helper functions

/**
 * Update the server's Spotify API access token.
 */
async function updateAccessToken(): Promise<void> {
  const tokenRes: any = await axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    params: {
      grant_type: 'client_credentials'
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: process.env.SPOTIFY_CLIENT_ID,
      password: process.env.SPOTIFY_CLIENT_SECRET
    }
  })

  store.set('spotifyAccessToken', tokenRes.data.access_token);
}

/**
 * Make a request to the Spotify API. If the initial request was unauthorized, try updating the access token and retry
 * the request.
 * @param reqFun request function to perform
 */
async function makeSpotifyRequest(reqFun: any): Promise<any> {
  try {
    return Promise.resolve(await reqFun());
  } catch(err) {
    // Only retry the request if there was an authorization error
    if (err.response.status !== 401) {
      throw err;
    }

    // Try updating the access token
    try {
      await updateAccessToken();
    } catch(tokenErr) {
      throw err;
    }

    // Retry the request
    try {
      return Promise.resolve(await reqFun());
    } catch(retryErr) {
      throw err;
    }
  }
}

/**
 * Fetches album search results from Spotify.
 * @param searchQuery the term to search for
 * @return a promise for a Spotify search result
 */
async function fetchSpotifyAlbumSearch(searchQuery: string): Promise<any> {
  const encodedQuery: string = encodeURIComponent(searchQuery.toString());

  const requestFun = async (): Promise<any> => {
    const searchResult: any = await axios({
      url: `https://api.spotify.com/v1/search?q=${encodedQuery}&type=album&limit=10`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: store.get('spotifyAccessToken')
      }
    });

    return Promise.resolve(searchResult);
  };

  return await makeSpotifyRequest(requestFun);
}

/**
 * Fetches an artist from Spotify.
 * @param spotifyArtistId the Spotify ID of the artist
 * @return a promise for a Spotify artist
 */
async function fetchSpotifyArtist(spotifyArtistId: string): Promise<any> {
  const requestFun = async (): Promise<any> => {
    const artistResult: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/artists/${spotifyArtistId}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: store.get('spotifyAccessToken')
      }
    });

    return Promise.resolve(artistResult);
  };

  return await makeSpotifyRequest(requestFun);
}

/**
 * Fetches an album's tracks from Spotify.
 * @param spotifyAlbumId the Spotify ID of the album
 * @return a promise for a list of Spotify tracks
 */
async function fetchSpotifyAlbumTracks(spotifyAlbumId: string): Promise<any> {
  const requestFun = async (): Promise<any> => {
    const tracksResult: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/albums/${spotifyAlbumId}/tracks`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: store.get('spotifyAccessToken')
      }
    });

    return Promise.resolve(tracksResult);
  };

  return await makeSpotifyRequest(requestFun);
}

/**
 * Fetches a track's audio features from Spotify.
 * @param spotifyTrackId the Spotify ID of the artist
 * @return a promise for a track's audio features
 */
async function fetchSpotifyAudioFeatures(spotifyTrackId: string): Promise<any> {
  const requestFun = async (): Promise<any> => {
    const audioFeaturesResult: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/audio-features/${spotifyTrackId}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: store.get('spotifyAccessToken')
      }
    });

    return Promise.resolve(audioFeaturesResult);
  };

  return await makeSpotifyRequest(requestFun);
}

// Endpoints

const router: Router = Router();

router.get('/api/album-search', async (req: Request, res: Response): Promise<void> => {
  if (!('q' in req.query)) {
    res.status(400);
    res.send('Missing required args: q');
    return;
  }

  try {
    const searchResult: any = await fetchSpotifyAlbumSearch(String(req.query.q));
    res.json(searchResult.data.albums);
  } catch(err) {
    res.status(err.response.status);
    res.send(err.response.statusText);
  }
});

router.get('/api/artist', async (req: Request, res: Response): Promise<void> => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  try {
    const artistResult: any = await fetchSpotifyArtist(String(req.query.id));
    res.json(artistResult.data);
  } catch(err) {
    res.status(err.response.status);
    res.send(err.response.statusText);
  }
});

router.get('/api/spotify-album-tracks', async (req: Request, res: Response): Promise<void> => {
  if (!('spotifyAlbumId' in req.query)) {
    res.status(400);
    res.send('Missing required args: spotifyAlbumId');
    return;
  }

  try {
    const tracksResult: any = await fetchSpotifyAlbumTracks(String(req.query.spotifyAlbumId));
    res.json(tracksResult.data);
  } catch(err) {
    res.status(err.response.status);
    res.send(err.response.statusText);
  }
});

router.get('/api/spotify-audio-features', async (req: Request, res: Response) => {
  if (!('spotifyTrackId' in req.query)) {
    res.status(400);
    res.send('Missing required args: spotifyTrackId');
    return;
  }

  try {
    const audioFeaturesResult: any = await fetchSpotifyAudioFeatures(String(req.query.spotifyTrackId));
    res.json(audioFeaturesResult.data);
  } catch(err) {
    res.status(err.response.status);
    res.send(err.response.statusText);
  }
});

export default router;
