import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { TravelAddNewPage } from '../travel-add-new/travel-add-new';
import { TravelEditNewPage } from '../travel-edit-new/travel-edit-new';
import { UploadFilePage } from '../upload-file/upload-file';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { ChangeStatusModelPage } from '../change-status-model/change-status-model';


@IonicPage()
@Component({
  selector: 'page-travel-list-new',
  templateUrl: 'travel-list-new.html',
})
export class TravelListNewPage {

  currentMonth: any;
  currentYear: any;
  TodayDate = new Date().toISOString().slice(0, 10);
  monthNames: string[];
  date: any;
  currentMonth_no: any;
  daysInThisMonth: any = [];
  daysInLastMonth: any = [];
  daysInNextMonth: any = [];
  travel_data: any = {}
  percentages: any = 0;
  userId: any
  dateArray: any = [];
  travelViewType: any = 'My';
  teamCount = 0;
  pending_travel:any
  asm_id:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController
  ) {


   
    
    this.date = new Date();
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    console.log(this.TodayDate);


    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();

    // this.storage.get('userId').then((id) => {
    //   this.userId = id;
    //   console.log(this.userId);
    // });

    this.pending_travel = this.navParams.get('from');
    if( this.navParams.get('from')=='pendingtravel'){
      this.asm_id=this.navParams.get('asm_id')
      this.currentMonth_no=parseInt(this.navParams.get('month_name')) -1
      console.log(this.currentMonth_no);
      
      this.currentYear=parseInt(this.navParams.get('year'))
      console.log(this.currentYear);
      this.travel_data.user=this.asm_id
      

      console.log(this.currentMonth_no);


      console.log(this.asm_id);
      // this.travel_data.user=this.asm_id
      
        this.getMonthlyData(this.asm_id)
      
    
      
    }

    console.log(this.percentages);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelListNewPage');

  }

  ionViewWillEnter() {

    this.travelViewType = this.navParams.get('view_type');

    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });

    // this.travelViewType = 'My';

    if (this.travelViewType == 'My'){
      this.storage.get('userId').then((id) => {
        this.userId = id;
        console.log(this.userId);
        this.getMonthlyData(this.userId);
      });
    }
    else{
      this.get_user();
    }


  }
  goToLastMonth() {
    this.date = new Date(this.currentYear, this.currentMonth_no, 0);
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();

    this.getMonthlyData(this.userId);
  }

  goToNextMonth() {
    this.date = new Date(this.currentYear, this.currentMonth_no + 2, 0);
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();

    this.getMonthlyData(this.userId);
  }


  getMonthlyData(userID) {

    this.userId = userID;

    let data = { 'month': this.currentMonth_no + 1, 'year': this.currentYear, 'user_id': this.userId }

    console.log(data);
    // this.serve.show_loading();

    this.serve.addData(data, 'TravelPlan_new/getTravleData').then((result) => {
      console.log(result);
      // this.serve.dismiss();

      this.dateArray = result['dateArray']
      this.travel_data.working_days = result['tavel_date']['working_days'];
      this.travel_data.travel_plan = result['tavel_date']['travel_plan'];;
      this.percentages = Math.round((this.travel_data.travel_plan / this.travel_data.working_days) * 100);

      console.log(this.travel_data);
      this.getDaysOfMonth();

    }, err => {
      this.serve.dismiss()
      this.serve.errToasr()
    });

  }

  getDaysOfMonth() {

    let i
    this.daysInThisMonth = [];
    this.daysInLastMonth = [];
    this.daysInNextMonth = [];

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    firstDayThisMonth == 0 ? firstDayThisMonth = 6 : firstDayThisMonth = (firstDayThisMonth - 1);

    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();

    for (i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

    for (i = 0; i < thisNumOfDays; i++) {
      let month = ((this.currentMonth_no + 1) < 10) ? '0' + (this.currentMonth_no + 1) : (this.currentMonth_no + 1)
      let date = ((i + 1) < 10) ? '0' + (i + 1) : (i + 1)
      let fulldate = this.date.getFullYear() + '-' + month + '-' + date
      let date_data = this.dateArray.filter(x => x.date === fulldate)[0];

      this.daysInThisMonth[i] = { 'day': i + 1, 'date': fulldate, 'day_name': date_data.day, 'isHoliday': date_data.isHoliday, 'isOnLeave': date_data.isOnLeave, 'isSunday': date_data.isSunday, 'travlePlan': date_data.travlePlan, 'collapse': false, 'travel_info': date_data.travel_info, travel_planstatus: date_data.travel_planstatus };

    }

    console.log(this.daysInThisMonth);


    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();

    if (lastDayThisMonth > 0) {
      for (i = 0; i < (7 - lastDayThisMonth); i++) {
        this.daysInNextMonth.push(i + 1);
      }
    }

    this.serve.dismiss()

  }

  goToPage(date) {
    console.log(date);
    this.navCtrl.push(TravelAddNewPage, { date: date, user_id: this.userId })

  }

  goToEditPage(date) {
    console.log(date);
    this.navCtrl.push(TravelEditNewPage, { date: date,user_id:this.userId  })

  }


  announcementModal() {
    const modal = this.modalCtrl.create(UploadFilePage);

    modal.onDidDismiss(data => {
      console.log(data);
      this.getMonthlyData(this.userId);

    });
    modal.present();

  }

  changeStatusModel() {
    const modal = this.modalCtrl.create(ChangeStatusModelPage, {
      userId: this.userId, 'currentMonth': this.currentMonth, 'currentYear': this.currentYear
    });

    modal.onDidDismiss(data => {
      console.log(data);
      this.getMonthlyData(this.userId);

    });
    modal.present();

  }

  user_list: any = []
  get_user() {
    this.serve.show_loading();
    this.serve.addData({}, "Attendence/all_ASM")
      .then(resp => {
        this.serve.dismiss();
        console.log(resp);
        this.user_list = resp['asm_id'];
        console.log(this.user_list);
      },
        err => {
        })
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Travel' });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {

      console.log(resultData);
      if (resultData) {
        this.travelViewType = resultData.TabStatus;
        if (this.travelViewType == 'Team') {
          this.userId = undefined;
          this.get_user();
        } else {
          this.storage.get('userId').then((id) => {
            this.userId = id;
            console.log(this.userId);
            this.getMonthlyData(this.userId);
          });



        }
        console.log(this.travelViewType);



      }

    })

  }

  downloadFile() {

    console.log("https://apps.abacusdesk.com/kei/sample_travel.csv");
    // this.iab.create('https://apps.abacusdesk.com/kei/sample_travel.csv', '_system');


    window.open("https://apps.abacusdesk.com/kei/sample_travel.csv", '_system');
  }

}
