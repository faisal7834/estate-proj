import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hasedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, email, password: hasedPassword })
    try {
        await newUser.save()
        res.status(201).json("user created successfully...")
    } catch (error) {
        next(error)
    }
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, 'user not found'))
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, 'invalid credentials'))
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY)
        //password remove the screen 
        const { password: pass, ...restingPassword } = validUser._doc
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(restingPassword)

    } catch (error) {
        next(error)
    }
}

const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
            const { password: pass, ...restingPassword } = user._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(restingPassword)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(32).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY)
            const { password: pass, ...restingPassword } = newUser._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(restingPassword)
        }
    } catch (error) {
        next(error)
    }
}

const signOut = async(req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json("user signout successfully")
    } catch (error) {
        next(error)
    }
}

export {
    signUp,
    signIn,
    google,
    signOut
}