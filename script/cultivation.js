/**
 * 《一介凡尘》境界系统核心模块
 * 核心框架：境界状态 + 修为进度 + 基础UI
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════
    // 境界数据配置
    // ═══════════════════════════════════════════════════════════════════
    var REALMS = {
        0: {
            name: '凡境',
            shortName: '凡',
            level: 0,
            maxProgress: 100,
            desc: '尚未踏入修行之路的凡人',
            unlocks: ['exploration_废弃矿洞', 'exploration_灵草谷']
        },
        1: {
            name: '凝气境',
            shortName: '凝气',
            level: 1,
            maxProgress: 200,
            desc: '吸纳灵气，凝聚丹田',
            unlocks: ['exploration_妖兽林', 'artifact_tier_1']
        },
        2: {
            name: '开脉境',
            shortName: '开脉',
            level: 2,
            maxProgress: 400,
            desc: '开辟经脉，气血流转',
            unlocks: ['exploration_幽暗洞穴']
        },
        3: {
            name: '铸基境',
            shortName: '铸基',
            level: 3,
            maxProgress: 800,
            desc: '铸就道基，稳固根基',
            unlocks: ['exploration_废城废墟', 'alchemy_enabled']
        },
        4: {
            name: '凝元境',
            shortName: '凝元',
            level: 4,
            maxProgress: 1600,
            desc: '凝聚元神，神识初成',
            unlocks: ['exploration_深涧古潭']
        },
        5: {
            name: '归虚境',
            shortName: '归虚',
            level: 5,
            maxProgress: 3200,
            desc: '归于虚空，道法自然',
            unlocks: ['artifact_tier_2']
        },
        6: {
            name: '渡劫境',
            shortName: '渡劫',
            level: 6,
            maxProgress: Infinity,
            desc: '渡劫飞升，超脱生死',
            unlocks: ['exploration_渡劫高原', 'tribulation_enabled']
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // 全局对象
    // ═══════════════════════════════════════════════════════════════════
    window.Cultivation = {
        name: 'Cultivation',
        VERSION: '0.1.0'
    };

    var Cultivation = window.Cultivation;

    // ═══════════════════════════════════════════════════════════════════
    // 状态路径
    // ═══════════════════════════════════════════════════════════════════
    var STATE = {
        realm: 'game.cultivationRealm',
        progress: 'game.cultivationProgress',
        totalCultivated: 'game.totalCultivated',
        breakthroughCount: 'game.breakthroughCount',
        lastCultivateTime: 'game.lastCultivateTime'
    };

    // ═══════════════════════════════════════════════════════════════════
    // 初始化
    // ═══════════════════════════════════════════════════════════════════
    Cultivation.init = function() {
        // 初始化状态
        if ($SM.get(STATE.realm) === undefined) {
            $SM.set(STATE.realm, 0);
        }
        if ($SM.get(STATE.progress) === undefined) {
            $SM.set(STATE.progress, 0);
        }
        if ($SM.get(STATE.totalCultivated) === undefined) {
            $SM.set(STATE.totalCultivated, 0);
        }
        if ($SM.get(STATE.breakthroughCount) === undefined) {
            $SM.set(STATE.breakthroughCount, 0);
        }

        // 订阅状态变化
        $.Dispatch('stateUpdate').subscribe(this.handleStateUpdate.bind(this));

        // 定期修为积累（每tick）
        this.startCultivationLoop();

        // 渲染UI
        this.render();
    };

    // ═══════════════════════════════════════════════════════════════════
    // 修为积累循环
    // ═══════════════════════════════════════════════════════════════════
    Cultivation.cultivationInterval = null;

    Cultivation.startCultivationLoop = function() {
        // 每秒积累修为
        if (this.cultivationInterval) {
            clearInterval(this.cultivationInterval);
        }

        this.cultivationInterval = setInterval(function() {
            var realm = $SM.get(STATE.realm);
            var realmData = REALMS[realm];

            // 渡劫境不再积累（游戏终点）
            if (realm >= 6) return;

            // 每秒修为：基础1点，根据境界略有加成
            var baseRate = 1 + Math.floor(realm * 0.2);
            this.addProgress(baseRate);

            // 更新UI进度条
            this.updateProgressBar();
        }.bind(this), 1000);
    };

    // ═══════════════════════════════════════════════════════════════════
    // 修为操作
    // ═══════════════════════════════════════════════════════════════════

    /**
     * 增加修为进度
     * @param {number} amount - 修为增量
     */
    Cultivation.addProgress = function(amount) {
        var realm = $SM.get(STATE.realm);
        var current = $SM.get(STATE.progress);
        var realmData = REALMS[realm];

        if (realm >= 6) return; // 渡劫境不再积累

        var newProgress = current + amount;
        var maxProgress = realmData.maxProgress;

        // 触发突破
        if (newProgress >= maxProgress) {
            this.breakthrough();
        } else {
            $SM.set(STATE.progress, newProgress);
            $SM.set(STATE.totalCultivated, $SM.get(STATE.totalCultivated) + amount);
        }
    };

    /**
     * 设置修为进度（用于事件奖励等）
     * @param {number} amount - 直接设置的修为值
     */
    Cultivation.setProgress = function(amount) {
        $SM.set(STATE.progress, amount);
        this.checkBreakthrough();
    };

    /**
     * 检查是否需要突破
     */
    Cultivation.checkBreakthrough = function() {
        var realm = $SM.get(STATE.realm);
        var current = $SM.get(STATE.progress);
        var realmData = REALMS[realm];

        if (realm >= 6) return; // 渡劫境

        if (current >= realmData.maxProgress) {
            this.breakthrough();
        }
    };

    /**
     * 执行突破
     */
    Cultivation.breakthrough = function() {
        var currentRealm = $SM.get(STATE.realm);

        if (currentRealm >= 6) {
            // 已达渡劫境
            $SM.set(STATE.progress, REALMS[6].maxProgress);
            return;
        }

        var newRealm = currentRealm + 1;
        var newRealmData = REALMS[newRealm];

        // 计算溢出的修为
        var overflow = $SM.get(STATE.progress) - REALMS[currentRealm].maxProgress;
        overflow = Math.max(0, overflow);

        // 更新境界
        $SM.set(STATE.realm, newRealm);
        $SM.set(STATE.progress, overflow);
        $SM.set(STATE.breakthroughCount, $SM.get(STATE.breakthroughCount) + 1);
        $SM.set(STATE.lastCultivateTime, Date.now());

        // 触发突破事件
        this.triggerBreakthroughEvent(currentRealm, newRealm, newRealmData);
    };

    // ═══════════════════════════════════════════════════════════════════
    // 突破事件
    // ═══════════════════════════════════════════════════════════════════
    Cultivation.triggerBreakthroughEvent = function(fromRealm, toRealm, realmData) {
        var title = '突破至' + realmData.name;

        var text = [
            '丹田中的灵气翻涌不止...',
            '经脉中响起轰鸣！',
            '你成功突破至【' + realmData.name + '】！'
        ];

        // 根据突破境界添加解锁信息
        if (realmData.unlocks && realmData.unlocks.length > 0) {
            text.push('');
            text.push('新的可能正在展开...');
        }

        // 显示突破通知
        if (typeof Notifications !== 'undefined') {
            Notifications.printMessage(title);
        }

        // 特殊境界特殊效果
        if (toRealm === 3) {
            // 铸基境解锁炼丹
            text.push('');
            text.push('你感到丹田中凝聚的灵气足以炼制丹药。');
        }
        if (toRealm === 6) {
            // 渡劫境
            text.push('');
            text.push('你的修为已至人间巅峰。');
            text.push('天劫将至...');
        }

        // 显示突破面板
        this.showBreakthroughPanel(fromRealm, toRealm, realmData, text);

        // 更新探索系统解锁状态
        if (typeof Exploration !== 'undefined') {
            Exploration.onRealmUnlock(toRealm, realmData);
        }

        // 更新法宝系统
        if (typeof Artifact !== 'undefined') {
            Artifact.onRealmUnlock(toRealm, realmData);
        }
    };

    /**
     * 显示突破面板
     */
    Cultivation.showBreakthroughPanel = function(fromRealm, toRealm, realmData, text) {
        var html = '<div id="cultivation-breakthrough" class="cultivation-panel">';
        html += '<div class="breakthrough-title">突破成功！</div>';
        html += '<div class="breakthrough-realm">' + realmData.name + '</div>';
        html += '<div class="breakthrough-desc">' + realmData.desc + '</div>';

        if (realmData.unlocks && realmData.unlocks.length > 0) {
            html += '<div class="breakthrough-unlocks">';
            html += '<div class="unlocks-title">境界提升带来的变化：</div>';
            for (var i = 0; i < realmData.unlocks.length; i++) {
                var unlock = realmData.unlocks[i];
                html += '<div class="unlock-item">' + this.getUnlockName(unlock) + '</div>';
            }
            html += '</div>';
        }

        html += '<div class="breakthrough-buttons">';
        html += '<button class="btn-breakthrough" data-action="close">' + ('继续修行') + '</button>';
        html += '</div>';
        html += '</div>';

        // 阻止背景交互
        var overlay = document.createElement('div');
        overlay.id = 'cultivation-overlay';
        overlay.className = 'cultivation-overlay';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        // 绑定按钮事件
        overlay.querySelector('[data-action="close"]').addEventListener('click', function() {
            this.closeBreakthroughPanel();
        }.bind(this));
    };

    /**
     * 关闭突破面板
     */
    Cultivation.closeBreakthroughPanel = function() {
        var overlay = document.getElementById('cultivation-overlay');
        var panel = document.getElementById('cultivation-breakthrough');
        if (overlay) overlay.remove();
        if (panel) panel.remove();

        // 更新主UI
        this.render();
    };

    /**
     * 获取解锁项显示名称
     */
    Cultivation.getUnlockName = function(unlock) {
        var names = {
            'exploration_废弃矿洞': '可探索：废弃矿洞',
            'exploration_灵草谷': '可探索：灵草谷',
            'exploration_妖兽林': '可探索：妖兽林',
            'exploration_幽暗洞穴': '可探索：幽暗洞穴',
            'exploration_废城废墟': '可探索：废城废墟',
            'exploration_深涧古潭': '可探索：深涧古潭',
            'exploration_渡劫高原': '可探索：渡劫高原',
            'artifact_tier_1': '可炼制新法宝',
            'artifact_tier_2': '可炼制高阶法宝',
            'alchemy_enabled': '解锁炼丹功能',
            'tribulation_enabled': '可渡天劫'
        };
        return names[unlock] || unlock;
    };

    // ═══════════════════════════════════════════════════════════════════
    // UI渲染
    // ═══════════════════════════════════════════════════════════════════

    /**
     * 渲染境界UI（主状态栏）
     */
    Cultivation.render = function() {
        var container = document.getElementById('cultivation-ui');
        if (!container) {
            this.createUI();
            return;
        }

        this.updateUI();
    };

    /**
     * 创建UI元素
     */
    Cultivation.createUI = function() {
        // 追加到状态栏区域（在状态数字旁边）
        var storeSection = document.querySelector('.stores');
        if (!storeSection) return;

        var ui = document.createElement('div');
        ui.id = 'cultivation-ui';
        ui.className = 'cultivation-ui';
        storeSection.parentNode.insertBefore(ui, storeSection.nextSibling);

        this.updateUI();
    };

    /**
     * 更新UI内容
     */
    Cultivation.updateUI = function() {
        var container = document.getElementById('cultivation-ui');
        if (!container) return;

        var realm = $SM.get(STATE.realm);
        var progress = $SM.get(STATE.progress);
        var realmData = REALMS[realm];

        var html = '<div class="cultivation-header">';
        html += '<span class="realm-name">' + realmData.name + '</span>';
        html += '<span class="realm-level">第' + (realm + 1) + '境</span>';
        html += '</div>';

        if (realm < 6) {
            var percent = Math.min(100, (progress / realmData.maxProgress) * 100);
            html += '<div class="progress-container">';
            html += '<div class="progress-bar">';
            html += '<div class="progress-fill" style="width:' + percent + '%"></div>';
            html += '</div>';
            html += '<div class="progress-text">' + Math.floor(progress) + ' / ' + realmData.maxProgress + '</div>';
            html += '</div>';
        } else {
            html += '<div class="progress-container">';
            html += '<div class="progress-bar max-realm">';
            html += '<div class="progress-fill" style="width:100%"></div>';
            html += '</div>';
            html += '<div class="progress-text">已达人间巅峰</div>';
            html += '</div>';
        }

        // 境界图标
        html += '<div class="realm-icons">';
        for (var i = 0; i <= Math.min(realm, 6); i++) {
            var active = i < realm ? ' passed' : (i === realm ? ' current' : '');
            html += '<div class="realm-icon' + active + '" title="' + REALMS[i].name + '"></div>';
        }
        html += '</div>';

        container.innerHTML = html;
    };

    /**
     * 更新进度条（高频调用优化）
     */
    Cultivation.updateProgressBar = function() {
        var fill = document.querySelector('.progress-fill');
        var text = document.querySelector('.progress-text');
        if (!fill || !text) return;

        var realm = $SM.get(STATE.realm);
        var progress = $SM.get(STATE.progress);
        var realmData = REALMS[realm];

        var percent = Math.min(100, (progress / realmData.maxProgress) * 100);
        fill.style.width = percent + '%';
        text.textContent = Math.floor(progress) + ' / ' + realmData.maxProgress;
    };

    // ═══════════════════════════════════════════════════════════════════
    // 状态监听
    // ═══════════════════════════════════════════════════════════════════
    Cultivation.handleStateUpdate = function(state) {
        // state 格式: {category: string, stateName: string}
        if (state && state.stateName) {
            if (state.stateName.indexOf(STATE.realm) === 0) {
                this.render();
            }
            if (state.stateName.indexOf(STATE.progress) === 0) {
                this.updateUI();
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // 对外API
    // ═══════════════════════════════════════════════════════════════════

    /**
     * 获取当前境界
     */
    Cultivation.getRealm = function() {
        return $SM.get(STATE.realm);
    };

    /**
     * 获取境界数据
     */
    Cultivation.getRealmData = function(realm) {
        return REALMS[realm];
    };

    /**
     * 获取当前修为
     */
    Cultivation.getProgress = function() {
        return $SM.get(STATE.progress);
    };

    /**
     * 检查是否达到指定境界
     */
    Cultivation.hasReachedRealm = function(realm) {
        return $SM.get(STATE.realm) >= realm;
    };

    /**
     * 获取所有境界配置
     */
    Cultivation.getRealms = function() {
        return REALMS;
    };

    /**
     * 保存游戏时调用
     */
    Cultivation.save = function() {
        // 状态已由 $SM 自动保存
    };

    /**
     * 加载游戏时调用
     */
    Cultivation.load = function() {
        this.startCultivationLoop();
        this.render();
    };

})();
