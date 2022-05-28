import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/shared/interfaces/product';
import { serverTimestamp } from '@angular/fire/firestore';
import { Comment } from 'src/shared/interfaces/comment';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  @Input() product: Product;
  @Input() disabled: boolean;
  comments: Comment[] = [];
  commentGroup: FormGroup = new FormGroup({
    comment: new FormControl('', Validators.required),
  });
  user_id: string = JSON.parse(localStorage.getItem('user')).uid;
  getCommentsSubscription: Subscription;
  productSubcription: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.getAllComments();
    this.productSubcription = this.firestore
      .doc(`products/${this.product.id}`)
      .valueChanges()
      .subscribe(
        product => this.product = product as Product
      );
  }

  ionViewWillLeave(): void {
    this.getCommentsSubscription.unsubscribe();
  }

  addComment(): void {
    if (this.commentGroup.valid) {
      let comment: Comment = {
        id: this.firestore.createId(),
        user_id: JSON.parse(localStorage.getItem('user')).uid,
        content: this.commentGroup.controls.comment.value,
        date: serverTimestamp(),
        likes: [],
      };

      this.firestore
        .doc('/products/' + this.product.id + '/comments/' + comment.id)
        .set(comment, {
          merge: true,
        });
      this.commentGroup.reset();

      let addUnread = this.product.unread;
      addUnread.push(comment.id);

      this.firestore
        .doc('/products/' + this.product.id)
        .update({
          unread: addUnread
        })
    }
  }

  getAllComments(): void {
    this.getCommentsSubscription = this.firestore
      .collection('/products/' + this.product.id + '/comments', (ref) =>
        ref.orderBy('date', 'desc')
      )
      .valueChanges()
      .subscribe((comments: Comment[]) => {
        if (comments.length > 0) {
          if (comments[0].date === null) return;
        }
        this.comments = comments;
      });
  }

  likeComment(comment: Comment): void {
    if (comment.likes.includes(this.user_id)) {
      comment.likes.splice(comment.likes.indexOf(this.user_id), 1);
    } else {
      comment.likes.push(this.user_id);
    }
    this.firestore
      .doc('/products/' + this.product.id + '/comments/' + comment.id)
      .update({ likes: comment.likes });
  }

  async openAlertDelete(comment: Comment) {
    const alert = await this.alertController.create({
      cssClass: 'alertDelete',
      header: 'Eliminar Comentario',
      message:
        '¿Estás seguro de que quieres eliminar el comentario?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.firestore
            .doc('/products/' + this.product.id + '/comments/' + comment.id)
            .delete();

            if(this.product.unread.includes(comment.id)){
              this.firestore
                .doc('/products/' + this.product.id)
                .update({
                  unread: this.product.unread.filter(x => x !== comment.id)
                });
            }

            this.showToast('¡Se ha eliminado el comentario correctamente!', 5);
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string, seconds: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: seconds * 1000,
      color: 'light',
    });
    await toast.present();
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }

  ngOnDestroy(){
    this.productSubcription.unsubscribe();
  }
}
