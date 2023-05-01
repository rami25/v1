import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group, User } from '@roomv1/shared';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';

@Component({
  selector: 'app-open-group',
  templateUrl: './open-group.component.html',
  styleUrls: ['./open-group.component.css']
})
export class OpenGroupComponent implements OnInit{

  group! : Group
  users : User[] = []
  constructor(private route: ActivatedRoute,
              private _groupService : GroupService,
              private _auth : AuthService){}
  ngOnInit(){
    this.route.params.subscribe(params => {
      const groupId = params['id'];
      this._groupService.openGroup(groupId).subscribe(
        res =>{
          this.group = res.group
          this.listGroupUsers()
        }
      )
    });
  }

  listGroupUsers(){
    for(let userId of this.group.usersId!){
      this._auth.openUser(userId.toString()).subscribe(
        res => {
          this.users.push(res.user)
        },
        err => alert(err.message)
      )
    }
  }

}
