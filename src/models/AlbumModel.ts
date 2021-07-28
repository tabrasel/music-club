// Import modules
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

  public static setup(): void {
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
    this.model = mongoose.model<IAlbum>('Album', schema);
  }

  /**
   * Create a new album document.
   */
  public static createAlbum(req: any, res: Response): void {
    // Define a document for the album
    const albumInfo = req.body;
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

  /**
   * Update an existing album.
   */
  public static updateAlbum(req: any, res: Response): any {
    const filter: any = { id: req.query.id };
    const updatedData: any = req.body;

    const query = this.model.findOneAndUpdate(filter, updatedData, { new: true });

    query.exec((err: NativeError, updatedAlbum) => {
      if (err) {
        res.json("Failed to update album");
      } else {
        res.json(updatedAlbum);
      }
    });
  }

  /**
   * Get a specified album.
   */
  public static getAlbum(req: any, res: Response): void {
    const query: any = this.model.findOne(req.query);
    query.exec((err: NativeError, album: Document) => {
      if (err) {
        res.json("Failed to get album");
      } else {
        res.json(album);
      }
    });
  }

}

export { AlbumModel };
