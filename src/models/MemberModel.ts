// Import modules
import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define member interface
interface IMember {
  id: string,
  firstName: string,
  lastName: string,
  color: string,
  participatedRoundIds: string[],
  postedAlbumIds: string[],
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
        color: String,
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
      color: memberInfo.color,
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
   * Update an existing member.
   */
  public static updateMember(req: any, res: Response): any {
    const filter: any = { id: req.query.id };
    const updatedData: any = req.body;

    const query = this.model.findOneAndUpdate(
      filter,
      updatedData,
      { new: true, useFindAndModify: false }
    );

    query.exec((err: NativeError, updatedMember) => {
      if (err) {
        res.json("Failed to update member");
      } else {
        res.json(updatedMember);
      }
    });
  }

  /**
   * Delete an existing member.
   */
  public static deleteMember(req: any, res: Response): any {
    const query: any = this.model.findOneAndDelete(req.query);

    query.exec((err: NativeError, member: Document) => {
      if (err) {
        res.json("Failed to delete member");
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

  /**
   * Get all members.
   */
  public static getAllMembers(res: any): any {
    const query = this.model.find({});
    query.exec((err, members) => {
      if (err) res.json("Failed to get all members");
      res.json(members);
    });
  }

  public static getModel() {
    return this.model;
  }

}

export { MemberModel };
