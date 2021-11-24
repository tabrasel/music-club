/*
 * Generates a thumbnail image for each round.
 */

import RoundThumbnailManager from '../RoundThumbnailManager';

import { Database } from '../Database';

import IRound from '../interfaces/IRound';

import { RoundModel } from '../models/RoundModel';

// Connect to database
Database.connect();

// Set up models
RoundModel.setup();

RoundThumbnailManager.setup();

RoundModel.getModel().find({}, async (err: any, rounds: IRound[]) => {

  const thumbnailPromises = rounds.map(async (round: IRound) => {

    try {
      // Generate thumbnail
      await RoundThumbnailManager.generateThumbnail(round, 400);
    } catch(err) {
      // tslint:disable-next-line:no-console
      console.log(err);
    }

    return Promise.resolve();
  });

  // Wait for all thumbnails to generate
  await Promise.all(thumbnailPromises);

  // Exit
  process.exit(0);

});
