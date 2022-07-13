import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the TravelPopOverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-pop-over',
  templateUrl: 'travel-pop-over.html',
})
export class TravelPopOverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelPopOverPage');
  }

  close(type) {
    // return type
    this.viewCtrl.dismiss({ 'TabStatus': type });
  }

}
