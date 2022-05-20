import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.page.html',
  styleUrls: ['./logo.page.scss'],
})
export class LogoPage implements OnInit {

  @Input() colorImage: string;
  @Input() showPart: string;

  constructor() { }

  ngOnInit() {
  }

}
