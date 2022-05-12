import { FieldValue } from '@angular/fire/firestore';

export interface Message{
    id: string
    content: string
	createdAt: FieldValue
	senderId: string
	productId: string // USAR PARA CUANDO SE CONTACTE DESDE UNA FICHA DE PRODUCTO
}