import type { Knex } from "knex";
import { UserRoles } from "../enums/UserRoles";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        const roles = Object.values(UserRoles).map(role => role.toString());
        table.enum('role', roles);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at');
        table.boolean('is_enabled').defaultTo(true);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}

