import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServiceService } from '../../Service/customer-service.service';
import { ToastrService } from 'ngx-toastr';
import { Customer } from '../../../model/customer';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductDetailServiceService } from '../../Service/product-detail-service.service';
import { Salechart } from '../../../model/salechart';
import { Chart } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-sale-detail',
  imports: [ReactiveFormsModule,CommonModule,FormsModule,TableModule,DialogModule,ButtonModule,SelectModule,ChartModule],
  templateUrl: './sale-detail.component.html',
  styles: ``
})
export class SaleDetailComponent implements OnInit {
  router = inject(ActivatedRoute);
  rout = inject(Router);
  dataSale:any ={};
  NewYear = new Date().getFullYear();
  years : any = [];
  SaleId =  this.router.snapshot.paramMap.get('id');
 visible: boolean = false;
     basicData: any;
    basicOptions: any;
  ngOnInit(): void {
        if(this.SaleId){
      this.serviceCus.getByIdCustomer(this.SaleId);
    }
    else{
      this.serviceCus.getCustomers();
      this.years =[ //เด๋วลองทำเป็น funtion จะได้ดูง่าย ๆ ในนี้
        {name :'2568',code : '2025'},
        {name :'2569',code : '2026'},
        {name :'2570',code : '2027'},
      ]
      
    }
  }
  constructor(public serviceCus:CustomerServiceService,private toastr:ToastrService,public servicepro:ProductDetailServiceService){}
  addData(){
  this.rout.navigateByUrl('/content/CreateCus');
}
searchData(){
  this.serviceCus.searchCustomers().subscribe({
    next:res=>{
      this.serviceCus.modelList = res as Customer[];
    },
    error(err) {
      console.log(err);
      
    },
  })
}
EditCustomer(id:string){
 this.rout.navigate(['/content/CreateCus',id]);
}
deleteCus(cusId:string,data:any){
  this.dataSale=data;
  if(confirm('คุณต้องการที่จะลบ ' +this.dataSale.name +' '+ this.dataSale.lastname+ 'หรือไม่')){
  this.serviceCus.deleteCustomer(cusId).subscribe({
    next:res=>{
      this.toastr.error('ลบข้อมูลสำเร็จ');
      this.serviceCus.getCustomers();
    }
  });
  }
}
    showDialog() {
        this.visible = true;
        
    }
dataChartById(data:any){
  this.visible = true;
  console.log(this.visible);
  this.NewYear = new Date().getFullYear();
  this.dataSale = data;
  this.loadChartData(this.dataSale.cusId,this.NewYear);
}
selectyear(){
  if(this.dataSale?.cusId){
    this.loadChartData(this.dataSale.cusId,this.NewYear);
  }
  
}
loadChartData(CusId:string,year:number){
  this.servicepro.getSaleChartById(CusId,year).subscribe({
    next:res=>{
        const months = res.map((item:Salechart)=>item.monthName);
        const summary = res.map((item:Salechart)=>item.price);
        const totalsum =  summary.reduce((sum,price)=>sum+price ,0);
        this.config.data.labels = months;
        this.config.data.datasets[0].data = summary;
        this.config.data.datasets[0].label='ยอดขายทั้งหมด '+ totalsum.toLocaleString() +' บาท';
        console.log( this.config.data.datasets[0].data);
        
          if(this.chart){
            this.chart.destroy();
           }
        this.chart = new Chart('MyChart',this.config);
    },
    error(err) {
      console.log(err);
      
    },
  });
}
public config: any = {
  type: 'bar',
  data: {
    labels: [], 
    datasets: [
      {
        label: '',
        data: [], 
        backgroundColor: 'rgba(0, 255, 255, 0.5)',
        borderColor: 'rgba(13,200, 255, 1)',
        borderWidth: 1
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};
chart:any;

}

