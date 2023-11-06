
import jwt from "jsonwebtoken";
import config from "../config";
import User from '../models/User'
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-accesc-token"];   

        // Validacion del token con postman o insonia
        if(!token) return res.status(403).json({message: "No token provided"})

        // trae el valor de lo que tiene el token
        const decoded = jwt.verify(token,config.SECRET) 
        req.userId = decoded.id;

        //buscando el usuario 
        const user = await User.findById(req.userId, {password: 0})
        console.log(user)
        // validando si el usuario existe
        if(!user) return res.status(404).json({message: 'no user found'})

        next()
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'})
    }
};

//Autenticacion de roles
export const isModeator = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id: {$in: user.roles}});
    //for of
    for (const element of roles){
        if(element.name === "moderator"){
            next();
            return;
        }
    }

    return res.status(403).json({message: "Require moderator role"})

};
export const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id: {$in: user.roles}});

    // for of    
    for (const element of roles){
        if(element.name === "admin"){
            next();
            return;
        }
    }

    return res.status(403).json({message: "Require admin role"})

}