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
  deelnemerSub: Subscription;
  molvoorspellingen: voorspelling[];
  isLoading: boolean;
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public auth: AuthService, private mollenService: MollenService, private deelnemersService: DeelnemersService) {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.deelnemerSub = this.deelnemersService.getdeelnemer().subscribe(deelnemer => {
        this.molvoorspellingen = deelnemer.voorspellingen;
        this.isLoading = false;
      }, err => {
      this.isLoading = false;
    });
  }

  ionViewWillLeave() {
    this.deelnemerSub.unsubscribe();
  }
}
