import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Subscription} from 'rxjs';
import {Observable} from 'rxjs'
import {QuizService} from '../../services/api/quiz.service';
import {vragenModel} from '../../models/vragenModel';
import {deelnemer} from '../../models/molvoorspelling';
import {DeelnemersService} from '../../services/api/deelnemers.service';
import {deelnemerModel} from '../../models/deelnemerModel';
import {MollenService} from '../../services/api/mollen.service';

@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html'
})
export class Quizpage {
  @ViewChild('slides') slides: any;
  countdown: any;
  timer: Subscription;
  score: number = 0;
  aantalVragen: number;
  actieveVraag: number = 1;
  questions: vragenModel[];
  quizSub: Subscription;
  postQuizSub: Subscription;
  answer: any;
  deelnemerSub: Subscription;
  deelnemer: deelnemerModel;
  laatsteaflevering: number = 0;


  constructor(public navCtrl: NavController, public quizService: QuizService,
              private deelnemersService: DeelnemersService,
              private mollenService: MollenService,
  ) {

  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {

    this.mollenService.getLaatsteAflevering().subscribe(response => {
      this.laatsteaflevering = response.aflevering-1;
      this.quizSub = this.quizService.getquiz(this.laatsteaflevering).subscribe(vragen => {
        this.aantalVragen = vragen.length;
        this.questions = vragen;
      });
    });

    this.deelnemerSub = this.deelnemersService.getdeelnemer().subscribe(response => {
      this.deelnemer = response;
    });


  }

  ionViewWillLeave() {
    this.quizSub.unsubscribe();
    this.deelnemerSub.unsubscribe();
  };

  nextSlide(actieveVraag?) {
    this.slides.slideNext();
    if (this.actieveVraag <= this.aantalVragen) {
      //if countdown is changed also change   animation: countdown 10s linear infinite forwards; in quiz.scss
      this.countdown = 10;

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

        this.nextSlide(this.actieveVraag++);
      });
    }
  }


  goBack() {
    this.navCtrl.pop();
  }

  selectAnswer(answer, question) {
    console.log('antwoord: ' + answer);
    console.log('question: ' + question);

    let request = {
      'aflevering': question.aflevering,
      'antwoord': {id: answer.id},
      'vraag': {id: question.id},
      'deelnemer': {id: this.deelnemer.id},
    };

    this.postQuizSub = this.quizService.saveAnswer(request).subscribe(response => {
      console.log(response);
      this.postQuizSub.unsubscribe();
    }, (err => {
      console.log(err);
      this.postQuizSub.unsubscribe();
    }));

    this.countdown = 0;
    this.timer.unsubscribe();
    this.countdown = 0;

    this.nextSlide(this.actieveVraag++);
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

  //restart on
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
