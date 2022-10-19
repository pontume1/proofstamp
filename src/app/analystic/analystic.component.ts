import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import Moralis from "moralis-v1"
import { ChartDataSets } from 'chart.js';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import moment from 'moment';
import { count } from 'console';

Moralis.start({
  masterKey: 'Y884Z4cUvOvza6qpPBtFWhrClk96SqX9DS7DFUpR',
  serverUrl:'https://whadvahcmjmt.usemoralis.com:2053/server',
  appId: 'c8WBngJ0K5gPr0213acoLO8TGt0fjszjVcYcSlGf',
});

@Component({
  selector: 'app-analystic',
  templateUrl: './analystic.component.html',
  styleUrls: ['./analystic.component.css']
})
export class AnalysticComponent implements OnInit {

  id = '';
  username = '';
  mints = [];
  clicks = [];
  visits = [];
  totalClicks = 0;
  totalViews = 0;
  totalproofstamp = 0;

  totalClicksper = 0;
  totalViewsper = 0;
  totalproofstampper = 0;

  webdataResult;
  clickdataResult;
  visitdataResult;
  
  startDate = "";
  endDate = "";
  finalEndDate = "";

  // lineChart
  lineChartData: ChartDataSets[] = [ ];
  lineChartLabels: Array<any> = [];

  clickChartData: ChartDataSets[] = [ ];
  clickChartLabels: Array<any> = [];

  visitChartData: ChartDataSets[] = [ ];
  visitChartLabels: Array<any> = [];
  lineChartOptions: any = {
    responsive: true,
    options: {
      gridLines: {
        display: false
      }
    }
  };
  lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(63,81,181,0.35)',
      borderColor: 'rgba(63,81,181,1)',
      pointBackgroundColor: 'rgba(63,81,181,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(63,81,181,0.95)'
    }
  ];
  public lineChartLegend = false;
  public lineChartType: Chart.ChartType = 'line';

  // Each Column Definition results in one Column.
 public columnDefs: ColDef[] = [
  { headerName: 'Article Title ',field: 'title', filter: 'agTextColumnFilter'},
  { headerName: 'Web Url ', field: 'url', cellStyle: {"text-align": "center"}, cellRenderer: function(params) {
              return '<a href="'+ params.value+'" target="_blank"><span class="badge badge-success">Visit</span></a>'
          }},
  { headerName: 'IPFS Url ', field: 'ipfsUrl', cellStyle: {"text-align": "center"}, cellRenderer: function(params) {
              return '<a href="'+ params.value.url+'" target="_blank"><span class="badge badge-success">Visit</span></a>'
          }},
  { field: 'type', filter: 'agTextColumnFilter', cellStyle: {"text-align": "center"} },
  { headerName: 'Proofstamp Status ',field: 'status', cellStyle: {"text-align": "center"}, cellRenderer: function(params) {
              return '<span class="badge badge-success">'+ params.value+'</span>'
          }},
  { headerName: 'Digiproof Certificate ', field: 'mintKey', cellStyle: {"text-align": "center"}, cellRenderer: function(params) {
              return '<a href="http://223labs.ringlerr.com/pdf?key='+ params.value+'" target="_blank"><span class="badge badge-success">Download</span></a>'
          }},
  { headerName: 'Transaction Hash ',field: 'transactionData', filter: 'agTextColumnFilter', onCellClicked(event) {
      navigator.clipboard.writeText(event.value);
    // Alert the copied text
      alert("Transaction hash copied to clipboard");
    }},
  { field: 'blockNumber', filter: 'agTextColumnFilter', cellStyle: {"text-align": "center"} },
  { field: 'dateTime', filter: 'agDateColumnFilter' },
  { headerName: 'Token Id ',field: 'transactionIndex', cellStyle: {"text-align": "center"}, filter: 'agTextColumnFilter' },
  { headerName: 'Article Revision ',field: 'revision', cellStyle: {"text-align": "center"}, filter: 'agTextColumnFilter' }
];

// DefaultColDef sets props common to all Columns
public defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true
};

// Data that gets displayed in the grid
rowData;

// For accessing the Grid's API
@ViewChild(AgGridAngular) agGrid!: AgGridAngular;


  constructor(private router: Router, private _Activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    //selected: {start: moment.format(), end: moment.format()};
    let user = Moralis.User.current();
    let that = this;

    this.startDate = moment().subtract(7, 'days').format('MM/DD/YYYY');
    this.endDate = moment().subtract(0, 'days').format('MM/DD/YYYY');
    this.finalEndDate = moment().add(1, 'days').format('MM/DD/YYYY');

    if (!user) {
      this.router.navigate(['/login']);
    }else{
      this.username = user.getUsername();
      this._Activatedroute.paramMap.subscribe(params => {
        that.id = params.get('id');
        if(that.id == null){
          that.getAllWebData();
          that.getAllVisitsData();
          that.getAllClicksData();
        }else{
          that.getWebData(that.id);
          that.getVisitsData(that.id);
          that.getClicksData(that.id);
        }
      });
    }

    this.lineChartData = [{ data: [0]}]
    this.lineChartLabels = [''];
    this.clickChartData = [{ data: [0]}]
    this.clickChartLabels = [''];
    this.visitChartData = [{ data: [0]}]
    this.visitChartLabels = [''];
  }

  async getWebData(webId){
    try {
      
      const MintNfts = Moralis.Object.extend("mintNfts");
      const query = new Moralis.Query(MintNfts);
      query.descending("updatedAt");
      query.equalTo("webkey", webId);
      query.notEqualTo("title", "Delete");
 
      query.greaterThan("updatedAt", new Date(this.startDate));
      query.lessThan("updatedAt", new Date(this.finalEndDate));
      this.mints = [];
      
      const results = await query.find();
    
      for (let i = 0; i < results.length; i++) {
        const object = results[i];
        var ipfs = object.get('ipfsUrl');
        var objA = {
          mintKey : object.id,
          authScore : object.get("authScore"),
          trustScore : object.get("trustScore"),
          repScore : object.get("repScore"),
          title : object.get("title"),
          url : object.get("url"),
          user : object.get("user"),
          createdAt : object.get("createdAt"),
          revision : object.get("revision"),
          type : object.get("type"),
          ipfsUrl : Array.isArray(ipfs)?ipfs[ipfs.length-1]:{url:''},
          date : this.convertDate(object.get("updatedAt")),
          dateTime : object.get("updatedAt").toLocaleString(),
          transactionData : object.get("transactionData").transactionHash,
          transactionDataTrim : object.get("transactionData").transactionHash.substring(0, 6)+'...',
          blockNumber : object.get("transactionData").blockNumber,
          transactionIndex : object.get("transactionData").transactionIndex,
          status : 'Completed'
        }
        
        this.mints.push(objA);
      }

      var tempResult = {}

      for(let { date, mintKey } of this.mints)
        tempResult[date] = { 
          date, 
          mintKey, 
            count: tempResult[date] ? tempResult[date].count + 1 : 1
        }      

      let result = Object.values(tempResult);
      result.reverse();
      this.webdataResult = result;
      let data = result.map((v)=>{return v['count']});
      let label = result.map((v)=>{return v['date']});

      let current = data[data.length - 2];
      let pre = data[data.length - 3];
      this.totalproofstampper = ((current-pre)/pre)*100;
      this.totalproofstampper = parseFloat(this.totalproofstampper.toFixed(2));

      this.lineChartData = [{ data: data}]
      this.lineChartLabels = label;

      //this.totalproofstamp = this.mints.map(item => item.revision).reduce((prev, next) => prev + next);
      this.totalproofstamp = this.mints.length;

      this.rowData = this.mints;
  
    } catch (error) {
      console.log(error);
    }
  }

  async getClicksData(webKey){
    const Clicks = Moralis.Object.extend("clicks");
    const query = new Moralis.Query(Clicks);
    query.equalTo("webKey", webKey);

    query.greaterThan("createdAt", new Date(this.startDate));
    query.lessThan("createdAt", new Date(this.finalEndDate));
    this.clicks = [];

    const results = await query.find();

    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      var objA = {
        id : object.id,
        date : object.get("date"),
        clicks : object.get("clicks")
      }

      this.clicks.push(objA);
    }

    this.clickdataResult = this.clicks;

    this.totalClicks = this.clicks.map(item => item.clicks).reduce((prev, next) => prev + next);

    let data = this.clicks.map((v)=>{return v['clicks']});
    let label = this.clicks.map((v)=>{return v['date']});

    let current = data[data.length - 2];
    let pre = data[data.length - 3];
    this.totalClicksper = ((current-pre)/pre)*100;
    this.totalClicksper = parseFloat(this.totalClicksper.toFixed(2));

    this.clickChartData = [{ data: data}]
    this.clickChartLabels = label;
  }

  async getVisitsData(webKey){
    const Visitors = Moralis.Object.extend("views");
    const query = new Moralis.Query(Visitors);
    query.equalTo("webKey", webKey);

    query.greaterThan("createdAt", new Date(this.startDate));
    query.lessThan("createdAt", new Date(this.finalEndDate));
    this.visits = [];

    const results = await query.find();
    this.visitdataResult = results;

    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      var objA = {
        id : object.id,
        date : object.get("date"),
        views : object.get("views")
      }

      this.visits.push(objA);
    }

    this.visitdataResult = this.visits;
    this.totalViews = this.visits.map(item => item.views).reduce((prev, next) => prev + next);

    let data = this.visits.map((v)=>{return v['views']});
    let label = this.visits.map((v)=>{return v['date']});
    
    let current = data[data.length - 2];
    let pre = data[data.length - 3];
    this.totalViewsper = ((current-pre)/pre)*100; 
    this.totalViewsper = parseFloat(this.totalViewsper.toFixed(2));
    
    this.visitChartData = [{ data: data}]
    this.visitChartLabels = label;
  }

  async getAllWebData(){
    try {
      const MintNfts = Moralis.Object.extend("mintNfts");
      const query = new Moralis.Query(MintNfts);
      query.descending("updatedAt");
      query.equalTo("user", this.username);
      query.notEqualTo("title", "Delete");

      query.greaterThan("updatedAt", new Date(this.startDate));
      query.lessThan("updatedAt", new Date(this.finalEndDate));
      this.mints = [];

      const results = await query.find();
      
      for (let i = 0; i < results.length; i++) {
        const object = results[i];
        var ipfs = object.get('ipfsUrl');
        var objA = {
          mintKey : object.id,
          authScore : object.get("authScore"),
          trustScore : object.get("trustScore"),
          repScore : object.get("repScore"),
          title : object.get("title"),
          url : object.get("url"),
          user : object.get("user"),
          createdAt : object.get("createdAt"),
          revision : object.get("revision"),
          type : object.get("type"),
          ipfsUrl : Array.isArray(ipfs)?ipfs[ipfs.length-1]:{url:''},
          date : this.convertDate(object.get("updatedAt")),
          dateTime : object.get("updatedAt").toLocaleString(),
          transactionData : object.get("transactionData").transactionHash,
          transactionDataTrim : object.get("transactionData").transactionHash.substring(0, 6)+'...',
          blockNumber : object.get("transactionData").blockNumber,
          transactionIndex : object.get("transactionData").transactionIndex,
          status : 'Completed'
        }
        
        this.mints.push(objA);
      }

      var tempResult = {}

      for(let { date, mintKey } of this.mints)
        tempResult[date] = { 
          date, 
          mintKey, 
            count: tempResult[date] ? tempResult[date].count + 1 : 1
        }      

      let result = Object.values(tempResult);
      result.reverse();
      this.webdataResult = result;
      let data = result.map((v)=>{return v['count']});
      let label = result.map((v)=>{return v['date']});

      let current = data[data.length - 2];
      let pre = data[data.length - 3];
      this.totalproofstampper = ((current-pre)/pre)*100;
      this.totalproofstampper = parseFloat(this.totalproofstampper.toFixed(2));

      this.lineChartData = [{ data: data}]
      this.lineChartLabels = label;

      //this.totalproofstamp = this.mints.map(item => item.revision).reduce((prev, next) => prev + next);
      this.totalproofstamp = this.mints.length;

      this.rowData = this.mints;
  
    } catch (error) {
      console.log(error);
    }
  }

  async getAllClicksData(){
    const Clicks = Moralis.Object.extend("clicks");
    const query = new Moralis.Query(Clicks);
    query.equalTo("user", this.username);

    query.greaterThan("createdAt", new Date(this.startDate));
    query.lessThan("createdAt", new Date(this.finalEndDate));
    this.clicks = [];

    const results = await query.find();

    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      var objA = {
        id : object.id,
        date : object.get("date"),
        clicks : object.get("clicks")
      }

      this.clicks.push(objA);
    }

    this.clickdataResult = this.clicks;
    this.totalClicks = this.clicks.map(item => item.clicks).reduce((prev, next) => prev + next);

    let data = this.clicks.map((v)=>{return v['clicks']});
    let label = this.clicks.map((v)=>{return v['date']});

    let current = data[data.length - 2];
    let pre = data[data.length - 3];
    this.totalClicksper = ((current-pre)/pre)*100;
    this.totalClicksper = parseFloat(this.totalClicksper.toFixed(2));

    this.clickChartData = [{ data: data}]
    this.clickChartLabels = label;
  }

  async getAllVisitsData(){
    const Visitors = Moralis.Object.extend("views");
    const query = new Moralis.Query(Visitors);
    query.equalTo("user", this.username);

    query.greaterThan("createdAt", new Date(this.startDate));
    query.lessThan("createdAt", new Date(this.finalEndDate));
    this.visits = [];

    const results = await query.find();

    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      var objA = {
        id : object.id,
        date : object.get("date"),
        views : object.get("views")
      }

      this.visits.push(objA);
    }

    this.visitdataResult = this.visits;
    this.totalViews = this.visits.map(item => item.views).reduce((prev, next) => prev + next);

    let data = this.visits.map((v)=>{return v['views']});
    let label = this.visits.map((v)=>{return v['date']});

    let current = data[data.length - 2];
    let pre = data[data.length - 3];
    this.totalViewsper = ((current-pre)/pre)*100;
    this.totalViewsper = parseFloat(this.totalViewsper.toFixed(2));

    this.visitChartData = [{ data: data}]
    this.visitChartLabels = label;
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
  }

  dailyData(){
    var result = this.webdataResult;
    var data = result.map((v)=>{return v['count']});
    var label = result.map((v)=>{return v['date']});

    var current = data[data.length - 2];
    var pre = data[data.length - 3];
    this.totalproofstampper = ((current-pre)/pre)*100;
    this.totalproofstampper = parseFloat(this.totalproofstampper.toFixed(2));

    this.lineChartData = [{ data: data}]
    this.lineChartLabels = label;

    //this.totalproofstamp = this.mints.map(item => item.revision).reduce((prev, next) => prev + next);
    this.totalproofstamp = this.mints.length;

    //click
    this.clicks = this.clickdataResult;

    var clcikdata = this.clicks.map((v)=>{return v['clicks']});
    var clciklabel = this.clicks.map((v)=>{return v['date']});

    var current = clcikdata[clcikdata.length - 2];
    var pre = clcikdata[clcikdata.length - 3];
    this.totalClicksper = ((current-pre)/pre)*100;
    this.totalClicksper = parseFloat(this.totalClicksper.toFixed(2));

    this.clickChartData = [{ data: clcikdata}]
    this.clickChartLabels = clciklabel;

    //visit
    this.visitdataResult = this.visits;
    this.totalViews = this.visits.map(item => item.views).reduce((prev, next) => prev + next);

    var visitdata = this.visits.map((v)=>{return v['views']});
    var visitlabel = this.visits.map((v)=>{return v['date']});
    
    var current = visitdata[visitdata.length - 2];
    var pre = visitdata[visitdata.length - 3];
   
    this.totalViewsper = ((current-pre)/pre)*100; 
    this.totalViewsper = parseFloat(this.totalViewsper.toFixed(2));
    
    this.visitChartData = [{ data: visitdata}]
    this.visitChartLabels = visitlabel;
  }

  weekData(){
  
    const groups = this.webdataResult.reduce((acc, date) => {

      var curData = date.date.split("/");
      var modDate = curData[1]+"/"+curData[0]+"/"+curData[2];
      // create a composed key: 'year-week' 
      const yearWeek = `week-${moment(modDate).week()}`;
      
      // add this key as a property to the result object
      if (!acc[yearWeek]) {
        acc[yearWeek] = [];
      }
      
      // push the current date that belongs to the year-week calculated befor
      acc[yearWeek].push(date);
    
      return acc;
    
    }, {});
    var counts = [];
    var labels = [];
    for (const key in groups) {
      var count = groups[key].map(item => item.count).reduce((prev, next) => prev + next);
      counts.push(count)
      labels.push(key.replace("-"," "));
      //console.log(`${key}: ${groups[key]}`);
    }

    var current = counts[counts.length - 2];
    var pre = counts[counts.length - 3];
    this.totalproofstampper = ((current-pre)/pre)*100;
    this.totalproofstampper = parseFloat(this.totalproofstampper.toFixed(2));

    this.lineChartData = [{ data: counts}]
    this.lineChartLabels = labels;

    //click
    const clcikgroups = this.clickdataResult.reduce((acc, date) => {

      //var curData = date.date.split("/");
      //var modDate = curData[1]+"/"+curData[0]+"/"+curData[2];
      // create a composed key: 'year-week' 
      //const yearWeek = `${moment(date.date).year()}-${moment(date.date).week()}`;
      const yearWeek = `week-${moment(date.date).week()}`;
      
      // add this key as a property to the result object
      if (!acc[yearWeek]) {
        acc[yearWeek] = [];
      }
      
      // push the current date that belongs to the year-week calculated befor
      acc[yearWeek].push(date);
    
      return acc;
    
    }, {});
    var counts = [];
    var labels = [];
    for (const key in clcikgroups) {
      var count = clcikgroups[key].map(item => item.clicks).reduce((prev, next) => prev + next);
      counts.push(count)
      labels.push(key.replace("-"," "));
      //console.log(`${key}: ${groups[key]}`);
    }

    var current = counts[counts.length - 2];
    var pre = counts[counts.length - 3];
    this.totalClicksper = ((current-pre)/pre)*100;
    this.totalClicksper = parseFloat(this.totalClicksper.toFixed(2));

    this.clickChartData = [{ data: counts}]
    this.clickChartLabels = labels;

    //visit
    const visitgroups = this.visitdataResult.reduce((acc, date) => {

      //var curData = date.date.split("/");
      //var modDate = curData[1]+"/"+curData[0]+"/"+curData[2];
      // create a composed key: 'year-week' 
      const yearWeek = `week-${moment(date.date).week()}`;
      
      // add this key as a property to the result object
      if (!acc[yearWeek]) {
        acc[yearWeek] = [];
      }
      
      // push the current date that belongs to the year-week calculated befor
      acc[yearWeek].push(date);
    
      return acc;
    
    }, {});
    var counts = [];
    var labels = [];
    for (const key in visitgroups) {
      var count = visitgroups[key].map(item => item.views).reduce((prev, next) => prev + next);
      counts.push(count)
      labels.push(key.replace("-"," "));
      //console.log(`${key}: ${groups[key]}`);
    }

    var current = counts[counts.length - 2];
    var pre = counts[counts.length - 3];
   
    this.totalViewsper = ((current-pre)/pre)*100; 
    this.totalViewsper = parseFloat(this.totalViewsper.toFixed(2));

    this.visitChartData = [{ data: counts}]
    this.visitChartLabels = labels;
  
  }

  monthData(){
    const groups = this.webdataResult.reduce((acc, date) => {

      var curData = date.date.split("/");
      var modDate = curData[1]+"/"+curData[0]+"/"+curData[2];
      // create a composed key: 'year-week' 
      //const yearWeek = `${moment(modDate).year()}-${moment(modDate).month()+1}`;
      const yearWeek = `${moment(modDate).format('MMMM')}-${moment(modDate).year()}`;
      
      // add this key as a property to the result object
      if (!acc[yearWeek]) {
        acc[yearWeek] = [];
      }
      
      // push the current date that belongs to the year-week calculated befor
      acc[yearWeek].push(date);
    
      return acc;
    
    }, {});
    var counts = [];
    var labels = [];
    for (const key in groups) {
      var count = groups[key].map(item => item.count).reduce((prev, next) => prev + next);
      counts.push(count)
      labels.push(key.replace("-"," "));
      //console.log(`${key}: ${groups[key]}`);
    }
    var current = counts[counts.length - 2];
    var pre = counts[counts.length - 3];
    this.totalproofstampper = ((current-pre)/pre)*100;
    this.totalproofstampper = parseFloat(this.totalproofstampper.toFixed(2));

    this.lineChartData = [{ data: counts}]
    this.lineChartLabels = labels;

    //click
    const clcikgroups = this.clickdataResult.reduce((acc, date) => {

      //var curData = date.date.split("/");
      //var modDate = curData[1]+"/"+curData[0]+"/"+curData[2];
      // create a composed key: 'year-week' 
      //const yearWeek = `${moment(date.date).year()}-${moment(date.date).month()+1}`;
      const yearWeek = `${moment(date.date).format('MMMM')}-${moment(date.date).year()}`;
      
      // add this key as a property to the result object
      if (!acc[yearWeek]) {
        acc[yearWeek] = [];
      }
      
      // push the current date that belongs to the year-week calculated befor
      acc[yearWeek].push(date);
    
      return acc;
    
    }, {});
    var counts = [];
    var labels = [];
    for (const key in clcikgroups) {
      var count = clcikgroups[key].map(item => item.clicks).reduce((prev, next) => prev + next);
      counts.push(count)
      labels.push(key.replace("-"," "));
      //console.log(`${key}: ${groups[key]}`);
    }

    var current = counts[counts.length - 2];
    var pre = counts[counts.length - 3];
    this.totalClicksper = ((current-pre)/pre)*100;
    this.totalClicksper = parseFloat(this.totalClicksper.toFixed(2));

    this.clickChartData = [{ data: counts}]
    this.clickChartLabels = labels;

    //visit
    const visitgroups = this.visitdataResult.reduce((acc, date) => {

      //var curData = date.date.split("/");
      //var modDate = curData[1]+"/"+curData[0]+"/"+curData[2];
      // create a composed key: 'year-week' 
      //const yearWeek = `${moment(date.date).year()}-${moment(date.date).month()+1}`;
      const yearWeek = `${moment(date.date).format('MMMM')}-${moment(date.date).year()}`;
      
      // add this key as a property to the result object
      if (!acc[yearWeek]) {
        acc[yearWeek] = [];
      }
      
      // push the current date that belongs to the year-week calculated befor
      acc[yearWeek].push(date);
    
      return acc;
    
    }, {});
    var counts = [];
    var labels = [];
    for (const key in visitgroups) {
      var count = visitgroups[key].map(item => item.views).reduce((prev, next) => prev + next);
      counts.push(count)
      labels.push(key.replace("-"," "));
      //console.log(`${key}: ${groups[key]}`);
    }

    var current = counts[counts.length - 2];
    var pre = counts[counts.length - 3];
   
    this.totalViewsper = ((current-pre)/pre)*100; 
    this.totalViewsper = parseFloat(this.totalViewsper.toFixed(2));
    
    this.visitChartData = [{ data: counts}]
    this.visitChartLabels = labels;
  }

  datesUpdated(e){
    if(e.startDate != null && e.endDate != null){
      this.startDate = e.startDate.format('MM/DD/YYYY');
      this.endDate = e.endDate.format('MM/DD/YYYY');
      this.finalEndDate = e.endDate.add(1, 'days').format('MM/DD/YYYY');
      if(this.id == null){
        this.getAllWebData();
        this.getAllVisitsData();
        this.getAllClicksData();
      }else{
        this.getWebData(this.id);
        this.getVisitsData(this.id);
        this.getClicksData(this.id);
      }
    }
  }
}
