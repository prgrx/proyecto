import { FieldValue } from "@angular/fire/firestore"

export interface User {
    uid?: string
    email?: string
    name?: string
    photo?: string
    isAdmin?: boolean
    isOnline?: boolean
    isBanned?: boolean
    isVerified?: boolean
    blocks?: string[]
    presentation?: string
    hobbies?: string
    experiences?: string
    birthday?: FieldValue
    reports?: string[]
    createdAt?: FieldValue
}