import { Component, OnInit } from '@angular/core';
import { Router ,RouterLink} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthenServiceService } from '../../Service/authen/authen-service.service';
import { claimReq } from '../../Service/authen/claimReq-utiles';
import { HideIfClaumsNotMetDirective } from '../../hide-if-claums-not-met.directive';
import { RegisterServiceService } from '../../Service/register-service.service';
import { ProductDetailServiceService } from '../../Service/product-detail-service.service';

@Component({
  selector: 'app-content',
  imports: [RouterOutlet,RouterLink,HideIfClaumsNotMetDirective],
  templateUrl: './content.component.html',
  styles: ``
})
export class ContentComponent implements OnInit{
  Email : string ="";
  Name : string ="";
  constructor(private router:Router,private serviceAuth:AuthenServiceService,public serviceRegis:ProductDetailServiceService){}
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
}
