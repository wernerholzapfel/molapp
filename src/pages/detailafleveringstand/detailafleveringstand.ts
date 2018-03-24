import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Subscription} from 'rxjs';
import {afleveringstandModel} from '../../models/afleveringstandModel';
import {StandenService} from '../../services/api/standen.service';
import {totaalstandModel} from '../../models/totaalstand';

/*
 Generated class for the Detailafleveringstand page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'detailafleveringstand',
  templateUrl: 'detailafleveringstand.html'
})
export class Detailafleveringstand {
  afleveringstandSub: Subscription;
  afleveringstand: afleveringstandModel[];
  showDetails: boolean = false;
  isLoading: boolean = false;

  @Input() totaalstandline: totaalstandModel;
  @Input() positie: number;
  @Input() isEven: boolean;
  @Input() isOdd: boolean;

  constructor(public navCtrl: NavController,
              private standenService: StandenService) {
  }

  ionViewDidLoad() {
    console.log('Hello Detailafleveringstand Page');
  }

  ionViewWillEnter() {
    console.log('ion view enter detail');
  }

  fetchDetails() {
    console.log('button geklikt');
    this.showDetails = !this.showDetails;
    if (this.showDetails) {
      this.isLoading = true;
      this.afleveringstandSub = this.standenService.getafleveringstand(this.totaalstandline.deelnemerId).subscribe((response => {
        console.log(response);
        this.afleveringstand = response;
        this.isLoading = false;
      }))
    }
  };

  ionViewWillLeave() {
    this.afleveringstandSub.unsubscribe();
  };

  determineAfvallersClass(afleveringstandline) {
    if (afleveringstandline.voorspelling) {
      return afleveringstandline.voorspelling.afvaller.afgevallen ? 'afgevallen' : '';
    }
  }

}
