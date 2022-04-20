// Import modules
import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define interface
interface IClub {
  id: string,
  name: string,
  currentRoundId: string,
  participantIds: string[],
  roundIds: string[]
}

class ClubModel {

  private static model: mongoose.Model<IClub>;

  public static setup(): void {
    // Define schema
    const schema: mongoose.Schema = new mongoose.Schema(
      {
        id: String,
        name: String,
        currentRoundId: String,
        participantIds: [String],
        roundIds: [String]
      },
      { collection: 'clubs' }
    );

    // Compile model from schema
    this.model = mongoose.model<IClub>('Club', schema);
  }

  /**
   * Creates a club in the database.
   * @param name name of the club
   * @return the created club
   */
  public static async create(name: string): Promise<IClub> {
    try {
      // Define club document
      const clubDoc: IClub = {
        id: uuidv4(),
        name,
        currentRoundId: null,
        participantIds: [],
        roundIds: []
      };

      // Create club in database
      const createdClub: IClub = await this.model.create(clubDoc);

      return Promise.resolve(createdClub);
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Updates a club.
   * @param id ID of the club to update
   * @return the updated club
   */
  public static async update(id: string, updateData: any): Promise<IClub> {
    const updatedClub: IClub = await this.model.findOneAndUpdate({ id }, updateData, { new: true, useFindAndModify: false });
    return Promise.resolve(updatedClub);
  }

  /**
   * Deletes a club.
   * @param id ID of the club to delete
   * @return the deleted club
   */
  public static async delete(id: string): Promise<IClub> {
    const deletedClub: IClub = await this.model.findOneAndDelete({ id });
    return Promise.resolve(deletedClub);
  }

  /**
   * Gets a club.
   * @param id ID of the club to get
   * @return the specified club
   */
  public static async get(id: string): Promise<IClub> {
    const foundClub: IClub = await this.model.findOne({ id }).lean();
    return Promise.resolve(foundClub);
  }

  /**
   * Gets all clubs.
   */
  public static async getAll(): Promise<IClub[]> {
    const allClubs: IClub[] = await this.model.find({}).lean();
    return Promise.resolve(allClubs);
  }

  public static getModel() {
    return this.model;
  }

}

export { ClubModel };
