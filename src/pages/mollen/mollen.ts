import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MollenService} from "../../services/api/mollen.service";
import {Subscription} from "rxjs";
import {mollenModel} from "../../models/mollen";

/*
  Generated class for the Mollen page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mollen',
  templateUrl: 'mollen.html'
})
export class MollenPage {
  mollenSub : Subscription;
  mollen : mollenModel;

  constructor(public navCtrl: NavController,
              private mollenService: MollenService,) {}

  ionViewDidLoad() {
    console.log('Hello Mollen Page');
  }

  ionViewWillEnter() {

    this.mollenSub = this.mollenService.getmollen().subscribe(response => {
      this.mollen = response;
    });
  }

  ionViewWillLeave() {
    this.mollenSub.unsubscribe();
  }
}
