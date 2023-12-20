import { UserRoles } from "../enums/UserRoles";
import { IBase } from "./IBase";

export interface IUsers extends IBase {
    username: string;
    password: string;
    role: UserRoles;
}