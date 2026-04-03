/**
 * 宗门系统 - 方案C：建筑树 + 境界解锁等级
 * 基于ADR Room系统改造，复用全部建筑逻辑
 * 宗门等级自动跟随玩家境界
 */
var Sect = {
	
	// ==================== 宗门配置 ====================
	
	// 宗门名称列表
	_names: [
		'散修孤庐',      // Lv.0 - 凡境
		'散修营地',      // Lv.1 - 凝气境
		'小有所成',      // Lv.2 - 开脉境
		'一方修士',      // Lv.3 - 铸基境
		'修真门派',      // Lv.4 - 凝元境
		'仙道宗门',      // Lv.5 - 归虚境
		'飞升传承'       // Lv.6 - 渡劫境
	],
	
	// 境界解锁的建筑列表（key为建筑ID，value为最低宗门等级）
	_unlockMap: {
		// Lv.0 凡境可用
		'residence': 0,
		'cart': 0,
		'trap': 0,
		
		// Lv.1 凝气境解锁
		'lodge': 1,
		'trading_post': 1,
		
		// Lv.2 开脉境解锁
		'tannery': 2,
		
		// Lv.3 铸基境解锁
		'smokehouse': 3,
		'workshop': 3,
		
		// Lv.4 凝元境解锁
		'steelworks': 4,
		'armoury': 4,
		
		// Lv.5 归虚境解锁
		'ruins': 5
	},
	
	// 建筑属性重定义
	_buildingMeta: {
		'residence': { type: 'building', name: '弟子居', icon: '🏠' },
		'cart': { type: 'tool', name: '运灵车', icon: '🛒' },
		'trap': { type: 'building', name: '捕妖阵', icon: '🪤' },
		'lodge': { type: 'building', name: '灵兽阁', icon: '🦌' },
		'trading_post': { type: 'building', name: '藏宝阁', icon: '💎' },
		'tannery': { type: 'building', name: '制符殿', icon: '📜' },
		'smokehouse': { type: 'building', name: '丹房', icon: '⚗️' },
		'workshop': { type: 'building', name: '炼器殿', icon: '🔨' },
		'steelworks': { type: 'building', name: '天工坊', icon: '🔥' },
		'armoury': { type: 'building', name: '武库', icon: '⚔️' },
		'ruins': { type: 'special', name: '遗迹入口', icon: '🏛️' }
	},
	
	// ==================== 核心方法 ====================
	
	/**
	 * 获取当前宗门等级（跟随玩家境界）
	 */
	getLevel: function() {
		var realm = $SM.get('game.cultivationRealm', true) || 0;
		return Math.min(realm, 6); // 最大Lv.6
	},
	
	/**
	 * 获取宗门名称
	 */
	getName: function() {
		return this._names[this.getLevel()] || this._names[0];
	},
	
	/**
	 * 检查建筑是否解锁
	 */
	isUnlocked: function(buildingId) {
		var requiredLevel = this._unlockMap[buildingId];
		if (requiredLevel === undefined) return true; // 未在映射表中，默认解锁
		return this.getLevel() >= requiredLevel;
	},
	
	/**
	 * 获取建筑解锁要求文本
	 */
	getUnlockText: function(buildingId) {
		var requiredLevel = this._unlockMap[buildingId];
		if (requiredLevel === undefined || requiredLevel === 0) return null;
		var realmName = this._names[requiredLevel] || '更高境界';
		return '【需' + realmName + '】';
	},
	
	/**
	 * 获取建筑本地化名称
	 */
	getBuildingName: function(buildingId) {
		var meta = this._buildingMeta[buildingId];
		return meta ? meta.name : _(buildingId);
	},
	
	/**
	 * 获取建筑图标
	 */
	getBuildingIcon: function(buildingId) {
		var meta = this._buildingMeta[buildingId];
		return meta ? meta.icon : '📦';
	},
	
	/**
	 * 获取宗门加成描述
	 */
	getBonusDesc: function() {
		var level = this.getLevel();
		var bonuses = [
			'基础产出',
			'+50% 资源产出',
			'+100% 资源产出',
			'+200% 资源产出',
			'+300% 资源产出',
			'+400% 资源产出',
			'+500% 资源产出'
		];
		return bonuses[level] || bonuses[0];
	},
	
	// ==================== UI渲染 ====================
	
	/**
	 * 创建宗门面板并插入到指定容器之后（页面底部）
	 */
	createSectPanel: function(afterElement) {
		var level = this.getLevel();
		var name = this.getName();
		var bonus = this.getBonusDesc();
		var multiplier = this.getIncomeMultiplier();
		
		// 获取境界名称
		var realmNames = ['凡境', '凝气境', '开脉境', '铸基境', '凝元境', '归虚境', '渡劫境'];
		var realmName = realmNames[level] || realmNames[0];
		
		var html = '<div id="sectPanel" class="sect-panel">';
		html += '<div class="sect-header">';
		html += '<span class="sect-icon">🏛️</span>';
		html += '<span class="sect-name">' + name + '</span>';
		html += '<span class="sect-realm">（' + realmName + '）</span>';
		html += '</div>';
		html += '<div class="sect-info">';
		html += '<div class="sect-level">宗门等级：Lv.' + level + '</div>';
		html += '<div class="sect-bonus">' + bonus + ' <span class="bonus-multiplier">(×' + multiplier + ')</span></div>';
		html += '</div>';
		html += '<div class="sect-next-tip" id="sectNextTip"></div>';
		html += '</div>';
		
		var panel = $(html);
		panel.insertAfter(afterElement);
		
		// 更新下一个解锁提示
		this.updateNextUnlockTip();
		
		return panel;
	},
	
	/**
	 * 更新下一个解锁提示
	 */
	updateNextUnlockTip: function() {
		var level = this.getLevel();
		var nextLevel = level + 1;
		var tipEl = $('#sectNextTip');
		
		if (nextLevel > 6) {
			tipEl.html('<span class="sect-complete">🎉 已达最高境界！</span>');
			return;
		}
		
		// 找出下一个等级解锁的建筑
		var nextBuildings = [];
		for (var k in this._unlockMap) {
			if (this._unlockMap[k] === nextLevel) {
				nextBuildings.push(this.getBuildingName(k));
			}
		}
		
		if (nextBuildings.length > 0) {
			var realmNames = ['凡境', '凝气境', '开脉境', '铸基境', '凝元境', '归虚境', '渡劫境'];
			var nextRealm = realmNames[nextLevel] || '更高境界';
			tipEl.html('📍 境界提升至 <strong>' + nextRealm + '</strong> 可解锁：' + nextBuildings.join('、'));
		}
	},
	
	/**
	 * 渲染宗门状态面板（兼容旧方法）
	 */
	renderSectPanel: function(container) {
		if (container && container.id === 'sectPanel') {
			// 重新渲染已存在的面板
			var level = this.getLevel();
			var name = this.getName();
			var bonus = this.getBonusDesc();
			var multiplier = this.getIncomeMultiplier();
			
			var realmNames = ['凡境', '凝气境', '开脉境', '铸基境', '凝元境', '归虚境', '渡劫境'];
			var realmName = realmNames[level] || realmNames[0];
			
			container.querySelector('.sect-name').textContent = name;
			container.querySelector('.sect-realm').textContent = '（' + realmName + '）';
			container.querySelector('.sect-level').textContent = '宗门等级：Lv.' + level;
			container.querySelector('.sect-bonus').innerHTML = bonus + ' <span class="bonus-multiplier">(×' + multiplier + ')</span>';
			
			this.updateNextUnlockTip();
		}
	},
	
	/**
	 * 更新宗门信息显示（用于实时更新）
	 */
	updateDisplay: function() {
		var panel = document.getElementById('sectPanel');
		if (panel) {
			this.renderSectPanel(panel);
		}
	},
	
	/**
	 * 获取宗门收入加成倍率
	 */
	getIncomeMultiplier: function() {
		var level = this.getLevel();
		var multipliers = [1, 1.5, 2, 3, 4, 5, 6];
		return multipliers[level] || 1;
	},
	
	// ==================== 初始化 ====================
	
	/**
	 * 初始化宗门系统
	 */
	init: function() {
		// 监听境界变化，更新宗门显示
		$.Dispatch('stateUpdate').subscribe(function(e) {
			if (e.category === 'cultivation' || 
				(e.stateName && e.stateName.indexOf('cultivationRealm') === 0)) {
				Sect.updateDisplay();
			}
		});
		
		console.log('[Sect] 宗门系统初始化完成，当前：' + this.getName());
	}
};

// ==================== 装饰器：覆盖Room的建筑判断 ====================

/**
 * 在建筑解锁判断前插入宗门等级检查
 */
(function() {
	var originalCraftUnlocked = Room.craftUnlocked;
	
	Room.craftUnlocked = function(thing) {
		// 先检查宗门解锁
		if (!Sect.isUnlocked(thing)) {
			return false;
		}
		// 继续原有逻辑
		return originalCraftUnlocked.call(Room, thing);
	};
	
	var originalBuyUnlocked = Room.buyUnlocked;
	
	Room.buyUnlocked = function(thing) {
		// 先检查宗门解锁
		if (!Sect.isUnlocked(thing)) {
			return false;
		}
		// 继续原有逻辑
		return originalBuyUnlocked.call(Room, thing);
	};
	
	/**
	 * 覆盖建筑按钮创建，添加解锁提示
	 */
	var originalUpdateBuildButtons = Room.updateBuildButtons;
	
	Room.updateBuildButtons = function() {
		originalUpdateBuildButtons.call(Room);
		
		// 为未解锁的建筑添加提示和样式
		for (var k in Room.Craftables) {
			var craftable = Room.Craftables[k];
			var btn = craftable.button;
			
			if (!Sect.isUnlocked(k)) {
				if (btn) {
					btn.addClass('locked');
					var unlockText = Sect.getUnlockText(k);
					if (unlockText) {
						btn.attr('title', unlockText);
						// 添加解锁条件标签
						var label = btn.find('.build-label');
						if (label.length === 0) {
							label = btn;
						}
						label.after('<span class="unlock-label">' + unlockText + '</span>');
					}
				}
			} else {
				// 已解锁的，移除锁定样式
				if (btn) {
					btn.removeClass('locked');
					btn.find('.unlock-label').remove();
				}
			}
		}
	};
})();

// ==================== 覆盖建筑名称显示 ====================

/**
 * 装饰器：修改建筑名称显示为修仙风格
 */
(function() {
	var originalUpdateStoresView = Room.updateStoresView;
	
	Room.updateStoresView = function() {
		originalUpdateStoresView.call(Room);
		
		// 更新建筑名称
		for (var k in Sect._buildingMeta) {
			var meta = Sect._buildingMeta[k];
			var row = document.getElementById('row_' + k.replace(/ /g, '-'));
			if (row) {
				var keyEl = row.querySelector('.row_key');
				if (keyEl && meta.name) {
					keyEl.textContent = meta.icon + ' ' + meta.name;
				}
			}
		}
	};
})();

/**
 * 装饰器：修改按钮文字
 */
(function() {
	var originalBuild = Room.build;
	
	Room.build = function(buildBtn) {
		var thing = $(buildBtn).attr('buildThing');
		var meta = Sect._buildingMeta[thing];
		
		// 临时修改craftable名称
		var originalName = Room.Craftables[thing] ? Room.Craftables[thing].name : null;
		if (meta && originalName) {
			Room.Craftables[thing].name = meta.name;
		}
		
		var result = originalBuild.call(Room, buildBtn);
		
		// 恢复原名称
		if (meta && originalName) {
			Room.Craftables[thing].name = originalName;
		}
		
		return result;
	};
})();

/**
 * 装饰器：修改购买按钮文字
 */
(function() {
	var originalBuy = Room.buy;
	
	Room.buy = function(buyBtn) {
		var thing = $(buyBtn).attr('buildThing');
		var meta = Sect._buildingMeta[thing];
		
		// 临时修改good名称
		var originalName = Room.TradeGoods[thing] ? Room.TradeGoods[thing].name : null;
		if (meta && originalName) {
			Room.TradeGoods[thing].name = meta.name;
		}
		
		var result = originalBuy.call(Room, buyBtn);
		
		// 恢复原名称
		if (meta && originalName) {
			Room.TradeGoods[thing].name = originalName;
		}
		
		return result;
	};
})();

// ==================== 宗门面板已移除 ====================
// 宗门核心逻辑（建筑解锁）保留在 Sect 对象中
