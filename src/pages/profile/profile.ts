import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Subscription} from "rxjs";
import {molvoorspellingModel, voorspelling} from '../../models/molvoorspelling';
import {MollenService} from "../../services/api/mollen.service";

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  molvoorspellingSub : Subscription;
  molvoorspellingen : voorspelling[];

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public auth: AuthService, private mollenService : MollenService) {}

  ionViewWillEnter() {
    this.molvoorspellingSub = this.mollenService.getmolvoorspellingen('c2500b11-8802-4f0b-a524-b12de883e3e1').subscribe(response => {
      this.molvoorspellingen = response.voorspellingen;
    });
  }

  ionViewWillLeave() {
    this.molvoorspellingSub.unsubscribe();
  }
}
