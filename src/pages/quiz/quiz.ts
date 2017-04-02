import {Component, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {Data} from "../../providers/data";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs";


/*
 Generated class for the Quiz page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
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
  slideOptions: any;
  questions: any;

  constructor(public navCtrl: NavController, public dataService: Data) {

    this.slideOptions = {
      onlyExternal: true
    };
  }

  ionViewDidLoad() {

    this.dataService.load().then((data) => {
      this.aantalVragen = data.length;
      data.map((question) => {
        let originalOrder = question.answers;
        question.answers = this.randomizeAnswers(originalOrder);
        return question;
      });
      this.questions = data;
    });
  }

  nextSlide(actieveVraag) {
    this.slides.slideNext();
    if (this.actieveVraag <= this.aantalVragen) {
      //if countdown is changed also change   animation: countdown 10s linear infinite forwards; in quiz.scss
      this.countdown = 10;
      this.timer = TimerObservable
        .interval(1000 /* ms */)
        .timeInterval()
        .take(this.countdown)
        .subscribe(() => {
          this.countdown--;
          console.log(this.timer);
        }, () => {
          // error
        }, () => {
          console.log("next slide");
          this.timer.unsubscribe();
          this.nextSlide(this.actieveVraag++);
        });
    }
  }

  selectAnswer(answer, question) {
    if (answer.correct) {
      this.score++;
    }

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
  restartQuiz() {
    this.actieveVraag = 1;
    this.score = 0;
    this.slides.slideTo(1, 1000);
    this.timer = TimerObservable
      .interval(1000 /* ms */)
      .timeInterval()
      .take(this.countdown)
      .subscribe(() => {
        this.countdown--;
        console.log(this.timer);
      }, () => {
        // error
      }, () => {
        console.log("next slide");
        this.timer.unsubscribe();
        this.nextSlide(this.actieveVraag);
      });
  }
}
