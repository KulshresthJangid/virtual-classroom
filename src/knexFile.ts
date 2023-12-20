import { Knex } from 'knex';

const config: Knex.Config = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'virtual_classroom',
    },
    migrations: {
        tableName: 'migrations',
        directory: './src/migrations'
    }
}

export default config;