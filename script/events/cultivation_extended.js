/**
 * 《一介凡尘》修仙完整事件库 v1.0
 * 
 * Room模块主叙事事件（15+条）
 * 涵盖：资源压力、人伦考量、修为节拍、环境变化、最终节拍
 * 
 * 设计原则：
 * 1. 每个事件都是一个小选择，累积成大的叙事弧线
 * 2. "没有绝对正确答案"——每个选项都有代价
 * 3. 后果不总是立即显现，有时延迟一回合或数回合
 * 4. 文案克制：只描述事件，不评价玩家选择
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
						}, 'cultivationEvents[5].scenes.taught.action', delay);
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
		// 事件08：营地内讧（新增）
		// ═══════════════════════════════════════
		{
			title: '营地内讧',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.population', true) >= 5 &&
					$SM.get('game.builder.level', true) >= 2;
			},
			scenes: {
				'start': {
					text: [
						'两个弟子在柴堆前吵起来。',
						'一个说灵晶分配不公，另一个不承认。'
					],
					notification: '营地传出争执声',
					blink: true,
					buttons: {
						'mediate': {
							text: '调停',
							nextScene: { 0.5: 'settled', 1: 'resentful' }
						},
						'ignore': {
							text: '不管',
							nextScene: 'escalate'
						}
					}
				},
				'settled': {
					text: [ '他们各退一步。但气氛变得有些冷淡。' ],
					onLoad: function() {
						// 削弱一点人口贡献度，但不离开
						// 这个实现需要reputation系统支持
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'resentful': {
					text: [ '争执变得激烈。一个人背起行囊离去。' ],
					onLoad: function() {
						$SM.add('game.population', -1);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'escalate': {
					text: [ '吵声渐大。最终两人都负气离去。' ],
					onLoad: function() {
						$SM.add('game.population', -2);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件09：老修的故事（新增）
		// ═══════════════════════════════════════
		{
			title: '老修的故事',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 3;
			},
			scenes: {
				'start': {
					text: [
						'炉火映红了洞穴。',
						'老散修突然开口：我见过末法之前的天。'
					],
					notification: '老散修讲述往事',
					blink: true,
					buttons: {
						'listen': {
							text: '倾听',
							nextScene: 'story'
						},
						'leave': {
							text: '离开他',
							nextScene: 'end'
						}
					}
				},
				'story': {
					text: [
						'天色并不是这样的。灵气满地，人不需要这么辛苦。',
						'但那时——有人在天上飞，有人在地下打仗。',
						'末法来了。不是惩罚，只是——天累了。',
						'他停顿很久。你什么也没说。',
						'最后他说：继续坐着。火还要烧。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件10：天地异变（新增）
		// ═══════════════════════════════════════
		{
			title: '天地异变',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 4;
			},
			scenes: {
				'start': {
					text: [
						'某日清晨，天色异常。',
						'积云低压，似乎要落下来。'
					],
					notification: '天象异变',
					blink: true,
					buttons: {
						'feel': {
							text: '感受',
							nextScene: 'omen'
						}
					}
				},
				'omen': {
					text: [
						'你从未见过这种天。但你知道——这意味着什么。',
						'修炼之路还有很长。也许太长了。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件11：幻觉（新增·高难事件）
		// ═══════════════════════════════════════
		{
			title: '幻觉',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 3 &&
					$SM.get('game.temperature.value') <= 1;
			},
			scenes: {
				'start': {
					text: [
						'坐得太久。眼睛开始花。',
						'火焰里有人影在舞动。'
					],
					notification: '修炼过度，出现幻象',
					blink: true,
					buttons: {
						'continue': {
							text: '继续打坐',
							nextScene: { 0.4: 'insight', 1: 'collapse' }
						},
						'stop': {
							text: '停下休息',
							nextScene: 'recover'
						}
					}
				},
				'insight': {
					reward: { wood: 50 },
					text: [ '幻觉中有答案。你在极限处突破了什么。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'collapse': {
					text: [ '意识模糊。你倒在了炉火前。' ],
					onLoad: function() {
						// 减少体力或施加负面状态
						$SM.set('game.health', Math.max(1, $SM.get('game.health', true) - 5));
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'recover': {
					text: [ '你站起身。一切回到正常。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件12：遗物（新增·叙事密钥）
		// ═══════════════════════════════════════
		{
			title: '遗物',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 3;
			},
			scenes: {
				'start': {
					text: [
						'整理洞穴时，你在角落发现了一个布包。',
						'里面是——一面镜子？还是什么别的。',
						'很旧。很沉。'
					],
					notification: '发现神秘遗物',
					blink: true,
					buttons: {
						'open': {
							text: '打开',
							nextScene: { 0.5: 'mirror', 1: 'sealed' }
						},
						'leave': {
							text: '重新包好',
							nextScene: 'end'
						}
					}
				},
				'mirror': {
					text: [
						'镜子里映出——一张苍白的脸。',
						'不是你。不对，可能就是你。',
						'镜子碎了。'
					],
					reward: { wood: 20 },
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'sealed': {
					text: [ '包裹没有打开。也许有些东西不该看。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件13：通道发现（新增·世界扩展暗示）
		// ═══════════════════════════════════════
		{
			title: '通道发现',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 4;
			},
			scenes: {
				'start': {
					text: [
						'洞穴北侧的石壁塌陷了。',
						'露出一条向下的通道。',
						'下面有光。'
					],
					notification: '发现隐秘通道',
					blink: true,
					buttons: {
						'explore': {
							text: '探索',
							nextScene: { 0.6: 'treasure', 1: 'dead_end' }
						},
						'seal': {
							text: '封闭',
							nextScene: 'end'
						}
					}
				},
				'treasure': {
					reward: { sulphur: 30, iron: 20 },
					text: [ '下面是一座小矿洞。遗留的灵晶和金属。末法前的储备，大概。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'dead_end': {
					text: [ '通道只有十步远。再往下就塌了。什么也没有。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件14：预兆（新增·渡劫前兆）
		// ═══════════════════════════════════════
		{
			title: '预兆',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 5;
			},
			scenes: {
				'start': {
					text: [
						'天上没有云，但有嗡鸣声。',
						'空气在颤抖。',
						'很像——电。'
					],
					notification: '天地之间传出不祥之音',
					blink: true,
					buttons: {
						'meditate': {
							text: '静坐感悟',
							nextScene: 'warning'
						}
					}
				},
				'warning': {
					text: [
						'你明白了。这不是坏事。',
						'这是——来了。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 事件15：最后时刻（新增·过渡事件）
		// ═══════════════════════════════════════
		{
			title: '最后时刻',
			isAvailable: function() {
				return Engine.activeModule == Room &&
					$SM.get('game.builder.level', true) >= 6;
			},
			scenes: {
				'start': {
					text: [
						'营地里，所有人都停下了手中的活。',
						'他们看向天空。',
						'然后，看向你。'
					],
					notification: '时刻已到',
					blink: true,
					buttons: {
						'go': {
							text: '出发',
							nextScene: 'departure'
						}
					}
				},
				'departure': {
					text: [
						'老散修没有送行。只是点了点头。',
						'你背上行囊，踏向黑夜。',
						'身后，营地的火还在烧。'
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
		window.addEventListener('load', function() {
			if (Events && Events.Room) {
				Events.Room = Events.Room.concat(cultivationEvents);
			}
		});
	}
})();
