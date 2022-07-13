import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the TravelEditNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-edit-new',
  templateUrl: 'travel-edit-new.html',
})
export class TravelEditNewPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

  data: any = {};
  cityList: any = [];
  beatCodeList: any = [];
  planList: any = [];
  planDate: any;
  userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider) {
  }

  ionViewDidLoad() {
    this.data.travel_type = 'Retailer';
    this.data.date_from = this.navParams.get('date');
    this.userId = this.navParams.get('user_id');

    if (this.data.date_from) {
      this.GET_TRAVLE_DETAIL();
    }
    this.GET_BEAT_CODE_LIST();

    console.log(this.data.date_from);


    console.log('ionViewDidLoad TravelEditNewPage');
  }

  // GET_CITY_LIST(){
  //   this.serve.show_loading();

  //   this.serve.addData({}, 'TravelPlan/city_list2').then((result) => {
  //     console.log(result);
  //     this.serve.dismiss()
  //     this.cityList = result;
  //   }, err => {
  //     this.serve.dismiss()
  //     this.serve.errToasr()
  //   });
  // }

  GET_BEAT_CODE_LIST() {
    // this.serve.show_loading();

    this.serve.addData({ city: '' }, 'TravelPlan/beat_code_list_according_to_city').then((result) => {
      console.log(result);
      // this.serve.dismiss()
      this.beatCodeList = result['beat_code_list'];
      for(let i = 0 ;i<this.beatCodeList.length;i++){
          this.beatCodeList[i].beat_code1=this.beatCodeList[i].beat_code+' '+'( '+this.beatCodeList[i].area+')'
       
      }
    }, err => {
      // this.serve.dismiss()
      this.serve.errToasr()
    });
  }
a:any
  addToList() {
console.log(this.data.beat_code.beat_code);
// this.a=this.data.beat_code.beat_code.split("(")
// console.log(this.a)
 this.data.beat_code=this.data.beat_code.beat_code
    let isExistIndex = this.planList.findIndex(row => row.beat_code == this.data.beat_code)

    if(isExistIndex == -1){
      console.log(this.data)

      this.planList.push(JSON.parse(JSON.stringify(this.data)));
  
      console.log(this.planList);
  
      // this.data.travel_type = '';
      this.data.city = '';
      this.data.beat_code = '';
      this.data.status_remark = '';
    }
    else{
      this.serve.presentToast("This Beat-code Plan Already added")
    }

  }

  savePlanList() {

    // this.serve.show_loading();
    this.serve.addData({ travel_item_data: this.planList, travel_date: this.data.date_from }, 'TravelPlan/add_travel_plan').then((result) => {
      console.log(result);
      // this.serve.dismiss();
      this.serve.presentToast("Visit Plan Update Successfully.");
      this.navCtrl.pop();
    }, err => {
      this.serve.dismiss()
      this.serve.errToasr()
    });
  }

  GET_TRAVLE_DETAIL() {
    this.serve.show_loading();
    this.serve.addData({ travel_date: this.data.date_from,'user_id':this.userId }, 'TravelPlan/travel_plan_detail').then((result) => {
      console.log(result);
      this.planList = result['tarvel_plan_detail'];
      this.serve.dismiss()
    }, err => {
      this.serve.dismiss()
      this.serve.errToasr()
    });
  }

  removePlanList(index) {
    this.planList.splice(index, 1);
  }


}
