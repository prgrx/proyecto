import { Timestamp } from "rxjs";
import { Message } from "./message";

export interface Conversation {
    id: string
	createdAt: any
	updatedAt: number
	createdBy: string
	members: string[]
    subject: string
	messages: Message[]
	/** Si se habla de un producto: */
	picture: string
	productId: string
}
