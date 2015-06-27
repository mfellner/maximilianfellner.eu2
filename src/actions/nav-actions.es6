import Rx from 'rx';

class NavActions {
  static register(updates) {
    this.navigateTo
      .map(route => {
        return () => {
          return Promise.resolve(route);
        };
      })
      .subscribe(updates);
  }
}

NavActions.navigateTo = new Rx.Subject();

export default NavActions;
