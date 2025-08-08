import { Component, inject, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, NgModelGroup, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterServiceService } from '../../Service/register-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstkeyPipe } from '../../shared/pipe/firstkey.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule,RouterLink,ReactiveFormsModule,FirstkeyPipe],
  templateUrl: './register.component.html',
  styles: `
  form.submitted input.ng-invalid{
    border-color: red;
  }
  input.is-invalid {
  border: 1px solid red;
}
  `
})
export class RegisterComponent {
  constructor(public service :RegisterServiceService ){}
  formbuider = inject(FormBuilder);
  submitted :boolean = false;
  toastr = inject(ToastrService);
  router = inject(Router);
  passwordMatchValidator:ValidatorFn =(control:AbstractControl):null =>{
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if(password && confirmPassword && password.value != confirmPassword.value){
      confirmPassword?.setErrors({passwordMismatch:true})
    }
    else{
      confirmPassword?.setErrors(null)
    }
    return null;
  }

  form = this.formbuider.group({
    name:['',Validators.required],
    nickname:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    address:['',Validators.required],
    role:['user'],
    password:['',[Validators.required,Validators.minLength(6),Validators.pattern(/^.*[^a-zA-Z0-9].*$/)]],
    confirmPassword:['',Validators.required],},{validators:this.passwordMatchValidator});

    hadDisplaybleError(controlname: string): boolean {
    const control = this.form.get(controlname);
    return Boolean(control?.invalid) && 
    (this.submitted || Boolean(control?.touched) || Boolean(control?.dirty))
    }

resetformModel(){
    this.submitted = true;
  if(this.form.valid){
  this.service.postRegister(this.form.value).subscribe({
    next:res=>{
         this.toastr.success('ลงทะเบียนสำเร็จ');
        // this.form.reset();
        // this.submitted = false;
        this.router.navigateByUrl('');
        },
    error:err=>{
      this.toastr.error('Email นี้มีผู้ใช้งานแล้ว');
    }
  });
  }

}
}
