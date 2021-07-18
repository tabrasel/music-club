// Import modules
import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define album interface
interface IMember {
  id: string,
  firstName: string,
  lastName: string,
  participatedRoundIds: string[],
  postedAlbumIds: string[]
}

class MemberModel {

  private static model: mongoose.Model<IMember>;

  public static setup(): void {
    // Define member schema
    const schema: mongoose.Schema = new mongoose.Schema(
      {
        id: String,
        firstName: String,
        lastName: String,
        participatedRoundIds: [String],
        postedAlbumIds: [String]
      },
      { collection: 'members' }
    );

    // Compile member model from schema
    this.model = mongoose.model<IMember>('Member', schema);
  }

  /**
   * Create a new member document in the database.
   */
  public static createMember(req: any, res: Response): void {
    // Define a document for the member
    const memberInfo = req.body;
    const memberDoc: IMember = {
      id: uuidv4(),
      firstName: memberInfo.firstName,
      lastName: memberInfo.lastName,
      participatedRoundIds: [],
      postedAlbumIds: []
    }

    // Create the member document in the database
    this.model.create(memberDoc, (err: NativeError, member: Document) => {
      if (err) {
        res.json("Failed to create member");
      } else {
        res.json(member);
      }
    });
  }

  /**
   * Get a specified member.
   */
  public static getMember(req: any, res: Response): void {
    const query: any = this.model.findOne(req.query);
    query.exec((err: NativeError, member: Document) => {
      if (err) {
        res.json("Failed to get member");
      } else {
        res.json(member);
      }
    });
  }

}

export { MemberModel };
