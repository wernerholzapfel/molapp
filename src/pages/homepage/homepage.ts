import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Quizpage} from "../quiz/quiz";
import {TotaalstandPage} from "../totaalstand/totaalstand";
import {MolvoorspellingPage} from "../molvoorspelling/molvoorspelling";
import {ProfilePage} from "../profile/profile";
import {AuthService} from "../../services/auth/auth.service";
import {QuizpuntenPage} from '../quizpunten/quizpunten';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class HomePage {

  constructor(public auth: AuthService,public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello HomePage Page');
  }

  startQuiz() {
    this.navCtrl.push(Quizpage);
  }
  openStand() {
    this.navCtrl.push(TotaalstandPage);
  }
  openVoorspelling() {
    this.navCtrl.push(MolvoorspellingPage);
  }

  openProfile(){
    this.navCtrl.push(ProfilePage)
  }

  openQuizPunten(){
    this.navCtrl.push(QuizpuntenPage)
  }
}
