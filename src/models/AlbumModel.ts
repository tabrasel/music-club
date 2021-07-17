import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define album interface
interface IAlbum {
  id: string,
  title: string,
  artist: string,
  trackCount: number,
  imageUrl: string,
  posterId: string,
  pickedTracks: {
    title: string,
    trackNumber: number,
    pickerIds: string[]
  }[],
  topTrackNumber: number
}

class AlbumModel {

  private static model: mongoose.Model<IAlbum>;

  public constructor() {
    // Define album schema
    const schema: mongoose.Schema = new mongoose.Schema(
      {
        id: String,
        title: String,
        artist: String,
        trackCount: Number,
        imageUrl: String,
        posterId: String,
        pickedTracks: [{
          title: String,
          trackNumber: Number,
          pickerIds: [String]
        }],
        topTrackNumber: Number
      },
      { collection: 'albums' }
    );

    // Compile album model
    AlbumModel.model = mongoose.model<IAlbum>('Album', schema);
  }

  // Create a new album document
  public static createAlbum(albumInfo: any, res: Response): any {
    // Define a document for the album
    const albumDoc: IAlbum = {
      id: uuidv4(),
      title: albumInfo.title,
      artist: albumInfo.artist,
      trackCount: albumInfo.trackCount,
      imageUrl: albumInfo.imageUrl,
      posterId: albumInfo.posterId,
      pickedTracks: [],
      topTrackNumber: null
    }

    // Create the album document in the database
    this.model.create(albumDoc, (err: NativeError, album: Document) => {
      if (err) {
        res.json("Failed to create album");
      } else {
        res.json(album);
      }
    });
  }

  // Get a specified album
  public static getAlbum(res: Response, filter: any): any {
    const query = this.model.findOne(filter);
    query.exec((err: NativeError, album: Document) => {
      if (err) {
        res.json("Failed to get member");
      } else {
        res.json(album);
      }
    });
  }

}

export { AlbumModel };
