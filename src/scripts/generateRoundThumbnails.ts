/*
 * Generates a thumbnail image for each round.
 */

import { DatabaseService } from '../DatabaseService';
import { ISecretService, SecretServiceGCP } from '../SecretService';
import RoundThumbnailManager from '../RoundThumbnailManager';

import IRound from '../interfaces/IRound';

import { AlbumModel } from '../models/AlbumModel';
import { RoundModel } from '../models/RoundModel';


async function run(): Promise<void> {
  const secretService: ISecretService = new SecretServiceGCP();
  await secretService.setup();

  const databaseService: DatabaseService = new DatabaseService();
  await databaseService.setup(secretService);

  RoundThumbnailManager.setup();

  databaseService.connect();

  AlbumModel.setup();
  RoundModel.setup();

  // Get all rounds
  const rounds: IRound[] = await RoundModel.getModel().find({});

  // Generate a thumbnail for each round
  const thumbnailPromises = rounds.map(async (round: IRound) => RoundThumbnailManager.generateThumbnail(round, 400));

  // Wait for all thumbnails to finish generating
  await Promise.all(thumbnailPromises);

  process.exit(0);
}

run();
