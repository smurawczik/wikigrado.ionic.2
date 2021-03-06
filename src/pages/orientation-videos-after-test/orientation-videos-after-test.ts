import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { TestPage } from '../test/test';
import { UserProvider } from '../../providers/user/user';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { OrientationVideosProvider } from '../../providers/orientation-videos/orientation-videos';
import { LoaderProvider } from '../../providers/loader/loader';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-orientation-videos-after-test',
  templateUrl: 'orientation-videos-after-test.html',
})
export class OrientationVideosAfterTestPage {

  user: any;
  videos: Array<{[key: string]: any}>
  dimensions: {width: number, height: number}

  constructor(public navCtrl: NavController, public tracker: AnalyticsProvider, private iab: InAppBrowser, public navParams: NavParams, public userService: UserProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public orientationVideosService: OrientationVideosProvider, private domElem: ElementRef, public loaderService: LoaderProvider, public menuCtrl: MenuController, private screenOrientation: ScreenOrientation) {
    this.menuCtrl.enable(true, 'appmenu');
    this.userService.getUserData((data, error) => {
      if (!error) {
        this.user = data;
      }
    })
  }

  ionViewDidEnter() {
    this.screenOrientation.unlock();
    let width = this.domElem.nativeElement.offsetWidth - 32;
    this.dimensions = {
      width: width,
      height: (width * 9) / 16,
    }

    const orientations = this.user.orientations.split(",");
    this.loaderService.showLoader({content:'cargando...'});
    this.orientationVideosService.getVideosBasedOnOrientations(orientations, (videos) => {
      this.videos = videos;
      this.loaderService.hideLoader();
    });
  }

  ionViewWillLeave() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).catch((e) => {});
  }

  retakeTest() {
    this.navCtrl.setRoot(TestPage, {animate: true})
  }

  openNavarraTest() {
    this.iab.create("https://www.unav.edu/web/admision-y-ayudas/test-online-de-orientacion", "_blank", {closebuttoncaption: "ok"});
  }

}
