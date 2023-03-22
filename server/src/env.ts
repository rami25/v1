import crypto from 'crypto'

export function getJwtSecret(): string{
    const secret = process.env.JWT_SECRET
    if(!secret){
        console.log('Missing JWT secret')
        process.exit(1)
    }
    return secret!
}
export function hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, process.env.PASSWORD_SALT!, 42, 64, 'sha512')
      .toString('hex');
}