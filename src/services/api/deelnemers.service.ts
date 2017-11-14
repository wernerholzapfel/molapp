import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import {mollenModel} from "../../models/mollen";
import {deelnemer, molvoorspellingModel} from '../../models/molvoorspelling'
import {AuthHttp} from "angular2-jwt";
import {deelnemerModel} from '../../models/deelnemerModel';

@Injectable()
export class DeelnemersService {
  api = 'https://molapi.herokuapp.com/api/v1';

  constructor(public http: Http,private authHttp: AuthHttp) {
  }

  getdeelnemer(): Observable<deelnemerModel> {
    return this.authHttp.get(`${this.api}/deelnemers/loggedIn`)
      .map(res => <deelnemerModel>res.json());
  }

  savedeelnemer(value: deelnemerModel): Observable<any>{
    return this.authHttp.post(`${this.api}/deelnemers/`,value)
      .map(res => <any>res.json());
  }

}
