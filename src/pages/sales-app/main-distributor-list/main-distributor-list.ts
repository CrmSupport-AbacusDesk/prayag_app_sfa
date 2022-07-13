import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { LeadsDetailPage } from '../../leads-detail/leads-detail';
import { AddRetailerPage } from '../../add-retailer/add-retailer';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';



@IonicPage()
@Component({
  selector: 'page-main-distributor-list',
  templateUrl: 'main-distributor-list.html',
})
export class MainDistributorListPage {
  expenseStatus:any = 'My';
  
  user_right:any=[];
  DrType:any
  distributor_list:any = [];
  load_data:any = "0";
  limit=0;
  flag:any='';
  search:any;
  distributor_details:any = [];
  distributor_checkin:any = [];
  distributor_order:any=[];

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public service: MyserviceProvider, 
         public attendence_serv: AttendenceserviceProvider,

              public loadingCtrl: LoadingController) 
  {
    console.log(this.navParams.get('type'));
    this.DrType = this.navParams.get('type')
    this.get_distributor_list();
    this.last_attendence()
  }

  doRefresh (refresher)
  { 
    if(this.search)  
    this.search={}
    
    this.limit=0
    
      this.get_distributor_list() 
      setTimeout(() => {
          refresher.complete();
      }, 1000);
  }
  addretailer()
  {
    this.navCtrl.push(AddRetailerPage,{})
  }
  direct_list:any
  team_list:any
  get_distributor_list()
  {
    console.log(this.DrType);

    this.service.show_loading()
    this.service.addData({'limit':this.limit,'company_name':this.search,type:this.DrType,'list_type':this.expenseStatus},'Distributor/distributor_lists').then((result)=>{
      console.log(result);
      this.service.dismiss();
      this.distributor_list = result['data'];
      // if(this.expenseStatus=='My'){
      this.direct_list = result['count'];
      this.team_list = result['count2'];
      // }
      // if(this.expenseStatus=='Team'){
      //   this.direct_list = result['count2'];
      //   this.team_list = result['count'];
      //   }
      if(this.distributor_list.length == 0)
      {
        this.load_data = "1";
      }
    },
    er=>
    {
      this.service.dismiss()
      this.service.errToasr()
    });
  }
  team_count:any
  last_attendence() {
    // this.db.show_loading()
    this.attendence_serv.last_attendence_data().then((result) => {
        console.log(result);
        console.log("hiiiiiiiiiiiiiiiiiiii")
        
        // this.db.dismiss()
        this.team_count = result['team_count'];
       
        
    
        
      
        
    },error=>{
        console.log("Dashboard error");
        this.service.dismiss()
        
    })
    
}
  
  loadData(infiniteScroll)
  {
    console.log('loading');
    
    this.service.addData({'limit':this.distributor_list.length,type:this.DrType,'list_type':this.expenseStatus},'Distributor/distributor_lists').then( result=>
      {
        console.log(result);
        if(result=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.distributor_list=this.distributor_list.concat(result['data']);
            console.log(this.distributor_list)
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
  }
    
    
    
  distributor_detail(dr_id)
  {
    this.navCtrl.push(LeadsDetailPage,{'dr_id':dr_id,'type':'Dr'})    
  }
     
  
    
  }
  