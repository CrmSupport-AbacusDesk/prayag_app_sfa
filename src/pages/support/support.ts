import { Component } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage 
{
  document_list:any=[]
  image_url:any=''

  constructor(
              public navCtrl: NavController, 
             public constant:ConstantProvider,
             public navParams: NavParams,public db:MyserviceProvider,  public file:File,
             private fileOpener: FileOpener,
             private transfer: FileTransfer,) 
  {
  this.image_url = this.constant.upload_url1 + 'company_document/'

  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad SupportPage');
    this.get_document()
  }
  get_document()
    {
       
        this.db.show_loading();
        
        this.db.addData({},"lead/document_list")
        .then(resp=>{
            
            console.log(resp);
        this.db.dismiss();
            
            this.document_list = resp['result'];
            
          
           
        },
        err=>
        {
        })
        this.db.dismiss();

    }
    openDocument(document,type,doc_name){


      if(type=='application/pdf'  )
      {

    
        const fileTransfer: FileTransferObject = this.transfer.create();
                    
       
      //  console.log(this.url ,"url");
       console.log(this.file);
    
       console.log("hiiiii")
       fileTransfer.download(document, this.file.externalApplicationStorageDirectory  + '/Download/' + doc_name).
       then((entry) => {
         
    
           console.log('download complete: ' + entry.toURL());
           var url=entry.toURL()
       console.log("hiiiii2")
    this.fileOpener.open(url, 'application/pdf')
    
       console.log(this.file ,"dfsgdfsgdfs");
      
    
       });
      
    
                
      }
      if(type=='xlsx'  )
      {

    
        const fileTransfer: FileTransferObject = this.transfer.create();
                    
       
      //  console.log(this.url ,"url");
       console.log(this.file);
    
       console.log("hiiiii")
       fileTransfer.download(document, this.file.externalApplicationStorageDirectory  + '/Download/' + doc_name).
       then((entry) => {
         
    
           console.log('download complete: ' + entry.toURL());
           var url=entry.toURL()
       console.log("hiiiii2")
    this.fileOpener.open(url, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
       console.log(this.file ,"dfsgdfsgdfs");
      
    
       });
      
    
                
      }
      if(type=='doc'  )
      {

    
        const fileTransfer: FileTransferObject = this.transfer.create();
                    
       
      //  console.log(this.url ,"url");
       console.log(this.file);
    
       console.log("hiiiii")
       fileTransfer.download(document, this.file.externalApplicationStorageDirectory  + '/Download/' + doc_name).
       then((entry) => {
         
    
           console.log('download complete: ' + entry.toURL());
           var url=entry.toURL()
       console.log("hiiiii2")
    this.fileOpener.open(url, 'application/msword')
    
       console.log(this.file ,"dfsgdfsgdfs");
      
    
       });
      
    
                
      }
      if(type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'  )
      {

    
        const fileTransfer: FileTransferObject = this.transfer.create();
                    
       
      //  console.log(this.url ,"url");
       console.log(this.file);
    
       console.log("hiiiii")
       fileTransfer.download(document, this.file.externalApplicationStorageDirectory  + '/Download/' + doc_name).
       then((entry) => {
         
    
           console.log('download complete: ' + entry.toURL());
           var url=entry.toURL()
       console.log("hiiiii2")
    this.fileOpener.open(url, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    
       console.log(this.file ,"dfsgdfsgdfs");
      
    
       });
      
    
                
      }
      if(type=='image/jpg'  )
      {

    
        const fileTransfer: FileTransferObject = this.transfer.create();
                    
       
      //  console.log(this.url ,"url");
       console.log(this.file);
    
       console.log("hiiiii")
       fileTransfer.download(document, this.file.externalApplicationStorageDirectory  + '/Download/' + doc_name).
       then((entry) => {
         
    
           console.log('download complete: ' + entry.toURL());
           var url=entry.toURL()
       console.log("hiiiii2")
    this.fileOpener.open(url, 'image/jpg')
    
       console.log(this.file ,"dfsgdfsgdfs");
      
    
       });
      
    
                
      }
      if(type=='image/jpeg'  )
      {

    
        const fileTransfer: FileTransferObject = this.transfer.create();
                    
       
      //  console.log(this.url ,"url");
       console.log(this.file);
    
       console.log("hiiiii")
       fileTransfer.download(document, this.file.externalApplicationStorageDirectory  + '/Download/' + doc_name).
       then((entry) => {
         
    
           console.log('download complete: ' + entry.toURL());
           var url=entry.toURL()
       console.log("hiiiii2")
    this.fileOpener.open(url, 'image/jpeg')
    
       console.log(this.file ,"dfsgdfsgdfs");
      
    
       });
      
    
                
      }
    }
}
