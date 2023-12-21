import { IAssignmentDetails } from "../../core-typings/IAssignmentDetails";
import { IAssignmentDetailsModel } from "../../model-typings/IAssignmentDetailsModel";
import { BaseRaw } from "./BaseRaw";
import * as mysql from 'mysql';

export class AssignmentDetails extends BaseRaw<IAssignmentDetails> implements IAssignmentDetailsModel {
    constructor(db: mysql.Connection, tableName: string) {
        super(db, tableName);
    }
}