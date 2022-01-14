// Import modules
import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import { Request, Response, Router } from 'express';
import store from 'store2';

const router: Router = Router();

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
  .then(async (tokenRes) => {
    store.set('spotifyAccessToken', tokenRes.data.access_token);
  })
  .catch((tokenErr) => {
    // tslint:disable-next-line:no-console
    console.log(tokenErr);
  });
}

function searchForAlbum(query: string): Promise<any> {
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

function fetchArtist(id: string): Promise<any> {
  const accessToken = store.get('spotifyAccessToken');

  const artistResult: any = axios({
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

// Search for an album
router.get('/api/album-search', async (req: any, res: Response) => {
  // Try making the request
  try {
    const searchResult: any = await searchForAlbum(req.query.q);
    res.json(searchResult.data.albums);
  } catch(err) {
    // Error if the issue wasn't authorization
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
      const searchResult: any = await searchForAlbum(req.query.q);
      res.json(searchResult.data.albums);
    } catch(retryErr) {
      res.status(err.response.status);
      res.send(err.response.statusText);
    }
  }
});

router.get('/api/artist', async (req: any, res: Response) => {
  // Try making the request
  try {
    const artistResult: any = await fetchArtist(req.query.id);
    res.json(artistResult.data);
  } catch(err) {
    // Error if the issue wasn't authorization
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
      res.status(err.response.status);
      res.send(err.response.statusText);
    }
  }
});

export default router;
