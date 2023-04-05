import { User } from '@roomv1/shared'
import { Component } from '@angular/core';
import { TestService } from './services/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User = {
    userName : 'rami',
    email : 'fsdfsd',
    password : 'fdsfs',
    createdAt : new Date()
  }
  elements: string[];
  constructor(private service : TestService){
    this.elements = this.service.getElements()
  }
  getLength(){
    return this.elements.length
  }
}
