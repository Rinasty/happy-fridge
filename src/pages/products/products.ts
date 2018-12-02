import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Http, Connection } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Product } from '../../models/Product';
import { DatePipe } from '@angular/common';
import { SingleProductPage } from './single-product/single-product';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  public productsList: Product[];
  public myDate: string;
  public productAddDate: string;
  public productBrands: string;
  public productRealName: string;
  public productName: any;
  public resultURLOFF: string;
  public barcodeResult: string;
  public base64Image: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private http: Http,
    private sqlite: SQLite,
    private platform: Platform,
    private toast: Toast,
    private datepipe: DatePipe,
    private network: Network,
    private alertCtrl: AlertController) {
  }

  /**
   *
   * @param { Product } product 
   */
  onLoadProduct(product: Product) {
    let productModal = this.modalCtrl.create(SingleProductPage, { product: product });
    productModal.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.createDatabase();
    }
  }

  /**
   * @return date
   */
  getCurrentDate() {
    this.myDate = new Date().toISOString();
    this.myDate = this.datepipe.transform(this.myDate, 'dd-MM-yyyy');
    return this.myDate;
  }

  createDatabase() {
    this.sqlite.create({
      name: 'happyfridge.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS product(id_produit INTEGER PRIMARY KEY AUTOINCREMENT, libelle_produit TEXT, fabriquant_produit TEXT, quantite_produit INTEGER, consommation_produit INTEGER, jeter_produit INTEGER, dlc_produit TEXT, date_ajout_produit TEXT)', [])
        .then(() => console.log("Executed Sql !"))
        .catch(e => alert(e));
    })
  }

  scanProduct() {

    if (this.platform.is('ios') || this.platform.is('android')) {
      if (this.checkConnection()) {
        this.barcodeScanner.scan().then(barcodeData => {
          this.barcodeResult = barcodeData.text;
          this.resultURLOFF = 'https://world.openfoodfacts.org/api/v0/product/' + this.barcodeResult + '.json';
          this.http.get(this.resultURLOFF)
            .map(res => res.json())
            .subscribe(data => {
              this.productName = data["product"];
              // Récupération du libelle
              //this.productRealName = this.productName["ingredients_debug"][0];
              //if(this.productName["ingredients_debug"][0] == null){
              //  
              //}
              this.productRealName = this.productName["generic_name"];
              this.productRealName = this.productRealName.replace('.', '');
              // Récupération du fabriquant 
              this.productBrands = this.productName["brands"];
              this.productBrands = this.productBrands.replace('.', '');
              // Récupération de la date du jour
              this.productAddDate = this.getCurrentDate();
              this.productsList = [
                {
                  id_product: 0,
                  barcode: this.barcodeResult,
                  libelle: this.productRealName,
                  brand: this.productBrands,
                  quantity: 1,
                  isEat: false,
                  isThrow: false,
                  dlc: "",
                  dateAdd: this.productAddDate
                }
              ];
              this.onLoadProduct(this.productsList[0]);
            });

        }).catch(err => {
          console.log('Error', err);
          alert(err);
        });
      }
    } else {
      this.productAddDate = this.getCurrentDate();
      this.productsList = [
        {
          id_product: 0,
          barcode: "barcodeuiui",
          libelle: "Nutella",
          brand: "Ferrero",
          quantity: 2,
          isEat: false,
          isThrow: false,
          dlc: "",
          dateAdd: this.productAddDate
        }
      ];

      this.onLoadProduct(this.productsList[0]);
    }
  }

/**
 * @returns bool
 */
  checkConnection() {
    if (this.network.type == 'none') {
      let alert = this.alertCtrl.create({
        title: "Pas d'Internet :(",
        subTitle: "Vous devez disposer d'une connection internet, connectez vous et réessayer :)",
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'Réessayer',
            handler: () => {
              alert.dismiss();
              this.checkConnection();
            }
          }
        ]
      });
      alert.present();
      return false;
    }
    return true;
  }


}


