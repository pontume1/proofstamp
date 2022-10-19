import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import Moralis from "moralis-v1"

Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-documantation',
  templateUrl: './documantation.component.html',
  styleUrls: ['./documantation.component.css']
})
export class DocumantationComponent implements OnInit {

  username = '';

  constructor(private router: Router, private _Activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    let user = Moralis.User.current();
    let that = this;
    if (!user) {
      this.router.navigate(['/login']);
    }else{
      this.username = user.getUsername();
    }
  }

}
