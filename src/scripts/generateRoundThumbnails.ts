/*
 * Generates a thumbnail image for each round.
 */

import { createCanvas, loadImage, registerFont } from 'canvas';
import * as fs from 'fs';

import RoundThumbnailGenerator from '../RoundThumbnailGenerator';

import { Database } from '../Database';

import IRound from '../interfaces/IRound';

import { AlbumModel } from '../models/AlbumModel';
import { RoundModel } from '../models/RoundModel';

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
RoundModel.setup();

RoundThumbnailGenerator.setup();

RoundModel.getModel().find({}, async (err: any, rounds: IRound[]) => {

  const updatePromises = rounds.map(async (round: IRound) => {
    // Generate thumbnail image file
    const thumbnailPath = await RoundThumbnailGenerator.generate(round, 400);
    return Promise.resolve();
  });

  // Wait for all updates to process
  await Promise.all(updatePromises);

  // Exit
  process.exit(0);

});
