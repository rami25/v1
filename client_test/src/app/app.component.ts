import { Component, OnInit } from '@angular/core';
import { TestService } from './test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public elements:string[];
  ngOnInit(): void {
  }
  constructor(private serve : TestService){
    this.elements = this.serve.getElements();
  }
  getLength(){ return this.elements.length }
}
