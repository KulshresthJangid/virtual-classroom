import bcrypt from 'bcrypt';
import { UserRoles } from '../enums/UserRoles';

export const encryptPass = async (pass: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pass, 10, (err, hash) => {
            if (err) {
                reject(err);
                throw new Error("Error while encrypting the password " + err);
            } else {
                resolve(hash);
            }
        })
    })
}

export const checkPass = async (hash: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    })
}