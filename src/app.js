import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './swaggerSpec';
import admin from './routes/admin';
import transaction from './routes/transaction';

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// swagger
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// endpoints
app.use('/admin', admin);
app.use('/transaction', transaction);

// erros
app.use((req, res) => {
  res.status(404);
  res.json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  process.stdout.write(`${error.stack}\n`);

  res.status(statusCode).json({
    statusCode,
    message
  });
});

export default app;
