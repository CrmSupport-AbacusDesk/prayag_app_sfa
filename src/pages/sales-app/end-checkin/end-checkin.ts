import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Navbar,ActionSheetController,PopoverController, ToastController, LoadingController, AlertController,Platform } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { Geolocation } from '@ionic-native/geolocation';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AddOrderPage } from '../../add-order/add-order';
import { Storage } from '@ionic/storage';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { MediaCapture, CaptureVideoOptions, MediaFile } from '@ionic-native/media-capture';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EnquiryserviceProvider } from '../../../providers/enquiryservice/enquiryservice';
import { ExpensePopoverPage } from '../../expense-popover/expense-popover';
import { OrderListPage } from '../../order-list/order-list';
import { FollowupAddPage } from '../../followup-add/followup-add';
import { VisitingCardAddPage } from '../../visiting-card/visiting-card-add/visiting-card-add';
import { PopGiftAddPage } from '../../sales-app/pop-gift/pop-gift-add/pop-gift-add';
import { LmsQuotationAddPage } from '../../sales-app/new-lead/lms-lead-quotation/lms-quotation-add/lms-quotation-add';
import { ContractorMeetAddPage } from '../../Contractor-Meet/contractor-meet-add/contractor-meet-add';
import { AddMultipleContactPage } from '../../add-multiple-contact/add-multiple-contact';
import { CheckinNewPage } from '../../checkin-new/checkin-new';
import { ExecutiveOrderDetailPage } from '../../executive-order-detail/executive-order-detail';
import { DashboardPage } from '../../dashboard/dashboard';










@IonicPage()
@Component({
  selector: 'page-end-checkin',
  templateUrl: 'end-checkin.html',
})
export class EndCheckinPage {
  @ViewChild(Navbar) navBar: Navbar;

  state_list:any=[];city_list:any=[];
  city_name:any=[];
  data:any={};
  checkin_data:any = [];
  checkin:any = {};
  checkinForm: FormGroup;
  checkinFormWithNewDealer: FormGroup;
  order_token :any = [];
  brand_assign:any = [];
  salesUserId:any;
  showEditRetailer:boolean=true;
  today_date = new Date().toISOString().slice(0,10);
  pending_checkin_id:any;
  new_retailer_id:any;
  area_list:any=[];
  form1:any={};
  update_retailer_flag:any='0';
  check_gst:any = '';
  gst_details:any = [];
  check_mobile:any = '';
  district_list:any = [];
  image:any='';
  image_data:any=[];
  videoId: any;
  flag_upload = true;
  flag_play = true;
  for_order:any = [];
  functionCalled:any=0
  
  
  constructor(public navCtrl: NavController,private camera: Camera , public popoverCtrl: PopoverController, public platform: Platform,public androidPermissions: AndroidPermissions, public navParams: NavParams,public actionSheetController: ActionSheetController,private mediaCapture: MediaCapture, public service: MyserviceProvider,public geolocation: Geolocation, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder,
    public locationAccuracy: LocationAccuracy , 
    public services:EnquiryserviceProvider,
    public alertCtrl: AlertController,public storage: Storage) {

     
      this.checkin_data = this.navParams.get('data');
      console.log(this.checkin_data);
      this.getState();
      this.checkinForm = this.formBuilder.group({
        description: ['',Validators.compose([Validators.required])],
        
      })
      this.checkin.dr_name = this.checkin_data.dr_name;
      this.checkin.name = this.checkin_data.name;
      this.checkin.dr_mobile = this.checkin_data.dr_mobile_no;
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad EndCheckinPage');
      
    }
    
    ionViewWillEnter(){
      this.pending_checkin();
      this.salesUserId=this.checkin_data.created_by;
      console.log(this.salesUserId);
      this.get_distributor()
    }
    
    present_upload_document_alert(){
      let alert=this.alertCtrl.create({
        title:'Document',
        subTitle: 'Upload Document is Mandatory',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }    
  
  
  
  end_visit(checkin_id, description)
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
          console.log("Checkin/visit_end");
    
            
            if(!description)
            {
              this.service.presentToast('Please Add Description !!')
              return;
            }
            this.service.show_loading();
            
            this.functionCalled = 1
            
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => {
                
                let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                this.geolocation.getCurrentPosition(options).then((resp) => {
                  
                  var lat = resp.coords.latitude
                  var lng = resp.coords.longitude
                  
                  this.service.addData({'lat':lat, 'lng':lng, 'checkin_id': checkin_id, 'checkin': description,imgarr:this.image_data,'dr_data':this.checkinForm.value},'Checkin/visit_end').then((result) => {
                    
                    this.for_order = result['for_order'];
                    this.brand_assign = result['brand_assign'];
                    
                    this.service.dismiss();
                    
                    if(result['msg'] == 'success')
                    {
                      
                      this.service.dismiss();
                      
                      this.service.presentToast('Visit Ended Successfully !!');
                      if(this.checkin_data.other_name == '')
                      {
                        // this.presentAlert();
                        // this.navCtrl.pop();
            this.navCtrl.push(CheckinNewPage);
                        
                        
                      }
                      else
                      {
                        this.navCtrl.pop();
                      }
                    }
                    
                    
                    
                    
                  })
                  
                }).catch((error) => {
                  console.log('Error getting location', error);
                  
                  this.service.dismiss();
                  this.service.presentToast('Error getting location !!')
                });
              },
              error => {
                console.log('Error requesting location permissions', error);
                this.service.dismiss();
                this.service.presentToast('Allow Location Permissions !!')
              });
              
            
            // else{
              
            //   this.present_upload_document_alert();
              
            // }
        }
      
  
  
      }, (error) => console.log(error));
      
    });
   
      
    }
    
    
    saveNewRetailer(){
      console.log("saveNewRetailer method calls");
      console.log("Lead/save_lead");
      this.checkin.type_id=3
      console.log(this.checkin);
      console.log(this.pending_checkin_id);
      console.log(this.new_retailer_id);
      if(!this.checkin.assign_dr_id && this.checkin_data.dr_type == '3')
      {
          let toast = this.toastCtrl.create({
              message: 'Please Select Distributor!',
              duration: 3000
          });
          toast.present();
          return;
      }
      
      // type_id = type_id;
      this.service.show_loading()
      this.service.addData({"data":this.checkin,"checkin_id":this.pending_checkin_id,"dr_id":this.new_retailer_id},"Lead/save_lead")
      .then(resp=>{
        this.service.dismiss()
        console.log(resp);
        
        if(resp['msg'] == 'success')
        {
          this.service.presentToast("Success!");
          this.showEditRetailer = false;
          this.pending_checkin();
          // this.navCtrl.pop();
        }
      },
      err=>{
        this.service.dismiss()
        this.service.errToasr()
        
      });
    }
    
    
    end_visitwithNewDealer(checkin_id, description)
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
            console.log("Checkin/visit_endWithNewDealer");
      
      
        
        console.log(this.checkin);
        // this.service.dismiss();
        
        // if(!description)
        // {
        //   let toast = this.toastCtrl.create({
        //     message: 'Please Add Description',
        //     duration: 3000,
        //     position: 'bottom'
        //   });
          
        //   toast.present();
        //   return;
        // }
        
        
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            
            let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
            this.geolocation.getCurrentPosition(options).then((resp) => {
              console.log("hloooo");
              
              var lat = resp.coords.latitude
              var lng = resp.coords.longitude
              
              this.service.addData({'lat':lat, 'lng':lng, 'checkin_id': checkin_id, 'checkin': description,imgarr:this.image_data,'dr_data':this.checkin},'Checkin/visit_endWithNewDealer').then((result) => {
                
                this.brand_assign = result['brand_assign'];
                
                if(result['msg'] == 'success')
                {
                  
                  
                  
                  
                  this.service.presentToast('Visit Ended Successfully !!');
            this.navCtrl.push(CheckinNewPage);
                  
                  // this.navCtrl.pop()
                  
                  // this.presentAlert();
                }
                
                
                
                
              })
              
            }).catch((error) => {
              this.service.dismiss();
              this.service.presentToast('Error getting location !!');
            });
          },
          error => {
            this.service.dismiss();          
            this.service.presentToast('Error requesting location permissions')
          });
          
        
        // else{
          
        //   this.present_upload_document_alert();
          
        // }
          }
        
    
    
        }, (error) => console.log(error));
        
      });
     
        
      }   
      presentAlert() {
        let alert = this.alertCtrl.create({
          title: 'Create Order',
          message: 'Do you want to create order for this checkin?',
          cssClass: 'alert-modal',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                console.log('Yes clicked');
                console.log(this.for_order);
                this.navCtrl.pop();
                this.service.dismiss();
                
                this.navCtrl.push(AddOrderPage,{'for_order':this.for_order,'brand_assign':this.brand_assign});
                
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                console.log(this.for_order)
                this.navCtrl.pop();
                
                
              }
            }
          ]
        });
        alert.present();
      }
      //cpture image
      onGetCaptureVideoPermissionHandler() {
        
        console.log('start');
        
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
          result => {
            if (result.hasPermission) {
              
              console.log('hello111');
              this.service.dismiss();
              
              this.capturevideo();
              
            } else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
                if (result.hasPermission) {
                  
                  console.log('hello222');
                  this.service.dismiss();
                  
                  this.capturevideo();
                  
                }
              });
            }
          },
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          );
          
          
          
          
        }
        getImage() 
        {
          const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
          }
          console.log(options);
          this.camera.getPicture(options).then((imageData) => {
            this.image= 'data:image/jpeg;base64,' + imageData;
            
            console.log(this.image);
            if(this.image)
            {
              this.fileChange(this.image);
            }
          }, (err) => {
          });
        }
        
        capturevideo()
        {
          let options: CaptureVideoOptions = { limit: 1 };
          this.mediaCapture.captureVideo(options)
          .then((videodata: MediaFile[]) => {
            console.log(videodata);
            this.service.dismiss();
            
            var i, path, len,name;
            for (i = 0, len = videodata.length; i < len; i += 1) 
            {
              path = videodata[i].fullPath;
              name = videodata[i].name;
            }
            this.videoId = path;
            this.flag_play = false;
            this.flag_upload = false;
            console.log(videodata);
            
            
          });
        }
        
        
        takePhoto()
        {
          console.log("i am in camera function");
          console.log(this.camera.DestinationType.DATA_URL);
          
          const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400,
            cameraDirection:1,
            correctOrientation : true,
            
          }
          // this.service.dismiss();
          
          console.log(options);
          this.camera.getPicture(options).then((imageData) => {
            this.image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.image);
            if(this.image)
            {
              this.fileChange(this.image);
            }
          }, (err) => {
          });
        }
        captureImageVideo()
        {
          let actionsheet = this.actionSheetController.create({
            title:"Upload Image",
            cssClass: 'cs-actionsheet',
            
            buttons:[{
              cssClass: 'sheet-m',
              text: 'Camera',
              icon:'camera',
              handler: () => {
                console.log("Camera Clicked");
                
                this.takePhoto();
              }
            },
            {
              cssClass: 'sheet-m1',
              text: 'Gallery',
              icon:'image',
              handler: () => {
                console.log("Gallery Clicked");         
                this.getImage();
              }
            },
            {
              cssClass: 'cs-cancel',
              text: 'Cancel',
              role: 'cancel',
              icon:'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionsheet.present();
      }
      
      
      fileChange(img)
      {
        // this.image_data=[];
        this.image_data.push(img);
        console.log(this.image_data);
        this.image = '';
      }
      
      captureMedia()
      {
        if(this.videoId)
        {
          this.captureImageVideo();
        }
        else
        {
          this.captureImageVideo();
        }
        
      }
      
      remove_image(i:any)
      {
        this.image_data.splice(i,1);
      }
      getState() {
        
        
        this.services.getState().then((response:any)=>{
          console.log(response);
          this.state_list = response;
          
        });
      }
      
      
      getDistrict(state) {
        console.log(state);
        
       
        
        this.services.getCity(state).then((response:any)=>{
          console.log(response);
          this.district_list = response;
          
        });
      }
      
      
      check_mobile_existence(mobile)
      {
        
        this.service.addData({'mobile':mobile},'Enquiry/check_mobile_existence').then((result)=>{
          console.log(result);
          
          this.check_mobile = result['check_mobile'];
          console.log(this.check_mobile);
          
          console.log(mobile.length);
          
        })
        
      }
      
      get_pincode_area_name(pincode)
      {
        this.services.get_pincode_city_name(pincode).then((response:any)=>{
          console.log(response);
          if(response=='' || response==null)
          {
            this.city_name = "Not Matched";
          }
          else
          {
            this.city_name = response.city;
            this.data.state = {'state_name':response.state_name};
            this.data.district = {'district_name':response.district_name};
            this.data.city = {'city':response.city};
            
          }
        });
      }
      
      
      getCity(state,district) {
        console.log(state);
        console.log(district);
        
      
        
        this.services.getCity1({'state':state,'district':district}).then((response:any)=>{
          console.log(response);
          this.city_list = response;
          
        });
      }
      
      getArea(state,district,city) {
        console.log(state);
        

        
        this.services.getCity({'state':state,'district':district, 'city':city}).then((response:any)=>{
          console.log(response);
          this.city_list = response;
          
        });
      }
      
      
      getPincode(state,district,city,area) {
        console.log(state);
        
       
        
        this.services.getCity({'state':state,'district':district, 'city':city, 'area':area}).then((response:any)=>{
          console.log(response);
          this.city_list = response;
          
        });
      }
      
      selectAddressOnBehalfOfPincode()
      {
        if(this.checkin.pincode.length==6)
        {
         
          this.service.addData({'pincode':this.checkin.pincode},'Enquiry/selectAddressOnBehalfOfPincode').then((result)=>{
            
            console.log(result);
            this.checkin.state = result['state_name']
            this.get_district()
            this.checkin.district = result['district_name']
            this.checkin.city = result['city']
            
            // this.selectarea();
            
            
          },err=>
          {
            
            // this.db.presentToast('Failed To Get ')
          })
        }
      } 
      get_district()
      {
        this.service.addData({"state_name":this.checkin.state},"dealerData/getDistrict")
        .then(resp=>{
          console.log(resp);
          this.district_list = resp['district_list'];
        },
        err=>{
          this.service.errToasr()
        })
      }
      
      presentPopover(myEvent,type) 
      {
        
        console.log(type);
        
        console.log(myEvent);
        
        
        let popover = this.popoverCtrl.create(ExpensePopoverPage,{'via':'checkin','checkInData':this.checkin_data,'showEditRetailer':this.showEditRetailer,'type': type});
        
        
        popover.present({
          ev: myEvent
        });
        
        popover.onDidDismiss(resultData => {
          
          console.log(resultData['Retailer']);
          
          if(resultData['Retailer']=='Show'){
            console.log("in true");
            this.showEditRetailer=true;
          }
          else if(resultData['Retailer']=='Hide'){
            console.log("in false");
            this.showEditRetailer=false;
            
          }
          
          console.log(this.showEditRetailer);
          
          
        })
        
        
      }
      distributor_list:any=[]
      get_distributor()
{
    // this.service1.show_loading();
    this.service.addData({'type':1,'from':'order'},'DealerData/get_type_list').then((result)=>{
        console.log(result);
        this.distributor_list = result;
        
        // this.service1.dismiss();
      
        
    });
}
goOnOrderDetail(id)
    {
        this.navCtrl.push(ExecutiveOrderDetailPage,{id:id , login:'Employee'})
    }
      
      goTo(where){
        console.log(where);
        
        if(where == 'Primary'){
          this.navCtrl.push(AddOrderPage,{'dr_type':this.checkin_data.dr_type,'checkin_id':this.checkin_data.checkin_id ,'id':this.checkin_data.dr_id,'dr_name':this.checkin_data.dr_name, 'order_type':'Primary'});
        }
        else if(where == 'Secondary'){
          console.log(this.checkin_data.dr_type);
          console.log(this.checkin_data.dr_name);
          this.navCtrl.push(AddOrderPage,{'dr_type':this.checkin_data.dr_type,'id':this.checkin_data.dr_id,'checkin_id':this.checkin_data.checkin_id ,'dr_name':this.checkin_data.dr_name, 'order_type':'Secondary'});
        }
        else if(where == 'FollowUp'){
          this.navCtrl.push(FollowupAddPage, {'dr_type':this.checkin_data.dr_type,'checkin_id':this.checkin_data.checkin_id ,'dr_name':this.checkin_data.dr_name});
        }
        
        else if(where == 'VisitingCard'){
          this.navCtrl.push(VisitingCardAddPage, {'dr_type':this.checkin_data.dr_type,'checkin_id':this.checkin_data.checkin_id ,'dr_name':this.checkin_data.dr_name});
        }
        else if(where == 'PopNGifts'){
          this.navCtrl.push(PopGiftAddPage , {'dr_type':this.checkin_data.dr_type,'checkin_id':this.checkin_data.checkin_id ,'dr_name':this.checkin_data.dr_name});
        }
        else if(where == 'quotation'){
          this.navCtrl.push(LmsQuotationAddPage,{'dr_type':this.checkin_data.dr_type,'checkin_id':this.checkin_data.checkin_id ,'dr_name':this.checkin_data.dr_name})
        }
        else if(where == 'MEET'){
          this.navCtrl.push(ContractorMeetAddPage,{'dr_type':this.checkin_data.dr_type,'checkin_id':this.checkin_data.checkin_id ,'dr_name':this.checkin_data.dr_name, 'checkinUserID':this.salesUserId})
        }
        
        else if(where == 'UPLOAD'){
          this.takePhoto();
        }
        
        else if(where == 'Contacts'){
          this.navCtrl.push(AddMultipleContactPage,{'dr_id':this.checkin_data.dr_id,'checkin_id':this.checkin_data.checkin_id ,'dr_name':this.checkin_data.dr_name})
          
        }
        
      }
      
      
      pending_checkin()
      {
        console.log("pending_checkin method calls");
        
        this.service.pending_data().then((result)=>{
          console.log(result);
          this.checkin_data = result['checkin_data'];
          console.log(this.checkin_data);
          this.pending_checkin_id=this.checkin_data['checkin_id']
          this.new_retailer_id=this.checkin_data['dr_id']
          this.checkin.dr_name = this.checkin_data.dr_name;
          this.checkin.name = this.checkin_data.name;
          this.checkin.dr_mobile = this.checkin_data.dr_mobile_no;
          this.update_retailer_flag=this.checkin_data['update_retailer'];
          console.log(this.update_retailer_flag);
          
        })
      }
      
      selectarea(){
        console.log(this.checkin);
        this.form1.state=this.checkin.state;
        this.form1.district=this.checkin.district;
        console.log(this.form1);
        this.service.addData3(this.form1,"User/area_user_list")
        .then(resp=>{
          console.log(resp);
          this.area_list = resp['query']['area'];
          console.log(this.area_list);
          this.checkin.area='';
        },
        err=>{
          this.service.errToasr();
        })
      }
      
    }
    