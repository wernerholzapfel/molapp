import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {QuizService} from '../../services/api/quiz.service';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../services/auth/auth.service';
import {Quizpage} from '../quiz/quiz';
import {MollenService} from '../../services/api/mollen.service';
import {actieModel} from '../../models/actieModel';
import {ActiesService} from '../../services/api/acties.service';

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
  actieSub: Subscription;
  quizpunten: any;
  quizAntwoorden: any;
  acties: actieModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth: AuthService,
              public quizService: QuizService,
              private actieService: ActiesService) {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.actieSub = this.actieService.getActies().subscribe(response => {
      this.acties = response;
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
    this.actieSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuizpuntenPage');
  }

  goToQuiz() {
    this.navCtrl.push(Quizpage);
  }
}
