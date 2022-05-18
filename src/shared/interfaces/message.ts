import { FieldValue } from '@angular/fire/firestore';

export interface Message{
    messageId: string
    content?: string
	createdAt: FieldValue
	senderId?: string
	productId?: string 
	deleted?: boolean
	system?: boolean
}