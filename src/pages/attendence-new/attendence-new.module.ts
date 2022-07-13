import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendenceNewPage } from './attendence-new';

@NgModule({
  declarations: [
    AttendenceNewPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendenceNewPage),
  ],
})
export class AttendenceNewPageModule {}
