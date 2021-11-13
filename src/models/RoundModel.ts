// Import modules
import express, { Response } from 'express';
import mongoose, { Document, Model, NativeError, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import IRound from '../interfaces/IRound';

import RoundThumbnailGenerator from '../RoundThumbnailGenerator';

class RoundModel {

  private static model: Model<IRound>;

  public static setup(): void {
    // Define round schema
    const schema: Schema = new Schema(
      {
        id: String,
        number: Number,
        description: String,
        participantIds: [String],
        albumIds: [String],
        startDate: String,
        endDate: String,
        picksPerParticipant: Number
      },
      { collection: 'rounds' }
    );

    // Compile round model
    this.model = model<IRound>('Round', schema);
  }

  /**
   * Create a new round document.
   */
  public static createRound(req: any, res: Response): void {
    // Define a document for the round
    const roundInfo = req.body;

    const roundDoc: IRound = {
      id: uuidv4(),
      number: roundInfo.number,
      description: roundInfo.description,
      participantIds: roundInfo.participantIds,
      albumIds: [],
      startDate: roundInfo.startDate,
      endDate: roundInfo.endDate,
      picksPerParticipant: roundInfo.picksPerParticipant,
    }

    // Create the round document in the database
    this.model.create(roundDoc, (err: NativeError, round: Document) => {
      if (err) {
        res.json("Failed to create round");
      } else {
        res.json(round);
      }
    });

    RoundThumbnailGenerator.generate(roundDoc, 400);
  }

  /**
   * Update an existing round.
   */
  public static updateRound(req: any, res: Response): any {
    const filter: any = { id: req.query.id };

    // Regenerate thumbnail
    this.model.findOne(filter).exec((err: NativeError, round: any) => {
      RoundThumbnailGenerator.generate(round, 400);
    });

    // Set up update query
    const update: any = req.body;
    const updateQuery = this.model.findOneAndUpdate(filter, update, { new: true, useFindAndModify: false });

    // Execute update query
    updateQuery.exec((err: NativeError, updatedRound) => {
      if (err) {
        res.json("Failed to update round");
      } else {
        res.json(updatedRound);
      }
    });
  }

  /**
   * Delete an existing round.
   */
  public static deleteRound(req: any, res: Response): any {
    const query: any = this.model.findOneAndDelete(req.query);

    query.exec((err: NativeError, round: Document) => {
      if (err) {
        res.json("Failed to delete round");
      } else {
        res.json(round);
      }
    });
  }

  /**
   * Get a specified round from the database.
   */
  public static getRound(req: any, res: Response): void {
    const query: any = this.model.findOne(req.query);
    query.exec((err: NativeError, round: Document) => {
      if (err) {
        res.json("Failed to get round");
      } else {
        res.json(round);
      }
    });
  }

  /**
   * Get all rounds.
   */
  public static getAllRounds(res: any): any {
    const query = this.model.find({});
    query.exec((err, rounds) => {
      if (err) res.json("Failed to get all rounds");
      res.json(rounds);
    });
  }

  public static getModel() {
    return this.model;
  }

}

export { RoundModel };
