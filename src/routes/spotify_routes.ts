// Import modules
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import { Request, Response, Router } from 'express';
import store from 'store2';

const router: Router = Router();

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
 * Make a request to the Spotify API. If the initial request was unauthorized, try updating the access  token and retry
 * the request.
 * @param reqFun request function to perform
 * @param res    result object of the route which called this function
 */
async function makeSpotifyRequest(reqFun: any, res: Response): Promise<void> {
  try {
    await reqFun();
  } catch(err) {
    // Only retry the request if there was an authorization error
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
      await reqFun();
    } catch(retryErr) {
      res.status(retryErr.response.status);
      res.send(retryErr.response.statusText);
    }
  }
}

// TODO: Make the search endpoint more generic. Let the client define the item type.

/**
 * Endpoint for making a Spotify API album search request.
 */
router.get('/api/album-search', async (req: any, res: Response): Promise<void> => {
  const encodedQuery: string = encodeURIComponent(req.query.q);

  const requestFun = async (): Promise<void> => {
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

    res.json(searchResult.data.albums);
  };

  makeSpotifyRequest(requestFun, res);
});

/**
 * Endpoint for making a Spotify API artist request.
 */
router.get('/api/artist', async (req: any, res: Response): Promise<void> => {
  const requestFun = async (): Promise<void> => {
    const artistResult: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/artists/${req.query.id}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: store.get('spotifyAccessToken')
      }
    });

   res.json(artistResult.data);
 };

 makeSpotifyRequest(requestFun, res);
});

/**
 * Endpoint for making a Spotify API album tracks request.
 */
router.get('/api/spotify-album-tracks', async (req: any, res: Response): Promise<void> => {
  const requestFun = async (): Promise<void> => {
    const tracksResult: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/albums/${req.query.spotifyAlbumId}/tracks`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: store.get('spotifyAccessToken')
      }
    });

    res.json(tracksResult.data);
  };

  makeSpotifyRequest(requestFun, res);
});

/**
 * Endpoint for making a Spotify API audio features request.
 */
router.get('/api/spotify-audio-features', async (req: any, res: Response) => {
  const requestFun = async (): Promise<void> => {
    const audioFeaturesResult: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/audio-features/${req.query.spotifyTrackId}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: store.get('spotifyAccessToken')
      }
    });

    res.json(audioFeaturesResult.data);
  };

  makeSpotifyRequest(requestFun, res);
});

export default router;
