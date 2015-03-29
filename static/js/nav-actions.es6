const Rx = require('rx');

class NavActions {
  register(updates) {
    NavActions.navigateTo
      .map((route) => {
        return (navState) => {
          console.log('navigateTo:navState', navState);
          console.log('navigateTo:route', route);
          navState.route = route;
          return navState;
        };
      })
      .subscribe(updates);
  }
}

NavActions.navigateTo = new Rx.Subject();

//var NavActions = {
//  navigateTo: new Rx.Subject()
//};
//
//NavActions.register = function (updates) {
//  this.navigateTo
//    .map(function (route) {
//      return function (navState) {
//        console.log('navigateTo:navState', navState);
//        console.log('navigateTo:route', route);
//        navState.route = route;
//        return navState;
//      };
//    })
//    .subscribe(updates);
//};

module.exports = NavActions;
