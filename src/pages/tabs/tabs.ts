import { Component } from '@angular/core';
import { AppareilsPage } from '../appareils/appareils';
import { SettingsPage } from '../settings/settings';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  appareilsPage = AppareilsPage;
  productsPage = ProductsPage;
  settingsPage = SettingsPage;
}