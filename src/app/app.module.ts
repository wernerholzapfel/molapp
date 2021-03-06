import {LOCALE_ID, NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {AuthApp} from "./app.component";
import {TabsPage} from "../pages/tabs/tabs";
import {ProfilePage} from "../pages/profile/profile";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth/auth.service";
import {MollenService} from "../services/api/mollen.service";
import {Http} from "@angular/http";
import {IonicStorageModule, Storage} from '@ionic/storage';
import {MollenPage} from "../pages/mollen/mollen";
import {MolvoorspellingPage} from "../pages/molvoorspelling/molvoorspelling";
import {Quizpage} from "../pages/quiz/quiz";
import {Data} from "../providers/data";
import {FlashCardComponent} from "../components/flash-card/flash-card";
import {CarouselComponent} from "../shared/carousel/carousel.component";
import {TotaalstandPage} from "../pages/totaalstand/totaalstand";
import {StandenService} from "../services/api/standen.service";
import {Detailafleveringstand} from "../pages/detailafleveringstand/detailafleveringstand";
import {QuizService} from "../services/api/quiz.service";
import {HomePage} from "../pages/homepage/homepage";
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {StatusBar} from "@ionic-native/status-bar";
import {DeelnemersService} from '../services/api/deelnemers.service';
import {QuizpuntenPage} from '../pages/quizpunten/quizpunten';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {IntroPage} from '../pages/intro/intro';
import {ActiesService} from '../services/api/acties.service';

registerLocaleData(localeNl, 'nl');

let storage: Storage = new Storage({});

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
    MolvoorspellingPage,
    Quizpage,
    QuizpuntenPage,
    TotaalstandPage,
    Detailafleveringstand,
    FlashCardComponent,
    CarouselComponent,
    HomePage,
    IntroPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(AuthApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthApp,
    ProfilePage,
    TabsPage,
    MollenPage,
    MolvoorspellingPage,
    TotaalstandPage,
    Quizpage,
    QuizpuntenPage,
    Detailafleveringstand,
    FlashCardComponent,
    CarouselComponent,
    HomePage,
    IntroPage
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "nl-nl" },
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    MollenService,
    StandenService,
    QuizService,
    Data,
    StatusBar,
    DeelnemersService,
    ActiesService
  ]
})
export class AppModule {
}
