import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUsers } from "../core-typings/IUsers";
import { UserRoles } from "../enums/UserRoles";
import { checkPass, encryptPass } from "../helpers/authHelpers";
import { UsersEntity } from "../models/Users";

const jwtSecretKey = process.env.JWT_KEY || 'mySecretKey';

export const registerController = async (req: Request, res: Response) => {

    try {
        const { username, role, password }: { username: string, role: UserRoles, password: string } = req.body;
        const user: IUsers = {
            username: username,
            password: await encryptPass(password),
            role: role,
            createdAt: new Date(),
            updatedAt: new Date(),
            isEnabled: true
        };
        const newUser = await UsersEntity.insert(user);
        const token = await jwt.sign({ user_id: newUser.id }, jwtSecretKey, { expiresIn: 60 * 60 });
        res.status(200).send({
            succes: true,
            msg: "User registered successfully",
            token: token,
        });
    } catch (error) {
        console.log("Error while register the user", error)
        res.status(500).send({
            success: false,
            msg: "Internal Server Error(500)",
        })
    }
}

export const loginController = async (req: Request, res: Response) => {
    const { username, password }: { username: string, password: string } = req.body;
    const user: IUsers = await UsersEntity.findByUserName(username);
    console.log("savedPass", user.password, "password", password)
    const isCorrectPass = await checkPass(user.password, password);
    if (!isCorrectPass) {
        res.status(401).send({
            success: false,
            msg: "Invalid username or password",
        });
    }

    const token = await jwt.sign({ user_id: user.id }, jwtSecretKey, { expiresIn: 60 * 60 });

    res.status(200).send({
        success: true,
        token,
    });
}