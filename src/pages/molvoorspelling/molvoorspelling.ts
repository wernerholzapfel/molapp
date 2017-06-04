import {Component} from "@angular/core";
import {NavController, AlertController} from "ionic-angular";
import {Subscription} from "rxjs";
import {molvoorspellingModel} from "../../models/molvoorspelling";
import {AuthService} from "../../services/auth/auth.service";
import {MollenService} from "../../services/api/mollen.service";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {mollenModel} from "../../models/mollen";
import _ from "lodash";
import {ProfilePage} from "../profile/profile";

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
  activeMol: mollenModel;
  activeAfvaller: mollenModel;
  activeWinnaar: mollenModel;
  // slides: mollenModel[] = [];
  mollen: mollenModel[];
  afvallers: mollenModel[];
  winnaars: mollenModel[];
  mollenSub: Subscription;
  mollenlijstSub: Subscription;
  //todo get laatsteaflevering
  laatsteaflevering = 3;
  laatstevoorspellingSub: Subscription;
  voorspelling: FormGroup;
  opslaanView = false;
  kiesMol = true;
  kiesWinnaar = false;
  kiesAfvaller = false;
  kiesNiks = false;
  activeMolId: number = 1;
  activeWinnaarId: number = 1;
  activeAfvallerId: number = 1;
  laatstevoorspelling: molvoorspellingModel;

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              // public viewCtrl: ViewController,
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

  private slides = [
    {
      "_id": "5897068c734d1d3956c4a990",
      "uid": 1,
      "name": "Thomas",
      "mol": true,
      "laatsteaflevering": null,
      "winnaar": false
    },
    {
      "_id": "58970cd5734d1d3956c4ab13",
      "uid": 2,
      "name": "Jeroen",
      "mol": false,
      "laatsteaflevering": null,
      "winnaar": false
    },
    {
      "_id": "58970ce4734d1d3956c4ab16",
      "uid": 3,
      "name": "Jochem",
      "mol": false,
      "laatsteaflevering": null,
      "winnaar": false
    },
    {
      "_id": "58970cf3734d1d3956c4ab19",
      "uid": 4,
      "name": "Imanuelle",
      "mol": false,
      "laatsteaflevering": 3,
      "winnaar": false
    },
    {
      "_id": "58970d09734d1d3956c4ab20",
      "uid": 5,
      "name": "Sanne",
      "mol": false,
      "laatsteaflevering": null,
      "winnaar": false
    },

    {
      "_id": "589717e4734d1d3956c4ad40",
      "uid": 6,
      "name": "Diederik",
      "mol": false,
      "laatsteaflevering": null,
      "winnaar": false
    },
    {
      "_id": "589717f8734d1d3956c4ad43",
      "uid": 7,
      "name": "Sigrid",
      "mol": false,
      "laatsteaflevering": 4,
      "winnaar": false
    },


    {
      "_id": "58971803734d1d3956c4ad47",
      "uid": 8,
      "name": "Vincent",
      "mol": false,
      "laatsteaflevering": 1,
      "winnaar": false
    },
    {
      "_id": "58971825734d1d3956c4ad5a",
      "uid": 9,
      "name": "Yvonne",
      "mol": false,
      "laatsteaflevering": 2,
      "winnaar": false
    },
    {
      "_id": "5897184d734d1d3956c4ad61",
      "uid": 10,
      "name": "Roos",
      "mol": false,
      "laatsteaflevering": 3,
      "winnaar": false
    }
  ];

  pushPage() {
    this.navCtrl.pop();
    this.navCtrl.push(ProfilePage)
      .catch(() => console.log('should I stay or should I go now'))
  }

  ionViewWillEnter() {

    // this.mollenlijstSub = this.mollenService.getmollen().subscribe(response => {
    //     this.slides = response;
    //   }
    // );

    this.laatstevoorspellingSub = this.mollenService.getlaatstemolvoorspelling().subscribe(laatsteVoorspelling => {
      this.laatstevoorspelling = laatsteVoorspelling;

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
        this.activeMol = _.filter(this.mollen, ['selected', true])[0];
        if (this.activeMol) {
          this.activeMolId = this.activeMol.uid;
        }

        if (!this.activeMol) {
          this.voorspelling.get('mol').setValue(null);
        }
      });

      this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
        this.afvallers = response;
        this.afvallers.forEach(function (afvaller) {
          if (afvaller.name === laatsteVoorspelling.afvaller) {
            afvaller.selected = true;
          }
        });
        this.activeAfvaller = _.filter(this.afvallers, ['selected', true])[0]
        if (this.activeAfvaller) {
          this.activeAfvallerId = this.activeAfvaller.uid;
        }

        if (!this.activeAfvaller) {
          this.voorspelling.get('afvaller').setValue(null);
        }
      });

      this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
        this.winnaars = response;
        this.winnaars.forEach(function (winnaar) {
          if (winnaar.name === laatsteVoorspelling.winnaar) {
            winnaar.selected = true;
          }
        });
        this.activeWinnaar = _.filter(this.winnaars, ['selected', true])[0]
        if (this.activeWinnaar) {
          this.activeWinnaarId = this.activeWinnaar.uid;
        }
        if (!this.activeWinnaar) {
          this.voorspelling.get('winnaar').setValue(null);
        }
      });
    });
  };

  ionViewCanLeave() {
    if (this.showAlertMessage && this.laatsteaflevering+1 !== this.laatstevoorspelling.aflevering) {
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: 'Voorspellingen incompleet',
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
      true
    }
  }


  ionViewWillLeave() {
    this.mollenSub.unsubscribe();
    this.laatstevoorspellingSub.unsubscribe();
    // this.mollenlijstSub.unsubscribe();
  }

  logForm() {

    this.postvoorspellingSub = this.mollenService.savemolvoorspelling(this.voorspelling.value).subscribe(response => {
      console.log(response);
      this.showAlertMessage = false;
      this.pushPage();

    });
    console.log(this.voorspelling.value)
  }

  setActiveMol(mol: any) {
    console.log(mol.name + "is de mol");
    this.voorspelling.get('mol').setValue(mol.name);
    this.mollen.forEach(function (mol) {
        mol.selected = false
      }
    );
    mol.selected = true;
    this.activeMol = mol;
    this.activeMolId = mol.uid;
    this.setKiesWinnaar();
  }

  setWinnaar(winnaar) {
    console.log(winnaar.name + "is de winnaar");
    this.voorspelling.get('winnaar').setValue(winnaar.name);
    this.winnaars.forEach(function (winnaar) {
        winnaar.selected = false
      }
    );
    winnaar.selected = true;
    this.activeWinnaar = winnaar;
    this.activeWinnaarId = winnaar.uid;
    this.setKiesAfvaller();
  }

  setAfvaller(afvaller) {
    console.log(afvaller.name + "is de afvaller");
    this.voorspelling.get('afvaller').setValue(afvaller.name);
    this.afvallers.forEach(function (afvaller) {
        afvaller.selected = false
      }
    );
    afvaller.selected = true;
    this.activeAfvaller = afvaller;
    this.activeAfvallerId = afvaller.uid;
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
