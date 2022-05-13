import { FieldValue } from "firebase/firestore"

export interface Comment {
    id: string
    user_id: string
    content: string
    date: FieldValue
    likes: string[]
}