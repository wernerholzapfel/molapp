import {Component} from "@angular/core";
import {NavController, ViewController} from "ionic-angular";
import {Subscription} from "rxjs";
import {molvoorspellingModel} from "../../models/molvoorspelling";
import {AuthService} from "../../services/auth/auth.service";
import {MollenService} from "../../services/api/mollen.service";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {mollenModel} from "../../models/mollen";
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

  molvoorspellingSub: Subscription;
  mollenSub: Subscription;
  vorigemolvoorspellingSub: Subscription;
  postvoorspellingSub: Subscription;
  molvoorspelling: molvoorspellingModel;
  vorigemolvoorspelling: molvoorspellingModel;
  mollen: mollenModel;
  laatsteaflevering = 2;
  selectOptions: any;
  private voorspelling: FormGroup;

  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public navCtrl: NavController,
              public viewCtrl : ViewController,
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

  logForm() {

    this.postvoorspellingSub = this.mollenService.savemolvoorspelling(this.voorspelling.value).subscribe(response => {
      console.log(response);
      this.navCtrl.parent.select(0);

    });
    console.log(this.voorspelling.value)
  }

}
