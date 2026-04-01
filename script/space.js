/**
 * Module that registers spaaaaaaaaace!
 */
var Space = {	
	SHIP_SPEED: 3,
	BASE_ASTEROID_DELAY: 500,
	BASE_ASTEROID_SPEED: 1500,
	FTB_SPEED: 60000,
	STAR_WIDTH: 3000,
	STAR_HEIGHT: 3000,
	NUM_STARS: 200,
	STAR_SPEED: 60000,
	FRAME_DELAY: 100,
	stars: null,
	backStars: null,
	ship: null,
	lastMove: null,
	done: false,
	shipX: null,
	shipY: null,
	
	hull: 0,
	
	// ═══════════════════════════════════════
	// 天劫配置 v2.0 - 修仙化
	// ═══════════════════════════════════════
	
	// 天雷文字符号（随高度变化）
	THUNDER_CHARS: ['☁', '⚡', '☀', '辰', '玄', '雷', '劫', '渊', '虚'],
	
	// 天雷预警文案
	THUNDER_WARNING: [
		'天劫将至...',
		'乌云在凝聚...',
		'天雷锁定你了...',
		'来了！'
	],
	
	// 天雷击中文案
	THUNDER_IMPACT: [
		'天雷击中道基！',
		'护道之物在震颤！',
		'疼。但不能停。',
		'金光一闪——经脉剧痛。',
		'金丹在哀鸣。',
		'灵气溃散！',
		'道基受损！'
	],
	
	// 高度层级修仙化名称
	ALTITUDE_TITLES: {
		0: '登天路',
		5: '云海',
		10: '劫云',
		20: '天雷',
		30: '九重',
		40: '虚空',
		50: '飞升'
	},
	
	// 高度阶段叙事
	ALTITUDE_NARRATIVES: [
		{ altitude: 0,  texts: ['天舟刺穿云层。地面在远去。', '你回头看了一眼。营地已经看不见了。'] },
		{ altitude: 3,  texts: ['灵气越来越稀薄。', '末法时代的虚空，本该如此。'] },
		{ altitude: 6,  texts: ['云层变成了黑色。', '不是云。是劫云。'] },
		{ altitude: 9,  texts: ['第一道天雷落下。试探性的。但来得很准。'] },
		{ altitude: 12, texts: ['一道接一道。你感到——它在看你。'] },
		{ altitude: 15, texts: ['第二道比第一道重。'] },
		{ altitude: 18, texts: ['第三道。护道之物在尖叫——但还能撑住。'] },
		{ altitude: 21, texts: ['第四道落下。世界在你周围碎裂。'] },
		{ altitude: 24, texts: ['第五道。你想起了营地。'] },
		{ altitude: 27, texts: ['第六道。这一下打在了神识上。'] },
		{ altitude: 30, texts: ['第七道。护道之物彻底碎了。'] },
		{ altitude: 33, texts: ['你只能靠身法了。'] },
		{ altitude: 36, texts: ['第八道。下一道——躲不过去。'] },
		{ altitude: 39, texts: ['第九道天雷悬在空中。比任何东西都亮。'] },
		{ altitude: 42, texts: ['不是等待。是审判。'] },
		{ altitude: 45, texts: ['第九道天雷落下。'] },
		{ altitude: 48, texts: ['你感到什么东西从身体中剥离。是凡躯。是执念。是末法。'] },
		{ altitude: 50, texts: ['你飞升了。'] },
		{ altitude: 55, texts: ['在末法时代的废墟之中。有人——飞升了。'] }
	],
	_lastAltitudeNarrativeIndex: -1,
	
	// 渡劫中的随机内心独白
	RANDOM_THOUGHTS: [
		'还能感觉到痛。还好。',
		'老散修现在会在做什么？',
		'营地里的火还在烧吗？',
		'这就是天劫。好像也没有特别。',
		'不疼……才奇怪吧。',
		'下一道……会是怎样的？',
		'金丹……撑住啊。',
		'这天空……真好看。',
		'继续。继续。继续。',
		'火……还在烧……'
	],
	
	// 结局文案
	ENDING_SUCCESS: [
		'第九道天雷落下。',
		'不是击打。是——穿透。',
		'天雷击穿了天舟，也击穿了什么更深的东西。',
		'然后，一切静止。',
		'他站在虚空里，周围什么都没有。',
		'不冷，不热，不痛，不怕。',
		'渡劫——成了。',
		'他不知道这意味着什么。',
		'这个世界在末法之中。',
		'渡劫之后，也没有宗门来迎，没有天道为你开道。',
		'只有虚空，和一片奇怪的宁静。',
		'那也够了。'
	],
	
	ENDING_FAIL: [
		'第九道天雷落下。',
		'你没有躲过。或者说——你知道躲不过。',
		'你选择了承受。',
		'金丹碎裂。经脉断裂。神识溃散。',
		'天舟开始下坠。',
		'他想起营地里的火——',
		'想起老散修最后的点头——',
		'想起添灵晶的声音——',
		'对不起。',
		'他活过了末法时代最难的五十年。',
		'守过火，守过人。',
		'这也是一种活法。',
		'只是——不是这种。'
	],
	
	name: "Space",
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Create the Space panel
		this.panel = $('<div>').attr('id', "spacePanel")
			.addClass('location')
			.appendTo('#outerSlider');
		
		// Create the ship
		Space.ship = $('<div>').text("@").attr('id', 'ship').appendTo(this.panel);
		
		// Create the hull display
		var h = $('<div>').attr('id', 'hullRemaining').appendTo(this.panel);
		$('<div>').addClass('row_key').text(_('hull: ')).appendTo(h);
		$('<div>').addClass('row_val').appendTo(h);
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Space.handleStateUpdates);
	},
	
	options: {}, // Nothing for now
	
	onArrival: function() {
		Space.done = false;
		Engine.keyLock = false;
		Space.hull = Ship.getMaxHull();
		Space.altitude = 0;
		Space.setTitle();
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_SPACE);
		Space.updateHull();
		
		Space.up = 
		Space.down = 
		Space.left = 
		Space.right = false;
		
		Space.ship.css({
			top: '350px',
			left: '350px'
		});
		Space.startAscent();
		Space._shipTimer = setInterval(Space.moveShip, 33);
		Space._volumeTimer = setInterval(Space.lowerVolume, 1000);
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_SPACE);
		
		// 修仙化：随机内心独白计时器
		Space._thoughtTimer = setInterval(Space.showRandomThought, 8000);
	},
	
	// 显示随机内心独白
	showRandomThought: function() {
		if (Space.done || Engine.keyLock) return;
		if (Space.altitude < 5) return; // 前5层不显示
		
		var thought = Space.RANDOM_THOUGHTS[Math.floor(Math.random() * Space.RANDOM_THOUGHTS.length)];
		Notifications.notify(Space, thought, false, 3000);
	},
	
	// 显示高度阶段叙事
	showAltitudeNarrative: function() {
		var currentIndex = -1;
		for (var i = Space.ALTITUDE_NARRATIVES.length - 1; i >= 0; i--) {
			if (Space.altitude >= Space.ALTITUDE_NARRATIVES[i].altitude) {
				currentIndex = i;
				break;
			}
		}
		if (currentIndex === Space._lastAltitudeNarrativeIndex || currentIndex === -1) return;
		Space._lastAltitudeNarrativeIndex = currentIndex;
		
		var narrative = Space.ALTITUDE_NARRATIVES[currentIndex];
		if (narrative && narrative.texts) {
			var text = narrative.texts[Math.floor(Math.random() * narrative.texts.length)];
			Notifications.notify(Space, text, true, 4000);
		}
	},
	
	setTitle: function() {
		if(Engine.activeModule == this) {
			var t;
			// 修仙化：高度层级名称
			if(Space.altitude < 5) {
				t = "登天路";
			} else if(Space.altitude < 10) {
				t = "云海";
			} else if(Space.altitude < 20) {
				t = "劫云";
			} else if(Space.altitude < 30) {
				t = "天雷";
			} else if(Space.altitude < 40) {
				t = "九重";
			} else if(Space.altitude < 50){
				t = "虚空";
			} else {
				t = "飞升";
			}
			document.title = "一介凡尘 · " + t;
		}
	},
	
	getSpeed: function() {
		return Space.SHIP_SPEED + $SM.get('game.spaceShip.thrusters');
	},
	
	updateHull: function() {
		$('div#hullRemaining div.row_val', Space.panel).text(Space.hull + '/' + Ship.getMaxHull());
	},
	
	createAsteroid: function(noNext) {
		// 天雷预警（高度 >= 9 时）
		if (Space.altitude >= 9 && Space.altitude <= 48) {
			var warningChance = 0.25;
			if (Space.altitude > 40) warningChance = 0.5;
			if (Math.random() < warningChance) {
				var warning = Space.THUNDER_WARNING[Math.floor(Math.random() * Space.THUNDER_WARNING.length)];
				Notifications.notify(Space, warning, false, 1500);
			}
		}
		
		var r = Math.random();
		var c;
		// 修仙化：天雷符号随高度变化
		if(Space.altitude < 5) {
			c = '☁';  // 云
		} else if(Space.altitude < 10) {
			c = '☁';  // 云
		} else if (Space.altitude < 20) {
			c = '⚡';  // 小天雷
		} else if (Space.altitude < 40) {
			c = '☀';  // 天雷
		} else {
			c = '劫';  // 最后一击
		}
		
		var x = Math.floor(Math.random() * 700);
		var a = $('<div>').addClass('asteroid').text(c).appendTo('#spacePanel').css('left', x + 'px');
		a.data({
			xMin: x,
			xMax: x + a.width(),
			height: a.height()
		});
		a.animate({
			top: '740px'
		}, {
			duration: Space.BASE_ASTEROID_SPEED - Math.floor(Math.random() * (Space.BASE_ASTEROID_SPEED * 0.65)),
			easing: 'linear', 
			progress: function() {
				// Collision detection
				var t = $(this);
				if(t.data('xMin') <= Space.shipX && t.data('xMax') >= Space.shipX) {
					var aY = t.css('top');
					aY = parseFloat(aY.substring(0, aY.length - 2));
					
					if(aY <= Space.shipY && aY + t.data('height') >= Space.shipY) {
						// Collision
						Engine.log('collision');
						t.remove();
						Space.hull--;
						Space.updateHull();

						// 修仙化：碰撞击中文案
						var hitText = Space.THUNDER_IMPACT[Math.floor(Math.random() * Space.THUNDER_IMPACT.length)];
						Notifications.notify(Space, hitText, true, 2000);
						
						// play audio on asteroid hit
						// higher altitudes play higher frequency hits
						var r = Math.floor(Math.random() * 2);
						if(Space.altitude > 40) {
							r += 6;
							AudioEngine.playSound(AudioLibrary['ASTEROID_HIT_' + r]);
						} else if(Space.altitude > 20) {
							r += 4;
							AudioEngine.playSound(AudioLibrary['ASTEROID_HIT_' + r]);
						} else  {
							r += 1;
							AudioEngine.playSound(AudioLibrary['ASTEROID_HIT_' + r]);
						}

						if(Space.hull === 0) {
							Space.crash();
						}
					}
				}
			},
			complete: function() {
				$(this).remove();
			}
		});
		if(!noNext) {
			
			// Harder
			if(Space.altitude > 10) {
				Space.createAsteroid(true);
			}
			
			// HARDER
			if(Space.altitude > 20) {
				Space.createAsteroid(true);
				Space.createAsteroid(true);
			}
			
			// HAAAAAARDERRRRR!!!!1
			if(Space.altitude > 40) {
				Space.createAsteroid(true);
				Space.createAsteroid(true);
			}
			
			if(!Space.done) {
				Engine.setTimeout(Space.createAsteroid, 1000 - (Space.altitude * 10), true);
			}
		}
	},
	
	moveShip: function() {
		var x = Space.ship.css('left');
		x = parseFloat(x.substring(0, x.length - 2));
		var y = Space.ship.css('top');
		y = parseFloat(y.substring(0, y.length - 2));
		
		var dx = 0, dy = 0;
		
		if(Space.up) {
			dy -= Space.getSpeed();
		} else if(Space.down) {
			dy += Space.getSpeed();
		}
		if(Space.left) {
			dx -= Space.getSpeed();
		} else if(Space.right) {
			dx += Space.getSpeed();
		}
		
		if(dx !== 0 && dy !== 0) {
			dx = dx / Math.sqrt(2);
			dy = dy / Math.sqrt(2);
		}
		
		if(Space.lastMove != null) {
			var dt = Date.now() - Space.lastMove;
			dx *= dt / 33;
			dy *= dt / 33;
		}
		
		x = x + dx;
		y = y + dy;
		if(x < 10) {
			x = 10;
		} else if(x > 690) {
			x = 690;
		}
		if(y < 10) {
			y = 10;
		} else if(y > 690) {
			y = 690;
		}
		
		Space.shipX = x;
		Space.shipY = y;
		
		Space.ship.css({
			left: x + 'px',
			top: y + 'px'
		});

		Space.lastMove = Date.now();
	},
	
	startAscent: function() {
		var body_color;
		var to_color;
		if (Engine.isLightsOff()) {
			body_color = '#272823';
			to_color = '#EEEEEE';
		}
		else {
			body_color = '#FFFFFF';
			to_color = '#000000';
		}

		$('body').addClass('noMask').css({backgroundColor: body_color}).animate({
			backgroundColor: to_color
		}, {
			duration: Space.FTB_SPEED, 
			easing: 'linear',
			progress: function() {
				var cur = $('body').css('background-color');
				var s = 'linear-gradient(rgba' + cur.substring(3, cur.length - 1) + ', 0) 0%, rgba' + 
					cur.substring(3, cur.length - 1) + ', 1) 100%)';
				$('#notifyGradient').attr('style', 'background-color:'+cur+';background:-webkit-' + s + ';background:' + s);
			},
			complete: Space.endGame
		});
		Space.drawStars();
		Space._timer = setInterval(function() {
			Space.altitude += 1;
			// 修仙化：显示高度阶段叙事
			Space.showAltitudeNarrative();
			if(Space.altitude % 10 === 0) {
				Space.setTitle();
			}
			if(Space.altitude > 60) {
				clearInterval(Space._timer);
			}
		}, 1000);
		
		Space._panelTimeout = Engine.setTimeout(function() {
			if (Engine.isLightsOff())
				$('#spacePanel, .menu, select.menuBtn').animate({color: '#272823'}, 500, 'linear');
			else
				$('#spacePanel, .menu, select.menuBtn').animate({color: 'white'}, 500, 'linear');
		}, Space.FTB_SPEED / 2, true);
		
		Space.createAsteroid();
	},

	drawStars: function(duration) {
		var starsContainer = $('<div>').attr('id', 'starsContainer').appendTo('body');
		Space.stars = $('<div>').css('bottom', '0px').attr('id', 'stars').appendTo(starsContainer);
		var s1 = $('<div>').css({
			width: Space.STAR_WIDTH + 'px',
			height: Space.STAR_HEIGHT + 'px'
		});
		var s2 = s1.clone();
		Space.stars.append(s1).append(s2);
		Space.drawStarAsync(s1, s2, 0);
		Space.stars.data('speed', Space.STAR_SPEED);
		Space.startAnimation(Space.stars);
		
		Space.starsBack = $('<div>').css('bottom', '0px').attr('id', 'starsBack').appendTo(starsContainer);
		s1 = $('<div>').css({
			width: Space.STAR_WIDTH + 'px',
			height: Space.STAR_HEIGHT + 'px'
		});
		s2 = s1.clone();
		Space.starsBack.append(s1).append(s2);
		Space.drawStarAsync(s1, s2, 0);
		Space.starsBack.data('speed', Space.STAR_SPEED * 2);
		Space.startAnimation(Space.starsBack);
	},
	
	startAnimation: function(el) {
		el.animate({bottom: '-3000px'}, el.data('speed'), 'linear', function() {
			$(this).css('bottom', '0px');
			Space.startAnimation($(this));
		});
	},
	
	drawStarAsync: function(el, el2, num) {
		var top = Math.floor(Math.random() * Space.STAR_HEIGHT) + 'px';
		var left = Math.floor(Math.random() * Space.STAR_WIDTH) + 'px';
		$('<div>').text('.').addClass('star').css({
			top: top,
			left: left
		}).appendTo(el);
		$('<div>').text('.').addClass('star').css({
			top: top,
			left: left
		}).appendTo(el2);
		if(num < Space.NUM_STARS) {
			Engine.setTimeout(function() { Space.drawStarAsync(el, el2, num + 1); }, 100);
		}
	},
	
	crash: function() {
		if(Space.done) return;
		Engine.keyLock = true;
		Space.done = true;
		clearInterval(Space._timer);
		clearInterval(Space._shipTimer);
		clearInterval(Space._volumeTimer);
		clearInterval(Space._thoughtTimer);
		clearTimeout(Space._panelTimeout);
		
		// 修仙化：显示渡劫失败文案
		Space.showEndingNarrative('fail');
		
		var body_color;
		if (Engine.isLightsOff())
			body_color = '#272823';
		else
			body_color = '#FFFFFF';
		// Craaaaash!
		$('body').removeClass('noMask').stop().animate({
			backgroundColor: body_color
		}, {
			duration: 300, 
			progress: function() {
				var cur = $('body').css('background-color');
				var s = 'linear-gradient(rgba' + cur.substring(3, cur.length - 1) + ', 0) 0%, rgba' + 
					cur.substring(3, cur.length - 1) + ', 1) 100%)';
				$('#notifyGradient').attr('style', 'background-color:'+cur+';background:-webkit-' + s + ';background:' + s);
			},
			complete: function() {
				Space.stars.remove();
				Space.starsBack.remove();
				Space.stars = Space.starsBack = null;
				$('#starsContainer').remove();
				$('body').attr('style', '');
				$('#notifyGradient').attr('style', '');	
				$('#spacePanel').attr('style', '');			
			}
		});
		$('.menu, select.menuBtn').animate({color: '#666'}, 300, 'linear');
		$('#outerSlider').animate({top: '0px'}, 300, 'linear');
		Engine.activeModule = Ship;
		Ship.onArrival();
		Button.cooldown($('#liftoffButton'));
		Engine.event('progress', 'crash');
		AudioEngine.playSound(AudioLibrary.CRASH);
	},
	
	endGame: function() {
		if(Space.done) return;
		Engine.event('progress', 'win');
		Space.done = true;
		clearInterval(Space._timer);
		clearInterval(Space._shipTimer);
		clearInterval(Space._volumeTimer);
		clearInterval(Space._thoughtTimer);
		clearTimeout(Engine._saveTimer);
		clearTimeout(Outside._popTimeout);
		clearTimeout(Engine._incomeTimeout);
		clearTimeout(Events._eventTimeout);
		clearTimeout(Room._fireTimer);
		clearTimeout(Room._tempTimer);
		for(var j in Room.Craftables) {
			Room.Craftables[j].button = null;
		}
		for(var k in Room.TradeGoods) {
			Room.TradeGoods[k].button = null;
		}
		delete Outside._popTimeout;
		
		// 修仙化：显示渡劫成功文案
		Space.showEndingNarrative('success');
		
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_ENDING);

		$('#hullRemaining', Space.panel).animate({opacity: 0}, 500, 'linear');
		Space.ship.animate({
			top: '350px',
			left: '240px'
		}, 3000, 'linear', function() {
			Engine.setTimeout(function() {
				Space.ship.animate({
					top: '-100px'
				}, 200, 'linear', function() {
					// Restart everything! Play FOREVER!
					$('#outerSlider').css({'left': '0px', 'top': '0px'});
					$('#locationSlider, #worldPanel, #spacePanel, #notifications').remove();
					$('#header').empty();
					Engine.setTimeout(function() {
						$('body').stop();
						var container_color;
						if (Engine.isLightsOff())
							container_color = '#EEE';
						else
							container_color = '#000';
						$('#starsContainer').animate({
							opacity: 0,
							'background-color': container_color
						}, {
							duration: 2000, 
							progress: function() {
								var cur = $('body').css('background-color');
								var s = 'linear-gradient(rgba' + cur.substring(3, cur.length - 1) + ', 0) 0%, rgba' + 
									cur.substring(3, cur.length - 1) + ', 1) 100%)';
								$('#notifyGradient').attr('style', 'background-color:'+cur+';background:-webkit-' + s + ';background:' + s);
							},
							complete: function() {
								Engine.GAME_OVER = true;
								Score.save();
								Prestige.save();
								$('#starsContainer').remove();
								$('#content, #notifications').remove();
								Space.showExpansionEnding().then(() => {
									Space.showEndingOptions();
									Engine.options = {};
									Engine.deleteSave(true);
								});
							}
						});
					}, 2000);
				});
			}, 2000);
		});
	},

	// 显示结局文案
	showEndingNarrative: function(type) {
		var narrative = type === 'success' ? Space.ENDING_SUCCESS : Space.ENDING_FAIL;
		
		// 创建结局容器
		var container = $('<div>').attr('id', 'endingNarrative').css({
			position: 'fixed',
			top: '20%',
			left: '50%',
			transform: 'translateX(-50%)',
			'text-align': 'center',
			'z-index': 10000,
			'pointer-events': 'none'
		}).appendTo('body');
		
		var delay = 0;
		narrative.forEach(function(line, index) {
			setTimeout(function() {
				$('<div>').css({
					color: '#fff',
					'font-size': '18px',
					'margin-bottom': '12px',
					opacity: 0
				}).text(line).appendTo(container).animate({ opacity: 1 }, 500);
			}, delay);
			delay += 600;
		});
	},
	
	showExpansionEnding: () => {
		return new Promise((resolve) => {
			if (!$SM.get('stores["fleet beacon"]')) {
				resolve();
				return;
			}

			const c = $('<div>')
				.addClass('outroContainer')
				.appendTo('body');

			setTimeout(() => {
				$('<div>')
					.addClass('outro')
					.html('the beacon pulses gently as the ship glides through space.<br>coordinates are locked. nothing to do but wait.')
					.appendTo(c)
					.animate({ opacity: 1}, 500);
			}, 2000);

			setTimeout(() => {
				$('<div>')
					.addClass('outro')
					.html('the beacon glows a solid blue, and then goes dim. the ship slows.<br>gradually, the vast wanderer homefleet comes into view.<br>massive worldships drift unnaturally through clouds of debris, scarred and dead.')
					.appendTo(c)
					.animate({ opacity: 1}, 500);
			}, 7000);

			setTimeout(() => {
				$('<div>')
					.addClass('outro')
					.text('the air is running out.')
					.appendTo(c)
					.animate({ opacity: 1}, 500);
			}, 14000);

			setTimeout(() => {
				$('<div>')
					.addClass('outro')
					.text('the capsule is cold.')
					.appendTo(c)
					.animate({ opacity: 1}, 500);
			}, 17000);

			setTimeout(() => {
				Button.Button({
					id: 'wait-btn',
					text: _('wait'),
					click: (btn) => {
						btn.addClass('disabled');
						c.animate({ opacity: 0 }, 5000, 'linear', () => {
							c.remove();
							setTimeout(resolve, 3000);
						})
					}
				}).animate({ opacity: 1 }, 500).appendTo(c);
			}, 19500)
		});
	},

	showEndingOptions: () => {
		$('<center>')
			.addClass('centerCont')
			.appendTo('body');
		$('<span>')
			.addClass('endGame')
			.text(_('score for this game: {0}', Score.calculateScore()))
			.appendTo('.centerCont')
			.animate({opacity:1},1500);
		$('<br />')
			.appendTo('.centerCont');
		$('<span>')
			.addClass('endGame')
			.text(_('total score: {0}', Prestige.get().score))
			.appendTo('.centerCont')
			.animate({opacity:1},1500);
		$('<br />')
			.appendTo('.centerCont');
		$('<br />')
			.appendTo('.centerCont');
		$('<span>')
			.addClass('endGame endGameOption')
			.text(_('restart.'))
			.click(Engine.confirmDelete)
			.appendTo('.centerCont')
			.animate({opacity:1},1500);
		$('<br />')
			.appendTo('.centerCont');
		$('<br />')
				.appendTo('.centerCont');
		$('<span>')
				.addClass('endGame')
				.text(_('expanded story. alternate ending. behind the scenes commentary. get the app.'))
				.appendTo('.centerCont')
				.animate({opacity:1}, 1500);
		$('<br />')
				.appendTo('.centerCont');
		$('<br />')
				.appendTo('.centerCont');
		$('<span>')
			.addClass('endGame endGameOption')
			.text(_('iOS.'))
			.click(function() { window.open('https://itunes.apple.com/app/apple-store/id736683061?pt=2073437&ct=gameover&mt=8'); })
			.appendTo('.centerCont')
			.animate({opacity:1},1500);
		$('<br />')
				.appendTo('.centerCont');
		$('<span>')
				.addClass('endGame endGameOption')
				.text(_('android.'))
				.click(function() { window.open('https://play.google.com/store/apps/details?id=com.yourcompany.adarkroom'); })
				.appendTo('.centerCont')
				.animate({opacity:1},1500);
	},
	
	keyDown: function(event) {
		switch(event.which) {
			case 38: // Up
			case 87:
				Space.up = true;
				Engine.log('up on');
				break;
			case 40: // Down
			case 83:
				Space.down = true;
				Engine.log('down on');
				break;
			case 37: // Left
			case 65:
				Space.left = true;
				Engine.log('left on');
				break;
			case 39: // Right
			case 68:
				Space.right = true;
				Engine.log('right on');
				break;
		}
	},
	
	keyUp: function(event) {
		switch(event.which) {
			case 38: // Up
			case 87:
				Space.up = false;
				Engine.log('up off');
				break;
			case 40: // Down
			case 83:
				Space.down = false;
				Engine.log('down off');
				break;
			case 37: // Left
			case 65:
				Space.left = false;
				Engine.log('left off');
				break;
			case 39: // Right
			case 68:
				Space.right = false;
				Engine.log('right off');
				break;
		}
	},
	
	handleStateUpdates: function(e){
		
	},
	
	lowerVolume: function () {
		if (Space.done) return;
		
		// lower audio as ship gets further into space
		var progress = Space.altitude / 60;
		var newVolume = 1.0 - progress;
		AudioEngine.setBackgroundMusicVolume(newVolume, 0.3);
	}
};
