/**
 * 《一介凡尘》炼丹系统 v1.0
 */

(function() {

    var Alchemy = window.Alchemy = {

        recipes: {
            'medicine_small': {
                id: 'medicine_small', name: '小还丹', type: 'potion',
                desc: '修为获取速度翻倍，持续5分钟', icon: '💊', color: '#4CAF50',
                materials: { medicine: 2, coal: 5 }, fuel: 10,
                effect: { buff: 'cultivation_speed', duration: 300 },
                requires: { realm: 'mortal' }, craftingTime: 30, successRate: 0.9
            },
            'spirit_restoration': {
                id: 'spirit_restoration', name: '灵气丹', type: 'potion',
                desc: '修为获取+50%，持续3分钟', icon: '🌟', color: '#00BCD4',
                materials: { medicine: 3, spirit_stone: 1, coal: 8 }, fuel: 15,
                effect: { buff: 'spirit_restoration', duration: 180 },
                requires: { realm: 'foundation' }, craftingTime: 45, successRate: 0.8
            },
            'healing_pill': {
                id: 'healing_pill', name: '疗伤丹', type: 'potion',
                desc: '恢复30点生命', icon: '❤️', color: '#E91E63',
                materials: { medicine: 2, coal: 3 }, fuel: 5,
                effect: { heal: 30 },
                requires: { realm: 'mortal' }, craftingTime: 20, successRate: 0.95
            },
            'breakthrough_elixir': {
                id: 'breakthrough_elixir', name: '破境丹', type: 'elixir',
                desc: '突破成功率+15%', icon: '✨', color: '#FFC107',
                materials: { medicine: 5, sulphur: 10, essence: 2, spirit_stone: 3 }, fuel: 25,
                effect: { buff: 'breakthrough_boost', consumedOnUse: true },
                requires: { realm: 'foundation' }, craftingTime: 120, successRate: 0.6
            },
            'thunder_elixir': {
                id: 'thunder_elixir', name: '天雷丹', type: 'tribulation',
                desc: '渡劫时抵挡一道天雷', icon: '⚡', color: '#9C27B0',
                materials: { medicine: 10, alienAlloy: 5, spirit_stone: 10, essence: 5 }, fuel: 50,
                effect: { buff: 'thunder_shield', stacks: 1 },
                requires: { realm: 'nascent' }, craftingTime: 180, successRate: 0.4
            },
            'shield_charm': {
                id: 'shield_charm', name: '护体符', type: 'tribulation',
                desc: '提升护盾，每秒恢复护盾', icon: '🛡', color: '#2196F3',
                materials: { spirit_stone: 8, essence: 5, cloth: 15 }, fuel: 20,
                effect: { buff: 'body_shield', duration: 600 },
                requires: { realm: 'core' }, craftingTime: 60, successRate: 0.7
            },
            'longevity_pill': {
                id: 'longevity_pill', name: '延寿丹', type: 'special',
                desc: '减少人口流失', icon: '🏮', color: '#795548',
                materials: { medicine: 8, coal: 20, spirit_stone: 5, essence: 3 }, fuel: 35,
                effect: { deathRateModifier: -0.1 },
                requires: { realm: 'foundation' }, craftingTime: 120, successRate: 0.4
            }
        },

        furnace: { hasFurnace: false, fuel: 0, maxFuel: 100, temperature: 0, crafting: null, craftingProgress: 0, craftingTimer: null },
        knownRecipes: [],
        inventory: [],

        init: function() {
            this.restoreFromSave();
            if (this.knownRecipes.length === 0) this.knownRecipes = ['medicine_small', 'healing_pill'];
            $.Dispatch('stateUpdate').subscribe(this.handleStateUpdate.bind(this));
        },

        hasFurnace: function() { return this.furnace.hasFurnace || $SM.get('features.alchemy.furnace', true); },

        buildFurnace: function() {
            if (this.hasFurnace()) return { success: false, reason: 'already_has_furnace' };
            var cost = { iron: 50, coal: 30 };
            for (var mat in cost) { if (($SM.get('stores.' + mat, true) || 0) < cost[mat]) return { success: false, reason: 'insufficient_materials', missing: mat }; }
            for (var mat in cost) { $SM.add('stores.' + mat, -cost[mat]); }
            this.furnace.hasFurnace = true;
            this.saveToStorage();
            Events.emitNarrative('丹炉落成。');
            return { success: true };
        },

        addFuel: function(amount) {
            if (!this.hasFurnace()) return { success: false, reason: 'no_furnace' };
            var coal = Math.min(amount || 10, $SM.get('stores.coal', true) || 0);
            if (coal <= 0) return { success: false, reason: 'no_coal' };
            $SM.add('stores.coal', -coal);
            this.furnace.fuel = Math.min(this.furnace.maxFuel, this.furnace.fuel + coal);
            this.updateTemperature();
            this.saveToStorage();
            return { success: true, fuelAdded: coal };
        },

        updateTemperature: function() {
            if (this.furnace.fuel <= 0) this.furnace.temperature = 0;
            else if (this.furnace.fuel < 30) this.furnace.temperature = 1;
            else if (this.furnace.fuel < 60) this.furnace.temperature = 2;
            else this.furnace.temperature = 3;
        },

        learnRecipe: function(recipeId) {
            if (this.knownRecipes.indexOf(recipeId) >= 0) return { success: false, reason: 'already_known' };
            var recipe = this.recipes[recipeId];
            if (!recipe) return { success: false, reason: 'invalid_recipe' };
            this.knownRecipes.push(recipeId);
            this.saveToStorage();
            Events.emitNarrative('习得丹方：「' + recipe.name + '」。');
            return { success: true };
        },

        startCrafting: function(recipeId) {
            var recipe = this.recipes[recipeId];
            if (!recipe) return { success: false, reason: 'invalid_recipe' };
            if (this.knownRecipes.indexOf(recipeId) < 0) return { success: false, reason: 'not_learned' };
            if (!this.hasFurnace()) return { success: false, reason: 'no_furnace' };
            if (this.furnace.temperature === 0) return { success: false, reason: 'furnace_cold' };
            if (this.furnace.fuel < recipe.fuel) return { success: false, reason: 'insufficient_fuel' };
            for (var mat in recipe.materials) { if (($SM.get('stores.' + mat, true) || 0) < recipe.materials[mat]) return { success: false, reason: 'insufficient_materials', missing: mat }; }

            this.furnace.fuel -= recipe.fuel;
            this.updateTemperature();
            for (var mat in recipe.materials) { $SM.add('stores.' + mat, -recipe.materials[mat]); }

            this.furnace.crafting = recipeId;
            this.furnace.craftingProgress = 0;
            this.startTimer(recipe);
            this.saveToStorage();
            return { success: true };
        },

        startTimer: function(recipe) {
            var self = this;
            var totalTime = recipe.craftingTime * 1000;
            var tick = 100, elapsed = 0;
            if (this.furnace.craftingTimer) clearInterval(this.furnace.craftingTimer);
            this.furnace.craftingTimer = setInterval(function() {
                elapsed += tick;
                self.furnace.craftingProgress = (elapsed / totalTime) * 100;
                if (elapsed >= totalTime) {
                    clearInterval(self.furnace.craftingTimer);
                    self.completeCrafting(recipe);
                }
            }, tick);
        },

        completeCrafting: function(recipe) {
            var success = Math.random() < recipe.successRate;
            this.furnace.crafting = null;
            this.furnace.craftingProgress = 0;

            if (success) {
                var pill = { id: recipe.id + '_' + Date.now(), recipeId: recipe.id, name: recipe.name, icon: recipe.icon, color: recipe.color, type: recipe.type, desc: recipe.desc, effect: recipe.effect };
                this.inventory.push(pill);
                Events.emitNarrative('炼制成功！获得「' + recipe.name + '」。');
                if (Buff) Buff.render();
            } else {
                Events.emitNarrative('炼制失败...药材化为灰烬。');
            }
            this.saveToStorage();
        },

        cancelCrafting: function() {
            if (this.furnace.craftingTimer) clearInterval(this.furnace.craftingTimer);
            this.furnace.crafting = null;
            this.furnace.craftingProgress = 0;
            this.saveToStorage();
        },

        usePill: function(index) {
            var pill = this.inventory[index];
            if (!pill) return { success: false };
            var recipe = this.recipes[pill.recipeId];
            if (!recipe) return { success: false };

            if (recipe.effect.buff && Buff) {
                Buff.add(recipe.effect.buff);
                this.inventory.splice(index, 1);
                Events.emitNarrative('服用了「' + pill.name + '」。');
            } else if (recipe.effect.heal) {
                var hp = $SM.get('character.health', true) || 100;
                $SM.set('character.health', Math.min(200, hp + recipe.effect.heal));
                this.inventory.splice(index, 1);
                Events.emitNarrative('恢复了' + recipe.effect.heal + '点生命。');
            } else if (recipe.effect.deathRateModifier) {
                $SM.add('game.deathRate_modifier', recipe.effect.deathRateModifier);
                this.inventory.splice(index, 1);
                Events.emitNarrative('服用了「' + pill.name + '」。');
            }
            this.saveToStorage();
            if (Buff) Buff.render();
            return { success: true };
        },

        isCrafting: function() { return this.furnace.crafting !== null; },
        getCurrentRecipe: function() { return this.isCrafting() ? this.recipes[this.furnace.crafting] : null; },

        canCraft: function(recipeId) {
            var recipe = this.recipes[recipeId];
            if (!recipe) return { canCraft: false, reason: 'invalid_recipe' };
            if (this.knownRecipes.indexOf(recipeId) < 0) return { canCraft: false, reason: 'not_learned' };
            if (!this.hasFurnace()) return { canCraft: false, reason: 'no_furnace' };
            if (this.furnace.temperature === 0) return { canCraft: false, reason: 'furnace_cold' };
            if (this.furnace.fuel < recipe.fuel) return { canCraft: false, reason: 'insufficient_fuel' };
            for (var mat in recipe.materials) { if (($SM.get('stores.' + mat, true) || 0) < recipe.materials[mat]) return { canCraft: false, reason: 'insufficient_materials' }; }
            return { canCraft: true };
        },

        saveToStorage: function() {
            $SM.set('alchemy.furnace', JSON.stringify(this.furnace));
            $SM.set('alchemy.knownRecipes', JSON.stringify(this.knownRecipes));
            $SM.set('alchemy.inventory', JSON.stringify(this.inventory));
        },

        restoreFromSave: function() {
            var f = $SM.get('alchemy.furnace', true); if (f) { try { this.furnace = JSON.parse(f); } catch(e) {} }
            var k = $SM.get('alchemy.knownRecipes', true); if (k) { try { this.knownRecipes = JSON.parse(k); } catch(e) {} }
            var i = $SM.get('alchemy.inventory', true); if (i) { try { this.inventory = JSON.parse(i); } catch(e) {} }
        },

        handleStateUpdate: function() { this.render(); },
        render: function() { var c = document.getElementById('alchemy-panel'); if (c) { c.innerHTML = this.generateHTML(); this.bindEvents(); } },
        generateHTML: function() { return '<div>炼丹面板</div>'; },
        bindEvents: function() {}
    };

})();
