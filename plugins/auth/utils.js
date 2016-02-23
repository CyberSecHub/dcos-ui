import cookie from 'cookie';

import {userCookieKey} from './constants/ACLAuthConstants';

let Utils = {
  getUserMetadata: function () {
    return cookie.parse(global.document.cookie)[userCookieKey];
  },
  emptyCookieWithExpiry(date) {
    return cookie.serialize(
      userCookieKey, '', {expires: date}
    );
  }
};

module.exports = Utils;
