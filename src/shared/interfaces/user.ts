import { FieldValue } from "@angular/fire/firestore"

export interface User {
    uid: string
    email: string
    name: string
    birthday: FieldValue
    presentation: string
    hobbies: string
    experiences: string
    photo: string
    isAdmin: boolean
    isOnline: boolean
    isBanned: boolean
    isVerified: boolean
    blocks: string[]
}