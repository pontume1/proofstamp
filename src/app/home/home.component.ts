import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Moralis from "moralis-v1"


Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  websites = [];
  user = "";
  wallet = "";
  greeting = "";
  constructor(private router: Router) { }

  ngOnInit(): void {
    let user = Moralis.User.current();
    if (!user) {
      this.router.navigate(['/login']);
    }else{
      this.user = user.getUsername();
      this.wallet = user.attributes.ethAddress;
      this.greeting = (typeof user.attributes.first_name == "undefined")?this.user:user.attributes.first_name;
      this.getWebsite();
    }
    
  }

  getWebsite = async () => {
    try {
      const Websites = Moralis.Object.extend("websites");
      const query = new Moralis.Query(Websites);
      query.descending("updatedAt");
      query.equalTo("user", this.user);
      const results = await query.find();
      //console.log("Successfully retrieved " + results.length + " website.");
      // Do something with the returned Moralis.Object values

      for (let i = 0; i < results.length; i++) {
        const object = results[i];
        var objA = {
          id : object.id,
          domain : object.get("domain"),
          shortName : object.get("shortName"),
          repScore : object.get("repScore"),
          description : object.get("description"),
          assets : object.get("assets"),
          alerts : object.get("alerts"),
          user : object.get("user"),
          status : object.get("status")
        }

        this.websites.push(objA);
      }
    } catch (error) {
      console.log(error);
    }
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }

}
