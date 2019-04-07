import { Injectable } from '@angular/core';
import * as AWSCognito from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class CognitoServiceService {

    _POOL_DATA = {
        UserPoolId: 'ap-southeast-2_IY6zAveNv',
        ClientId: 'dfspm7ich3btospn80rsigog0'
    };

  constructor() { }

    signUp(email, password, given_name, family_name, phone_number) {
        return new Promise((resolved, reject) => {
            const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

            const userAttribute = [];
            userAttribute.push(
                new AWSCognito.CognitoUserAttribute({ Name: 'email', Value: email }),
                new AWSCognito.CognitoUserAttribute({ Name: 'given_name', Value: given_name }),
                new AWSCognito.CognitoUserAttribute({ Name: 'family_name', Value: family_name }),
                new AWSCognito.CognitoUserAttribute({ Name: 'phone_number', Value: phone_number })
            );

            userPool.signUp(email, password, userAttribute, null, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolved(result);
                }
            });
        });
    }


    confirmUser(verificationCode, userName) {
        return new Promise((resolved, reject) => {
            const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

            const cognitoUser = new AWSCognito.CognitoUser({
                Username: userName,
                Pool: userPool
            });

            cognitoUser.confirmRegistration(verificationCode, true, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolved(result);
                }
            });
        });
    }


    authenticate(email, password) {
        return new Promise((resolved, reject) => {
            const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

            const authDetails = new AWSCognito.AuthenticationDetails({
                Username: email,
                Password: password
            });

            const cognitoUser = new AWSCognito.CognitoUser({
                Username: email,
                Pool: userPool
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: result => {
                    resolved(result);
                },
                onFailure: err => {
                    reject(err);
                },
                newPasswordRequired: userAttributes => {
                    // User was signed up by an admin and must provide new
                    // password and required attributes, if any, to complete
                    // authentication.

                    // the api doesn't accept this field back
                    userAttributes.email = email;
                    delete userAttributes.email_verified;

                    cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
                        onSuccess: function(result) {},
                        onFailure: function(error) {
                            reject(error);
                        }
                    });
                }
            });
        });
    }


    resendEmailConfirmationCode(userName){
        return new Promise((resolved, reject) => {
            const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

            const cognitoUser = new AWSCognito.CognitoUser({
                Username: userName,
                Pool: userPool
            });

            cognitoUser.resendConfirmationCode(function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolved(result);
                }
            });
        });
    }


    forgetPsw(userName){
        return new Promise((resolved, reject) => {
            const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
            const cognitoUser = new AWSCognito.CognitoUser({
                Username: userName,
                Pool: userPool
            });
            cognitoUser.forgotPassword({
                onSuccess: function (data) {
                    // successfully initiated reset password request
                    console.log('CodeDeliveryData from forgotPassword: ' + data);
                },
                onFailure: function(err) {
                    alert(err.message || JSON.stringify(err));
                }
            });
        });
    }

    resetPsw(userName,verificationCode,newPassword){
        const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
        const cognitoUser = new AWSCognito.CognitoUser({
            Username: userName,
            Pool: userPool
        });
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess() {
                console.log('Password confirmed!');
            },
            onFailure: function(err) {
                console.log('Password not confirmed!');
                console.log(err);
            }
        });
    }
}
