import { IAssignmentDetails } from "../../core-typings/IAssignmentDetails";
import { IAssignmentDetailsModel } from "../../model-typings/IAssignmentDetailsModel";
import { BaseRaw } from "./BaseRaw";
import * as mysql from 'mysql';

export class AssignmentDetails extends BaseRaw<IAssignmentDetails> implements IAssignmentDetailsModel {
    constructor(db: mysql.Connection, tableName: string) {
        super(db, tableName);
    }

    async findByTutorId(tutorId: number): Promise<IAssignmentDetails | null> {
        return new Promise((resolve, reject) => {
            this.mysqlConnection.query(`SELECT * FROM ${this.tableName} WHERE tutor_id = ? AND is_enabled = true`, [tutorId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }
}