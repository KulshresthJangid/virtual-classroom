import express, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUsers } from "../core-typings/IUsers";
import { UsersEntity } from "../models/Users";
import { UserRoles } from "../enums/UserRoles";

const jwtSecretKey = process.env.JWT_KEY || 'mySecretKey';

export const auth: express.RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers['x-access-token'];
    if (!authToken) {
        res.status(401).send({
            success: false,
            msg: "Unauthorized request.",
        });
        return;
    }

    try {
        const decode: any = await jwt.verify(authToken.toString(), jwtSecretKey);
        const userId = decode.user_id;
        if (decode.exp && decode.exp <= Math.floor(Date.now() / 1000)) {
            return res.status(401).send({
                success: false,
                msg: "Token has Expired",
            })
        }
        if (!userId) {
            return res.status(400).send({
                success: false,
                msg: "Bad Request"
            })
        }
        const user: IUsers | null = await UsersEntity.findById(userId);
        if (user) res.locals.user = user;
        next();
    } catch (error) {
        console.log("Error while authenticating user", error)
        res.status(401).send({
            success: false,
            msg: "Invalid token.",
        });
    }
};

export const roleRequired = (role: UserRoles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { user } = res.locals as { user: IUsers };
        if (user.role === role) {
            next();
        } else {
            res.status(401).send({
                success: false,
                msg: "Missing necessary role required to access this URL",
            });
        }
    };
};
