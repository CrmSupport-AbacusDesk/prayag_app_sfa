import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController,AlertController  } from 'ionic-angular';

import { CameraOptions, Camera } from '@ionic-native/camera';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ConstantProvider } from '../../../providers/constant/constant';
import { ContractorMeetListPage } from '../contractor-meet-list/contractor-meet-list';
import {ContractorModalPage} from '../contractor-modal/contractor-modal';



@IonicPage()
@Component({
  selector: 'page-contractor-meet-detail',
  templateUrl: 'contractor-meet-detail.html',
})
export class ContractorMeetDetailPage {



  data: any={};
  prod_id:any='';
  id: any='';
  data1: any={};
  flag:any='';
  search:any;
  allcount: any=[];
  start:any=0;
  limit:any=5;
  details: any={};
  details1: any={};
  selectedFile: File[]=[];
  urls=new Array<string>();
  formData = new FormData();
  rootUrl2 = this.constant.rootUrl2;
  img_url=this.constant.img_url;
  TabType: any;
  prodstatus:any;
  data2:any={};
  data3:any={};
  meet_expense:any;
  image:any=[];
  LHimage:any=[];
  LHimage_data:any=[];
  complete_C_M_images=[];   //C_M = complete meeting
  complete_C_M_participants=[];
  complete_C_M_totalbudget:any;
  complete_C_M_expense:any;
  complete_C_M_status:any;
  checkin_id:any
  checkin_data:any




  constructor(public alertCtrl: AlertController, public camera: Camera,public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public navParams: NavParams, public modalCtrl: ModalController,public service1: MyserviceProvider, public service:DbserviceProvider,public serve:DbserviceProvider,public constant:ConstantProvider,private videoPlayer: VideoPlayer   ) {
    console.log(this.navParams);
    this.checkin_data = this.navParams.get('data');

    this.prod_id = this.navParams.get('meeting_id');
    this.TabType= 1
    this.prodstatus = this.navParams.get('status');

       if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('checkinUserID')) {
        this.checkin_id=this.navParams.get('checkin_id');
        console.log('in checin navparams');
        this.id = this.navParams.get('checkinUserID');
       console.log(this.id);
        

      }
     

    this.getContractorMeetDetail(this.prod_id);

  }
  getContractorMeetDetail(prod_id)  {
    this.service.post_request( {meeting_id:this.prod_id},'Contractor/filterMeetingData').subscribe((response)=>
    {
      console.log(response);
      this.data= response;
      console.log(this.data);
      this.allcount=response.visiting_card;
      this.details= response.result;
      console.log(this.details);
      this.complete_C_M_totalbudget = this.details[0]['total_budget'];
      this.complete_C_M_expense = this.details[0]['expense'];
      this.complete_C_M_status = this.details[0]['status'];


      this.data3 = this.data['participants'].length;
      console.log(this.data3);
      this.complete_C_M_images=response['meetingImages']
      console.log(this.complete_C_M_images);
      this.complete_C_M_participants=response['participants']

      

      
      for (let index = 0; index < this.data.meetingImages.length; index++) {
        const element = this.data.meetingImages[index].img_path;

       if(element.search(/.mp4/i)!=-1){
          this.data.meetingImages[index].type='video';
       }else{
         this.data.meetingImages[index].type='image';
       }
      }
    console.log(this.data);

      this.service1.dismiss();

    },er=>
    {
    });
  }

videoplay(path){
  this.videoPlayer.play(path).then(() => {
    console.log('video completed');
   }).catch(err => {
    console.log(err);
   });
}

goFullscreen(id) {
  var element = document.getElementById(id);       
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.requestFullscreen) {
    element.requestFullscreen();
  }  
}

openDocument(imageSource){
  console.log(imageSource);
  this.modalCtrl.create(ContractorModalPage, {"img": imageSource}).present();
  //I was able to find out only opening another page in the other sources like
  // this.modalCtrl.create(LoginPage, {}, { enableBackdropDismiss: false }).present();

  //How can i display the image on modal on click over the view image..
}


  deletePerson(id)
  {
    console.log(id);
    this.service.post_request({'id': id}, 'Contractor/delete_contract_person').subscribe((response)=>
    {
      console.log(response);
      if(response="true")
      {
         this.showSuccess("deleted Successfully!");
         this.getContractorMeetDetail(this.navParams.get('meeting_id'));

      }

    },er=>
    {
      this.service1.dismiss();
    });
    console.log(this.data);
    this.getContractorMeetDetail(this.prod_id);
    console.log(this.getContractorMeetDetail);
    console.log('delete participent person');
  }





  addParticipants(prod_id){
    console.log(this.data['participants']);

    // alert(this.data1.participent_mobile.length);
    // if(this.data1.participent_mobile<10 ){

    //   alert("Mobile Number Incorrect!");
    //   return process.exit(1)

    //   return false;
    // }
    // else{
    console.log(this.data1);

    const mobileIndex = this.data.participants.findIndex(row => row.participent_mobile == this.data1['participent_mobile']);

    if(mobileIndex === -1) {
      this.service.post_request({'meeting_id' :this.prod_id, 'contact_list': [this.data1]},'Contractor/add_contact_to_contractor_meet').subscribe((response)=>
      {
        console.log(response);
        // this.getContractorMeetDetail(this.prod_id);

        this.data1.participent_mobile='';
        this.data1.participent_name='';
        console.log(this.data1);
        // for(let i=0;i<this.selectedFile.length;i++){
        //   this.formData.append("add",this.selectedFile[i],this.selectedFile[i][name]);
        //   this.formData.append("meeting_id",this.prod_id);
        //   console.log(this.formData);
        //           this.getContractorMeetDetail(this.prod_id);

        //   // this.serve.fileData(this.formData,'Contractor/upload_meet_file')
        //   // .subscribe((result:any)=>{
        //   //   console.log(result);
        this.getContractorMeetDetail(this.prod_id);

        //   // })
        // }


        if(response.msg="success")
        {
          this.showSuccess("Added Successfully!");
          console.log(this.data1);

        }
      })

    }  else {
      this.showAlert("Mobile Number Already Exist!");
    }


  }

  name(event: any)
  {
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar))
    {event.preventDefault(); }
  }

  showAlert(text)
  {
    let alert = this.alertCtrl.create({
      title:'Warning!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }




  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  gotodetail(id)
  {
    this.navCtrl.push(ContractorMeetDetailPage,{'meeting_id':id})
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Albums',
      buttons: [
        {
          text: 'Gallery',
          role: 'Gallery',
          icon:'image',
          handler: () => {
            console.log('Gallery clicked');
            this.getImage();

          }
        },{
          text: 'Camera',
          icon:'camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePhoto();

          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }



  takePhoto()
  {
    this.image=[];
    console.log("i am in camera function");
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL ,
      targetWidth : 500,
      targetHeight : 400
    }

    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
      this.image.push('data:image/jpeg;base64,' + imageData);
      const file = this.DataURIToBlob(this.image[0])
console.log(file);

      const formData = new FormData();
      formData.append('add', file, 'image.jpg')
      formData.append('meeting_id', this.prod_id) //other param
      formData.append('path', 'temp/') //other param
console.log(formData);

      this.serve.fileData(formData,'Contractor/upload_meet_file')
      .subscribe((result:any)=>{
        console.log(result);
        this.getContractorMeetDetail(this.prod_id);

      })

      console.log(this.image);
    }, (err) => {
    });
  }

  getImage()
  {
    this.image=[];

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL ,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      console.log(this.image);
      console.log("line no 265");

      this.image.push('data:image/jpeg;base64,' + imageData);

      const file = this.DataURIToBlob(this.image[0])

      const formData = new FormData();
      formData.append('add', file, 'image.jpg')
      formData.append('meeting_id', this.prod_id) //other param
      formData.append('path', 'temp/') //other param
      console.log(formData);
      // this.submitbutton(formData);
      this.serve.fileData(formData,'Contractor/upload_meet_file')
      .subscribe((result:any)=>{
            console.log(result);
            this.getContractorMeetDetail(this.prod_id);
      })

      console.log(this.image);
    });
  }


  submitbutton(id){
    console.log(id);
    this.data2.id = id;
    // this.data2.LHimage.push(this.LHimage_data);    
    this.data2.status = 'completed';
    console.log(this.data2);
    let updateAlert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure ?',
      buttons: [
        {text: 'No', },
        {text: 'Yes',
        handler: () => {

          this.service.fileData({'id':this.details[0].created_by,'name':this.details[0].created_by_user,'data':this.data2},'Contractor/status_change')
          .subscribe((result:any)=>{
            console.log(result);
      if(result==true){
        this.navCtrl.pop();
        // this.navCtrl.push(ContractorMeetListPage);
      }
          })
        }}
      ]
    });
    updateAlert.present();

    // this.serve.fileData(this.data2,'Contractor/status_change').subscribe((result:any)=>{

    //   console.log(result);
    //   if(result=='true'){
    //     this.navCtrl.push(ContractorMeetListPage);
    //   }

    // });
  }
  // DataURIToBlob(dataURI: string) {
  //   const splitDataURI = dataURI.split(',')
  //   const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  //   const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  //   const ia = new Uint8Array(byteString.length)
  //   for (let i = 0; i < byteString.length; i++)
  //   ia[i] = byteString.charCodeAt(i)

  //   return new Blob([ia], { type: mimeString })
  // }

  DataURIToBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

  delete_image(id,index)
  {
    let updateAlert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure ?',
      buttons: [
        {text: 'No', },
        {text: 'Yes',
        handler: () => {

          this.service.post_request({"id":id},"Contractor/delete_contract_image")
          .subscribe(resp=>{
            console.log(resp);
            // this.data.meetingImages.splice(index,1);
            this.getContractorMeetDetail(this.prod_id);
          })
        }}
      ]
    });
    updateAlert.present();
  }

  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();

    }
  }

  fileChange(event) {
    console.log(event.target.files);
    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i]);
      // let reader = new FileReader();
      // reader.onload = (e: any) => {
      //     this.urls.push(e.target.result);
      //     console.log(e.target.result);
      // }
      // reader.readAsDataURL(event.target.files[i]);
    }
    console.log(this.urls);
    console.log(this.selectedFile);
    console.log(this.selectedFile);

    for(i=0;i<this.selectedFile.length;i++) {

         if(this.selectedFile[i].size > (5000000 *10)) {

                    let alert = this.alertCtrl.create({
                        title: 'Error',
                        message: 'Video Size Must be less than 50 MB',
                        buttons: [
                              {
                                    text: 'Ok',
                                    handler: () => {

                                         console.log('ok clicked');
                                    }
                              }
                        ]
                    });

                    alert.present();

                    return false;
         }
    }

    const formData = new FormData();
    for(i=0;i<this.selectedFile.length;i++){

          this.formData.append("add",this.selectedFile[i],this.selectedFile[i]['name']);
          this.formData.append("meeting_id",this.prod_id);
          console.log(this.formData);
          this.serve.fileData(this.formData,'Contractor/upload_meet_file')
          .subscribe((result:any)=>{
                console.log(result);
                this.getContractorMeetDetail(this.prod_id);

          })
    }

  }


  presentActionvideo(event){

      console.log(event.target.files);
      console.log(this.prod_id);

  }

  ionViewDidLoad() {
    this.prod_id = this.navParams.get('meeting_id');
    console.log(this.prod_id);
    setTimeout(() =>
    {
      setTimeout(() =>
      {
        this.getContractorMeetDetail(this.id);

      }, 200);
    }, 200);

  }

  loadData(infiniteScroll)
  {
    console.log('loading');
    this.service1.addData({"limit":this.limit},"dealerData/getDeale_checkin")
    .then((r) =>{
      console.log(r);
      if(r['checkin_list']=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          console.log('Asyn operation has stop')
          infiniteScroll.complete();
        },1000);
      }
    });
  }


  take_L_H_Photo() {
    console.log("i am in camera function");
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400
    }

    console.log(options);
    this.camera.getPicture(options).then((LHimageData) => {
      this.LHimage = 'data:image/jpeg;base64,' + LHimageData;
      console.log(this.LHimage);
      if (this.LHimage) {
        this.LHimage_data.push(this.LHimage);
    console.log(this.LHimage_data);
    this.image = '';
      }
    },
      (err) => {
      });
  }

  remove_image(i: any) {
    this.LHimage_data.splice(i, 1);
  }
}








