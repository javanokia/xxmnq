/**
 * 《一介凡尘》探索界面系统
 * 版本：v1.0
 * 功能：重新设计的修仙世界探索界面
 */

(function() {

    var Exploration = window.Exploration = {

        // ═══════════════════════════════════════════════════════════
        // 探索区域定义
        // ═══════════════════════════════════════════════════════════

        regions: {

            'abandoned_mine': {
                id: 'abandoned_mine',
                name: '废弃矿洞',
                desc: '灵脉枯竭的旧矿，偶尔还能挖出些凡铁。',
                requires: null,
                duration: 120,
                cost: { wood: 5 },
                rewards: {
                    iron: { min: 10, max: 30, weight: 0.8 },
                    coal: { min: 5, max: 15, weight: 0.6 },
                    medicine: { min: 1, max: 5, weight: 0.1 }
                },
                events: ['cave_collapse', 'miner_ghost', 'ore_spirit', null],
                icon: '⛏️',
                color: '#795548'
            },

            'spirit_grass_valley': {
                id: 'spirit_grass_valley',
                name: '灵草谷',
                desc: '末法时代少数尚存灵草的地方。',
                requires: null,
                duration: 100,
                cost: { wood: 3 },
                rewards: {
                    medicine: { min: 5, max: 15, weight: 0.9 },
                    spirit_stone: { min: 1, max: 3, weight: 0.05 }
                },
                events: ['herb_gathering', 'spirit_beast', 'fellow_cultivator', null],
                icon: '🌿',
                color: '#4CAF50'
            },

            'beast_forest': {
                id: 'beast_forest',
                name: '妖兽林',
                desc: '林中仍有妖兽出没。危险，但妖肉和兽皮值钱。',
                requires: null,
                duration: 150,
                cost: { wood: 8 },
                rewards: {
                    meat: { min: 10, max: 25, weight: 0.9 },
                    scales: { min: 2, max: 8, weight: 0.3 },
                    teeth: { min: 3, max: 10, weight: 0.4 }
                },
                events: ['beast_attack', 'beast_hunt', 'rare_beast', null],
                icon: '🌲',
                color: '#8D6E63'
            },

            'dark_cave': {
                id: 'dark_cave',
                name: '幽暗洞穴',
                desc: '深入地底的洞穴，有残存的灵气。',
                requires: { realm: 'foundation' },
                duration: 180,
                cost: { wood: 15, medicine: 2 },
                rewards: {
                    sulphur: { min: 5, max: 15, weight: 0.7 },
                    essence: { min: 1, max: 3, weight: 0.2 },
                    alienAlloy: { min: 1, max: 2, weight: 0.05 }
                },
                events: ['underground_trial', 'ancient_trap', 'essence_pool', null],
                icon: '🕳️',
                color: '#37474F'
            },

            'ruined_city': {
                id: 'ruined_city',
                name: '废城废墟',
                desc: '末法浩劫前的城池遗址，如今只剩断壁残垣。',
                requires: { realm: 'foundation' },
                duration: 200,
                cost: { wood: 20, torch: 1 },
                rewards: {
                    cloth: { min: 10, max: 20, weight: 0.5 },
                    spirit_stone: { min: 3, max: 8, weight: 0.3 },
                    ancient_artifact: { min: 1, max: 1, weight: 0.1 }
                },
                events: ['looter', 'survivor', 'ancient_cache', null],
                icon: '🏚️',
                color: '#607D8B'
            },

            'ancient_abyss': {
                id: 'ancient_abyss',
                name: '深涧古潭',
                desc: '传说潭底通往另一个世界。',
                requires: { realm: 'core' },
                duration: 300,
                cost: { wood: 50, spirit_stone: 5 },
                rewards: {
                    alienAlloy: { min: 3, max: 10, weight: 0.6 },
                    essence: { min: 5, max: 15, weight: 0.5 },
                    rare_artifact: { min: 1, max: 1, weight: 0.15 }
                },
                events: ['water_trial', 'spirit_fish', 'abyss_gazer', null],
                icon: '🌊',
                color: '#0277BD'
            },

            'tribulation_plateau': {
                id: 'tribulation_plateau',
                name: '渡劫高原',
                desc: '传说渡劫成功的修士都是从这里飞升的。',
                requires: { realm: 'nascent' },
                duration: 600,
                cost: { wood: 100, spirit_stone: 20 },
                rewards: {
                    alienAlloy: { min: 10, max: 30, weight: 1.0 },
                    thunder_essence: { min: 1, max: 5, weight: 0.5 }
                },
                events: ['tribulation_vision', 'former_cultivator', 'heavenly_sign', null],
                icon: '⛰️',
                color: '#9C27B0'
            }
        },

        currentRegion: null,
        isExploring: false,
        explorationInterval: null,
        progress: 0,
        totalDuration: 0,

        init: function() {},

        enter: function() {
            Engine.activeModule = Exploration;
            this.renderView();
            this.previousModule = Engine.previousActiveModule;
        },

        exit: function() {
            if (this.previousModule) {
                Engine.activeModule = this.previousModule;
                this.previousModule.show();
            } else {
                Engine.activeModule = Room;
                Room.show();
            }
            this.reset();
        },

        startExploration: function(regionId) {
            var region = this.regions[regionId];
            if (!region) return { success: false, reason: 'invalid_region' };

            if (region.requires && !this.checkRequirement(region.requires)) {
                Events.emitNarrative('境界不足，无法前往此地。');
                return { success: false, reason: 'realm_required' };
            }

            for (var resource in region.cost) {
                var have = $SM.get('stores.' + resource, true) || 0;
                if (have < region.cost[resource]) {
                    Events.emitNarrative(this.getResourceName(resource) + '不足，无法前往探索。');
                    return { success: false, reason: 'insufficient_resources' };
                }
            }

            for (var resource in region.cost) {
                $SM.add('stores.' + resource, -region.cost[resource]);
            }

            this.currentRegion = region;
            this.isExploring = true;
            this.progress = 0;
            this.totalDuration = region.duration;

            this.renderExplorationProgress();
            this.startProgressTimer();

            return { success: true };
        },

        startProgressTimer: function() {
            var self = this;
            var tickInterval = 100;
            var totalTicks = (this.totalDuration * 1000) / tickInterval;
            var currentTick = 0;

            this.explorationInterval = setInterval(function() {
                currentTick++;
                self.progress = (currentTick / totalTicks) * 100;
                self.updateProgressDisplay();

                if (currentTick >= totalTicks) {
                    clearInterval(self.explorationInterval);
                    self.completeExploration();
                }
            }, tickInterval);
        },

        completeExploration: function() {
            var region = this.currentRegion;
            if (!region) return;

            this.isExploring = false;
            var rewards = this.calculateRewards(region.rewards);

            $SM.addM('stores', rewards);
            this.triggerRandomEvent(region.events);
            this.showResult(region, rewards);
        },

        calculateRewards: function(rewardConfig) {
            var rewards = {};
            for (var resource in rewardConfig) {
                var config = rewardConfig[resource];
                if (Math.random() < config.weight) {
                    var amount = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
                    if (Buff && Buff.has('blessed') > 0) {
                        amount = Math.floor(amount * 1.2);
                    }
                    rewards[resource] = amount;
                }
            }
            return rewards;
        },

        triggerRandomEvent: function(events) {
            if (Math.random() < 0.4 && events) {
                var eventId = events[Math.floor(Math.random() * (events.length - 1))];
                if (eventId && Events && Events.triggerEvent) {
                    return Events.triggerEvent(eventId);
                }
            }
            return null;
        },

        abort: function() {
            if (this.explorationInterval) clearInterval(this.explorationInterval);
            this.isExploring = false;
            Events.emitNarrative('你匆忙逃离了探索地点...');
            this.exit();
        },

        reset: function() {
            this.currentRegion = null;
            this.isExploring = false;
            this.progress = 0;
            this.totalDuration = 0;
            if (this.explorationInterval) clearInterval(this.explorationInterval);
        },

        checkRequirement: function(requires) {
            if (!requires || !requires.realm) return true;
            var currentRealm = $SM.get('game.cultivationRealm', true) || 'mortal';
            var realmOrder = ['mortal', 'qi_gathering', 'foundation', 'core', 'nascent', 'tribulation', 'ascended'];
            return realmOrder.indexOf(currentRealm) >= realmOrder.indexOf(requires.realm);
        },

        getResourceName: function(resourceId) {
            var names = {
                'wood': '灵晶', 'iron': '凡铁', 'coal': '阴火煤', 'medicine': '药材',
                'meat': '妖肉', 'scales': '妖鳞', 'teeth': '兽齿', 'leather': '熟皮',
                'cloth': '粗布', 'torch': '火折子', 'spirit_stone': '灵石',
                'sulphur': '焚晶砂', 'essence': '妖魄精', 'alienAlloy': '天外陨铁',
                'thunder_essence': '天雷精华'
            };
            return names[resourceId] || resourceId;
        },

        formatDuration: function(seconds) {
            var mins = Math.floor(seconds / 60);
            var secs = seconds % 60;
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        },

        renderView: function() {
            var container = document.getElementById('game');
            if (!container) return;

            var html = '<div id="exploration-view" class="exploration-view">';

            html += '<div class="exploration-header">';
            html += '<h2>【 山 外 荒 野 】</h2>';
            html += '<div class="exploration-subtitle">探索可获得灵材与资源</div>';
            html += '</div>';

            html += '<div class="region-grid">';

            for (var id in this.regions) {
                var region = this.regions[id];
                var isLocked = !this.checkRequirement(region.requires);

                html += '<div class="region-card ' + (isLocked ? 'locked' : '') + '"';
                html += ' data-region="' + id + '"';
                html += ' style="border-color: ' + region.color + '">';

                html += '<div class="region-icon">' + region.icon + '</div>';
                html += '<div class="region-name">' + region.name + '</div>';
                html += '<div class="region-desc">' + region.desc + '</div>';

                html += '<div class="region-cost">';
                for (var res in region.cost) {
                    html += this.getResourceName(res) + '×' + region.cost[res] + ' ';
                }
                html += '</div>';

                html += '<div class="region-rewards">可能获得：';
                var rewardNames = [];
                for (var res in region.rewards) {
                    if (region.rewards[res].weight > 0.5) {
                        rewardNames.push(this.getResourceName(res));
                    }
                }
                html += rewardNames.slice(0, 3).join('、');
                html += '</div>';

                if (isLocked) {
                    html += '<div class="region-locked-text">需' + (region.requires ? region.requires.realm : '凡境') + '解锁</div>';
                } else {
                    html += '<button class="btn-explore" data-region="' + id + '">探索</button>';
                }

                html += '</div>';
            }

            html += '</div>';
            html += '<div class="exploration-footer">';
            html += '<button id="btn-exit-exploration" class="btn-secondary">返回</button>';
            html += '</div>';
            html += '</div>';

            container.innerHTML = html;
            this.bindEvents();
        },

        renderExplorationProgress: function() {
            var container = document.getElementById('game');
            if (!container) return;

            var region = this.currentRegion;

            var html = '<div id="exploration-progress" class="exploration-progress">';

            html += '<div class="progress-header">';
            html += '<h2>' + region.icon + ' ' + region.name + '</h2>';
            html += '<p>' + region.desc + '</p>';
            html += '</div>';

            html += '<div class="progress-bar-container">';
            html += '<div id="progress-bar" class="progress-bar" style="width: 0%"></div>';
            html += '</div>';

            html += '<div class="progress-status">';
            html += '<span id="progress-percent">0%</span>';
            html += '<span id="progress-time">' + region.duration + '秒</span>';
            html += '</div>';

            html += '<div id="progress-narrative" class="progress-narrative">';
            html += this.getRandomNarrative(region.id);
            html += '</div>';

            html += '<div class="progress-actions">';
            html += '<button id="btn-abort-exploration" class="btn-danger">放弃探索</button>';
            html += '</div>';

            html += '</div>';

            container.innerHTML = html;

            document.getElementById('btn-abort-exploration').addEventListener('click', function() {
                Exploration.abort();
            });
        },

        updateProgressDisplay: function() {
            var progressBar = document.getElementById('progress-bar');
            var progressPercent = document.getElementById('progress-percent');
            var progressTime = document.getElementById('progress-time');
            var progressNarrative = document.getElementById('progress-narrative');

            if (progressBar) progressBar.style.width = this.progress + '%';
            if (progressPercent) progressPercent.textContent = Math.floor(this.progress) + '%';
            if (progressTime) {
                var remaining = Math.ceil((100 - this.progress) / 100 * this.totalDuration);
                progressTime.textContent = '剩余 ' + this.formatDuration(remaining) + '秒';
            }
            if (progressNarrative && Math.random() < 0.02) {
                progressNarrative.innerHTML = this.getRandomNarrative(this.currentRegion.id);
            }
        },

        showResult: function(region, rewards) {
            var container = document.getElementById('game');
            if (!container) return;

            var html = '<div id="exploration-result" class="exploration-result">';

            html += '<div class="result-header">';
            html += '<h2>' + region.icon + ' ' + region.name + ' - 探索完成</h2>';
            html += '</div>';

            html += '<div class="result-rewards">';
            html += '<h3>获得物资</h3>';

            var hasRewards = false;
            for (var res in rewards) {
                if (rewards[res] > 0) {
                    hasRewards = true;
                    html += '<div class="reward-item">';
                    html += '<span class="reward-name">' + this.getResourceName(res) + '</span>';
                    html += '<span class="reward-amount">+' + rewards[res] + '</span>';
                    html += '</div>';
                }
            }

            if (!hasRewards) html += '<p>未获得任何物资...</p>';
            html += '</div>';

            html += '<div class="result-actions">';
            html += '<button id="btn-continue-exploration" class="btn-primary">继续探索</button>';
            html += '<button id="btn-back-to-exploration" class="btn-secondary">返回地图</button>';
            html += '</div>';

            html += '</div>';

            container.innerHTML = html;

            document.getElementById('btn-continue-exploration').addEventListener('click', function() {
                Exploration.startExploration(region.id);
            });
            document.getElementById('btn-back-to-exploration').addEventListener('click', function() {
                Exploration.enter();
            });
        },

        getRandomNarrative: function(regionId) {
            var narratives = {
                'abandoned_mine': ['你举起火折子，深入矿洞...', '矿洞深处传来微弱的回声...', '脚下传来碎石滚动的声音...'],
                'spirit_grass_valley': ['灵草的清香在空气中飘荡...', '你仔细辨认着灵草的品相...', '谷中偶尔传来鸟鸣声...'],
                'beast_forest': ['林中传来窸窸窣窣的声音...', '你警觉地观察着周围的动静...', '远处似乎有什么在注视着你...'],
                'dark_cave': ['黑暗吞噬了一切光亮...', '你运转灵气，勉强看清周围...', '洞穴深处传来不明的声音...'],
                'ruined_city': ['断壁残垣诉说着昔日的辉煌...', '废墟中偶尔闪过金属的反光...', '风吹过空旷的街道...'],
                'ancient_abyss': ['古潭深不见底，寒气逼人...', '水面泛起诡异的波纹...', '隐约可见潭中有东西游动...'],
                'tribulation_plateau': ['高空中风雪呼啸...', '天劫的气息在此处尤为浓烈...', '远处的虚空中似有雷光闪烁...']
            };
            var list = narratives[regionId] || ['探索中...'];
            return list[Math.floor(Math.random() * list.length)];
        },

        bindEvents: function() {
            var self = this;
            document.querySelectorAll('.btn-explore').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    self.startExploration(this.dataset.region);
                });
            });
            var exitBtn = document.getElementById('btn-exit-exploration');
            if (exitBtn) exitBtn.addEventListener('click', function() { self.exit(); });
        },

        show: function() { this.enter(); }
    };

})();
