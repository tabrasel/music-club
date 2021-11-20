/*
 * Generates a thumbnail image for each round.
 */

import { uploadImageBuffer } from '../S3';

import RoundThumbnailGenerator from '../RoundThumbnailGenerator';

import { Database } from '../Database';

import IRound from '../interfaces/IRound';

import { RoundModel } from '../models/RoundModel';

// Connect to database
Database.connect();

// Set up models
RoundModel.setup();

RoundThumbnailGenerator.setup();

RoundModel.getModel().find({}, async (err: any, rounds: IRound[]) => {

  const thumbnailPromises = rounds.map(async (round: IRound) => {

    try {
      // Generate thumbnail
      const imgBuffer = await RoundThumbnailGenerator.generate(round, 400);

      // Store thumbnail
      const key: string = 'round_thumbnails/' + round.id + '.jpeg';
      await uploadImageBuffer(imgBuffer, key, 'image/jpeg');
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
