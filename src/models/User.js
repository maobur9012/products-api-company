import {Schema, model} from 'mongoose';
import bcrypt  from 'bcryptjs'

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        ref: "Role",
        type: Schema.Types.ObjectId,
    }]
},{
    timestamps: true,
    versionKey: false,

});

//Metodo para cifrar como para comparar las contraseñas

userSchema.statics.encryptPassword = async(password) => {
    //Aplicar algoritmo
    const salt = await bcrypt.genSalt(10)

    // devuelve texto cifrado
    return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async(password, receivedPassword) => {
    //Compara datos de la contraseña con lo que ya existe
    return await bcrypt.compare(password, receivedPassword)
}

export default model('User',userSchema);
