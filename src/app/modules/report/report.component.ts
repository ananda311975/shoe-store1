import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { environment } from 'src/environments/environment';

const API_ENDPOINT = environment.API_ENDPOINT;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {

  constructor(private callService : CallserviceService) { }
  
  ngOnInit() {
  }

  downloadPdfCustomer(){
    let path = API_ENDPOINT + "/manage/user/download/pdf";
    window.open(path, "_blank")
  }

  downloadExcelCustomer(){
    let path = API_ENDPOINT + "/manage/user/download/excel";
    window.open(path, "_blank")
  }

}
