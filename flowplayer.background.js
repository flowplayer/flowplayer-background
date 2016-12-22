/*!

   Background video plugin for Flowplayer HTML5

   Copyright (c) 2016, Flowplayer Drive Oy

   Released under the MIT License: https://opensource.org/licenses/MIT

*/

(function() {
  var extension = function(flowplayer) {
    var common = flowplayer.common
      , bean = flowplayer.bean;
    flowplayer(function(api, root) {
      if (!api.conf.background) return;
      api.conf.autoplay = api.conf.loop = api.conf.muted = true;
      common.addClass(root, 'is-background');

      var b = api.conf.background;
      if (!b.audio) {
        api.volume(0, true);
        api.one('progress', function () { api.volume(0, true); });
      }
      api.on('finish', function() { api.resume(); });

      // Add mask
      var mask = document.createElement('div');
      mask.className = 'fp-mask';
      common.find('.fp-player', root)[0].appendChild(mask);
      common.css(mask, 'background-color', b.mask || 'rgba(255, 255, 255, 0.7)');

      // Make sure container element grows to at least video size
      var container = root.parentNode;
      function setMinHeight() {
        common.css(container, 'min-height', common.height(root) + 'px');
      }
      setMinHeight();
      bean.on(window, 'resize', setMinHeight);
    });
  };

  if (typeof module === 'object' && module.exports) module.exports = extension;
  else if (typeof flowplayer === 'function') extension(window.flowplayer);
})();
