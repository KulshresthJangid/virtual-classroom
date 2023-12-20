import * as mysql from 'mysql';
import { IBaseModel } from '../../model-typings/IBaseModel';
import { IUsers } from '../../core-typings/IUsers';

export abstract class BaseRaw<T extends { id?: string }> implements IBaseModel<T> {
    protected mysqlConnection: mysql.Connection;
    protected tableName: string;

    constructor(mysqlConnection: mysql.Connection, tableName: string) {
        this.mysqlConnection = mysqlConnection;
        this.tableName = tableName;
    }

    getTableName(): string {
        return this.tableName;
    }

    async insert(data: T): Promise<T> {
        try {
            return await new Promise((resolve, reject) => {
                this.mysqlConnection.query(`INSERT INTO ${this.tableName} SET ?`, data, (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });    
            })
            
        } catch (error) {
            throw new Error(`Error while Inserting in table ${this.tableName} ${error}`);
        }
    }

    async update(id: T['id'], data: Partial<T>): Promise<void> {
        try {
            this.mysqlConnection.query(`UPDATE ${this.tableName} SET ? WHERE id = ?`, [data, id]);
        } catch (error) {
            throw new Error(`Error while Updating in table ${this.tableName}`);
        }
    }

    async delete(id: T['id']): Promise<void> {
        try {
            this.mysqlConnection.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        } catch (error) {
            throw new Error(`Error while Deleting in table ${this.tableName}`);
        }
    }

    async findById(id: T['id']): Promise<T | null> {
        try {
            const results: T[] = await new Promise((resolve, reject) => {
                this.mysqlConnection.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id], (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result)
                    }
                });
            });
            return results.length > 0 ? results[0]: null;
        } catch (error) {
            throw new Error(`Error while Finding in table ${this.tableName}`);
        }
    }
}