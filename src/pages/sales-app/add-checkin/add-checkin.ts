import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, Navbar, Platform, AlertController  } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';

import { AddDealerPage } from '../add-dealer/add-dealer';
import { CheckinListPage } from '../checkin-list/checkin-list';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { EndCheckinPage } from '../end-checkin/end-checkin';




@IonicPage()
@Component({
  selector: 'page-add-checkin',
  templateUrl: 'add-checkin.html',
})
export class AddCheckinPage {
  
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  
  @ViewChild(Navbar) navBar: Navbar;
  
  userPincode:any
  userPincodeCheck = true ; 
  data:any = {};
  distribution_data:any=[];
  addNewDealer:any=false;
  distributorList: any = [];
  checkin_data:any = [];
  filter:any=[]
  filter_category_active:any = false;
  filter_active:any = false;
  AddCheckinForm:FormGroup;
  load_data:any = "0";
  limit=0;
  flag:any='';
  customer_type:any = {};
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController, 
    private alertCtrl: AlertController,
    public service: MyserviceProvider,
    public toastCtrl: ToastController, 
    public formBuilder: FormBuilder,
    public platform: Platform, 
    public locationAccuracy: LocationAccuracy,
    
    // private  checkinListPage:CheckinListPage,
    public geolocation: Geolocation,public storage:Storage) {
      
      this.getFilterData()
      this.checkUserLocation()
      this.data = {};
      
      if(this.navParams.get('data'))
      {
        this.distribution_data = this.navParams.get('data');
        console.log(this.distribution_data);
        
        this.data.network = this.distribution_data.type;
        console.log(this.data.network);
        
        this.data.dr_id = this.distribution_data.id;
        console.log(this.data.dr_id);
        
        this.data.type_name = {'company_name':this.distribution_data.company_name};
        console.log(this.data.type_name);
        
        this.type_name.company_name = this.distribution_data.company_name;
        this.type_name.name = this.distribution_data.name;
        this.type_name.mobile = this.distribution_data.mobile;
      }
      
      this.AddCheckinForm = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        mobile: ['',Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])]
      })
      
    }
    userType:any;
    ionViewDidLoad() {
      this.getNetworkType()
      console.log('ionViewDidLoad AddCheckinPage');
      
      // this.navBar.backButtonClick = (e:UIEvent)=>{
      //   // todo something
      //   this.navCtrl.push(CheckinListPage);
      // }
      
      this.storage.get('user_type').then((userType) => {
        console.log(userType);
        if(userType=='OFFICE')
        {
          this.data.network=3;
          this.get_network_list(this.data.network,'')
          this.userType  = userType
        }
        
      });
      
      
    }
    
    
    loading:any;
    networkType:any=[]
    otherType:any=[]

    // othertype=[{module_name:'Other',type:'11'}]
    getNetworkType(){
      this.service.addData3({'type':'checkin'}, "Dashboard/allNetworkModule").then((result => {
        console.log(result);
        this.networkType = result['modules'];
          // this.networkType.push(this.othertype[0])
          console.log(this.networkType);
          // console.log(this.othertype);


        
      }))
    }
    getotherType(data){
      this.service.addData3({'type':data}, "Dashboard/others_type").then((result => {
        console.log(result);
        this.otherType = result['modules'];
          // this.networkType.push(this.othertype[0])
          console.log(this.networkType);
          this.open();

          // console.log(this.othertype);


        
      }))
    }
    category_list:any=[]
    getFilterData()
    {
      
      
      this.category_list = [{name:'Scheduled'},{name:'Unscheduled'}];
      
      this.category_list.map((x:any)=>{
        x.checked = false;
      });
    }
    typeboolean:any
    test(data){
      console.log(data)

      if(data!='3'&&data!='11'){
        this.string=undefined
        this.get_network_list(data,'')

        this.typeboolean =false
      
      }
      if(data!='3'&&data=='11'){
        this.string=undefined
        this.getotherType(data)

        this.typeboolean =false
      
      }
      console.log(this.typeboolean)
      
      if(data=='3' &&data!='11'){
        
        
        console.log(this.typeboolean)
        
        this.typeboolean =true
        // this.get_network_list(data)
        
        console.log(data)
        console.log(this.typeboolean)
        
      }
    }
    
    
    
    
  
    presentToast() {
      let toast = this.toastCtrl.create({
        message: 'Visit Started Successfully',
        duration: 3000,
        position: 'bottom'
      });
      
      
      
      toast.present();
    }
    
    
    distributor_network_list:any = [];
    string:any={}
    search:any={}

    test66(event,network){
console.log(event.text);
      this.search=event.text
console.log(this.search);
this.get_network_list(network,this.search)

    }
    get_network_list(network_type,search)
    {
      
      
      this.data.type_name = {};
      // this.load = "0";
      
      console.log(network_type);
      if(network_type != 'Other')
      {
        // this.service.show_loading()
        this.service.addData({'search':search,'filter':this.string, 'type':network_type},'Distributor/get_type_list').then((result)=>{
          console.log(result);
          this.distributor_network_list = result;
          for(let i = 0 ;i<this.distributor_network_list.length;i++){
            if(this.distributor_network_list[i].name!=""||this.distributor_network_list[i].mobile!=""){
              this.distributor_network_list[i].company_name=this.distributor_network_list[i].company_name+' '+'('+this.distributor_network_list[i].name+'  '+this.distributor_network_list[i].mobile+')'
            }
            if(this.distributor_network_list[i].name==""&&this.distributor_network_list[i].mobile==""){
              this.distributor_network_list[i].company_name=this.distributor_network_list[i].company_name
            }
          }
          this.filter=[]
      // this.load = "1";

          // this.service.dismiss();
          this.open();
        });
      }
      
      
      
    }
    loadData(infiniteScroll,network_type)
    {
      console.log('loading');
      
      this.service.addData({'limit':this.distributor_network_list.length,'filter':this.string, 'type':network_type},'Distributor/get_type_list').then( result=>
        {
          console.log(result);
          if(result=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.distributor_network_list=this.distributor_network_list.concat(result);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
    }
    open()
    {
      this.selectComponent.open();
    }
    
    
    
    
    
    MobileNumber(event: any) 
    {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) 
      {event.preventDefault(); }
    }
    
    
    load:any = "0";
    type_name:any={};
    
    other_name:any = '';
    dr_name:any
    other(name,network,type_name)
    {
      this.addNewDealer=false
      console.log(type_name);
      console.log(name);
      console.log(network);
      
      
      this.type_name = type_name;
      this.load = "1";
      this.dr_name=name
      console.log(name);
      console.log(network);
      if(name == 'Add New Channel Partner')
      {
        this.navCtrl.push(AddDealerPage,{'type': network});
      }
      
      if(name == 'Add New Direct Dealer')
      {
        this.navCtrl.push(AddDealerPage,{'type': network});
      }
      
      if(name == 'Prospective Retailer')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Distributor')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Dealer')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Project')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Contractor')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Architect')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Constructor')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Interior Designer')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Electrician')
      {
        this.addNewDealer = true;
      }
      if(name == 'Prospective Direct Customer')
      {
        this.addNewDealer = true;
      }
    }
    
    check_num(mobile)
    {
      this.checkExist=false
      console.log(mobile);
      
      if(mobile && mobile.length == 10)
      {
        console.log(mobile.length);
        
        console.log(mobile);
        this.check_mobile_existence(mobile)
      }
    }
    checkExist=false
    error:any
    check_mobile_existence(mobile)
    {   
      // this.data.mobile=mobile
      
      this.service.show_loading()
      this.service.addData({'mobile':mobile},'Enquiry/check_mobile_existenceLead').then((result)=>{
        this.error=result['data']
        console.log(this.error);
        
        this.service.dismiss()
        
        if(result['executive']!=0)
        {
          let alert=this.alertCtrl.create({
            title:'Exists !!',
            subTitle: 'Mobile No Is Already Registered With An Executive !!',
            cssClass:'action-close',
            
            buttons: [
              {
                text:'Okay',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                }
              }]
            });
            alert.present();
            this.data.mobile='';
            return;
          }
          if(result['check_mobile']==1)
          {
            this.checkExist=true
            
            this.service.presentToast('Dealer With Same Mobile No. Already Exists')
            
          }
          else
          {
            this.data.DealerExist=false;
            
            this.checkExist=false
          }
          
        },err=>
        {
          this.service.dismiss()
          
        })
        
        
        
      }
      
      startVisit()
      {
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
              alert.present();
              console.log(result.mocks);
            }
            else
            {
              console.log(this.distribution_data);
              
              this.service.show_loading()
              
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                  
                  console.log('Request successful');
                  
                  let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                  this.geolocation.getCurrentPosition(options).then((resp) => {
                    
                    
                    var lat = resp.coords.latitude
                    var lng = resp.coords.longitude
                    
                    if(this.distribution_data == '')
                    {
                      console.log(this.data);
                      this.data.dr_id = this.data.type_name.id;
                      this.data.dr_name = this.data.type_name.name;
                      this.data.lat = lat;
                      this.data.lng = lng;
                      
                      this.service.addData({'data':this.data},'Checkin/start_visit_new').then((result)=>{
                        console.log(result);
                        console.warn("static result console");
                        
                        if(result == 'success')
                        {
                          this.navCtrl.remove(2,1,{animate:false});
                          this.navCtrl.pop({animate:false});
                          this.pending_checkin();
                          if(this.checkin_data != null){
                            this.navCtrl.push(EndCheckinPage,{'data':this.checkin_data});  
                          }
                          this.service.dismiss();
                          this.presentToast();
                          // this.checkinListPage.checkin_detail('71');
                          
                          
                          
                          // this.navCtrl.push(CheckinListPage,{'via':'checkinIsCreated'});
                          
                        }
                        else
                        {
                          this.service.dismiss();
                        }
                        
                        // loading.dismiss();
                        
                      });
                      // loading.dismiss();
                    }
                    
                    if(this.distribution_data != '')
                    {
                      this.service.addData({'data':this.data},'Checkin/start_visit_new').then((result)=>{
                        console.log(result);
                        if(result == 'success')
                        {
                          
                          this.navCtrl.pop({animate:false});
                          this.service.dismiss();
                          this.presentToast();
                          this.navCtrl.push(CheckinListPage);
                          
                        }
                        else
                        {
                          this.service.dismiss();
                        }
                      });
                      
                    }
                    
                    
                  }).catch((error) => {
                    console.log('Error getting location', error);
                    // this.saveOrderHandler({});
                    console.log('Error requesting location permissions', error);
                    this.service.dismiss();          
                    let toast = this.toastCtrl.create({
                      message: 'Allow Location Permissions',
                      duration: 3000,
                      position: 'bottom'
                    });
                    
                    
                    
                    toast.present();
                  });
                },
                error => {
                  console.log('Error requesting location permissions', error);
                  this.service.dismiss();          
                  let toast = this.toastCtrl.create({
                    message: 'Allow Location Permissions',
                    duration: 3000,
                    position: 'bottom'
                  });
                  
                  
                  
                  toast.present();
                });
                
                
                
              }
              
              
              
            }, (error) => console.log(error));
            
          });
          
          
        }
        startDealerVisit()
        {
          
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
                alert.present();
                console.log(result.mocks);
              }
              else
              {
                if(this.checkExist==true)
                {
                  this.service.presentToast('Mobile No. Already Exists !!');
                  return
                }
                this.service.show_loading()          
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                  () => {
                    let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                    this.geolocation.getCurrentPosition(options).then((resp) => {
                      
                      this.data.lat = resp.coords.latitude
                      this.data.lng = resp.coords.longitude
                      
                      this.data.type = 'Retailer';
                      console.log(this.data);
                      
                      this.service.addData({'data':this.data},'Checkin/start_dealer_visit').then((result)=>{
                        console.log(result);
                        if(result == 'success')
                        {
                          
                          this.navCtrl.remove(2,1,{animate:false});
                          this.navCtrl.pop({animate:false});
                          this.pending_checkin();
                          if(this.checkin_data != null){
                            this.navCtrl.push(EndCheckinPage,{'data':this.checkin_data});  
                            // this.navCtrl.pop();
                          }
                          this.service.dismiss();
                          this.presentToast();
                        }
                      },err=>
                      {
                        this.service.dismiss();
                      });
                      
                    }).catch((error) => {
                      console.log('Error getting location', error);
                      console.log('Error requesting location permissions', error);
                      this.service.dismiss();          
                      let toast = this.toastCtrl.create({
                        message: 'Allow Location Permissions',
                        duration: 3000,
                        position: 'bottom'
                      });
                      
                      
                      
                      toast.present();
                    });
                  },
                  error => {
                    console.log('Error requesting location permissions', error);
                    this.service.dismiss();          
                    let toast = this.toastCtrl.create({
                      message: 'Allow Location Permissions',
                      duration: 3000,
                      position: 'bottom'
                    });
                    
                    
                    
                    toast.present();
                  });
                }
                
                
                
              }, (error) => console.log(error));
              
            });
            
          }
          startOtherVisit()
          {
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
                  alert.present();
                  console.log(result.mocks);
                }
                else
                {
                  this.service.show_loading()          
                  this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => {
                      let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                      this.geolocation.getCurrentPosition(options).then((resp) => {
                        
                        this.data.lat = resp.coords.latitude
                        this.data.lng = resp.coords.longitude
                        
                        console.log(this.data);
                        
                        this.service.addData({'data':this.data},'Checkin/start_other_visit').then((result)=>{
                          console.log(result);
                          if(result == 'success')
                          {
                            
                            this.navCtrl.remove(2,1,{animate:false});
                            this.navCtrl.pop({animate:false});
                            this.service.dismiss();
                            this.pending_checkin();
                            if(this.checkin_data != null){
                              this.navCtrl.push(EndCheckinPage,{'data':this.checkin_data});  
                              // this.navCtrl.pop();
                            }
                            this.presentToast();
                          }
                        },err=>
                        {
                          this.service.dismiss();
                        });
                        
                      }).catch((error) => {
                        console.log('Error getting location', error);
                        // this.saveOrderHandler({});
                        console.log('Error requesting location permissions', error);
                        this.service.dismiss();          
                        let toast = this.toastCtrl.create({
                          message: 'Allow Location Permissions',
                          duration: 3000,
                          position: 'bottom'
                        });
                        
                        
                        
                        toast.present();
                      });
                    },
                    error => {
                      console.log('Error requesting location permissions', error);
                      this.service.dismiss();          
                      let toast = this.toastCtrl.create({
                        message: 'Allow Location Permissions',
                        duration: 3000,
                        position: 'bottom'
                      });
                      
                      
                      
                      toast.present();
                    });
                  }
                  
                  
                  
                }, (error) => console.log(error));
                
              });
              
            }
            userCurrentLocation:any
            checkUserLocation()
            {
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
                    alert.present();
                    console.log(result.mocks);
                  }
                  else
                  {
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                      () => {
                        let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                        this.geolocation.getCurrentPosition(options).then((resp) => {
                          
                          this.data.lat = resp.coords.latitude
                          this.data.lng = resp.coords.longitude
                          
                          console.log(this.data);
                          
                          this.service.addData({'data':this.data},'Checkin/checkPincode').then((result)=>{
                            console.log(result);
                            this.userPincode = result[0]
                            this.userCurrentLocation = result[1]
                            console.log('check console here');
                            
                            console.log(this.userPincode);
                            console.log(this.userCurrentLocation);
                            
                          },err=>
                          {
                            this.service.dismiss();
                          });
                          
                        }).catch((error) => {
                          console.log('Error getting location', error);
                          console.log('Error requesting location permissions', error);
                          this.service.dismiss();          
                          let toast = this.toastCtrl.create({
                            message: 'Allow Location Permissions',
                            duration: 3000,
                            position: 'bottom'
                          });
                          
                          
                          
                          toast.present();
                        });
                      },
                      error => {
                        console.log('Error requesting location permissions', error);
                        this.service.dismiss();          
                        let toast = this.toastCtrl.create({
                          message: 'Allow Location Permissions',
                          duration: 3000,
                          position: 'bottom'
                        });
                        
                        
                        
                        toast.present();
                      });
                    }
                    
                    
                    
                  }, (error) => console.log(error));
                  
                });
                
              }
              
              pending_checkin()
              {
                this.service.pending_data().then((result)=>{
                  console.log(result);
                  this.checkin_data = result['checkin_data'];
                  console.log(this.checkin_data); 
                  // this.navCtrl.push(EndCheckinPage,{'data':this.checkin_data});      
                })
              }
              
              
            }
            