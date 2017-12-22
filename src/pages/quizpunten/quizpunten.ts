import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {QuizService} from '../../services/api/quiz.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../services/auth/auth.service';
import {Quizpage} from '../quiz/quiz';
import {MollenService} from '../../services/api/mollen.service';

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
  quizResultsSub: Subscription;
  afleveringSub: Subscription;
  quizpunten: any;
  quizAntwoorden: any;
  isLaatsteAflevering: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth: AuthService,
              public quizService: QuizService,
              private mollenService: MollenService) {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.afleveringSub = this.mollenService.getCurrentAflevering().subscribe(currentAflevering => {
      this.isLaatsteAflevering = currentAflevering.laatseAflevering;
    });
    this.quizResultsSub = this.quizService.getanswers().subscribe(response => {
      this.quizAntwoorden = response;
    });

    this.quizPuntenSub = this.quizService.getquizresultaat().subscribe(response => {
      this.quizpunten = response;
      this.isLoading = false;
    })
  }

  ionViewWillLeave() {
    this.quizPuntenSub.unsubscribe();
    this.quizResultsSub.unsubscribe();
    this.afleveringSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuizpuntenPage');
  }

  goToQuiz() {
    this.navCtrl.push(Quizpage);
  }
}
