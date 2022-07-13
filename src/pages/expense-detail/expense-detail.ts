import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { Storage } from '@ionic/storage';
import { ExpenseAddPage } from '../expense-add/expense-add';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-expense-detail',
  templateUrl: 'expense-detail.html',
})
export class ExpenseDetailPage {

  expenseId:any='';
  userId:any='';
  expenseDetail:any={}
  expand_local:any =false;
  expand_travel:any =false;
  expand_food:any =false;
  expand_hotel:any =false;
  expand_misc:any =false;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public db:MyserviceProvider,
              public modalCtrl: ModalController,
              public constant:ConstantProvider,
              public storage: Storage,  private transfer: FileTransfer,public file:File,private fileOpener: FileOpener
             ) 
             
  {
    this.expenseId=this.navParams.get("id");

    this.storage.get('userId').then((resp)=>
    {
        this.userId = resp
    });
    console.log(this.userId);
    
    this.getExpenseDetail();
 
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad ExpenseDetailPage');
  }

  getExpenseDetail()
  {
        this.db.show_loading();
        this.db.addData({'expenseId':this.expenseId},"Expense/expDetail").then(resp=>
        {
            console.log(resp);
            this.expenseDetail= resp['expense'];
            this.db.dismiss();
            
        },err=>
        {
            this.db.dismiss()
            this.db.errToasr()
        })
  }

  statusModal1(type) 
  {
    console.log(type)

    let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'type':type,'expenseId':this.expenseId,'expensetype':this.expenseDetail.expenseType,'from':'expenseedit'});

    modal.onDidDismiss(data =>
    {
        this.getExpenseDetail();
    });
    
    modal.present();
  }
  goOnExpenseAdd()
  {
      this.navCtrl.push(ExpenseAddPage,{'data':this.expenseDetail});

  }
  statusModal(type) 
  {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'type':type,'expenseId':this.expenseId,'from':'expense'});

    modal.onDidDismiss(data =>
    {
        this.getExpenseDetail();
    });
    
    modal.present();
  }
url:any
openimage(path){
  this.db.show_loading()

  var pdfName = '0.8mm.pdf';
  
  const fileTransfer: FileTransferObject = this.transfer.create();
  
  this.url = path;
  
  console.log(this.url ,"url");
  console.log(this.file);
  
  console.log("hiiiii")
  fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + pdfName).
  then((entry) => {
      
      
      console.log('download complete: ' + entry.toURL());
      var url=entry.toURL()
      console.log("hiiiii2")
      this.fileOpener.open(url, 'image/jpeg')
   this.db.dismiss()
      
      console.log(this.file ,"dfsgdfsgdfs");
      
      
  });
}

}
