import { ref } from 'vue';

const order = ref(null);

export class OrderService {
  constructor() {
    this.loadOrder();
  }

  getOrder() {
    return order.value;
  }

  saveOrder(data, isDirectPurchase = false) {
    if (isDirectPurchase) {
      order.value = null;
    }
    if (Array.isArray(data.items)) {
      order.value = {
        products: data.items, 
        totalCount: data.totalCount,
        totalPrice: data.totalPrice,
      };
    } else {
      order.value = {
        product: data, 
        totalPrice: data.valor,
        quantity: 1, 
      };
    }
    
    localStorage.setItem('order', JSON.stringify(order.value));
  }

  updateProductQuantity(index, newQuantity) {
    if (order.value.product) {
      order.value.quantity = newQuantity;
      order.value.totalPrice = order.value.product.valor * newQuantity;
    } else if (order.value.products) {
      const item = order.value.products[index];
      item.quantity = newQuantity;
      item.price = item.product.valor * newQuantity;
      order.value.totalPrice = order.value.products.reduce((total, item) => total + item.price, 0);
    }

    localStorage.setItem('order', JSON.stringify(order.value));
  }

  loadOrder() {
    const orderJson = localStorage.getItem('order');
    if (orderJson) {
      order.value = JSON.parse(orderJson);
    }
  }
}