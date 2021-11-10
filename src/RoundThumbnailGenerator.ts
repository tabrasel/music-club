import { createCanvas, loadImage, registerFont } from 'canvas';
import * as fs from 'fs';

// Import models
import { AlbumModel } from './models/AlbumModel';

class RoundThumbnailGenerator {

  public static setup() {
    registerFont('./src/Poppins-ExtraLight.ttf', { family: 'Poppins' });
  }

  public static async generate(round: any, size: number): Promise<string> {
    // Define thumbnail dimensions and layout
    const gap: number = size * 0.04;
    const albumSize: number = (size - gap * 3) / 2;
    const labelSize: number = size * 0.125;

    // Load album images
    const albumImgs = await this.fetchAlbumImages(round);

    // Create canvas and context
    const canvas = createCanvas(size, size);
    const context = canvas.getContext('2d');

    // Draw white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, size, size);

    // Draw album images placeholders
    context.fillStyle = '#ddd';
    context.fillRect(gap, gap, albumSize, albumSize);
    context.fillRect(size / 2 + gap / 2, gap, albumSize, albumSize);
    context.fillRect(gap, size / 2 + gap / 2, albumSize, albumSize);
    context.fillRect(size / 2 + gap / 2, size / 2 + gap / 2, albumSize, albumSize);

    // Draw album images
    if (albumImgs !== null) {
      if (albumImgs.length > 0 && albumImgs[0] !== null) context.drawImage(albumImgs[0], gap, gap, albumSize, albumSize);
      if (albumImgs.length > 1 && albumImgs[1] !== null) context.drawImage(albumImgs[1], size - gap - albumSize, gap, albumSize, albumSize);
      if (albumImgs.length > 2 && albumImgs[2] !== null) context.drawImage(albumImgs[2], gap, size - gap - albumSize, albumSize, albumSize);
      if (albumImgs.length > 3 && albumImgs[3] !== null) context.drawImage(albumImgs[3], size - gap - albumSize, size - gap - albumSize, albumSize, albumSize);
    }

    // Draw round number label
    context.beginPath();
    context.arc(size / 2, size / 2, labelSize, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();

    // Draw round number text
    context.fillStyle = 'black';
    context.font = labelSize + 'px "Poppins"';
    context.textAlign = 'center';
    const textMetrics = context.measureText('' + round.number);
    const textHeight  = textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent;
    context.fillText('' + round.number, size / 2, size / 2 + textHeight / 2);

    // Save thumbnail image file
    const filepath: string = './thumbnail_' + round.id + '.jpeg';
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(filepath, buffer);

    return Promise.resolve(filepath);
  }

  private static async fetchAlbumImages(round: any): Promise<any[]> {
    // Fetch albums
    const albumPromises: any[] = round.albumIds.map((albumId: string) => {
      return AlbumModel.getModel().findOne({ id: albumId }, (err: any, album: any) => Promise.resolve(album));
    });
    const albums: any[] = await Promise.all(albumPromises);

    // Fetch album images
    const albumImgPromises = albums.map((album: any) => {
      return loadImage(album.imageUrl).catch(err => { return null });
    });

    return Promise.all(albumImgPromises).catch(err => { return null });
  }

}

export default RoundThumbnailGenerator;