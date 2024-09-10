import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataSharingService {
    public userDetail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public cartNumber: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);
    public userCart: BehaviorSubject<boolean>;

    constructor() {
      // ดึงข้อมูลจาก sessionStorage เมื่อ Service ถูกสร้าง
      const storedUserCart = sessionStorage.getItem('userCart');
      const initialValue = storedUserCart ? JSON.parse(storedUserCart) : false;
      this.userCart = new BehaviorSubject<boolean>(initialValue);
    }

    setUserCart(newValue: boolean) {
      this.userCart.next(newValue);
      // อัปเดตข้อมูลใน sessionStorage
      sessionStorage.setItem('userCart', JSON.stringify(newValue));
    }
}