import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {



  registerMode = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  registerToggle(){
    this.registerMode = true;
  }


  cancelRegisterMode(register: boolean){
    this.registerMode = register;
  }

}
