import { IUsers } from "../../core-typings/IUsers";
import { IUsersModel } from "../../model-typings/IUsersModel";
import { BaseRaw } from "./BaseRaw";
import * as mysql from 'mysql';

export class Users extends BaseRaw<IUsers> implements IUsersModel {
    constructor(db: mysql.Connection, tableName: string) {
        super(db, tableName);
    }

    async findByUserName(username: string): Promise<IUsers> {
        try {
            return new Promise((resolve, reject) => {
                this.mysqlConnection.query(`SELECT * FROM ${this.tableName} WHERE username = ?`, [username], (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result[0]);
                    }
                })
            });
        } catch (error) {
            throw new Error(`Error while finding the user by username`);
        }
    }

}