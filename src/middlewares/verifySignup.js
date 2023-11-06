import {ROLES} from '../models/Role'
import User from '../models/User'

export const checkDuplicateUsernameOrEmail = async (req, res, next) =>{
    //Validando que el usurio no este duplicado
    const user = await User.findOne({username: req.body.username})
    if (user) return res.status(400).json({message: 'The user already exists'})

    //Validando que el email no este duplicado
    const email = await User.findOne({email: req.body.email})
    if (email) return res.status(400).json({message: 'The email already exists'})

    next();

}

//funcion verificar si los roles existen
export const checkRolesExisted = (req, res, next) => {
    if (req.body.roles){
        for (const element of req.body.roles){
            if (!ROLES.includes(element)){
                return res.status(400).json({
                    message: 'Role ${req.body.roles} does not exists'
                })
            }
        }
    }
    next();
}