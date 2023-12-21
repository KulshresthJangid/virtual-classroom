import type { Knex } from "knex";
import { SubmissionStatus } from "../enums/SubmissionStatus";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('assignment_submissions_details', (table) => {
        table.increments('id').primary();
        table.integer('student_id').unsigned().notNullable().references('id').inTable('users');
        table.integer('assignment_id').unsigned().notNullable().references('id').inTable('assignment_details');
        const statuses = Object.values(SubmissionStatus).map(status => status.toString());
        table.enum('status', statuses);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at');
        table.boolean('is_enabled').defaultTo(true);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('assignment_submissions_details');
}