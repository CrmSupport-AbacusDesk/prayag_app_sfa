import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../../providers/myservice/myservice';
import { LmsActivityAddPage } from '../lms-activity-add/lms-activity-add';

@IonicPage()
@Component({
  selector: 'page-lms-activity-list',
  templateUrl: 'lms-activity-list.html',
})
export class LmsActivityListPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider) {
  }
  
  ionViewWillEnter() {
    
    this.type=this.navParams.get('type');
    this.id=this.navParams.get('id');
    this.company_name=this.navParams.get('company_name');
    console.log(this.type);
    console.log(this.id);
    console.log(this.company_name);
    // this.folloupadd();
    console.log('ionViewDidLoad LmsActivityListPage');
    this.get_Activity_List();
  }
  
  
  activity_list:any[];
  type:any;
  id:any;
  company_name:any;
  
  lead_activity_add(type,id,company_name)
  {
    console.log(this.type);
    console.log(this.id);
    this.navCtrl.push(LmsActivityAddPage,{'type':type,'id':id,'company_name':company_name})
  } 
  
  get_Activity_List()
  {
    // this.dr_id = dr_id;

    this.db.addData({'dr_id':this.id},"Lead/activityList")
    .then(resp=>{
      console.log(resp);
      this.activity_list = resp['data'];
      console.log(this.activity_list);
    },
    err=>
    {
    })
  }
  
  doRefresh (refresher)
  {   
    this.get_Activity_List() 
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
}
