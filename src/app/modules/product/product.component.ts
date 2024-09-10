import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private callService : CallserviceService,
    private formBuilder : FormBuilder,
    private router : Router,
    private activated: ActivatedRoute,
  ) { }

  productTypeList : any
  selectedFiles : any = []
  isSubmit: boolean = false;

  ngOnInit() {
    this.getProductTypeAll();
  }

  productForm = this.formBuilder.group({
    productName : '',
    productDesc : '',
    price : parseFloat('0').toFixed(2),
    quantity : 0,
    productTypeId : '',
    files : [],
    productId : ''
  })

  getProductTypeAll(){
    this.callService.getProductTypeAll().subscribe((res) => {
      if(res.data){
        this.productTypeList = res.data
      }
    });
  }

  onSubmit(){
    this.isSubmit = true;
    console.log("xxx=>" , this.isSubmit)
    if(this.validator()){
      console.log("this.validator()>" , this.validator())
      const data = this.productForm.value
      this.callService.saveProduct(data).subscribe(res=>{
        if(res.data){
  
          this.callService.removeImgByProductId(res.data).subscribe(res=>{
            console.log("Delete =>" , res.data)
          })
  
          for(const file of this.selectedFiles[0]){
            const formData = new FormData();
            formData.append('file', file); 
            this.callService.saveImage(formData, res.data).subscribe(res=>{
              console.log("saveImage=>" , res.data)
            })
          }
          if(res.data){
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ!',
              text: 'บันทึกข้อมูลสำเร็จ',
              confirmButtonText: 'ตกลง',
            }).then(res=>{
              if(res.isConfirmed){
                this.router.navigate(['/manage-product']);
              }
            })
            
          }else{
            Swal.fire({
              icon: 'warning',
              title: 'บันทึกไม่สำเร็จ!',
              text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
              confirmButtonText: 'ตกลง',
            });
          }
        }
      })
    }
    
  }
  onFileChanged(event: any) {
    this.selectedFiles.push(event.target.files);
  }

  onKeyPrice(event : any){
    console.log("event=>", event.target.result)
    return parseFloat(event.target.result).toFixed(2)
  }


  setDataDecimal(data : any){
    this.productForm.patchValue({
      price : parseFloat(data).toFixed(2),
    })
  }

  fixDecimals(){
    let value = this.productForm.value.price
    return this.setDataDecimal(value);
  }

  validator() {
    if (this.productForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  setSubmit(){
    this.isSubmit = false;
  }

}
