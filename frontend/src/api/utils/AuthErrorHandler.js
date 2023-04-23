import AuthUtils from './AuthUtils';

let consecutive401Errors = 0;
let navigationRef = null;

export function setNavigationRef(ref) {
  navigationRef = ref;
}

export function handle401Error() {
  // eslint-disable-next-line no-plusplus
  consecutive401Errors++;
  if (consecutive401Errors >= 3 && navigationRef) {
    console.log('Logging out');
    AuthUtils.logout(navigationRef);
  }
}

export function reset401Errors() {
  consecutive401Errors = 0;
}
