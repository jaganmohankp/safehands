import { Component,OnInit } from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VolunteerService } from './../../../services/volunteer.services';

@Component({
    selector: 'vol-inv',
    templateUrl: './inventory.component.html'
})

export class VolunteerInventoryComponent implements OnInit{
  selectedValue: string = "Pizza";
  selectedValue2: string;

  formData = {}
  console = console;
  basicForm: FormGroup;
  donors = [];
  categories = [];
  weights = [];

  data;

  constructor(private vlnSvc: VolunteerService) { }

  ngOnInit() {

    this.vlnSvc.getVolunteerEntryForm().subscribe(res => {
          if (res) {
            this.data = res;
          }
          
          this.donors = this.data.donors;
          this.categories = this.data.categories;
          this.weights = this.data.weights;
    });
    let password = new FormControl('', Validators.required);
    let confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.basicForm = new FormGroup({
      username: new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(9)
      ]),
      firstname: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      website: new FormControl('', CustomValidators.url),
      date: new FormControl(),
      cardno: new FormControl('', [
        Validators.required,
        CustomValidators.creditCard
      ]),
      phone: new FormControl('', CustomValidators.phone('BD')),
      password: password,
      confirmPassword: confirmPassword,
      gender: new FormControl('', [
        Validators.required
      ]),
      isAgreed: new FormControl('', [
        Validators.required
      ]),
    })
  }
}
