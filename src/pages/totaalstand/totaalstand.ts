import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {StandenService} from "../../services/api/standen.service";
import {Subscription} from "rxjs";
import {totaalstandModel} from "../../models/totaalstand";
import {afleveringstandModel} from "../../models/afleveringstandModel";

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
  afleveringstand: afleveringstandModel[];
  showAfleveringstand: boolean = false;

  constructor(public navCtrl: NavController,
              private standenService: StandenService) {
  }


  ionViewDidLoad() {
    console.log('Hello Totaalstand Page');
  }

  ionViewWillEnter() {

    this.totaalstandSub = this.standenService.gettotaalstand().subscribe(response => {
      this.totaalstand = response;
    });
  }

  ionViewWillLeave() {
    this.totaalstandSub.unsubscribe();
  };


}

