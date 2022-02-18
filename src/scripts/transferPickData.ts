/*
 * Sets each round's particpantIds by using album poster IDs.
 */

import { Database } from '../Database';

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

interface IAlbumUpdateData {
  topDiskNumber: number,
  topTrackNumber: number,
  tracks: ITrack[]
};

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();

AlbumModel.getAll()
  .then(async (albums: IAlbum[]): Promise<void> => {
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
  })
  .catch((err: any): void => {
    // tslint:disable-next-line:no-console
    console.log(err);
    process.exit(1);
  });
