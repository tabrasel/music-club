import { Application } from 'express';

import { App } from './App'

const server: Application = new App().expressApp;

server.listen(process.env.PORT || 80);

// tslint:disable-next-line:no-console
console.log("Server running on port 80");
