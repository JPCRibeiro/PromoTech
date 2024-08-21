export class Product {
  constructor(product) {
    this.product = product;
    this.quantity = 1;
    this.price = this.product.valor;
  }
}