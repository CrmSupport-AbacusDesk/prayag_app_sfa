import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

@IonicPage()
@Component({
  selector: 'page-travel-add-new',
  templateUrl: 'travel-add-new.html',
})
export class TravelAddNewPage {
  tarvel_date:any;
  planList : any = [];
  userId:any;
  status:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider) {
  }

  ionViewDidLoad() {
    this.tarvel_date = this.navParams.get('date');
    this.userId = this.navParams.get('user_id');

    console.log('ionViewDidLoad TravelAddNewPage');

    this.GET_TRAVLE_DETAIL();
  }

  GET_TRAVLE_DETAIL(){
    this.serve.show_loading();
    this.serve.addData({ travel_date: this.tarvel_date, 'user_id': this.userId }, 'TravelPlan/travel_plan_detail').then((result) => {
      console.log(result);
      this.planList = result['tarvel_plan_detail'];
      this.status = result['travel_status'];
      this.serve.dismiss()
    }, err => {
      this.serve.dismiss()
      this.serve.errToasr()
    });
  }

  removePlanList(id){
    this.serve.show_loading();
    this.serve.addData({ travel_id: id }, 'TravelPlan/delete_travel_plan').then((result) => {
      console.log(result);
      this.serve.dismiss()
      this.GET_TRAVLE_DETAIL();
    }, err => {
      this.serve.dismiss()
      this.serve.errToasr()
    });
  }

}
