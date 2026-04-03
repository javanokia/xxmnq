/**
 * 《一介凡尘》法宝系统
 * 版本：v1.0
 * 功能：替代原ADR武器系统的修仙法宝系统
 */

(function() {

    var Artifact = window.Artifact = {

        // ═══════════════════════════════════════════════════════════
        // 法宝品质定义
        // ═══════════════════════════════════════════════════════════

        grades: {
            'mortal': {
                name: '凡品',
                color: '#9E9E9E',
                damageBonus: 1.0,
                defenseBonus: 1.0,
                prefix: ''
            },
            'fine': {
                name: '良品',
                color: '#4CAF50',
                damageBonus: 1.3,
                defenseBonus: 1.3,
                prefix: '精'
            },
            'spirit': {
                name: '灵器',
                color: '#2196F3',
                damageBonus: 1.6,
                defenseBonus: 1.6,
                prefix: '灵'
            },
            'divine': {
                name: '灵宝',
                color: '#FF9800',
                damageBonus: 2.0,
                defenseBonus: 2.0,
                prefix: '宝'
            },
            'heavenly': {
                name: '天宝',
                color: '#9C27B0',
                damageBonus: 2.5,
                defenseBonus: 2.5,
                prefix: '天'
            }
        },

        // ═══════════════════════════════════════════════════════════
        // 法宝模板定义
        // ═══════════════════════════════════════════════════════════

        templates: {

            // ═══════════════════════════════════════════════════════
            // 攻击型法宝
            // ═══════════════════════════════════════════════════════

            'bone_spear': {
                id: 'bone_spear',
                name: '骨矛',
                type: 'weapon',
                grade: 'mortal',
                baseDamage: 10,
                icon: '🔱',
                desc: '以妖兽骨骼制成的原始武器。',
                materials: { teeth: 5 },
                unlock: { realm: 'mortal' }
            },

            'iron_sword': {
                id: 'iron_sword',
                name: '铁剑',
                type: 'weapon',
                grade: 'fine',
                baseDamage: 18,
                icon: '⚔️',
                desc: '凡铁锻造的基础飞剑。',
                materials: { iron: 15 },
                upgradeFrom: 'bone_spear'
            },

            'flying_sword': {
                id: 'flying_sword',
                name: '飞剑',
                type: 'weapon',
                grade: 'spirit',
                baseDamage: 35,
                icon: '🗡️',
                desc: '可御空飞行的灵器级法宝。',
                materials: { iron: 30, coal: 10 },
                upgradeFrom: 'iron_sword',
                unlock: { realm: 'foundation' }
            },

            'ice_blade': {
                id: 'ice_blade',
                name: '玄冰剑',
                type: 'weapon',
                grade: 'divine',
                baseDamage: 60,
                icon: '❄️',
                desc: '以玄冰精英锻造，寒气逼人。',
                materials: { iron: 50, coal: 30, spirit_stone: 5 },
                upgradeFrom: 'flying_sword',
                unlock: { realm: 'core' },
                special: 'ice_slow'
            },

            'thunder_blade': {
                id: 'thunder_blade',
                name: '天雷剑',
                type: 'weapon',
                grade: 'heavenly',
                baseDamage: 100,
                icon: '⚡',
                desc: '蕴含天雷之力的至宝，可引动天雷。',
                materials: { alienAlloy: 20, spirit_stone: 15, thunder_essence: 5 },
                upgradeFrom: 'ice_blade',
                unlock: { realm: 'nascent' },
                special: 'thunder_chain'
            },

            // ═══════════════════════════════════════════════════════
            // 防御型法宝
            // ═══════════════════════════════════════════════════════

            'leather_armor': {
                id: 'leather_armor',
                name: '皮甲',
                type: 'armor',
                grade: 'mortal',
                baseDefense: 5,
                icon: '🥋',
                desc: '兽皮缝制的简易护具。',
                materials: { leather: 8 },
                unlock: { realm: 'mortal' }
            },

            'iron_armor': {
                id: 'iron_armor',
                name: '铁甲',
                type: 'armor',
                grade: 'fine',
                baseDefense: 12,
                icon: '🛡️',
                desc: '凡铁打造的基础护甲。',
                materials: { iron: 20, leather: 5 },
                upgradeFrom: 'leather_armor'
            },

            'golden_shield': {
                id: 'golden_shield',
                name: '金光盾',
                type: 'armor',
                grade: 'spirit',
                baseDefense: 25,
                icon: '🔰',
                desc: '激发后可形成金色护罩。',
                materials: { iron: 40, scales: 10, spirit_stone: 3 },
                upgradeFrom: 'iron_armor',
                unlock: { realm: 'foundation' }
            },

            'iron_heaven_armor': {
                id: 'iron_heaven_armor',
                name: '玄铁甲',
                type: 'armor',
                grade: 'divine',
                baseDefense: 45,
                icon: '🏰',
                desc: '以玄铁精英打造，坚不可摧。',
                materials: { iron: 80, scales: 20, spirit_stone: 8 },
                upgradeFrom: 'golden_shield',
                unlock: { realm: 'core' },
                special: 'shield_recovery'
            },

            'foundation_charm': {
                id: 'foundation_charm',
                name: '道基护符',
                type: 'armor',
                grade: 'heavenly',
                baseDefense: 80,
                icon: '☯️',
                desc: '守护道基的根本灵宝。',
                materials: { alienAlloy: 30, spirit_stone: 20, essence: 10 },
                upgradeFrom: 'iron_heaven_armor',
                unlock: { realm: 'nascent' },
                special: 'foundation_protect',
                special2: 'max_shield_boost'
            },

            // ═══════════════════════════════════════════════════════
            // 辅助型法宝
            // ═══════════════════════════════════════════════════════

            'sack': {
                id: 'sack',
                name: '储物袋',
                type: 'tool',
                grade: 'mortal',
                effect: 'carry_capacity',
                bonus: 1.5,
                icon: '🎒',
                desc: '可收纳物品的法器基础款。',
                materials: { cloth: 10 },
                unlock: { realm: 'mortal' }
            },

            'storage_bag': {
                id: 'storage_bag',
                name: '储物戒',
                type: 'tool',
                grade: 'spirit',
                effect: 'carry_capacity',
                bonus: 3.0,
                icon: '💍',
                desc: '内含空间的灵器级储物法宝。',
                materials: { cloth: 20, spirit_stone: 5 },
                upgradeFrom: 'sack',
                unlock: { realm: 'foundation' }
            },

            'wind_boots': {
                id: 'wind_boots',
                name: '缩地符',
                type: 'tool',
                grade: 'fine',
                effect: 'dodge_bonus',
                bonus: 0.1,
                icon: '👟',
                desc: '可短暂缩地移动的符箓靴。',
                materials: { cloth: 15, spirit_stone: 2 },
                unlock: { realm: 'mortal' }
            },

            'heaven_eye': {
                id: 'heaven_eye',
                name: '天眼符',
                type: 'tool',
                grade: 'spirit',
                effect: 'heaven_eye',
                bonus: 0.15,
                icon: '👁️',
                desc: '开启后可洞察秋毫之末。',
                materials: { cloth: 25, spirit_stone: 8, essence: 3 },
                upgradeFrom: 'wind_boots',
                unlock: { realm: 'foundation' },
                special: 'reveal_hidden'
            },

            'escape_scroll': {
                id: 'escape_scroll',
                name: '遁空符',
                type: 'tool',
                grade: 'divine',
                effect: 'escape',
                bonus: 1.0,
                icon: '📜',
                desc: '危急时刻可瞬移逃生的珍贵符箓。',
                materials: { spirit_stone: 15, essence: 5, cloth: 30 },
                unlock: { realm: 'core' },
                special: 'instant_escape'
            },

            'spirit_beast_bag': {
                id: 'spirit_beast_bag',
                name: '灵兽袋',
                type: 'tool',
                grade: 'spirit',
                effect: 'companion',
                icon: '🐾',
                desc: '可豢养灵兽的袋型法宝。',
                materials: { cloth: 30, spirit_stone: 10, meat: 20 },
                unlock: { realm: 'foundation' },
                special: 'companion_attack'
            }
        },

        // ═══════════════════════════════════════════════════════════
        // 当前装备
        // ═══════════════════════════════════════════════════════════

        equipped: {
            weapon: null,
            armor: null,
            tool: null
        },

        // 背包中的法宝
        inventory: [],

        // ═══════════════════════════════════════════════════════════
        // 初始化
        // ═══════════════════════════════════════════════════════════

        init: function() {
            this.restoreFromSave();
            $.Dispatch('stateUpdate').subscribe(this.handleStateUpdate.bind(this));
        },

        // ═══════════════════════════════════════════════════════════
        // 核心方法
        // ═══════════════════════════════════════════════════════════

        /**
         * 制作法宝
         */
        craft: function(templateId) {
            var template = this.templates[templateId];
            if (!template) return { success: false, reason: 'invalid_template' };

            if (template.unlock && !this.checkUnlock(template.unlock)) {
                var realm = this.getRealmName(template.unlock.realm);
                return { success: false, reason: 'realm_required', require: realm };
            }

            for (var mat in template.materials) {
                var have = $SM.get('stores.' + mat, true) || 0;
                var need = template.materials[mat];
                if (have < need) {
                    return { success: false, reason: 'insufficient_materials', missing: mat, need: need, have: have };
                }
            }

            for (var mat in template.materials) {
                $SM.add('stores.' + mat, -template.materials[mat]);
            }

            var artifact = this.createArtifact(template);
            this.inventory.push(artifact);
            this.saveToStorage();
            Events.emitNarrative('炼制成功：「' + artifact.displayName + '」。');

            return { success: true, artifact: artifact };
        },

        createArtifact: function(template) {
            var grade = this.grades[template.grade];
            var displayName = grade.prefix + template.name;

            return {
                id: template.id + '_' + Date.now(),
                templateId: template.id,
                name: template.name,
                displayName: displayName,
                type: template.type,
                grade: template.grade,
                gradeName: grade.name,
                baseDamage: template.baseDamage || 0,
                baseDefense: template.baseDefense || 0,
                damage: Math.floor(template.baseDamage * grade.damageBonus),
                defense: Math.floor((template.baseDefense || 0) * grade.defenseBonus),
                effect: template.effect,
                bonus: template.bonus,
                icon: template.icon,
                special: template.special,
                special2: template.special2,
                upgradeFrom: template.upgradeFrom,
                durability: 100,
                maxDurability: 100
            };
        },

        equip: function(artifactId) {
            var artifact = this.getArtifactById(artifactId);
            if (!artifact) return false;

            this.equipped[artifact.type] = artifact;
            this.saveToStorage();
            Events.emitNarrative('装备了「' + artifact.displayName + '」。');
            return true;
        },

        unequip: function(slot) {
            var artifact = this.equipped[slot];
            if (artifact) {
                this.equipped[slot] = null;
                this.saveToStorage();
                Events.emitNarrative('卸下了「' + artifact.displayName + '」。');
            }
        },

        repair: function(artifactId) {
            var artifact = this.getArtifactById(artifactId);
            if (!artifact) return false;

            var cost = Math.ceil((artifact.maxDurability - artifact.durability) * 0.5);
            if ($SM.get('stores.spirit_stone', true) < cost) {
                return { success: false, reason: 'insufficient_stone', need: cost };
            }

            $SM.add('stores.spirit_stone', -cost);
            artifact.durability = artifact.maxDurability;
            this.saveToStorage();

            return { success: true };
        },

        // ═══════════════════════════════════════════════════════════
        // 属性计算
        // ═══════════════════════════════════════════════════════════

        getTotalDamage: function() {
            var weapon = this.equipped.weapon;
            return weapon ? weapon.damage : 0;
        },

        getTotalDefense: function() {
            var armor = this.equipped.armor;
            return armor ? armor.defense : 0;
        },

        getDodgeBonus: function() {
            var tool = this.equipped.tool;
            return (tool && tool.effect === 'dodge_bonus') ? tool.bonus : 0;
        },

        getCarryCapacity: function() {
            var tool = this.equipped.tool;
            return (tool && tool.effect === 'carry_capacity') ? tool.bonus : 1.0;
        },

        // ═══════════════════════════════════════════════════════════
        // 辅助方法
        // ═══════════════════════════════════════════════════════════

        getArtifactById: function(artifactId) {
            for (var i = 0; i < this.inventory.length; i++) {
                if (this.inventory[i].id === artifactId) return this.inventory[i];
            }
            for (var slot in this.equipped) {
                if (this.equipped[slot] && this.equipped[slot].id === artifactId) {
                    return this.equipped[slot];
                }
            }
            return null;
        },

        removeFromInventory: function(artifactId) {
            for (var i = 0; i < this.inventory.length; i++) {
                if (this.inventory[i].id === artifactId) {
                    this.inventory.splice(i, 1);
                    return true;
                }
            }
            return false;
        },

        checkUnlock: function(unlock) {
            if (!unlock || !unlock.realm) return true;
            var currentRealm = $SM.get('game.cultivationRealm', true) || 'mortal';
            var realmOrder = ['mortal', 'qi_gathering', 'foundation', 'core', 'nascent', 'tribulation', 'ascended'];
            return realmOrder.indexOf(currentRealm) >= realmOrder.indexOf(unlock.realm);
        },

        getRealmName: function(realmId) {
            var names = {
                'mortal': '凡境', 'qi_gathering': '聚气境', 'foundation': '筑基境',
                'core': '结丹境', 'nascent': '元婴境', 'tribulation': '渡劫境'
            };
            return names[realmId] || realmId;
        },

        getCraftableItems: function() {
            var items = [];
            for (var id in this.templates) {
                var template = this.templates[id];
                var canCraft = true;
                var reason = null;

                if (template.unlock && !this.checkUnlock(template.unlock)) {
                    canCraft = false;
                    reason = 'realm';
                }

                if (canCraft) {
                    for (var mat in template.materials) {
                        if (($SM.get('stores.' + mat, true) || 0) < template.materials[mat]) {
                            canCraft = false;
                            reason = 'materials';
                            break;
                        }
                    }
                }

                items.push({ id: id, template: template, canCraft: canCraft, reason: reason });
            }
            return items;
        },

        // ═══════════════════════════════════════════════════════════
        // 存档管理
        // ═══════════════════════════════════════════════════════════

        saveToStorage: function() {
            $SM.set('artifacts.equipped', JSON.stringify(this.equipped));
            $SM.set('artifacts.inventory', JSON.stringify(this.inventory));
        },

        restoreFromSave: function() {
            var equipped = $SM.get('artifacts.equipped', true);
            var inventory = $SM.get('artifacts.inventory', true);
            if (equipped) { try { this.equipped = JSON.parse(equipped); } catch (e) { this.equipped = {}; } }
            if (inventory) { try { this.inventory = JSON.parse(inventory); } catch (e) { this.inventory = []; } }
        },

        handleStateUpdate: function(state) {
            if (state && state.stateName && state.stateName.indexOf('game.cultivationRealm') === 0) {
                this.render();
            }
        },

        render: function() {
            var container = document.getElementById('artifact-bar');
            if (container) {
                container.innerHTML = '';
                for (var slot in this.equipped) {
                    if (this.equipped[slot]) {
                        container.appendChild(this.createArtifactElement(this.equipped[slot], slot));
                    }
                }
            }
        },

        createArtifactElement: function(artifact, slot) {
            var item = document.createElement('div');
            item.className = 'artifact-slot artifact-' + slot;
            item.dataset.slot = slot;
            var grade = this.grades[artifact.grade];
            item.style.borderColor = grade.color;
            item.innerHTML = '<span class="artifact-icon">' + artifact.icon + '</span>';
            if (artifact.durability < artifact.maxDurability) {
                item.innerHTML += '<span class="artifact-durability">' + Math.floor(artifact.durability / artifact.maxDurability * 100) + '%</span>';
            }
            item.title = artifact.displayName + '\n' + artifact.desc;
            if (artifact.durability <= 0) item.classList.add('broken');
            return item;
        }
    };

})();
