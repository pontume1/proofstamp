import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Moralis from "moralis-v1";
import CountryJson from '../../assets/countries.json';


interface COUNTRY {
  name: string;
  code: string;
}

Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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
  orders = [];
  wallets;
  country: COUNTRY[] = CountryJson;
  showProfile = true;
  showPurchas = false;
  showWallets = false;
  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    let user = await Moralis.User.current();
    debugger;
    if (!user) {
      this.router.navigate(['/login']);
    }else{
      this.user = user.getUsername();
      this.getInvoices();
      this.getUser();
      //this.getWallets(user.id);
    }

    Moralis.onAccountChanged( async (account) => {
      alert(account)
      await Moralis.enableWeb3();
      await Moralis.link(account);
      this.getUser();
    });
  }

  async saveUser(){
    try {
      const User = Moralis.Object.extend("_User");
      const query = new Moralis.Query(User);
      query.equalTo("username", this.user);
      const user = await query.first();
  
      user.set("first_name", this.userData.first_name);
      user.set("last_name", this.userData.last_name);
      user.set("bio", this.userData.bio);
      user.set("country", this.userData.country);
      user.set("location", this.userData.location);
      user.set("email", this.userData.email);
      user.set("designation", this.userData.designation);
  
      await user.save();
      alert('User updated successfully');
     
    } catch (error) {
      console.log(error);
    }
  }

  getUser = async () => {
    try {
      const Websites = Moralis.Object.extend("_User");
      const query = new Moralis.Query(Websites);
      query.equalTo("username", this.user);

      const groupsWithAddress = new Moralis.Query("_EthAddress");
      groupsWithAddress.matchesKeyInQuery(
        "user",
        "belongsTo.objectId",
        query
      );

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

        this.wallets = {
          accounts : object.get("accounts"),
          ethAddress : object.get("ethAddress")
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addWallet(){
    let web3 = await Moralis.enableWeb3();
    //await Moralis.link(this.wallets.accounts[0]);
  }

  async updateWallet(address){
    try {
      const User = Moralis.Object.extend("_User");
      const query = new Moralis.Query(User);
      query.equalTo("username", this.user);
      const user = await query.first();
  
      user.set("ethAddress", address);
  
      await user.save();
      this.getUser();
      alert(address+' is now your primary wallet');
     
    } catch (error) {
      console.log(error);
    }
  }

  async deleteWallet(address){
    try {
      //await Moralis.enableWeb3();
      await Moralis.unlink(address);
      this.getUser();
    } catch (error) {
      console.log(error);
    }
  }

  getInvoices = async () => {
    try {
      const Orders = Moralis.Object.extend("orders");
      const query = new Moralis.Query(Orders);
      query.equalTo("user", this.user);
      const results = await query.find();
      //console.log("Successfully retrieved " + results.length + " website.");
      // Do something with the returned Moralis.Object values

      for (let i = 0; i < results.length; i++) {
        const object = results[i];
       
        var orders = {
          id : object.id,
          order_id : object.get("order_id"),
          purchase_units : object.get("purchase_units"),
          expire_date : object.get("expire_date")
        }

        debugger;
        this.orders.push(orders);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getWallets = async (userId) => {
    try {
      var userPointer = {
        className: "_User",
        id: userId
      }
      const Orders = Moralis.Object.extend("_EthAddress");
      const query = new Moralis.Query(Orders);
      query.equalTo("user", userPointer);
      const results = await query.find();
      //console.log("Successfully retrieved " + results.length + " website.");
      // Do something with the returned Moralis.Object values

      for (let i = 0; i < results.length; i++) {
        const object = results[i];
       
        var wallet = {
          id : object.id,
          primary : object.get("primary")
        }

        debugger;
        this.wallets.push(wallet);
      }
    } catch (error) {
      console.log(error);
    }
  }

  showActivity(){
    this.showProfile = true;
    this.showPurchas = false;
    this.showWallets = false;
  }

  showPurchase(){
    this.showProfile = false;
    this.showWallets = false;
    this.showPurchas = true;
  }

  showWallet(){
    this.showProfile = false;
    this.showWallets = true;
    this.showPurchas = false;
  }

}
