// Import modules
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import { Request, Response, Router } from 'express';
import store from 'store2';

const router: Router = Router();

/**
 * Update the server's Spotify API access token.
 */
function updateAccessToken(): void {
  axios({
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
  .then((tokenRes: AxiosResponse) => {
    store.set('spotifyAccessToken', tokenRes.data.access_token);
  })
  .catch((tokenErr) => {
    // tslint:disable-next-line:no-console
    console.log(tokenErr);
  });
}

/**
 * Route for making a Spotify API album search request.
 */
router.get('/api/album-search', async (req: any, res: Response) => {
  // Define the request
  function fetchAlbumSearch(query: string): AxiosPromise {
    const accessToken: string = store.get('spotifyAccessToken');
    const encodedQuery: string = encodeURIComponent(query);

    const searchResult: AxiosPromise = axios({
      url: `https://api.spotify.com/v1/search?q=${encodedQuery}&type=album&limit=10`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: accessToken
      }
    })

    return searchResult;
  }

  // Try making the request
  try {
    const searchResult: any = await fetchAlbumSearch(req.query.q);
    res.json(searchResult.data.albums);
  } catch(err) {
    // Only retry if there was an authorization error
    if (err.response.status !== 401) {
      res.status(err.response.status);
      res.send(err.response.statusText);
      return;
    }

    // Try updating the access token
    try {
      await updateAccessToken();
    } catch(tokenErr) {
      res.status(tokenErr.response.status);
      res.send(tokenErr.response.statusText);
      return;
    }

    // Retry the request
    try {
      const searchResult: any = await fetchAlbumSearch(req.query.q);
      res.json(searchResult.data.albums);
    } catch(retryErr) {
      res.status(retryErr.response.status);
      res.send(retryErr.response.statusText);
    }
  }
});

/**
 * Route for making a Spotify API artist request.
 */
router.get('/api/artist', async (req: any, res: Response) => {
  // Define the request
  function fetchArtist(id: string): AxiosPromise {
    const accessToken: string = store.get('spotifyAccessToken');

    const artistResult: AxiosPromise = axios({
      url: `https://api.spotify.com/v1/artists/${id}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: accessToken
      }
    })

    return artistResult;
  }

  // Try making the request
  try {
    const artistResult: any = await fetchArtist(req.query.id);
    res.json(artistResult.data);
  } catch(err) {
    // Only retry if there was an authorization error
    if (err.response.status !== 401) {
      res.status(err.response.status);
      res.send(err.response.statusText);
      return;
    }

    // Try updating the access token
    try {
      await updateAccessToken();
    } catch(tokenErr) {
      res.status(tokenErr.response.status);
      res.send(tokenErr.response.statusText);
      return;
    }

    // Retry the request
    try {
      const artistResult: any = await fetchArtist(req.query.id);
      res.json(artistResult.data);
    } catch(retryErr) {
      res.status(retryErr.response.status);
      res.send(retryErr.response.statusText);
    }
  }
});

/**
 * Route for making a Spotify API album tracks request.
 */
router.get('/api/spotify-album-tracks', async (req: any, res: Response) => {
  // Define the request
  function fetchTracks(spotifyAlbumId: string): AxiosPromise {
    const accessToken: string = store.get('spotifyAccessToken');

    const tracksResult: AxiosPromise = axios({
      url: `https://api.spotify.com/v1/albums/${spotifyAlbumId}/tracks`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: accessToken
      }
    })

    return tracksResult;
  }

  // Try making the request
  try {
    const tracksResult: any = await fetchTracks(req.query.spotifyAlbumId);
    res.json(tracksResult.data);
  } catch(err) {
    // Only retry if there was an authorization error
    if (err.response.status !== 401) {
      res.status(err.response.status);
      res.send(err.response.statusText);
      return;
    }

    // Try updating the access token
    try {
      await updateAccessToken();
    } catch(tokenErr) {
      res.status(tokenErr.response.status);
      res.send(tokenErr.response.statusText);
      return;
    }

    // Retry the request
    try {
      const tracksResult: any = await fetchTracks(req.query.spotifyAlbumId);
      res.json(tracksResult.data);
    } catch(retryErr) {
      res.status(retryErr.response.status);
      res.send(retryErr.response.statusText);
    }
  }
});

export default router;
