import {IS_DEV} from './constants/funcrions';

export let uri = 'http://gesweb.m0.maxidom.ru:8080';

//http://geslearn.m0.maxidom.ru:8080 -> Учебка
//http://109.124.66.52:8880 -> Учебка снаружи

//http://gesweb.m0.maxidom.ru:8080 -> Бой внутри
//http://webs.maxidom.ru:8880 -> Бой снаружи

const FIGHT_CASTORAMA = 'http://ges-web-cr.dc1.maxidom.ru:8080';
const FIGHT_MAXIDOM = 'http://gesweb.m0.maxidom.ru:8080';
const LEARN_MAXIDOM = 'http://109.124.66.52:8880';

export const changeToCastorama = () => {
  if (IS_DEV) {
    uri = FIGHT_CASTORAMA;
  } else {
    uri = FIGHT_CASTORAMA;
  }
};

export const changeToMaxidom = () => {
  if (IS_DEV) {
    uri = LEARN_MAXIDOM;
  } else {
    uri = FIGHT_MAXIDOM;
  }
};
