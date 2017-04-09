/*!

   Background video plugin for Flowplayer HTML5

   Copyright (c) 2016-2017, Flowplayer Drive Oy

   Released under the MIT License: https://opensource.org/licenses/MIT

*/

(function() {
  var extension = function(flowplayer) {
    var common = flowplayer.common
      , bean = flowplayer.bean;
    flowplayer(function(api, root) {
      var conf = api.conf,
          b = conf.background;
      if (!b) return;
      conf.autoplay = conf.loop = conf.muted = true;
      common.addClass(root, 'is-background');

      if (!b.audio) {
        api.volume(0, true);
        api.one('progress', function () { api.volume(0, true); });
      }
      api.on('load', function (_e, _api, video) {
        video.hlsQualities = video.dashQualities = false;
        delete video.qualities;
        delete video.defaultQuality;
      }).on('finish', function(_e, api) {
        // api.conf.loop does not have any effect when set on boot
        if (!conf.playlist || !conf.playlist.length || api.video.is_last) {
          api.resume();
        }
      });

      // Add mask
      var mask = document.createElement('div');
      mask.className = 'fp-mask';
      common.find('.fp-player', root)[0].appendChild(mask);
      common.css(mask, 'background-color', b.mask || 'rgba(255, 255, 255, 0.7)');

      // Make sure container element grows to at least video size
      function setMinHeight() {
        common.css(root.parentNode, 'min-height', common.height(root) + 'px');
      }
      setMinHeight();
      bean.on(window, 'resize', setMinHeight);
    });
  };

  if (typeof module === 'object' && module.exports) module.exports = extension;
  else if (typeof flowplayer === 'function') extension(window.flowplayer);
})();
