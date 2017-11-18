import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {Subscription} from 'rxjs';
import {voorspelling} from '../../models/molvoorspelling';
import {AuthService} from '../../services/auth/auth.service';
import {MollenService} from '../../services/api/mollen.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {mollenModel} from '../../models/mollen';
import {ProfilePage} from '../profile/profile';
import {kandidaatModel} from '../../models/kandidaatModel';
import * as _ from 'lodash';
import {DeelnemersService} from '../../services/api/deelnemers.service';
import {deelnemerModel} from '../../models/deelnemerModel';

@Component({
  selector: 'page-molvoorspelling',
  templateUrl: 'molvoorspelling.html'
})
export class MolvoorspellingPage {

  showAlertMessage = true;
  postvoorspellingSub: Subscription;
  activeMol: kandidaatModel;
  activeAfvaller: kandidaatModel;
  activeWinnaar: kandidaatModel;
  mollen: mollenModel[];
  afvallers: mollenModel[];
  winnaars: mollenModel[];
  mollenlijstSub: Subscription;
  deelnemerSub: Subscription;
  deelnemer: deelnemerModel;
  slides: mollenModel[] = [];

  laatsteaflevering: number;
  nieuweRonde: boolean;
  laatstevoorspellingSub: Subscription;
  voorspelling: FormGroup;
  opslaanView = false;
  kiesMol = true;
  kiesWinnaar = false;
  kiesAfvaller = false;
  kiesNiks = false;
  activeMolIndex: number = 0;
  activeWinnaarIndex: number = 0;
  activeAfvallerIndex: number = 0;
  laatsteVoorspelling: voorspelling;
  isLoading: boolean
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public auth: AuthService,
              private mollenService: MollenService,
              private deelnemersService: DeelnemersService,
              private formBuilder: FormBuilder) {

    this.voorspelling = this.formBuilder.group({
      id: [''],
      mol: ['', Validators.required],
      winnaar: ['', Validators.required],
      afvaller: ['', Validators.required],
      aflevering: [this.laatsteaflevering + 1, Validators.required],
      deelnemer: [null, Validators.required] // todo get deelnemersId
    });
  }

  pushPage() {
    this.navCtrl.pop();
    this.navCtrl.push(ProfilePage)
      .catch(() => console.log('should I stay or should I go now'))
  }

  ionViewWillEnter() {
    this.isLoading = true;

    this.mollenlijstSub = this.mollenService.getmollen().subscribe(response => {
        this.mollen = response;
        this.laatsteaflevering = _.sortBy(response, 'elimination_round').reverse()[0].elimination_round;
      }
    );

    this.deelnemerSub = this.deelnemersService.getdeelnemer().subscribe(response => {
      this.deelnemer = response;
      this.voorspelling.get('deelnemer').setValue({id: this.deelnemer.id});

      this.laatstevoorspellingSub = this.mollenService.getlaatstemolvoorspelling().subscribe(voorspellingen => {
        console.log('ik zit erin ' + voorspellingen);

        if (voorspellingen.voorspellingen.length > 0) {
          this.laatsteVoorspelling = _.sortBy(voorspellingen.voorspellingen, 'aflevering').reverse()[0];
          this.activeMol = this.laatsteVoorspelling.mol;
          this.activeMolIndex = this.mollen.findIndex(item => {
            return item.id === this.activeMol.id
          });
          this.activeWinnaar = this.laatsteVoorspelling.winnaar;
          this.activeWinnaarIndex = this.mollen.findIndex(item => {
            return item.id === this.activeWinnaar.id
          });
          this.activeAfvaller = this.laatsteVoorspelling.afvaller;
          this.activeAfvallerIndex = this.mollen.findIndex(item => {
            return item.id === this.activeAfvaller.id
          });

          // first set al indexes before you bind it to slides.
          this.slides = this.mollen;

          if (this.activeMol.elimination_round === 0) {
            this.voorspelling.get('mol').setValue({id: this.activeMol.id});
          } else {
            this.voorspelling.get('mol').setValue('');
          }
          this.voorspelling.get('winnaar').setValue({id: this.activeWinnaar.id});
          this.voorspelling.get('afvaller').setValue({id: this.activeAfvaller.id});

          if (this.laatsteaflevering < this.laatsteVoorspelling.aflevering) {
            this.nieuweRonde = false;
            this.voorspelling.get('id').setValue(this.laatsteVoorspelling.id);
          } else {
            this.nieuweRonde = true;
            this.voorspelling.get('id').setValue(null);
          }
          this.voorspelling.get('aflevering').setValue(this.laatsteaflevering + 1);
        }
        else {
          this.slides = this.mollen;
          this.nieuweRonde = true;
          this.voorspelling.get('aflevering').setValue(this.laatsteaflevering + 1);
        }
        this.isLoading = false;
      });
    });
  };

  ionViewCanLeave() {
    if (this.showAlertMessage && this.laatsteaflevering + 1 !== this.laatsteVoorspelling.aflevering) {
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: 'Voorspellingen niet opgeslagen',
          subTitle: 'Je voorspellingen zijn nog niet opgeslagen, weet je zeker dat je de pagina wilt verlaten?',
          buttons: [
            {
              text: 'Nee',
              role: 'cancel',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Ja',
              handler: () => {
                alert.dismiss().then(() => {
                  resolve();
                });
              }
            }
          ]
        });

        alert.present()
      });
    }
    else {
      return true;
    }
  }

  ionViewWillLeave() {
    this.laatstevoorspellingSub.unsubscribe();
    this.mollenlijstSub.unsubscribe();
    this.deelnemerSub.unsubscribe();
  }

  logForm() {

    if (this.nieuweRonde) {
      this.voorspelling.get('id').disable()
    }

    this.postvoorspellingSub = this.mollenService.savemolvoorspelling(this.voorspelling.value).subscribe(response => {
      console.log(response);
      this.showAlertMessage = false;
      this.pushPage();

    });
    console.log(this.voorspelling)
  }

  setActiveMol(mol: kandidaatModel) {
    console.log(mol.display_name + 'is de mol');
    this.voorspelling.get('mol').setValue({id: mol.id});
    this.activeMol = mol;
    this.setKiesWinnaar();
  }

  setWinnaar(winnaar) {
    console.log(winnaar.display_name + 'is de winnaar');
    this.voorspelling.get('winnaar').setValue({id: winnaar.id});
    this.activeWinnaar = winnaar;
    this.setKiesAfvaller();
  }

  setAfvaller(afvaller) {
    console.log(afvaller.display_name + 'is de afvaller');
    this.voorspelling.get('afvaller').setValue({id: afvaller.id});
    this.activeAfvaller = afvaller;
    this.setKiesNiks();
  }

  setKiesMol() {
    this.kiesMol = true;
    this.kiesAfvaller = false;
    this.kiesWinnaar = false;
    this.kiesNiks = false;
  }

  setKiesAfvaller() {
    this.kiesMol = false;
    this.kiesAfvaller = true;
    this.kiesWinnaar = false;
    this.kiesNiks = false;

  }

  setKiesWinnaar() {
    this.kiesMol = false;
    this.kiesAfvaller = false;
    this.kiesWinnaar = true;
    this.kiesNiks = false;

  }

  setKiesNiks() {
    this.kiesMol = false;
    this.kiesAfvaller = false;
    this.kiesWinnaar = false;
    this.kiesNiks = true;
  }

  setNextState() {
    if (this.kiesMol) return this.setKiesWinnaar();
    if (this.kiesWinnaar) return this.setKiesAfvaller();
  }

  setPreviousState() {
    if (this.kiesAfvaller) return this.setKiesWinnaar();
    if (this.kiesWinnaar) return this.setKiesMol();
  }
}
