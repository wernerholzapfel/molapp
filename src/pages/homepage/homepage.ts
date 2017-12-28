import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Quizpage} from '../quiz/quiz';
import {TotaalstandPage} from '../totaalstand/totaalstand';
import {MolvoorspellingPage} from '../molvoorspelling/molvoorspelling';
import {ProfilePage} from '../profile/profile';
import {AuthService} from '../../services/auth/auth.service';
import {QuizpuntenPage} from '../quizpunten/quizpunten';
import {IntroPage} from '../intro/intro';
import {Subscription} from 'rxjs/Subscription';
import {MollenService} from '../../services/api/mollen.service';
import {actieModel} from '../../models/actieModel';
import {ActiesService} from '../../services/api/acties.service';

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
  actieSub: Subscription;
  acties: actieModel;

  constructor(public auth: AuthService, public navCtrl: NavController, private actieService: ActiesService) {
  }

  ionViewDidLoad() {
    console.log('Hello HomePage Page');
  }

  ionViewWillEnter() {
    this.actieSub = this.actieService.getActies().subscribe(response => {
      this.acties = response;
    });
  }

  ionViewWillLeave() {
    this.actieSub.unsubscribe()
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

  openProfile() {
    this.navCtrl.push(ProfilePage)
  }

  openQuizPunten() {
    this.navCtrl.push(QuizpuntenPage)
  }

  openIntro() {
    this.navCtrl.push(IntroPage)
  }
}
