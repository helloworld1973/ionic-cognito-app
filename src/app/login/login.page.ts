import { Component, OnInit } from '@angular/core';
import { CognitoServiceService } from '../service/cognito-service.service';
import { SignUpPage } from '../sign-up/sign-up.page';
import {Router} from '@angular/router';
import { AlertController } from '@ionic/angular';

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
              private router: Router,
              public alertController: AlertController
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

    async openforgetPswStep1(){
        const alert = await this.alertController.create({
            header: 'Email Address',
            inputs: [
                {
                    name: 'EmailAddress',
                    placeholder: 'Email Address'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Continue',
                    handler: data => {
                        this.email = data.EmailAddress;
                        this.CognitoSerive.forgetPsw(this.email)
                        this.openforgetPswStep2();
                    }
                }
            ]
        });
        await alert.present();
    }


    async openforgetPswStep2(){
        const alert = await this.alertController.create({
            header: 'Reset Password',
            inputs: [
                {
                    name: 'verificationCode',
                    placeholder: 'Verification Code'
                },
                {
                    name: 'newPwd',
                    placeholder: 'New Password'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Reset',
                    handler: data => {
                        this.CognitoSerive.resetPsw(this.email, data.verificationCode, data.newPwd);
                    }
                }
            ]
        });
        await alert.present();
    }



}
