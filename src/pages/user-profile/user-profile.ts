import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Slides, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToasterProvider } from '../../providers/toaster/toaster';
import { AllAppDataProvider } from '../../providers/all-app-data/all-app-data';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { GradoPage } from '../grado/grado';
import { LoginPage } from '../login/login';
import { FavoritesProvider } from '../../providers/favorites/favorites'

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  @ViewChild(Slides) slides: Slides;
  avatars: Array<string>
  avatar: number;
  user: {[key: string]: any};
  ages: Array<number>
  favorites: Array<{[key: string]: any}> = [];
  dimensions: {width: number, height: number}
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider, public toasterService: ToasterProvider, public loaderService: LoaderProvider,
public favoritesService: FavoritesProvider, public allAppDataService: AllAppDataProvider, public modalCtrl: ModalController, private domElem: ElementRef, public tracker: AnalyticsProvider, public alertCtrl: AlertController) {
    this.loaderService.showLoader({content:'Cargando...'});
    this.userService.getUserData((data, error) => {
      if (!error) {
        this.user = data;
        this.avatar = data.avatar;
        this.getFavorites((done, error) => {
          this.loaderService.hideLoader();
        });
      }
    });

    this.avatars = ['assets/imgs/avatar/1.png','assets/imgs/avatar/2.png','assets/imgs/avatar/3.png','assets/imgs/avatar/4.png','assets/imgs/avatar/5.png','assets/imgs/avatar/6.png','assets/imgs/avatar/7.png','assets/imgs/avatar/8.png','assets/imgs/avatar/9.png']
    this.ages = Array.from(Array(100).keys()).slice(14, 100);
  }

  getFavorites(callback) {
    this.favoritesService.getFavorites(this.user.id, (favorites, favoritesError) => {
      if (!favoritesError) {
        let res = [];
        favorites.forEach(item => {
          let founditem = this.allAppDataService.getDataBasedOnTypeAndIndex(item.type, item.favorite_id);
          if (founditem) {
            res = res.concat([{...founditem, type: item.type, index: item.favorite_id}]);
          }
        });
        this.favorites = res;
      }
      callback();
    });
  }

  viewFavorite(item) {
    if (item) {
      //{data: {...gradeWithUnivs, type: 'grado', index: gradeWithUnivs.id}, dimensionData: this.dimensions}
      let trueItem;
      if (item.type === "universities") {
        trueItem = this.allAppDataService.getUniversityWithGrades(item);
      } else if (item.type === "grades") {
        trueItem = this.allAppDataService.getGradeWithUniversities(item);
      } else {
        trueItem = item;
      }
      let modal = this.modalCtrl.create(GradoPage, {data: trueItem, dimensionData: this.dimensions});
      modal.onDidDismiss(() => {
        this.loaderService.showLoader({content:'Cargando...'});
        this.getFavorites(() => {
          this.loaderService.hideLoader();
        });
        modal = null;
      })
      modal.present();
    }
  }

  getItemName(item) {
    if (item.type === 'grades') {
      return item.grade;
    }
    if (item.type === 'universities') {
      return item.university;
    }
    if (item.type === 'colleges') {
      return item.name;
    }
  }

  deleteFavorite(favorite) {
    const itemName = this.getItemName(favorite);
    this.loaderService.showLoader({content:'removiendo favorito...'});
    this.favoritesService.removeFavorite(favorite, this.user.id, (success, error) => {
      if (error) {
        this.loaderService.hideLoader();
        this.toasterService.showToast({message: 'Hubo un error, vuelve a intentarlo más tarde.'});
      } else {
        this.tracker.trackEvent('favoritos', 'remover ' + favorite.type, itemName);
        this.getFavorites(() => {
          this.loaderService.hideLoader();
        });
      }
    });
  }

  slideChanged() {
    this.avatar = this.slides.getActiveIndex();
  }

  ionViewDidEnter() {
    let width = this.domElem.nativeElement.offsetWidth - 32;
    this.dimensions = {
      width: width,
      height: (width * 9) / 16,
    }
  }

  deleteAccount() {
    let alert = this.alertCtrl.create({
      title: 'Borrar cuenta',
      message: 'Una vez que presiones <b>Borrar</b> todos tus datos seran eliminados completamente junto con tus favoritos.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: () => {
            this.loaderService.showLoader({content:'borrando cuenta...'});
            this.userService.deleteAccount(this.user, (success, error) => {
              this.loaderService.hideLoader();
              if (!error) {
                this.logout();
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  logout() {
    this.userService.clearStorage();
    this.navCtrl.setRoot(LoginPage, {showVolver: false});
  }

  updateUser() {
    this.loaderService.showLoader({content:'actualizando usuario...'});
    this.userService.updateUser({...this.user, avatar: this.avatar}, (user, error) => {
      if (!error) {
        this.userService.setUserData(user, (storageSuccess, storageError) => {
          if (!storageError) {
            this.toasterService.showToast({
              message: 'Datos guardados correctamente',
              duration: 3000,
              position: 'middle'
            });
          }
        })
      } else {
        this.toasterService.showToast({message: 'Hubo un error, vuelve a intentarlo más tarde.'});
      }
      this.loaderService.hideLoader();
    });
  }

}
