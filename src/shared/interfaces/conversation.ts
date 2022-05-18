import { FieldValue } from "@angular/fire/firestore"
import { Message } from "./message";

export interface Conversation {
    id: string
	createdAt: FieldValue
	updatedAt: FieldValue
	lastMessage: string
	createdBy: string
	members: string[]
	messages: Message[]
	viewedBy?: object
}
