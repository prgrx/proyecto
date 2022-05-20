import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.page.html',
  styleUrls: ['./cookies.page.scss'],
})
export class CookiesPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  returnApp(): void {
    this.router.navigate(['/login']);
  }
}
