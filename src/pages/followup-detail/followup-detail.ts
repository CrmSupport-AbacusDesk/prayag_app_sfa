// import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';

// /**
//  * Generated class for the FollowupDetailPage page.
//  *
//  * See https://ionicframework.com/docs/components/#navigation for more info on
//  * Ionic pages and navigation.
//  */

// @IonicPage()
// @Component({
//   selector: 'page-followup-detail',
//   templateUrl: 'followup-detail.html',
// })
// export class FollowupDetailPage {
//   followup_id: any;
//   followup_detail: any={};
//   loader: boolean = false;
  
//   constructor() { 
    
    
 
    
//   }
  
//   ngOnInit() {
//   }
  
  
//   get_followup_detail() {
//     this.loader = true;
//     this.serve.fetchData({'followup_id':this.followup_id}, "Distributors/followup_detail").subscribe((result) => {
//       this.followup_detail = result['followup_detail'][0];
//       console.log(this.followup_detail);
//       setTimeout(() => {
//         this.loader = false;
//       }, 700);
//     })
//   }
  
  
//   edit_followup_modal() {
//     const dialogRef = this.dialog.open(FollowupEditComponent, {
//       width: '750px',
//       data: {
//         'followup_detail':this.followup_detail,
//         'from':'followup detail page'
//       }
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       this.get_followup_detail()
//     });
//   }
  
  
  
// }
import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FollowupAddPage } from '../followup-add/followup-add';

/**
* Generated class for the FollowupDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-followup-detail',
  templateUrl: 'followup-detail.html',
})
export class FollowupDetailPage {
  
  loading:Loading;
  followup_id:any = '0';
  followup_detail:any = [];
  status:any=''
  today_date = moment(new Date()).format('YYYY-MM-DD');
  max_date = new Date().getFullYear() + 1;
  disable_update : boolean = true;
  current_followup_date:any=''
  
  
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public service:MyserviceProvider,public loadingCtrl:LoadingController,public dbService:DbserviceProvider, public navParams: NavParams) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowupDetailPage');
  }
  
  ionViewWillEnter(){
    
    console.log(this.navParams.get('from'));
    console.log(this.navParams.get('follow_up_id'));
    
    if(this.navParams.get('from') == 'follow_up_list_page' && this.navParams.get('follow_up_id')){
      this.followup_id = this.navParams.get('follow_up_id')
      this.get_followup_detail();
    }
    
  }
  
  get_followup_detail(){
    console.log("get_followup_detail method call");
    this.show_loading()
    this.service.addData({'followup_id':this.followup_id},'Followup/followup_detail').then((result)=>{
      console.log(result);
      this.followup_detail = result['followup_detail'][0]
      this.status = this.followup_detail.status;
      this.current_followup_date = this.followup_detail.next_follow_date;
      console.log(this.current_followup_date);
      
      
      this.loading.dismiss();
      
    },err=>
    {
      this.loading.dismiss();
      console.log("error");
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Somethong Went Wrong Please Try Again',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            
          }
        },
      ]
    });
    alert.present();
    this.navCtrl.pop();
  });
  
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

change_followup_status(){
  
  console.log("change_followup_status method call"); 
  console.log(this.followup_detail.status);
  console.log(this.followup_detail.id);
  console.log(this.followup_detail);
  
  this.show_loading();
  
  this.service.addData(this.followup_detail.status == 'complete' ? {'id':this.followup_detail.id,'status':this.followup_detail.status} : {'id':this.followup_detail.id,'status':this.followup_detail.status,'followup_date':this.followup_detail.follow_up_date,'followup_remark':this.followup_detail.followup_remark},'Followup/update_followup').then((result)=>{
    console.log(result);
    if(result['msg'] == 'Updated Successfully'){
      this.loading.dismiss();
      
      if(this.followup_detail.status == 'complete'){
        let alert = this.alertCtrl.create({
          title: 'Add Follow Up?',
          subTitle: 'Do You Want To Create Other Follow Up',
          cssClass: 'action-close',
          
          buttons: [{
            text: 'NO',
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          },
          {
            text: 'YES',
            cssClass: 'close-action-sheet',
            handler: () => {
              this.navCtrl.push(FollowupAddPage,{'follow_up_data':this.followup_detail,'from':'followup detail page'});
            }
          }]
        });
        alert.present();
      }
      else{
        
        let alert = this.alertCtrl.create({
          title: 'Success?',
          subTitle: 'Follow Up Update Successfully',
          cssClass: 'action-close',
          
          buttons: [{
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          }]
        });
        alert.present();
      }
    }
    
    
  },err=>
  {
    this.loading.dismiss();
    console.log("error");
    let alert=this.alertCtrl.create({
      title:'Error !',
      subTitle: 'Somethong Went Wrong Please Try Again',
      cssClass:'action-close',
      
      buttons: [{
        text: 'Okay',
        role: 'Okay',
        handler: () => {
          
        }
      },
    ]
  });
  alert.present();
  this.navCtrl.pop();
});

}


}
