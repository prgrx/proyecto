import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
})
export class AdministrationPage implements OnInit {
  colorImage: string;

  constructor(private menuController: MenuController, private router: Router) {}

  ngOnInit(): void {
    let prefersDark: boolean = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.colorImage = prefersDark ? 'white' : 'dark';
  }

  async ionViewWillEnter(): Promise<void> {
    if (!(await this.menuController.isEnabled('configMenu'))) {
      this.menuController.enable(true, 'configMenu');
    }
  }

  async ionViewDidLeave(): Promise<void> {
    if (await this.menuController.isOpen('configMenu')) {
      await this.menuController.close('configMenu');
    }
  }

  async openMenuConfig(): Promise<void> {
    await this.menuController.open('configMenu');
  }

  async closeMenuConfig(): Promise<void> {
    await this.menuController.close('configMenu');
  }

  async redirectTo(link: string): Promise<void> {
    this.router.navigate([link]);
    await this.closeMenuConfig();
  }
}
