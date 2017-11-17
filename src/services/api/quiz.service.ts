import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {AuthHttp} from "angular2-jwt";
import {vragenModel} from "../../models/vragenModel";

@Injectable()
export class QuizService {
  // api = 'http://localhost:8080/api';
  api = 'https://molapi.herokuapp.com/api/v1';

  constructor(public http: Http, private authHttp: AuthHttp) {
  }


  // todo aflevering weer meegeven
  getquiz(aflevering: number): Observable<vragenModel[]> {
    return this.authHttp.get(`${this.api}/quizvragen/`)
      .map(res => <vragenModel[]>res.json());
  }

  saveAnswer(answer): Observable<any>{
    return this.authHttp.post(`${this.api}/quizresultaten`,answer)
      .map(res => <any>res.json())
      .share();
  }

}

