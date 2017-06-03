import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import {mollenModel} from "../../models/mollen";
import {molvoorspellingModel} from "../../models/molvoorspelling"
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class MollenService {
  api = 'https://mollotenapi.herokuapp.com/api';

  constructor(public http: Http,private authHttp: AuthHttp) {
  }

  getmollen(): Observable<mollenModel[]> {
    return this.http.get(`${this.api}/mollen`)
      .map(res => <mollenModel[]>res.json());
  }

  getactivemollen(): Observable<mollenModel[]> {
    return this.http.get(`${this.api}/activemollen`)
      .map(res => <mollenModel[]>res.json());
  }

  getmolvoorspelling(aflevering): Observable<molvoorspellingModel> {
    return this.authHttp.get(`${this.api}/molvoorspelling/`+aflevering)
      .map(res => <molvoorspellingModel>res.json());
  }

  getlaatstemolvoorspelling(): Observable<molvoorspellingModel> {
    return this.authHttp.get(`${this.api}/molvoorspelling/`)
      .map(res => <molvoorspellingModel>res.json());
  }

  savemolvoorspelling(value): Observable<any>{
    return this.authHttp.post(`${this.api}/molvoorspelling/`,value)
      .map(res => <any>res.json());
  }

  getmolvoorspellingen(): Observable<molvoorspellingModel[]> {
    return this.authHttp.get(`${this.api}/molvoorspellingen`)
      .map(res => <molvoorspellingModel[]>res.json());
  }
}

