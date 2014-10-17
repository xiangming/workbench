(function(d) {
	function n(c, f, g) {
		function b() {
			a.afterLoaded();
			a.settings.hideFramesUntilPreloaded && void 0 !== a.settings.preloader && !1 !== a.settings.preloader && a.frames.show();
			void 0 !== a.settings.preloader && !1 !== a.settings.preloader ? a.settings.hidePreloaderUsingCSS && a.transitionsSupported ? (a.prependPreloadingCompleteTo = !0 === a.settings.prependPreloadingComplete ? a.settings.preloader : d(a.settings.prependPreloadingComplete), a.prependPreloadingCompleteTo.addClass("preloading-complete"), setTimeout(h, a.settings.hidePreloaderDelay)) :
				a.settings.preloader.fadeOut(a.settings.hidePreloaderDelay, function() {
					clearInterval(a.defaultPreloader);
					h()
				}) : h()
		}

		function j(b, c) {
			var f = [];
			if (c)
				for (var e = b; 0 < e; e--) f.push(d("body").find('img[src="' + a.settings.preloadTheseImages[e - 1] + '"]'));
			else
				for (e = b; 0 < e; e--) a.frames.eq(a.settings.preloadTheseFrames[e - 1] - 1).find("img").each(function() {
					f.push(d(this)[0])
				});
			return f
		}

		function e(a, b) {
			function c() {
				var a = d(t),
					f = d(q);
				i && (q.length ? i.reject(k, a, f) : i.resolve(k));
				d.isFunction(b) && b.call(g, k, a, f)
			}

			function f(a,
				b) {
				a.src === e || -1 !== d.inArray(a, v) || (v.push(a), b ? q.push(a) : t.push(a), d.data(a, "imagesLoaded", {
					isBroken: b,
					src: a.src
				}), l && i.notifyWith(d(a), [b, k, d(t), d(q)]), k.length === v.length && (setTimeout(c), k.unbind(".imagesLoaded")))
			}
			var e = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
				g = a,
				i = d.isFunction(d.Deferred) ? d.Deferred() : 0,
				l = d.isFunction(i.notify),
				k = g.find("img").add(g.filter("img")),
				v = [],
				t = [],
				q = [];
			d.isPlainObject(b) && d.each(b, function(a, c) {
				if ("callback" === a) b = c;
				else if (i) i[a](c)
			});
			k.length ? k.bind("load.imagesLoaded error.imagesLoaded", function(a) {
				f(a.target, "error" === a.type)
			}).each(function(a, b) {
				var c = b.src,
					k = d.data(b, "imagesLoaded");
				if (k && k.src === c) f(b, k.isBroken);
				else if (b.complete && void 0 !== b.naturalWidth) f(b, 0 === b.naturalWidth || 0 === b.naturalHeight);
				else if (b.readyState || b.complete) b.src = e, b.src = c
			}) : c()
		}

		function h() {
			function b(c, f) {
				var d, e;
				for (e in f) d = "left" === e || "right" === e ? g[e] : e, c === parseFloat(d) && a._initCustomKeyEvent(f[e])
			}

			function c() {
				a.canvas.on("touchmove.sequence",
					f);
				h = null;
				l = !1
			}

			function f(b) {
				a.settings.swipePreventsDefault && b.preventDefault();
				if (l) {
					var e = h - b.originalEvent.touches[0].pageX,
						b = i - b.originalEvent.touches[0].pageY;
					Math.abs(e) >= a.settings.swipeThreshold ? (c(), 0 < e ? a._initCustomKeyEvent(a.settings.swipeEvents.left) : a._initCustomKeyEvent(a.settings.swipeEvents.right)) : Math.abs(b) >= a.settings.swipeThreshold && (c(), 0 < b ? a._initCustomKeyEvent(a.settings.swipeEvents.down) : a._initCustomKeyEvent(a.settings.swipeEvents.up))
				}
			}

			function e(b) {
				1 === b.originalEvent.touches.length &&
					(h = b.originalEvent.touches[0].pageX, i = b.originalEvent.touches[0].pageY, l = !0, a.canvas.on("touchmove.sequence", f))
			}
			d(a.settings.preloader).remove();
			a.nextButton = a._renderUiElements(a.settings.nextButton, ".sequence-next");
			a.prevButton = a._renderUiElements(a.settings.prevButton, ".sequence-prev");
			a.pauseButton = a._renderUiElements(a.settings.pauseButton, ".sequence-pause");
			a.pagination = a._renderUiElements(a.settings.pagination, ".sequence-pagination");
			void 0 !== a.nextButton && !1 !== a.nextButton && !0 === a.settings.showNextButtonOnInit &&
				a.nextButton.show();
			void 0 !== a.prevButton && !1 !== a.prevButton && !0 === a.settings.showPrevButtonOnInit && a.prevButton.show();
			void 0 !== a.pauseButton && !1 !== a.pauseButton && !0 === a.settings.showPauseButtonOnInit && a.pauseButton.show();
			!1 !== a.settings.pauseIcon ? (a.pauseIcon = a._renderUiElements(a.settings.pauseIcon, ".sequence-pause-icon"), void 0 !== a.pauseIcon && a.pauseIcon.hide()) : a.pauseIcon = void 0;
			void 0 !== a.pagination && !1 !== a.pagination && (a.paginationLinks = a.pagination.children(), a.paginationLinks.on("click.sequence",
				function() {
					var b = d(this).index() + 1;
					a.goTo(b)
				}), !0 === a.settings.showPaginationOnInit && a.pagination.show());
			a.nextFrameID = a.settings.startingFrameID;
			!0 === a.settings.hashTags && (a.frames.each(function() {
				a.frameHashID.push(d(this).prop(a.getHashTagFrom))
			}), a.currentHashTag = location.hash.replace("#", ""), void 0 === a.currentHashTag || "" === a.currentHashTag ? a.nextFrameID = a.settings.startingFrameID : (a.frameHashIndex = d.inArray(a.currentHashTag, a.frameHashID), a.nextFrameID = -1 !== a.frameHashIndex ? a.frameHashIndex +
				1 : a.settings.startingFrameID));
			a.nextFrame = a.frames.eq(a.nextFrameID - 1);
			a.nextFrameChildren = a.nextFrame.children();
			void 0 !== a.pagination && d(a.paginationLinks[a.settings.startingFrameID - 1]).addClass("current");
			a.transitionsSupported ? a.settings.animateStartingFrameIn ? a.settings.reverseAnimationsWhenNavigatingBackwards && a.settings.autoPlayDirection - 1 && a.settings.animateStartingFrameIn ? (a._resetElements(a.transitionPrefix, a.nextFrameChildren, "0s"), a.nextFrame.addClass("animate-out"), a.goTo(a.nextFrameID, -1, !0)) : a.goTo(a.nextFrameID, 1, !0) : (a.currentFrameID = a.nextFrameID, a.settings.moveActiveFrameToTop && a.nextFrame.css("z-index", a.numberOfFrames), a._resetElements(a.transitionPrefix, a.nextFrameChildren, "0s"), a.nextFrame.addClass("animate-in"), a.settings.hashTags && a.settings.hashChangesOnFirstFrame && (a.currentHashTag = a.nextFrame.prop(a.getHashTagFrom), document.location.hash = "#" + a.currentHashTag), setTimeout(function() {
				a._resetElements(a.transitionPrefix, a.nextFrameChildren, "")
			}, 100), a._resetAutoPlay(!0,
				a.settings.autoPlayDelay)) : (a.container.addClass("sequence-fallback"), a.currentFrameID = a.nextFrameID, a.settings.hashTags && a.settings.hashChangesOnFirstFrame && (a.currentHashTag = a.nextFrame.prop(a.getHashTagFrom), document.location.hash = "#" + a.currentHashTag), a.frames.addClass("animate-in"), a.frames.not(":eq(" + (a.nextFrameID - 1) + ")").css({
				display: "none",
				opacity: 0
			}), a._resetAutoPlay(!0, a.settings.autoPlayDelay));
			void 0 !== a.nextButton && a.nextButton.bind("click.sequence", function() {
				a.next()
			});
			void 0 !== a.prevButton &&
				a.prevButton.bind("click.sequence", function() {
					a.prev()
				});
			void 0 !== a.pauseButton && a.pauseButton.bind("click.sequence", function() {
				a.pause(true)
			});
			if (a.settings.keyNavigation) {
				var g = {
					left: 37,
					right: 39
				};
				d(document).bind("keydown.sequence", function(c) {
					var f = String.fromCharCode(c.keyCode);
					if (f > 0 && f <= a.numberOfFrames && a.settings.numericKeysGoToFrames) {
						a.nextFrameID = f;
						a.goTo(a.nextFrameID)
					}
					b(c.keyCode, a.settings.keyEvents);
					b(c.keyCode, a.settings.customKeyEvents)
				})
			}
			a.canvas.on({
				"mouseenter.sequence": function() {
					if (a.settings.pauseOnHover &&
						a.settings.autoPlay && !a.hasTouch) {
						a.isBeingHoveredOver = true;
						a.isHardPaused || a.pause()
					}
				},
				"mouseleave.sequence": function() {
					if (a.settings.pauseOnHover && a.settings.autoPlay && !a.hasTouch) {
						a.isBeingHoveredOver = false;
						a.isHardPaused || a.unpause()
					}
				}
			});
			a.settings.hashTags && d(window).bind("hashchange.sequence", function() {
				var b = location.hash.replace("#", "");
				if (a.currentHashTag !== b) {
					a.currentHashTag = b;
					a.frameHashIndex = d.inArray(a.currentHashTag, a.frameHashID);
					if (a.frameHashIndex !== -1) {
						a.nextFrameID = a.frameHashIndex +
							1;
						a.goTo(a.nextFrameID)
					}
				}
			});
			if (a.settings.swipeNavigation && a.hasTouch) {
				var h, i, l = !1;
				a.canvas.on("touchstart.sequence", e)
			}
		}
		var a = this;
		a.container = d(c);
		a.canvas = a.container.children(".sequence-canvas");
		a.frames = a.canvas.children("li");
		a._modernizrForSequence();
		var c = {
				WebkitTransition: "-webkit-",
				WebkitAnimation: "-webkit-",
				MozTransition: "-moz-",
				"MozAnimation ": "-moz-",
				OTransition: "-o-",
				OAnimation: "-o-",
				msTransition: "-ms-",
				msAnimation: "-ms-",
				transition: "",
				animation: ""
			},
			o = {
				WebkitTransition: "webkitTransitionEnd.sequence",
				WebkitAnimation: "webkitAnimationEnd.sequence",
				MozTransition: "transitionend.sequence",
				MozAnimation: "animationend.sequence",
				OTransition: "otransitionend.sequence",
				OAnimation: "oanimationend.sequence",
				msTransition: "MSTransitionEnd.sequence",
				msAnimation: "MSAnimationEnd.sequence",
				transition: "transitionend.sequence",
				animation: "animationend.sequence"
			};
		a.transitionPrefix = c[ModernizrForSequence.prefixed("transition")];
		a.animationPrefix = c[ModernizrForSequence.prefixed("animation")];
		a.transitionProperties = {};
		a.transitionEnd = o[ModernizrForSequence.prefixed("transition")] + " " + o[ModernizrForSequence.prefixed("animation")];
		a.numberOfFrames = a.frames.length;
		a.transitionsSupported = void 0 !== a.transitionPrefix ? !0 : !1;
		a.hasTouch = "ontouchstart" in window ? !0 : !1;
		a.isPaused = !1;
		a.isBeingHoveredOver = !1;
		a.container.removeClass("sequence-destroyed");
		a.paused = function() {};
		a.unpaused = function() {};
		a.beforeNextFrameAnimatesIn = function() {};
		a.afterNextFrameAnimatesIn = function() {};
		a.beforeCurrentFrameAnimatesOut = function() {};
		a.afterCurrentFrameAnimatesOut =
			function() {};
		a.afterLoaded = function() {};
		a.destroyed = function() {};
		a.settings = d.extend({}, g, f);
		a.settings.preloader = a._renderUiElements(a.settings.preloader, ".sequence-preloader");
		a.isStartingFrame = a.settings.animateStartingFrameIn ? !0 : !1;
		a.settings.unpauseDelay = null === a.settings.unpauseDelay ? a.settings.autoPlayDelay : a.settings.unpauseDelay;
		a.getHashTagFrom = a.settings.hashDataAttribute ? "data-sequence-hashtag" : "id";
		a.frameHashID = [];
		a.direction = a.settings.autoPlayDirection;
		a.settings.hideFramesUntilPreloaded &&
			void 0 !== a.settings.preloader && !1 !== a.settings.preloader && a.frames.hide();
		"-o-" === a.transitionPrefix && (a.transitionsSupported = a._operaTest());
		a.frames.removeClass("animate-in");
		g = a.settings.preloadTheseFrames.length;
		f = a.settings.preloadTheseImages.length;
		!0 === a.settings.windowLoaded && (m = a.settings.windowLoaded);
		void 0 !== a.settings.preloader && !1 !== a.settings.preloader && (0 !== g || 0 !== f) ? (g = j(g), f = j(f, !0), f = d(g.concat(f)), e(f, b)) : !0 === m ? (b(), d(this).unbind("load.sequence")) : d(window).bind("load.sequence",
			function() {
				b();
				d(this).unbind("load.sequence")
			})
	}
	var m = !1;
	d(window).bind("load", function() {
		m = !0
	});
	n.prototype = {
		startAutoPlay: function(c) {
			var f = this,
				c = void 0 === c ? f.settings.autoPlayDelay : c;
			f.unpause();
			f._resetAutoPlay();
			f.autoPlayTimer = setTimeout(function() {
				1 === f.settings.autoPlayDirection ? f.next() : f.prev()
			}, c)
		},
		stopAutoPlay: function() {
			this.pause(!0);
			clearTimeout(this.autoPlayTimer)
		},
		pause: function(c) {
			this.isSoftPaused ? this.unpause() : (void 0 !== this.pauseButton && (this.pauseButton.addClass("paused"),
				void 0 !== this.pauseIcon && this.pauseIcon.show()), this.paused(), this.isSoftPaused = !0, this.isHardPaused = c ? !0 : !1, this.isPaused = !0, this._resetAutoPlay())
		},
		unpause: function(c) {
			void 0 !== this.pauseButton && (this.pauseButton.removeClass("paused"), void 0 !== this.pauseIcon && this.pauseIcon.hide());
			this.isPaused = this.isHardPaused = this.isSoftPaused = !1;
			this.active ? this.delayUnpause = !0 : (!1 !== c && this.unpaused(), this._resetAutoPlay(!0, this.settings.unpauseDelay))
		},
		next: function() {
			id = this.currentFrameID !== this.numberOfFrames ?
				this.currentFrameID + 1 : 1;
			!1 === this.active || void 0 === this.active ? this.goTo(id, 1) : this.goTo(id, 1, !0)
		},
		prev: function() {
			id = 1 === this.currentFrameID ? this.numberOfFrames : this.currentFrameID - 1;
			!1 === this.active || void 0 === this.active ? this.goTo(id, -1) : this.goTo(id, -1, !0)
		},
		goTo: function(c, f, g) {
			var b = this;
			b.nextFrameID = parseFloat(c);
			var j = !0 === g ? 0 : b.settings.transitionThreshold;
			if (b.nextFrameID === b.currentFrameID || b.settings.navigationSkip && b.navigationSkipThresholdActive || !b.settings.navigationSkip && b.active ||
				!b.transitionsSupported && b.active || !b.settings.cycle && 1 === f && b.currentFrameID === b.numberOfFrames || !b.settings.cycle && -1 === f && 1 === b.currentFrameID || b.settings.preventReverseSkipping && b.direction !== f && b.active) return !1;
			b.settings.navigationSkip && b.active && (b.navigationSkipThresholdActive = !0, b.settings.fadeFrameWhenSkipped && b.nextFrame.stop().animate({
				opacity: 0
			}, b.settings.fadeFrameTime), clearTimeout(b.transitionThresholdTimer), setTimeout(function() {
				b.navigationSkipThresholdActive = !1
			}, b.settings.navigationSkipThreshold));
			if (!b.active || b.settings.navigationSkip) {
				b.active = !0;
				b._resetAutoPlay();
				b.direction = void 0 === f ? b.nextFrameID > b.currentFrameID ? 1 : -1 : f;
				b.currentFrame = b.canvas.children(".animate-in");
				b.nextFrame = b.frames.eq(b.nextFrameID - 1);
				b.currentFrameChildren = b.currentFrame.children();
				b.nextFrameChildren = b.nextFrame.children();
				void 0 !== b.pagination && (b.paginationLinks.removeClass("current"), d(b.paginationLinks[b.nextFrameID - 1]).addClass("current"));
				if (b.transitionsSupported)(void 0 !== b.currentFrame.length ? (b.beforeCurrentFrameAnimatesOut(),
						b.settings.moveActiveFrameToTop && b.currentFrame.css("z-index", 1), b._resetElements(b.transitionPrefix, b.nextFrameChildren, "0s"), !b.settings.reverseAnimationsWhenNavigatingBackwards || 1 === b.direction ? (b.nextFrame.removeClass("animate-out"), b._resetElements(b.transitionPrefix, b.currentFrameChildren, "")) : b.settings.reverseAnimationsWhenNavigatingBackwards && -1 === b.direction && (b.nextFrame.addClass("animate-out"), b._reverseTransitionProperties())) : b.isStartingFrame = !1, b.active = !0, b.currentFrame.unbind(b.transitionEnd),
					b.nextFrame.unbind(b.transitionEnd), b.settings.fadeFrameWhenSkipped && b.settings.navigationSkip && b.nextFrame.css("opacity", 1), b.beforeNextFrameAnimatesIn(), b.settings.moveActiveFrameToTop && b.nextFrame.css("z-index", b.numberOfFrames), !b.settings.reverseAnimationsWhenNavigatingBackwards || 1 === b.direction) ? (setTimeout(function() {
					b._resetElements(b.transitionPrefix, b.nextFrameChildren, "");
					b._waitForAnimationsToComplete(b.nextFrame, b.nextFrameChildren, "in");
					(b.afterCurrentFrameAnimatesOut !== "function () {}" ||
						b.settings.transitionThreshold === true && g !== true) && b._waitForAnimationsToComplete(b.currentFrame, b.currentFrameChildren, "out", true, 1)
				}, 50), setTimeout(function() {
					if (b.settings.transitionThreshold === false || b.settings.transitionThreshold === 0 || g === true) {
						b.currentFrame.toggleClass("animate-out animate-in");
						b.nextFrame.addClass("animate-in")
					} else {
						b.currentFrame.toggleClass("animate-out animate-in");
						if (b.settings.transitionThreshold !== true) b.transitionThresholdTimer = setTimeout(function() {
								b.nextFrame.addClass("animate-in")
							},
							j)
					}
				}, 50)) : b.settings.reverseAnimationsWhenNavigatingBackwards && -1 === b.direction && (setTimeout(function() {
					b._resetElements(b.transitionPrefix, b.currentFrameChildren, "");
					b._resetElements(b.transitionPrefix, b.nextFrameChildren, "");
					b._reverseTransitionProperties();
					b._waitForAnimationsToComplete(b.nextFrame, b.nextFrameChildren, "in");
					(b.afterCurrentFrameAnimatesOut !== "function () {}" || b.settings.transitionThreshold === true && g !== true) && b._waitForAnimationsToComplete(b.currentFrame, b.currentFrameChildren, "out",
						true, -1)
				}, 50), setTimeout(function() {
					if (b.settings.transitionThreshold === false || b.settings.transitionThreshold === 0 || g === true) {
						b.currentFrame.removeClass("animate-in");
						b.nextFrame.toggleClass("animate-out animate-in")
					} else {
						b.currentFrame.removeClass("animate-in");
						if (b.settings.transitionThreshold !== true) b.transitionThresholdTimer = setTimeout(function() {
							b.nextFrame.toggleClass("animate-out animate-in")
						}, j)
					}
				}, 50));
				else {
					var e = function() {
						b._setHashTag();
						b.active = false;
						b._resetAutoPlay(true, b.settings.autoPlayDelay)
					};
					switch (b.settings.fallback.theme) {
						case "fade":
							b.frames.css({
								position: "relative"
							});
							b.beforeCurrentFrameAnimatesOut();
							b.currentFrame = b.frames.eq(b.currentFrameID - 1);
							b.currentFrame.animate({
								opacity: 0
							}, b.settings.fallback.speed, function() {
								b.currentFrame.css({
									display: "none",
									"z-index": "1"
								});
								b.afterCurrentFrameAnimatesOut();
								b.beforeNextFrameAnimatesIn();
								b.nextFrame.css({
									display: "block",
									"z-index": b.numberOfFrames
								}).animate({
									opacity: 1
								}, 500, function() {
									b.afterNextFrameAnimatesIn()
								});
								e()
							});
							b.frames.css({
								position: "relative"
							});
							break;
						default:
							var c = {},
								f = {},
								h = {};
							1 === b.direction ? (c.left = "-100%", f.left = "100%") : (c.left = "100%", f.left = "-100%");
							h.left = "0";
							h.opacity = 1;
							b.currentFrame = b.frames.eq(b.currentFrameID - 1);
							b.beforeCurrentFrameAnimatesOut();
							b.currentFrame.animate(c, b.settings.fallback.speed, function() {
								b.currentFrame.css({
									display: "none",
									"z-index": "1"
								});
								b.afterCurrentFrameAnimatesOut()
							});
							b.beforeNextFrameAnimatesIn();
							b.nextFrame.show().css(f);
							b.nextFrame.css({
								display: "block",
								"z-index": b.numberOfFrames
							}).animate(h, b.settings.fallback.speed,
								function() {
									e();
									b.afterNextFrameAnimatesIn()
								})
					}
				}
				b.currentFrameID = b.nextFrameID
			}
		},
		destroy: function(c) {
			this.container.addClass("sequence-destroyed");
			void 0 !== this.nextButton && this.nextButton.unbind("click.sequence");
			void 0 !== this.prevButton && this.prevButton.unbind("click.sequence");
			void 0 !== this.pauseButton && this.pauseButton.unbind("click.sequence");
			void 0 !== this.pagination && this.paginationLinks.unbind("click.sequence");
			d(document).unbind("keydown.sequence");
			this.canvas.unbind("mouseenter.sequence, mouseleave.sequence, touchstart.sequence, touchmove.sequence");
			d(window).unbind("hashchange.sequence");
			this.stopAutoPlay();
			clearTimeout(this.transitionThresholdTimer);
			this.canvas.children("li").remove();
			this.canvas.prepend(this.frames);
			this.frames.removeClass("animate-in animate-out").removeAttr("style");
			this.frames.eq(this.currentFrameID - 1).addClass("animate-in");
			void 0 !== this.nextButton && !1 !== this.nextButton && this.nextButton.hide();
			void 0 !== this.prevButton && !1 !== this.prevButton && this.prevButton.hide();
			void 0 !== this.pauseButton && !1 !== this.pauseButton && this.pauseButton.hide();
			void 0 !== this.pauseIcon && !1 !== this.pauseIcon && this.pauseIcon.hide();
			void 0 !== this.pagination && !1 !== this.pagination && this.pagination.hide();
			void 0 !== c && c();
			this.destroyed();
			this.container.removeData()
		},
		_initCustomKeyEvent: function(c) {
			switch (c) {
				case "next":
					this.next();
					break;
				case "prev":
					this.prev();
					break;
				case "pause":
					this.pause(!0)
			}
		},
		_resetElements: function(c, f, d) {
			f.css(this._prefixCSS(c, {
				"transition-duration": d,
				"transition-delay": d,
				"transition-timing-function": ""
			}))
		},
		_reverseTransitionProperties: function() {
			var c =
				this,
				f = [],
				g = [];
			c.currentFrameChildren.each(function() {
				f.push(parseFloat(d(this).css(c.transitionPrefix + "transition-duration").replace("s", "")) + parseFloat(d(this).css(c.transitionPrefix + "transition-delay").replace("s", "")))
			});
			c.nextFrameChildren.each(function() {
				g.push(parseFloat(d(this).css(c.transitionPrefix + "transition-duration").replace("s", "")) + parseFloat(d(this).css(c.transitionPrefix + "transition-delay").replace("s", "")))
			});
			var b = Math.max.apply(Math, f),
				j = Math.max.apply(Math, g),
				e = b - j,
				h = 0,
				a = 0;
			0 >
				e && !c.settings.preventDelayWhenReversingAnimations ? h = Math.abs(e) : 0 < e && (a = Math.abs(e));
			e = function(a, b, f, e) {
				function g(a) {
					var a = a.split(",")[0],
						b = {
							linear: "cubic-bezier(0.0,0.0,1.0,1.0)",
							ease: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
							"ease-in": "cubic-bezier(0.42, 0.0, 1.0, 1.0)",
							"ease-in-out": "cubic-bezier(0.42, 0.0, 0.58, 1.0)",
							"ease-out": "cubic-bezier(0.0, 0.0, 0.58, 1.0)"
						};
					0 > a.indexOf("cubic-bezier") && (a = b[a]);
					return a
				}
				b.each(function() {
					var b = parseFloat(d(this).css(c.transitionPrefix + "transition-duration").replace("s",
							"")),
						h = parseFloat(d(this).css(c.transitionPrefix + "transition-delay").replace("s", "")),
						i = d(this).css(c.transitionPrefix + "transition-timing-function"); - 1 === i.indexOf("cubic") && (i = g(i));
					if (c.settings.reverseEaseWhenNavigatingBackwards) {
						var l = i.replace("cubic-bezier(", "").replace(")", "").split(",");
						d.each(l, function(a, b) {
							l[a] = parseFloat(b)
						});
						i = "cubic-bezier(" + [1 - l[2], 1 - l[3], 1 - l[0], 1 - l[1]] + ")"
					}
					a["transition-duration"] = b + "s";
					a["transition-delay"] = f - (b + h) + e + "s";
					a["transition-timing-function"] = i;
					d(this).css(c._prefixCSS(c.transitionPrefix,
						a))
				})
			};
			e(c.transitionProperties, c.currentFrameChildren, b, h);
			e(c.transitionProperties, c.nextFrameChildren, j, a)
		},
		_prefixCSS: function(c, f) {
			var d = {},
				b;
			for (b in f) d[c + b] = f[b];
			return d
		},
		_resetAutoPlay: function(c, f) {
			var d = this;
			!0 === c ? d.settings.autoPlay && !d.isSoftPaused && (clearTimeout(d.autoPlayTimer), d.autoPlayTimer = setTimeout(function() {
				1 === d.settings.autoPlayDirection ? d.next() : d.prev()
			}, f)) : clearTimeout(d.autoPlayTimer)
		},
		_renderUiElements: function(c, f) {
			switch (c) {
				case !1:
					break;
				case !0:
					return ".sequence-preloader" ===
						f && this._defaultPreloader(this.container, this.transitionsSupported, this.animationPrefix), d(f, this.container);
				default:
					return d(c, this.container)
			}
		},
		_waitForAnimationsToComplete: function(c, f, g, b, j) {
			var e = this;
			if ("out" === g) var h = function() {
				e.afterCurrentFrameAnimatesOut();
				!0 === e.settings.transitionThreshold && (1 === j ? e.nextFrame.addClass("animate-in") : -1 === j && e.nextFrame.toggleClass("animate-out animate-in"))
			};
			else "in" === g && (h = function() {
				e.afterNextFrameAnimatesIn();
				e._setHashTag();
				e.active = !1;
				!e.isHardPaused &&
					!e.isBeingHoveredOver && (e.delayUnpause ? (e.delayUnpause = !1, e.unpause()) : e.unpause(!1))
			});
			f.data("animationEnded", !1);
			c.bind(e.transitionEnd, function(a) {
				d(a.target).data("animationEnded", !0);
				var b = !0;
				f.each(function() {
					if (!1 === d(this).data("animationEnded")) return b = !1
				});
				b && (c.unbind(e.transitionEnd), h())
			})
		},
		_setHashTag: function() {
			this.settings.hashTags && (this.currentHashTag = this.nextFrame.prop(this.getHashTagFrom), this.frameHashIndex = d.inArray(this.currentHashTag, this.frameHashID), -1 !== this.frameHashIndex &&
				(this.settings.hashChangesOnFirstFrame || !this.isStartingFrame || !this.transitionsSupported) ? (this.nextFrameID = this.frameHashIndex + 1, document.location.hash = "#" + this.currentHashTag) : (this.nextFrameID = this.settings.startingFrameID, this.isStartingFrame = !1))
		},
		_modernizrForSequence: function() {
			window.ModernizrForSequence = function(c, d, g) {
				function b(b, c) {
					for (var d in b) {
						var e = b[d];
						if (!~("" + e).indexOf("-") && a[e] !== g) return "pfx" == c ? e : !0
					}
					return !1
				}

				function j(a, c, d) {
					var e = a.charAt(0).toUpperCase() + a.slice(1),
						f =
						(a + " " + o.join(e + " ") + e).split(" ");
					if ("string" === typeof c || "undefined" === typeof c) c = b(f, c);
					else {
						f = (a + " " + m.join(e + " ") + e).split(" ");
						a: {
							var a = f,
								h;
							for (h in a)
								if (e = c[a[h]], e !== g) {
									c = !1 === d ? a[h] : "function" === typeof e ? e.bind(d || c) : e;
									break a
								}
							c = !1
						}
					}
					return c
				}
				var e = {},
					h = d.documentElement,
					c = d.createElement("modernizrForSequence"),
					a = c.style,
					o = ["Webkit", "Moz", "O", "ms"],
					m = ["webkit", "moz", "o", "ms"],
					c = {},
					n = [],
					s = n.slice,
					p, u = {}.hasOwnProperty,
					r;
				"undefined" !== typeof u && "undefined" !== typeof u.call ? r = function(a, b) {
					return u.call(a,
						b)
				} : r = function(a, b) {
					return b in a && "undefined" === typeof a.constructor.prototype[b]
				};
				Function.prototype.bind || (Function.prototype.bind = function(a) {
					var b = self;
					if ("function" != typeof b) throw new TypeError;
					var c = s.call(arguments, 1),
						d = function() {
							if (self instanceof d) {
								var e = function() {};
								e.prototype = b.prototype;
								var e = new e,
									f = b.apply(e, c.concat(s.call(arguments)));
								return Object(f) === f ? f : e
							}
							return b.apply(a, c.concat(s.call(arguments)))
						};
					return d
				});
				c.svg = function() {
					return !!d.createElementNS && !!d.createElementNS("http://www.w3.org/2000/svg",
						"svg").createSVGRect
				};
				for (var i in c) r(c, i) && (p = i.toLowerCase(), e[p] = c[i](), n.push((e[p] ? "" : "no-") + p));
				e.addTest = function(a, b) {
					if ("object" == typeof a)
						for (var c in a) r(a, c) && e.addTest(c, a[c]);
					else {
						a = a.toLowerCase();
						if (e[a] !== g) return e;
						b = "function" == typeof b ? b() : b;
						enableClasses && (h.className += " " + (b ? "" : "no-") + a);
						e[a] = b
					}
					return e
				};
				a.cssText = "";
				return c = null, e._version = "2.6.1", e._domPrefixes = m, e._cssomPrefixes = o, e.testProp = function(a) {
					return b([a])
				}, e.testAllProps = j, e.prefixed = function(a, b, c) {
					return b ?
						j(a, b, c) : j(a, "pfx")
				}, e
			}(self, self.document)
		},
		_defaultPreloader: function(c, f, g) {
			d("head").append("<style>.sequence-preloader{height: 100%;position: absolute;width: 100%;z-index: 999999;}@" + g + "keyframes preload{0%{opacity: 1;}50%{opacity: 0;}100%{opacity: 1;}}.sequence-preloader .preloading .circle{fill: #ff9442;display: inline-block;height: 12px;position: relative;top: -50%;width: 12px;" + g + "animation: preload 1s infinite; animation: preload 1s infinite;}.preloading{display:block;height: 12px;margin: 0 auto;top: 50%;margin-top:-6px;position: relative;width: 48px;}.sequence-preloader .preloading .circle:nth-child(2){" +
				g + "animation-delay: .15s; animation-delay: .15s;}.sequence-preloader .preloading .circle:nth-child(3){" + g + "animation-delay: .3s; animation-delay: .3s;}.preloading-complete{opacity: 0;visibility: hidden;" + g + "transition-duration: 1s; transition-duration: 1s;}div.inline{background-color: #ff9442; margin-right: 4px; float: left;}</style>");
			c.prepend('<div class="sequence-preloader"><svg class="preloading" xmlns="http://www.w3.org/2000/svg"><circle class="circle" cx="6" cy="6" r="6" /><circle class="circle" cx="22" cy="6" r="6" /><circle class="circle" cx="38" cy="6" r="6" /></svg></div>');
			!ModernizrForSequence.svg && !f ? (d(".sequence-preloader").prepend('<div class="preloading"><div class="circle inline"></div><div class="circle inline"></div><div class="circle inline"></div></div>'), setInterval(function() {
				d(".sequence-preloader .circle").fadeToggle(500)
			}, 500)) : f || setInterval(function() {
				d(".sequence-preloader").fadeToggle(500)
			}, 500)
		},
		_operaTest: function() {
			d("body").append('<span id="sequence-opera-test"></span>');
			var c = d("#sequence-opera-test");
			c.css("-o-transition", "1s");
			if ("1s" !==
				c.css("-o-transition")) return c.remove(), !1;
			c.remove();
			return !0
		}
	};
	var w = {
		startingFrameID: 1,
		cycle: !0,
		animateStartingFrameIn: !1,
		transitionThreshold: !1,
		reverseAnimationsWhenNavigatingBackwards: !0,
		reverseEaseWhenNavigatingBackwards: !0,
		preventDelayWhenReversingAnimations: !1,
		moveActiveFrameToTop: !0,
		windowLoaded: !1,
		autoPlay: !1,
		autoPlayDirection: 1,
		autoPlayDelay: 5E3,
		navigationSkip: !0,
		navigationSkipThreshold: 250,
		fadeFrameWhenSkipped: !0,
		fadeFrameTime: 150,
		preventReverseSkipping: !1,
		nextButton: !1,
		showNextButtonOnInit: !0,
		prevButton: !1,
		showPrevButtonOnInit: !0,
		pauseButton: !1,
		unpauseDelay: null,
		pauseOnHover: !0,
		pauseIcon: !1,
		showPauseButtonOnInit: !0,
		pagination: !1,
		showPaginationOnInit: !0,
		preloader: !1,
		preloadTheseFrames: [1],
		preloadTheseImages: [],
		hideFramesUntilPreloaded: !0,
		prependPreloadingComplete: !0,
		hidePreloaderUsingCSS: !0,
		hidePreloaderDelay: 0,
		keyNavigation: !0,
		numericKeysGoToFrames: !0,
		keyEvents: {
			left: "prev",
			right: "next"
		},
		customKeyEvents: {},
		swipeNavigation: !0,
		swipeThreshold: 20,
		swipePreventsDefault: !1,
		swipeEvents: {
			left: "prev",
			right: "next",
			up: !1,
			down: !1
		},
		hashTags: !1,
		hashDataAttribute: !1,
		hashChangesOnFirstFrame: !1,
		fallback: {
			theme: "slide",
			speed: 500
		}
	};
	d.fn.sequence = function(c) {
		return this.each(function() {
			d.data(this, "sequence") || d.data(this, "sequence", new n(d(this), c, w))
		})
	}
})(jQuery);
(function(d, y, z) {
	function E(a, b, j, c) {
		if ("d" != j && A(a)) {
			var f = F.exec(b),
				e = "auto" === a.css(j) ? 0 : a.css(j),
				e = "string" == typeof e ? v(e) : e;
			"string" == typeof b && v(b);
			var c = !0 === c ? 0 : e,
				g = a.is(":hidden"),
				k = a.translation();
			"left" == j && (c = parseInt(e, 10) + k.x);
			"right" == j && (c = parseInt(e, 10) + k.x);
			"top" == j && (c = parseInt(e, 10) + k.y);
			"bottom" == j && (c = parseInt(e, 10) + k.y);
			if (!f && "show" == b) {
				if (c = 1, g) {
					elem = a[0];
					if (elem.style && (display = elem.style.display, !d._data(elem, "olddisplay") && "none" === display && (display = elem.style.display =
						""), "" === display && "none" === d.css(elem, "display") && d._data(elem, "olddisplay", G(elem.context.tagName)), "" === display || "none" === display)) elem.style.display = d._data(elem, "olddisplay") || "";
					a.css("opacity", 0)
				}
			} else !f && "hide" == b && (c = 0);
			return f ? (a = parseFloat(f[2]), f[1] && (a = ("-=" === f[1] ? -1 : 1) * a + parseInt(c, 10)), f[3] && "px" != f[3] && (a += f[3]), a) : c
		}
	}

	function H(a, b, j, c, f, e, g, k) {
		var l = a.data(o),
			l = l && !n(l) ? l : d.extend(!0, {}, I),
			p = f;
		if (-1 < d.inArray(b, w)) {
			var i = l.meta,
				m = v(a.css(b)) || 0,
				q = b + "_o",
				p = f - m;
			i[b] = p;
			i[q] = "auto" ==
				a.css(b) ? 0 + p : m + p || 0;
			l.meta = i;
			g && 0 === p && (p = 0 - i[q], i[b] = p, i[q] = 0)
		}
		return a.data(o, J(a, l, b, j, c, p, e, g, k))
	}

	function J(a, b, d, c, f, e, g, k, l) {
		var p = !1,
			g = !0 === g && !0 === k,
			b = b || {};
		b.original || (b.original = {}, p = !0);
		b.properties = b.properties || {};
		b.secondary = b.secondary || {};
		for (var k = b.meta, o = b.original, m = b.properties, q = b.secondary, h = i.length - 1; 0 <= h; h--) {
			var r = i[h] + "transition-property",
				s = i[h] + "transition-duration",
				n = i[h] + "transition-timing-function",
				d = g ? i[h] + "transform" : d;
			p && (o[r] = a.css(r) || "", o[s] = a.css(s) || "", o[n] =
				a.css(n) || "");
			q[d] = g ? !0 === l || !0 === x && !1 !== l && B ? "translate3d(" + k.left + "px, " + k.top + "px, 0)" : "translate(" + k.left + "px," + k.top + "px)" : e;
			m[r] = (m[r] ? m[r] + "," : "") + d;
			m[s] = (m[s] ? m[s] + "," : "") + c + "ms";
			m[n] = (m[n] ? m[n] + "," : "") + f
		}
		return b
	}

	function K(a) {
		for (var b in a)
			if (("width" == b || "height" == b) && ("show" == a[b] || "hide" == a[b] || "toggle" == a[b])) return !0;
		return !1
	}

	function n(a) {
		for (var b in a) return !1;
		return !0
	}

	function G(a) {
		var a = a.toUpperCase(),
			b = {
				LI: "list-item",
				TR: "table-row",
				TD: "table-cell",
				TH: "table-cell",
				CAPTION: "table-caption",
				COL: "table-column",
				COLGROUP: "table-column-group",
				TFOOT: "table-footer-group",
				THEAD: "table-header-group",
				TBODY: "table-row-group"
			};
		return "string" == typeof b[a] ? b[a] : "block"
	}

	function v(a) {
		return parseFloat(a.replace(a.match(/\D+$/), ""))
	}

	function A(a) {
		var b = !0;
		a.each(function(a, d) {
			return b = b && d.ownerDocument
		});
		return b
	}

	function L(a, b, j) {
		if (!A(j)) return !1;
		var c = -1 < d.inArray(a, M);
		if (("width" == a || "height" == a || "opacity" == a) && parseFloat(b) === parseFloat(j.css(a))) c = !1;
		return c
	}
	var M = "top,right,bottom,left,opacity,height,width".split(","),
		w = ["top", "right", "bottom", "left"],
		i = ["-webkit-", "-moz-", "-o-", ""],
		N = ["avoidTransforms", "useTranslate3d", "leaveTransforms"],
		F = /^([+-]=)?([\d+-.]+)(.*)$/,
		O = /([A-Z])/g,
		I = {
			secondary: {},
			meta: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		},
		o = "jQe",
		C = null,
		t = !1,
		u = (document.body || document.documentElement).style,
		D = void 0 !== u.WebkitTransition || void 0 !== u.MozTransition || void 0 !== u.OTransition || void 0 !== u.transition,
		B = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix,
		x = B;
	d.expr && d.expr.filters && (C = d.expr.filters.animated,
		d.expr.filters.animated = function(a) {
			return d(a).data("events") && d(a).data("events")["webkitTransitionEnd oTransitionEnd transitionend"] ? !0 : C.call(this, a)
		});
	d.extend({
		toggle3DByDefault: function() {
			return x = !x
		},
		toggleDisabledByDefault: function() {
			return t = !t
		},
		setDisabledByDefault: function(a) {
			return t = a
		}
	});
	d.fn.translation = function() {
		if (!this[0]) return null;
		var a = window.getComputedStyle(this[0], null),
			b = {
				x: 0,
				y: 0
			};
		if (a)
			for (var d = i.length - 1; d >= 0; d--) {
				var c = a.getPropertyValue(i[d] + "transform");
				if (c && /matrix/i.test(c)) {
					a =
						c.replace(/^matrix\(/i, "").split(/, |\)$/g);
					b = {
						x: parseInt(a[4], 10),
						y: parseInt(a[5], 10)
					};
					break
				}
			}
		return b
	};
	d.fn.animate = function(a, b, j, c) {
		var a = a || {},
			f = !(typeof a.bottom !== "undefined" || typeof a.right !== "undefined"),
			e = d.speed(b, j, c),
			g = 0,
			k = function() {
				g--;
				g === 0 && typeof e.complete === "function" && e.complete.apply(this, arguments)
			};
		return (typeof a.avoidCSSTransitions !== "undefined" ? a.avoidCSSTransitions : t) === true || !D || n(a) || K(a) || e.duration <= 0 || e.step ? y.apply(this, arguments) : this[e.queue === true ? "queue" : "each"](function() {
			var b =
				d(this),
				c = d.extend({}, e),
				j = function(c) {
					var e = b.data(o) || {
							original: {}
						},
						g = {};
					if (c.eventPhase == 2) {
						if (a.leaveTransforms !== true) {
							for (c = i.length - 1; c >= 0; c--) g[i[c] + "transform"] = "";
							if (f && typeof e.meta !== "undefined")
								for (var c = 0, h; h = w[c]; ++c) {
									g[h] = e.meta[h + "_o"] + "px";
									d(this).css(h, g[h])
								}
						}
						b.unbind("webkitTransitionEnd oTransitionEnd transitionend").css(e.original).css(g).data(o, null);
						if (a.opacity === "hide") {
							elem = b[0];
							if (elem.style) {
								display = d.css(elem, "display");
								display !== "none" && !d._data(elem, "olddisplay") &&
									d._data(elem, "olddisplay", display);
								elem.style.display = "none"
							}
							b.css("opacity", "")
						}
						k.call(this)
					}
				},
				m = {
					bounce: "cubic-bezier(0.0, 0.35, .5, 1.3)",
					linear: "linear",
					swing: "ease-in-out",
					easeInQuad: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
					easeInCubic: "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
					easeInQuart: "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
					easeInQuint: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
					easeInSine: "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
					easeInExpo: "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
					easeInCirc: "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
					easeInBack: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
					easeOutQuad: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
					easeOutCubic: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
					easeOutQuart: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
					easeOutQuint: "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
					easeOutSine: "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
					easeOutExpo: "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
					easeOutCirc: "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
					easeOutBack: "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
					easeInOutQuad: "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
					easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
					easeInOutQuart: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
					easeInOutQuint: "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
					easeInOutSine: "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
					easeInOutExpo: "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
					easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
					easeInOutBack: "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
				},
				q = {},
				m = m[c.easing || "swing"] ? m[c.easing ||
					"swing"] : c.easing || "swing",
				h;
			for (h in a)
				if (d.inArray(h, N) === -1) {
					var r = d.inArray(h, w) > -1,
						s = E(b, a[h], h, r && a.avoidTransforms !== true);
					L(h, s, b) ? H(b, h, c.duration, m, s, r && a.avoidTransforms !== true, f, a.useTranslate3d) : q[h] = a[h]
				}
			b.unbind("webkitTransitionEnd oTransitionEnd transitionend");
			if ((h = b.data(o)) && !n(h) && !n(h.secondary)) {
				g++;
				b.css(h.properties);
				var t = h.secondary;
				setTimeout(function() {
					b.bind("webkitTransitionEnd oTransitionEnd transitionend", j).css(t)
				})
			} else c.queue = false; if (!n(q)) {
				g++;
				y.apply(b, [q, {
					duration: c.duration,
					easing: d.easing[c.easing] ? c.easing : d.easing.swing ? "swing" : "linear",
					complete: k,
					queue: c.queue
				}])
			}
			return true
		})
	};
	d.fn.animate.defaults = {};
	d.fn.stop = function(a, b, j) {
		if (!D) return z.apply(this, [a, b]);
		a && this.queue([]);
		this.each(function() {
			var c = d(this),
				f = c.data(o);
			if (f && !n(f)) {
				var e, g = {};
				if (b) {
					g = f.secondary;
					if (!j && typeof f.meta.left_o !== void 0 || typeof f.meta.top_o !== void 0) {
						g.left = typeof f.meta.left_o !== void 0 ? f.meta.left_o : "auto";
						g.top = typeof f.meta.top_o !== void 0 ? f.meta.top_o : "auto";
						for (e = i.length - 1; e >= 0; e--) g[i[e] + "transform"] = ""
					}
				} else if (!n(f.secondary)) {
					var k = window.getComputedStyle(c[0], null);
					if (k)
						for (var l in f.secondary)
							if (f.secondary.hasOwnProperty(l)) {
								l = l.replace(O, "-$1").toLowerCase();
								g[l] = k.getPropertyValue(l);
								if (!j && /matrix/i.test(g[l])) {
									e = g[l].replace(/^matrix\(/i, "").split(/, |\)$/g);
									g.left = parseFloat(e[4]) + parseFloat(c.css("left")) + "px" || "auto";
									g.top = parseFloat(e[5]) + parseFloat(c.css("top")) + "px" || "auto";
									for (e = i.length - 1; e >= 0; e--) g[i[e] + "transform"] = ""
								}
							}
				}
				c.unbind("webkitTransitionEnd oTransitionEnd transitionend");
				c.css(f.original).css(g).data(o, null)
			} else z.apply(c, [a, b])
		});
		return this
	}
})(jQuery, jQuery.fn.animate, jQuery.fn.stop);
var sequence, hidden, Homepage = {
	initAnimation: function() {
		sequence = $j("#sequence").sequence({
			autoPlay: !0,
			autoPlayDelay: 3E3,
			animateStartingFrameIn: !0,
			preventDelayWhenReversingAnimations: !1,
			navigationSkip: !1,
			cycle: !0
		}).data("sequence");
		sequence.beforeNextFrameAnimatesIn = function() {
			sequence.currentFrameID && $j("#sequence_" + sequence.currentFrameID).removeClass("active");
			$j("#sequence_" + sequence.nextFrameID).addClass("active")
		};
		$j("#bl-white-2").addClass("a-bl-white-2");
		$j("#bl-white-1").addClass("a-bl-white-1");
		$j("#bl-purple").addClass("a-bl-purple");
		$j("#bl-blue").addClass("a-bl-blue");
		$j("#bl-green").addClass("a-bl-green");
		$j("#br-white-3").addClass("a-br-white-3");
		$j("#br-white-2").addClass("a-br-white-2");
		$j("#br-white-1").addClass("a-br-white-1");
		$j("#br-green").addClass("a-br-green");
		$j("#br-purple").addClass("a-br-purple");
		$j("#br-blue").addClass("a-br-blue");
		$j("#btn_login").on("mousedown", function() {
			sequence.pause(!0)
		});
		sessionStorage.isPaused = "false";
		var a;
		"undefined" !== typeof document.hidden ?
			(hidden = "hidden", a = "visibilitychange") : "undefined" !== typeof document.mozHidden ? (hidden = "mozHidden", a = "mozvisibilitychange") : "undefined" !== typeof document.msHidden ? (hidden = "msHidden", a = "msvisibilitychange") : "undefined" !== typeof document.webkitHidden && (hidden = "webkitHidden", a = "webkitvisibilitychange");
		"undefined" === typeof document.addEventListener || "undefined" === typeof hidden || document.addEventListener(a, Homepage.handleVisibilityChange, !1)
	},
	initUI: function() {
		"undefined" == typeof i18n ? setTimeout(Homepage.initUI,
			100) : MM.utils.reallyBadBrowser() ? MM.ui.dialogs.dialogBrowserWarning() : (MM.ui.buildLanguagePopover(), MM.utils.Social.loadLazy(), _("devices") && setInterval(Homepage.switchDevice, 3E3))
	},
	handleVisibilityChange: function() {
		document[hidden] ? ($j("#content-header").removeClass("active"), $j("#content-header").addClass("inactive")) : "true" !== sessionStorage.isPaused && ($j("#content-header").removeClass("inactive"), $j("#content-header").addClass("active"))
	},
	switchDevice: function() {
		var a = $("devices"),
			b = ["android",
				"ipad", "iphone"
			],
			c = a.className.split(" ").last();
		Effect.Fade(a, {
			afterFinish: function() {
				a.removeClassName(c);
				var d = b.indexOf(c) + 1;
				a.addClassName(b[d >= b.length ? 0 : d]);
				Effect.Appear(a)
			}
		})
	}
};
window._mm_file_versions = window._mm_file_versions || {};
_mm_file_versions['bin/home.js'] = '9dcef21e3538981b414597e4a3c13637c8635d94';