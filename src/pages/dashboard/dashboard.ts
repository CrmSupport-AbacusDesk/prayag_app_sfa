import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events, Platform, MenuController, ModalCmp, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { CatalougeProvider } from '../../providers/catalouge/catalouge';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list';
import moment from 'moment';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { OrderListPage } from '../order-list/order-list';
import { GeolocationserviceProvider } from '../../providers/geolocationservice/geolocationservice';
import { AddCheckinPage } from '../sales-app/add-checkin/add-checkin';
import { ConstantProvider } from '../../providers/constant/constant';
import { WorkTypeModalPage } from '../work-type-modal/work-type-modal';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { Network } from '@ionic-native/network';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { CatalogueHomePage } from '../catalogue-home/catalogue-home';
import { TravelListPage } from '../travel-list/travel-list';
import { DistributorListPage } from '../sales-app/distributor-list/distributor-list';
import { ExpenseListPage } from '../expense-list/expense-list';
import { LmsLeadListPage } from '../sales-app/new-lead/lms-lead-list/lms-lead-list';
import { VisitingCardListPage } from '../visiting-card/visiting-card-list/visiting-card-list';
import { ContractorMeetListPage } from '../Contractor-Meet/contractor-meet-list/contractor-meet-list';
import { LmsQuotationListPage } from '../sales-app/new-lead/lms-lead-quotation/lms-quotation-list/lms-quotation-list';
import { FollowupListPage } from '../followup-list/followup-list'
import { TargetAchievementPage } from '../target-achievement/target-achievement';
import { AnnouncementListPage } from '../announcement/announcement-list/announcement-list';
import { EndCheckinPage } from '../sales-app/end-checkin/end-checkin';
import { RequirementlistPage } from '../requirementlist/requirementlist';
import { NotificationPage } from '../notification/notification';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { CheckinNewPage } from '../checkin-new/checkin-new';
import { LeaveListPage } from '../leave-list/leave-list';
import { TravelListNewPage } from '../travel-list-new/travel-list-new';
import { TravelNewlistPage } from '../travel-newlist/travel-newlist';




@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})
export class DashboardPage {
    @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
    attend_id: any = '';
    currentTime: any = '';
    user_id: any = '';
    attendence_data: any = [];
    announcementCount:any;
    checkin_data:any = [];
    time = new Date();
    timer;
    subscription: any;
    vehicle:any='';
    last_attendence_data: any = [];
    user_data: any = [];
    today_checkin: any = [];
    total_dealer: any = [];
    total_distributor: any = [];
    total_direct_dealer: any = [];
    user_logged_in: boolean;
    start_attend_time: any;
    total_primary_order: any = [];
    total_secondary_order: any = [];
    primary_order_sum: number;
    secondary_order_sum: number;
    targetVsAchievement: any = {};
    today_followup: any = [];
    
    constructor(private network: Network,
        public db:MyserviceProvider,
        
        public navCtrl: NavController
        , public loadingCtrl: LoadingController
        , public service: CatalougeProvider
        , public geolocation: Geolocation
        , private storage: Storage
        , public attendence_serv: AttendenceserviceProvider
        , public toastCtrl: ToastController
        , public alertCtrl: AlertController
        , public events: Events
        , public locationAccuracy: LocationAccuracy
        , public platform: Platform
        , public push: Push
        , public serve: MyserviceProvider
        , public track: GeolocationserviceProvider
        , public menu: MenuController
        , public constant: ConstantProvider
        , public modal: ModalController
        , public offlineService: OfflineDbProvider
        , public modalCtrl: ModalController) {
            
            
        }
        
        // ngOnInit() {
        //     this.timer = setInterval(() => {
        //       this.time = new Date();
        //     }, 1000);
        //   }
        
        //   ngOnDestroy(){
        //     clearInterval(this.timer);
        //   }
        
        ionViewWillEnter() {
            this.getNetworkType()
            this.pending_checkin();
            
            this.timer = setInterval(() => {
                this.time = new Date();
            }, 1000);
            
            //   this.timer = setInterval(() => {
            //    console.log("every time");
            //   }, 1000);
            
            this.last_attendence();
            var time = new Date();
            
            this.currentTime = moment().format("HH:mm:ss");
            
            this.storage.get('token').then((token) => {
                if (typeof (token) !== 'undefined' && token) {
                    this.user_logged_in = true;
                    console.log(this.user_logged_in);
                }
            });
            
            
            this.storage.get('userId').then((id) => {
                console.log(id);
                if (typeof (id) !== 'undefined' && id) {
                    this.user_id = id;
                    console.log(this.user_id);
                }
            });
            
            console.log(this.storage);
            
            
            this.platform.ready().then(() => {
                
                
                this.network.onConnect().subscribe(() => {
                    this.constant.connectionChk = 'online;'
                });
                this.network.onDisconnect().subscribe(() => {
                    this.constant.connectionChk = 'offline';
                });
                
            })
            
            if(this.constant.deviceId!='')
            
            setTimeout(()=>
            {
                console.warn('--------------------------------------');
                console.log(this.constant);
                console.log(this.constant.deviceId);
                console.log(this.user_id);
                console.warn('--------------------------------------');            
                
                {
                    console.log('device id found ' + this.constant.UserLoggedInData.id);
                    let data = 
                    //  this.serve.addData({'registration_id':this.constant.deviceId ,'user_id':this.user_id },'Attendence/update_notification_token').then((r)=>
                    this.serve.addData({'data':this.constant.deviceId},'Attendence/update_notification_token').then((r)=>
                    
                    {
                    });
                }
            },2000);
            
            console.log(this.user_id);
        }
        
        onProcessSQLDataHandler() {
            
            console.log(this.offlineService.localDBCallingCount);
            
            
            // if(this.offlineService.localDBCallingCount === 0) {
            
            //     this.offlineService.localDBCallingCount++;
            //     this.offlineService.onValidateLocalDBSetUpTypeHandler();
            // }
        }
        
        
        ionViewDidLoad() {
            
            console.log("ionViewDidLoad");
            
            this.onProcessSQLDataHandler();
        }
        leave:any=[]
        ionViewDidEnter() {
            
            // do not remove this code its urgent 
            
            // this.subscription = this.platform.backButton.subscribe(()=>{
            //     console.log("in exit function");
            
            //     let alert=this.alertCtrl.create({
            //         title:'Exit Application?',
            //         subTitle: 'Are you sure want to exit the App?',
            //         cssClass:'action-close',
            
            //         buttons: [{
            //             text: 'Cancel',
            //             role: 'cancel',
            //             handler: () => {
            //             }
            //         },
            //         {
            //             text:'Confirm',
            //             cssClass: 'close-action-sheet',
            //             handler:()=>
            //             {
            //                 navigator['app'].exitApp();
            //             }
            //         }]
            //     });
            //     alert.present();
            // });
            
            this.last_attendence();
            
            this.events.publish('current_page', 'Dashboard');
        }
        
        //     ionViewWillLeave(){
        //         console.log("in exit function 2");
        //         this.subscription.unsubscribe();
        //   }
        
        ionViewDidLeave() {
            this.events.publish('current_page', '');
        }
        modal3(){
            console.log(this.leave)
            
            if(this.leave=="Not Able To Punch Attendance"){
                this.serve.presentToast('You are on leave')
                return;
            }
            else(this.leave=="Able To Punch Attendance")
            {
                this.openModal('start');
                
            }
        }
        openModal(type) {
            console.log("hlo sunny 1");
            let workTypeModal = this.modal.create(WorkTypeModalPage, { 'type': type, 'id': this.last_attendence_data.attend_id });
            
            workTypeModal.onDidDismiss(data => {
                this.events.publish('user:login');
                this.last_attendence();
            });
            
            workTypeModal.present();
            
            //   });
            
        }
        pending_checkin()
        {
            this.serve.pending_data().then((result)=>{
                console.log(result);
                this.checkin_data = result['checkin_data'];
                console.log(this.checkin_data); 
                // this.navCtrl.push(EndCheckinPage,{'data':this.checkin_data});      
            })
        }
        // stop_attend() 
        // {
        //     log("hiiii")
        //     this.platform.ready().then(() => {
        
        //         var whiteList = ['com.package.example','com.package.example2'];
        
        //         (<any>window).gpsmockchecker.check(whiteList, (result) => {
        
        //           console.log(result,'test');
        
        //           if(result.isMock){
        //               console.log("DANGER!! Mock is in use");
        //               console.log("Apps that use gps mock: ");
        //               let alert = this.alertCtrl.create({
        //                 title: 'Alert',
        //                 subTitle: 'Please Remove Thirt Party Location Apps',
        //                 buttons: [
        //                     {
        //                         text: 'Ok',
        //                         handler: () => 
        //                         {
        
        //                         }
        //                     }
        //                 ]
        //             });
        //             alert.present();
        //               console.log(result.mocks);
        //           }
        //           else
        //           {
        //               console.log("hloo work out of territory")
        //             this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => 
        //             {
        //                 let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
        //                 this.geolocation.getCurrentPosition(options).then((resp) => 
        //                 {
        //                     var lat = resp.coords.latitude
        //                     var lng = resp.coords.longitude
        //                     this.serve.show_loading()
        
        //                     this.attendence_serv.stop_attend({ 'lat': lat, 'lng': lng, 'attend_id': this.last_attendence_data.attend_id }).then((result) => 
        //                     {
        //                         if(result =='success')
        //                         {
        //                             this.last_attendence();
        //                             this.serve.dismiss()
        //                             this.serve.presentToast('Work Time Stopped Successfully')
        //                         }
        //                     },err=>
        //                     {
        //                         this.serve.dismiss()
        //                         this.serve.errToasr()
        //                     })
        
        //                 }).catch((error) => 
        //                 {
        //                     this.serve.presentToast('Could Not Get Location !!')
        //                 });
        //             },
        //             error => 
        //             {
        //                 this.serve.presentToast('Please Allow Location !!')
        //             });
        //           }
        
        
        
        //         }, (error) => console.log(error));
        
        //       });
        
        // }
        
        start_attend() {
            // console.log(this.data);
            this.serve.show_loading();
            
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => {
                
                let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
                this.geolocation.getCurrentPosition(options).then((resp) => {
                  
                  var lat = resp.coords.latitude
                  var lng = resp.coords.longitude
                  
                  // this.serve.show_loading()
                  
                  this.attendence_serv.start_attend({ 'lat': lat, 'lng': lng, 'id': this.user_id,  }).then((result) => {
                    if (result['msg'] == 'success') {
                      this.events.publish('user:login');
                      this.serve.dismiss();
                      this.serve.presentToast('Work Time Started Successfully');
                      this.last_attendence()
                    }
                  })
                  
                }).catch((error) => {
                  this.serve.presentToast('Could Not Get Location!!')
                  this.serve.dismiss();
                  
                });
              },
              error => {
                this.serve.dismiss();
                this.serve.presentToast('Please Allow Location!!')
              });
              
            }
        
        stop_attend() {
            console.log("hlooo stop");
            
            // this.serve.show_loading();
            console.log("hlooo stop");
            
            
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
                let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
                this.geolocation.getCurrentPosition(options).then((resp) => {
                    var lat = resp.coords.latitude
                    var lng = resp.coords.longitude
                    
                    this.attendence_serv.stop_attend({ 'lat': lat, 'lng': lng, 'attend_id': this.last_attendence_data.attend_id }).then((result) => {
                        if (result == 'success') {
                            // this.serve.dismiss();
                            this.serve.presentToast('Work Time Stopped Successfully');
                            this.last_attendence()
                        }
                    }, err => {
                        this.serve.dismiss()
                        this.serve.errToasr()
                    })
                    
                }).catch((error) => {
                    this.serve.presentToast('Could Not Get Location !!')
                });
            },
            error => {
                this.serve.presentToast('Please Allow Location !!')
            });
            
        }
        
        presentAlert() {
            
            this.platform.ready().then(() => {
                
                var whiteList = ['com.package.example','com.package.example2'];
                
                (<any>window).gpsmockchecker.check(whiteList, (result) => {
                    
                    console.log(result);
                    
                    if(result.isMock){
                        console.log("DANGER!! Mock is in use");
                        console.log("Apps that use gps mock: ");
                        let alert = this.alertCtrl.create({
                            title: 'Alert!',
                            subTitle: 'Please Remove Thirt Party Location Apps',
                            buttons: [
                                {
                                    text: 'Ok',
                                    handler: () => 
                                    {
                                        
                                    }
                                }
                            ]
                        });
                        console.log(result.mocks);
                    }
                    else
                    {
                        let alert = this.alertCtrl.create({
                            title: 'Stop Time',
                            message: 'Do you want to stop work time?',
                            cssClass: 'alert-modal',
                            buttons: [
                                {
                                    text: 'Yes',
                                    handler: () => {
                                        console.log('Yes clicked');
                                        console.log(this.vehicle);
                                        
                                        if(this.vehicle != 'Car'&&this.vehicle != 'Bike'){
                                            this.stop_attend();
                                            console.log('Cancel clicked work out of territory');
                                            
                                        }
                                        else if (this.vehicle == 'Car'||this.vehicle == 'Bike'){
                                            this.openModal('stop');
                                            console.log("hloooo sunny");
                                            
                                        }
                                        
                                        else{
                                            
                                        }
                                    }
                                },
                                {
                                    text: 'No',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                    }
                                }
                                
                            ]
                        });
                        alert.present();
                    }
                    
                    
                }, (error) => console.log(error));
                
            });
            
            
        }
        presentAlert1() {
            
            this.platform.ready().then(() => {
                
                var whiteList = ['com.package.example','com.package.example2'];
                
                (<any>window).gpsmockchecker.check(whiteList, (result) => {
                    
                    console.log(result);
                    
                    if(result.isMock){
                        console.log("DANGER!! Mock is in use");
                        console.log("Apps that use gps mock: ");
                        let alert = this.alertCtrl.create({
                            title: 'Alert!',
                            subTitle: 'Please Remove Thirt Party Location Apps',
                            buttons: [
                                {
                                    text: 'Ok',
                                    handler: () => 
                                    {
                                        
                                    }
                                }
                            ]
                        });
                        console.log(result.mocks);
                    }
                    else
                    {
                        let alert = this.alertCtrl.create({
                            title: 'Stop Time',
                            message: 'Do you want to start work time?',
                            cssClass: 'alert-modal',
                            buttons: [
                                {
                                    text: 'Yes',
                                    handler: () => {
                                        console.log('Yes clicked');
                                        console.log(this.vehicle);
                                        this.start_attend()
                                     
                                    }
                                },
                                {
                                    text: 'No',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                    }
                                }
                                
                            ]
                        });
                        alert.present();
                    }
                    
                    
                }, (error) => console.log(error));
                
            });
            
            
        }
        
        
        Approval_array:any
        expense:any
        leaveany:any
        
        team_count:any
        last_attendence() {
            // this.db.show_loading()
            this.attendence_serv.last_attendence_data().then((result) => {
                console.log(result);
                console.log("hiiiiiiiiiiiiiiiiiiii")
                
                // this.db.dismiss()
                this.last_attendence_data = result['attendence_data'];
                this.team_count = result['team_count'];
                this.storage.set('team_count', this.team_count);
                console.log(this.team_count)
                this.vehicle = result['attendence_data']['vehicle'];
                this.announcementCount=result['announcementCount']['announcementCount'];
                console.log(this.announcementCount);
                
                this.user_data = result['user_data'];
                this.today_checkin = result['today_checkin'];
                this.total_dealer = result['total_dealer'];
                this.Approval_array = result['Approval_array']['PendingTravelPlan'];
                this.expense = result['Approval_array']['expense'];
                this.leaveany = result['Approval_array']['leave'];
                
                console.log(this.Approval_array)
                
                this.total_direct_dealer = result['total_direct_dealer'];
                this.total_distributor = result['total_distributor'];
                this.total_primary_order = result['total_primary_order'];
                this.total_secondary_order = result['total_secondary_order'];
                this.targetVsAchievement = result['targetVsAchievement'];
                this.today_followup = result['today_followup']
                this.leave = result['attendance_punch_msg']
                
                if (this.last_attendence_data.start_time != '') {
                    var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
                    var H = +this.last_attendence_data.start_time.substr(0, 2);
                    var h = (H % 12) || 12;
                    var ampm = H < 12 ? "AM" : "PM";
                    this.start_attend_time = h + this.last_attendence_data.start_time.substr(2, 3) +' '+ ampm;
                }
                
            },error=>{
                console.log("Dashboard error");
                this.serve.dismiss()
                
            })
            
        }
        open_menu() {
            console.log(this.user_logged_in);
            this.events.publish('user:navigation_menu');
        }
        
        goToCheckin() {
            if(this.checkin_data != null){
                console.log("if");  
                console.log(this.checkin_data.length);  
                this.navCtrl.push(EndCheckinPage,{'data':this.checkin_data});         
            }
            else{
                this.navCtrl.push(CheckinNewPage);    
            }
        }
        
        goToTravel() {
            if(this.Approval_array>0)
            {
            this.navCtrl.push(TravelNewlistPage, { from: 'travel', view_type:'Team'});


            }
            else{
            this.navCtrl.push(TravelListNewPage, { from: 'travel', view_type:'Team'});

            }
        }
        
        
        goToLead() {
            this.navCtrl.push(LmsLeadListPage);
            
        }
        
        goToFollowup() {
            this.navCtrl.push(FollowupListPage);
        }
        goToTeam() {
            this.navCtrl.push(LeaveListPage,{from:'leave'});
        }
        goToExpense() {
            this.navCtrl.push(ExpenseListPage, { from: 'expense', view_type: 'Team'
});
        }
        goToRequirement() 
        {
            console.log('RequirementPage');
            
            this.navCtrl.push(RequirementlistPage);
        }
        goToContractor() {
            this.navCtrl.push(ContractorMeetListPage);
        }
        goToQuotation() {
            this.navCtrl.push(LmsQuotationListPage);
        }
        
        goToMainDistributorListPage(type) {
            this.navCtrl.push(MainDistributorListPage, { 'type': type })
        }
        start_visit() {
            
            this.navCtrl.push(CheckinNewPage);
        }
        goToOrders(type) {
            this.navCtrl.push(OrderListPage, { 'type': type });
            // this.navCtrl.push(ProductSubdetailPage,{'id':50});
        }
        
        goToCatHome() {
            this.navCtrl.push(CatalogueHomePage);
            // this.navCtrl.push(ProductSubdetailPage,{'id':50});
        }
        
        viewAchievement(type) {
            
            if(type=='primary'){
                
            }
            else{
                
            }
            let TargetAchievement = this.modal.create(TargetAchievementPage, { 'type': type });
            
            TargetAchievement.onDidDismiss(data => {
                this.events.publish('user:login');
                // this.last_attendence();
            });
            
            TargetAchievement.present();
            // this.navCtrl.push(TargetAchievementPage);
        }
        
        show_Error(){
            console.log("start your attendence first");
            
            let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'Please Start Attendence First',
                buttons: [
                    {
                        text: 'Ok',
                        handler: () => 
                        {
                            
                        }
                    }
                ]
            });
            alert.present();
            
            
            
            
        }
        
        open_notification(){
            console.log("inside notification");
            this.navCtrl.push(AnnouncementListPage);
            
        }
        
        announcementModal() {
            const modal = this.modalCtrl.create(AnnouncementListPage);
            
            modal.onDidDismiss(data => {
                console.log(data);
                this.last_attendence();
                
            });
            modal.present();
            
        }
        
        networkType:any=[]
        getNetworkType(){
            this.serve.addData('', "lead/distributionNetworkModule").then((result => {
                console.log(result);
                this.networkType = result['modules'];
            }))
        }
        doRefresh (refresher)
        { 
            
            this.last_attendence();
            this.pending_checkin();
            setTimeout(() => {
                refresher.complete();
            }, 1000);
        }
        
        
        
        
        
    }
    