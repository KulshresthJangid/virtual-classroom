import * as mysql from 'mysql';
import assert from 'assert';

const { SQL_USER, SQL_HOST, SQL_PASS, SQL_DB_NAME } = process.env;

assert(SQL_DB_NAME, "Please Provide SQL_DB_NAME");
assert(SQL_PASS, "Please Provide SQL_PASS");
assert(SQL_HOST, "Please Provide SQL_HOST");
assert(SQL_USER, "Please Provide SQL_USER");

export const db: mysql.Connection = mysql.createConnection({
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASS,
    database: SQL_DB_NAME,
});