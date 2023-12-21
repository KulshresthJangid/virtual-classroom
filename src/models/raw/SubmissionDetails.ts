import { ISubmissionDetails } from "../../core-typings/ISubmissionDetails";
import { ISubmissionDetailsModel } from "../../model-typings/ISubmissionDetailsModel";
import { BaseRaw } from "./BaseRaw";
import * as mysql from 'mysql';

export class SubmissionDetails extends BaseRaw<ISubmissionDetails> implements ISubmissionDetailsModel {
    constructor(db: mysql.Connection, tableName: string) {
        super(db, tableName);
    }
    findByStudentIdAndAssignmentId(studnentId: number, assignmentId: number): Promise<ISubmissionDetails> {
        try {
            return new Promise((resolve, reject) => {
                this.mysqlConnection.query(`SELECT * FROM ${this.tableName} WHERE student_id = ? AND assignment_id = ? AND is_enabled = true`, [studnentId, assignmentId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        } catch (error) {
            // console.log("Error while getting submission by student id and assignment id", error);
            throw new Error("Error while getting submission by student id and assignment id " + error);
        }
    }
}