import { Component, inject, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, NgModelGroup, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterServiceService } from '../../Service/register-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstkeyPipe } from '../../shared/pipe/firstkey.pipe';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule,RouterLink,ReactiveFormsModule,FirstkeyPipe],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  constructor(public service :RegisterServiceService ){}
  formbuider = inject(FormBuilder);
  submited :boolean = false;

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
    this.submited || Boolean(control?.touched) || Boolean(control?.dirty);
    }
resetformModel(){
    this.submited = true;
  if(this.form.valid){
  this.service.postRegister(this.form.value).subscribe({
    next:res=>{
         alert('ลงทะเบียนสำเร็จ');
         this.form.reset();
         this.submited = false;
        },
    error:err=>{
      console.log(err);
      
    }
  });
  }

}
}
