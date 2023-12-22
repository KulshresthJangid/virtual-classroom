import { resolve } from "path";
import { ISubmissionDetails } from "../../core-typings/ISubmissionDetails";
import { ISubmissionDetailsModel } from "../../model-typings/ISubmissionDetailsModel";
import { BaseRaw } from "./BaseRaw";
import * as mysql from 'mysql';
import { AssignmentStatus } from "../../enums/AssignmentStatus";
import { SubmissionStatus } from "../../enums/SubmissionStatus";

export class SubmissionDetails extends BaseRaw<ISubmissionDetails> implements ISubmissionDetailsModel {
    constructor(db: mysql.Connection, tableName: string) {
        super(db, tableName);
    }
    findByStudentUsernameAndAssignmentId(studentUsername: string, assignmentId: number, status?: SubmissionStatus): Promise<ISubmissionDetails> {
        try {
            console.log("assignmentiod", assignmentId)
            return new Promise((resolve, reject) => {
                let query = `SELECT * FROM ${this.tableName} WHERE student_username = ? AND assignment_id = ? AND is_enabled = true`;
                let inputArr = [studentUsername, assignmentId]
                if (status) {
                    query += ` AND status = ?`;
                    inputArr.push(status);
                }

                this.mysqlConnection.query(query, inputArr, (err, result) => {
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

    async updateByStudentUsernameAndAssignmentId(studentUsername: string, assignmentId: number, data: ISubmissionDetails): Promise<mysql.OkPacket> {
        try {
            return new Promise((resolve, reject) => {
                this.mysqlConnection.query(`UPDATE ${this.tableName} SET ? WHERE student_username = ? AND assignment_id = ? `, [data, studentUsername, assignmentId], (err, result) => {
                    if (err) reject(err)
                    else resolve(result);
                })
            })
        } catch (error) {
            throw new Error(`Error while updating the subimssion by ${studentUsername} for assignment id ${assignmentId} ${error}`);
        }
    }

    async findByStudentUsername(studentUsername: string, submissionStatus?: SubmissionStatus): Promise<ISubmissionDetails[] | null> {
        try {
            return new Promise((resolve, reject) => {
                let query = `SELECT * FROM ${this.tableName} WHERE student_username = ? AND is_enabled = true`;
                let inputArr = [studentUsername];
                if (submissionStatus) {
                    query += ` AND status = ?`;
                    inputArr.push(submissionStatus);
                }
                console.log("query", query)
                this.mysqlConnection.query(query, inputArr, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                })
            })
        } catch (error) {
            throw new Error(`Error while getting submission by username ${studentUsername} ${error}`);
        }
    }

    async findByStudentUsernameWithAssignmentDetails(studentUsername: string, assignmentStatus?: AssignmentStatus): Promise<ISubmissionDetails[] | null> {
        try {
            return new Promise((resolve, reject) => {
                let query = `
                    SELECT 
                        sd.*,
                        ad.description AS assignment_description,
                        ad.status AS assignment_status,
                        ad.deadline_at AS assignment_deadline
                    FROM ${this.tableName} sd
                    JOIN assignment_details ad ON sd.assignment_id = ad.id
                    WHERE sd.student_username = ? AND sd.is_enabled = true`;

                const queryParams = [studentUsername];

                if (assignmentStatus) {
                    query += ' AND ad.status = ?';
                    queryParams.push(assignmentStatus);
                }

                this.mysqlConnection.query(query, queryParams, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        const submissionsWithAssignment: ISubmissionDetails[] = result.map((row: any) => ({
                            ...row,
                            assignment: {
                                id: row.assignment_id,
                                description: row.assignment_description,
                                status: row.assignment_status,
                                deadline_at: row.assignment_deadline,
                            },
                        }));

                        resolve(submissionsWithAssignment);
                    }
                });
            });
        } catch (error) {
            throw new Error(`Error while getting submissions by username ${studentUsername}: ${error}`);
        }
    }


    async findByAssignmentId(assignmentId: number): Promise<ISubmissionDetails[] | null> {
        try {
            return new Promise((resolve, reject) => {
                this.mysqlConnection.query(`SELECT * FROM ${this.tableName} WHERE assignment_id = ? AND is_enabled = true`, [assignmentId], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                })
            })
        } catch (error) {
            throw new Error(`Error while getting submissions by assignment id ${assignmentId} ${error}`);
        }
    }

}