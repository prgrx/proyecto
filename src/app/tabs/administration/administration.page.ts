import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
})
export class AdministrationPage implements OnInit {

  constructor(private menuController: MenuController) {}

  ngOnInit() { }

  async ionViewWillEnter(): Promise<void> {
    if (!await this.menuController.isEnabled('configMenu')) {
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
}
