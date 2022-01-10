// Import modules
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import * as dotenv from 'dotenv';
import { Request, Response, Router } from 'express';
import store from 'store2';

const router: Router = Router();

router.get('/api/token', (req: Request, res: Response) => {
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
  .then((tokenRes) => {
    store.set('spotifyAccessToken', tokenRes.data.access_token);
  })
  .catch((tokenErr) => {
    res.status(tokenErr.response.status);
    res.send(tokenErr.response.statusText);
  });
});

export default router;
