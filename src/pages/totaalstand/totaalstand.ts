import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {StandenService} from '../../services/api/standen.service';
import {Subscription} from 'rxjs';
import {totaalstandModel} from '../../models/totaalstand';
import {afleveringstandModel} from '../../models/afleveringstandModel';
import {Storage} from '@ionic/storage';
import {FormControl} from '@angular/forms';

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
  filteredUnmutadedList: totaalstandModel[];
  afleveringstand: afleveringstandModel[];
  showAfleveringstand: boolean = false;
  isLoading: boolean;
  isFilterActive: boolean;
  setFavoriteIsActive: boolean;
  searchInput: string = '';
  searchControl: FormControl;

  constructor(public navCtrl: NavController,
              private standenService: StandenService,
              public storage: Storage) {
    this.searchControl = new FormControl();

  }


  ionViewDidLoad() {
    console.log('Hello Totaalstand Page');
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.totaalstandSub = this.standenService.gettotaalstand().subscribe(standResponse => {
      this.storage.set('stand', standResponse);
      // this.totaalstandUnmutated = standResponse;
      this.storage.get('isFilterActive').then(result => {
        this.isFilterActive = result
      });

      this.storage.get('stand').then((standFromStorage) => {
        if (standFromStorage) {
          this.filteredUnmutadedList = standFromStorage.filter(standline => standline.checked);
          standFromStorage.forEach(storageItem => {
            if (this.totaalstandUnmutated.find(standLine => {
                return standLine.deelnemerId === storageItem.deelnemerId;
              })) {
              this.totaalstandUnmutated.find(standLine => {
                return standLine.deelnemerId === storageItem.deelnemerId;
              }).checked = storageItem.checked;
            }
          });
        }
        this.toggleStand(this.isFilterActive);
      });
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
    this.searchControl.valueChanges.debounceTime(500).subscribe(search => {
      this.setFilteredItems();
    });
  }

  ionViewWillLeave() {
    this.totaalstandSub.unsubscribe();
  };

  toggleStand(isFilterActive: boolean) {
    this.storage.set('isFilterActive', isFilterActive);
    if (isFilterActive) {
      this.storage.get('stand').then(
        result =>
        this.filteredUnmutadedList = result.filter(item => item.checked));
    }
    else {
      this.setFavoriteIsActive = false;
    }
    this.setFilteredItems();
  }

  setFavorite(event, standline) {
    this.totaalstand.find(line => line.deelnemerId === standline.deelnemerId).checked = event.checked;

    this.storage.set('stand', this.totaalstand);
  }

  setFilteredItems() {
    this.totaalstand = this.filterItems(this.searchInput);
    this.isLoading = false;
  }

  filterItems(searchInput) {
    if (this.isFilterActive && !this.setFavoriteIsActive) {
      return this.filteredUnmutadedList.filter((item) => {
        return item.display_name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1;
      });
    }
    else {
      return this.totaalstandUnmutated.filter((item) => {
        return item.display_name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1;
      });
    }
  }

  onSearchInput(event) {
  }

  onSearchCancel(event) {
    if (this.isFilterActive && !this.setFavoriteIsActive) {
      this.totaalstand = this.filteredUnmutadedList;
    }
    else {
      this.totaalstand = this.totaalstandUnmutated;
    }
  }
}

