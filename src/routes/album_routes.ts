// Import modules
import { Request, Response, Router } from 'express';

// Import interfaces
import IAlbum from '../interfaces/IAlbum';

// Import model
import { AlbumModel } from '../models/AlbumModel';

const router: Router = Router();

// Create a new album
router.post('/api/album', (req: Request, res: Response): void => {
  if (!('spotifyId' in req.body)) {
    res.status(400);
    res.send('Bad request. Missing arg: spotifyId');
    return;
  }

  if (!('posterId' in req.body)) {
    res.status(400);
    res.send('Bad request. Missing arg: posterId');
    return;
  }

  AlbumModel.create(req.body.spotifyId, req.body.posterId)
    .then((createdAlbum: IAlbum): void => {
      res.json(createdAlbum);
    })
    .catch((err: any): void => {
      res.status(err.response.status || 500).send({
        error: {
          status: err.response.status || 500,
          message: err.response.statusText || 'Internal server error',
        }
      });
    });
});

// Update an existing album
router.put('/api/album', (req: Request, res: Response): void => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  if (req.body === null) {
    res.status(400);
    res.send('Missing required args: request body');
    return;
  }

  AlbumModel.update(String(req.query.id), req.body)
    .then((updatedAlbum: IAlbum): void => {
      res.json(updatedAlbum);
    })
    .catch((err: any): void => {
      res.status(err.response.status || 500).send({
        error: {
          status: err.response.status || 500,
          message: err.response.statusText || 'Internal server error',
        }
      });
    });
})

// Delete an existing album
router.delete('/api/album', (req: Request, res: Response): void => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  AlbumModel.delete(String(req.query.id))
    .then((deletedAlbum: IAlbum): void => {
      res.json(deletedAlbum);
    })
    .catch((err: any): void => {
      res.status(err.response.status || 500).send({
        error: {
          status: err.response.status || 500,
          message: err.response.statusText || 'Internal server error',
        }
      });
    });
});

// Get an album
router.get('/api/album', (req: Request, res: Response): void => {
  if (!('id' in req.query)) {
    res.status(400);
    res.send('Missing required args: id');
    return;
  }

  AlbumModel.get(String(req.query.id))
    .then((foundAlbum: IAlbum): void => {
      if (foundAlbum === null) {
        res.status(404).send({
          error: {
            status: 404,
            message: 'Could not find requested album',
          }
        });
        return;
      }

      res.json(foundAlbum);
    })
    .catch((err: any): void => {
      res.status(err.response.status || 500).send({
        error: {
          status: err.response.status || 500,
          message: err.response.statusText || 'Internal server error',
        }
      });
    });
});

export default router;
