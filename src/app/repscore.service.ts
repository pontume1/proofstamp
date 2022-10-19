import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
   
@Injectable({
  providedIn: 'root'
})
export class RepscoreService {

  private url = 'http://223labs.ringlerr.com:9000/getWebScore?domain=';
    
  constructor(private httpClient: HttpClient) { }
   
  getScore(domain){
    var finalUrl = this.url+domain;
    return this.httpClient.get(finalUrl);
  }

  sendmail(email, key, name){
    var url = "http://223labs.ringlerr.com:9000/sendMail?email=email&key=key&name=name";
    return this.httpClient.get(url);
  }
    
}