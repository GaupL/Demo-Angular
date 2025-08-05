import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDetailServiceService } from '../../Service/product-detail-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServiceService } from '../../Service/customer-service.service';
import { EmployeeServiceService } from '../../Service/employee-service.service';
import { Product } from '../../../model/Product';
import { AuthenServiceService } from '../../Service/authen/authen-service.service';
import { jwtPayload } from '../../../model/register';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-pro-by-admin',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './create-pro.component.html',
  styles: ``
})
export class createproComponent implements OnInit{
  constructor(public service:ProductDetailServiceService,public serviceCus:CustomerServiceService,public serviceEmp:EmployeeServiceService,public toastr:ToastrService){}
  route = inject(Router);
  router = inject(ActivatedRoute);
  frombuilder = inject(FormBuilder);
  user  = this.router.snapshot.paramMap.get('id');
  selectedFile:File | null = null;
  serviceAuth = inject(AuthenServiceService);
   public auth:jwtPayload = this.serviceAuth.getclaims();
  ngOnInit(): void {
    this.serviceCus.getCustomers();
    this.serviceEmp.getEmployees();
    if(this.user){
      this.service.getByIdProduct1(this.user).subscribe({
        next:res=>{
          this.form.patchValue({
            productName:res.productName,
            price:res.price,
            contact:res.contact,
            tel:res.tel,
            status:res.status,
            empId:res.empId,
            cusId:res.cusId
          })
        },
        error(err) {
          console.log(err);
          
        },
      });
    }
  }

  form = this.frombuilder.group({
    productName:['',Validators.required],
    price:[0,Validators.required],
    contact:['',Validators.required],
    tel:['',Validators.required],
    status:[0,Validators.required],
    empId:['',Validators.required],
    cusId:['',Validators.required],
    userId:[this.auth.UserId,Validators.required]
  });
formatPhoneNumber(){
  let input =this.form.get('tel')?.value || '';
  input = input.replace(/[^0-9]/g, '');
  let formatted = input;
  if(input.length > 3 && input.length <= 6){
    formatted = input.slice(0,3)+ '-' +input.slice(3);    
  }
  else if(input.length > 6){
    formatted = 
    input.slice(0,3)+ '-' +
    input.slice(3,6) + '-' + 
    input.slice(6);
  }
  this.form.get('tel')?.setValue(formatted,{emitEvent:false});
}
  formatNumber(event:any){  // ไม่ได้ใช้
    setTimeout(() => {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, '');
    if(input){
     const formatted = parseInt(input,10).toLocaleString('en-US');
     event.target.value = formatted;
     this.form.get('price')?.setValue(input,{emitEvent:false});
    }
    else {
    event.target.value = '';
    this.form.get('price')?.setValue(0, { emitEvent: false });
    }
    });
  }
allowOnlyNumbers(event: KeyboardEvent) {
  const allowedKeys = [
    'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'
  ];
  const isNumber = /^[0-9]$/.test(event.key);
  if (!isNumber && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}
onPriceInput(event: any): void {
  let input = event.target.value;
  const numeric = input.replace(/,/g, '');

  if (!isNaN(numeric)) {
    const formattedForPrice = Number(numeric).toLocaleString('en-US');
    this.form.get('price')?.setValue(numeric, { emitEvent: false }); 
    event.target.value = formattedForPrice;
  } else {
    this.form.get('price')?.setValue(0, { emitEvent: false });
  }
}
  onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}
  cancel(){
    this.route.navigateByUrl('/content/productDetail');
  }

  onSubmit1(){
    const models = this.form.value as Product;
    if(this.form.valid){
      if(this.user){
        this.updateData(this.user,models);
      }
      else{
        this.saveData(models);
      }
    }
    else{
      alert('กรุณากรอกข้อมูลให้ครบ');
    }
  }
  saveData(model:Product){  
    this.service.postProduct1(model).subscribe({
      next:res=>{
        this.toastr.success('คุณได้เพิ่ม '+ model.productName + ' เรียบร้อยแล้ว','เพิ่มข้อมูลสำเร็จ');
        this.route.navigateByUrl('/content/productDetail');
      },
      error(err) {
        console.log(err);
        
      },
    });
  }
    updateData(productId:string,models:Product){
    this.service.putProduct1(productId,models).subscribe({
      next:res=>{
        this.toastr.info('อัปเดตข้อมูลเรียบร้อยแล้ว');
        this.route.navigateByUrl('/content/productDetail');
      },
      error(err) {
        console.log(err);
      }
    });
  }

}
