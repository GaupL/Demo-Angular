import { Injectable, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService{
  model : Employee = new Employee();
  modelList : Employee[] =  [];
  url : string ="https://localhost:7022/api/Employee";
  constructor(private http:HttpClient) { }

  formReset(form:NgForm){
    form.form.reset();
  }
  getEmployees(){
    this.http.get(this.url).subscribe({
      next:res=>{
        this.modelList = res as Employee[];
      },
      error(err) {
        console.log('error',err);
        
      },
    });
  }
    getEmployeeDDL():Observable<Employee[]>{
      return this.http.get<Employee[]>(this.url + '/ddl');
    }
  getEmployeeSearch():Observable<Employee[]>{
    const params:any=[];
    if(this.model.name) params.name = this.model.name; 
    if(this.model.lastname) params.lastname = this.model.lastname;
   return this.http.get<Employee[]>(this.url+'/v1',{params:params});
  }

  getEmployeeSearchV2():Observable<Employee[]>{
    const params :any = [];
    if(this.model.name) params.name = this.model.name;
    if(this.model.lastname) params.lastname = this.model.lastname;
    if(this.model.age) params.age = this.model.age;
    if(this.model.toage) params.toAge = this.model.toage;
    return this.http.get<Employee[]>(this.url+'/v2',{params:params});
  }
    getByIdEmployees(id:string){
      this.http.get(this.url+'/'+id).subscribe({
        next:res=>{
          this.model = res as Employee;
          
        },
        error(err) {
          console.log(err);
        },
      });
    }
     getByIdEmployees1(id:string){
      return this.http.get(this.url+'/'+id);
     }
  postEmployee(){
    this.http.post(this.url,this.model).subscribe({
      next:res=>{
        this.getEmployees();
      },
      error(err) {
        console.log('Error',err);
        
      },
    });
  }

  postEmployee1(formData:FormData){
       this.http.post(this.url,formData).subscribe({
        next:res=>{
          this.getEmployees();
          this.model.picture = null;
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if(fileInput){
            fileInput.value = "";
          }
      },
        error(err) {
          console.log('Error',err);
      },
       });
  }
  postEmployee2(formData:Employee){
     const person = this.buildFormData(formData);
    return this.http.post(this.url,person);
  }

  buildFormData(model:Employee){
    const formData = new FormData();
    formData.append('name',model.name);
    formData.append('lastname',model.lastname);
    formData.append('tel',model.tel);
    formData.append('email',model.email);
    formData.append('age',model.age);
    formData.append('address',model.address);
    if(model.picture){
      formData.append('picture',model.picture);
    }
    return formData;
  }
  putEmployee(){
    this.http.put(this.url+'/'+this.model.empId,this.model).subscribe({
              next:res=>{
                this.model = res as Employee;
              },
              error(err) {
                console.log(err);
                
              },
    });
  }
  putEmployee1(id:string,formdata:Employee):Observable<Employee>{
    const person = this.buildFormData(formdata);
    return this.http.put<Employee>(this.url+'/'+id,person);
  }

  deleteEmployee(id:string){
    return this.http.delete(this.url+'/'+id);
  }
}
