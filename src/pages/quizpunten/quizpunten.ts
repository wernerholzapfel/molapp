import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {QuizService} from '../../services/api/quiz.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../services/auth/auth.service';

/**
 * Generated class for the QuizpuntenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-quizpunten',
  templateUrl: 'quizpunten.html',
})
export class QuizpuntenPage {
  isLoading: boolean;
  quizPuntenSub: Subscription;
  quizpunten: any

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth: AuthService,
              public quizService: QuizService) {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.quizPuntenSub = this.quizService.getquizresultaat().subscribe(response => {
      this.quizpunten = response;
      this.isLoading = false;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuizpuntenPage');
  }

}
