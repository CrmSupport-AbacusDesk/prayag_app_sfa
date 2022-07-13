import { Component } from '@angular/core';
import {  AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ContractorMeetAddPage } from '../contractor-meet-add/contractor-meet-add';
import { ContractorMeetDetailPage } from '../contractor-meet-detail/contractor-meet-detail';
import { ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';





/**
* Generated class for the ContractorMeetListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-meet-list',
  templateUrl: 'contractor-meet-list.html',
})
export class ContractorMeetListPage {
  data: any=[];
  data1: any;
  flag:any='';
  search:any;
  contractor:any={};
  currentPage: any = 1;
  pageSize = 2;
  
  start:any=0;
  limit:any=5;
  
  user_data:any={};
  allcount: any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public service1: MyserviceProvider, public service:DbserviceProvider,public attendence_serv: AttendenceserviceProvider,public alertCtrl:AlertController, public toastCtrl: ToastController) {
    this.tabActive('pending');
    // this.getContractorMeetDetail();
    console.log("hello");
    console.log(navParams);
    
  }
  tabActiveType:any={};
  activetab:any= 'pending';
  
  tabActive(tab:any)
  {
    this.tabActiveType = {};
    this.tabActiveType[tab] = true; 
    this.activetab =  tab;
    console.log(this.activetab);
    console.log(this.activetab);
  this.last_attendence(); 
    
  }
  
  ionViewWillEnter() {
    console.log('ionViewDidLoad ContractorMeetListPage');
    console.log("hello");
    this.getContractorMeetDetail();

  }
  
  contractorMeetAdd()
  {
    this.navCtrl.push(ContractorMeetAddPage,{'created_by':this.user_data.id});
  }

  // listdelete(id){

  //   console.log(id);

  //     this.service.post_rqst({'id':id},'Contractor/delete_meeting').subscribe((response)=>
  //       {
  //         console.log(response);
  //         this.last_attendence(); 
  //       });
  //   }


    listdelete(id)
    {
      
        let alert = this.alertCtrl.create({
          title: 'Delete Event',        
          message: 'Do you want to delete event?',
          cssClass: 'alert-modal',
          buttons: [
            {
              text: 'Yes',
              handler: () => 
              {
                this.service.post_rqst({'id':id},'Contractor/delete_meeting').subscribe((result)=>
                {
               this.contractor=result;
              
              console.log(this.contractor);
    
                  let toast = this.toastCtrl.create({
                    message: 'Requirement Deleted!',
                    duration: 3000
                  });
                  if(this.contractor)
                  {
                    this.last_attendence();
                  }
                });
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        alert.present();
        
    }

  
  last_attendence() 
  {
      this.attendence_serv.last_attendence_data().then((result) => {
          console.log(result);
          this.user_data = result['user_data'];
          console.log(this.user_data.id);
    this.getContractorMeetDetail();
      
      });
    
    }

  contractorMeetDetail(id)
  {
    this.navCtrl.push(ContractorMeetDetailPage,{'meeting_id':id,'status':this.activetab})
  }
  // loadDataa:any=1;
  
  getContractorMeetDetail()  {
    
    // this.loadDataa=1;
    console.log(this.user_data.id);
    // this.service1.show_loading();
    
    this.service1.addData( {'limit': this.limit, 'start': this.start,'status':this.activetab,'created_by':this.user_data.id},'Contractor/filterMeetingData').then((response)=>
    {
      console.log(response);
      this.data= response;
      
      this.allcount=response['visiting_card']
      // this.service1.dismiss();
      // this.loadDataa=0
      
    },er=>
    {
    });  
  }
  
  
  // loadData(infiniteScroll)
  // {
  //   console.log('loading');
  
  //   this.data.limit=this.data.result.length;
  //   this.service.post_rqst({},'Contractor/filterMeetingData').subscribe( r =>
  //     {
  //       console.log(r);
  //       if(r['data']=='')
  //       {
  //         this.flag=1;
  //       }
  //       else
  //       {
  //         setTimeout(()=>{
  //           this.data=this.data.concat(r['data']);
  //           console.log('Asyn operation has stop')
  //           infiniteScroll.complete();
  //         },1000);
  //       }
  //     });
  //   }
  
  
  
  
  doRefresh (refresher)
  { 
    if(this.search)  
    this.search={}
    
    this.limit=0
    
    this.getContractorMeetDetail() 
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  
  
  
  
  
  
  
  
}