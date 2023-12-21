import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('assignment_details', (table) => {
        table.increments('id').primary();
        table.string('description').notNullable();
        table.integer('tutor_id').unsigned().notNullable().references('id').inTable('users');
        table.dateTime('published_at').notNullable();
        table.datetime('deadline_at').notNullable();
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at');
        table.boolean('is_enabled').defaultTo(true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('assignment_details');
}
