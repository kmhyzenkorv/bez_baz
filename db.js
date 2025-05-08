import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'root',
  host: '172.20.107.179',
  database: 'db',
  password: '1234',
  port: 5432,
});

export default pool;