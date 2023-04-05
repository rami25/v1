import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }
  getElements () {
    return ['e1', 'e2' , 'e3']
  }
}
