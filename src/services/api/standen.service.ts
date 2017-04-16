import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import {AuthHttp} from "angular2-jwt";
import {totaalstandModel} from "../../models/totaalstand";

@Injectable()
export class StandenService {
  api = 'https://mollotenapi.herokuapp.com/api';

  constructor(public http: Http, private authHttp: AuthHttp) {
  }

  gettotaalstand(): Observable<totaalstandModel[]> {
    return this.http.get(`${this.api}/totaalstand`)
      .map(res => <totaalstandModel[]>res.json());
  }

  getafleveringstand(deelnemer): Observable<any> {
    return this.http.get(`${this.api}/afleveringstand/` + deelnemer)
      .map(res => <any>res.json());
  }
}

