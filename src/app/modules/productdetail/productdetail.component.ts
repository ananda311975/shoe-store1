import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

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
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  promprayNumber = '0983108658';
  linkPrompray: string = '';
  public grandTotal: number = 0;
  public productList: CartItem[] = [];
  selectedOrder: any = null;
  selectedtotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private callService: CallserviceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activated: ActivatedRoute
  ) { }

  userDetail: any;
  userId: any;
  quantity: number[] = [];
  productId: number[] = [];
  responseData: any;

  orderForm: FormGroup = this.formBuilder.group({
    productId: [],
    quantity: [],
    address: '',
    userId: '',
    phone: '',
  });

  ngOnInit(): void {
    this.getData();
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.callService.getProductByProductId(productId).subscribe(res => {
        if (res.data) {
          this.product = res.data;
        }
      });
    }
    this.loadUserDetails();
    this.userId = this.activated.snapshot.paramMap.get('userId');
  }

  getUserById(userId: any) {
    this.callService.getByUserId(userId).subscribe((res) => {
      if (res.data) {
        this.setDataForm(res.data);
        sessionStorage.removeItem('userDetail');
        sessionStorage.setItem('userDetail', JSON.stringify(res.data));
      }
    });
  }

  

  getQuantity(order: any, productId: number): number {
    if (!order || !order.productId) {
      return 0;
    }
    const productIndex = order.productId.indexOf(productId);
    return productIndex > -1 ? order.quantity[productIndex] : 0;
  }

  getTotalPrice(order: any): number {
    if (!order || !order.productList) {
      return 0;
    }
    return order.productList.reduce((total: number, product: any) => {
      return total + (product.price * this.getQuantity(order, product.productId));
    }, 0);
  }

  getData() {
    this.linkPrompray = `https://promptpay.io/${this.promprayNumber}/${this.selectedtotal}.png`;
    console.log(this.linkPrompray);
  }

  scan(order: any, total: number) {
    this.selectedOrder = order;
    this.selectedtotal = total;
    console.log("selectedOrder", this.selectedOrder);
    console.log("selectedtotal", this.selectedtotal);

    this.getData();
  }

  setDataForm(data: any) {
    this.orderForm.patchValue({
      userId: data.userId,
      address: data.address || '',
      phone: data.phone || '',
    });
  }

  loadUserDetails() {
    if (this.userId) {
      this.callService.getByUserId(this.userId).subscribe((res) => {
        if (res.data) {
          this.userDetail = res.data;
          this.setDataForm(this.userDetail);
        }
      });
    } else {
      let userDetailSession: any = sessionStorage.getItem('userDetail');
      this.userDetail = JSON.parse(userDetailSession);
      this.setDataForm(this.userDetail);

      console.log('userId', this.userDetail.userId);
    }
  }

  onSubmit() {
    this.productId = this.productList.map((item) => item.productId);
    this.orderForm.patchValue({ productId: this.productId });

    this.quantity = this.productList.map((item) => item.quantity);
    this.orderForm.patchValue({ quantity: this.quantity });

    console.log(this.orderForm.value);

    const data = this.orderForm.value;
    Swal.fire({
      title: 'ต้องการสั่งซื้อ',
      text: 'คุณต้องการสั่งซื้อใช่หรือไม่!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#56C596',
      cancelButtonColor: '#d33',
      confirmButtonText: 'สั่งซื้อ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.callService.saveOrder(data).subscribe((res) => {
          if (res.data) {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ!',
              text: 'สั่งซื้อสำเร็จ',
              confirmButtonText: 'ตกลง',
            }).then((ress) => {
              // this.router.navigate(['']);
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'บันทึกไม่สำเร็จ!',
              text: 'กรุณาตรวจสอบข้อมูลด้วยค่ะ',
              confirmButtonText: 'ตกลง',
            });
          }
        });
      }
    });
  }

  addToCart(product: any) {
    // Implement add to cart logic here
  }

  buyNow(product: any) {
    // Implement buy now logic here
  }
}
