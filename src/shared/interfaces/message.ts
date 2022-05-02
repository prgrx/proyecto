import { FieldValue } from '@angular/fire/firestore';

export interface Message{
    id: string
    content: string
	createdAt: FieldValue
	senderId: string
	productId: string
}