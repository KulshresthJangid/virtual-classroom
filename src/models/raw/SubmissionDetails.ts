import { resolve } from "path";
import { ISubmissionDetails } from "../../core-typings/ISubmissionDetails";
import { ISubmissionDetailsModel } from "../../model-typings/ISubmissionDetailsModel";
import { BaseRaw } from "./BaseRaw";
import * as mysql from 'mysql';

export class SubmissionDetails extends BaseRaw<ISubmissionDetails> implements ISubmissionDetailsModel {
    constructor(db: mysql.Connection, tableName: string) {
        super(db, tableName);
    }
    findByStudentUsernameAndAssignmentId(studentUsername: string, assignmentId: number): Promise<ISubmissionDetails> {
        try {
            return new Promise((resolve, reject) => {
                this.mysqlConnection.query(`SELECT * FROM ${this.tableName} WHERE student_username = ? AND assignment_id = ? AND is_enabled = true`, [studentUsername, assignmentId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
            });
        } catch (error) {
            // console.log("Error while getting submission by student id and assignment id", error);
            throw new Error("Error while getting submission by student id and assignment id " + error);
        }
    }

    async deleteByAssignmentId(assignmentId: number): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                this.mysqlConnection.query(`UPDATE ${this.tableName} SET is_enabled = false WHERE assignment_id = ?`, [assignmentId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        } catch (error) {
            throw new Error(`Error while Delting submission with assignment id ${assignmentId} ${error}`);
        }
    }

}