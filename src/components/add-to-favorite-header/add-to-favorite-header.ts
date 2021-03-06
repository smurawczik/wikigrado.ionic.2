import { Component, Input } from '@angular/core';
import { FavoritesProvider } from '../../providers/favorites/favorites'
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { UserProvider } from '../../providers/user/user';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToasterProvider } from '../../providers/toaster/toaster';

@Component({
  selector: '[addtofavoriteheader]',
  templateUrl: 'add-to-favorite-header.html'
})
export class AddToFavoriteHeaderComponent {

  @Input() favoriteItem: {[key: string]: any};
  add: boolean;
  userData: {[key: string]: any}

  constructor(public favoritesService: FavoritesProvider, public tracker: AnalyticsProvider, public userService: UserProvider, public toasterService: ToasterProvider, public loaderService: LoaderProvider) {
    this.add = true;

    this.userData = null;
    this.loaderService.showLoader({content:'Cargando...'});
    this.userService.getUserData((data, error) => {
      if (!error) {
        this.userData = data;
        this.favoritesService.checkFavorite(this.favoriteItem, data.id, (found, error) => {
          this.loaderService.hideLoader();
          if (found && found[0]) {
            this.add = false;
          }
        });
      } else {
        this.loaderService.hideLoader();
      }
    });
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

  addToFavorite() {
    const itemName = this.getItemName(this.favoriteItem);
    if (this.add) {
      this.loaderService.showLoader({content:'Guardando favorito...'});
      this.tracker.trackEvent('favoritos', 'agregar ' + this.favoriteItem.type, itemName);
      this.favoritesService.addFavorite(this.favoriteItem, this.userData.id, (success, error) => {
        this.loaderService.hideLoader();
        if (error) {
          this.toasterService.showToast({message: 'Hubo un error, vuelve a intentarlo más tarde.'});
        } else {
          this.add = !this.add;
        }
      });
    } else {
      this.loaderService.showLoader({content:'removiendo favorito...'});
      this.tracker.trackEvent('favoritos', 'remover ' + this.favoriteItem.type, itemName);
      this.favoritesService.removeFavorite(this.favoriteItem, this.userData.id, (success, error) => {
        this.loaderService.hideLoader();
        if (!error) {
          this.add = !this.add;
        } else {
          this.toasterService.showToast({message: 'Hubo un error, vuelve a intentarlo más tarde.'});
        }
      });
    }
  }
}
