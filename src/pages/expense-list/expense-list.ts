import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ExpenseAddPage } from '../expense-add/expense-add';
import { ExpenseDetailPage } from '../expense-detail/expense-detail';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-expense-list',
  templateUrl: 'expense-list.html',
})
export class ExpenseListPage {
  
  expenseStatus:any = 'Pending';
  expenseList:any = [];
  sendRequest:any=false
  expenseType:any="My";
  name:any=[]
  expense:any=[]
  travelViewType:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public db:MyserviceProvider,
    public storage: Storage,
    public popoverCtrl: PopoverController) 
    {
      this.storage.get('displayName').then((displayName) => 
      {
        console.log(displayName);
        if(typeof(displayName) !== 'undefined' && displayName)
        {            
          this.expense.userName = displayName;
          console.log(this.expense.userName);      
        }
      });
      
      
      
    }
    
    ionViewDidLoad() 
    {                                                                      
      console.log('ionViewDidLoad ExpenseListPage');
    }
    
    ionViewWillEnter(){
      
      this.travelViewType = this.navParams.get('view_type');
      
      if (this.travelViewType == 'Team') {
        this.expenseType = 'Team';
      }
      else{
        this.expenseType = 'My';

      }
      this.getExpenseList();
    }
    
    addPage()
    {
      this.navCtrl.push(ExpenseAddPage);
    }
    
    
    deatilPage(id)
    {
      this.navCtrl.push(ExpenseDetailPage,{'id':id});
    }
    
    getExpenseList()
    {
      this.db.show_loading();
      this.sendRequest=false
      this.expenseList =[];
      
      this.db.addData({'expenseStatus':this.expenseStatus,'expenseType':this.expenseType},"Expense/expList").then(resp=>
        {
          console.log(resp);
          this.db.dismiss()
          this.expenseList = resp;
          for (let i = 0; i < this.expenseList.length; i++) {
            this.name=this.expenseList[0].createdByName
            console.log(this.name);
            
          }
          this.sendRequest=true
        },err=>
        {
          this.db.dismiss()
          this.db.errToasr()
        })
      }
      
      
      presentPopover(myEvent) 
      {
        let popover = this.popoverCtrl.create(ExpensePopoverPage,{'from':'Expense'});
        
        popover.present({
          ev: myEvent
        });
        
        popover.onDidDismiss(resultData => {
          
          console.log(resultData);
          this.expenseType = resultData.TabStatus;
          this.getExpenseList();
          
        })
        
        
      }
      
    }
    