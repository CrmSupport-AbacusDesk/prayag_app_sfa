import { Component, TestabilityRegistry } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { HomePage } from '../home/home';
import moment from 'moment';
import { CheckinDetailPage } from '../sales-app/checkin-detail/checkin-detail';
import { OrderDetailPage } from '../order-detail/order-detail';
import { ExecutiveOrderDetailPage } from '../executive-order-detail/executive-order-detail';
import { ContractorMeetListPage } from '../Contractor-Meet/contractor-meet-list/contractor-meet-list';
import { VisitingCardListPage } from '../visiting-card/visiting-card-list/visiting-card-list';
import { PointLocationPage } from '../point-location/point-location';
import { AddLeadsPage } from '../sales-app/add-leads/add-leads';
import { AddRetailerPage } from '../add-retailer/add-retailer';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../../providers/constant/constant';


@IonicPage()
@Component({
  selector: 'page-leads-detail',
  templateUrl: 'leads-detail.html',
})
export class LeadsDetailPage {
    dr_id:any;
    distributor_detail:any=[];
    total_checkin:any = [];
    total_order:any = [];
    type:any
    search:any={}
    date:any
    showRelatedTab:any
    target:any;
    achievement:any;
  image_url:any=''

    constructor(  public file:File,
        private fileOpener: FileOpener,
             public constant:ConstantProvider,
             private transfer: FileTransfer,private app:App,public navCtrl: NavController,private alertCtrl: AlertController,public db:MyserviceProvider,public modalCtrl: ModalController, public navParams: NavParams,public service:MyserviceProvider,public loadingCtrl: LoadingController,public popoverCtrl: PopoverController,public toastCtrl:ToastController) {
    this.date = moment(this.date).format('YYYY-MM-DD');
        console.log(this.navParams);
    this.image_url = this.constant.upload_url1
        
        if(this.navParams.get('dr_id'))
        {
            this.dr_id=this.navParams.get('dr_id');
            console.log(this.dr_id);
            this.lead_detail();
        }
        
        if(this.navParams.get('showRelatedTab') == 'false')
        {
            this.showRelatedTab = false
        }
        else
        {
            this.showRelatedTab = true
        }
        console.log(this.navParams.get('showRelatedTab'));
        console.log(this.showRelatedTab);
        
        if(this.navParams.get('type'))
        {
            this.type=this.navParams.get('type');
            console.log(this.type);
            this.distributor_detaill.orderType='Primary'

            this.dr_detail('Primary');
        }
        
    }
    
    ionViewDidLoad() {
       
    }
    
    loading:any;
    lodingPersent()
    {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
        });
        this.loading.present();
    }
    
    
    lead_detail()
    {
    //    this.service.show_loading()
        console.log(this.search);
        
        this.service.addData({'dr_id':this.dr_id,search:this.search},'Distributor/lead_detailexec').then((result)=>{
            console.log(result);
            this.distributor_detail = result['result'];
            // this.target=result['total_target'];
            // this.achievement=result['total_achivement'];
            // this.total_checkin = result['total_checkin'];
            console.log(this.distributor_detail);
            // this.service.dismiss();
        });
    }
    distributor_detaill:any={}
    secondary:any=[]
    achievement_percent:any=[]
    document:any=[]
    openDocument(imageSource)
    { 
   

      

    // var pdfName = this. +'.pdf';

    const fileTransfer: FileTransferObject = this.transfer.create();
                
   console.log(imageSource)
   console.log(this.file);

   console.log("hiiiii")
   fileTransfer.download(imageSource, this.file.externalApplicationStorageDirectory  + '/Download/' + imageSource).
   then((entry) => {
     

       console.log('download complete: ' + entry.toURL());
       var url=entry.toURL()
   console.log("hiiiii2")
this.fileOpener.open(url, 'application/pdf')

   console.log(this.file ,"dfsgdfsgdfs");
  

   });
  
        
      
                  
        }
      
      
    dr_detail(type)
    {
       
        this.distributor_detaill.orderType = type
        // this.service.show_loading()

        console.log(this.search);
        
        this.service.addData({'dr_id':this.dr_id,search:this.search},'Distributor/dr_detail').then((result)=>{
            console.log(result);
    //    this.service.dismiss()

            this.distributor_detail = result['result'];
            this.document = result['result']['image'];
console.log(this.document)

            this.target=result['total_target'];
            this.achievement=result['total_achivement'];
            // this.total_checkin = result['total_checkin'];
            this.total_order = result['Primary'];
            this.secondary = result['Secondary'];
            this.target=parseInt(this.target)
            this.achievement=parseInt(this.achievement)
            console.log(this.target)
            console.log(this.achievement)

this.achievement_percent=((this.achievement/this.target)*100)
this.achievement_percent=parseInt(this.achievement_percent)

            console.log(this.achievement_percent);
            
        });

    }
    
    checkin_list:any = [];
    load_data:any = "0";
    order_list:any=[];


   
    ionViewDidLeave()
    {
      
    }
    checkin_detail(checkin_id)
    {
  
      console.log(checkin_id);
  
      this.service.addData({'checkin_id':checkin_id},'Checkin/checkin_detail').then((result)=>
      {
        console.log(result);
        if(result)
        {
          this.navCtrl.push(CheckinDetailPage,{'data':result,checkin_id:checkin_id});
        }
      })
  
    }
    goOnOrderDetail(id){
        this.navCtrl.push(ExecutiveOrderDetailPage,{id:id , login:'Employee'})
    }
    
    contracterMeet()
    {
        this.navCtrl.push(ContractorMeetListPage)
    }

    Visitingcard()
    {
        this.navCtrl.push(VisitingCardListPage)
    }
    Add()
    {
      this.navCtrl.push(AddRetailerPage,{'data':this.distributor_detail})
    }
    update_location(lat,lng,id){
        console.log(lat);
        console.log(lng);

        this.navCtrl.push(PointLocationPage,{"lat":lat,"lng":lng,"id":id,"type":this.type})
    }
}
