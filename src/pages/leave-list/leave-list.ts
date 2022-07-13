import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, App, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { AddLeavePage } from '../add-leave/add-leave';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-leave-list',
  templateUrl: 'leave-list.html',
})
export class LeaveListPage {
  [x: string]: any;
  data:any=[];
  leave_data:any = [];
  loading:Loading;  
  load_data:any=0
  leaveType:any="My";
  leaveStatus:any = 'Pending';
  name:any=[]
expense:any=[]
travel_from:any

  constructor(public storage:Storage,public navCtrl: NavController,public popoverCtrl: PopoverController, public navParams: NavParams, public db:MyserviceProvider,public loadingCtrl:LoadingController,public alertCtrl:AlertController,public app:App, public toastCtrl: ToastController,public modalCtrl: ModalController,) 
  { 
    this.travel_from = this.navParams.get('from');
    if( this.navParams.get('from')=='leave'){
      this.leaveType="Team"
    }
    this.storage.get('userId').then((resp)=>
    {
        this.userId = resp
        console.log(this.userId);
        
    });
    this.storage.get('displayName').then((displayName) => 
    {
        console.log(displayName);
        if(typeof(displayName) !== 'undefined' && displayName)
        {            
            this.expense.userName = displayName;
            console.log(this.expense.userName);      
        }
     });
    this.leave_list();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveListPage');
  }
  
  addPage()
  {
    this.navCtrl.push(AddLeavePage);
  }
  showStatus:any 
  leave_list()
  {
    // leaveType
    // leaveStatus
    this.load_data=0
    this.show_loading();
    this.db.addData({'leaveStatus':this.leaveStatus,'leaveType':this.leaveType},'Leave/leave_list').then((resp)=>
    {
      console.log(resp[1]);
      this.leave_data = resp[0];
      console.log(this.leave_data);
      for (let i = 0; i < this.leave_data.length; i++) {
        this.name=this.leave_data[0].name
        console.log(this.name);
        
              }
      if(resp[1] == 'OFFICE')
      {
        this.showStatus==false;
      }else
      {
        this.showStatus=true
      }
      this.loading.dismiss();
      this.load_data=1
      this.leave_data.map((item)=>
      {
        item.total_days = parseInt(item.total_days) + 1          
      })
      
    });
  }
  
  doRefresh (refresher)
  {   
    
    
    this.leave_list() 
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  show_loading()
  {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg"/>`,
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  presentPopover(myEvent) 
  {
    let popover = this.popoverCtrl.create(ExpensePopoverPage,{'from':'Leaves'});
    
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {

      console.log(resultData);
      if( resultData)
      {
        this.leaveType = resultData.TabStatus;
        console.log(this.leaveType);
        
        this.leave_list();
      }
     
     })
  
  }
  statusModal(id) 
  {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'leaveId':id,'from':'leave'});

    modal.onDidDismiss(data =>
    {
      this.leave_list()
    });
    
    modal.present();
  }
}
