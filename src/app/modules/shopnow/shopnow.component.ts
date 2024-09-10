import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CartService } from '../services/cartservice.service';
import { DataSharingService } from '../DataSharingService';

@Component({
  selector: 'app-shopnow',
  templateUrl: './shopnow.component.html',
  styleUrls: ['./shopnow.component.css']
})
export class ShopnowComponent implements OnInit {

  filteredProductList: any = [];
  searchText: string = '';
  isSearchActive: boolean = false;

  imageBlobUrl: any;
  imageBlobUrls: any = [];
  productImgList: any;
  productList: any;
  productTypeList: any = [];
  selectedProduct: any;
  userDetail: any;

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private cartService: CartService,
    private dataSharingService: DataSharingService,
  ) {}

  async addtoCart(productId: any): Promise<void> {
    try {
      await this.cartService.addToCart(productId);
      console.log('เพิ่มสินค้าในรถเข็นสำเร็จ');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้าในรถเข็น:', error);
    }
  }

  ngOnInit() {
    this.callService.getAllProduct().subscribe(res => {
      if (res.data) {
        this.productList = res.data;
        this.filteredProductList = this.productList;
        for (let product of this.productList) {
          product.imgList = [];
          product.productType = this.productTypeList.filter((x: any) => x.productTypeId == product.productTypeId);
          if (null == product.productType[0]) {
            // window.location.reload()
          }
          this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
            if (res.data) {
              this.productImgList = res.data;
              for (let productImg of this.productImgList) {
                this.getImage(productImg.productImgName, product.imgList);
              }
            } else {
              // window.location.reload()
            }
          });
        }
      }
    });
    this.dataSharingService.userDetail.subscribe(value => {
      var userDetailSession: any = sessionStorage.getItem("userDetail");
      this.userDetail = JSON.parse(userDetailSession);
    });

    var userDetailSession: any = sessionStorage.getItem("userDetail");
    this.userDetail = JSON.parse(userDetailSession);
  }

  getImage(fileNames: any, imgList: any) {
    this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
      let objectURL = URL.createObjectURL(res);
      this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      imgList.push(this.imageBlobUrl);
    });
  }

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
  }

  searchProduct() {
    if (this.searchText.trim() === '') {
      this.clearSearch();
    } else {
      this.filteredProductList = this.productList.filter((product: any) => {
        return (
          product.productName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          product.productDesc.toLowerCase().includes(this.searchText.toLowerCase())
        );
      });
      this.isSearchActive = true;
    }
  }

  clearSearch() {
    this.filteredProductList = this.productList;
    this.isSearchActive = false;
  }
}
