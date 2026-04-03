var Prestige = {
		
	name: 'Prestige',

	options: {},

	// ═══════════════════════════════════════
	// 《一介凡尘》轮回传承选项
	// （修炼者可携带前世余韵进入新轮回）
	// ═══════════════════════════════════════
	LEGACIES: {
		'memory_shard': {
			name: '记忆碎片',
			desc: '前世残存的记忆，开局时触发一段特殊叙事事件',
			cost: 5,
			effect: 'event'
		},
		'broken_artifact': {
			name: '残损法器',
			desc: '前世使用过的法器，强度减半但开局即可使用',
			cost: 10,
			effect: 'weapon'
		},
		'cultivation_notes': {
			name: '修炼笔记',
			desc: '前世整理的修炼心得，突破消耗降低10%',
			cost: 15,
			effect: 'cultivation_discount'
		}
	},

	init: function(options) {
		this.options = $.extend(this.options, options);
		// 游戏启动时展示轮回开局叙事
		this._showPrestigeOpening();
	},
	
	storesMap: [
		{ store: 'wood', type: 'g' },
		{ store: 'fur', type: 'g' },
		{ store: 'meat', type: 'g' },
		{ store: 'iron', type: 'g' },
		{ store: 'coal', type: 'g' },
		{ store: 'sulphur', type: 'g' },
		{ store: 'steel', type: 'g' },
		{ store: 'cured meat', type: 'g' },
		{ store: 'scales', type: 'g' },
		{ store: 'teeth', type: 'g' },
		{ store: 'leather', type: 'g' },
		{ store: 'bait', type: 'g' },
		{ store: 'torch', type: 'g' },
		{ store: 'cloth', type: 'g' },
		{ store: 'bone spear', type: 'w' },
		{ store: 'iron sword', type: 'w' },
		{ store: 'steel sword', type: 'w' },
		{ store: 'bayonet', type: 'w' },
		{ store: 'rifle', type: 'w' },
		{ store: 'laser rifle', type: 'w' },
		{ store: 'bullets', type: 'a' },
		{ store: 'energy cell', type: 'a' },
		{ store: 'grenade', type: 'a' },
		{ store: 'bolas', type: 'a' }
	],
	
	getStores: function(reduce) {
		var stores = [];
		
		for(var i in this.storesMap) {
			var s = this.storesMap[i];
			stores.push(Math.floor($SM.get('stores["' + s.store + '"]', true) / 
					(reduce ? this.randGen(s.type) : 1)));
		}
		
		return stores;
	},
	
	get: function() {
		return {
			stores: $SM.get('previous.stores'),
			score: $SM.get('previous.score')
		};
	},
	
	set: function(prestige) {
		$SM.set('previous.stores', prestige.stores);
		$SM.set('previous.score', prestige.score);
	},
	
	save: function() {
		$SM.set('previous.stores', this.getStores(true));
		$SM.set('previous.score', Score.totalScore());
	},
  
	collectStores : function() {
		var prevStores = $SM.get('previous.stores');
		if(prevStores != null) {
			var toAdd = {};
			for(var i in this.storesMap) {
				var s = this.storesMap[i];
				toAdd[s.store] = prevStores[i];
			}
			$SM.addM('stores', toAdd);
			
			// Loading the stores clears em from the save
			prevStores.length = 0;
		}
	},

	randGen : function(storeType) {
		var amount;
		switch(storeType) {
		case 'g':
			amount = Math.floor(Math.random() * 10);
			break;
		case 'w':
			amount = Math.floor(Math.floor(Math.random() * 10) / 2);
			break;
		case 'a':
			amount = Math.ceil(Math.random() * 10 * Math.ceil(Math.random() * 10));
			break;
		default:
			return 1;
		}
		if (amount !== 0) {
			return amount;
		}
		return 1;
	},

	// ═══════════════════════════════════════
	// 《一介凡尘》轮回叙事：开局台词
	// ═══════════════════════════════════════

	/**
	 * 获取当前轮回次数（根据previous.score推断）
	 */
	getPrestigeLevel: function() {
		var prev = this.get();
		if (!prev || !prev.score || prev.score <= 0) return 0;
		// 粗略估算：每1000分约为1次轮回
		return Math.min(5, Math.floor(prev.score / 1000));
	},

	/**
	 * 在游戏启动时显示轮回开局台词
	 * 仅在有前世存档时触发
	 */
	_showPrestigeOpening: function() {
		if (typeof PrestigeNarrative === 'undefined') return;
		
		var prev = this.get();
		// 只在有前世遗产时显示轮回台词
		if (!prev || (!prev.stores && !prev.score)) return;

		var level = this.getPrestigeLevel();
		var openings = PrestigeNarrative.prestigeOpenings;
		var texts;

		if (level === 0) {
			texts = openings.level0;
		} else if (level === 1) {
			texts = openings.level1;
		} else if (level === 2) {
			texts = openings.level2;
		} else if (level === 3) {
			texts = openings.level3;
		} else if (level === 4) {
			texts = openings.level4;
		} else {
			texts = openings.level5plus;
		}

		if (!texts) return;

		// 延迟显示，等待游戏界面加载完成
		var self = this;
		setTimeout(function() {
			self._displayNarrativeLines(texts, '轮回记忆');
		}, 3000);

		// Prestige 3+ 显示深层传说
		if (level >= 3) {
			setTimeout(function() {
				var deepKey = 'revelation_prestige' + Math.min(level, 5);
				var deepLore = PrestigeNarrative.deepLore[deepKey];
				if (!deepLore) deepLore = PrestigeNarrative.deepLore.final_mystery;
				if (deepLore) {
					self._displayNarrativeLines(deepLore, '前世幽冥');
				}
			}, 15000);
		}
	},

	/**
	 * 逐行显示叙事文本（通知流方式）
	 */
	_displayNarrativeLines: function(lines, source) {
		if (!lines || !lines.length) return;
		var delay = 0;
		var sourceObj = { name: source || '轮回' };
		lines.forEach(function(line) {
			if (!line || line.trim() === '') {
				delay += 500;
				return;
			}
			setTimeout(function() {
				if (typeof Notifications !== 'undefined') {
					Notifications.notify(sourceObj, line, true, 4000);
				}
			}, delay);
			delay += 1200;
		});
	},

	/**
	 * 应用传承效果（游戏开始时调用）
	 */
	applyLegacyEffects: function() {
		var legacies = $SM.get('previous.legacies') || [];
		var self = this;
		
		legacies.forEach(function(legacyId) {
			var legacy = self.LEGACIES[legacyId];
			if (!legacy) return;

			switch (legacy.effect) {
				case 'cultivation_discount':
					// 修炼笔记：突破消耗-10%（通过全局标记实现）
					$SM.set('game.legacyCultivationDiscount', true);
					if (typeof Notifications !== 'undefined') {
						Notifications.notify({ name: '传承' }, '修炼笔记的记忆涌现，你对修炼之道更为熟悉。', true, 5000);
					}
					break;
				case 'weapon':
					// 残损法器：开局给一件法宝（强度减半）
					$SM.add('stores["bone spear"]', 1);
					if (typeof Notifications !== 'undefined') {
						Notifications.notify({ name: '传承' }, '残损法器在背囊中发出微弱的嗡鸣。', true, 5000);
					}
					break;
				case 'event':
					// 记忆碎片：在15秒后触发一个特殊事件
					if (typeof PrestigeNarrative !== 'undefined') {
						setTimeout(function() {
							self._displayNarrativeLines(
								['碎裂的画面突然涌现。', '你见过这座山洞——', '不是在梦里。是真实的记忆。'],
								'记忆碎片'
							);
						}, 15000);
					}
					break;
			}
		});
	}

};

