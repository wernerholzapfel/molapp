import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Subscription} from 'rxjs';
import {MollenService} from '../../services/api/mollen.service';
import {DeelnemersService} from '../../services/api/deelnemers.service';
import {deelnemerModel} from '../../models/deelnemerModel';
import {MolvoorspellingPage} from '../molvoorspelling/molvoorspelling';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  deelnemerSub: Subscription;
  voorspellingSub: Subscription;
  molvoorspellingen: deelnemerModel;
  isLoading: boolean;
  huidigeVoorspelling: any;
  laatsteAflevering: boolean;
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public auth: AuthService, public navCtrl: NavController, private mollenService: MollenService, private deelnemersService: DeelnemersService) {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.deelnemerSub = this.mollenService.getCurrentAflevering().subscribe(currentAflevering => {
      this.laatsteAflevering = currentAflevering.laatseAflevering;

      this.deelnemersService.getdeelnemer().subscribe(response => {
        this.huidigeVoorspelling = response.voorspellingen.find(voorspelling => {
          return voorspelling.aflevering.aflevering === currentAflevering.aflevering;
        });
      });
    });
    this.voorspellingSub = this.deelnemersService.getvoorspellingen().subscribe(deelnemer => {
      this.molvoorspellingen = deelnemer;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

  ionViewWillLeave() {
    this.deelnemerSub.unsubscribe();
    this.voorspellingSub.unsubscribe();
  }

  goToVoorspelling() {
      this.navCtrl.push(MolvoorspellingPage);
    }
}
