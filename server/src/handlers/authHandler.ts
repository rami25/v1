import { 
        DeleteUserRequest,
        DeleteUserResponse,
        ForgotPasswordRequest,
        ForgotPasswordResponse,
        ResetPasswordRequest,
        ResetPasswordResponse,
        SignInRequest, 
        SignInResponse, 
        SignOutRequest, 
        SignOutResponse, 
        SignUpRequest,
        SignUpResponse,
        UpdateUserRequest,
        UpdateUserResponse
} from '../../../shared/src/APIs/api'
import { ERRORS } from '../../../shared/src/errors'
import { ExpressHandler, ExpressHandlerWithParams } from "../types"
import { User } from '../../../shared/src/types/User'
import { db } from '../dao';
import { signJwt } from '../auth'
import { hashPassword } from '../env';
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export const signInHandler : ExpressHandler<
SignInRequest,
SignInResponse
> = async (req, res) => {
    const { login , password } = req.body
    if(!login || !password){
        return res.status(400).send({error:'all fields are required'})
    }
    const existing = (await db.getUserByUsername(login)) || (await db.getUserByEmail(login))
    if(!existing || existing.password !== hashPassword(password)){
        return res.status(403).send({error: 'unauthorized'})
    }
    const jwt = signJwt({userId : existing._id!})
    // Store JWT in cookie or local storage or session storage
    res.cookie('jwt', jwt);
    return res.status(200).send({
        user: {
            _id: existing._id,
            userName: existing.userName,
            email: existing.email,
            description : existing.description,
            createdAt: existing.createdAt,
            posts: existing.posts,
            groups: existing.groups,
            groupsIdInvitations: existing.groupsIdInvitations,
            groupsIdRequests: existing.groupsIdRequests
        },
        jwt,
    })    
}

export const signUpHandler : ExpressHandler<
SignUpRequest,
SignUpResponse
> = async (req, res) => {
    const { userName , email, password ,description } = req.body
    if(!userName || !email || !password)
        return res.sendStatus(400)

    //TODO verified req.body and duplicated fields
    if (await db.getUserByEmail(email)) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_EMAIL });
    }
    if (await db.getUserByUsername(userName)) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
    }
    const newUser: User = {
        userName,
        email,
        password: hashPassword(password),
        createdAt: new Date(),
        description
    }    
    const user = await db.createUser(newUser)
    const jwt = signJwt({userId : user._id!})
    res.cookie('jwt', jwt);
    res.status(200).send({
        user : {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            description: user.description,
            createdAt: user.createdAt
        },
        jwt,
    })
}

export const signOutUserHandler : ExpressHandler<
SignOutRequest,
SignOutResponse
> = async (req, res) => {
    if(res.locals.userId){
        res.clearCookie('jwt');
        // res.redirect('/visitor')
        return res.status(204).send({ message: 'User signed out successfully' });
    }
    return res.status(403).send({error: 'unauthorized'})
}

export const deleteUserHandler : ExpressHandler<
DeleteUserRequest,
DeleteUserResponse
> = async (req, res) => {
    const userId = res.locals.userId
    const { password } = req.body
    if(userId && password){
        const user = await db.getUserById(userId)
        if(user && (hashPassword(password) === user.password)){
            await db.deleteUser(userId)
            return res.sendStatus(200)
        }
        return res.status(401).send({ error: ERRORS.PASSWORD_INCORRECT })
    }
    return res.status(400).send({error:'all fields are required'})
    
}

export const updateUserHandler : ExpressHandler<
UpdateUserRequest,
UpdateUserResponse
> = async (req, res) => {
    const { userId } = res.locals.userId
    const { userName , email , description } = req.body
    if(userId){
        const user = await db.getUserById(userId)
        if(user){
            if(userName){
                if (await db.getUserByUsername(userName)) 
                  return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
                user.userName = userName
            }
            if(email){
                if (await db.getUserByEmail(email)) 
                  return res.status(403).send({ error: ERRORS.DUPLICATE_EMAIL });
                user.email = email
            }
            if(description) user.description = description
            await db.updateCurrentUser(user)
            return res.sendStatus(200)
        }
        return res.status(401).send({ error: ERRORS.USER_NOT_FOUND })
    }
    return res.status(401).send({ error: ERRORS.BAD_TOKEN }); 
}

export const forgotPassword : ExpressHandler<
ForgotPasswordRequest,
ForgotPasswordResponse
>  = async (req, res) => {
    const user = await db.getUserByEmail(req.body.email!)

    if (!user) {
       return res.status(400).json({ error: 'User not found' });
    }

    // Generate a unique password reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Save the token and its expiration date to the user's document in the database
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await db.updateCurrentUser(user)

    // Send a password reset email to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: 'Password Reset',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        `http://localhost:3000/reset/${token}\n\n` +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error sending the email:', err);
      } else {
        console.log('Password reset email sent to:', user.email);
      }
    });

    res.status(200).json({ message: 'Password reset email sent' });
}
export const resetPassword : ExpressHandlerWithParams<
{token : string},
ResetPasswordRequest,
ResetPasswordResponse
> = async (req, res) => {
    // Get user by password reset token
    const user = await db.getUserByToken(req.params.token!)
    if (!user) {
       return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const { newPassword } = req.body
    if(newPassword){
        user.password = hashPassword(newPassword)
        await db.updateCurrentUser(user)
        res.redirect('/visitor/sign-in')
        return res.status(200).json({ message: 'Password reset successful' });
    }
    else{
       return res.status(400).json({ error: 'password is required' });
    }
}
