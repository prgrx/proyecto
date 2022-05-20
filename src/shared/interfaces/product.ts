import { FieldValue } from "firebase/firestore"

export interface Product {
    id: string
    name: string
    description: string
    image: string
    price: number
    last_modified: FieldValue
    unread?: number
    user_id: string
}