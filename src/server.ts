// src/server.ts
import express from 'express';
import { Knex } from 'knex';
import config from './knexFile';
import authRoutes from './routes/authRoutes'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(authRoutes);

const port = process.env.PORT || 3000;


app.listen(port, async () => {
  try {
    const knexInstance: Knex = require('knex')(config);
    await knexInstance.migrate.latest();
    console.log(`Server is running at http://localhost:${port}`);
  } catch (error) {
    throw new Error("Unable to Start Virtual Class Server: " + error)
  }
});