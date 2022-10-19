import { Component, OnInit } from '@angular/core';
import Moralis from "moralis-v1"
import { RepscoreService } from "../../repscore.service"

Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-sitelayout',
  templateUrl: './sitelayout.component.html',
  styleUrls: ['./sitelayout.component.css']
})
export class SitelayoutComponent implements OnInit {

  constructor(private repscoreService:RepscoreService) { }

  showFrom = true;
  showLoading = true;
  showLowRepFrom = false;
  pShortName = "";
  pUrl = "";
  pDescription = "";
  businessName = "";
  workEmail = "";
  phone_number = "";
  govId = "";
  repScore = 0;
  message = "";
  user = "";
  domain = "";
  greeting = "";
  status = 1;
  modaltitle = "Add your website";
  imageSrc: string;

  ngOnInit(): void {
  }

  async addWebsite(){
    this.modaltitle = "Add your website";
    this.showLowRepFrom = false;
    this.showFrom = true;
    this.showLoading = true;
    let user = Moralis.User.current();
    if (user) {
      this.user = user.getUsername();
    }
    this.greeting = (typeof user.attributes.first_name == "undefined")?this.user:user.attributes.first_name;
    if(this.pUrl == '' || this.pShortName=='' || this.pDescription==''){
      alert('All fields are requred');
      return;
    }
    this.showFrom = false;
    this.message = "Checking website reputation score..."
    let that = this;
    var domainCheck = this.pUrl.replace('https://', '').replace('http://','');
    this.repscoreService.getScore(domainCheck).subscribe(response => {
      //that.repScore = response['fraud_score'];
      that.repScore = response['reputationScore'];
      that.showLoading = false;
      if(that.repScore <= 90){
        this.showLowRepFrom = true;
        this.modaltitle = "Add your details"
        this.domain = this.extractRootDomain(this.pUrl);
        this.status = 0;
        this.message = `Your Website Reputation score is low (${that.repScore}). Please submit the form below, to verify your business identity`;
      }else{
        this.message = "Adding website...";
        this.saveWebsite();
        setTimeout(function(){
          window.location.reload();
        }, 1000);
      }
    });
  }

  async addProofWebsite(){
    let that = this;
    this.modaltitle = "Verify your email"
    this.message = `We have sent a verification mail to ${this.workEmail}@${this.domain}, please verify your email`;
    var key = await that.saveWebsite();
    let email = `${this.workEmail}@${this.domain}`;
    let name = this.greeting;
    this.repscoreService.sendmail(email, key, name).subscribe(response => {
      setTimeout(function(){
        window.location.reload();
      }, 1000);
    });
  }

  async saveWebsite() {
    try {
      var domain = this.pUrl;
      var shortName = this.pShortName;
      var repScore = this.repScore;
      var description = this.pDescription;
      var assets = 0;
      var alerts = 0;
      var user = this.user;
      let webId = "";
  
      const Websites = Moralis.Object.extend("websites");
      const websites = new Websites();
  
      websites.set("shortName", shortName);
      websites.set("user", user);
      websites.set("repScore", repScore);
      websites.set("domain", domain);
      websites.set("description", description);
      websites.set("assets", assets);
      websites.set("alerts", alerts);
      websites.set("status", this.status);
  
      await websites.save().then(
        (websites) => {
          // Execute any logic that should take place after the object is saved.
          console.log(websites.id);
          webId = websites.id;
        },
        (error) => {
          // Execute any logic that should take place if the save fails.
          // error is a Moralis.Error with an error code and message.
          console.log("Failed to create new object, with error code: " + error.message);
        });; 
      //this.showFrom = true;
      //this.showLoading = true;
      //window.location.reload();
      return webId;
    } catch (error) {
      console.log(error);
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [image] = event.target.files;
      reader.readAsDataURL(image);
    
      reader.onload = () => {
    
      this.imageSrc = reader.result as string;
    
    // this.addForm.patchValue({
    //   imageSrc: reader.result
    // });
    
      };
    
    }
  }

  extractRootDomain = (url) => {

    const domain = new URL(url).hostname;
    const elems = domain.split('.');
    const iMax = elems.length - 1;
    
    const elem1 = elems[iMax - 1];
    const elem2 = elems[iMax];
    
    const isSecondLevelDomain = iMax >= 3 && (elem1 + elem2).length <= 5;
    return (isSecondLevelDomain ? elems[iMax - 2] + '.' : '') + elem1 + '.' + elem2;
	
}

}
