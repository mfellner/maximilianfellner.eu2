/* global STATE_COOKIE_NAME: false */

import Cookies from 'cookies-js';

// Read and expire the temporary cookie with the initial application state.
const state = JSON.parse(Cookies.get(STATE_COOKIE_NAME));
Cookies.expire(STATE_COOKIE_NAME);

export default Object.freeze(state);
