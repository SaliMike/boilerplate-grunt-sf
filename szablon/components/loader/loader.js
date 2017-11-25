import $ from 'jquery';

const Loader = {
  // Settings
  settings: {
    target: '.loader',
    timeout: 1000,
  },

  // Init
  init(args) {
    this.settings = $.extend(true, this.settings, args);
    if (this.settings.target.length) {
      this.catchDOM(this.settings, this.afterInit.bind(this));
    }
  },
  catchDOM(settings, callback) {
    const target = $(settings.target);
    this.$target = {
      root: target,
    };

    callback();
  },

  // AfterInit
  afterInit() {
    this.removeLoader();
  },
  removeLoader() {
    this.$target.root.addClass('-loaded');
    setTimeout(this.deleteLoader.bind(this), this.settings.timeout);
  },
  deleteLoader() {
    this.$target.root.remove();
  },
};

export default Loader;
