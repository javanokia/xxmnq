/**
 * 《一介凡尘》独立Buff图标栏系统
 * 版本：v1.0
 * 功能：管理丹药、增益、减益状态的显示与计时
 */

(function() {

    var Buff = window.Buff = {

        // Buff配置
        buffs: {},

        // 当前激活的Buff
        activeBuffs: {},

        // Buff计时器
        timers: {},

        // 初始化
        init: function() {
            this.buffs = {
                // ═══════════════════════════════════════
                // 丹药类Buff
                // ═══════════════════════════════════════

                'cultivation_speed': {
                    id: 'cultivation_speed',
                    name: '小还丹',
                    icon: '💊',
                    type: 'potion',
                    duration: 300,
                    effect: 'cultivation_rate_2x',
                    desc: '修炼速度翻倍',
                    color: '#4CAF50',
                    stackable: false
                },

                'breakthrough_boost': {
                    id: 'breakthrough_boost',
                    name: '破境丹',
                    icon: '✨',
                    type: 'consumable',
                    duration: 0,
                    effect: 'breakthrough_rate_15',
                    desc: '下次突破成功率+15%',
                    color: '#FFC107',
                    stackable: false,
                    consumedOnUse: true
                },

                'thunder_shield': {
                    id: 'thunder_shield',
                    name: '天雷丹',
                    icon: '⚡',
                    type: 'stackable',
                    duration: 0,
                    effect: 'block_thunder',
                    desc: '抵挡一道天雷',
                    color: '#9C27B0',
                    stackable: true,
                    maxStacks: 9
                },

                'spirit_restoration': {
                    id: 'spirit_restoration',
                    name: '灵气丹',
                    icon: '🌟',
                    type: 'potion',
                    duration: 180,
                    effect: 'exp_rate_1.5x',
                    desc: '修为获取+50%',
                    color: '#00BCD4',
                    stackable: false
                },

                // ═══════════════════════════════════════
                // 临时增益类
                // ═══════════════════════════════════════

                'body_shield': {
                    id: 'body_shield',
                    name: '护体符',
                    icon: '🛡',
                    type: 'buff',
                    duration: 600,
                    effect: 'shield_regen_1',
                    desc: '每秒恢复1点护盾',
                    color: '#2196F3',
                    stackable: false
                },

                'sharp_senses': {
                    id: 'sharp_senses',
                    name: '天眼符',
                    icon: '👁',
                    type: 'buff',
                    duration: 300,
                    effect: 'dodge_rate_10',
                    desc: '闪避率+10%',
                    color: '#E91E63',
                    stackable: false
                },

                'blessed': {
                    id: 'blessed',
                    name: '灵脉加持',
                    icon: '☯',
                    type: 'buff',
                    duration: 120,
                    effect: 'all_reward_20',
                    desc: '所有奖励+20%',
                    color: '#9C27B0',
                    stackable: false
                },

                // ═══════════════════════════════════════
                // 被动/永久Buff
                // ═══════════════════════════════════════

                'spirit_root_high': {
                    id: 'spirit_root_high',
                    name: '天灵根',
                    icon: '🌈',
                    type: 'passive',
                    duration: -1,
                    effect: 'breakthrough_rate_10',
                    desc: '突破成功率+10%',
                    color: '#FF9800',
                    stackable: false,
                    passive: true
                },

                'spirit_root_medium': {
                    id: 'spirit_root_medium',
                    name: '地灵根',
                    icon: '💎',
                    type: 'passive',
                    duration: -1,
                    effect: 'breakthrough_rate_5',
                    desc: '突破成功率+5%',
                    color: '#607D8B',
                    stackable: false,
                    passive: true
                },

                'remnant_blessing': {
                    id: 'remnant_blessing',
                    name: '前世余韵',
                    icon: '🔮',
                    type: 'passive',
                    duration: -1,
                    effect: 'cultivation_rate_remnant',
                    desc: '修炼速度+{n}%',
                    color: '#673AB7',
                    stackable: false,
                    passive: true,
                    dynamicDesc: true
                },

                // ═══════════════════════════════════════
                // 减益类
                // ═══════════════════════════════════════

                'injury_light': {
                    id: 'injury_light',
                    name: '经脉淤堵',
                    icon: '💔',
                    type: 'debuff',
                    duration: 180,
                    effect: 'cultivation_rate_0.7',
                    desc: '修炼速度-30%',
                    color: '#F44336',
                    stackable: false
                },

                'injury_heavy': {
                    id: 'injury_heavy',
                    name: '道基受损',
                    icon: '💀',
                    type: 'debuff',
                    duration: 600,
                    effect: 'cultivation_rate_0.3',
                    desc: '修炼速度-70%',
                    color: '#B71C1C',
                    stackable: false
                },

                'poison': {
                    id: 'poison',
                    name: '妖兽之毒',
                    icon: '🩸',
                    type: 'debuff',
                    duration: 120,
                    effect: 'health_drain_1',
                    desc: '每秒损失1点生命',
                    color: '#4A148C',
                    stackable: false
                },

                'exhausted': {
                    id: 'exhausted',
                    name: '体力透支',
                    icon: '😫',
                    type: 'debuff',
                    duration: 300,
                    effect: 'exploration_cost_2x',
                    desc: '探索消耗翻倍',
                    color: '#795548',
                    stackable: false
                }
            };

            // 从存档恢复Buff
            this.restoreFromSave();

            // 监听游戏状态更新
            $.Dispatch('stateUpdate').subscribe(this.handleStateUpdate.bind(this));
        },

        // ═══════════════════════════════════════════════════════════
        // 核心方法
        // ═══════════════════════════════════════════════════════════

        /**
         * 添加Buff
         * @param {string} buffId - Buff ID
         * @param {number} stacks - 叠加层数（仅stackable有效）
         */
        add: function(buffId, stacks) {
            var buffConfig = this.buffs[buffId];
            if (!buffConfig) {
                Engine.log('Buff not found: ' + buffId);
                return false;
            }

            var currentStack = this.activeBuffs[buffId] || 0;

            // 检查最大叠加
            if (buffConfig.stackable && buffConfig.maxStacks) {
                if (currentStack >= buffConfig.maxStacks) {
                    return false; // 已达最大叠加
                }
                this.activeBuffs[buffId] = Math.min(currentStack + (stacks || 1), buffConfig.maxStacks);
            } else if (!buffConfig.stackable) {
                if (currentStack > 0) {
                    return false; // 不可叠加，已存在
                }
                this.activeBuffs[buffId] = 1;
            } else {
                this.activeBuffs[buffId] = currentStack + (stacks || 1);
            }

            // 启动计时器
            if (buffConfig.duration > 0 && !buffConfig.passive) {
                this.startTimer(buffId, buffConfig.duration);
            }

            // 保存到存档
            this.saveToStorage();

            // 更新UI
            this.render();

            // 应用效果
            this.applyEffect(buffId);

            // 通知
            if (buffConfig.type === 'debuff') {
                Events.emitNarrative('你受到了「' + buffConfig.name + '」的影响。');
            } else {
                Events.emitNarrative('「' + buffConfig.name + '」生效。');
            }

            return true;
        },

        /**
         * 移除Buff
         * @param {string} buffId - Buff ID
         */
        remove: function(buffId) {
            var buffConfig = this.buffs[buffId];
            if (!buffConfig) return;

            // 移除计时器
            if (this.timers[buffId]) {
                clearInterval(this.timers[buffId].interval);
                clearTimeout(this.timers[buffId].timeout);
                delete this.timers[buffId];
            }

            // 移除激活状态
            delete this.activeBuffs[buffId];

            // 保存到存档
            this.saveToStorage();

            // 更新UI
            this.render();

            // 移除效果
            this.removeEffect(buffId);
        },

        /**
         * 消耗一个Buff（用于一次性Buff）
         * @param {string} buffId - Buff ID
         */
        consume: function(buffId) {
            if (this.activeBuffs[buffId] > 0) {
                this.remove(buffId);
                return true;
            }
            return false;
        },

        /**
         * 检查是否有某个Buff
         * @param {string} buffId - Buff ID
         * @returns {number} 叠加层数
         */
        has: function(buffId) {
            return this.activeBuffs[buffId] || 0;
        },

        /**
         * 获取Buff效果值
         * @param {string} effectType - 效果类型
         * @returns {number} 效果数值
         */
        getEffectValue: function(effectType) {
            var total = 0;

            for (var buffId in this.activeBuffs) {
                var buff = this.buffs[buffId];
                if (!buff || !buff.effect) continue;

                var effect = buff.effect;
                if (effect === effectType) {
                    total += buff.stackable ? this.activeBuffs[buffId] : 1;
                }
            }

            return total;
        },

        /**
         * 获取修炼速率加成
         */
        getCultivationRate: function() {
            var rate = 1.0;

            // 累加所有修炼相关Buff
            if (this.has('cultivation_speed') > 0) rate *= 2.0;
            if (this.has('spirit_restoration') > 0) rate *= 1.5;
            if (this.has('remnant_blessing') > 0) {
                var remnant = $SM.get('game.prestige.remnant', true) || 0;
                rate *= (1 + remnant * 0.01);
            }

            // 减益效果
            if (this.has('injury_light') > 0) rate *= 0.7;
            if (this.has('injury_heavy') > 0) rate *= 0.3;

            return rate;
        },

        /**
         * 获取突破成功率加成
         */
        getBreakthroughBonus: function() {
            var bonus = 0;

            if (this.has('breakthrough_boost') > 0) bonus += 0.15;
            if (this.has('spirit_root_high') > 0) bonus += 0.10;
            if (this.has('spirit_root_medium') > 0) bonus += 0.05;
            if (this.has('remnant_blessing') > 0) {
                var remnant = $SM.get('game.prestige.remnant', true) || 0;
                bonus += Math.min(remnant * 0.005, 0.10);
            }

            return bonus;
        },

        // ═══════════════════════════════════════════════════════════
        // 计时器管理
        // ═══════════════════════════════════════════════════════════

        startTimer: function(buffId, duration) {
            var self = this;
            var remaining = duration;
            var displayEl = null;

            // 清除旧计时器
            if (this.timers[buffId]) {
                clearInterval(this.timers[buffId].interval);
                clearTimeout(this.timers[buffId].timeout);
            }

            // 创建新计时器
            this.timers[buffId] = {
                duration: duration,
                remaining: remaining,

                interval: setInterval(function() {
                    remaining--;
                    self.timers[buffId].remaining = remaining;
                    self.updateTimerDisplay(buffId, remaining);

                    if (remaining <= 0) {
                        self.remove(buffId);
                    }
                }, 1000),

                timeout: setTimeout(function() {
                    self.remove(buffId);
                }, duration * 1000)
            };
        },

        updateTimerDisplay: function(buffId, remaining) {
            var timerEl = document.getElementById('buff-timer-' + buffId);
            if (timerEl) {
                timerEl.textContent = this.formatTime(remaining);
            }
        },

        formatTime: function(seconds) {
            if (seconds < 0) return '∞';
            var mins = Math.floor(seconds / 60);
            var secs = seconds % 60;
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        },

        // ═══════════════════════════════════════════════════════════
        // 效果应用
        // ═══════════════════════════════════════════════════════════

        applyEffect: function(buffId) {
            var buff = this.buffs[buffId];
            if (!buff) return;

            switch (buff.effect) {
                // 这些效果通过 getCultivationRate() 等方法统一计算
                // 这里可以添加即时生效的效果
                case 'block_thunder':
                    // 天雷丹：自动添加到天劫防御计数
                    Engine.log('Thunder shield ready');
                    break;

                case 'health_drain_1':
                    // 中毒效果：每秒扣血
                    this.startHealthDrain();
                    break;
            }
        },

        removeEffect: function(buffId) {
            var buff = this.buffs[buffId];
            if (!buff) return;

            switch (buff.effect) {
                case 'health_drain_1':
                    this.stopHealthDrain();
                    break;
            }
        },

        healthDrainInterval: null,

        startHealthDrain: function() {
            var self = this;
            if (this.healthDrainInterval) return;

            this.healthDrainInterval = setInterval(function() {
                if (self.has('poison') <= 0) {
                    clearInterval(self.healthDrainInterval);
                    self.healthDrainInterval = null;
                    return;
                }

                var health = $SM.get('character.health', true) || 100;
                $SM.set('character.health', Math.max(0, health - 1));
                Notifications.add('poison', '生命流逝中...', '#F44336');

            }, 1000);
        },

        stopHealthDrain: function() {
            if (this.healthDrainInterval) {
                clearInterval(this.healthDrainInterval);
                this.healthDrainInterval = null;
            }
        },

        // ═══════════════════════════════════════════════════════════
        // 存档管理
        // ═══════════════════════════════════════════════════════════

        saveToStorage: function() {
            $SM.set('buffs.active', JSON.stringify(this.activeBuffs));
        },

        restoreFromSave: function() {
            var saved = $SM.get('buffs.active', true);
            if (saved) {
                try {
                    this.activeBuffs = JSON.parse(saved);
                } catch (e) {
                    this.activeBuffs = {};
                }
            }
        },

        // ═══════════════════════════════════════════════════════════
        // UI渲染
        // ═══════════════════════════════════════════════════════════

        render: function() {
            var container = document.getElementById('buff-bar');
            if (!container) {
                // 创建Buff栏
                this.createBuffBar();
                container = document.getElementById('buff-bar');
            }

            // 清空现有内容
            container.innerHTML = '';

            // 渲染每个Buff
            for (var buffId in this.activeBuffs) {
                var buff = this.buffs[buffId];
                if (!buff) continue;

                var stacks = this.activeBuffs[buffId];
                var item = this.createBuffElement(buffId, buff, stacks);
                container.appendChild(item);
            }

            // 如果没有Buff，隐藏整个栏
            if (Object.keys(this.activeBuffs).length === 0) {
                container.style.display = 'none';
                return;
            }

            // 有Buff时显示
            container.style.display = '';
        },

        createBuffBar: function() {
            var bar = document.createElement('div');
            bar.id = 'buff-bar';
            bar.className = 'buff-bar';

            // 插入到header区域
            var header = document.querySelector('header') || document.querySelector('#header');
            if (header) {
                header.appendChild(bar);
            } else {
                // 如果找不到header，放到body顶部
                document.body.insertBefore(bar, document.body.firstChild);
            }
        },

        createBuffElement: function(buffId, buff, stacks) {
            var item = document.createElement('div');
            item.className = 'buff-item buff-' + buff.type;
            item.id = 'buff-' + buffId;
            item.dataset.type = buff.type;
            item.style.borderColor = buff.color;

            // 图标
            var icon = document.createElement('span');
            icon.className = 'buff-icon';
            icon.textContent = buff.icon;
            item.appendChild(icon);

            // 叠加层数
            if (buff.stackable && stacks > 1) {
                var stack = document.createElement('span');
                stack.className = 'buff-stacks';
                stack.textContent = '×' + stacks;
                stack.style.background = buff.color;
                item.appendChild(stack);
            }

            // 计时器
            if (buff.duration > 0 && !buff.passive) {
                var timer = document.createElement('span');
                timer.className = 'buff-timer';
                timer.id = 'buff-timer-' + buffId;
                timer.textContent = this.formatTime(this.timers[buffId]?.remaining || buff.duration);
                item.appendChild(timer);
            }

            // 被动标记
            if (buff.passive) {
                var passive = document.createElement('span');
                passive.className = 'buff-passive';
                passive.textContent = '∞';
                item.appendChild(passive);
            }

            // 悬浮提示
            var desc = buff.desc;
            if (buff.dynamicDesc && buffId === 'remnant_blessing') {
                var remnant = $SM.get('game.prestige.remnant', true) || 0;
                desc = desc.replace('{n}', remnant);
            }
            item.title = buff.name + '\n' + desc;

            // 点击效果（可手动移除）
            item.addEventListener('click', function() {
                if (buff.type === 'debuff') {
                    // 减益可以点击移除
                    Notifications.confirm('是否移除「' + buff.name + '」？', function() {
                        Buff.remove(buffId);
                    });
                }
            });

            return item;
        },

        // ═══════════════════════════════════════════════════════════
        // 状态监听
        // ═══════════════════════════════════════════════════════════

        handleStateUpdate: function(state) {
            // state 格式: {category: string, stateName: string}
            if (state && state.stateName && state.stateName.indexOf('game.cultivationRealm') === 0) {
                this.render();
            }
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 快捷方法
    // ═══════════════════════════════════════════════════════════

    /**
     * 添加小还丹效果
     */
    window.useMedicineSmall = function() {
        if ($SM.get('stores.medicine_small', true) > 0) {
            $SM.add('stores.medicine_small', -1);
            Buff.add('cultivation_speed');
            return true;
        }
        return false;
    };

    /**
     * 添加破境丹效果
     */
    window.useElixirBreakthrough = function() {
        if ($SM.get('stores.elixir_breakthrough', true) > 0) {
            $SM.add('stores.elixir_breakthrough', -1);
            Buff.add('breakthrough_boost');
            return true;
        }
        return false;
    };

    /**
     * 添加天雷丹（渡劫用）
     */
    window.useThunderElixir = function() {
        if ($SM.get('stores.thunder_elixir', true) > 0) {
            $SM.add('stores.thunder_elixir', -1);
            Buff.add('thunder_shield', 1);
            return true;
        }
        return false;
    };

    /**
     * 检测天雷丹是否可抵挡天雷
     */
    window.canBlockThunder = function() {
        return Buff.has('thunder_shield') > 0;
    };

    /**
     * 消耗一个天雷丹抵挡天雷
     */
    window.blockThunderWithElixir = function() {
        if (Buff.consume('thunder_shield')) {
            return true;
        }
        return false;
    };

})();
