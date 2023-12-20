import { db } from "../utils/utils";
import { Users } from "./raw/Users";

export const UsersEntity = new Users(db, 'users');