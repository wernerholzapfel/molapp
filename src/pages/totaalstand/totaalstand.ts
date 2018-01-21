import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {StandenService} from '../../services/api/standen.service';
import {Subscription} from 'rxjs';
import {totaalstandModel} from '../../models/totaalstand';
import {afleveringstandModel} from '../../models/afleveringstandModel';
import {Storage} from '@ionic/storage';

/*
 Generated class for the Totaalstand page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-totaalstand',
  templateUrl: 'totaalstand.html'
})
export class TotaalstandPage {
  totaalstandSub: Subscription;
  afleveringstandSub: Subscription;
  totaalstand: totaalstandModel[];
  totaalstandUnmutated: totaalstandModel[];
  afleveringstand: afleveringstandModel[];
  showAfleveringstand: boolean = false;
  isLoading: boolean;
  isFilterActive: boolean;
  setFavoriteIsActive: boolean;

  constructor(public navCtrl: NavController,
              private standenService: StandenService,
              public storage: Storage) {
  }


  ionViewDidLoad() {
    console.log('Hello Totaalstand Page');
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.totaalstandSub = this.standenService.gettotaalstand().subscribe(standResponse => {
      this.totaalstandUnmutated = standResponse;
      this.storage.get('isFilterActive').then(result => {
        this.isFilterActive = result
      });

      this.storage.get('stand').then((standFromStorage) => {
        if (standFromStorage) {
          standFromStorage.forEach(storageItem => {
          if (this.totaalstandUnmutated.find(standLine => {
              return standLine.deelnemerId === storageItem.deelnemerId;
            })) {
            this.totaalstandUnmutated.find(standLine => {
              return standLine.deelnemerId === storageItem.deelnemerId;
            }).checked = storageItem.checked;
        }});
      }
        this.storage.set('stand', this.totaalstandUnmutated);
        this.toggleStand(this.isFilterActive);
      });
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

  ionViewWillLeave() {
    this.totaalstandSub.unsubscribe();
  };

  toggleStand(isFilterActive: boolean) {
    this.storage.set('isFilterActive', isFilterActive);
    if (isFilterActive) {
      this.storage.get('stand').then(result => this.totaalstand = result.filter(item => item.checked));
    }
    else {
      this.setFavoriteIsActive = false;
      this.totaalstand = this.totaalstandUnmutated;
    }
  }

  setFavorites(setFavoriteIsActive: boolean) {
    if (setFavoriteIsActive) {
      this.storage.get('stand').then(result => this.totaalstand = result);
    }
    else {
      this.storage.get('stand').then(result => this.totaalstand = result.filter(item => item.checked));
    }
  }

  setFavorite(event, standline) {
    this.totaalstand.find(line => line.deelnemerId === standline.deelnemerId).checked = event.checked;

    this.storage.set('stand', this.totaalstand);
  }
}

