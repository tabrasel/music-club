// Import modules
import express, { Response } from 'express';
import mongoose, { Document, Model, NativeError, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import IMember from '../interfaces/IMember';
import IRound from '../interfaces/IRound';

import { MemberModel } from './MemberModel';

import RoundThumbnailManager from '../RoundThumbnailManager';

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

  public static async create(num: number, description: string, participantIds: string[], startDate: string, endDate: string, picksPerParticipant: number): Promise<IRound> {
    // Sort participants
    participantIds = await MemberModel.sortMemberIds(participantIds);

    // Define round document
    const roundDoc: IRound = {
      id: uuidv4(),
      number: num,
      description,
      participantIds,
      albumIds: [],
      startDate,
      endDate,
      picksPerParticipant
    }

    // Create round in database
    const createdRound: IRound = await this.model.create(roundDoc);

    // Generate thumbnail image
    RoundThumbnailManager.generateThumbnail(createdRound, 400);

    return Promise.resolve(createdRound);
  }

  /**
   * Updates a round.
   * @param id ID of the round to update
   * @return the updated round
   */
  public static async update(id: string, updateData: any): Promise<IRound> {
    const updatedRound: IRound = await this.model.findOneAndUpdate({ id }, updateData, { new: true, useFindAndModify: false });

    // Regenerate thumbnail image if necessary
    if ('participantIds' in updateData || 'albumIds' in updateData)
      RoundThumbnailManager.generateThumbnail(updatedRound, 400);

    return Promise.resolve(updatedRound);
  }

  /**
   * Deletes a round.
   * @param id ID of the round to delete
   * @return the deleted round
   */
  public static async delete(id: string): Promise<IRound> {
    const deletedRound: IRound = await this.model.findOneAndDelete({ id });
    return Promise.resolve(deletedRound);
  }

  /**
   * Gets a round.
   * @param id ID of the round to get
   * @return the specified round
   */
  public static async get(id: string): Promise<IRound> {
    const foundRound: IRound = await this.model.findOne({ id }).lean();
    return Promise.resolve(foundRound);
  }

  /**
   * Gets all rounds.
   */
  public static async getAll(): Promise<IRound[]> {
    const allRounds: IRound[] = await this.model.find({}).lean();
    return Promise.resolve(allRounds);
  }

  public static getModel() {
    return this.model;
  }

}

export { RoundModel };
