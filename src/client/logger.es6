module.exports = {
  log: function (name, ...args) {
    const log = console[name] || console.log;
    log.apply(console, args);
  }
};
