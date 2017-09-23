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
      conf.autoplay = true;
      // conf.loop, conf.volume, conf.muted have not effect on boot
      // api.volume(0, true), api.mute(true, true) have no effect on boot

      common.addClass(root, 'is-background');

      api.on('load', function (_e, _api, video) {
        video.hlsQualities = video.dashQualities = false;
        delete video.qualities;
        delete video.defaultQuality;
      }).on('ready', function(_e, api) {
        if (!b.audio) api.mute(true, true);
      }).on('finish', function(_e, api) {
        // api.conf.loop does not have any effect when set on boot
        if (!conf.playlist || !conf.playlist.length || api.video.is_last) {
          api.resume();
        }
      });

      // Add mask
      var mask = document.createElement('div'),
          maskColor = b.mask || 'rgba(255, 255, 255, 0.7)';
      mask.className = 'fp-mask';
      common.find('.fp-player', root)[0].appendChild(mask);
      try {
        common.css(mask, 'background-color', maskColor);
      } catch (ignore) {
        // IE8 cannot handle rgba
        if (!maskColor.indexOf('rgba')) {
          var rgba = maskColor.split(/\s*[()]\s*/)[1].split(/\s*,\s*/);
          common.css(mask, 'background-color', 'rgb(' + rgba.slice(0, 3).join(',') + ')');
          common.css(mask, 'filter', 'alpha(opacity=' + (parseFloat(rgba[3]) * 100) + ')');
        } else {
          common.css(mask, 'background-color', 'transparent');
        }
      }

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
