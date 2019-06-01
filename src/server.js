import express from 'express';

class Server {
  constructor() {
    this.app = express();
  }

  startup() {
    this.setupRoutes();

    this.app.listen(process.env.PORT || 3000, () =>
      process.stdout.write('Listening...\n')
    );
  }

  setupRoutes() {
    this.app.get('/test', (req, res) => {
      res.send('It works! :)');
    });
  }
}

export default Server;
