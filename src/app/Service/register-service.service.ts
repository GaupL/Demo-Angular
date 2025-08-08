import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../../model/register';
import { FormGroup, NgForm } from '@angular/forms';
import { DataPerson } from '../../model/data-person';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {

  url : string ="https://localhost:7022/api/Register";
  modelList : Register [] = [];
  model : Register = new Register();
  formSubmited : boolean = false;
  constructor(private http:HttpClient) { }
   
  refreshData(id:string){
    return this.http.get(this.url+'/'+id).subscribe({
        next:res=>{
          this.model = res as Register;
        },
        error(err) {
          console.log(err);
          
        },
    });
  }

  postRegister1(){
    return this.http.post(this.url,this.model).subscribe({
      next:res=>{
        this.model = new Register();
      },
      error(err) {
        console.log(err);
        
      },
    });
  }
    postRegister(form:any){
    return this.http.post(this.url,form);
  }
  postChangePassword(id:string){
    return this.http.post(this.url+'/changePassword/'+id,this.model);
  }
  resetForm(form:any){
    form.resetForm();
  }
    getPerson(id:string):Observable<DataPerson>{
    return this.http.get<DataPerson>(this.url+'/GetPerson/'+id);
    }
}
