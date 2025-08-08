import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, Router ,RouterLink} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthenServiceService } from '../../Service/authen/authen-service.service';
import { claimReq } from '../../Service/authen/claimReq-utiles';
import { HideIfClaumsNotMetDirective } from '../../hide-if-claums-not-met.directive';
import { RegisterServiceService } from '../../Service/register-service.service';
import { ProductDetailServiceService } from '../../Service/product-detail-service.service';
import { animate,trigger,query,style,transition } from '@angular/animations';

@Component({
  selector: 'app-content',
  imports: [RouterOutlet,RouterLink,HideIfClaumsNotMetDirective],
  templateUrl: './content.component.html',
  styles: ``,
  animations:[
    trigger('routerFadeIn',[
      transition('* <=> *',[
        query(':enter',[
          style({opacity:0}),
          animate('0.5s ease-in-out',style({opacity:1}))
        ],{optional:true})
      ])
    ])
  ]
})
export class ContentComponent implements OnInit{
  Email : string ="";
  Name : string ="";
  constructor(private router:Router,private serviceAuth:AuthenServiceService,public serviceRegis:ProductDetailServiceService,private context:ChildrenOutletContexts){}
  Role = claimReq;
  ngOnInit(): void {
    if(this.serviceAuth.getToken()){
      this.serviceRegis.getProducts();
    }
    else{
      this.router.navigateByUrl('/login');
    }
  }
Logout(){
  this.serviceAuth.deleteToken();
  this.router.navigateByUrl('');
}
  getRouteUrl(){
   return this.context.getContext('primary')?.route?.url;
  }
}
