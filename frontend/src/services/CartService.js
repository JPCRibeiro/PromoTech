import { Product } from '@/models/CartItem';
import { Cart } from '@/models/Cart';
import { ref } from 'vue';

const cart = ref(null);

export class CartService {
  constructor() {
    this.loadCart();
  }

  getCart() {
    // sempre garante que tenha um carrinho válido
    if (!cart.value) {
      cart.value = new Cart();
      cart.value.items = [];
      cart.value.totalPrice = 0;
      cart.value.totalCount = 0;
    }
    return cart.value;
  }

  addToCart(product) {
    let cartItem = cart.value.items.find(item => item.product.id === product.id);

    if (cartItem)
      return;

    cart.value.items.push(new Product(product));
    this.saveCart();
  }

  removeFromCart(productId) {
    cart.value.items = cart.value.items.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  changeQuantity(productId, quantity) {
    let cartItem = cart.value.items.find(item => item.product.id === productId);

    if(!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.product.valor;
    this.saveCart();
  }

  saveCart() {
    cart.value.totalPrice = cart.value.items.reduce((prev, current) => prev + (current.quantity * current.product.valor), 0);
    cart.value.totalCount = cart.value.items.reduce((prev, current) => prev + current.quantity, 0);
    localStorage.setItem('carrinho', JSON.stringify(cart.value));
  }

  loadCart() {
    const storedCart = JSON.parse(localStorage.getItem('carrinho'));
    if (storedCart) {
      cart.value = Object.assign(new Cart(), storedCart);
    } else {
      // se não existir nada no localStorage → cria mock vazio
      cart.value = new Cart();
      cart.value.items = [];
      cart.value.totalPrice = 0;
      cart.value.totalCount = 0;
    }
  }
}
