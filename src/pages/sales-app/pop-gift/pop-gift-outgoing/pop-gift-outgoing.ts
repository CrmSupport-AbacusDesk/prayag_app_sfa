import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';


/**
 * Generated class for the PopGiftOutgoingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pop-gift-outgoing',
  templateUrl: 'pop-gift-outgoing.html',
})
export class PopGiftOutgoingPage {

  pop_list:any=[];
  load_data:any = "0";
  pop_gift_id:any='';
  pop_gift_name:any='';

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public service: MyserviceProvider) 
  {
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad PopGiftListPage');
    this.pop_gift_id=this.navParams.get('id');
    this.pop_gift_name=this.navParams.get('name');

    console.log(this.pop_gift_id,this.pop_gift_name);
    
  }
  
  ionViewWillEnter()
  {
    this.getPopList();

  }

  getPopList()
  {
      this.service.show_loading();
         
      this.service.addData({'pop_gift_id':this.pop_gift_id},'Pop_gift/outgoing_history').then((response)=>
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
