import { Component, ElementRef, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeServiceService } from '../../Service/employee-service.service';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../../model/employee';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employeedetial-v2',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './employeedetial-v2.component.html',
  styles: ``
})
export class EmployeedetialV2Component implements OnInit {
@ViewChild('fileInput') fileInput! :ElementRef<HTMLInputElement>;

  constructor(public service:EmployeeServiceService,private toastr:ToastrService){}
  ngOnInit(): void {
   if(this.userId){
      this.service.getByIdEmployees(this.userId);
   }
   else{
      this.service.getEmployees();
   }
  }
  route = inject(Router);
  router = inject(ActivatedRoute)
  userId = this.router.snapshot.paramMap.get('id');
  public  url :string ="https://localhost:7022/";
  submitForm1(){
    if(this.service.model.age){
      if(!this.service.model.toage){
        alert('กรุณากรอกช่วงอายุให้ครบ');
        return;
      }
    }
    else{
      if(this.service.model.toage){
          alert('กรุณากรอกช่วงอายุให้ครบ');
          return;
        }
    }
    this.service.getEmployeeSearchV2().subscribe({
      next:res=>{
        this.service.modelList = res as Employee[];
        console.log(res);
        
      },
      error(err) {
        console.log(err);
        
      },
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
addData(){
  this.route.navigateByUrl('/content/CreateEmp');
}
clearFileInput(){
  this.service.model.picture = null;
  this.imageBase64 ="";
  this.fileInput.nativeElement.value ='';
}
formbuider = inject(FormBuilder);
imageBase64 ? :string ;
form = this.formbuider.group({
  picture:new FormControl<null|File>(null,{validators:[Validators.required]})
});

  onDelete(id:string){
    this.service.deleteEmployee(id);
  }
  onEdit(id:string){
    this.route.navigate(['/content/CreateEmp',id]);

  }
  ImageSelect(event:Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0){
        const file:File=input.files[0];
        this.form.patchValue({picture:file});
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

  deleteData(EmpId:string,data:any){
    if(confirm('คุณต้องการจะลบ '+data.name + ' ' + data.lastname + 'หรือไม่' )){
      this.service.deleteEmployee(EmpId).subscribe({
        next:res=>{
          this.toastr.error('ลบข้อมูลสำเร็จ');
          this.service.getEmployees();
        },
        error(err) {
          console.log(err);
          
        },
      });
    }
  }
}
