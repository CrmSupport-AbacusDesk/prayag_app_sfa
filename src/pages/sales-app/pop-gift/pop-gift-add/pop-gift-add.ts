import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import {Observable} from 'rxjs/Rx';


@IonicPage()
@Component({
  selector: 'page-pop-gift-add',
  templateUrl: 'pop-gift-add.html',
})
export class PopGiftAddPage {
  
  pop_list:any=[];
  network_list:any=[];
  pop_data:any={};
  local_data:any={};
  view_section:any='submit';
  checkin_id:any=0;
  items:any=[];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public service: MyserviceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) 
    {

      console.log(this.navParams);
      this.checkin_id=this.navParams.get('checkin_id');
      if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
        this.pop_data.networkType=this.navParams.get('dr_type');
        this.get_network_list( this.pop_data.networkType);
      }

    }
    
    ionViewDidLoad() 
    {
      console.log('ionViewDidLoad PopGiftAddPage');
    }
    
    get_network_list(network_type)
    {
      this.service.addData({'type':network_type},'DealerData/get_type_list').then((result)=>{
        console.log(result);
        this.network_list = result;
    
        if(this.navParams.get('dr_name'))
        {
          this.pop_data.dr_id= this.network_list.filter(row=>row.company_name == this.navParams.get('dr_name'));
          this.pop_data.dr_id=this.pop_data.dr_id[0].id;
          this.getPopList();
        }

      });
    }
    
    getPopList()
    {
      this.service.addData('','Pop_gift/executive_pop_gift').then((response)=>
      {
        console.log(response);
        this.pop_list = response['pop_list'];
        console.log(this.pop_list);
        
      },
      er=>
      {
      });
    }

    stockValue()
    {
      console.log(this.pop_data);
      
      let index = this.pop_list.findIndex(row=>row.pop_gift_id ==this.pop_data.pop_gift_id)
      this.pop_data.item_name = (this.pop_list[index].item_name);

     
        this.local_data.stock_qty = parseInt(this.pop_list[index].stock_qty)

     

      console.log(this.pop_data);
      

    }

    addToList()
    {
      console.log(this.pop_data);
      let secondary_index = this.pop_list.findIndex(row=>row.pop_gift_id ==this.pop_data.pop_gift_id)
      this.pop_list[secondary_index].stock_qty = parseInt(this.pop_list[secondary_index].stock_qty) - parseInt(this.pop_data.qty)

      let index = this.items.findIndex(row=>row.pop_gift_id ==this.pop_data.pop_gift_id)

      if(index==-1)
      {
         this.items.push({'item_name':this.pop_data.item_name,
                          'pop_gift_id':this.pop_data.pop_gift_id,
                          'qty':this.pop_data.qty})
      }
      else
      { 
         this.items[index].qty = parseInt(this.items[index].qty) + parseInt(this.pop_data.qty);
      }

      this.pop_data.item_name =''
      this.pop_data.pop_gift_id =''
      this.pop_data.qty =''
      this.local_data.stock_qty ='' 
      
    }
    
    sendOtp()
    {
      let index = this.network_list.findIndex(row=>row.id ==this.pop_data.dr_id)
      this.local_data.otp = Math.floor(100000 + Math.random() * 900000);
      this.local_data.mobile = this.network_list[index].mobile;
      // this.local_data.otp = 123456;

      let alert=this.alertCtrl.create({
        title:'Are You Sure?',
        subTitle: 'You want to save this ?',
        cssClass:'action-close',
        
        buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                
            }
        },
        {
            text:'Confirm',
            cssClass: 'close-action-sheet',
            handler:()=>
            {
              this.view_section ='otp';
              this.service.addData(this.local_data,'Pop_gift/send_otp').then((response)=>
              {
                console.log(response);
              },
              er=>
              {
              });
            }
        }]
    });
    alert.present();
     
    }

    
    checkOtp()
    {
      if(this.local_data.otp == this.pop_data.otp)
      {

        this.pop_data.checkin_id=this.checkin_id;
        this.pop_data.items=this.items;
        console.log(this.pop_data);
        let toast = this.toastCtrl.create({
          message: 'Saved Successfully!',
          duration: 3000
        });
        this.service.addData(this.pop_data,'Pop_gift/insert_dr_pop').then((response)=>
        {
          console.log(response);
          toast.present();
          this.navCtrl.pop();
        },
        er=>
        {
        });
      }
      else
      {
        let alert = this.alertCtrl.create({
          subTitle: 'OTP do not match',
          buttons: ['Try Again']
        });
        alert.present();
        console.log('otp not match');
      }
    }

    delete_from_list(index){
      
      let secondary_index = this.pop_list.findIndex(row=>row.pop_gift_id ==this.items[index].pop_gift_id)
      this.pop_list[secondary_index].stock_qty = parseInt(this.pop_list[secondary_index].stock_qty)+parseInt(this.items[index].qty)
      console.log(this.pop_list);
      this.items.splice(index,1);
      console.log(this.items);
      
    }

    
   
    
  }
  