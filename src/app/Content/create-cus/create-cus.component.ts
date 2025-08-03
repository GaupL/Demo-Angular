import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerServiceService } from '../../Service/customer-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../model/customer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-cus',
  imports: [ReactiveFormsModule],
  templateUrl: './create-cus.component.html',
  styles: ``
})
export class CreateCusComponent implements OnInit {
constructor(public service:CustomerServiceService,private toastr:ToastrService){}
  ngOnInit(): void {
     if(this.CusId){
      this.service.getByIdCustomer1(this.CusId).subscribe({
        next:res=>{
          this.form.patchValue({
            name:res.name,
            lastname:res.lastname,
            address: res.address,
            tel: res.tel,
            dob: res.dob?.split('T')[0]
          });
        },
        error(err) {
          console.log(err);
          
        },
      });
     }
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  CusId:string | null =this.route.snapshot.paramMap.get('id');
  formbuilder = inject(FormBuilder);
  form = this.formbuilder.group({
    name:['',Validators.required],
    lastname:['',Validators.required],
    address:['',Validators.required],
    tel:['',Validators.required],
    dob:['']  // วันเดือนปี
  });

  addData(){
    const person = this.form.value as Customer;
    if(this.form.valid){
      if(this.CusId)
      {
        this.updateData(this.CusId,person);
        
      }
      else{
        this.insertData(person);
      }
    }
    else{
        alert('กรุณากรอกข้อมูลให้ครบ');
      }
  }
  insertData(person:Customer){
    this.service.postCustomer1(person).subscribe({
      next:res=>{
        this.router.navigateByUrl('/content/CusByAdmin');
        this.toastr.success('คุณได้เพิ่ม '+ person.name +' '+ person.lastname +'เรียบร้อยแล้ว','เพิ่มข้อมูลสำเร็จ');
      },
      error(err) {
        console.log(err);
      },
    });
  }
  updateData(id:string,model:Customer){
    this.service.putCustomer1(id,model).subscribe({
      next:res=>{
      this.toastr.info('อัปเดตข้อมูลเรียบร้อยแล้ว');
        this.router.navigateByUrl('/content/CusByAdmin');
      },
      error(err) {
        console.log(err);
        
      },
    });
  }
  
  cancel(){
    this.router.navigateByUrl('/content/CusByAdmin');
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
}
