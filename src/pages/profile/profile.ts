import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Subscription} from 'rxjs';
import {MollenService} from '../../services/api/mollen.service';
import {DeelnemersService} from '../../services/api/deelnemers.service';
import {deelnemerModel} from '../../models/deelnemerModel';
import {MolvoorspellingPage} from '../molvoorspelling/molvoorspelling';
import {NavController} from 'ionic-angular';
import {afleveringstandModel} from '../../models/afleveringstandModel';
import {afleveringModel} from '../../models/afleveringModel';
import {ActiesService} from '../../services/api/acties.service';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
  actiesSub: Subscription;
  voorspellingSub: Subscription;
  molvoorspellingen: deelnemerModel;
  isLoading: boolean;
  huidigeVoorspelling: any;
  voorspellingAflevering: number
  // currentAflevering: afleveringModel;
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public auth: AuthService, public navCtrl: NavController, private actieService: ActiesService, private deelnemersService: DeelnemersService) {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.actiesSub = this.actieService.getActies().subscribe(response => {
      this.voorspellingAflevering = response.voorspellingaflevering;

      this.deelnemersService.getdeelnemer().subscribe(response => {
        this.huidigeVoorspelling = response.voorspellingen.find(voorspelling => {
          return voorspelling.aflevering.aflevering === this.voorspellingAflevering;
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
    this.actiesSub.unsubscribe();
    this.voorspellingSub.unsubscribe();
  }

  goToVoorspelling() {
      this.navCtrl.push(MolvoorspellingPage);
    }
}
