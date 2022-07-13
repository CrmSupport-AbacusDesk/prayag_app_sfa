import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { IonicSelectableComponent } from 'ionic-selectable';
import moment from 'moment';

@IonicPage()
@Component({
  
  
  
  selector: 'page-attendence-new',
  templateUrl: 'attendence-new.html',
})
export class AttendenceNewPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  date:any
  current_month:any
  current_year:any
  attendance_list:any =[]
  attendance_list1:any =[]
  
  attendance_summery:any ={}
  userId:any
  month_array:any=[]
  attendencetype='My'
  data:any={};
  selected_date =new Date().toISOString().slice(0,10);
  data3:any=false
  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public popoverCtrl: PopoverController,
    )
    {
      console.log();
      
      this.storage.get('userId').then((id) => {
        this.userId = id;
        console.log(this.userId);
      });
      
      this.date = new Date();
      this.current_month = this.date.getMonth();
      this.current_year = this.date.getFullYear();
    }
    
    teamCount:any= 0;
    ionViewDidLoad() {
      this.storage.get('team_count').then((team_count) => {
        this.teamCount = team_count;
      });
      console.log('ionViewDidLoad AttendenceNewPage');
      this.getMonthArray()
      this.get_user();
      
    }
    getMonthArray()
    {
      
      for (let i = 0; i < 5; i++)
      {
        let month = new Date(this.current_year,this.current_month-i,1).getMonth()
        let year = new Date(this.current_year,this.current_month-i,1).getFullYear()
        
        this.month_array.push({ 'month':month,'year':year,'month_name':this.monthNames[month]})
      }
      console.log(this.month_array);
      
      setTimeout(() => {
        this.getAttendanceData();
        
      }, 100);
      
      
    }
    changeDate(type)
    { 
      console.log(type);
      
      if(type=='previous')
      this.selected_date = moment(this.selected_date).subtract(1, "days").format('YYYY-M-D');
      
      if(type=='next')
      this.selected_date = moment(this.selected_date).add(1, 'days').format('YYYY-M-D'); 
      this.getTeamData();
      
    }
    test2(){
      this.data3=true
    }
    getTeamData()
    {
      
      if(this.attendencetype!='My'){
        let data = {'month':this.current_month+1,'year':this.current_year,'user_id':this.data.user,'date':this.selected_date}
        
        console.log(data);
        
        this.serve.addData(data,'Attendence_new/GET_TEAM_ATTENDANCE').then((result)=>
        {
          console.log(result);
          this.attendance_list1 = result['data'].attendance
          this.attendance_summery = result['data'].attendance_summery
          for (let i = 0; i < this.attendance_list.length; i++) {
            this.attendance_list[i]['start_date_time'] = this.attendance_list[i]['date']+' '+this.attendance_list[i]['start_time'];
            this.attendance_list[i]['stop_date_time'] = this.attendance_list[i]['date']+' '+this.attendance_list[i]['stop_time'];
            this.attendance_list[i]['collapse'] = false;
            
          }
          
        },err=>
        {
          
        });
      }
      
      
    }
    getAttendanceData()
    {
      if(this.attendencetype=='My'){
        this.data.user=""
        let data = {'month':this.current_month+1,'year':this.current_year,'user_id':this.userId}
        this.serve.show_loading();
        
        console.log(data);
        
        this.serve.addData(data,'Attendence_new/GET_USER_ATTENDANCE').then((result)=>
        {
          console.log(result);
          this.attendance_list = result['data'].attendance
          this.attendance_summery = result['data'].attendance_summery
          for (let i = 0; i < this.attendance_list.length; i++) {
            this.attendance_list[i]['start_date_time'] = this.attendance_list[i]['date']+' '+this.attendance_list[i]['start_time'];
            this.attendance_list[i]['stop_date_time'] = this.attendance_list[i]['date']+' '+this.attendance_list[i]['stop_time'];
            this.attendance_list[i]['collapse'] = false;
            
          }
          this.serve.dismiss()
          
        },err=>
        {
          this.serve.dismiss()
          this.serve.errToasr()
        });
      }
      if(this.attendencetype!='My'){
        let data = {'month':this.current_month+1,'year':this.current_year,'user_id':this.data.user}
        this.serve.show_loading();
        
        console.log(data);
        
        this.serve.addData(data,'Attendence_new/GET_USER_ATTENDANCE').then((result)=>
        {
          console.log(result);
          this.attendance_list = result['data'].attendance
          this.attendance_summery = result['data'].attendance_summery
          for (let i = 0; i < this.attendance_list.length; i++) {
            this.attendance_list[i]['start_date_time'] = this.attendance_list[i]['date']+' '+this.attendance_list[i]['start_time'];
            this.attendance_list[i]['stop_date_time'] = this.attendance_list[i]['date']+' '+this.attendance_list[i]['stop_time'];
            this.attendance_list[i]['collapse'] = false;
            
          }
          this.serve.dismiss()
          
        },err=>
        {
          this.serve.dismiss()
          this.serve.errToasr()
        });
      }
      
      
    }
    presentPopover(myEvent)
    {
      let popover = this.popoverCtrl.create(ExpensePopoverPage,{'from':'Attendence'});
      
      popover.present({
        ev: myEvent
      });
      
      popover.onDidDismiss(resultData => {
        
        console.log(resultData);
        if( resultData)
        {
          this.attendencetype = resultData.TabStatus;
          console.log(this.attendencetype);
          this.getAttendanceData();
          if(this.attendencetype=="Team"){
            this.getTeamData()
          }
          
          
        }
        
      })
      
    }
    test(id)
    {
      console.log('test');
      
      console.log(id);
      
    }
    user_list:any=[]
    get_user()
    {
      
      this.serve.addData({'user_id':this.data.user},"Attendence/all_ASM")
      .then(resp=>{
        console.log(resp);
        this.user_list = resp['asm_id'];
        console.log(this.user_list);
      },
      err=>
      {
      })
    }
    
  }
  