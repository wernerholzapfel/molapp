import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../services/auth/auth.service';
import {HomePage} from "../pages/homepage/homepage";
import Auth0Cordova from '@auth0/cordova';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AuthApp {
  rootPage = HomePage;

  constructor(platform: Platform, private auth: AuthService, statusBar: StatusBar) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // Schedule a token refresh on app start up
      auth.startupTokenRefresh();
      statusBar.styleDefault();

      (<any>window).handleOpenURL = (url) => {
        Auth0Cordova.onRedirectUri(url);
      };

      // OneSignal Code start:
      // Enable to debug issues:
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      let notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

      window["plugins"].OneSignal
        .startInit("798e58d5-586c-4b03-90e6-72adacc8b22f") // todo "YOUR_GOOGLE_PROJECT_NUMBER_IF_ANDROID"
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
    });
  }
}
