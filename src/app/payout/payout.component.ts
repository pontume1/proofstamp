import { Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Router, ActivatedRoute } from "@angular/router";
import Moralis from "moralis-v1";

Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent implements OnInit {

  user = "";
  userData = {
    id : '',
    first_name : '',
    last_name : '',
    bio : '',
    country : '',
    membership : '',
    email : '',
    location : '',
    designation : ''
  };

  constructor(private router: Router, private _Activatedroute:ActivatedRoute) { }

  showSuccess = false;
  id = "";
  package = [];
  payment = [
    {
      'id' : '3e1e967e9b793e908f8',
      'amount' : 59.00,
      'currency' : 'USD',
      'name' : 'Growth'
    },
    {
      'id' : '35b4b462bd94537bfe15c',
      'amount' : 199.00,
      'currency' : 'USD',
      'name' : 'Business'
    }
  ]
  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    let that = this;
    this._Activatedroute.paramMap.subscribe(params => {
      that.id = params.get('id');
      that.package = this.payment.filter((v)=>{return v.id == that.id}); 
      if(that.package.length == 0){
        this.router.navigate(['/pricing']);
      }
      this.initConfig();
      let user = Moralis.User.current();
      if (!user) {
        this.router.navigate(['/login']);
      }else{
        this.user = user.getUsername();
        //this.getUser();
      }
    });
  }

  private initConfig(): void {
      this.payPalConfig = {
      currency: this.package[0].currency,
      clientId: 'Ae2McqkQ2JlBG39L3bsNboD742DBqLhe5FIi56cbUgklpKAlFQQad7-XsY4ade_9yEhgaxvtOpXtT4i5',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: this.package[0].currency,
              value: this.package[0].amount,
              breakdown: {
                item_total: {
                  currency_code: this.package[0].currency,
                  value: this.package[0].amount
                }
              }
            },
            items: [
              {
                name: this.package[0].name,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: this.package[0].currency,
                  value: this.package[0].amount,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          //console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        //console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
        this.saveorder(data);
        alert('Purchase succesfull!');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
  async saveorder(data){
    debugger;
    try {
      const Orders = Moralis.Object.extend("orders");
      const order = new Orders();

      var dt = new Date(data.update_time);
      dt.setMonth( dt.getMonth() + 1 );
  
      order.set("order_id", data.id);
      order.set("user", this.user);
      order.set("purchase_time", data.update_time);
      order.set("expire_date", dt);
      order.set("payer", data.payer);
      order.set("purchase_units", data.purchase_units);
      order.set("status", data.status);
  
      await order.save();
      this.saveUser(data.update_time);
     
    } catch (error) {
      console.log(error);
    }
  }

  async saveUser(update_time){
    try {
      const User = Moralis.Object.extend("_User");
      const query = new Moralis.Query(User);
      query.equalTo("username", this.user);
      const user = await query.first();

      var dt = new Date(update_time);
      dt.setMonth( dt.getMonth() + 1 );
  
      user.set("membership", this.package[0].name);
      user.set("membership_expire_date", dt);
  
      await user.save();
     
    } catch (error) {
      console.log(error);
    }
  }

  getUser = async () => {
    try {
      const Websites = Moralis.Object.extend("_User");
      const query = new Moralis.Query(Websites);
      query.equalTo("username", this.user);
      const results = await query.find();
      //console.log("Successfully retrieved " + results.length + " website.");
      // Do something with the returned Moralis.Object values

      for (let i = 0; i < results.length; i++) {
        const object = results[i];
       
        this.userData = {
          id : object.id,
          first_name : object.get("first_name"),
          last_name : object.get("last_name"),
          bio : object.get("bio"),
          country : object.get("country"),
          membership : object.get("membership"),
          email : object.get("email"),
          location : object.get("location"),
          designation : object.get("designation")
        }

      }
    } catch (error) {
      console.log(error);
    }
  }
}


