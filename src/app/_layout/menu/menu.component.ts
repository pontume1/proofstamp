import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Moralis from "moralis-v1"

Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user = "";
  constructor(private router: Router) { }

  ngOnInit(): void {
    let user = Moralis.User.current();
    debugger;
    if (!user) {
      
    }else{
      this.user = user.getUsername();
    }
  }

  async logout() {
    await Moralis.User.logOut();
    this.router.navigate(['/login']);
  }

}
