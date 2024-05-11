"use strict";
const { Pool } = require("pg");
const {
  dbP: { host, port, name, username, password },
} = require("../configs/config.database");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    const connectionString = `postgresql://${username}:${password}@${host}:${port}/${name}`;
    this.pool = new Pool({
      connectionString: connectionString
    });

    this.pool.on("connect", () => {
      console.log("Connected to PostgreSQL database");
    });

    this.pool.on("error", (err) => {
      console.error("Error connecting to PostgreSQL database:", err);
    });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async query(text, params) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(text, params);
      client.release();
      return result;
    } catch (err) {
      console.error("Error executing query:", err);
      throw err;
    }
  }
}

module.exports = Database.getInstance();
