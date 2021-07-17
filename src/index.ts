import express, { Application, Request, Response } from 'express';
import { Connection, Schema, connect, connection, model } from 'mongoose';

// Import models
import { AlbumModel } from './models/AlbumModel';

// Import routes
import albumRoutes from './routes/album_routes';

const app: Application = express();
const port: number = 80;

const MONGO_URI: string = 'mongodb+srv://tatebrasel:7hQfLPox7nZ6jB9T@cluster1.m1uha.mongodb.net/music-share?retryWrites=true&w=majority';
connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db: Connection = connection;

db.once('open', () => {
  // tslint:disable-next-line:no-console
  console.log('Connected to database');
});

db.on('error', () => {
  // tslint:disable-next-line:no-console
  console.error.bind(console, 'connection error:')
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
})

app.use(albumRoutes);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at http://localhost:${port}`);
})
