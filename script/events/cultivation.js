/**
 * 《一介凡尘》修仙专属事件
 * 直接使用中文字符串（无需翻译表）
 * 在原版 Events.Room 基础上注入，不覆盖原有事件
 */

(function() {
	var cultivationEvents = [

		// ═══════════════════════════════════════
		// 事件01：灵脉涌动
		// ═══════════════════════════════════════
		{
			title: '灵脉涌动',
			isAvailable: function() {
				return Engine.activeModule == Room && $SM.get('stores.wood', true) > 10;
			},
			scenes: {
				'start': {
					text: [
						'洞穴地面泛起微微热意。',
						'此处有力量，在等待着。'
					],
					notification: '感到灵脉涌动',
					blink: true,
					buttons: {
						'meditate': {
							text: '静心感悟',
							nextScene: { 0.6: 'insight', 1: 'nothing' }
						},
						'ignore': {
							text: '忽视',
							nextScene: 'end'
						}
					}
				},
				'insight': {
					reward: { wood: 30 },
					text: [
						'能量流经全身。',
						'修为稍有精进。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'nothing': {
					text: [ '时机一闪而过，未得领悟。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件02：丹方残页
		// ═══════════════════════════════════════
		{
			title: '丹方残页',
			isAvailable: function() {
				return Engine.activeModule == Room && $SM.get('game.builder.level', true) >= 2;
			},
			scenes: {
				'start': {
					text: [
						'一片羊皮纸从顶缝飘落。',
						'褪色的字迹描述着一个失传丹方。'
					],
					notification: '一页残卷从上方飘落',
					blink: true,
					buttons: {
						'decipher': {
							text: '研读',
							nextScene: { 0.5: 'success', 1: 'fail' }
						},
						'ignore': {
							text: '忽视残页',
							nextScene: 'end'
						}
					}
				},
				'success': {
					reward: { medicine: 2 },
					text: [ '辨认出三个字，足以炼制粗劣丹药。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'fail': {
					text: [ '墨迹太淡，无从辨读。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件03：遗落符箓
		// ═══════════════════════════════════════
		{
			title: '遗落符箓',
			isAvailable: function() {
				return Engine.activeModule == Room && $SM.get('stores.wood', true) > 0;
			},
			scenes: {
				'start': {
					text: [
						'山洞石壁缝中，夹着一张折叠的纸符。',
						'隐隐有嗡鸣。'
					],
					notification: '在石壁中发现一道符箓',
					blink: true,
					buttons: {
						'take': {
							text: '取走',
							nextScene: { 0.7: 'warm', 1: 'crumble' }
						},
						'leaveit': {
							text: '留下',
							nextScene: 'ignore'
						}
					}
				},
				'warm': {
					reward: { fur: 10 },
					text: [
						'符箓在掌心化为细灰。',
						'一丝温热留存。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'crumble': {
					text: [ '符箓在掌心化为细灰，什么也没留下。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'ignore': {
					text: [ '符箓留在石壁中。也许有人会更需要它。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件04：流浪修士
		// ═══════════════════════════════════════
		{
			title: '流浪修士',
			isAvailable: function() {
				return Engine.activeModule == Room && $SM.get('game.builder.level', true) >= 1;
			},
			scenes: {
				'start': {
					text: [
						'一道消瘦的人影蹲在洞口。',
						'他的道袍破旧，目光飘渺。'
					],
					notification: '一名流浪修士寻求庇护',
					blink: true,
					buttons: {
						'welcome': {
							text: '收留',
							cost: { 'wood': 10 },
							nextScene: { 0.6: 'info', 1: 'stay' }
						},
						'deny': {
							text: '拒绝',
							nextScene: 'end'
						}
					}
				},
				'info': {
					reward: { meat: 5 },
					text: [
						'修士留下，分享他所知的一切。',
						'他提到东边有一处沉铁矿。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'stay': {
					text: [ '修士留下，分享他所知的一切。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件05：妖兽入室
		// ═══════════════════════════════════════
		{
			title: '妖兽入室',
			isAvailable: function() {
				return Engine.activeModule == Room && $SM.get('stores.meat', true) > 5;
			},
			scenes: {
				'start': {
					text: [
						'储物间传来低沉的咆哮。',
						'某物正在啃噬物资。'
					],
					notification: '妖兽侵入了储物间',
					blink: true,
					buttons: {
						'drive': {
							text: '驱逐',
							nextScene: { 0.6: 'driven', 1: 'spillage' }
						},
						'allow': {
							text: '放任',
							nextScene: 'fed'
						}
					}
				},
				'driven': {
					text: [ '妖兽退走，洒落了不少妖髓。' ],
					onLoad: function() {
						var m = $SM.get('stores.meat', true);
						$SM.set('stores.meat', Math.floor(m * 0.5));
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'spillage': {
					text: [ '妖兽退走，大半妖髓已被糟蹋。' ],
					onLoad: function() {
						var m = $SM.get('stores.meat', true);
						$SM.set('stores.meat', Math.floor(m * 0.3));
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'fed': {
					reward: { scales: 3 },
					text: [ '妖兽吃饱离去，留下几片鳞片。' ],
					onLoad: function() {
						var m = $SM.get('stores.meat', true);
						$SM.set('stores.meat', Math.max(0, m - 10));
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件06：寒夜问道
		// ═══════════════════════════════════════
		{
			title: '寒夜问道',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.temperature.value') >= 2 &&
					$SM.get('game.builder.level', true) >= 2;
			},
			scenes: {
				'start': {
					text: [
						'洞口有人叩门。一张年轻的脸探进来。',
						'她询问旧日修法，关于修炼之道。'
					],
					notification: '一名年轻求道者询问修炼之法',
					blink: true,
					buttons: {
						'teach': {
							text: '传授',
							cost: { 'wood': 5 },
							nextScene: 'taught'
						},
						'deny': {
							text: '打发离去',
							nextScene: 'gone'
						}
					}
				},
				'taught': {
					text: [
						'你将所知倾囊相授。她听得专注。',
						'两日后，她会带着物资归来。'
					],
					action: function(inputDelay) {
						var delay = inputDelay || false;
						Events.saveDelay(function() {
							$SM.add('stores.wood', 20);
							$SM.add('stores.fur', 5);
							Notifications.notify(Room, '求道者归来，带来一捆物资。');
						}, 'cultivation[5].scenes.taught.action', delay);
					},
					onLoad: function() { this.action(120); },
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'gone': {
					text: [ '她点头，消失于夜色中。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件07：散修归附
		// ═══════════════════════════════════════
		{
			title: '散修归附',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.buildings["hut"]', true) >= 2 &&
					$SM.get('game.population', true) < 10;
			},
			scenes: {
				'start': {
					text: [
						'三人背着行囊站在洞口。',
						'他们听说这里有修炼之所。'
					],
					notification: '一群散修希望落脚',
					blink: true,
					buttons: {
						'welcome': {
							text: '欢迎',
							cost: { 'wood': 30, 'meat': 5 },
							nextScene: 'settle'
						},
						'deny': {
							text: '拒绝',
							nextScene: 'leave'
						}
					}
				},
				'settle': {
					text: [ '散修们卸下行囊，开始做些力所能及的事。' ],
					onLoad: function() {
						$SM.add('game.population', 3);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'leave': {
					text: [ '散修们失望地鞠躬离去。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件08：灵晶暗脉
		// ═══════════════════════════════════════
		{
			title: '灵晶暗脉',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('stores.wood', true) > 50;
			},
			scenes: {
				'start': {
					text: [
						'洞壁深处，有什么东西在发光。',
						'细看，是裂缝里藏着的一小簇灵晶暗脉。'
					],
					notification: '发现洞壁中的灵晶暗脉',
					blink: true,
					buttons: {
						'mine': {
							text: '凿取',
							nextScene: { 0.7: 'rich', 0.9: 'moderate', 1: 'crack' }
						},
						'leave': {
							text: '留着',
							nextScene: 'end'
						}
					}
				},
				'rich': {
					reward: { wood: 80, iron: 5 },
					text: [
						'脉络比预想的深。',
						'凿出了不少灵晶，还带出几块生铁。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'moderate': {
					reward: { wood: 30 },
					text: [ '收获一捧灵晶，脉络已竭。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'crack': {
					text: [
						'凿了几下，岩层突然松动。',
						'轰——一块大石压了下来。什么也没剩下。'
					],
					onLoad: function() {
						$SM.add('stores.wood', -20);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件09：老修士辞行
		// ═══════════════════════════════════════
		{
			title: '老修士辞行',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 3;
			},
			scenes: {
				'start': {
					text: [
						'老散修收拾了几件简单的行囊，站在炉火旁。',
						'说有些事，要亲自去看一看。',
						'走之前，问你要一些路途所需。'
					],
					notification: '老散修说他要离开一段时间',
					blink: true,
					buttons: {
						'give': {
							text: '慷慨相送',
							cost: { 'meat': 10, 'wood': 20 },
							nextScene: 'thanks'
						},
						'little': {
							text: '稍作资助',
							cost: { 'meat': 3 },
							nextScene: 'nod'
						},
						'nothing': {
							text: '无从相送',
							nextScene: 'alone'
						}
					}
				},
				'thanks': {
					reward: { scales: 5, teeth: 5 },
					text: [
						'老散修点了点头，没说什么。',
						'后来他回来了，带着一些外面的东西。',
						'放下，又走了。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'nod': {
					text: [
						'老散修接过，也没有嫌少。',
						'拍了拍肩膀，走了。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'alone': {
					text: [
						'老散修望了一眼炉火，什么也没说。',
						'就这样走了。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件10：妖兽幼崽
		// ═══════════════════════════════════════
		{
			title: '妖兽幼崽',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('stores.fur', true) > 10;
			},
			scenes: {
				'start': {
					text: [
						'捕妖阵里有动静。',
						'走近才发现，是只幼小的妖兽崽子。',
						'还没断奶，浑身颤抖。'
					],
					notification: '捕妖阵困住了一只妖兽幼崽',
					blink: true,
					buttons: {
						'raise': {
							text: '收养',
							cost: { 'meat': 5 },
							nextScene: { 0.5: 'bonded', 1: 'wild' }
						},
						'release': {
							text: '放走',
							nextScene: 'gone'
						},
						'kill': {
							text: '取皮',
							nextScene: 'pelt'
						}
					}
				},
				'bonded': {
					reward: { fur: 20, scales: 3 },
					text: [
						'喂了几天肉，它不再害怕了。',
						'开始帮着看守营地。',
						'脱落的皮毛也有几把。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'wild': {
					text: [
						'养了几天，它还是逃了。',
						'没有恶意，只是野性未消。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'gone': {
					text: [ '幼崽跌跌撞撞地跑进了林子里。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'pelt': {
					reward: { fur: 5 },
					text: [
						'手起刀落，很快。',
						'得了几片兽皮。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件11：天道感应
		// ═══════════════════════════════════════
		{
			title: '天道感应',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.cultivationRealm', true) >= 2;
			},
			scenes: {
				'start': {
					text: [
						'深夜，炉火突然无风自旺。',
						'丹田中一阵震颤，像是有什么在共鸣。',
						'须臾，归于平静。'
					],
					notification: '感受到异常的天地感应',
					blink: true,
					buttons: {
						'absorb': {
							text: '顺势吸纳',
							nextScene: { 0.6: 'breakthrough', 0.9: 'slight', 1: 'backlash' }
						},
						'resist': {
							text: '静心抗拒',
							nextScene: 'safe'
						}
					}
				},
				'breakthrough': {
					text: [
						'灵气如潮，充盈四肢百骸。',
						'修为大进，有突破之感。'
					],
					onLoad: function() {
						if (typeof Cultivation !== 'undefined') {
							Cultivation.addProgress(150);
						}
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'slight': {
					text: [ '灵气流过，修为略有精进。' ],
					onLoad: function() {
						if (typeof Cultivation !== 'undefined') {
							Cultivation.addProgress(50);
						}
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'backlash': {
					text: [
						'灵气紊乱，经脉受损。',
						'休养半日，方才恢复。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'safe': {
					text: [
						'天道感应消散。',
						'你平安无事，但错过了什么。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件12：废旧法器
		// ═══════════════════════════════════════
		{
			title: '废旧法器',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 2;
			},
			scenes: {
				'start': {
					text: [
						'一名过路散修拿来一件东西。',
						'锈迹斑斑，看不出原本形状。',
						'他说——是法器，只是废了大半。'
					],
					notification: '过路散修带来一件废旧法器',
					blink: true,
					buttons: {
						'buy': {
							text: '花灵晶购入',
							cost: { 'wood': 40 },
							nextScene: { 0.4: 'restore', 0.8: 'scrap', 1: 'nothing' }
						},
						'refuse': {
							text: '不感兴趣',
							nextScene: 'end'
						}
					}
				},
				'restore': {
					reward: { iron: 20, scales: 5 },
					text: [
						'拆解之后，内部结构保存尚好。',
						'从中取出不少精铁和妖鳞碎片。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'scrap': {
					reward: { iron: 5 },
					text: [
						'大半已经腐朽。',
						'勉强取出几块生铁。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'nothing': {
					text: [
						'里面什么都没有。',
						'散修早已不见踪影。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件13：营地议事
		// ═══════════════════════════════════════
		{
			title: '营地议事',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.population', true) >= 5 &&
					$SM.get('game.builder.level', true) >= 3;
			},
			scenes: {
				'start': {
					text: [
						'营地里的人聚在一起，声音越来越大。',
						'争论的是：物资该如何分配。',
						'老散修站在一旁，看向你。'
					],
					notification: '营地中爆发了一场争论',
					blink: true,
					buttons: {
						'fair': {
							text: '按劳分配',
							nextScene: 'order'
						},
						'equal': {
							text: '一律平均',
							nextScene: 'peace'
						},
						'ignore': {
							text: '让他们吵',
							nextScene: 'chaos'
						}
					}
				},
				'order': {
					text: [
						'你宣布了规则。',
						'争论停了。有人不满，但大多数人认可。',
						'劳作效率明显提升。'
					],
					onLoad: function() {
						$SM.add('stores.wood', 30);
						$SM.add('stores.fur', 10);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'peace': {
					text: [
						'一律均分。',
						'争论平息了。',
						'没有人特别满意，但也没有人特别不满。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'chaos': {
					text: [
						'没人管，最后有几个人离开了营地。',
						'留下来的那些，倒是抱得更紧了。'
					],
					onLoad: function() {
						var pop = $SM.get('game.population', true) || 0;
						$SM.set('game.population', Math.max(0, pop - 2));
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件14：暗夜寒霜
		// ═══════════════════════════════════════
		{
			title: '暗夜寒霜',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.temperature.value') <= 1;
			},
			scenes: {
				'start': {
					text: [
						'比往常更冷的一夜。',
						'洞外传来沉闷的声响，像是什么东西在踱步。',
						'炉火在颤抖。'
					],
					notification: '极寒之夜，洞外有动静',
					blink: true,
					buttons: {
						'stoke': {
							text: '大量添炭',
							cost: { 'wood': 20 },
							nextScene: 'warm'
						},
						'watch': {
							text: '持守以待',
							nextScene: { 0.5: 'pass', 1: 'attack' }
						}
					}
				},
				'warm': {
					text: [
						'炉火旺盛，寒意消散。',
						'洞外的声响渐渐远去。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'pass': {
					text: [
						'折腾了半夜。',
						'天亮之后，什么也没发生。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'attack': {
					text: [
						'天亮前，妖兽冲了进来。',
						'短暂的混乱，最终被驱退。',
						'伤亡不重，但物资有损。'
					],
					onLoad: function() {
						$SM.add('stores.meat', -8);
						$SM.add('stores.fur', -5);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件15：悟道石刻
		// ═══════════════════════════════════════
		{
			title: '悟道石刻',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.cultivationRealm', true) >= 1;
			},
			scenes: {
				'start': {
					text: [
						'洞穴深处的石壁上，有人刻了字。',
						'笔画粗粝，但字迹清晰。',
						'是前人留下的修炼感悟。'
					],
					notification: '在洞壁深处发现古老石刻',
					blink: true,
					buttons: {
						'read': {
							text: '细细研读',
							nextScene: { 0.5: 'insight_deep', 0.8: 'insight_minor', 1: 'confused' }
						},
						'copy': {
							text: '誊抄下来',
							nextScene: 'copied'
						}
					}
				},
				'insight_deep': {
					text: [
						'字里行间，有种奇异的共鸣。',
						'仿佛前人经历了同样的困境，却找到了出路。',
						'修为有所感悟，精进不小。'
					],
					onLoad: function() {
						if (typeof Cultivation !== 'undefined') {
							Cultivation.addProgress(200);
						}
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'insight_minor': {
					text: [
						'读懂了七八分。',
						'有几处还是看不透，但收获不少。'
					],
					onLoad: function() {
						if (typeof Cultivation !== 'undefined') {
							Cultivation.addProgress(80);
						}
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'confused': {
					text: [
						'字认识，但意思——看不懂。',
						'也许境界还不够。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'copied': {
					reward: { cloth: 3 },
					text: [
						'花了些时间誊抄下来。',
						'用掉了几片布料。',
						'日后或许能用上。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		}

	];

	// 将修仙事件追加到原版事件列表末尾
	if (typeof Events !== 'undefined' && Events.Room) {
		Events.Room = Events.Room.concat(cultivationEvents);
	} else {
		// 防御性处理：若Room事件未加载，延迟追加
		window.addEventListener('load', function() {
			if (Events && Events.Room) {
				Events.Room = Events.Room.concat(cultivationEvents);
			}
		});
	}
})();
