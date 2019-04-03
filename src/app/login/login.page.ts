import { Component, OnInit } from '@angular/core';
import { CognitoServiceService } from '../service/cognito-service.service';
import { SignUpPage } from '../sign-up/sign-up.page';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    email: string;
    password: string;
    signUpPage = SignUpPage;

  constructor(public CognitoSerive: CognitoServiceService,
              private router: Router
  ) { }

  ngOnInit() {
  }

    login() {
        this.CognitoSerive.authenticate(this.email, this.password)
            .then(res => {
                console.log(res);
            }, err => {
                console.log(err);
            });
    }

    opensignUpPage() {
        this.router.navigate(['/sign-up']);
    }


}
