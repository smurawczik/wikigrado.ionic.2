import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PretestPage } from '../pretest/pretest';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: {email:string, password: string}

  constructor(public navCtrl: NavController, public tracker: AnalyticsProvider, public navParams: NavParams) {
    this.user = {email: "", password: ""}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.tracker.trackView('vista de login');
  }

  goToHomePage() {
    this.navCtrl.setRoot(PretestPage);
  }

  goBack() {
    this.navCtrl.pop();
  }

}
