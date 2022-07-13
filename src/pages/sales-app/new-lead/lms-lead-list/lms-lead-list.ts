import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Refresher } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { LmsLeadAddPage } from '../lms-lead-add/lms-lead-add';
import { LmsLeadDetailPage } from '../lms-lead-detail/lms-lead-detail';

@IonicPage()
@Component({
    selector: 'page-lms-lead-list',
    templateUrl: 'lms-lead-list.html',
})
export class LmsLeadListPage {
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider,public loadingCtrl: LoadingController) {
        // this.get_assign_dr(1);
    }
    
    load_data:any
    start:any=0;
    filter:any={};
    dr_list:any=[];
    count:any=[];
    drid:any;
    networkType:any=[]
    getNetworkType(){
        this.db.addData3('', "Dashboard/distributionNetworkModule").then((result => {
          console.log(result);
          this.networkType = result['modules'];
        }))
      }
    get_assign_dr(type_id)
    {
        console.log(type_id);
        this.drid=type_id;
        this.load_data=0;
        this.filter.type_id = type_id;
        // this.db.show_loading();
        
        this.db.addData({"search":this.filter,},"Lead/getLeadList")
        .then(resp=>{
            
            console.log(resp);
        // this.db.dismiss();
            
            this.dr_list = resp['dr_list'];
            
            this.count = resp['count'];
            for (let index = 0; index < this.count.length; index++) {
                if(this.count[index].name=='Distributor'){
                    this.count[index].name='Distributor';
                }
                // if(this.count[index].name=='Dealer'){
                //     this.count[index].name='Retailer';
                // }
                
            }
            console.log(this.count);
            console.log(this.dr_list);
            if(!this.dr_list.length)
            {
                this.load_data=1
            }
        },
        err=>
        {
            // this.db.dismiss()
        })

    }
    
    loadData(infiniteScroll)
    {
        console.log('loading');
        this.start = this.dr_list.length;
        this.db.addData({"start":this.start,"search":this.filter},"dealerData/get_assign_dr")
        .then((r) =>{
            console.log(r);
            if(r['dr_list']=='')
            {
                // this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.dr_list=this.dr_list.concat(r['dr_list']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
    
    lead_detail(id)
    {
        console.log(id);
        this.navCtrl.push(LmsLeadDetailPage,{'id':id,'type':'Lead'})
    }
    
    addLead()
    {
        this.navCtrl.push(LmsLeadAddPage)
    }
    
    ionViewWillEnter() {
        console.log('ionViewDidLoad LmsLeadListPage');
        this.get_assign_dr(1);
        // this.doRefresh(Refresher);
        
    }
    
    doRefresh (refresher)
    {   
        this.filter.master=null
        this.filter={}
        this.start=0
        console.log(refresher);
        
        this.get_assign_dr(1) 
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
    
}
