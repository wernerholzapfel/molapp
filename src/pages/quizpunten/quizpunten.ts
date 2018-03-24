import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {QuizService} from '../../services/api/quiz.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../services/auth/auth.service';
import {Quizpage} from '../quiz/quiz';
import {MollenService} from '../../services/api/mollen.service';
import {actieModel} from '../../models/actieModel';
import {ActiesService} from '../../services/api/acties.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'page-quizpunten',
  templateUrl: 'quizpunten.html',
})
export class QuizpuntenPage {
  quizpunten$: Observable<any>;
  quizAntwoorden$: Observable<any>;
  acties$: Observable<actieModel>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth: AuthService,
              public quizService: QuizService,
              private actieService: ActiesService) {
  }

  ionViewWillEnter() {
    this.acties$ = this.actieService.getActies();

    this.quizAntwoorden$ = this.quizService.getanswers();

    this.quizpunten$ = this.quizService.getquizresultaat();
  }

  ionViewWillLeave() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuizpuntenPage');
  }

  goToQuiz() {
    this.navCtrl.push(Quizpage);
  }
}
