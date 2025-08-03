import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeServiceService } from '../../Service/employee-service.service';
import { Employee } from '../../../model/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-emp',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-emp.component.html',
  styles: ``
})
export class CreateEmpComponent implements OnInit{
  router = inject(Router);
  route = inject(ActivatedRoute);
  UserId:string | null = null;
  public  url :string ="https://localhost:7022/";
  constructor(private service :EmployeeServiceService,private toastr:ToastrService){}
  ngOnInit(): void {
    this.UserId = this.route.snapshot.paramMap.get('id');
    if(this.UserId){
      this.service.getByIdEmployees1(this.UserId).subscribe({
      next: (employee:any) => {
        this.form.patchValue({
          name: employee.name,
          lastname: employee.lastname,
          tel: employee.tel,
          email: employee.email,
          age: employee.age,
          address:employee.address,
          picture: null  
        });
        this.imageBase64 =this.url + employee.picture;
      //  console.log(this.UserEmp);
        
      },
       error: (err) => {
        console.error('เกิดข้อผิดพลาด', err);
      }
      });
    }
  }
  imageBase64 ? :string ;
  formbuilder = inject(FormBuilder);
  form = this.formbuilder.group({
    name:['',Validators.required],
    lastname:['',Validators.required],
    age :['',Validators.required],
    tel:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    address:['',Validators.required],
    picture:new FormControl<null|File>(null)

  });

saveData(){
   this.UserId = this.route.snapshot.paramMap.get('id');
      const person = this.form.value as Employee;
      if(this.form.valid){
        if(this.UserId){
        this.updateData(person,this.UserId);
        }
        else{
          this.insertData(person);
        }
      }
      else{
        alert('กรุณากรอกข้อมูลให้ครบ');
      }
}
insertData(person:Employee){
    this.service.postEmployee2(person).subscribe({
      next:res=>{
        this.toastr.success('คุณได้เพิ่ม '+ person.name +' '+ person.lastname +' เรียบร้อยแล้ว','เพิ่มข้อมูลสำเร็จ');
        this.router.navigateByUrl('/content/empByAdmin');
      },
      error(err) {
        console.log(err);
      }
    });
}
updateData(person:Employee,UserId:string){
  this.service.putEmployee1(UserId,person).subscribe({
          next:res=>{
       this.toastr.info('อัปเดตข้อมูลเรียบร้อยแล้ว');
        this.router.navigateByUrl('/content/empByAdmin');
      },
      error(err) {
        console.log(err);
      }
  });
}
calcel(){
  this.router.navigateByUrl('/content/empByAdmin');
}
ImageSelect(event:Event){
const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0){
        const file:File=input.files[0];
        this.form.patchValue({picture:file ?? null});
        this.service.model.picture = file;
        this.toBase64(file).then((value:string) => this.imageBase64 = value).catch(error => console.error(error))
    }
    
}
toBase64(file:File):Promise<string>{
      return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload =() => resolve(reader.result as string);
        reader.onerror =(error) => reject(error);
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
