export class Product {
    barcode: string;
    libelle: string;
    brand: string;
    quantity: any;
    isEat: boolean;
    isThrow: boolean;
    dlc: string;
    dateAdd: string;
  
    constructor(public id_product: number) {
      this.isThrow = false;
      this.isEat = false;
    }
  }
