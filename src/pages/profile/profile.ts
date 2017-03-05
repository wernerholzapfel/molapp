import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Subscription} from "rxjs";
import {molvoorspellingModel} from "../../models/molvoorspelling";
import {MollenService} from "../../services/api/mollen.service";

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  molvoorspellingSub : Subscription;
  molvoorspelling : molvoorspellingModel[];

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public auth: AuthService, private mollenService : MollenService) {}

  ionViewWillEnter() {
    this.molvoorspellingSub = this.mollenService.getmolvoorspellingen().subscribe(response => {
      this.molvoorspelling = response;
    });
  }

  ionViewWillLeave() {
    this.molvoorspellingSub.unsubscribe();
  }
}
