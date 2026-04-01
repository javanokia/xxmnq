/**
 * 《一介凡尘》野外与大陆模块事件
 * 
 * 涵盖：Outside野外随机事件 + World大陆环境叙事
 * 
 * 叙事目标：
 * - 让玩家感受到"末法世界的真正残酷"
 * - 通过废墟、道路和遗迹传达世界的历史
 * - 每次战斗都不只是数值，都有叙事背景
 */

(function() {

	// ══════════════════════════════════════════════
	// Outside模块事件（游历事件）
	// ══════════════════════════════════════════════

	var outsideEvents = [

		// ═══════════════════════════════════════
		// 野外事件01：废弃宗门遗址
		// ═══════════════════════════════════════
		{
			title: '废弃遗址',
			isAvailable: function() {
				return Engine.activeModule == Outside &&
					$SM.get('game.population', true) >= 3;
			},
			scenes: {
				'start': {
					text: [
						'山路转折处，一片断壁残垣。',
						'曾经有宗门在这里。现在只剩地基。'
					],
					notification: '发现废弃的宗门遗址',
					blink: true,
					buttons: {
						'search': {
							text: '搜寻遗留',
							nextScene: { 0.3: 'treasury', 0.7: 'nothing', 1: 'danger' }
						},
						'pass': {
							text: '绕道而行',
							nextScene: 'end'
						}
					}
				},
				'treasury': {
					reward: { iron: 40, sulphur: 15, scales: 5 },
					text: [
						'地底有间小房子，锁已锈蚀。',
						'宗门存粮的一部分，没人来取。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'nothing': {
					text: [ '什么都被拿走了。石壁上有刀痕——不知是谁留下的。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'danger': {
					text: [ '有人还住在这里。不是修士，是劫修。' ],
					nextScene: 'fight_bandits',
					buttons: {
						'fight': { text: '驱逐', nextScene: 'fight_outcome' },
						'flee': { text: '撤退', nextScene: 'end' }
					}
				},
				'fight_outcome': {
					reward: { meat: 10, fur: 8 },
					text: [ '劫修被赶走。他们留下了从别处抢来的物资。' ],
					onLoad: function() {
						$SM.set('game.health', Math.max(1, $SM.get('game.health', true) - 3));
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 野外事件02：孤村老者
		// ═══════════════════════════════════════
		{
			title: '孤村老者',
			isAvailable: function() {
				return Engine.activeModule == Outside;
			},
			scenes: {
				'start': {
					text: [
						'一个小村，只剩老者独居。',
						'年轻人都走了，或是死了。',
						'他坐在门口，见到你，也没有惊讶。'
					],
					notification: '遇见孤村老者',
					blink: true,
					buttons: {
						'talk': {
							text: '与他交谈',
							nextScene: 'story'
						},
						'trade': {
							text: '以物换物',
							cost: { 'meat': 5 },
							nextScene: { 0.6: 'trade_good', 1: 'trade_fair' }
						},
						'pass': {
							text: '离去',
							nextScene: 'end'
						}
					}
				},
				'story': {
					text: [
						'"修仙的人，越来越少了。"',
						'他看着远处，不是在说什么，只是在记起。',
						'"那年天上一道光，我家屋顶就倒了。"',
						'"没有人赔。也没人道歉。修仙者和我们——不是一个世界的人。"',
						'你没有反驳。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'trade_good': {
					reward: { water: 30, fur: 5 },
					text: [ '他拿出一袋水，还有几块熟皮。"存了很久了。用处不大，给你吧。"' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'trade_fair': {
					reward: { water: 15 },
					text: [ '他拿出一袋水。"这不多，但是干净的。"' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 野外事件03：劫修截道
		// ═══════════════════════════════════════
		{
			title: '劫修截道',
			isAvailable: function() {
				return Engine.activeModule == Outside &&
					$SM.get('stores.meat', true) > 10;
			},
			scenes: {
				'start': {
					text: [
						'三个人从林中走出来，拦住了去路。',
						'他们不是要命，是要物资。'
					],
					notification: '劫修拦路',
					blink: true,
					buttons: {
						'fight': {
							text: '正面迎击',
							nextScene: { 0.5: 'win', 1: 'hurt' }
						},
						'bargain': {
							text: '谈价',
							cost: { 'meat': 10 },
							nextScene: { 0.7: 'pass', 1: 'cheat' }
						},
						'run': {
							text: '逃跑',
							nextScene: { 0.6: 'escaped', 1: 'caught' }
						}
					}
				},
				'win': {
					reward: { meat: 15, iron: 5 },
					text: [ '劫修败走。他们也只是在求生。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'hurt': {
					text: [ '你们都受了伤。劫修最后跑了，但你损失不小。' ],
					onLoad: function() {
						$SM.set('game.health', Math.max(1, $SM.get('game.health', true) - 8));
						$SM.add('stores.meat', -10);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'pass': {
					text: [ '他们接过食物，让路了。没有多说。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'cheat': {
					text: [ '他们接过食物，却不让路。又想要更多。' ],
					onLoad: function() {
						$SM.add('stores.meat', -15);
					},
					buttons: {
						'fight_now': { text: '反击', nextScene: 'win' },
						'run_now': { text: '逃跑', nextScene: 'escaped' }
					}
				},
				'escaped': {
					text: [ '你跑得比他们快。物资散落了一些。' ],
					onLoad: function() {
						$SM.add('stores.meat', -5);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'caught': {
					text: [ '没跑掉。物资被抢走了大半。' ],
					onLoad: function() {
						$SM.add('stores.meat', -20);
						$SM.add('stores.fur', -10);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 野外事件04：废弃炼丹房
		// ═══════════════════════════════════════
		{
			title: '炼丹房废墟',
			isAvailable: function() {
				return Engine.activeModule == Outside &&
					$SM.get('game.builder.level', true) >= 3;
			},
			scenes: {
				'start': {
					text: [
						'山路侧面有间矮房，炉灶还在。',
						'地上散落着丹炉的碎片，以及焦黑的记录册。'
					],
					notification: '发现废弃炼丹房',
					blink: true,
					buttons: {
						'search': {
							text: '仔细搜寻',
							nextScene: { 0.4: 'formula', 0.8: 'materials', 1: 'empty' }
						},
						'pass': {
							text: '继续前行',
							nextScene: 'end'
						}
					}
				},
				'formula': {
					reward: { sulphur: 25 },
					text: [
						'记录册上有一张图，画的是——焚晶砂与阴火石的配比。',
						'旁边用小字写着：此方已验证，慎用。',
						'没有后续记录。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'materials': {
					reward: { coal: 20, sulphur: 10 },
					text: [ '炉膛里还有些没用完的材料。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'empty': {
					text: [ '什么都没有了。只有被烧穿的炉壁，讲述着失败的实验。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 野外事件05：修士残骸
		// ═══════════════════════════════════════
		{
			title: '修士残骸',
			isAvailable: function() {
				return Engine.activeModule == Outside;
			},
			scenes: {
				'start': {
					text: [
						'道路边，一具白骨。',
						'衣物虽破，但袖口绣纹可辨——曾是有名号的修士。'
					],
					notification: '路边发现修士遗骸',
					blink: true,
					buttons: {
						'search': {
							text: '搜身',
							nextScene: { 0.6: 'found', 1: 'nothing' }
						},
						'bury': {
							text: '掩埋',
							nextScene: 'buried'
						},
						'pass': {
							text: '绕道',
							nextScene: 'end'
						}
					}
				},
				'found': {
					reward: { teeth: 3, scales: 2 },
					text: [ '袖口里有一小包材料。活着没用上，就当是相赠。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'nothing': {
					text: [ '什么都没有了。已经被人先找过了。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'buried': {
					reward: {},
					text: [
						'你把白骨拢在一起，用石块围起。',
						'没有供香。就这样了。',
						'你继续走。天色还早。'
					],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		},

		// ═══════════════════════════════════════
		// 野外事件06：迷路求助者
		// ═══════════════════════════════════════
		{
			title: '迷路的孩子',
			isAvailable: function() {
				return Engine.activeModule == Outside &&
					$SM.get('game.population', true) >= 2;
			},
			scenes: {
				'start': {
					text: [
						'山路中，一个孩子独自坐着，不哭不闹。',
						'他不认识路，也不知道家在哪。'
					],
					notification: '发现迷路的孩子',
					blink: true,
					buttons: {
						'take': {
							text: '带回营地',
							cost: { 'meat': 5 },
							nextScene: 'rescued'
						},
						'direct': {
							text: '问他路',
							nextScene: { 0.4: 'knew', 1: 'unknown' }
						},
						'leave': {
							text: '继续走',
							nextScene: 'end'
						}
					}
				},
				'rescued': {
					text: [
						'你带他回到营地。',
						'他很安静。营地里的人把他当成自己人一样对待。',
						'也许，这就够了。'
					],
					onLoad: function() {
						$SM.add('game.population', 1);
					},
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'knew': {
					reward: { water: 15 },
					text: [ '他说，前方有口井，水还是清的。说完就安静了。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				},
				'unknown': {
					text: [ '他说，不知道。天快黑了，你继续赶路。' ],
					buttons: { 'leave': { text: '离去', nextScene: 'end' } }
				}
			}
		}
	];

	// ══════════════════════════════════════════════
	// World大陆模块环境叙事节拍
	// （注入至World.landmarks或类似结构，具体实现视引擎）
	// ══════════════════════════════════════════════

	/**
	 * 坊市环境描述文案
	 * 替换原版city/market的标准描述文案
	 */
	var worldLandmarkDescriptions = {

		// 坊市（废弃的）
		abandonedMarket: {
			title: '废弃坊市',
			arrivalText: [
				'曾经是一座坊市。',
				'招牌还在，但已经没有人。',
				'交易台上落满了灰，有些货柜的锁还锁着。'
			],
			searchText: '搜寻残留物资',
			leaveText: '离开'
		},

		// 坊市（活跃的）
		activeMarket: {
			title: '游商坊市',
			arrivalText: [
				'有几个游商在这里停留。',
				'他们不问来历，只看手上有什么。'
			]
		},

		// 烽火台（末法遗迹）
		watchtower: {
			title: '熄火烽台',
			arrivalText: [
				'烽火台，但灯已灭。',
				'很多年没有烧过了。',
				'台顶的守卫记录还在，写到中途就停了。'
			]
		},

		// 关隘废墟
		ruinedGate: {
			title: '荒废关隘',
			arrivalText: [
				'以前这是要道，要交过路费。',
				'现在关门倒了，没人管了。',
				'地上有旧的骨灰痕迹。'
			]
		},

		// 地下矿洞
		ironMine: {
			title: '生铁矿洞',
			arrivalText: [
				'矿洞口立着一块木牌，写着危险。',
				'没有说明什么危险。'
			]
		}
	};

	/**
	 * 大陆地图随机遭遇文案
	 * 配合World.xml.events使用
	 */
	var worldEncounterTexts = {

		// 荒野中的奇异现象
		spiritFlicker: {
			text: [
				'荒野中，偶尔有蓝光闪过。',
				'是迷失的灵气，还是什么东西的魂？',
				'无从分辨，也无需分辨。'
			]
		},

		// 旧日战场
		oldBattlefield: {
			text: [
				'这片地上草木不生。',
				'灵气曾经在这里猛烈碰撞，土地现在还是干的。',
				'地里偶尔翻出来一些东西，都是曾经的人带来的。'
			]
		},

		// 天道裂缝（装饰性事件）
		voidRift: {
			text: [
				'天空中有一道细缝，发出很轻的嗡鸣声。',
				'修士们说，这是末法留下的伤。',
				'会不会愈合，没人说得准。'
			]
		}
	};

	// 注入到Outside事件系统
	if (typeof Events !== 'undefined' && Events.Outside) {
		Events.Outside = Events.Outside.concat(outsideEvents);
	} else {
		window.addEventListener('load', function() {
			if (Events && Events.Outside) {
				Events.Outside = Events.Outside.concat(outsideEvents);
			}
		});
	}

	// 导出world文案，供World模块调用
	window.WorldNarrative = {
		landmarks: worldLandmarkDescriptions,
		encounters: worldEncounterTexts
	};

})();
