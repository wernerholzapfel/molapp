import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {AuthHttp} from "angular2-jwt";
import {totaalstandModel} from "../../models/totaalstand";
import {actieModel} from '../../models/actieModel';

@Injectable()
export class ActiesService {
  api = 'https://molapi.herokuapp.com/api/v1';

  constructor(public http: Http, private authHttp: AuthHttp) {
  }

  getActies(): Observable<actieModel> {
    return this.http.get(`${this.api}/acties`)
      .map(res => <actieModel>res.json());
  }
}

