import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
// import {Data} from "../../providers/data";
import {Observable, Subscription} from 'rxjs';
import {QuizService} from '../../services/api/quiz.service';
import {vragenModel} from '../../models/vragenModel';

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

  constructor(public navCtrl: NavController, public quizService: QuizService) {

  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {

    this.quizSub = this.quizService.getquiz(1).subscribe(data => {
      this.aantalVragen = data.length;
      // data.map((question) => {
      //   let originalOrder = question.antwoord;
      //   question.antwoord = this.randomizeAnswers(originalOrder);
      //   return question;
      // });
      this.questions = data;
    });

  }

  ionViewWillLeave() {
    this.quizSub.unsubscribe();
    this.postQuizSub.unsubscribe();
  };

  // this.dataService.load().then((data) => {
  //   this.aantalVragen = data.length;
  //   data.map((question) => {
  //     let originalOrder = question.answers;
  //     question.answers = this.randomizeAnswers(originalOrder);
  //     return question;
  //   });
  //   this.questions = data;
  // });

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

    let request =
      {
        'aflevering' : question.aflevering,
        'antwoordId': answer.id,
        'vragenId': question.id,

      };
    this.postQuizSub = this.quizService.saveAnswer(request).subscribe(response => {
      console.log(response)
    });

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
