import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Time } from '@angular/common';
import * as moment from 'moment';
import notify from 'devextreme/ui/notify';

import { BizHour, UserInfo } from '../../shared/model';
import validator from 'devextreme/ui/validator';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../shared/auth.service';
import { ApiServicesService } from '../services/api-services.service';
import { faHourglass,faTimesCircle,faEdit,faTrashAlt,faSave,faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
//import { } from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-busines-hours',
  templateUrl: './busines-hours.component.html',
  styleUrls: ['./busines-hours.component.css']
})

export class BusinesHoursComponent implements OnInit {
  priorities:string[]= ['Off Day','Work Day'];
  now: Date = new Date();
  currentValue: Date = new Date();
  zoomLevels: string = "month";
  minDate: Date = new Date(2017, 12, 1);
  maxDate: Date = new Date(2018, 11, 31);
  firstDay: number = 1;
  cellTemplate: string = "custom";
  holydays: any = [];
  bizhrs: BizHour[] = [];
  dayNames:string[]= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  repeats:string[]= ['Daily','Weekly','Monthly','SingleDay'];
  offDayRepeats:string[]= ['Weekly','Monthly'];
 
  fromTime1: Date = new Date(2018, 1, 1, 7, 0, 0, 0);
  fromTime2: Date = new Date(2018, 1, 1, 14, 0, 0, 0);
  toTime1: Date = new Date(2018, 1, 1, 12, 0, 0, 0);
  toTime2: Date = new Date(2018, 1, 1, 20, 0, 0, 0);

  bizForm: FormGroup;
  bizHour:FormGroup;
  checkBoxValue: boolean;
  disabledWorkDay:boolean;
  timeDisabled:boolean;
  isWeekly:boolean=true;
  faCalendar =faCalendarAlt ;
  faDelete = faTrashAlt;
  faHourglass=faHourglass;
  faSave =faSave;
  faCancel =faTimesCircle;
  constructor(private formBuilder: FormBuilder,
              private auth:AuthService,
              private route:Router,
              private translate:TranslateService,
              private apiser:ApiServicesService) {
   
  }

  ngOnInit() {
    this.createForm();
    this.createBizForm();
    this.checkBoxValue=false;
    this.disabledWorkDay=true;
    this.timeDisabled=true;
    this.apiser.getBizHours()
      .subscribe(resp=>{ 
        let bhr:any[]= resp;
        console.log(bhr);
        bhr.forEach(x => {
          if (moment(x.fromHour).isValid()){
              x.fromHour = moment(x.fromHour).toDate();
          } else x.fromHour = null;

          if (moment(x.toHour).isValid()){
            x.toHour = moment(x.toHour).toDate();
          } else x.toHour = null;
          if (moment(x.workDate).isValid()){
            x.workDate = moment(x.workDate).toDate();
          }else x.workDate = null;
        });
        this.bizhrs =  bhr;
        this.setRepeatedOffDay();
      });    
  }
  
  createForm() {
    this.bizForm = this.formBuilder.group({
      fromtime1: new FormControl({value: this.fromTime1, disabled: true}), 
      fromtime2: new FormControl({value: this.fromTime2, disabled: true}), 
      totime1: new FormControl({value: this.toTime1, disabled: true}), 
      totime2: new FormControl({value: this.toTime2, disabled: true}), 
      repeatOn: new FormControl('',Validators.required), 
      dayNameOn: new FormControl('',Validators.required),
      workday: new FormControl(this.priorities[0])    
    });
  }

  createBizForm() {
    this.bizHour = this.formBuilder.group({
      bizfromtime1: new FormControl(this.fromTime1,Validators.required), 
      bizfromtime2: new FormControl(this.fromTime2,Validators.required), 
      biztotime1: new FormControl(this.toTime1), 
      biztotime2: new FormControl(this.toTime2), 
      repeat: new FormControl('',Validators.required), 
      dayName: new FormControl('',Validators.required)
    });
  }
  
  checkBox_valueChanged(e){
     this.disabledWorkDay=!e.value;
  }

  calendar_valueChanged(e){
    let day:Date = e.value;
    if (!this.checkBoxValue){
      return;
    }
    let fr1 =this.bizForm.get('fromtime1').value;
    let to1 =this.bizForm.get('totime1').value;
    let fr2 =this.bizForm.get('fromtime2').value;
    let to2 =this.bizForm.get('totime2').value;
    let workday =this.bizForm.get('workday').value;
    let repeated =this.bizForm.get('repeatOn').value;
    let dayName =this.bizForm.get('dayNameOn').value;
    let strDate = this.Date2String(day);

    let founddate= this.bizhrs.findIndex(
                 x=>this.Date2String(x.workDate)== strDate);
    if (founddate >-1){
      this.removeHoliday(day);
      this.bizhrs.splice(founddate,1); //if off day
      let founddate2= this.bizhrs.findIndex(
          x=>this.Date2String(x.workDate)== strDate);
      if (founddate2 >-1){
          this.bizhrs.splice(founddate2,1); //work day
      }
      if (workday=="Work Day"){
         this.addDay(day,workday, fr1, to1,repeated,dayName);
         this.addDay(day,workday, fr2, to2,repeated,dayName);       
      }else{
        this.addDay(day,workday, null, null,repeated,dayName);
        this.addHoliday(day);
      }
    }else{
      if (workday=="Off Day"){
         this.addDay(day,workday, null, null,repeated,dayName);
         this.addHoliday(day);
      }else{
        this.addDay(day,workday, fr1, to1,repeated,dayName);
        this.addDay(day,workday, fr2, to2,repeated,dayName);              
      }
    }     
  }
 
  addDay(day:Date,dayType:string,frHour:Date,
         toHour:Date,repeated:string,dayName:string){
    let bizhr = new BizHour();
     bizhr.id=-1;
     bizhr.workDate = day;  
     bizhr.dayType =dayType; 
     if (repeated==null || repeated==""){
        bizhr.repeatType ="";
        bizhr.dayName="SingleDay";
     }else {
       bizhr.repeatType =repeated;
       bizhr.dayName=dayName;
     }
    
     bizhr.fromHour = frHour;
     bizhr.toHour = toHour;
     this.bizhrs.push(bizhr);
    
  }

  addHoliday(date:Date){
    let arr = [date.getDate(),date.getMonth()];
    let index = this.holydays.findIndex(x=>x[0]==arr[0]&&x[1]==arr[1]);
    console.log("find holiday "+index);
    if (index<0){
      this.holydays.push(arr);
      //console.log(this.holydays);
    }
  }

  removeHoliday(date:Date){
    let arr = [date.getDate(),date.getMonth()];
    let index = this.holydays.findIndex(x=>x[0]===arr[0] && x[1]===arr[1]);
    console.log('removeHoliday '+index);
    if (index>-1){
      this.holydays.splice(index,1);
     
    }
  }

  Date2String(date:Date){
    let yy = date.getFullYear();
    let mm = date.getMonth()+1;
    let dd = date.getDate();
    return yy+"-"+mm+"-"+dd;
  }

  isWeekend(date) {
    var day = date.getDay();
    return day === 0 || day === 6;
  }

  getCellCssClass(date) {
    var cssClass = "";

    if (this.isWeekend(date))
      cssClass = "weekend";

    this.holydays.forEach(function (item) {
      if (date.getDate() === item[0] && date.getMonth() === item[1]) {
        cssClass = "holyday";
        return false;
      }
    });

    return cssClass;
  }
  onWokDayChanged(e){
    console.log(e);
   this.timeDisabled=!(e.value=="Work Day");
  }
  onBizHrsRowClick(e){
    this.currentValue =e.values[0];
  }
  onBizHrsDeleting(e){
    this.removeHoliday(e.data.date);    
  }
  
  onRepeatedChanged(e){
    if (e.value=='Weekly'){
        this.isWeekly =true;
    }else if (e.value=='Monthly'){
      this.isWeekly =false;
    }
  }
  SaveDailyBizHr(){
    this.SetDailyBizHours();
  }

  SetDailyBizHours(){
    let fr1 = this.bizHour.get('bizfromtime1').value;
    let to1 = this.bizHour.get('biztotime1').value;
    let fr2 =this.bizHour.get('bizfromtime2').value;
    let to2 = this.bizHour.get('biztotime2').value;
    let repeated = this.bizHour.get('repeat').value;
    let dayName = this.bizHour.get('dayName').value;
    let day = new Date();
    let workday ="Work Day";
    this.addDay(day,workday, fr1, to1,'Daily',''); 
    this.addDay(day,workday, fr2, to2,'Daily','');  
    let offday = moment().day(dayName).toDate(); 
    this.addDay(day,'Off Day', null, null,repeated,dayName);
    if (repeated=="Weekly"){
      this.setWeeklyOffDay(day,dayName);
    }else if (repeated=="Monthly"){
      this.setMonthlyOffDay(day,dayName);
    }
  }
  
  setRepeatedOffDay(){
    this.bizhrs.forEach(x=>{
      if (x.dayType==="Off Day" && x.repeatType=="Weekly"){
        this.setWeeklyOffDay(x.workDate,x.dayName);

      }else if (x.dayType==="Off Day" && x.repeatType=="Monthly"){        
        this.setMonthlyOffDay(x.workDate,x.dayName);
      }else if (x.dayType==="Off Day" && x.repeatType==""){        
       this.addHoliday(x.workDate);
      }
    });
  }

  setWeeklyOffDay(day:Date,dayName:string){
    let dayNum = 7;
    var ontheday = moment().startOf('year').day(dayName);
      if (ontheday.date() > dayNum) ontheday.add(dayNum,'d');
      var month = day.getFullYear();
      while(month === ontheday.year()){
          this.addHoliday(ontheday.toDate());
          ontheday.add(dayNum,'d');
    }
  }

  setMonthlyOffDay(day:Date,dayName:string){
    let dayNum = +dayName;
    let year = day.getFullYear();
    for (let i = 0; i < 12; i++) {
        this.addHoliday(moment().year(year)
                                .month(i)
                                .date(dayNum)
                                .toDate()
                        );
    }    
  }
  
  onDelete(data:BizHour){
     let index = this.bizhrs.findIndex(x=>x.workDate==data.workDate);
     if (index>-1){
       this.removeHoliday(data.workDate);
       this.bizhrs.splice(index,1);
     }
  }
  
  SaveBizHours(){
    this.prepareBizHourDataForUpload();
    console.log(this.bizhrs);
    this.apiser.saveBizHours(this.bizhrs)
               .subscribe(resp=>{
                if (resp.ok == "yes") {
                  //this.errmsg = "Successfully Save item.";
                  this.translate.get('save.success').subscribe((res: string) => {
                     notify(res,"success", 1200);
                  });
                 
                } else {
                  this.translate.get('save.fail').subscribe((res: string) => {
                    notify(res,"error", 1200);
                 });
                }
               });
  }

  CancelBizHours(){
    console.log('back to home');
    this.route.navigate(['./home']);
  }
  prepareBizHourDataForUpload(){
     let user:UserInfo = this.auth.getUserInfo();
      this.bizhrs.forEach(x=>{
         if (x.id==-1){
            x.country = user.country;
            x.state = user.state;
            x.city= user.city==null?"":user.city;
            x.area = user.area;
            x.companyCode = user.companyCode;
            x.branchCode= user.branchCode;
            x.location = user.location;
            x.createBy = user.name;
            x.createDate = new Date();
            x.updateDate = null;           
         }
      });
  }
}