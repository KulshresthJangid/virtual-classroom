import type { Knex } from "knex";
import { UserRoles } from "../enums/UserRoles";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
        const enumValues = Object.values(UserRoles).map(role => role.toString());
        table.enum('role', enumValues);
        table.dateTime('createdAt').defaultTo(knex.fn.now());
        table.dateTime('updatedAt');
        table.boolean('isEnabled').defaultTo(true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}

