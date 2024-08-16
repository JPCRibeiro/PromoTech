import { CartItem } from '@/models/CartItem';
import { Cart } from '@/models/Cart';
import { ref } from 'vue';

const cart = ref(new Cart());

export class CartService {
  constructor() {
    this.loadCart();
  }

  getCart() {
    return cart.value;
  }

  addToCart(food) {
    let cartItem = cart.value.items.find(item => item.food.id === food.id);

    if (cartItem)
      return;

    cart.value.items.push( new CartItem(food));
    this.saveCart();
  }

  removeFromCart(foodId) {
    cart.value.items = cart.value.items.filter(item => item.food.id !== foodId);
    this.saveCart();
  }

  changeQuantity(foodId, quantity) {
    let cartItem = cart.value.items.find(item => item.food.id === foodId);

    if(!cartItem) return;
    
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.valor;
    this.saveCart();
  }

  saveCart() {
    cart.value.totalPrice = cart.value.items.reduce((prev, current) => prev + (current.quantity * current.food.valor), 0);
    cart.value.totalCount = cart.value.items.reduce((prev, current) => prev + current.quantity, 0);
    localStorage.setItem('carrinho', JSON.stringify(cart.value));
  }

  loadCart() {
    const storedCart = JSON.parse(localStorage.getItem('carrinho'));
    if (storedCart) {
      cart.value = Object.assign(new Cart(), storedCart);
    }
  }
}
