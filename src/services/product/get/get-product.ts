import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Product } from '../../../models/Product';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class GetProductService{

    product: Product;
    wesh: any;

    constructor(private events: Events,
        private sqlite: SQLite){
       //this.events.subscribe('add-product', produit => {
       //    this.product = produit;
       //    this.ngOnDestroy();
       //    });
    }

    getCountProduct(){
        this.sqlite.create({
            name: 'happyfridge.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM product',[])
              .then(res => {
                  alert("Il y'a actuellement "+res.rows.length+" produits.");
                  }
                );
              })
              .catch(e => {
                alert(e);
              });
    }

    getAllProduct(){
      this.sqlite.create({
          name: 'happyfridge.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM product',[])
            .then(res => {
                alert("Il y'a actuellement "+res.rows.length+" produits.");
                }
              );
            })
            .catch(e => {
              alert(e);
            });
  }
}