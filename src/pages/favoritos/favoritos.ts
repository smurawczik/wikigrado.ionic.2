import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FavoritesProvider } from '../../providers/favorites/favorites'
import { UserProvider } from '../../providers/user/user';
import { AllAppDataProvider } from '../../providers/all-app-data/all-app-data';

@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {

  favorites: Array<{[key: string]: any}>
  userData: {[key: string]: any}

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider, public favoritesService: FavoritesProvider, public allAppDataService: AllAppDataProvider) {
    this.userService.getUserData((data, error) => {
      if (!error) {
        this.userData = data;
        this.favoritesService.getFavorites(this.userData.user_id, (type, data) => {
          if (data) {
            let res = [];
            data.forEach(item => {
              let founditem = this.allAppDataService.getDataBasedOnTypeAndIndex(item.item_type_in_app, item.item_id_in_app);
              if (founditem) {
                res = res.concat(founditem);
              }
            });
            this.favorites = res;
          }
        });
      } else {
        this.userData = {first_name: "", last_name: "", image: ""};
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritosPage');
  }

}
