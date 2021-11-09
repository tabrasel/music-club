/*
 * Generates a thumbnail image for each round.
 */

import { createCanvas, loadImage, registerFont } from 'canvas';
import * as fs from 'fs';

import RoundThumbnailGenerator from './RoundThumbnailGenerator';

import { Database } from './Database';

// Import models
import { AlbumModel } from './models/AlbumModel';
import { MemberModel } from './models/MemberModel';
import { RoundModel } from './models/RoundModel';

// Connect to database
Database.connect();

// Set up models
AlbumModel.setup();
MemberModel.setup();
RoundModel.setup();

RoundThumbnailGenerator.setup();

RoundModel.getModel().find({}, async (err: any, rounds: any) => {

  const thumbnailImgPathPromises: any = rounds.map((round: any) => RoundThumbnailGenerator.generateThumbnail(round, 400));
  const thumbnailImgPaths = await Promise.all(thumbnailImgPathPromises);

  thumbnailImgPaths.forEach((thumbnailImgPath: string) => {
    // Update round thumbnail to the new one
    // const roundFilter: any = { id: round.id };
    // const updatedData: any = { thumbnailImg: { data: thumbnailImg, contentType: 'image/jpeg' } };
    // RoundModel.getModel().findOneAndUpdate(roundFilter, updatedData, { new: true, useFindAndModify: false, strict: false }).exec();

    // TODO: Delete thumbnail image file
  });

  process.exit(0);

});
