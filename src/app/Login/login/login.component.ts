import { Component, inject } from '@angular/core';
import { FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { LoginServiceService } from '../../Service/login-service.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenServiceService } from '../../Service/authen/authen-service.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink,CommonModule,FormsModule,ButtonModule,PasswordModule,InputTextModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  constructor(private service:LoginServiceService,private serviceAuth:AuthenServiceService,public toastr:ToastrService){}
  formBuiderOne = inject(FormBuilder);
  route = inject(Router);
  form = this.formBuiderOne.group({
    email:['',Validators.required],
    password:['',Validators.required]
  })
  hasDisplaybleError(controlname:string):boolean{
   const control = this.form.get(controlname);
    return Boolean(control?.invalid) && (Boolean(control?.touched) || Boolean(control?.dirty))
  }

onSubmit(){
  if(this.form.valid){
    this.service.postLogin(this.form.value).subscribe({
      next:(res:any)=>{
        this.serviceAuth.saveToken(res.token);
        var data = this.serviceAuth.getclaims();
        this.toastr.success('ยินดีต้อนรับ คุณ '+ data.Name,'เข้าสู่ระบบสำเร็จ');
        this.route.navigateByUrl('/content/productDetail');
      },
      error:(err)=> {
        this.toastr.error('Email หรือ Password ไม่ถูกต้อง');
      },
    });
  }
}
}
