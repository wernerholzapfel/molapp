import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {mollenModel} from "../../models/mollen";
import {deelnemer, molvoorspellingModel} from '../../models/molvoorspelling'
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class MollenService {
  api = 'https://molapi.herokuapp.com/api/v1';

  constructor(public http: Http,private authHttp: AuthHttp) {
  }

  getmollen(): Observable<mollenModel[]> {
    return this.http.get(`${this.api}/kandidaten`)
      .map(res => <mollenModel[]>res.json());
  }

  getactivemollen(): Observable<mollenModel[]> {
    return this.http.get(`${this.api}/activekandidaten`)
      .map(res => <mollenModel[]>res.json());
  }

  getmolvoorspelling(aflevering): Observable<molvoorspellingModel> {
    return this.authHttp.get(`${this.api}/molvoorspelling/`+aflevering)
      .map(res => <molvoorspellingModel>res.json());
  }

  getlaatstemolvoorspelling(): Observable<deelnemer> {
    return this.authHttp.get(`${this.api}/deelnemers/loggedIn`)
      .map(res => <deelnemer>res.json());
  }

  savemolvoorspelling(value): Observable<any>{
    return this.authHttp.post(`${this.api}/voorspellingen/`,value)
      .map(res => <any>res.json());
  }

  getmolvoorspellingen(deelnemerId): Observable<deelnemer> {
    return this.authHttp.get(`${this.api}/deelnemers/${deelnemerId}/voorspellingen/`)
      .map(res => <deelnemer>res.json());
  }
}

