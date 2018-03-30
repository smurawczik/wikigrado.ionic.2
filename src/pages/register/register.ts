import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { PretestPage } from '../pretest/pretest';
import { RegisterPictureStepPage } from '../register-picture-step/register-picture-step';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  ages: Array<number>
  user: { }

  constructor(public navCtrl: NavController, public tracker: AnalyticsProvider, public navParams: NavParams, public userService: UserProvider ) {
    this.ages = Array.from(Array(100).keys());
    this.user = {};
  }

  goToHomePage() {
    this.navCtrl.setRoot(PretestPage);
  }

  goToPicturePage() {
    this.userService.setData(this.user);
    this.navCtrl.push(RegisterPictureStepPage);
  }

  goBack() {
    this.navCtrl.pop();
  }

  onAgeChange(age) {
    console.warn(age);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.tracker.trackView('vista de registro')
  }

}
