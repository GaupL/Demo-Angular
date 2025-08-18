import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { CustomerServiceService } from '../../Service/customer-service.service';
import { EmployeeServiceService } from '../../Service/employee-service.service';
import { ProductDetailServiceService } from '../../Service/product-detail-service.service';
import { Router } from '@angular/router';
import { Employee } from '../../../model/employee';
import { Customer } from '../../../model/customer';
import { Product } from '../../../model/Product';
import { debounce, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AuthenServiceService } from '../../Service/authen/authen-service.service';
import { jwtPayload } from '../../../model/register';
import { ToastrService } from 'ngx-toastr';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-product-detail',
  imports: [CommonModule,FormsModule,SelectModule,InputTextModule,TableModule,InputNumberModule,ButtonModule,RadioButtonModule],
  templateUrl: './product-detail.component.html',
  styles: ``
})
export class ProductDetailComponent implements OnInit {
  constructor(public servicePro:ProductDetailServiceService,public serviceCus:CustomerServiceService,public serviceEmp:EmployeeServiceService,public toastr:ToastrService){}
  route = inject(Router);
  modelEmp : Employee = new Employee();
  modelCus : Customer = new Customer();
  serviceAuth = inject(AuthenServiceService);
  price:number | null = null;
  toPrice:number | null = null;
  formattedPrice: string = '';
  formattedToPrice: string = '';


  ngOnInit(): void {
    this.serviceCus.getCustomerDDL().subscribe({
      next:res=>{
        this.serviceCus.modelList = res as Customer[];
      },
      error:err=>{
        console.log(err);
        
      }
    });
    this.serviceEmp.getEmployeeDDL().subscribe({
      next:res=>{
        this.serviceEmp.modelList = res as Employee[];
      },
      error:err=>{
        console.log(err);
      }
    });
    this.servicePro.getProducts();
  }

  onFilterChange(){
    if(this.servicePro.model.price && !this.servicePro.model.toPrice){
      alert("กรุณากรอกจำนวนเงิน");
      return;
    }
    else if(!this.servicePro.model.price && this.servicePro.model.toPrice){
      alert("กรุณากรอกจำนวนเงิน");
      return;
    }
    this.servicePro.selectedGetddlV4().subscribe({
      next:res=>{
        this.servicePro.modelList = res as Product[];
      },
      error(err) {
        console.log(err);
      },
    });
  }
  addData(){
     this.route.navigateByUrl('/content/proByAdmin')
  }
  dataDelete(id:string,item:any){
      if(confirm('คุณต้องการที่จะลบ ' +item.productName +' หรือไม่'))
      {
        this.servicePro.deleteProduct(id).subscribe({
          next:res=>{
              this.servicePro.getProducts();
              this.toastr.error('คุณได้ลบ '+ item.productName +' เรียบร้อยแล้ว','ลบข้อมูลสำเร็จ');
          },
          error:(err)=> {
            console.log(err);
            
          },
        });
      }
    
  }
  dataEdit(id:string){
    this.route.navigate(['/content/proByAdmin',id])
  }
  formatNumber(value:string){
    const NumberValue = value.replace(/[^0-9]/g, '');
    this.price = +NumberValue;
    this.formattedPrice = this.price.toLocaleString();
    this.servicePro.model.price=this.price;
}
formatToNumber(value:string){
  const NumberToPrice = value.replace(/[^0-9]/g,'');
  this.toPrice =+ NumberToPrice;
  this.formattedToPrice = this.toPrice.toLocaleString();
  this.servicePro.model.toPrice = this.toPrice;
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
}
