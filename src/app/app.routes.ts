import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { ContentComponent } from './Content/content/content.component';
import { ProductDetailComponent } from './Content/product-detail/product-detail.component';
import { createproComponent } from './Content/create-pro/create-pro.component';
import { ForbiddenComponent } from './Content/forbidden/forbidden.component';
import { authguardGuard } from './Service/authen/authguard.guard';
import { RegisterComponent } from './Login/register/register.component';
import { CreateEmpComponent } from './Content/create-emp/create-emp.component';
import { CreateCusComponent } from './Content/create-cus/create-cus.component';
import { SaleChartComponent } from './sale-chart/sale-chart.component';
import { SaleDetailComponent } from './Content/sale-detail/sale-detail.component';
import { EmployeedetialV2Component } from './Content/employeedetial-v2/employeedetial-v2.component';
import { claimReq } from './Service/authen/claimReq-utiles';
import { DataPersonalComponent } from './Content/data-personal/data-personal.component';



export const routes: Routes = [
    {
        path:'',
        component:LoginComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'forbidden',
        component:ForbiddenComponent
    },
    {
        path:'content',
        component:ContentComponent,
        canActivate:[authguardGuard],
        canActivateChild:[authguardGuard],
        children:[
            {
                path:'empByAdmin',
                component:EmployeedetialV2Component,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'CusByAdmin',
                component:SaleDetailComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'productDetail',
                component:ProductDetailComponent,
            },
            {
                path:'proByAdmin',
                component:createproComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'proByAdmin/:id',
                component:createproComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'CreateEmp',
                component:CreateEmpComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'CreateEmp/:id',
                component:CreateEmpComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'CreateCus',
                component:CreateCusComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'CreateCus/:id',
                component:CreateCusComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'Salechart',
                component:SaleChartComponent,
                data:{claimReq:claimReq.admin}
            },
            {
                path:'personal',
                component:DataPersonalComponent,
                data:{claimReq:claimReq.adminOrUser}
            }
        
        ]
    },

    
];
