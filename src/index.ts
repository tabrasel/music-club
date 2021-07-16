import express, { Application, Request, Response } from 'express';
import { Connection, Schema, connect, connection, model } from 'mongoose';

const app: Application = express();
const port: number = 80;

const DB_HOST_URL: string = 'mongodb+srv://tatebrasel:7hQfLPox7nZ6jB9T@cluster1.m1uha.mongodb.net/music-share?retryWrites=true&w=majority';
connect(DB_HOST_URL, { useNewUrlParser: true, useUnifiedTopology: true });

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

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at http://localhost:${port}`);
})
