import { Timestamp } from "rxjs";
import { Message } from "./message";

export interface Conversation {
    id: string
	createdAt: any
	updatedAt: number
	lastMessage: string
	createdBy: string
	members: string[]
	messages: Message[]
}
