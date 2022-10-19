import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Moralis from "moralis-v1"
//const Moralis = require("moralis-v1/node");
Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

    /* Authentication code */
  async login() {
    let user = Moralis.User.current();
    let that = this;
    debugger;
    if (!user) {
      let user = await Moralis.authenticate({
        provider: "web3Auth",
        clientId: "BG5O86w-R7X7WDqn3HoSurhkmgMBtGYlf_l6YuTL52FeQRSmRj1h6oh4xkMnjCUoYhCaL2p-nFCwzR8NDWfHbwI",
        theme : "light"
      })
        .then(function (user) {
          //console.log("logged in user:", user);
          //console.log(user.get("ethAddress"));
          that.router.navigate(['/home']);
        })
        .catch(function (error) {
          //console.log(error);
          alert("OOps! Something Went Worng")
          that.router.navigate(['/home']);
        });
    }else{
      //console.log("already logged in user:", user);
      this.router.navigate(['/home']);
    }
  }

  async logout() {
    await Moralis.User.logOut();
    console.log("logged out");
  }

}
