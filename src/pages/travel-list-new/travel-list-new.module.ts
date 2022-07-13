import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelListNewPage } from './travel-list-new';


@NgModule({
  declarations: [
    TravelListNewPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelListNewPage),
  ],
})
export class TravelListNewPageModule {}
