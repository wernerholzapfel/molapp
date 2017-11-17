import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {AuthHttp} from "angular2-jwt";
import {totaalstandModel} from "../../models/totaalstand";

@Injectable()
export class StandenService {
  api = 'https://molapi.herokuapp.com/api/v1';

  constructor(public http: Http, private authHttp: AuthHttp) {
  }

  gettotaalstand(): Observable<totaalstandModel[]> {
    return this.http.get(`${this.api}/standen`)
      .map(res => <totaalstandModel[]>res.json());
  }

  getafleveringstand(deelnemer): Observable<any> {
    return this.http.get(`${this.api}/standen/` + deelnemer)
      .map(res => <any>res.json());
  }
}

