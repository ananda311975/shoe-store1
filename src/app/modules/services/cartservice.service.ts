import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataSharingService } from '../DataSharingService';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemList: any[] = [];
  public productList = new BehaviorSubject<any[]>([]);
  private cartKey = 'cartData';

  constructor(private dataSharingService: DataSharingService) {
    this.loadCartData();
  }

  getProduct() {
    return this.productList.asObservable();
  }

  setProduct(products: any[]) {
    this.cartItemList.push(...products);
    this.productList.next(this.cartItemList);
    this.saveCartData();
  }

  addToCart(product: any) {
    this.cartItemList.push(product);
    this.productList.next(this.cartItemList);
    this.getTotalPrice(); // This function doesn't need to return anything since it's just calculating total internally
    this.saveCartData();
    console.log(this.cartItemList);
  }

  getTotalPrice() {
    let grandTotal = 0;
    this.cartItemList.forEach((item) => {
      grandTotal += item.price;
    });
    return grandTotal;
  }

  removeCartItem(productIdToRemove: any) {
    this.cartItemList = this.cartItemList.filter(
      (item) => item.productId !== productIdToRemove
    );
    this.productList.next(this.cartItemList);
    this.saveCartData();
  }

  removeAllCartItems() {
    this.cartItemList = [];
    this.productList.next(this.cartItemList);
    this.saveCartData();
  }
  public saveCartData() {
    var userDetailSession: any = sessionStorage.getItem('userDetail');
    const userDetail = JSON.parse(userDetailSession);
    console.log('userDetail', userDetail);
    let key = this.cartKey;
    if (null != userDetail) {
      key = userDetail.userName + this.cartKey;
    }
    console.log(key);
    localStorage.setItem(key, JSON.stringify(this.cartItemList));
    this.dataSharingService.cartNumber.next(this.cartItemList.length);
  }

  loadCartData() {
    var userDetailSession: any = sessionStorage.getItem('userDetail');
    const userDetail = JSON.parse(userDetailSession);
    console.log('LoadCartData', userDetail);
    let key = this.cartKey;
    if (null != userDetail) {
      key = userDetail.userName + this.cartKey;
    }
    console.log('vhhhhhhhhhhhhh', key);
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      this.cartItemList = JSON.parse(savedCart);
      this.productList.next(this.cartItemList);
      this.dataSharingService.cartNumber.next(this.cartItemList.length);
    }
  }
}