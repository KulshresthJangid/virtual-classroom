import type { Knex } from "knex";
import { SubmissionStatus } from "../enums/SubmissionStatus";
import { AssignmentStatus } from "../enums/AssignmentStatus";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('assignment_details', (table) => {
        table.increments('id').primary();
        table.string('description').notNullable();
        table.integer('tutor_id').unsigned().notNullable().references('id').inTable('users').index();
        table.dateTime('published_at').notNullable();
        table.dateTime('deadline_at').notNullable();
        const statuses = Object.values(AssignmentStatus).map(el => el.toString());
        table.enu('status', statuses);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at');
        table.boolean('is_enabled').defaultTo(true);
    });

    await knex.schema.createTable('assignment_submissions_details', (table) => {
        table.increments('id').primary();
        table.string('student_username').notNullable().references('username').inTable('users').index();
        table.integer('assignment_id').unsigned().notNullable().references('id').inTable('assignment_details').index();

        const statuses = Object.values(SubmissionStatus).map(status => status.toString());
        table.enu('status', statuses);  // Change 'enum' to 'enu'

        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at');
        table.boolean('is_enabled').defaultTo(true);

        table.unique(['student_username', 'assignment_id'], 'unique_submission');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('assignment_details');
    await knex.schema.dropTable('assignment_submissions_details');
    return;
}
