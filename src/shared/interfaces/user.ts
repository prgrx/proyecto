export interface User {
    uid: string
    email: string
    password: string
    name: string
    photo: string
    isAdmin: boolean
    isOnline: boolean
    isBanned: boolean
    isVerified: boolean
    blocks: string[]
}