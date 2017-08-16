import "babel-polyfill";

/**
 * picture要素をie9でも使えるようにするポリフィル
 */
import picuturefill from './_lib/_picturefill';

picuturefill();

/**
 * テキストからページ遷移
 */
import LocationChangeFromTxt from './_module/_LocationChangeFromTxt';

const locationChangeFromTxt = new LocationChangeFromTxt();
locationChangeFromTxt.init();

/**
 * スムーススクロール
 */
import SmScroll from './_module/_SmScroll';

const smScroll = new SmScroll();
smScroll.init();


const NONBAL_PROVJECT = NONBAL_PROVJECT || {};
NONBAL_PROVJECT.COMMON = {};

(function($){
	NONBAL_PROVJECT.COMMON.TOGGLE_SHOW_GNAV = function() {
		let stateOpen    = false;
		const $window      = $(window);
		const $body        = $('body');
		const $gNav        = $('#js-gNav');
		const $trigger     = $('#js-gNav-trigger');
		const $bg          = $('#js-gNav-bg');
		const BREAK_POINT  = 1000;
		const CLASS_ACTIVE = 'js-active';

		const checkResize = function() {
			$window.on('resize.gNav', function() {
				if (stateOpen && window.innerWidth > BREAK_POINT) {
					changeClass();
				}
			});
		};

		const changeClass = function() {
			if (stateOpen) {
				stateOpen = false;
				$gNav.removeClass(CLASS_ACTIVE);
				$trigger.removeClass(CLASS_ACTIVE);
				$bg.removeClass(CLASS_ACTIVE);
				$window.off('resize.gNav');
			} else {
				stateOpen = true;
				$gNav.addClass(CLASS_ACTIVE);
				$trigger.addClass(CLASS_ACTIVE);
				$bg.addClass(CLASS_ACTIVE);
				checkResize();
			}
		};

		const init = function() {
			$trigger.on('click', function() {
				changeClass();
			});
			$bg.on('click', function() {
				changeClass();
			});
		};

		init();
	};

	// NONBAL_PROVJECT.COMMON.SMOOTH_SCROLL = function(options) {
	// 	var selector  = '',
	// 		hrefData  = '',
	// 		targetPos = 0,
	// 		targetObj = '';

	// 	var defaults = {
	// 		easing      : 'swing',
	// 		duration    : 400,
	// 		positioning : 0,
	// 		callback    : function () {}
	// 	};
	// 	var setting = $.extend(defaults, options);

	// 	if (navigator.userAgent.match(/webkit/i)) {
	// 		targetObj = 'body';
	// 	} else {
	// 		targetObj = 'html';
	// 	}
	// 	$(setting.selector).on('click', function (event) {
	// 		hrefData = $(this).attr('href');
	// 		if (hrefData.indexOf('#') !== 0 || $(hrefData).length === 0) { return; }
	// 		event.preventDefault();
	// 		targetPos = $(hrefData).offset().top + setting.positioning;
	// 		$(targetObj).animate({
	// 			scrollTop : targetPos
	// 		}, setting.duration, setting.easing, setting.callback);
	// 	});
	// };

	// NONBAL_PROVJECT.COMMON.TOGGLE_SHOW_GNAV();
	// NONBAL_PROVJECT.COMMON.SMOOTH_SCROLL({
	// 	selector: '.js-smoothScroll',
	// 	positioning: -60
	// });
})(jQuery);