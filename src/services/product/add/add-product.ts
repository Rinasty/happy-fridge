import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Product } from '../../../models/Product';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AddProductService{

    product: Product;

    constructor(private events: Events,
        private sqlite: SQLite){
        this.events.subscribe('add-product', produit => {
            this.product = produit;
            this.ngOnDestroy();
            });
    }

   ngOnDestroy(){
    this.events.unsubscribe('add-product');
    }

    saveProduct() {
        this.sqlite.create({
          name: 'happyfridge.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('INSERT INTO product VALUES(NULL,?,?,?,?,?,?,?)',[this.product.libelle,this.product.brand,this.product.quantity,this.product.isEat,this.product.isThrow,this.product.dlc,this.product.dateAdd])
            .then(res => {
                console.log(res);
                }
              );
            })
            .catch(e => {
              alert(e);
            });
      }

}