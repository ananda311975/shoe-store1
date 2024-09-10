import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 
 

  constructor(
    private formBuilder : FormBuilder,
    private callService : CallserviceService,
    private router : Router,
    private activated: ActivatedRoute,
  ) { }

  userDetail : any
  roleList : any
  userId : any
  title : any

  updateForm = this.formBuilder.group({
    fristName : '',
    lastName : '',
    phone : '',
    age : '',
    roleId : '',
    userName : ''
  })




  ngOnInit() {
    this.getAllRole();

    this.userId = this.activated.snapshot.paramMap.get("userId");
    if(this.userId){
      this.callService.getByUserId(this.userId).subscribe(res=>{
        if( res.data){
          this.title = "Your Profile User"
          this.userDetail = res.data
          this.setDataForm(this.userDetail)
        }
      })
    }else{
      this.title = "Your Profile Login"
      let userDetailSession : any = sessionStorage.getItem("userDetail")
      this.userDetail = JSON.parse(userDetailSession)
      this.setDataForm(this.userDetail)
    }
    
  }

  setDataForm(data : any){
    this.updateForm.patchValue({
      fristName : data.fristName,
      lastName : data.lastName,
      phone : data.phone,
      age : data.age,
      roleId : data.roleId,
      userName : data.userName,
    })
  }

  getAllRole(){
    this.callService.getAllRole().subscribe(res =>{ 
      if(res){
        this.roleList = res;
      }
    })
  }

  onSubmit(){
    console.log(this.updateForm.value)

    const data = this.updateForm.value
    
    this.callService.updateProfile(data, this.userDetail.userId).subscribe(res=>{
      if(res.data){

        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'แก้ไขข้อมูลสำเร็จ',
          confirmButtonText: 'ตกลง',
        });
        
        if(this.userId){
          this.router.navigate(['/profile/'+ this.userId]);
        }else{
          this.getUserById(res.data)
          this.router.navigate(['/profile']);
        }
       
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'บันทึกไม่สำเร็จ!',
          text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
          confirmButtonText: 'ตกลง',
        });
      }
    })
  }

  getUserById(userId : any){
    this.callService.getByUserId(userId).subscribe(res=>{
      if(res.data){
        this.setDataForm(res.data)
        sessionStorage.removeItem("userDetail")
        sessionStorage.setItem("userDetail" , JSON.stringify(res.data))
      }
    })
  }

}
