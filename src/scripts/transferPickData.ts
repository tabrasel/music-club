/*
 * Sets each round's particpantIds by using album poster IDs.
 */

import { DatabaseService } from '../services/DatabaseService';
import { ISecretService, SecretServiceGCP } from '../services/SecretService';

// Import interfaces
import IAlbum from '../interfaces/IAlbum';

// Import models
import { AlbumModel } from '../models/AlbumModel';


interface ITrack {
  title: string,
  diskNumber: number,
  trackNumber: number,
  duration: number,
  audioFeatures: {
    tempo: number,
    timeSignature: string,
    key: string,
    mode: string,
    acousticness: number,
    energy: number,
    danceability: number,
    instrumentalness: number,
    liveness: number,
    speechiness: number,
    valence: number
  },
  pickerIds: string[]
};


async function run(): Promise<void> {
  const secretService: ISecretService = new SecretServiceGCP();
  await secretService.setup();

  const databaseService: DatabaseService = new DatabaseService();
  await databaseService.setup(secretService);

  databaseService.connect();

  AlbumModel.setup();

  // Get all albums
  const albums: IAlbum[] = await AlbumModel.getAll();

  for (const album of albums) {
    // Define update data
    const albumUpdateData: any = {
      topDiskNumber: 1,
      topTrackNumber: album.topTrackNumber,
      tracks: album.tracks
    };

    // Transfer votes
    for (const pickedTrack of album.pickedTracks) {
      albumUpdateData.tracks[pickedTrack.trackNumber - 1] = {
        ...album.tracks[pickedTrack.trackNumber - 1],
        pickerIds: pickedTrack.pickerIds
      };
    }

    // Update album
    await AlbumModel.update(album.id, albumUpdateData);
  }

  process.exit(0);
}

run();
