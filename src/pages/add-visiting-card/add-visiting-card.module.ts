import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddVisitingCardPage } from './add-visiting-card';
import { IonicSelectableComponent, IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    AddVisitingCardPage,
  ],
  imports: [
    IonicPageModule.forChild(AddVisitingCardPage),
    IonicSelectableModule
  ],
})
export class AddVisitingCardPageModule {}
