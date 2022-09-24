/*
 * Sets each round's particpantIds by using album poster IDs.
 */

import { DatabaseService } from '../services/DatabaseService';
import { ISecretService, SecretServiceGCP } from '../services/SecretService';

// Import interfaces
import IAlbum from '../interfaces/IAlbum';
import IRound from '../interfaces/IRound';

// Import models
import { AlbumModel } from '../models/AlbumModel';
import { RoundModel } from '../models/RoundModel';


async function run(): Promise<void> {
  const secretService: ISecretService = new SecretServiceGCP();
  await secretService.setup();

  const databaseService: DatabaseService = new DatabaseService();
  await databaseService.setup(secretService);

  databaseService.connect();

  AlbumModel.setup();
  RoundModel.setup();

  // Get all rounds
  const rounds: IRound[] = await RoundModel.getModel().find({});

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
}

run();
