import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams,ToastController,ActionSheetController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { LmsActivityListPage } from '../lms-lead-activity/lms-activity-list/lms-activity-list';
import { LmsFollowupListPage } from '../lms-lead-followup/lms-followup-list/lms-followup-list';
import { LmsQuotationListPage } from '../lms-lead-quotation/lms-quotation-list/lms-quotation-list';
import { AddMultipleContactPage } from '../../../add-multiple-contact/add-multiple-contact';
import { PointLocationPage } from '../../../point-location/point-location';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LmsLeadAddPage } from '../lms-lead-add/lms-lead-add';




@IonicPage()
@Component({
  selector: 'page-lms-lead-detail',
  templateUrl: 'lms-lead-detail.html',
})
export class LmsLeadDetailPage {
  
  constructor(public navCtrl: NavController,public toastCtrl: ToastController,public actionSheetController: ActionSheetController,private camera: Camera ,public navParams: NavParams,public db:MyserviceProvider,public loadingCtrl: LoadingController,public service:MyserviceProvider) {
  }
  
  ionViewWillEnter() {
    
    this.dr_id=this.navParams.get('id');
    console.log(this.dr_id);
    this.dr_detail();
    console.log('ionViewDidLoad LmsLeadDetailPage');
  }
  
  search:any={}
  dr_id:any;
  lead_detail:any={};
  contactPerson:any={};
  visiting_image:any=[];
  image: any = '';
  
  
  dr_detail()
  {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    // this.distributor_detaill.orderType = type
    
    console.log(this.search);
    loading.present()
    this.service.addData({'dr_id':this.dr_id,search:this.search},'Lead/getLeadDetail').then((result)=>{
      console.log(result);
      this.lead_detail = result['data'];
      console.log(this.lead_detail);
      this.visiting_image.push(this.lead_detail.visiting_card_image)
      console.log(this.visiting_image);
      this.contactPerson=result['data']['contactPerson'];
      console.log(this.contactPerson);
      loading.dismiss();
      
    });
    loading.dismiss();
  }
  
  lead_followup(type,id,company_name)
  {
    console.log(type);
    console.log(id);
    console.log(company_name);
    this.navCtrl.push(LmsFollowupListPage,{'type':type,'id':id,'company_name':company_name})
  } 
  
  lead_activity(type,id,company_name)
  {
    console.log(type);
    console.log(id);
    console.log(company_name);    
    this.navCtrl.push(LmsActivityListPage,{'type':type,'id':id,'company_name':company_name})
  } 
  
  goToQuotation(type,id,company_name)
  {
    this.navCtrl.push(LmsQuotationListPage,{'type':type,'id':id,'company_name':company_name});
  } 
  goOnTravelAdd()
    {
      this.navCtrl.push(LmsLeadAddPage,{'data':this.lead_detail})
    }
  addContactPerson(id){
    this.navCtrl.push(AddMultipleContactPage,{'dr_id':id})
  }
  
  update_location(lat,lng,id,leadType){
    console.log(lat);
    console.log(lng);
    this.navCtrl.push(PointLocationPage,{"lat":lat,"lng":lng,"id":id,"type":leadType});
  }
  
  remove_image(i: any) {
    this.visiting_image.splice(i, 1);
  }


  captureMedia() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log("Camera Clicked");

          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
      ]
    });
    actionsheet.present();
  }

  
  takePhoto() {
    console.log("i am in camera function");
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection:1,
      correctOrientation : true,
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.image);
      if (this.image) {
        this.fileChange(this.image);
      }
    },
    (err) => {
    });
  }

  getImage() {
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    console.log(options);

    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;

      console.log(this.image);
      if (this.image) {
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }
  
  
  
  fileChange(img) {
    this.visiting_image = (img);
    console.log(this.visiting_image);
    this.image = '';
    
    this.update_visiting_card()
    
    
  }
  
  
  update_visiting_card(){
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    loading.present();
    this.service.addData({'dr_id':this.dr_id,'visiting_card_image':this.visiting_image},'Lead/update_visitingCard').then((result)=>{
      console.log(result);
      if(result['msg'] == "success"){
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Visiting Card Image Updated',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.dr_detail();    
        
      }
      else{
        let toast = this.toastCtrl.create({
          message: 'Something went wrong in uploading image',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        loading.dismiss();
      }
      
    });
    loading.dismiss();
  }
  
}
