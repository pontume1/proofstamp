import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Moralis from "moralis-v1"

Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user = "";
  greeting: string;
  membership: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let user = Moralis.User.current();
    debugger;
    if (!user) {
      
    }else{
      this.user = user.getUsername();
      this.greeting = (typeof user.attributes.first_name == "undefined")?this.user:user.attributes.first_name;
      this.membership = user.attributes.membership;
    }
  }

  async logout() {
    await Moralis.User.logOut();
    this.router.navigate(['/login']);
  }

}
