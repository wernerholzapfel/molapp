import {Injectable, NgZone} from '@angular/core';
import {Storage} from '@ionic/storage';

import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';
import {tokenNotExpired} from 'angular2-jwt';
import {deelnemerModel} from '../../models/deelnemerModel';
import {DeelnemersService} from '../api/deelnemers.service';

const auth0Config = {
  // needed for auth0
  clientID: 'EiV9guRsd4g8R360ifx3nkIhdc1iezQD',
  // clientID: 'WNjXlR4ChTqf2azaWhPk4MPzViNqoQft',

  // needed for auth0cordova
  // clientId: 'WNjXlR4ChTqf2azaWhPk4MPzViNqoQft',
  clientId: 'EiV9guRsd4g8R360ifx3nkIhdc1iezQD',
  domain: 'werner.eu.auth0.com',
  callbackURL: location.href,
  packageIdentifier: 'com.wernerholzapfel.mollotenapp'
};

@Injectable()
export class AuthService {
  storage: Storage = new Storage({});
  auth0 = new Auth0.WebAuth(auth0Config);
  accessToken: string;
  idToken: string;
  user: any;

  constructor(public zone: NgZone, public deelnemersService: DeelnemersService) {
    this.storage.get('profile').then(profile => {
      this.user = profile;
    }).catch(error => {
      console.log(error);
    });

    this.storage.get('id_token').then(token => {
      this.idToken = token;
    });
  }

  private setStorageVariable(name, data) {
    console.log('set storage: ' + name + '-' + data);
    window.localStorage.setItem(name, JSON.stringify(data));
    this.storage.set(name, data);
  }

  private setIdToken(token) {
    this.idToken = token;
    this.setStorageVariable('id_token', token);
  }

  private setAccessToken(token) {
    this.accessToken = token;
    this.setStorageVariable('access_token', token);
  }

  public isAuthenticated() {
    return tokenNotExpired('id_token', this.idToken);
  }

  public login() {
    const client = new Auth0Cordova(auth0Config);

    const options = {
      scope: 'openid profile offline_access',
      allowSignUp: true,
      allowedConnections: ['Username-Password-Authentication', 'facebook', 'google-oauth2'],
      rememberLastLogin: false,
      primaryColor: '#9fc5c6',
      logo: '',
      title: 'Molloten App'
    };

    client.authorize(options, (err, authResult) => {
      if (err) {
        throw err;
      }

      this.setIdToken(authResult.idToken);
      this.setAccessToken(authResult.accessToken);

      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.setStorageVariable('expires_at', expiresAt);

      this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
        if (err) {
          throw err;
        }
        // profile.user_metadata = profile.user_metadata || {};
        this.setStorageVariable('profile', profile);
        this.zone.run(() => {
          this.user = profile;
        });
        // create deelnemer if new
        this.deelnemersService.savedeelnemer(<deelnemerModel>{
          // TODO save displayname.
          display_name: (profile.user_metadata && profile.user_metadata.naam) ? profile.user_metadata.naam : profile.name,
          // display_name: profile.nickname,
          email: profile.email,
          auth0Identifier: profile.user_id
        }).subscribe(response => {
          console.log(response);
          window["plugins"].OneSignal.sendTag("name", response.display_name);
        });
      });
    });
  }

  public logout() {
    this.storage.remove('profile');
    this.storage.remove('access_token');
    this.storage.remove('id_token');
    this.storage.remove('expires_at');

    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');

    this.idToken = null;
    this.accessToken = null;
    this.user = null;
  }

}


///////////<<<<<<<<<<<<>>>>>>>>>>>>>>
//
// import {Storage} from "@ionic/storage";
// import {AuthHttp, JwtHelper, tokenNotExpired} from "angular2-jwt";
// import {Injectable, NgZone} from "@angular/core";
// import { Observable } from "rxjs/Observable";
// import {DeelnemersService} from '../api/deelnemers.service';
// import {deelnemerModel} from '../../models/deelnemerModel';
// // import {HomePage} from "../../pages/home/home";
//
// // Avoid name not found warnings
// declare let auth0: any;
// declare let Auth0Lock: any;
//
//
// @Injectable()
// export class AuthService {
//
//   jwtHelper: JwtHelper = new JwtHelper();
//   auth0 = new auth0.WebAuth({clientID: 'WNjXlR4ChTqf2azaWhPk4MPzViNqoQft', domain: 'werner.eu.auth0.com'});
//   lock = new Auth0Lock('WNjXlR4ChTqf2azaWhPk4MPzViNqoQft', 'werner.eu.auth0.com', {
//     allowSignUp: true,
//     allowedConnections: ["Username-Password-Authentication"], //"facebook","google-oauth2"
//     rememberLastLogin: false,
//     auth: {
//       redirect: false,
//       sso: false,
//       params: {
//         scope: 'openid offline_access',
//         device: "mobile device"
//       }
//     },
//     theme: {
//       logo: '',
//       primaryColor: "#9fc5c6"
//     },
//     languageDictionary: {
//       emailInputPlaceholder: "please enter you email",
//       title: "Molloten App"
//     },
//     additionalSignUpFields: [{
//       name: "naam",
//       placeholder: "Je naam",
//       // The following properties are optional
//       icon: "https://example.com/assests/address_icon.png",
//       validator: function(name) {
//         return {
//           valid: name.length >= 3,
//           hint: "Naam moet minimaal 3 tekens hebben." // optional
//         };
//       }
//     }]
//   });
//
//   storage: Storage = new Storage({});
//   refreshSubscription: any;
//   user: any;
//   zoneImpl: NgZone;
//   idToken: string;
//
//   constructor(private authHttp: AuthHttp, zone: NgZone, private deelnemerService: DeelnemersService) {
//     this.zoneImpl = zone;
//     // Check if there is a profile saved in local storage
//     this.storage.get('profile').then(profile => {
//       this.user = JSON.parse(profile);
//     }).catch(error => {
//       console.log(error);
//     });
//
//     this.storage.get('id_token').then(token => {
//       this.idToken = token;
//     });
//
//     this.lock.on('authenticated', authResult => {
//       this.storage.set('id_token', authResult.idToken);
//       this.idToken = authResult.idToken;
//
//       // Fetch profile information
//       this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
//
//         if (error) {
//           console.log("error in getprofile")
//           // Handle error
//           alert(error);
//           return;
//         }
//
//         profile.user_metadata = profile.user_metadata || {};
//         this.storage.set('profile', JSON.stringify(profile));
//         this.user = profile;
//         console.log(profile);
//
//         // create deelnemer if new
//         this.deelnemerService.savedeelnemer(<deelnemerModel>{
//           display_name: this.user.user_metadata.naam ? this.user.user_metadata.naam : this.user.nickname,
//           email: this.user.email,
//           auth0Identifier: this.user.user_id
//         }).subscribe(response => {
//           console.log(response);
//         });
//       });
//
//       this.lock.hide();
//
//       this.storage.set('refresh_token', authResult.refreshToken);
//       this.zoneImpl.run(() => this.user = authResult.profile);
//
//       // Schedule a token refresh
//       this.scheduleRefresh();
//
//     });
//   }
//
//   public scheduleRefresh() {
//     // If the user is authenticated, use the token stream
//     // provided by angular2-jwt and flatMap the token
//
//     let source = Observable.of(this.idToken).flatMap(
//       token => {
//         console.log('token here', token);
//         // The delay to generate in this case is the difference
//         // between the expiry time and the issued at time
//         let jwtIat = this.jwtHelper.decodeToken(token).iat;
//         let jwtExp = this.jwtHelper.decodeToken(token).exp;
//         let iat = new Date(0);
//         let exp = new Date(0);
//
//         let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));
//
//         return Observable.interval(delay);
//       });
//
//     this.refreshSubscription = source.subscribe(() => {
//       this.getNewJwt();
//     });
//   }
//
//   public startupTokenRefresh() {
//     // If the user is authenticated, use the token stream
//     // provided by angular2-jwt and flatMap the token
//     if (this.isAuthenticated()) {
//       let source = Observable.of(this.idToken).flatMap(
//         token => {
//           // Get the expiry time to generate
//           // a delay in milliseconds
//           let now: number = new Date().valueOf();
//           let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
//           let exp: Date = new Date(0);
//           exp.setUTCSeconds(jwtExp);
//           let delay: number = exp.valueOf() - now;
//
//           // Use the delay in a timer to
//           // run the refresh at the proper time
//           return Observable.timer(delay);
//         });
//
//       // Once the delay time from above is
//       // reached, get a new JWT and schedule
//       // additional refreshes
//       source.subscribe(() => {
//         this.getNewJwt();
//         this.scheduleRefresh();
//       });
//     }
//   }
//
//   public unscheduleRefresh() {
//     // Unsubscribe fromt the refresh
//     if (this.refreshSubscription) {
//       this.refreshSubscription.unsubscribe();
//     }
//   }
//
//   public getNewJwt() {
//     // Get a new JWT from Auth0 using the refresh token saved
//     // in local storage
//     this.storage.get('refresh_token').then(token => {
//       this.auth0.refreshToken(token, (err, delegationRequest) => {
//         if (err) {
//           alert(err);
//         }
//         this.storage.set('id_token', delegationRequest.id_token);
//         this.idToken = delegationRequest.id_token;
//       });
//     }).catch(error => {
//       console.log(error);
//     });
//
//   }
//
//   public isAuthenticated() {
//     return tokenNotExpired('id_token', this.idToken);
//   }
//
//   public login() {
//     // Show the Auth0 Lock widget
//     this.lock.show();
//   }
//
//   public logout() {
//     this.storage.remove('profile');
//     this.storage.remove('id_token');
//     this.idToken = null;
//     this.storage.remove('refresh_token');
//     this.zoneImpl.run(() => this.user = null);
//     // Unschedule the token refresh
//     this.unscheduleRefresh();
//   }
// }
