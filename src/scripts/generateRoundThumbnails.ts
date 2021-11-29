/*
 * Generates a thumbnail image for each round.
 */

import RoundThumbnailManager from '../RoundThumbnailManager';

import { Database } from '../Database';

import IRound from '../interfaces/IRound';

import { AlbumModel } from '../models/AlbumModel';
import { RoundModel } from '../models/RoundModel';

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
RoundModel.setup();

RoundThumbnailManager.setup();

RoundModel.getModel().find({}, async (err: any, rounds: IRound[]) => {

  // Generate round thumbnails
  const thumbnailPromises = rounds.map(async (round: IRound) => {
    return RoundThumbnailManager.generateThumbnail(round, 400);
  });

  try {
    // Wait for all thumbnails to finish generating
    await Promise.all(thumbnailPromises);
  } catch(err) {
    // tslint:disable-next-line:no-console
    console.log(err);
  }

  // Exit
  process.exit(0);
});
