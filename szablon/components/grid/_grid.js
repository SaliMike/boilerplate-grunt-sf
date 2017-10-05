var grid = new (function () {
  var $window = $(window);
  var $body = $('body');

  $(document).ready(function () {
    init();
  });

  function init () {
    bindEvents();
  }

  function bindEvents(){
    $(window).smartresize(function () {
      events.emit('window smartresize', getDimensions());
    });
    $(window).resize(function () {
      events.emit('window resize', getDimensions());
    });
    events.on('disable page scroll', disableScroll);
    events.on('enable page scroll', enableScroll);
  }

  function getDimensions() {
    var windowWidth = getWindowWidth();
    var windowHeight = getWindowHeight();
    var bodyWidth = getBodyWidth();
    var bodyHeight = getBodyHeight();
    return {
      windowWidth: windowWidth,
      windowHeight: windowHeight,
      bodyWidth: bodyWidth,
      bodyHeight: bodyHeight
    };
  }

  function disableScroll() {
    $body.css({
      overflow: 'hidden',
      height: '100%'
    });
  }

  function enableScroll() {
    $body.css({
      overflow: 'auto',
      height: 'auto'
    });
  }

  function getWindowWidth() {
    return $window.width();
  }

  function getWindowHeight() {
    return $window.height();
  }
  function getBodyWidth() {
    return $body.width();
  }

  function getBodyHeight() {
    return $body.height();
  }

  return {
    windowWidth: getWindowWidth,
    windowHeight: getWindowHeight,
    bodyWidth: getBodyWidth,
    bodyHeight: getBodyHeight,
    dimensions: getDimensions
  }
})();