// cookieService.js

import Cookies from 'js-cookie';

const COOKIE_NAME = 'jwt';

export const setJwtCookie = (token, expires) => {
  Cookies.set(COOKIE_NAME, token, { expires });
};

export const getJwtCookie = () => {
  return Cookies.get(COOKIE_NAME);
};

export const removeJwtCookie = () => {
  Cookies.remove(COOKIE_NAME);
};
