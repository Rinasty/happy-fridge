import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavParams, ViewController, NavController, Platform, AlertController, Events } from 'ionic-angular';
import { Product } from '../../../models/Product';
import { Toast } from '@ionic-native/toast';
import { DatePipe } from '@angular/common';
import {Validators, FormControl, FormGroup } from '@angular/forms';
import { AddProductService } from '../../../services/product/add/add-product'
import { GetProductService } from '../../../services/product/get/get-product'

@Component({
  selector: 'page-single-product',
  templateUrl: 'single-product.html',
})
export class SingleProductPage implements OnInit {

  @ViewChild('libelleInput') libelleInput;
  @ViewChild('brandInput') brandInput;

  productForm: FormGroup;
  newProduct: Product;
  readLibelle: boolean = true;
  readBrand:boolean = true;
  dateMin: any;
  dateMax: any;
  product: Product;
  goodDlc: string;

  constructor(public navParams: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public events: Events,
    private toast: Toast,
    private datepipe: DatePipe,
    private platform: Platform,
    private alertCtrl: AlertController,
    private addProductService: AddProductService,
    private getProductService: GetProductService
    ) {

      /**
       *  Action du back button (android)
       */
      platform.registerBackButtonAction(() => {
        this.onDismissModal();
      },1);

      }
      

  /**
   *  Initialisation de la page
   */
  ngOnInit() {
    this.product = this.navParams.get('product');
    this.productForm = new FormGroup({
      libelle: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u017F ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      brand: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u017F ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      quantity: new FormControl('', [Validators.required,Validators.pattern('[0-9]*')]),
      dlc: new FormControl('', Validators.required),
      barcode: new FormControl(),
      isEat: new FormControl(),
      isThrow: new FormControl(),
      dateAdd: new FormControl()
    });
    this.getCurrentDate();
  }

  /**
   *  Action du bouton Quantité +1
   */
  moreQuantity(){
    this.product.quantity = parseInt(this.product.quantity);
    this.product.quantity += 1;
  }

  /**
   *  Action du bouton Quantité -1
   */
  lessQuantity(){
    if(this.product.quantity <= 1){
      this.toast.show("La quantité ne peut pas être inférieur à 1 !","long","top");
    }
    else{this.product.quantity = this.product.quantity - 1;}
  }

  /**
   *  Initialisation des dates minimum et maximum
   *  Pour le datepicker
   */
  getCurrentDate(){
 
  //  Date Minimum du datetimepicker
  this.dateMin = new Date();
  this.dateMin = this.dateMin.toISOString();
  this.dateMin = this.datepipe.transform(this.dateMin, 'yyyy-MM-dd');


  //  Date Maximum du datetimepicker
  this.dateMax = Date.now();
  this.dateMax += 189345600000;
  this.dateMax = new Date(this.dateMax);
  this.dateMax = this.datepipe.transform(this.dateMax, 'yyyy-MM-dd');
}

/**
 *  Action du bouton edit pour le libelle
 *  readonly = false
 *  setFocus
 */
isLibelleReadonly(){
  this.readLibelle = false;
  setTimeout(() => {
    this.libelleInput.setFocus();
    this.libelleInput.get
  },150);
}

/**
 *  Action du bouton edit pour le brand
 *  readonly = false
 *  setFocus
 */
isBrandReadonly(){
  this.readBrand = false;
  setTimeout(() => {
    this.brandInput.setFocus();
  },150);
}

/**
 *  Fenêtre Alert pour confirmer le retour 
 *  à la page précédente
 */
onDismissModal(){
  let alert = this.alertCtrl.create({
    title: 'Quitter la fiche produit ?',
    subTitle: 'Le produit ne sera pas ajouter à votre stock.',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel'
      },
      {
        text: 'Confirmer',
        handler: () => {
          this.viewCtrl.dismiss();
          // register back button return function qui enlève l'apparition de l'alert
          this.platform.registerBackButtonAction(()=>150);
        }
      }
    ]
  });
  alert.present();
}



submitProduct(){
  this.goodDlc = this.productForm.get('dlc').value;
  this. goodDlc = this.datepipe.transform(this.goodDlc, 'dd-MM-yyyy');
  this.newProduct = 
    {
      id_product: 0,
      barcode: this.productForm.get('barcode').value,
      libelle: this.productForm.get('libelle').value,
      brand: this.productForm.get('brand').value,
      quantity: this.productForm.get('quantity').value,
      isEat: this.productForm.get('isEat').value,
      isThrow: this.productForm.get('isThrow').value,
      dlc: this.goodDlc,
      dateAdd: this.productForm.get('dateAdd').value
    };
  
  this.events.publish('add-product', this.newProduct);
  this.addProductService.saveProduct();
  this.getProductService.getCountProduct();
}

  
}




