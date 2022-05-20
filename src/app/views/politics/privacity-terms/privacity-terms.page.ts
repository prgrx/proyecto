import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacity-terms',
  templateUrl: './privacity-terms.page.html',
  styleUrls: ['./privacity-terms.page.scss'],
})
export class PrivacityTermsPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  returnApp(): void {
    this.router.navigate(['/login']);
  }
}
