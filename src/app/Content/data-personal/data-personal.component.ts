import { Component, inject, OnInit } from '@angular/core';
import { DataPerson } from '../../../model/data-person';
import { AuthenServiceService } from '../../Service/authen/authen-service.service';
import { jwtPayload } from '../../../model/register';
import { RegisterServiceService } from '../../Service/register-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-personal',
  imports: [CommonModule,FormsModule],
  templateUrl: './data-personal.component.html',
  styles: ``
})
export class DataPersonalComponent implements OnInit  {
  showpassword: boolean = false;
  person: DataPerson | undefined;
  person1!:jwtPayload;
  router = inject(Router);
  constructor(private service:AuthenServiceService,public serviceRes:RegisterServiceService,private toastr:ToastrService) {}
  ngOnInit(): void {
   this.person1 = this.service.getclaims();
   console.log(this.person1.UserId);
   if(this.person1.UserId && this.person1){
      this.dataPerson(this.person1.UserId);
   }
   else{
      console.error('UserId not found in claims');
   }
   
  }
  dataPerson(id:string){
    this.serviceRes.getPerson(id).subscribe({
      next:res=>{
        this.person = res as DataPerson;
        
      },
      error:err=>{
        console.log(err);
      }
    });
  }
  toggleChangePassword(){
    this.showpassword = !this.showpassword;
  }
  confirmPass(){
    this.serviceRes.postChangePassword(this.person1.UserId).subscribe({
      next:res=>{
        alert("เปลี่ยนรหัสผ่านสำเร็จ");
        this.toastr.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่');
        this.serviceRes.model.password='';
        this.serviceRes.model.newPassword='';
        this.router.navigateByUrl('');
      },
      error:err=>{
        this.toastr.error('รหัสผ่านเก่าไม่ถูกต้อง');
      }
    });
  }
}
