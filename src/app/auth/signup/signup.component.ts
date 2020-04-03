import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  maxDate: Date;
  isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }


  ngOnInit() {
    // this.signupForm = new FormGroup({
    //   username: new FormControl(null, Validators.required),
    //   email: new FormControl(null, [Validators.required, Validators.email]),
    //   password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    //   birthday: new FormControl(null, Validators.required)
    // });
    this.authService.getAuthListener().subscribe(change => {
      this.isLoading = false;
    });
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      birthday: [Date, [Validators.required]],
      agree: [false]
    });
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit() {
    this.isLoading = true;
    if (this.signupForm.valid) {
      this.authService.userSignup(this.signupForm.value);
    }
    this.signupForm.reset();
  }

}
