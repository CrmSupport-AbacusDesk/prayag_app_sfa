import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the ExpenseStatusModalPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-expense-status-modal',
  templateUrl: 'expense-status-modal.html',
})
export class ExpenseStatusModalPage {
  
  data:any={}
  filter:any={}

  from_page :any=''
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public serve: MyserviceProvider,
    public modalCtrl: ModalController) 
    {
      this.from_page =this.navParams.get("from");
      console.log(this.from_page)
      if(this.from_page =='team')
      {
        this.data.type=this.navParams.get("type");
        console.log(this.data.type);
        
      }
      if(this.from_page =='travel')
      {
        this.data.id=this.navParams.get("travelId");
      }
      if(this.from_page =='expense')
      {
        this.data.id=this.navParams.get("expenseId");
        this.data.type=this.navParams.get("type");
      }
      if(this.from_page =='leave')
    {
      this.data.id=this.navParams.get("leaveId");
    }
      if(this.from_page =='travel')
      {
        this.data.id=this.navParams.get("travelId");
      }
      if(this.from_page =='team')
      {
        this.data.type=this.navParams.get("type");
        console.log(this.data.type);
        
      }
      console.log(this.data);
      
    }
    
    ionViewDidLoad() 
    {
      console.log('ionViewDidLoad ExpenseStatusModalPage');
      this.getReportData();
    }
    
    dismiss() 
    {
      this.viewCtrl.dismiss();
    }
    
    update_status()
    {
      console.log(this.data)
      var func_name 
      if(this.from_page =='expense')
      {
        func_name = 'Expense/update_status'
      }
      
      if(this.from_page =='travel')
      {
        func_name = 'TravelPlan/update_status'
      }
      if(this.from_page =='leave')
      {
        func_name = 'leave/update_status'
      }
      this.serve.addData(this.data,func_name).then((result)=>
      {
        console.log(result);
        if(result)
        {
          this.serve.presentToast('Status Changed Successfully!!');
          this.viewCtrl.dismiss();
        }
      },
      error => {
        this.serve.presentToast('Something Went wrong!!')
      });
    }
    team:any=[]
    getReportData()
    {

      // this.show_loading();
      this.serve.addData({},'Checkin/listing_all_asm').then((result)=>
      {

        console.log(result);
        this.team=result



       



       

      },err=>
      {


      })

    }
    ondismiss(){
      {
        console.log("hloo");
        
        var data=this.filter
        console.log(data);

        this.viewCtrl.dismiss(
          data
        );
      }
    }
  }
  