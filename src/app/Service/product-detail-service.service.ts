import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../model/Product';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Salechart } from '../../model/salechart';
import { Customer } from '../../model/customer';
import { DataPerson } from '../../model/data-person';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailServiceService {
  model:Product = new Product();
  modelChart:Salechart = new Salechart();
  modelList :Product[] = [];
  url :string ="https://localhost:7022/api/Product";
  constructor(private http:HttpClient) { }

  getProducts(){
    this.http.get(this.url).subscribe({
      next:res=>{
        this.modelList = res as Product[];   
      },
      error(err) {
        console.log('ข้อมูล Products ผิดพลาด',err);
        
      },
    });
  }
  getByIdProduct(id:string){
    this.http.get(this.url+'/'+id).subscribe({
      next:res=>{
        this.model = res as Product;
      },
      error(err) {
        console.log(err);
      },
    });
  }
  getByIdProduct1(id:string):Observable<Product>{
    return this.http.get<Product>(this.url+'/'+id);
  }
  getSaleChart():Observable<Salechart[]>{
    return this.http.get<Salechart[]>(this.url+'/Chart');
  }
  getSaleChartById(customerId:string,year:number):Observable<Salechart[]>{
    const params: any ={};
    if(customerId) params.cusId = customerId;
    if(year) params.year = year;
    return this.http.get<Salechart[]>(this.url+'/Chart',{params:params});
  }
  postProduct(){
    this.http.post(this.url,this.model).subscribe({
      next:res=>{
        this.modelList = res as Product[];
        this.getProducts();
      },
      error(err) {
        console.log(err);
        
      },
    });
  }
  postProduct1(model:Product):Observable<Product>{
    return this.http.post<Product>(this.url,model);
  }
  putProduct(){
      this.http.put(this.url+'/'+ this.model.productId,this.model).subscribe({
        next:res=>{
          this.model = res as Product;
        },
        error(err) {
          console.log(err);
          
        },
      });
  }
  putProduct1(id:string,model:Product):Observable<Product>{
    return this.http.put<Product>(this.url+'/'+id,model);
  }
  deleteProduct(id:string){
  return  this.http.delete(this.url+'/'+id);
  }
  selectedGetddlV3(){
    const params :any ={};
    if(this.model.cusId) params.cusId = this.model.cusId;
    if(this.model.empId) params.empId = this.model.empId;
    if(this.model.productName) params.productName = this.model.productName;
    if(this.model.price) params.price = this.model.price;
    if(this.model.toPrice) params.toPrice = this.model.toPrice;
    if(this.model.status) params.status = this.model.status;
    this.http.get(this.url+'/v3',{params:params}).subscribe({
      next:res=>{
        this.modelList = res as Product[];
        console.log(res);
        console.log(this.model.status); 
      },
      error(err) {
        console.log(err);
      },
    });
  }
selectedGetddlV4():Observable<Product[]>{
  const params :any = {};
  if(this.model.cusId) params.cusId = this.model.cusId;
    if(this.model.empId) params.empId = this.model.empId;
    if(this.model.productName) params.productName = this.model.productName;
    if(this.model.price) params.price = this.model.price;
    if(this.model.toPrice) params.toPrice = this.model.toPrice;
    if(this.model.status) params.status = this.model.status;
    return this.http.get<Product[]>(this.url+'/v4',{params:params});
}


  resetForm(form:NgForm){
      form.resetForm();
      this.model.empId = "";
      this.model.cusId = "";
  }
}
