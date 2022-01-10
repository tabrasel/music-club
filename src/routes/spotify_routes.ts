// Import modules
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import { Request, Response, Router } from 'express';
import store from 'store2';

const router: Router = Router();

async function searchForAlbum(query: string): Promise<any> {
  const accessToken = store.get('spotifyAccessToken');
  const encodedQuery: string = encodeURIComponent(query);

  const searchResult: any = axios({
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

// Search for an album
router.get('/api/album-search', async (req: any, res: Response) => {
  try {
    const searchResult: any = await searchForAlbum(req.query.q);
    res.json(searchResult.data.albums);
  } catch(err) {
    if (err.response.status !== 401) {
      res.status(err.response.status);
      res.send(err.response.statusText);
      return;
    }

    // If the initial request was unauthorized, request a new token and try again
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
    .then(async (tokenRes) => {
      store.set('spotifyAccessToken', tokenRes.data.access_token);
      try {
        const searchResultRetry: any = await searchForAlbum(req.query.q);
        res.json(searchResultRetry.data.albums);
      } catch(searchResultRetryErr) {
        res.status(searchResultRetryErr.response.status);
        res.send(searchResultRetryErr.response.statusText);
      }
    })
    .catch((tokenErr) => {
      res.status(tokenErr.response.status);
      res.send(tokenErr.response.statusText);
    });
  }
});

export default router;
