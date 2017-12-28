import {Component, ViewChild} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {QuizService} from '../../services/api/quiz.service';
import {DeelnemersService} from '../../services/api/deelnemers.service';
import {deelnemerModel} from '../../models/deelnemerModel';
import {MollenService} from '../../services/api/mollen.service';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/timer'
import 'rxjs/operator/take';
import 'rxjs/operator/timeInterval';
import 'rxjs/operator/pluck';
import {ActiesService} from '../../services/api/acties.service';
import {actieModel} from '../../models/actieModel';

@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html'
})
export class Quizpage {
  @ViewChild('slides') slides: any;
  countdown: any;
  timer: any;
  score: number = 0;
  aflevering: number;
  question: any;
  quizSub: Subscription;
  postQuizSub: Subscription;
  quizResults: Subscription;
  answer: any;
  laatsteAfleveringSub: Subscription;
  currentAfleveringSub: Subscription;
  deelnemerSub: Subscription;
  deelnemer: deelnemerModel;
  quizAntwoorden: any[];
  laatsteaflevering: number = 0;
  showstartscherm: boolean = false;
  showeindeseizoenscherm: boolean = false;
  showquizscherm: boolean = false;
  showeindscherm: boolean = false;
  showgeenquizscherm: boolean = false;
  isLoading: boolean;
  actieSub: Subscription;
  acties: actieModel;
  constructor(public navCtrl: NavController, public quizService: QuizService,
              private deelnemersService: DeelnemersService,
              private actieService: ActiesService,
              public toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.deelnemerSub = this.deelnemersService.getdeelnemer().subscribe(response => {
      this.deelnemer = response;
    });

    this.actieSub = this.actieService.getActies().subscribe(response => {
      this.acties = response;
      switch (true) {
        case (this.acties.testaflevering === 0):
          this.showgeenquizschermFunc();
          break;
        case (this.acties.testaflevering === null):
          console.log('testaflevering is null');
          this.showeindeseizoenschermFunc();
          break;
        default:
          this.showstartscherm = true;
          break;
      }
    });
    this.isLoading = false;
  }

  ionViewWillLeave() {
    this.deelnemerSub.unsubscribe();
    this.actieSub.unsubscribe();
    this.quizResults ? this.quizResults.unsubscribe() : '';
  };

  nextSlide() {
    this.isLoading = true;
    this.showquizscherm = false;
    this.quizSub = this.quizService.getquiz().subscribe(vraag => {
      this.question = vraag;
      if (this.question.aantalOpenVragen > 0) {
        this.showquizschermFunc();
        //if countdown is changed also change   animation: countdown 10s linear infinite forwards; in quiz.scss
        this.countdown = 20;

        let source = Observable.timer(1000, 1000)
          .timeInterval()
          .pluck('interval')
          .take(this.countdown);

        this.timer = source.subscribe((x) => {
          this.countdown--;
        }, (err) => {
          console.log('Error: ' + err);
        }, () => {
          console.log('next slide');
          this.selectAnswer(null, this.question);
          this.question = null;
        })
      }
      else {
        this.showeindschermFunc();
      }
    });
  }


  goBack() {
    this.navCtrl.pop();
  }

  selectAnswer(answer, question) {
    console.log('antwoord: ' + answer);
    console.log('question: ' + question);

    let request: any = {
      'aflevering': question.aflevering,
      'vraag': {id: question.id},
      'deelnemer': {id: this.deelnemer.id},
      'antwoord': null,
    };

    if (answer) {
      request.antwoord = {id: answer.id};
    }

    this.postQuizSub = this.quizService.saveAnswer(request).subscribe(response => {
      console.log(response);
      this.postQuizSub.unsubscribe();
      this.timer.unsubscribe();
      this.countdown = 0;
      this.nextSlide();
    }, (err => {
      console.log(err);
      this.presentToast('er is iets misgegaan start de quiz opnieuw.');
      this.postQuizSub.unsubscribe();
      this.showstartschermFunc();
    }));
  }


  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 6000,
      dismissOnPageChange: false,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'OK'
    });
    toast.present();
  }

  randomizeAnswers(rawAnswers: any[]): any[] {

    for (let i = rawAnswers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = rawAnswers[i];
      rawAnswers[i] = rawAnswers[j];
      rawAnswers[j] = temp;
    }

    return rawAnswers;

  }

  showquizschermFunc() {
    this.isLoading = false;
    this.showquizscherm = true;
    this.showeindscherm = false;
    this.showstartscherm = false;
    this.showgeenquizscherm = false;
    this.showeindeseizoenscherm = false;
  }

  showstartschermFunc() {
    this.isLoading = false;
    this.showquizscherm = false;
    this.showeindscherm = false;
    this.showstartscherm = true;
    this.showgeenquizscherm = false;
    this.showeindeseizoenscherm = false;
  }

  showgeenquizschermFunc() {
    this.isLoading = false;
    this.showquizscherm = false;
    this.showeindscherm = false;
    this.showstartscherm = false;
    this.showgeenquizscherm = true;
    this.showeindeseizoenscherm = false;
  }

  showeindeseizoenschermFunc() {
    this.isLoading = false;
    this.showquizscherm = false;
    this.showeindscherm = false;
    this.showstartscherm = false;
    this.showgeenquizscherm = false;
    this.showeindeseizoenscherm = true
  }

  showeindschermFunc() {
    this.isLoading = false;
    this.showquizscherm = false;
    this.showstartscherm = false;
    this.showeindscherm = true;
    this.showgeenquizscherm = false;
    this.showeindeseizoenscherm = false;

    this.quizResults = this.quizService.getanswers().subscribe(response => {
      this.quizAntwoorden = response;
      window["plugins"].OneSignal.sendTag("laatstIngevuldeTest", response[0].aflevering);
      this.aflevering = response[0].aflevering;
    })
  }

  // restart on
  // restartQuiz() {
  //   this.actieveVraag = 1;
  //   this.score = 0;
  //   this.slides.slideTo(1, 1000);
  //   this.timer = TimerObservable
  //     .interval(1000 /* ms */)
  //     .timeInterval()
  //     .take(this.countdown)
  //     .subscribe(() => {
  //       this.countdown--;
  //       console.log(this.timer);
  //     }, () => {
  //       // error
  //     }, () => {
  //       console.log("next slide");
  //       this.timer.unsubscribe();
  //       this.nextSlide(this.actieveVraag);
  //     });
  // }
}
