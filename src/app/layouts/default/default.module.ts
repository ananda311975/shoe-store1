import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { RegisterComponent } from 'src/app/modules/register/register.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedModule
  ],
  declarations: [
    DefaultComponent
  ]
})
export class DefaultModule { }
