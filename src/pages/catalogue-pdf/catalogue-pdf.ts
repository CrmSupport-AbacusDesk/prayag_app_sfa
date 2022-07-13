import { Component } from '@angular/core';
// import { DocumentViewer } from '@ionic-native/document-viewer';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-catalogue-pdf',
  templateUrl: 'catalogue-pdf.html',
})
export class CataloguePdfPage 
{

  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
   
  }

  ionViewDidLoad() 
  {

    console.log('ionViewDidLoad CataloguePdfPage');
  }

  ionViewWillEnter()
  {
      this.openCatelogue();

  }

  openCatelogue()
  {
    console.log("openCatelogue");
    
    // const options: DocumentViewerOptions = {
    //   title: 'My PDF'
    // }
    
    // this.document.viewDocument('assets/obrz.pdf', 'application/pdf', options)
  }

}
