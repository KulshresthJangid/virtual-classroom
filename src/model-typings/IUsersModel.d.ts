import { IBaseModel } from "./IBaseModel";
import { IUsers } from "../core-typings/IUsers";

export interface IUsersModel extends IBaseModel<IUsers> {

    findByUserName(username: string): Promise<IUsers>;

}