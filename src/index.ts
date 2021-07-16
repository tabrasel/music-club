import express from 'express';
import mongoose from 'mongoose';

const app: express.Application = express();
const port: number = 80;

const DB_HOST_URL: string = 'mongodb+srv://tatebrasel:7hQfLPox7nZ6jB9T@cluster1.m1uha.mongodb.net/music-share?retryWrites=true&w=majority';
mongoose.connect(DB_HOST_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db: mongoose.Connection = mongoose.connection;

db.once('open', () => {
  // tslint:disable-next-line:no-console
  console.log('Connected to database');
});

db.on('error', () => {
  // tslint:disable-next-line:no-console
  console.error.bind(console, 'connection error:')
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello world!');
})

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at http://localhost:${port}`);
})
