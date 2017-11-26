import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {QuizService} from '../../services/api/quiz.service';
import {vragenModel} from '../../models/vragenModel';
import {DeelnemersService} from '../../services/api/deelnemers.service';
import {deelnemerModel} from '../../models/deelnemerModel';
import {MollenService} from '../../services/api/mollen.service';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/timer'
import 'rxjs/operator/take';
import 'rxjs/operator/timeInterval';
import 'rxjs/operator/pluck';

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
  deelnemerSub: Subscription;
  deelnemer: deelnemerModel;
  quizAntwoorden: any[];
  laatsteaflevering: number = 0;
  showstartscherm: boolean = true;
  showquizscherm: boolean = false;
  showeindscherm: boolean = false;

  constructor(public navCtrl: NavController, public quizService: QuizService,
              private deelnemersService: DeelnemersService,
              private mollenService: MollenService,) {

  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.deelnemerSub = this.deelnemersService.getdeelnemer().subscribe(response => {
      this.deelnemer = response;
    });
  }

  ionViewWillLeave() {
    this.deelnemerSub.unsubscribe();
    this.quizResults ? this.quizResults.unsubscribe() : '';
  };

  nextSlide() {
    this.quizSub = this.quizService.getquiz().subscribe(vraag => {
      this.question = vraag;
      if (this.question.aantalOpenVragen > 0) {
        this.showquizschermFunc();
        //if countdown is changed also change   animation: countdown 10s linear infinite forwards; in quiz.scss
        this.countdown = 100;

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
        this.showquizscherm = false;
        this.showstartscherm = false;
        this.showeindscherm = true;

       this.quizResults = this.quizService.getanswers().subscribe(response => {
          this.quizAntwoorden = response;
          this.aflevering = response[0].aflevering;
        })
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
      this.postQuizSub.unsubscribe();
    }));


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
    this.showquizscherm = true;
    this.showeindscherm = false;
    this.showstartscherm = false
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
