import { Component, OnInit } from '@angular/core';

import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CartService } from '../services/cartservice.service';

interface CartItem {
  productId: number;
  productTypeId: number;
  productName: string;
  productDesc: string;
  price: number;
  imgList: string[];
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public totalItem: number = 0;

  public productList: CartItem[] = [];
  public grandTotal: number = 0;
  public imageBlobUrl: any;

  constructor(
    private cartservice: CartService,
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.cartservice.getProduct().subscribe((res) => {
    //   this.productList = res.map((item: any) => ({ ...item, quantity: 1 })); // Initialize quantity to 1
    //   this.updateGrandTotal();
    // });

    this.cartservice.getProduct().subscribe((res) => {
      this.productList = res.map((item: any) => ({ ...item, quantity: 1 }));
      console.log('productList', this.productList);
      for (let product of this.productList) {
        this.callService
          .getProductImgByProductId(product.productId)
          .subscribe((res) => {
            if (res.data) {
              product.imgList = [];
              this.getImageList(res.data, product.imgList);
            } else {
              // window.location.reload();
            }
          });
      }
      this.cartservice.getProduct().subscribe((res) => {
        this.totalItem = res.length;
      });

      this.updateGrandTotal();
    });
  }

  getImageList(imageNames: any[], imgList: any) {
    for (let imageName of imageNames) {
      this.callService
        .getBlobThumbnail(imageName.productImgName)
        .subscribe((res) => {
          let objectURL = URL.createObjectURL(res);
          this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          imgList.push(this.imageBlobUrl);
        });
    }
  }

  removeItem(item: CartItem): void {
    if (confirm('คุณแน่ใจหรือว่าจะลบรายการนี้ออกจากรถเข็น?')) {
      this.cartservice.removeCartItem(item.productId); // Pass the productId to the service method
      alert('สินค้าถูกนําออกจากรถเข็น');
      this.productList = this.productList.filter(
        (p) => p.productId !== item.productId
      ); // Update local productList
      this.updateGrandTotal();
    }
  }
  updateTotalItem() {
    this.totalItem = this.productList.reduce(
      (total: any, product: any) => total + product.quantity,
      0
    );
  }

  decrementQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity--;
    }
    this.updateGrandTotal();
    this.updateTotalItem();
    this.cartservice.saveCartData();
  }

  incrementQuantity(product: any): void {
    product.quantity++;
    this.updateGrandTotal();
    this.updateTotalItem();
    this.cartservice.saveCartData();
  }

  updateGrandTotal(): void {
    this.grandTotal = this.productList.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }
  setSelectedOrderId(productList: any) {
    const queryParams = {
      responseData: JSON.stringify(productList),
    };
    this.router.navigate(['/order'], { queryParams });
    console.log('responseData', productList);
  }

  navigateToPage(order : any) {
    
  
    this.router.navigate(['/productdetail']);
  }


}