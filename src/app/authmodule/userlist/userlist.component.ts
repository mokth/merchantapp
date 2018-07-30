import { AdUser } from './../../shared/model';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AdUserService } from '../services/authservice';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DxDataGridComponent } from 'devextreme-angular';
import { faPlusSquare,faEdit,faTrashAlt,faSave } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  
  userForm: FormGroup;
  userlist:AdUser[]=[];
  user:AdUser;
  roles:string[]=['Admin','User'];
  title:string;
  editMode:boolean;
  errmsg:string;
  isSmallScreen: boolean;
  mobHeight: any;
  mobWidth: any;
  faAdd = faPlusSquare;
  faEdit = faEdit;
  faDelete = faTrashAlt;
  faSave =faSave;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  
  constructor(private router:Router,
    private route:ActivatedRoute,
    private apiserv:AdUserService,
    private auth:AuthService, 
    private http:HttpClient,   
    private formBuilder: FormBuilder,         
    @Inject('API_URL') private apiUrl:string ) {
      this.mobHeight = window.innerHeight;
      this.mobWidth = window.innerWidth;
      if (this.mobWidth < 500) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }
    }
  
  ngOnInit() {
    this.createFormControls();
    this.apiserv.getUsers()
      .subscribe(resp=>{
        console.log(resp);
        this.userlist =resp;
      });
  }
  
  createFormControls(){
    this.userForm = this.formBuilder.group({
      email : new FormControl('',[Validators.required,Validators.email]),
      name: new FormControl('',Validators.required),
      role: new FormControl('User',Validators.required),  
      status: new FormControl('true',Validators.required),   
    });
  }

  binduserFormControl(user:AdUser){
    this.userForm.get('email').setValue(user.id);
    this.userForm.get('name').setValue(user.name);
    this.userForm.get('role').setValue(user.role);
    this.userForm.get('status').setValue(user.active);
  }

 getUserFormControl(){
   this.user.id= this.userForm.get('email').value;
   this.user.name= this.userForm.get('name').value;
   this.user.role= this.userForm.get('role').value;
   this.user.active= this.userForm.get('status').value;
  }

  onEditItem(data:AdUser){
    this.errmsg ="";
    this.user = data;
    this.title="Edit User";
    this.editMode =true;
    this.binduserFormControl(data);
    $('#myModel').click();
  }

  onNewItem(){ 
    this.errmsg ="";
    this.user = new AdUser();
    this.editMode =false;
    this.title="New User";
    this.userForm.reset();
    $('#myModel').click();
  }

  onDeleteItem(d){
    
  }

  SaveUser(){
    this.getUserFormControl();
    if (this.editMode){
      this.SaveExistingUser();
    }else {
      this.user.pWord ="12345" ;//default but need to change when login 
      this.SaveNewUser();
    }
  }

  SaveExistingUser(){
    console.log(this.user);
    this.apiserv.saveUser(this.user)
    .subscribe(resp=>{
       if (resp.ok=="yes"){
        this.errmsg ="Succesfully saved changes.";
        this.updateAndResetData();
       }else{
        this.errmsg = resp.error;
       }      
    });
  }

  SaveNewUser(){
    this.apiserv.saveNewUser(this.user)
    .subscribe(resp=>{
       if (resp.ok=="yes"){
        this.errmsg ="Succesfully saved changes.";
        this.updateAndResetData();       
       }else{
        this.errmsg = resp.error;
       }      
    });
  }

  updateAndResetData(){
    this.userForm.reset();
    this.dataGrid.instance.refresh();
  }
}
