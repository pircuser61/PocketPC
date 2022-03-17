import {autorun, makeAutoObservable} from 'mobx';
import {configure} from 'mobx';
import {PocketProvList} from '../functions/PocketProvList';
import {test_podrazd, test_user_mobx} from '../test_data/test_values';
import {PalletInListCheck, Podrazd, User} from '../types/types';

configure({
  enforceActions: 'never',
});

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  user: User | null = null;

  podrazd: Podrazd = {
    CodOb: '',
    GroupID: '',
    Id: '',
    Name: '',
  };

  resetStore = () => {
    this.podrazd = {
      CodOb: '',
      GroupID: '',
      Id: '',
      Name: '',
    };
    this.user = null;
  };
}

export default new UserStore();
