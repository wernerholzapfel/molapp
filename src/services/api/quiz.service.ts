import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import {AuthHttp} from "angular2-jwt";
import {vragenModel} from "../../models/vragenModel";

@Injectable()
export class QuizService {
  api = 'http://localhost:8080/api';
  // api = 'https://mollotenapi.herokuapp.com/api';

  constructor(public http: Http, private authHttp: AuthHttp) {
  }

  getquiz(aflevering: number): Observable<vragenModel[]> {
    return this.authHttp.get(`${this.api}/quiz/${aflevering}`)
      .map(res => <vragenModel[]>res.json());
  }

  saveAnswer(answer): Observable<any>{
    return this.authHttp.post(`${this.api}/answer`,answer)
      .map(res => <any>res.json())
      .share();
  }

}

