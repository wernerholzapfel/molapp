import { Component } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { AuthService } from '../../services/auth/auth.service';
import {MollenPage} from "../mollen/mollen";
import {MolvoorspellingPage} from "../molvoorspelling/molvoorspelling";

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ProfilePage;
  tab2Root: any = MollenPage;
  tab3Root: any = MolvoorspellingPage;

  constructor(public auth: AuthService) {}
}
