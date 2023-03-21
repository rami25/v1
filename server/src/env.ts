
export function getJwtSecret(): string{
    const secret = process.env.JWT_SECRET
    if(!secret){
        console.log('Missing JWT secret')
        process.exit(1)
    }
    return secret!
}