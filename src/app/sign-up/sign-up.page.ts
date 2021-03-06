import { Component, OnInit } from '@angular/core';
import { CognitoServiceService } from '../service/cognito-service.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
    email: string;
    password: string;
    phone_number: number;
    family_name: string;
    given_name: string;

  constructor(public CognitoService: CognitoServiceService,
              public alertController: AlertController) { }

  ngOnInit() {
  }

    register() {
        this.CognitoService.signUp(this.email, this.password, this.given_name, this.family_name, this.phone_number).then(
            res => {
                console.log(res);
                this.promptVerificationCode();
            },
            err => {
                console.log(err);
            }
        );
    }

    async promptVerificationCode() {
        const alert = await this.alertController.create({
            header: 'Enter Verfication Code',
            inputs: [
                {
                    name: 'VerificationCode',
                    placeholder: 'Verification Code'
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
                    text: 'Verify',
                    handler: data => {
                        this.verifyUser(data.VerificationCode);
                    }
                }
            ]
        });
        await alert.present();
    }

    verifyUser(verificationCode) {
        this.CognitoService.confirmUser(verificationCode, this.email).then(
            res => {
                console.log(res);
            },
            err => {
                alert(err.message);
            }
        );
    }

    async promptVerificationCodeButton(){
        const alert = await this.alertController.create({
            header: 'Enter Verfication Email & Code',
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
                        this.email=data.EmailAddress
                        this.CognitoService.resendEmailConfirmationCode(this.email).then(
                            res => {
                                console.log(res);
                                this.promptVerificationCode();
                            },
                            err => {
                                console.log(err);
                            }
                        );
                    }
                }
            ]
        });
        await alert.present();
    }

}
