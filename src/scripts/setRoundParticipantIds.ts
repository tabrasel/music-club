/*
 * Sets each round's particpantIds by using album poster IDs.
 */

import { Database } from '../Database';

// Import interfaces
import IAlbum from '../interfaces/IAlbum';
import IRound from '../interfaces/IRound';

// Import models
import { AlbumModel } from '../models/AlbumModel';
import { RoundModel } from '../models/RoundModel';

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
RoundModel.setup();

// Get all rounds
RoundModel.getModel().find({}, (err: any, rounds: IRound[]) => {

  for (const round of rounds) {
    if (round.participantIds.length !== 0) continue;

    // Get promises to load each round
    const albumQueries: any = round.albumIds.map((albumId: string) => {
      return AlbumModel.getModel().findOne({ id: albumId }, (err2: any, album: IAlbum) => {
        Promise.resolve(album);
      });
    });

    // Set particpantIds once all rounds are loaded
    Promise.all(albumQueries).then((albums: any) => {
      const filter: any = { id: round.id };
      const updatedData: any = { participantIds: albums.map((album: IAlbum) => album.posterId) };
      RoundModel.getModel().findOneAndUpdate(filter, updatedData, { new: true, useFindAndModify: false, strict: false }).exec();
    });
  }

});
