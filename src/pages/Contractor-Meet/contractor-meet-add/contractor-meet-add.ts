import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';

import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ContractorMeetListPage } from '../contractor-meet-list/contractor-meet-list';

/**
* Generated class for the ContractorMeetAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-meet-add',
  templateUrl: 'contractor-meet-add.html',
})
export class ContractorMeetAddPage {
  dealer: any = [];
  data: any = {};
  id: any;
  user_data: any = {};
  checkin_id:any;
  followup_data:any={};
  drList:any=[]
  order:any='for event'
  today_date = new Date().toISOString().slice(0, 10);
  max_date = new Date().getFullYear() + 1;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,  public db:MyserviceProvider,public attendence_serv: AttendenceserviceProvider, public navParams: NavParams, public service: DbserviceProvider, public service1: MyserviceProvider) {
    console.log(this.navParams);
    
    console.log(navParams.data.created_by);
    if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('checkinUserID')) {
      this.checkin_id=this.navParams.get('checkin_id');
      console.log('in checin navparams');
      this.id = this.navParams.get('checkinUserID');
      this.get_dealers();
    }
    else {
      console.log('Not in checin navparams');
      this.id = navParams.data.created_by;
      this.get_dealers();
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractorMeetAddPage');
  }
  get_network_list(network_type)
  {
    
    console.log(network_type);
    
     
      this.service1.addData({'type':network_type,'data':this.order},'Distributor/get_type_list').then((result)=>{
        console.log(result);
        this.drList = result;
        // this.open();
      });
    
    
    
  }
  get_dealers() {
    // this.service1.show_loading();
    
    
    this.service1.addData({ 'login_id': this.id }, 'Contractor/get_all_dealers').then((response) => {
      console.log(response);
      this.dealer = response;
      console.log(this.dealer);
      if(this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('checkinUserID')){
        this.data.dealer_id= this.dealer.dealer_list.filter(row=>row.company_name == this.navParams.get('dr_name'));
        console.log(this.data.dealer_id);
        this.data.dealer_id=this.data.dealer_id[0].id;
        console.log(this.data.dealer_id);
      }
      
      
      // this.service1.dismiss();
      
    }, er => {
      this.service1.dismiss();
    });
  }
  total_person(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  
  last_attendence() {
    this.attendence_serv.last_attendence_data().then((result) => {
      console.log(result);
      this.user_data = result['user_data'];
      console.log(this.user_data.id);
      this.addContractorMeeting();
      
    });
    
  }
  
  
  number_checker(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  addContractorMeeting() {
    console.log(this.data);
    console.log(this.id);
    
    this.data.created_by = this.id;
    this.data.checkin_id=this.checkin_id;
    
    this.service1.addData(this.data, 'Contractor/add_contractor_meet').then((response) => {
      console.log(response);
      
      if (response['msg'] == "success") {
        this.showSuccess("Added Successfully!");
      }
      
    }, er => {
      this.service1.dismiss();
    });
    console.log(this.data);
    console.log(this.data);
    // this.navCtrl.push(ContractorMeetListPage);
    this.navCtrl.pop();
  }
  
  
  
  showSuccess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
}
