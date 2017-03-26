import {Component} from "@angular/core";
import {NavController, ViewController, AlertController} from "ionic-angular";
import {Subscription} from "rxjs";
import {molvoorspellingModel} from "../../models/molvoorspelling";
import {AuthService} from "../../services/auth/auth.service";
import {MollenService} from "../../services/api/mollen.service";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {mollenModel} from "../../models/mollen";
import {ProfilePage} from "../profile/profile";
import _ from "lodash";
/*
 Generated class for the Molvoorspelling page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-molvoorspelling',
  templateUrl: 'molvoorspelling.html'
})
export class MolvoorspellingPage {

  showAlertMessage = true;
  postvoorspellingSub: Subscription;
  molvoorspelling: molvoorspellingModel;
  activeMol: mollenModel[];
  activeAfvaller: mollenModel[];
  activeWinnaar: mollenModel[];
  mollen: mollenModel[];
  afvallers: mollenModel[];
  winnaars: mollenModel[];
  mollenSub: Subscription;
  laatsteaflevering = 2;
  laatstevoorspellingSub: Subscription;
  private voorspelling: FormGroup;
  opslaanView = false;
  kiesMol = true;
  kiesWinnaar = false;
  kiesAfvaller = false;

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              public auth: AuthService,
              private mollenService: MollenService,
              private formBuilder: FormBuilder) {

    this.voorspelling = this.formBuilder.group({
      mol: ['', Validators.required],
      winnaar: ['', Validators.required],
      afvaller: ['', Validators.required],
      aflevering: [this.laatsteaflevering + 1, Validators.required]
    });
  }

  pushPage() {
    this.navCtrl.push(ProfilePage)
      .catch(() => console.log('should I stay or should I go now'))
  }

  ionViewWillEnter() {

    this.laatstevoorspellingSub = this.mollenService.getlaatstemolvoorspelling().subscribe(laatsteVoorspelling => {
      this.voorspelling.get('mol').setValue(laatsteVoorspelling.mol);
      this.voorspelling.get('winnaar').setValue(laatsteVoorspelling.winnaar);
      this.voorspelling.get('afvaller').setValue(laatsteVoorspelling.afvaller);

      this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
        this.mollen = response;
        this.mollen.forEach(function (mol) {
          if (mol.name === laatsteVoorspelling.mol) {
            mol.selected = true;
          }
        });
        this.activeMol = _.filter(this.mollen, ['selected', true])
      });

      this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
        this.afvallers = response;
        this.afvallers.forEach(function (afvaller) {
          if (afvaller.name === laatsteVoorspelling.afvaller) {
            afvaller.selected = true;
          }
        });
        this.activeAfvaller = _.filter(this.afvallers, ['selected', true])
      });

      this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
        this.winnaars = response;
        this.winnaars.forEach(function (winnaar) {
          if (winnaar.name === laatsteVoorspelling.winnaar) {
            winnaar.selected = true;
          }
        });
        this.activeWinnaar = _.filter(this.winnaars, ['selected', true])

      });
    });
  };

  ionViewCanLeave() {

    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Log out',
        subTitle: 'Are you sure you want to log out?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              reject();
            }
          },
          {
            text: 'Yes',
            handler: () => {
              alert.dismiss().then(() => {
                resolve();
              });
            }
          }
        ]
      });

      alert.present();
    });
  }


  ionViewWillLeave() {

    this.mollenSub.unsubscribe();
    this.laatstevoorspellingSub.unsubscribe();
  }

  logForm() {

    this.postvoorspellingSub = this.mollenService.savemolvoorspelling(this.voorspelling.value).subscribe(response => {
      console.log(response);
      this.navCtrl.parent.select(0);

    });
    console.log(this.voorspelling.value)
  }

  setActiveMol(mol) {
    console.log(mol.name + "is de mol");
    this.voorspelling.get('mol').setValue(mol.name);
    this.mollen.forEach(function (mol) {
        mol.selected = false
      }
    );
    mol.selected = true;
    this.activeMol = _.filter(this.mollen, ['selected', true]);
    // this.setKiesWinnaar();
  }

  setWinnaar(winnaar) {
    console.log(winnaar.name + "is de winnaar");
    this.voorspelling.get('winnaar').setValue(winnaar.name);
    this.winnaars.forEach(function (winnaar) {
        winnaar.selected = false
      }
    );
    winnaar.selected = true;
    this.activeWinnaar = _.filter(this.winnaars, ['selected', true]);
    // this.setKiesAfvaller();
  }

  setAfvaller(afvaller) {
    console.log(afvaller.name + "is de afvaller");
    this.voorspelling.get('afvaller').setValue(afvaller.name);
    this.afvallers.forEach(function (afvaller) {
        afvaller.selected = false
      }
    );
    afvaller.selected = true;
    this.activeAfvaller = _.filter(this.afvallers, ['selected', true]);
    // this.setKiesNiks();
  }

  setKiesMol(){
    this.kiesMol = true;
    this.kiesAfvaller = false;
    this.kiesWinnaar =false;

  }
  setKiesAfvaller(){
    this.kiesMol = false;
    this.kiesAfvaller = true;
    this.kiesWinnaar =false;

  }
  setKiesWinnaar(){
    this.kiesMol = false;
    this.kiesAfvaller = false;
    this.kiesWinnaar =true;

  }
  setKiesNiks(){
    this.kiesMol = false;
    this.kiesAfvaller = false;
    this.kiesWinnaar = false;
  }

}
