function getContent(key) {
  return new Promise(resolve => {
    resolve({
      'home' : {key: 'home', content: '<h3>Home</h3><p>Hello, home.</p>'},
      'about': {key: 'about', content: '<h3>About</h3><p>Hello, about.</p>'}
    }[key]  || {error: 'Not Found'});
  });
}

module.exports.pageContent = function*(next) {
  if ('GET' != this.method) return yield next;
  this.body = yield getContent(this.params.key);
  return this.body;
};
