import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';

@Component({
  selector: 'app-manageUser',
  templateUrl: './manageUser.component.html',
  styleUrls: ['./manageUser.component.css']
})
export class ManageUserComponent implements OnInit {

  constructor(
    private callService : CallserviceService,
    private router : Router
  ) { }

  userList : any

  ngOnInit() {
    this.callService.getAllUser().subscribe(res=>{
      if(res.data){
        this.userList = res.data
      }
    })
  }

  onUpdateUser(userId : any){
    if(userId){
      this.router.navigate(['/profile/'+ userId]);
    }
  }

  onDeleteUser(userId : any){
    if(userId){

      this.callService.deleteUserByUserId(userId).subscribe(res=>{
        if(res.data){
          window.location.reload()
        }
      })
    }
  }

}
