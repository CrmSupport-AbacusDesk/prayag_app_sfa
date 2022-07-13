import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { PopGiftAddPage } from '../pop-gift-add/pop-gift-add';
import { PopGiftOutgoingPage } from '../pop-gift-outgoing/pop-gift-outgoing';


@IonicPage()
@Component({
  selector: 'page-pop-gift-list',
  templateUrl: 'pop-gift-list.html',
})
export class PopGiftListPage {
  
  pop_list:any=[];
  load_data:any = "0";
  
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public service: MyserviceProvider) 
    {
    }
    
    ionViewDidLoad() 
    {
      console.log('ionViewDidLoad PopGiftListPage');
      
    }
    
    ionViewWillEnter()
    {
      this.getPopList();
      
    }
    
    popGift()
    {
      this.navCtrl.push(PopGiftAddPage);
    }
    
    popOutgoing(id,name)
    {
      this.navCtrl.push(PopGiftOutgoingPage,{id,name});
    }
    
  //   last_attendence() 
  // {
  //     this.attendence_serv.last_attendence_data().then((result) => {
  //         console.log(result);
  //         this.user_data = result['user_data'];
  //         console.log(this.user_data.id);
  //         this.getVisitingCardDetail();
          
  //     });
    
  //   }
    getPopList()
    {
      this.service.show_loading();
      
      this.service.addData('','Pop_gift/executive_pop_gift').then((response)=>
      {
        console.log(response);
        this.pop_list = response['pop_list'];
        if(this.pop_list.length == 0)
        {
          this.load_data = "1";
        }
        this.service.dismiss();
      },
      er=>
      {
        this.service.dismiss();
      });
    }
    
  }
  