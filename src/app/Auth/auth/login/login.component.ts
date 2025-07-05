import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', Validators.required]
    });
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
       
      let email = this.loginForm.get('email')?.value;
      let password = this.loginForm.get('password')?.value;
       const loginObject = {
        email:email,
        password:password
      };
      this.authService.loginUser(loginObject).subscribe((res:any)=>{
        if(res.statusCode==200){
          localStorage.clear();
          localStorage.setItem('Email',JSON.stringify(email));
          this.router.navigateByUrl('/otp');
        }
        else{
          this.toastr.error(res.message);
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
      // Optional: Display error messages if form is invalid
      console.log('Form is invalid');
    }
  }
}
