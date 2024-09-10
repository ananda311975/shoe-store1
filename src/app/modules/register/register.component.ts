import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CallserviceService } from '../services/callservice.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private callService  : CallserviceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activated: ActivatedRoute
  ) { }

  roleList : any = [];
  isPassword : boolean = false


  ngOnInit() {
    this.getAllRole();
  }

  registerForm = this.formBuilder.group({
    fristName : '',
    lastName : '',
    phone : '',
    age : '',
    roleId : '',
    userName : '',
    password : '',
    confirmPassword : ''
  })

  getAllRole(){
    this.callService.getAllRole().subscribe(res =>{ 
      console.log(res)
      if(res){
        this.roleList = res;
      }
    })
  }

  onSubmit(){
    this.isPassword = false
    console.log(this.registerForm.value)
    if(this.passwordValidate()){
      const data = this.registerForm.value;
        Swal.fire({
          title: 'ต้องการสมัครสมาชิก?',
          text: "คุณต้องการสมัครสมาชิกใช่หรือไม่!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#56C596',
          cancelButtonColor: '#d33',
          confirmButtonText: 'บันทึก',
          cancelButtonText: 'ยกเลิก'
        }).then((result) => {
          if (result.isConfirmed) {
            this.callService.saveRegister(data).subscribe(res=>{
              if(res.data){
                Swal.fire({
                  icon: 'success',
                  title: 'สำเร็จ!',
                  text: 'สมัครสมาชิกสำเร็จ',
                  confirmButtonText: 'ตกลง',
                }).then(ress=>{
                  this.router.navigate(['/login']);
                });
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
        });
      }
  }

  passwordValidate(){
    const password = this.registerForm.value.password;
    const confirmPassword = this.registerForm.value.confirmPassword;

    if(password != confirmPassword){
      this.isPassword = true;
      return false;
    }else{
      return true;
    }
  }

}
