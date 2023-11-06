import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';


export const signup = async(req, res) => {
    
    //Recolectar datos de usuario
    const {username, email, password, roles} = req.body;
    //Buscar Usuario en la base de datos
    //const userFound = User.find({email})
    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password)
    });

    if (roles){
        const foundRoles = await Role.find({name: {$in: roles}})
        newUser.roles = foundRoles.map(role => role._id)
    } else {
        const role = await Role.findOne({name: "user"})
        newUser.roles = [role._id];
    }

    //Guardar usuario
    const savedUser = await newUser.save();
    console.log(savedUser)
    

    //Generando token
    const token = jwt.sign({id: savedUser._id}, config.SECRET, {
        expiresIn: 86400 // 24 horas
    });

    res.status(200).json({token});
}

export const signin = async (req, res) => {
    //valida que el corroe ingresado existe en la BD
    const userFound = await User.findOne({email: req.body.email}).populate("roles");    
    if (!userFound)  return res.status(400).json({message: "User not found"});
    
    //comparar contraseñas, devuelve true o false
    const matchPassword = await User.comparePassword(req.body.password, userFound.password)
    if (!matchPassword) return res.status(401).json({token: null, message: 'Ivalid password'})
    
    //Token
    const token = jwt.sign({id: userFound._id}, config.SECRET, {
        expiresIn: 86400
    })
    
    res.json({token})
    
}