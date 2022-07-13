import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../../../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-lms-followup-add',
  templateUrl: 'lms-followup-add.html',
})
export class LmsFollowupAddPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  
  @ViewChild(Navbar) navBar: Navbar;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider) {
  }
  
  form:any={};
  today_date:any='';
  

  ionViewWillEnter() {
    this.type=this.navParams.get('type');
    this.form.lead_type = this.type;
    console.log(this.type);
    
    this.form.dr_id={id:this.navParams.get('id'),company_name:this.navParams.get('company_name')};
    console.log(this.form.dr_id);
    
    console.log('ionViewDidLoad LmsFollowupAddPage');
    this.get_assign_dr(this.type);
    
    this.today_date = new Date().toISOString().slice(0,10);
    console.log(this.today_date);
  }
  
  filter:any={};
  type:any;
  id:any;
  type_list:any=[];
  
  dr_id:any;
  
  get_assign_dr(type_id)
  {
    this.filter.type_id = type_id;
    this.type_list = [];
    console.log(type_id);
    
    this.db.addData({'dr_id':this.dr_id,"search":this.filter,},"Lead/getLeadList")
    .then(resp=>{
      console.log(resp);
      this.type_list = resp['dr_list'];
      console.log(this.type_list);
    },
    err=>
    {
    })
  }
  
  test(id)
  {
    console.log('test');
    
    console.log(id);
    
  }
  submit()
  {
    console.log(this.form);
    
    this.form.drid = this.form.dr_id.id;
    this.form.companyname = this.form.dr_id.company_name;
    
    this.db.show_loading()
    this.db.addData({"data":this.form,},"Lead/addFollowup")
    .then(resp=>{
      
      console.log(resp);
      this.db.dismiss()
      
      if(resp['status'] == 'Success')
      {
        this.db.presentToast("Successfully Added");
        this.navCtrl.pop();
      }
    },
    err=>{
      this.db.dismiss()

    });
  }
  
}
