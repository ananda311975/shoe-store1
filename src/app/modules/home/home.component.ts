import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataSharingService } from '../DataSharingService';
import { CartService } from '../services/cartservice.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  imageBlobUrl : any 
  imageBlobUrls : any = []
  productImgList : any
  productList : any
  productTypeList : any= []
  userDetail: any;

  constructor(
    private callService : CallserviceService,
    private sanitizer: DomSanitizer,
    private router : Router,
    private cartService: CartService,
    private dataSharingService: DataSharingService,
   
  ) { 
  }

  async addtoCart(productId: any): Promise<void> {
    try {
      await this.cartService.addToCart(productId);
      console.log('เพิ่มสินค้าสำเร็จ');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error);
    }
  }

  ngOnInit() {
    this.callService.getAllProduct().subscribe(res=>{
      
      if(res.data){
        this.productList = res.data
        for(let product of this.productList){
          product.imgList = []
          product.productType = this.productTypeList.filter((x : any)  => x.productTypeId == product.productTypeId);
  
          console.log("this.productTypeList",this.productTypeList)
          console.log("product.productType",product.productType)
          if(null == product.productType[0]){
                      // window.location.reload()
                    } 
          
          this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
            if(res.data){
              this.productImgList = res.data
              for(let productImg of this.productImgList){
                this.getImage(productImg.productImgName, product.imgList);
              }
            }else{
              // window.location.reload()
            }
          });
          
        }
      }
    }) 
    this.dataSharingService.userDetail.subscribe(value => {
      var userDetailSession: any = sessionStorage.getItem("userDetail");
      this.userDetail = JSON.parse(userDetailSession);
    });

    var userDetailSession: any = sessionStorage.getItem("userDetail");
    this.userDetail = JSON.parse(userDetailSession);
  }

  getImage(fileNames : any ,  imgList : any){
    this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
        let objectURL = URL.createObjectURL(res);       
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push(this.imageBlobUrl)
    });
  }




}
