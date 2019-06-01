import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import admin from './routes/admin';

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

// endpoints
app.use('/admin', admin);

// erros
app.use((req, res) => {
  res.status(404);
  res.json({ message: 'Not found' });
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

export default app;
