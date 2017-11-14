import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Subscription} from 'rxjs';
import {voorspelling} from '../../models/molvoorspelling';
import {MollenService} from '../../services/api/mollen.service';
import {DeelnemersService} from '../../services/api/deelnemers.service';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  molvoorspellingSub: Subscription;
  deelnemerSub: Subscription;
  molvoorspellingen: voorspelling[];

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public auth: AuthService, private mollenService: MollenService, private deelnemersService: DeelnemersService) {
  }

  ionViewWillEnter() {
    this.deelnemerSub = this.deelnemersService.getdeelnemer().subscribe(deelnemer => {
      this.molvoorspellingSub = this.mollenService.getmolvoorspellingen(deelnemer.id).subscribe(response => {
        this.molvoorspellingen = response.voorspellingen;
      });
    })
  }

  ionViewWillLeave() {
    this.molvoorspellingSub.unsubscribe();
    this.deelnemerSub.unsubscribe();
  }
}
