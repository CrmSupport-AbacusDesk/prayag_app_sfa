import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, AlertCmp } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { VisitingCardListPage } from '../visiting-card-list/visiting-card-list';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';




/**
* Generated class for the VisitingCardAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-visiting-card-add',
  templateUrl: 'visiting-card-add.html',
})
export class VisitingCardAddPage {
  data: any={};
  dealer: any=[];
  distributor: any;
  distributor_network_list: any=[];
  userId:any = '';
  prod_id:any='';
  userType:any
  user_data:any={};
  drtype:any;
  checkin_id:any=0;
  
  constructor( public constant: ConstantProvider, public navCtrl: NavController, public alertCtrl : AlertController,public navParams: NavParams, public service:DbserviceProvider,
    public service1: MyserviceProvider,public attendence_serv: AttendenceserviceProvider) {
      console.log(constant);
      console.log(service);
      console.log(service1);
      this.last_attendence();
      
      console.log(this.navParams);
      this.checkin_id=this.navParams.get('checkin_id')

    }
    
    
    last_attendence() 
    {
      this.attendence_serv.last_attendence_data().then((result) => {
        console.log(result);
        this.user_data = result['user_data'];
        console.log(this.user_data.id);
        
        if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
          this.data.type=this.navParams.get('dr_type');
          this.get_network_list( this.data.type);
        }
        
      });
      
    }
  
    addVisitingCardRequest(){
      
      var dr_id
      if(this.data && this.data.type_name)
      dr_id = this.data.type_name.id ;
      else   
      dr_id = this.userId ;
      
      console.log(this.user_data.id);
      
      this.data.created_by= this.user_data.id;
      this.data.checkin_id=this.checkin_id;
      console.log(this.data);
      
      this.service1.addData(this.data, 'distributor/add_visiting_cards').then((response)=>{

        console.log(response);
        if(response['msg']="success")
        {
          this.showSuccess("Visiting Card Added Successfully!");
          if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
            this.navCtrl.pop();
          }
          else{
            this.navCtrl.push(VisitingCardListPage);
          }
          
        } 

        
      },er=>
      {
        this.service1.dismiss();
      });
      
      console.log(this.data);
      
    }
    
    get_network_list(type)
    {
      console.log(this.user_data.id);
      this.data.type_name = {};
      this.service1.show_loading()
      this.service1.addData2({'type':type,'login_id':this.user_data.id},'Distributor/distributor').then((result)=>{
        console.log(result);
        this.distributor_network_list = result;     
        console.log(this.distributor_network_list);
        
        this.service1.dismiss();
        if(this.navParams.get('dr_name')){
          this.data.create_card_user_id= this.distributor_network_list['distributor']['distributor'].filter(row=>row.company_name == this.navParams.get('dr_name'));
          console.log(this.data.create_card_user_id);
          this.data.create_card_user_id=this.data.create_card_user_id[0].id;
          console.log(this.data.create_card_user_id);
        }
        
      });
    } 
    
    
    totalcards(event: any) {
      const pattern = /[0-9]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    
    showSuccess(text)
    {
      let alert = this.alertCtrl.create({
        title:'Success!',
        subTitle: text,
        buttons: ['OK']
      });
      alert.present();
    }
    
    
    
    
    
    
    
    
  }
  