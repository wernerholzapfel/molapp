import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthHttp} from 'angular2-jwt';
import {deelnemerModel} from '../../models/deelnemerModel';

@Injectable()
export class DeelnemersService {
  api = 'https://molapi.herokuapp.com/api/v1';

  constructor(public authHttp: AuthHttp) {
  }

  getdeelnemer(): Observable<deelnemerModel> {
    return this.authHttp.get(`${this.api}/deelnemers/loggedIn`)
      .map(res => <deelnemerModel>res.json());
  }

  getvoorspellingen(): Observable<deelnemerModel> {
    return this.authHttp.get(`${this.api}/deelnemers/voorspellingen`)
      .map(res => <deelnemerModel>res.json());
  }

  savedeelnemer(value: deelnemerModel): Observable<any> {
    return this.authHttp.post(`${this.api}/deelnemers/`, value)
      .map(res => <any>res.json());
  }

}
