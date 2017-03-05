import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {AuthApp} from "./app.component";
import {TabsPage} from "../pages/tabs/tabs";
import {ProfilePage} from "../pages/profile/profile";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth/auth.service";
import {MollenService} from "../services/api/mollen.service";
import {Http} from "@angular/http";
import {Storage} from "@ionic/storage";
import {MollenPage} from "../pages/mollen/mollen";
import {MolvoorspellingPage} from "../pages/molvoorspelling/molvoorspelling";

let storage: Storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    AuthApp,
    ProfilePage,
    TabsPage,
    MollenPage,
    MolvoorspellingPage
  ],
  imports: [
    IonicModule.forRoot(AuthApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthApp,
    ProfilePage,
    TabsPage,
    MollenPage,
    MolvoorspellingPage
  ],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    MollenService
  ]
})
export class AppModule {
}