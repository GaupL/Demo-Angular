import { Injectable } from '@angular/core';
import { Customer } from '../../model/customer';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  model : Customer = new Customer();
  modelList : Customer[] =  [];
  url : string ="https://localhost:7022/api/Customer";
  constructor(private http:HttpClient) { }
  getCustomers(){
    this.http.get(this.url).subscribe({
    next:res=>{
          this.modelList = res as Customer[];
          
      },error(err) {
        console.log('ข้อมูลของCustomer ผิดพลาด ',err);
        
      },
    });
  }
  getCustomerDDL():Observable<Customer[]>{
    return this.http.get<Customer[]>(this.url + '/ddl');
  }
  searchCustomers():Observable<Customer[]>{
    const params:any =[];
    if(this.model.name) params.name=this.model.name;
    if(this.model.lastname) params.lastname=this.model.lastname;
    if(this.model.address) params.address=this.model.address;
    return this.http.get<Customer[]>(this.url+'/v2',{params:params});
  }
  getByIdCustomer(id:string){
    this.http.get(this.url+'/'+id).subscribe({
      next:res=>{
        this.model = res as Customer;
            
        },
      error(err) {
        console.log(err);
        },
      });
  }
  getByIdCustomer1(id:string):Observable<Customer>{
    return this.http.get<Customer>(this.url+'/'+id);
  }
  postCustomer(){
    this.http.post(this.url,this.model).subscribe({
      next:res=>{
        this.modelList = res as Customer[];
        console.log(res);
        
      },
      error(err) {
        console.log('บันทึกข้อมูลไม่สำเร็จ',err);
        
      },
    });
  }
  postCustomer1(model:Customer):Observable<Customer>{
    return this.http.post<Customer>(this.url,model);
  }

  buildFormData(model:Customer):FormData{  //ใช้สำหรับมีการอัปโหลดรูปภาพ
    const formdata1 = new FormData();
    formdata1.append('name',this.model.name);
    formdata1.append('lastname',this.model.lastname);
    formdata1.append('address',this.model.address);
    formdata1.append('tel',this.model.tel);
    if(this.model.dob){
    formdata1.append('dob',this.model.dob);
    }
    return formdata1;
  }
    putCustomer(){
      this.http.put(this.url+'/'+this.model.cusId,this.model).subscribe({
                next:res=>{
                  this.model = res as Customer;
                },
                error(err) {
                  console.log(err);
                  
                },
      });
    }
    putCustomer1(id:string,model:Customer):Observable<Customer>{
      return this.http.put<Customer>(this.url+'/'+id,model);
    }
  deleteCustomer(id:string){
    return this.http.delete(this.url+'/'+id);
  }
  reserform(form:NgForm){
    form.form.reset();
  }
}
