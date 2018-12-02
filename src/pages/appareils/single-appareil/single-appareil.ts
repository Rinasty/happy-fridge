import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Appareil } from '../../../models/Appareil';
import { AppareilsService } from '../../../services/appareils.service';

@Component({
  selector: 'page-single-appareil',
  templateUrl: 'single-appareil.html',
})

export class SingleAppareilPage implements OnInit {

  index: number;
  appareil: Appareil;
  quantityProduct:number;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public appareilsService: AppareilsService) {
                this.quantityProduct = 1;
  }

  ngOnInit() {
    this.index = this.navParams.get('index');
    this.appareil = this.appareilsService.appareilsList[this.index];
  }

  dismissModal(){
    this.viewCtrl.dismiss();
  }

  onToggleAppareil() {
    this.appareil.isOn = !this.appareil.isOn;
  }

}