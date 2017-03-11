import {Component} from "@angular/core";
import {NavController, ViewController} from "ionic-angular";
import {Subscription} from "rxjs";
import {molvoorspellingModel} from "../../models/molvoorspelling";
import {AuthService} from "../../services/auth/auth.service";
import {MollenService} from "../../services/api/mollen.service";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {mollenModel} from "../../models/mollen";

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

  postvoorspellingSub: Subscription;
  molvoorspelling: molvoorspellingModel;
  mollen: mollenModel[];
  afvallers: mollenModel[];
  winnaars: mollenModel[];
  mollenSub: Subscription;
  laatsteaflevering = 2;
  private voorspelling: FormGroup;

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public navCtrl: NavController,
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

  ionViewWillEnter() {
    this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
      this.mollen = response;});

    this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
      this.afvallers = response;
    });

    this.mollenSub = this.mollenService.getactivemollen().subscribe(response => {
      this.winnaars = response;
    });
  }

  ionViewWillLeave() {
    this.mollenSub.unsubscribe();
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
  }
  setWinnaar(winnaar) {
    console.log(winnaar.name + "is de winnaar");
    this.voorspelling.get('winnaar').setValue(winnaar.name);
    this.winnaars.forEach(function (winnaar) {
      winnaar.selected = false
      }
    );
    winnaar.selected = true;
  }
  setAfvaller(afvaller) {
    console.log(afvaller.name + "is de afvaller");
    this.voorspelling.get('afvaller').setValue(afvaller.name);
    this.afvallers.forEach(function (afvaller) {
      afvaller.selected = false
      }
    );
    afvaller.selected = true;
  }
}
