import { FieldValue } from '@angular/fire/firestore';

export interface Message{
    messageId: string
    content?: string
	createdAt: FieldValue
	senderId?: string
	productId?: string // USAR PARA CUANDO SE CONTACTE DESDE UNA FICHA DE PRODUCTO
	deleted?: boolean
	system: boolean
}