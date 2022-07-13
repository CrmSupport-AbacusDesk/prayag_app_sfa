import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,Events, App, ToastController, AlertController, MenuController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { ConstantProvider } from '../providers/constant/constant';
import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { AboutusModalPage } from '../pages/aboutus-modal/aboutus-modal';
import * as jwt_decode from "jwt-decode";
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AppVersion } from '@ionic-native/app-version';
import { SelectRegistrationTypePage } from '../pages/select-registration-type/select-registration-type';
import moment from 'moment';
import { AttendenceserviceProvider } from '../providers/attendenceservice/attendenceservice';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { MyserviceProvider } from '../providers/myservice/myservice';
import { LeaveListPage } from '../pages/leave-list/leave-list';
import { MainDistributorListPage } from '../pages/sales-app/main-distributor-list/main-distributor-list';
import { DistributorListPage } from '../pages/sales-app/distributor-list/distributor-list';
import { CheckinListPage } from '../pages/sales-app/checkin-list/checkin-list';
import { AttendencePage } from '../pages/attendence/attendence';
import { TravelListPage } from '../pages/travel-list/travel-list';
// import { ContactusPage } from '../pages/contactus/contactus';
import { CategoryPage } from '../pages/category/category';
import { Network } from '@ionic-native/network';

import { DealerHomePage } from '../pages/dealer-home/dealer-home';

import { DealerCheckInPage } from '../pages/dealer-check-in/dealer-check-in';
import { DealerOrderPage } from '../pages/dealer-order/dealer-order';
import { DealerProfilePage } from '../pages/dealer-profile/dealer-profile';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { DealerDealerListPage } from '../pages/dealer-dealer-list/dealer-dealer-list';
import { FavoriteProductPage } from '../pages/favorite-product/favorite-product';
import { VideoCategoryPage } from '../pages/video-category/video-category';
import { LeadsDetailPage } from '../pages/leads-detail/leads-detail';
import { FollowupListPage } from '../pages/followup-list/followup-list';
import { ExpenseListPage } from '../pages/expense-list/expense-list';
import { ProductsPage } from '../pages/products/products';
import { AnnouncementListPage } from '../pages/announcement/announcement-list/announcement-list';
import { PolicyPage } from '../pages/policy/policy';
import { NewarrivalsPage } from '../pages/newarrivals/newarrivals';
import { SupportPage } from '../pages/support/support';
import { CataloguePdfPage } from '../pages/catalogue-pdf/catalogue-pdf';
import { LoginPage } from '../pages/login/login';
import { CatalogueHomePage } from '../pages/catalogue-home/catalogue-home';
import { ContractorMeetListPage } from '../pages/Contractor-Meet/contractor-meet-list/contractor-meet-list';
import { EnquiryPage } from '../pages/enquiry/enquiry';
import { VisitingCardListPage } from '../pages/visiting-card/visiting-card-list/visiting-card-list';
import { VisitingCardPage } from '../pages/visiting-card/visiting-card';
import { LmsLeadListPage } from '../pages/sales-app/new-lead/lms-lead-list/lms-lead-list';
import { LmsActivityListPage } from '../pages/sales-app/new-lead/lms-lead-activity/lms-activity-list/lms-activity-list';
import { PopGiftListPage } from '../pages/sales-app/pop-gift/pop-gift-list/pop-gift-list';
import { LmsQuotationListPage } from '../pages/sales-app/new-lead/lms-lead-quotation/lms-quotation-list/lms-quotation-list';
import { ProfilePage } from'../pages/profile/profile';
import { EndCheckinPage } from '../pages/sales-app/end-checkin/end-checkin'
import { RequirementPage} from '../pages/requirement/requirement';
import { RequirementlistPage } from '../pages/requirementlist/requirementlist';
import { CancelpolicyModalPage } from '../pages/cancelpolicy-modal/cancelpolicy-modal';
import { AttendenceNewPage } from '../pages/attendence-new/attendence-new';
import { CheckinNewPage } from '../pages/checkin-new/checkin-new';
import { TravelListNewPage } from '../pages/travel-list-new/travel-list-new';


// import { FCM } from '@ionic-native/fcm'



export interface PageInterface {
    title: string;
    name: string;
    component: any;
    icon: string;
    index?: number;
    tabName?: string;
    tabComponent?: any;
    show:any;
    
}
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    
    @ViewChild(Nav) nav: Nav;
    connectionChk:any='';
    rootPage:any;
    tokenInfo:any='';
    loginType:any='';
    current_page:any;
    check_token:any;
    pages: PageInterface[];
    user_logged_in:boolean;
    userLoggedRole:any;
    userLoggedDisplayName:any;
    userRoleId:any;
    last_attendence_data:any = [];
    currentTime:any = '';
    userType:any;
    userName:any;
    versionNumber:any;
    userToken:any;
    checkin_data: any=[];
    
    constructor( private network :Network ,public platform: Platform, statusBar: StatusBar, public menu: MenuController, public attendenceServe: AttendenceserviceProvider, splashScreen: SplashScreen, public modalCtrl: ModalController,public storage:Storage,public events:Events,public constant:ConstantProvider, private app: App,public toastCtrl:ToastController,public serve:MyserviceProvider,public service:DbserviceProvider,public myserv:MyserviceProvider,public alertCtrl:AlertController, public push: Push,public appVersion: AppVersion) 
    {
        this.myserv.navigationEvent.subscribe(
            data => {
                console.log(data);
                this.nav.push(data.page)
                
                // this.nav.push(data.page);
            }
            )
            window.addEventListener('offline', (data) => {
                //Do task when no internet connection
                console.log("internet offline");
                console.log(data.type);
                
                this.serve.isInternetConnection = false;
                
                this.nav.push(CancelpolicyModalPage)
                
                
                // let alert = this.alertCtrl.create({
                //     title: 'Alert',
                //     subTitle: 'Error! Something Went wrong',
                //     buttons: ['Ok']
                //   });
                //   alert.present();
                
                
            })
            
            window.addEventListener('online', (data) => {
                console.log(data);
                this.serve.isInternetConnection = true;
                
                console.log(this.serve.isInternetConnection);
                this.events.publish('state', 'online');
                
                //Do task when internet connection returns
                console.log("internet online");
                
            });
            //dealer company name update event
            events.subscribe('dealerProfileUpdated',(data)=>
            {
                console.log(data);
                this.userLoggedDisplayName = data;
                console.log(this.userLoggedDisplayName);
            })
            //dealer company name update event
            
            this.pending_checkin();
            
            console.log('splash Hide')
            console.log(this.network.type);
            
            this.constant.networkType = this.network.type;
            
            
            // Uncomment for logout
            // this.logout();
            
            // commented
            this.check_version();
            
            storage.get('loginType').then((loginType) => {
                console.log(loginType);
                this.loginType = loginType;
            });
            console.log(this.loginType);
            
            setTimeout(() => {
                console.log(this.loginType);
                
                if(this.loginType == 'CMS')
                {
                    storage.get('token').then((val) => {
                        console.log(val);
                        
                        if(val == '' || val == null || val == undefined)
                        {
                            ////alert('line81')
                            
                            this.rootPage=SelectRegistrationTypePage;
                        }else  if(val )
                        {
                            this.tokenInfo = this.getDecodedAccessToken(val );
                            console.log( this.tokenInfo);
                            console.log(  this.tokenInfo.sub);
                            this.rootPage=LoginPage,{'registerType':'Employee'};
                            
                            
                        }
                        
                        // }
                    });
                    events.subscribe('data',(data)=>
                    {
                        console.log(data);
                        if(data==1)
                        {
                            storage.get('token_value').then((val) => {
                                //alert(val);
                                
                                // if(val == '' || val == null || val == undefined)
                                // {
                                console.log('if');
                                this.nav.setRoot(LoginPage,{'registerType':'Employee'});
                                // }
                                // else
                                // {
                                // console.log('else');
                                // this.nav.setRoot(SelectRegistrationTypePage);
                                // }
                            });
                        }
                    })
                }
                else
                {
                    setTimeout(() => {
                        console.log(this.constant.UserLoggedInData);
                        
                        if(this.constant.UserLoggedInData.userLoggedInChk==false)
                        {
                            // this.nav.setRoot(CatalogueHomePage);
                            this.nav.setRoot(LoginPage,{'registerType':'Employee'});
                            
                            this.setPagesDealer('NotLoggedIn')
                            // this.nav.setRoot(SelectRegistrationTypePage);
                        }
                        else
                        {
                            if(this.constant.UserLoggedInData.loggedInUserType=='Employee')
                            {
                                storage.get('token_value').then((val) => 
                                {
                                    console.log(val);
                                    
                                    if(val == '' || val == null || val == undefined)
                                    {
                                        console.log('if');
                                        this.nav.setRoot(SelectRegistrationTypePage);
                                    }
                                    else
                                    {
                                        // alert('line190')
                                        this.nav.setRoot(DashboardPage);
                                        // this.nav.setRoot(TabsPage);
                                        
                                        console.log('else');
                                    }
                                });
                                this.currentTime = moment().format("HH:mm:ss");
                                
                                
                                this.storage.get('token').then((token) => {
                                    if(typeof(token) !== 'undefined' && token){
                                        this.user_logged_in = true;
                                        this.set_pages();
                                    }
                                    else
                                    {
                                        this.user_logged_in = false;
                                        // this.rootPage = SelectRegistrationTypePage;
                                        this.rootPage = SelectRegistrationTypePage;
                                    }
                                });
                                this.storage.get('name').then((name) => {
                                    if(typeof(name) !== 'undefined' && name){
                                        this.userName = name;
                                        this.set_pages();
                                    }
                                });
                                this.storage.get('role_id').then((roleId) => {
                                    if(typeof(roleId) !== 'undefined' && roleId){
                                        this.userRoleId = roleId;
                                        this.set_pages();
                                    }
                                });
                                this.storage.get('user_type').then((userType) => {
                                    if(typeof(userType) !== 'undefined' && userType){
                                        this.userType = userType;
                                        console.log(this.userType)
                                        this.set_pages();
                                    }
                                });
                                setTimeout(() => {
                                    this.storage.get('role').then((role) => {
                                        if(typeof(role) !== 'undefined' && role){
                                            this.userLoggedRole = role;
                                        }
                                        if(this.user_logged_in) {
                                            this.set_pages();
                                        }
                                    });
                                    this.storage.get('displayName').then((displayName) => {
                                        if(typeof(displayName) !== 'undefined' && displayName){
                                            this.userLoggedDisplayName = displayName;
                                        }
                                    });
                                }, 1000);
                                this.storage.get('token_value').then((token_value) => {
                                    if(typeof(token_value) !== 'undefined' && token_value){
                                        this.userToken = token_value;
                                        this.set_pages();
                                    }
                                });
                                this.events.subscribe('current_page', (data) =>{
                                    this.current_page = data;
                                });
                            } 
                            else  if(this.constant.UserLoggedInData.loggedInUserType=='DrLogin') 
                            {
                                console.log(this.constant.UserLoggedInData);
                                
                                storage.get('token_value').then((val) => 
                                {
                                    console.log(val);
                                    if(val == '' || val == null || val == undefined)
                                    {
                                        this.nav.setRoot(SelectRegistrationTypePage);
                                        this.setPagesDealer('NotLoggedIn')
                                        
                                    }
                                    else
                                    {
                                        this.nav.setRoot(DealerHomePage);
                                        // this.nav.setRoot(TabsPage);
                                        
                                        this.setPagesDealer('LoggedIn')
                                        console.log(this.constant.UserLoggedInData);
                                        if(this.constant.UserLoggedInData.displayName)
                                        {
                                            this.userLoggedDisplayName = this.constant.UserLoggedInData.displayName
                                        }
                                    }
                                    
                                });
                                
                            }
                            
                        }
                    }, 500);
                    
                }
                platform.ready().then(() => {
                    
                    //connection check favoritet
                    if(this.loginType == 'CMS'){
                        this.network.onConnect().subscribe(() => {
                            console.log('network connected!');
                            this.service.connection = 'online';
                            this.constant.connectionChk = 'online'
                        });
                        this.network.onDisconnect().subscribe(() => {
                            console.log('network was disconnected :-(');
                            this.service.connection = 'offline';
                            this.constant.connectionChk = 'offline';
                        });
                        
                        
                    }
                    else
                    {
                        this.service.connection = 'online';
                        this.constant.connectionChk = 'online;'
                    }
                    //connection check end
                    statusBar.overlaysWebView(false);
                    setTimeout(() => {
                        splashScreen.hide();
                    }, 1000);
                    statusBar.backgroundColorByHexString('#55a9e4');
                    
                    
                    // commented
                    this.initPushNotification();
                    // this.fcmFunction();
                });
            }, 500);
            
            if(this.network.type=='none')
            {
                // alert('offline checked')
                this.service.connection = 'offline';
                storage.get('token').then((val) => {
                    console.log(val);
                    if(val == '' || val == null || val == undefined)
                    {
                        this.nav.setRoot(SelectRegistrationTypePage);
                    }
                    else
                    {
                        this.nav.setRoot(LoginPage,{'registerType':'Employee'});
                    }
                });
            }
            else
            {
                this.service.connection = 'online';
            }
            console.log(this.constant);
            
            platform.registerBackButtonAction(() => {
                const overlayView = this.app._appRoot._overlayPortal._views[0];
                if (overlayView && overlayView.dismiss) {
                    overlayView.dismiss();
                    console.log(overlayView)

                    return;
                }
                
                let nav = app.getActiveNav();
                console.log(nav);
                
                let activeView = nav.getActive().name;
                // console.log('current page '+this.navCtrl.getActive().name);
                
                
                console.log(activeView);
                console.log(nav.canGoBack());
                if (nav.canGoBack() == false) 
                {
                    console.log('ok');
                     let alert = this.alertCtrl.create({
                      title: 'App termination',
                      message: 'Are you sure you want Exit?',
                      buttons: [
                        {
                          text: 'Stay',
                          handler: () => {
                            console.log('Cancel clicked');
                            // this.d.('Action Cancelled!')
                          }
                        },
                        {
                          text: 'Exit',
                          handler: () => {
                            this.platform.exitApp();
                          }
                        }
                      ]
                    })
                
                    alert.present();
                    // nav.pop();
                } 
                // if(activeView == 'HomePage' || activeView == 'MobileLoginPage' || activeView == 'OtpPage' ||  activeView == 'DealerHomePage' ||  activeView == 'DashboardPage' ||  activeView == 'SelectRegistrationTypePage')
                // {
                //     console.log("first if");
                    
                //     if(this.constant.backButton==0) 
                //     {
                //         console.log('hello2');
                        
                //         this.constant.backButton=1;
                        
                //         let toast = this.toastCtrl.create(
                //             {
                //                 message: 'Press again to exit!',
                //                 duration: 2000
                //             });
                            
                //             toast.present();
                            
                //             setTimeout(() => 
                //             {
                //                 this.constant.backButton=0;
                //             },2500);
                //         } 
                //         else 
                //         {
                //             console.log('hello1');
                //             // this.platform.exitApp();
                //             navigator['app'].exitApp();
                //         }
                        
                //     } 
                    else if(activeView == 'DealerAddorderPage')
                    {
                        this.events.publish('AddOrderBackAction')
                    }
                    else if (nav.canGoBack()) 
                    {
                        console.log('ok');
                        nav.pop();
                    }
                    else if(activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' || activeView =='MainHomePage')
                    {
                        nav.parent.select(0);
                    }  
                    else 
                    {
                        // this.platform.exitApp();
                    }
                });
                //events favoritet
                this.events.subscribe('token_val_dr', (val) => {
                    if(val)
                    {
                        this.user_logged_in = true;
                        this.setPagesDealer('LoggedIn');
                    }
                });
                this.events.subscribe('user:login', () => {
                    this.favoritet_time();
                });
                this.events.subscribe('user:navigation_menu', () => {
                    this.open_nav_menu();
                });
                this.events.subscribe('side_menu:navigation_bar', () => {
                    this.set_pages();
                });
                this.events.subscribe('side_menu:navigation_barDealer', () => {
                    // this.setPagesDealer('LoggedIn');
                    this.open_nav_menu();
                });
                this.events.subscribe('token_val', (val) => {
                    if(val)
                    {
                        this.user_logged_in = true;
                        this.set_pages();
                    }
                });
                this.events.subscribe('userName', (val) => {
                    if(val)
                    {
                        this.userName = val;
                        this.set_pages();
                    }
                });
                this.events.subscribe('userLoggedRole', (val) => {
                    if(val)
                    {
                        this.userLoggedRole = val;
                        this.set_pages();
                    }
                });
                
                this.events.subscribe('userType', (val) => {
                    if(val)
                    {
                        this.userType = val;
                        this.set_pages();
                    }
                });
                this.events.subscribe('userLoggedDisplayName', (val) => {
                    if(val)
                    {
                        this.userLoggedDisplayName = val;
                        this.set_pages();
                    }
                });
                
                this.events.subscribe('userRoleId', (val) => {
                    if(val)
                    {
                        this.userRoleId = val;
                        this.set_pages();
                    }
                });
                
                this.events.subscribe('userToken', (val) => {
                    if(val)
                    {
                        this.userToken = val;
                        this.set_pages();
                    }
                });
                //events end
            }
            
            // fcmFunction(){
            //     console.warn("in FCM");
            
            //     this.fcm.onNotification().subscribe(data => {
            //         if(data.wasTapped){
            //           console.log("Received in background");
            //         } else {
            //           console.log("Received in foreground");
            //         };
            //       });
            // }
            getDecodedAccessToken(token: string): any {
                try{
                    return jwt_decode(token);
                }
                catch(Error){
                    return null;
                }
            }
            Requiredalert(text)
            {
                let alert = this.alertCtrl.create({
                    title:'Alert!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: ['OK']
                });
                alert.present();
            }
            goOnProductPage()
            {
                this.nav.push(CategoryPage,{'mode':'home'});
            }
            
            openPage(page: PageInterface)
            {
                let params = {};
                console.log(page);
                
                if (page.index) {
                    params = { tabIndex: page.index };
                }
                if(page.name == 'Dealer' )
                {
                    this.nav.push(page.component, {type:2});
                    
                }else if (page.name == 'Retailer')
                {
                    this.nav.push(page.component, {type:3});
                    
                }else if (page.name == 'Distributor')
                {
                    this.nav.push(page.component, {type:1});
                    
                } 
                else if(page.name=='My Channel Partner')
                {
                    this.myserv.addData({},'DealerData/getCreatedDr').then((resp)=>
                    {
                        console.log(resp);
                        this.nav.push(page.component, {'dr_id':resp[0],'type':'Dr','showRelatedTab': 'false'});
                    })
                }else if (page.name == "Check-In")
                {
                    
                    if(this.checkin_data != null){
                        console.log("if");  
                        console.log(this.checkin_data.length);  
                        this.nav.push(EndCheckinPage,{'data':this.checkin_data});         
                    }
                    else{
                        this.nav.push(CheckinListPage);    
                    }
                    
                    
                    
                    this.nav.push(page.component, {type:3});
                    
                }
                else if (this.nav.getActiveChildNavs().length && page.index != undefined)
                {
                    console.log(page.index);
                    this.nav.push(page.component);
                    
                    // this.nav.getActiveChildNavs()[0].select(page.index);
                } else {
                    console.log(this.nav);
                    console.log(page.index);
                    console.log(params);
                    console.log(page.component );
                    params['view_type'] = 'My';
                    this.nav.push(page.component, params);
                }
            }
            
            pending_checkin()
            {
                this.myserv.pending_data().then((result)=>{
                    console.log(result);
                    this.checkin_data = result['checkin_data'];
                    console.log(this.checkin_data); 
                    // this.navCtrl.push(EndCheckinPage,{'data':this.checkin_data});      
                })
            }
            
            openDealerPage(page: PageInterface)
            {
                let params = {};
                
                if (page.name == 'DealerOrderPage')
                {
                    console.log(this.constant.UserLoggedInData.type);
                    params = { 
                        type: 'Primary',
                        tabIndex: page.index
                    };
                }
                else
                {
                    if(page.index)
                    {
                        params = { tabIndex: page.index };
                    }    
                }
                
                if (this.nav.getActiveChildNavs().length && page.index != undefined) {
                    
                    console.log(page.index);
                    console.log(page.component);
                    this.nav.push(page.component);
                    
                    // this.nav.getActiveChildNavs()[0].select(page.index);
                } else {
                    console.log(page.index);
                    console.log(page.component );
                    if(page.name =='HomePage')
                    {
                        this.nav.setRoot(DealerHomePage)
                    }
                    else
                    {
                        console.log(page.component);
                        this.nav.push(page.component);
                    }
                }
            }
            
            goto_profile()
            {
                console.log('inside goto_profile');
                this.nav.push(DealerProfilePage);
            }
            
            open_profile(){
                console.log('inside open_profile');
                
                this.nav.push(ProfilePage);
            }
            
            
            initPushNotification()
            {
                console.log(" in initPushNotification");
                
                this.push.hasPermission()
                .then((res: any) => {
                    if (res.isEnabled)
                    {
                        console.log('We have permission to send push notifications');
                    }
                    else
                    {
                    }
                });
                
                const options: PushOptions = {
                    android: {
                        senderID: '643423474252',
                        icon: './assets/imgs/logo_small'
                    },
                    ios: {
                        alert: 'true',
                        badge: true,
                        sound: 'false'
                    },
                    windows: {}
                };
                
                const pushObject: PushObject = this.push.init(options);
                
                pushObject.on('registration').subscribe((registration) =>
                {
                    console.log("in notificaiton start");
                    
                    if(this.loginType == 'CMS')
                    {
                        console.log("in notificaiton if");
                        
                        this.service.post_rqst({'registration_id':registration.registrationId },'app_karigar/update_token_static')
                        .subscribe((r)=>
                        {
                            console.log(r);
                        });
                    }
                    else
                    {
                        console.log("in notificaiton else");
                        this.constant.deviceId = registration.registrationId
                        console.log(this.constant.deviceId);
                        
                        console.log(this.constant.UserLoggedInData.loggedInUserType)
                        this.myserv.addData({'registration_id':this.constant.deviceId },'DealerData/updateDeviceToken').then((r)=>
                        {
                            
                        });
                    }
                });
                
                pushObject.on('notification')
                .subscribe((notification) =>{
                    console.log('Received a notification', notification);
                    console.log(notification);
                    console.log(notification.title);
                    var tmpNotification = notification;
                    console.log(tmpNotification);
                    
                    
                    
                    //Notification Display Section
                    let confirmAlert = this.alertCtrl
                    .create({
                        title: 'New Notification',
                        message: JSON.stringify(notification.message),
                        buttons: 
                        [{
                            text: 'Ignore',
                            role: 'cancel'
                        },
                        {
                            text: 'View',
                            handler: () => {
                                //TODO: Your logic here
                                console.log("View Notification");
                                console.warn("open by notification");
                                
                                
                            }
                        }]
                    });
                });
                
                
                
                pushObject.on('error').subscribe((error) =>
                console.error('Error with Push plugin', error));
            }
            
            
            
            favoritet_time()
            {
                this.storage.get('role_id').then((roleId) =>
                {
                    console.log(roleId);
                    if(typeof(roleId) !== 'undefined' && roleId)
                    {
                        this.userRoleId = roleId;
                        if(this.userRoleId)
                        {
                            this.storage.get('token').then((token) => 
                            {
                                if(typeof(token) !== 'undefined' && token)
                                {
                                    this.user_logged_in = true;
                                    if(this.user_logged_in)
                                    {
                                        this.attendenceServe.last_attendence_data().then((result)=>
                                        {
                                            this.last_attendence_data = result['attendence_data'];
                                            this.setPagesDealer('LoggedIn');
                                            // this.check_user_token();
                                        })
                                    }
                                }
                            });
                        }
                    }
                });
            }
            
            open_nav_menu()
            {
                this.menu.open('first');
                this.menu.enable(true, 'first');
            }
            
            set_pages()
            {
                this.service.set(this.user_logged_in);
                if(this.user_logged_in)
                {
                    if(this.userName)
                    {
                        this.rootPage = DashboardPage;
                    }
                }
                
                // if(this.userRoleId && (this.userType == 'Market' || this.userType == 'MARKET' || this.userType == 'market') && this.userToken != undefined)
                {
                    this.pages=[
                        { title : 'Home', name: 'HomePage', component:DashboardPage, index: 0, icon: 'home', show: true },
                        // { title: 'Products', name: 'CategoryPage', component: CategoryPage , index: 9,icon: 'book', show: true},
                        // { title: 'Products', name: 'ProductsPage', component: ProductsPage , index: 9,icon: 'book', show: true},
                        // { title: 'New Arrivals', name: 'NewarrivalsPage', component: NewarrivalsPage,index: 11, icon: 'fiber_new', show: true},
                        // { title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'favorite', show: true },
                        // { title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true },
                        // { title: 'Check-In',       name: 'Check-In',                component: CheckinListPage ,        index: 9,  icon: 'room',                     show: true},
                        // { title: 'Attendance',     name: 'AttendencePage',          component: AttendencePage,          index: 11, icon: 'date_range',               show: true},
                        { title: 'Attendance',     name: 'AttendencePage',          component: AttendenceNewPage,          index: 11, icon: 'date_range',               show: true},
                        { title: 'Checkin',     name: 'CheckinNewPage',          component: CheckinNewPage,          index: 11, icon: 'date_range',               show: true},
                        // { title : 'Distributor',   name: 'Distributor',             component: MainDistributorListPage, index: 15, icon: 'group',                    show: true},
                        // { title : 'Dealer', name: 'Dealer',           component: MainDistributorListPage, index: 13, icon: 'person_pin',               show: true},
                        // { title : 'Retailer',        name: 'Retailer',                  component: MainDistributorListPage, index: 12, icon: 'person',                   show: true},
                        { title : 'Activity',      name: 'Lead',                    component: LmsActivityListPage,     index: 5,  icon: 'group_add',                show: true},
                        { title : 'Lead',          name: 'Lead',                    component: LmsLeadListPage,         index: 5,  icon: 'receipt_long',                show: true},
                        // { title : 'Quotation',     name: 'LmsQuotationListPage',    component: LmsQuotationListPage,    index: 30, icon: 'insert_drive_file',        show: true },
                        // { title : 'Requirement',  name: 'RequirementPage',           component: RequirementlistPage,    index: 27, icon: 'campaign',                 show: true },
                        
                        // { title : 'Travel Plan',   name: 'TravelListPage',          component: TravelListPage,          index: 23, icon: 'train',                    show: true },
                        { title : 'Travel Plan',   name: 'TravelListPage',          component: TravelListNewPage,          index: 23, icon: 'train',                    show: true },
                        { title : 'Follow Up',     name: 'FollowupListPage',        component: FollowupListPage,        index: 25, icon: 'contact_phone',            show: true },
                        // { title : 'Announcement',  name: 'AnnouncementListPage',    component: AnnouncementListPage,    index: 27, icon: 'campaign',                 show: true },
                        // { title : 'Pop & Gift',  name: 'AnnouncementListPage',    component: PopGiftListPage,         index: 27, icon: 'redeem',                 show: true },
                        // { title : 'Event',name: 'AnnouncementListPage',   component: ContractorMeetListPage, index: 27, icon: 'groups',                    show: true },
                        { title : 'Expense',       name: 'ExpenseListPage',         component: ExpenseListPage,         index: 26, icon: 'credit_card',              show: true },
                        // { title : 'Documents',         name: 'SupportPage',           component:SupportPage ,           index: 10, icon: 'credit_card',             show: true },
                        
                        { title : 'Leave',         name: 'LeaveListPage',           component:LeaveListPage ,           index: 10, icon: 'beach_access',             show: true },
                    ];
                }
                
                
            }
            
            hit(check){
                console.log(check);
                
            }
            
            setPagesDealer(chk)
            {
                console.log(chk);
                
                if (chk=='NotLoggedIn')
                {
                    this.pages=[
                        // { title : 'Home', name: 'Login', component:SelectRegistrationTypePage, index: 0, icon: 'home', show: true },
                        { title : 'About Us', name: 'About Us', component:AboutPage, index: 6, icon: 'info', show: true },
                        { title : 'Contact Us', name: 'Contact Us', component:ContactPage, index: 7, icon: 'contact_phone', show: true },
                        { title : 'Enquiry', name: 'Enquiry', component:EnquiryPage, index: 28, icon: 'tty', show: true },
                    ];
                    this.user_logged_in=false;
                }
                else if(chk=='LoggedIn')
                {
                    console.log(this.constant.UserLoggedInData.type);
                    
                    if(this.constant.UserLoggedInData.type == '1')
                    {
                        var name = 'Retailer List';
                        var title = 'Retailer List';
                        var show = true;
                    }
                    else if(this.constant.UserLoggedInData.type == '3')
                    {
                        var name = 'Distributor/Dealer List';
                        var title = 'Distributor/Dealer List';
                        var show = true;
                    }
                    else
                    {
                        var show = false;
                    }
                    if(this.constant.UserLoggedInData.type==1) //that means lohig user is distributor
                    {
                        this.pages=[
                            { title : 'Home', name: 'HomePage', component:DashboardPage, index: 0, icon: 'home', show: true },
                            // { title: 'Products', name: 'CategoryPage', component: CategoryPage , index: 9,icon: 'book', show: true},
                            { title: 'Products', name: 'ProductsPage', component: ProductsPage , index: 9,icon: 'book', show: true},
                            // { title: 'New Arrivals', name: 'NewarrivalsPage', component: NewarrivalsPage,index: 11, icon: 'fiber_new', show: true},
                            // { title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'favorite', show: true },
                            // { title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true },
                            // { title: 'Check-In',       name: 'Check-In',                component: CheckinListPage ,        index: 9,  icon: 'room',                     show: true},
                            // { title: 'Attendance',     name: 'AttendencePage',          component: AttendencePage,          index: 11, icon: 'date_range',               show: true},
                            { title: 'Attendance',     name: 'AttendencePage',          component: AttendenceNewPage,          index: 11, icon: 'date_range',               show: true},
                            // { title : 'Distributor/Dealer',   name: 'Distributor',             component: MainDistributorListPage, index: 15, icon: 'group',                    show: true},
                            // { title : 'Direct Dealer', name: 'Direct Dealer',           component: MainDistributorListPage, index: 13, icon: 'person_pin',               show: true},
                            { title : 'Retailer',        name: 'Dealer',                  component: MainDistributorListPage, index: 12, icon: 'person',                   show: true},
                            { title : 'Activity',      name: 'Lead',                    component: LmsActivityListPage,     index: 5,  icon: 'group_add',                show: true},
                            { title : 'Lead',          name: 'Lead',                    component: LmsLeadListPage,         index: 5,  icon: 'receipt_long',                show: true},
                            { title : 'Quotation',     name: 'LmsQuotationListPage',    component: LmsQuotationListPage,    index: 30, icon: 'insert_drive_file',        show: true },
                            { title : 'Travel Plan',   name: 'TravelListPage',          component: TravelListPage,          index: 23, icon: 'train',                    show: true },
                            { title : 'Follow Up',     name: 'FollowupListPage',        component: FollowupListPage,        index: 25, icon: 'contact_phone',            show: true },
                            // { title : 'Announcement',  name: 'AnnouncementListPage',    component: AnnouncementListPage,    index: 27, icon: 'campaign',                 show: true },
                            { title : 'Pop & Gift',  name: 'AnnouncementListPage',    component: PopGiftListPage,         index: 27, icon: 'redeem',                 show: true },
                            { title : 'Contractor Meet',name: 'AnnouncementListPage',   component: ContractorMeetListPage, index: 27, icon: 'groups',                    show: true },
                            { title : 'Visiting Card', name: 'VisitingCardListPage',    component: VisitingCardListPage,    index: 27, icon: 'view_day',                 show: true },
                            { title : 'Expense',       name: 'ExpenseListPage',         component: ExpenseListPage,         index: 26, icon: 'credit_card',              show: true },
                            { title : 'Leave',         name: 'LeaveListPage',           component:LeaveListPage ,           index: 10, icon: 'beach_access',             show: true },
                            
                            
                        ];
                    } 
                    
                    
                    this.user_logged_in=true;
                }
                // alert(this.pages.length)
            }
            
            db_app_version:any='';
            app_version:any='';
            check_version()
            {
                this.service.post_rqst("",'login/app_version')
                .subscribe(resp=>{
                    console.log(resp);
                    this.db_app_version = resp['app_version'];
            
                    this.appVersion.getVersionNumber()
                    .then(resp=>{
                        console.log(resp);
                        this.app_version = resp;
                        if(this.app_version != this.db_app_version)
                        {
                            let updateAlert = this.alertCtrl.create({
                                title: 'Update Available',
                                enableBackdropDismiss: false,
                                message: 'A newer version of this app is available for download. Please update it from PlayStore !',
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        handler: () => {
                                            setTimeout(() =>
                                            {
                                            }, 500);
                                            
                                            this.platform.exitApp();
                                        }
                                    },
                                    {
                                        text: 'Update Now',
                                        handler: () => {
                                            setTimeout(() =>
                                            {
                                            }, 500);
                                            
                                            window.open('market://details?id=com.kei_india_abacusdesk.app&hl=en','_system','location=yes');
                                            this.platform.exitApp();
                                        }
                                    }]
                                });
                                updateAlert.present();
                            }
                        console.log("version");
            
                    });
                });
            }
            logout()
            {
                let alert = this.alertCtrl.create({
                    title: 'Logout!',
                    message: 'Are you sure you want Logout?',
                    buttons: [
                        {
                            text: 'No',
                            handler: () => {
                                console.log('Cancel clicked');
                                // this.d.('Action Cancelled!')
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                //   this.itemsArr.splice(i,1);
                                this.storage.set('token', '');
                                this.storage.set('role', '');
                                this.storage.set('displayName', '');
                                this.storage.set('role_id','');
                                this.storage.set('name','');
                                this.storage.set('type','');
                                this.storage.set('token_value','');
                                this.storage.set('userId','');
                                this.storage.set('token_info','');
                                // this.storage.set('token_value','');
                                // this.storage.set('loggedInUserType','');
                                // this.storage.set('loginData','');
                                this.user_logged_in = false;
                                this.userLoggedRole = '';
                                this.userLoggedDisplayName = '';
                                this.userRoleId = '';
                                this.userType = '';
                                this.userName = '';
                                this.constant.UserLoggedInData ={};
                                this.constant.UserLoggedInData.userLoggedInChk=false;
                                console.log(this.constant.UserLoggedInData);
                                
                                this.setPagesDealer('NotLoggedIn')
                                // this.set_pages();
                                // this.nav.setRoot(SelectRegistrationTypePage); 
                                // this.nav.setRoot(CatalogueHomePage);
                                this.nav.setRoot(LoginPage,{'registerType':'Employee'});
                                // this.nav.setRoot(CatalogueHomePage);
                                
                                
                            }
                        }
                    ]
                })
                
                alert.present();
                
            }
            
            offlineAlert()
            {
                var text = 'Offline ! Please Connect To An Active Internet Connection'
                let alert = this.alertCtrl.create({
                    title:'Alert!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: ['OK']
                });
                alert.present();
            }
            
            login()
            {
                // this.nav.setRoot(SelectRegistrationTypePage);
                this.nav.push(LoginPage,{'registerType':'Employee'});
                
            }
            
        }