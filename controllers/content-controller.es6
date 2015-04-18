function getContent(key) {
  return new Promise(function (resolve) {
    resolve({
      'home': '<h3>Home</h3>',
      'about': '<h3>About</h3>'
    }[key] || {error: 'Not Found'});
  });
}

module.exports.pageContent = function*(next) {
  if ('GET' != this.method) return yield next;
  this.body = yield getContent(this.params.key);
  return this.body;
};
