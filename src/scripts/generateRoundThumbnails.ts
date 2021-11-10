/*
 * Generates a thumbnail image for each round.
 */

import { createCanvas, loadImage, registerFont } from 'canvas';
import * as fs from 'fs';

import RoundThumbnailGenerator from '../RoundThumbnailGenerator';

import { Database } from '../Database';

// Import models
import { AlbumModel } from '../models/AlbumModel';
import { MemberModel } from '../models/MemberModel';
import { RoundModel } from '../models/RoundModel';

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
MemberModel.setup();
RoundModel.setup();

RoundThumbnailGenerator.setup();

RoundModel.getModel().find({}, async (err: any, rounds: any) => {

  const updatePromises = rounds.map(async (round: any) => {
    // Generate thumbnail image file
    const thumbnailPath = await RoundThumbnailGenerator.generate(round, 400);

    // TODO: Update round thumbnail to the new one
    const roundFilter: any = { id: round.id };
    // const updatedData: any = { thumbnail: { data: ???, contentType: 'image/jpeg' } };
    // RoundModel.getModel().findOneAndUpdate(roundFilter, updatedData, { new: true, useFindAndModify: false, strict: false }).exec();

    // TODO: Delete thumbnail image file

    return Promise.resolve(true);
  });

  // Wait for all updates to process
  await Promise.all(updatePromises);

  // Exit
  process.exit(0);

});
