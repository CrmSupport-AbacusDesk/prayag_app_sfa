import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';


/**
 * Generated class for the AddRetailerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-retailer',
  templateUrl: 'add-retailer.html',
})
export class AddRetailerPage {
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider,  public toastCtrl: ToastController,public loadingCtrl: LoadingController,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRetailerPage');
    this.get_states();
    this.get_district();
this.get_distributor()

    if(this.navParams.get('data'))
    {
      this.form = this.navParams.get('data');
      console.log(this.form);
      this.form.dob=this.form.date_of_birth
      this.form.doa=this.form.date_of_anniversary
console.log(this.form.doa);

      // this.travel_data=this.travel_data['travel']
      this.get_district();
      // this.form.district=[];
    //  this.lead_data.push(this.form.district)
    //  console.log(this.lead_data);

    }
  }
form:any={};
state_list:any=[];
district_list:any=[];
distributor_list:any=[];

user_data:any={};
get_states()
{
  this.db.addData({},"dealerData/getStates")
  .then(resp=>{
    console.log(resp);
    this.state_list = resp['state_list'];
    console.log( this.state_list);

  },
  err=>{
    this.db.errToasr()
  })
}
get_distributor()
{
    // this.service1.show_loading();
    this.db.addData({'type':1,'from':'order'},'DealerData/get_type_list').then((result)=>{
        console.log(result);
        this.distributor_list = result;
        
        // this.service1.dismiss();
      
        
    });
}
city_list:any[]
area_list:any[]

getCityList()
{
  this.form.city1 = [];
  console.log(this.form);
  // this.show_loading()
  
  this.db.addData({'district_name':this.form.district,'state_name':this.form.state},'dealerData/getCity').then((result)=>{
    // this.loading.dismiss()
    console.log(result);
    this.city_list=result['city'];
    
    
    
  });
}
form1:any={};

selectarea(){
  console.log(this.form);
  
  this.form1.state=this.form.state;
  this.form1.district=this.form.district;
  this.form1.city=this.form.city1;

  console.log(this.form1);
  

  // this.db.addData3(this.form1,"User/city_user_list")
  this.db.addData(this.form1,"dealerData/getArea")
  .then(resp=>{
    console.log(resp);
    this.area_list = resp['area'];
    console.log(this.area_list);
    this.form.area='';
    // this.district_list = resp['district_list'];
  },
  err=>{
    this.db.errToasr()
  })
}
update()
{
  console.log(this.form);
  if(this.checkExist==true)
  {
    this.db.presentToast('Mobile No. Already Exists !!');
    return
  }
  if(this.form.mobile.length!=10)
  {
    return
  }
  this.db.show_loading()
  console.log(this.form.district);
  // Distributor/save_lead
  // 
  this.db.addData({"id":this.form.id,"data":this.form},"Lead/update_lead")
  .then(resp=>{
    console.log(resp);
    this.db.dismiss()
    
    if(resp['msg'] == 'success')
    {
      this.db.presentToast("Success!");
      this.navCtrl.pop();
    }
  },
  err=>{
    this.db.errToasr()
    this.db.dismiss()
  });
}
save_retailer()
{
  if(!this.form.assign_dr_id)
  {
      let toast = this.toastCtrl.create({
          message: 'Please Select Distributor!',
          duration: 3000
      });
      toast.present();
      return;
  }
  this.form.type_id = 3;
  this.db.addData({"data":this.form},"Lead/save_lead")
  .then(resp=>{
    console.log(resp);
    if(resp['msg'] == 'success')
    {
      this.db.presentToast("Success!");
      this.navCtrl.pop();
    }
  },
  err=>{
    this.db.errToasr()
  })
}
get_district()
{
  this.db.addData({"state_name":this.form.state},"dealerData/getDistrict")
  .then(resp=>{
    console.log(resp);
    this.district_list = resp['district_list'];
    console.log( this.district_list);
    
  },
  err=>{
    this.db.errToasr()
  })
}
checkExist=false
MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
  }
  check_num()
  {
    this.checkExist=false
    console.log(this.form.mobile.length);
    
    if(this.form.mobile && this.form.mobile.length == 10)
    {
      console.log(this.form.mobile.length);
      
      console.log(this.form.mobile);
      this.check_mobile_existence(this.form.mobile)
    }
  }

  check_mobile_existence(mobile)
  {   
    // this.form={}
    this.form.mobile=mobile
    
   this.db.show_loading()
    this.db.addData({'mobile':mobile},'Enquiry/check_mobile_existenceLead').then((result)=>{
      
      this.db.dismiss()
      
      if(result['executive']!=0)
      {
        let alert=this.alertCtrl.create({
          title:'Exists !!',
          subTitle: 'Mobile No Is Already Registered With An Executive !!',
          cssClass:'action-close',
          
          buttons: [
            {
              text:'Okay',
              cssClass: 'close-action-sheet',
              handler:()=>
              {
              }
            }]
          });
          alert.present();
          this.form.mobile='';
          return;
        }
        if(result['check_mobile']==1)
        {
          this.checkExist=true
          
          this.db.presentToast('Dealer With Same Mobile No. Already Exists')
          
        }
        else
        {
          this.form.DealerExist=false;
          
          this.checkExist=false
        }
        
      },err=>
      {
        this.db.dismiss()
        
      })
      
      
      
    }

    selectAddressOnBehalfOfPincode()
    {
      if(this.form.pincode.length==6)
      {
        // this.db.show_loading()
        this.db.addData({'pincode':this.form.pincode},'Enquiry/selectAddressOnBehalfOfPincode').then((result)=>{
          this.db.dismiss()
          
          console.log(result);
          this.form.state = result['state_name']
          this.get_district()
          this.form.district = result['district_name']
          this.form.city = result['city']
          this.form.area = result['area']
          
        },err=>
        {
          // this.db.dismiss()
          
          // this.db.presentToast('Failed To Get ')
        })
      }
    }
}
