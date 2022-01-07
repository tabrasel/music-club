// Import modules
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import * as dotenv from 'dotenv';
import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/api/auth', (req: Request, res: Response) => {
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}`);
});

router.get('/api/callback', (req: any, res: any) => {
  const code = req.query.code || null;

  // Request token and pass it on
  // Source: https://github.com/spotify/web-api-auth-examples/issues/55
  axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    params: {
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code'
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
    // Store token data in user session
    req.session.spotifyApi = {
      accessToken: tokenRes.data.access_token,
      refreshToken: tokenRes.data.refresh_token,
      expiresIn: tokenRes.data.expires_in
    };

    // tslint:disable-next-line:no-console
    console.log(req.session.spotifyAccount.accessToken);

    // Redirect user out of Spotify authorization page
    res.redirect('/');


    /*
    axios({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    }).then((profileRes) => {
      // tslint:disable-next-line:no-console
      console.log(profileRes.data)
    }).catch(err => {
        // tslint:disable-next-line:no-console
        console.log(err)
    })
    */
  })
  .catch((error) => {
    // tslint:disable-next-line:no-console
    res.sendStatus(400);
  });
});

export default router;
