export class CartItem {
  constructor(food) {
    this.food = food;
    this.quantity = 1;
    this.price = this.food.valor;
  }
}