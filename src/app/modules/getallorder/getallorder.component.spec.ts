/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GetallorderComponent } from './getallorder.component';

describe('GetallorderComponent', () => {
  let component: GetallorderComponent;
  let fixture: ComponentFixture<GetallorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetallorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetallorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
