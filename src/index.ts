import express from 'express';

const app: express.Application = express();
const port: number = 80;

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello world!');
})

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at http://localhost:${port}`);
})
