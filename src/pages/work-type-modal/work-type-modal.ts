import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ActionSheetController, LoadingController, Events } from 'ionic-angular';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GeolocationserviceProvider } from '../../providers/geolocationservice/geolocationservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-work-type-modal',
  templateUrl: 'work-type-modal.html',
})
export class WorkTypeModalPage {
  working_type: any = []
  input_type: any = false;
  user_id: any
  image: any = '';
  image_data: any = [];
  data: any = {};
  type: string = '';
  id;
  flag: boolean = true;
  last_attendence_data: any = [];
  strtReadin : any = 0;
  workType:any='';
  
  
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public serv: AttendenceserviceProvider,
    public viewcontrol: ViewController,
    public loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController,
    public locationAccuracy: LocationAccuracy,
    public serve: MyserviceProvider,
    public geolocation: Geolocation,
    private camera: Camera,
    private storage: Storage,
    public track: GeolocationserviceProvider,
    
    public events: Events) {
      console.log(this.navParams);
      
      this.type = this.navParams.get('type');
      this.id = this.navParams.get('id');
      
      console.log(this.type);
      
      if (this.type == 'start') {
        
        this.storage.get('userId').then((id) => {
          
          console.log(id);
          if (typeof (id) !== 'undefined' && id) {
            this.user_id = id;
            console.log(this.user_id);
            
          }
          
        });
        this.getWorkingType();
      }
      
      else {
        console.log("in else");
        
        this.last_attendence();
        
      }
      
      
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad WorkTypeModalPage');
    }
    
    getWorkingType() {
      this.serv.getWorkingType().then((response: any) => {
        console.log(response);
        this.working_type = response;
      });
    }
    
    open_input(data) {
      this.data.work_type = data;
      
      if (data == 'Working') {
        this.viewcontrol.dismiss();
        this.start_attend();
      }
      
      if (data == 'Travel') {
        this.input_type = true;
      }
      else {
        this.input_type = false;
      }
    }
    
    close() {
      
      this.viewcontrol.dismiss();
    }
    
    
    
    start_attend() {
      console.log(this.data);
      this.serve.show_loading();
      
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          
          let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
          this.geolocation.getCurrentPosition(options).then((resp) => {
            
            var lat = resp.coords.latitude
            var lng = resp.coords.longitude
            
            // this.serve.show_loading()
            
            this.serv.start_attend({ 'lat': lat, 'lng': lng, 'id': this.user_id, 'data': this.data, 'image': this.image_data }).then((result) => {
              if (result['msg'] == 'success') {
                this.events.publish('user:login');
                this.viewcontrol.dismiss();
                this.serve.dismiss();
                this.flag = false;
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
      
      submit() {
        console.log(this.data);
        this.start_attend();
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
      
      
      
      fileChange(img) {
        // this.image_data=[];
        this.image_data.push(img);
        console.log(this.image_data);
        this.image = '';
      }
      
      remove_image(i: any) {
        this.image_data.splice(i, 1);
      }
      
      save() {
        this.serve.show_loading();
        
        
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
          this.geolocation.getCurrentPosition(options).then((resp) => {
            var lat = resp.coords.latitude
            var lng = resp.coords.longitude
            
            this.serv.stop_attend({ 'lat': lat, 'lng': lng, 'attend_id': this.id, 'image': this.image_data, 'stop_reading': this.data.stop_reading }).then((result) => {
              if (result == 'success') {
                this.flag = false;
                this.serve.dismiss();
                this.serve.presentToast('Work Time Stopped Successfully');
                this.viewcontrol.dismiss();
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
      
      
      
      MobileNumber(event: any) {
        console.log(event);
        
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
      }
      
      test(){
        console.log(this.data.select_vehicle);
        console.log(this.data.start_reading);
        console.log(this.image_data);
      }
      
      
      last_attendence() {
        this.serv.last_attendence_data().then((result) => {
          console.log(result);
          this.last_attendence_data = result['attendence_data'];
          this.workType = result['attendence_data']['work_type'];
          console.log(this.last_attendence_data);
          this.strtReadin = (this.last_attendence_data['start_reading']);
          
          
        })
      }
      
      
      conInt(val)
      {
        return parseInt(val);
      }
      check_reading()
      {
        if(this.strtReadin>this.data.stop_reading)
        {
          this.serve.presentToast('Stop Reading Should Be Greater than Start Reading');

        }
      }
      
    }
    