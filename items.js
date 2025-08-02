// items.js

const ItemsSystem = (() => {
    const itemsDatabase = [
        {
            id: 1,
            name: "Minor Luck Potion",
            icon: "\ud83e\uddea",
            description: "Increases chance of getting gold/rainbow cards by 25% for the next 5 packs",
            rarity: "common",
            type: "luck_boost",
            effect: { multiplier: 1.25, duration: 5 },
            cost: 100
        },
        {
            id: 2,
            name: "Major Luck Potion",
            icon: "\u2697\ufe0f",
            description: "Increases chance of getting gold/rainbow cards by 50% for the next 10 packs",
            rarity: "rare",
            type: "luck_boost",
            effect: { multiplier: 1.5, duration: 10 },
            cost: 500
        },
        {
            id: 3,
            name: "Supreme Luck Elixir",
            icon: "\ud83d\udd2e",
            description: "Increases chance of getting gold/rainbow cards by 100% for the next 20 packs",
            rarity: "legendary",
            type: "luck_boost",
            effect: { multiplier: 2.0, duration: 20 },
            cost: 2000
        },
        {
            id: 4,
            name: "Golden Dust",
            icon: "\u2728",
            description: "Guarantees the next card will be at least Gold rarity",
            rarity: "uncommon",
            type: "rarity_guarantee",
            effect: { guaranteed_rarity: "gold", uses: 1 },
            cost: 300
        },
        {
            id: 5,
            name: "Rainbow Crystal",
            icon: "\ud83d\udc8e",
            description: "Guarantees the next card will be Rainbow rarity",
            rarity: "epic",
            type: "rarity_guarantee",
            effect: { guaranteed_rarity: "rainbow", uses: 1 },
            cost: 1500
        },
        {
            id: 6,
            name: "Rarity Amplifier",
            icon: "\ud83c\udf1f",
            description: "Forces all cards from the next 3 packs to roll rarity upgrades",
            rarity: "rare",
            type: "rarity_boost",
            effect: { force_upgrade: true, duration: 3 },
            cost: 800
        },
        {
            id: 7,
            name: "Pack Bundle",
            icon: "\ud83d\udce6",
            description: "Instantly opens 5 packs and shows all results",
            rarity: "common",
            type: "bulk_open",
            effect: { pack_count: 5 },
            cost: 200
        },
        {
            id: 8,
            name: "Mega Pack Bundle",
            icon: "\ud83d\udce6\ud83d\udce6",
            description: "Instantly opens 15 packs and shows all results",
            rarity: "uncommon",
            type: "bulk_open",
            effect: { pack_count: 15 },
            cost: 750
        },
        {
            id: 9,
            name: "Ultimate Pack Crate",
            icon: "\ud83c\udf81",
            description: "Instantly opens 50 packs and shows all results with summary stats",
            rarity: "epic",
            type: "bulk_open",
            effect: { pack_count: 50 },
            cost: 3000
        },
        {
            id: 10,
            name: "Card Reroll Token",
            icon: "\ud83d\udd04",
            description: "Reroll the last opened card for a chance at a different result",
            rarity: "rare",
            type: "reroll",
            effect: { uses: 1 },
            cost: 600
        },
        {
            id: 11,
            name: "Set Booster",
            icon: "\ud83c\udfaf",
            description: "Next 10 packs will only contain cards from your selected set",
            rarity: "uncommon",
            type: "set_focus",
            effect: { duration: 10 },
            cost: 400
        },
        {
            id: 12,
            name: "Rare Card Magnet",
            icon: "\ud83e\uddf2",
            description: "Increases chance of getting rare cards (1 in 50+ rarity) by 300% for 5 packs",
            rarity: "rare",
            type: "card_luck_boost",
            effect: { multiplier: 3.0, duration: 5, rarityThreshold: 50 },
            cost: 800
        },
        {
            id: 13,
            name: "Legendary Card Seeker",
            icon: "\ud83d\udd0d",
            description: "Increases chance of getting legendary cards (1 in 1000+ rarity) by 500% for 3 packs",
            rarity: "epic",
            type: "card_luck_boost",
            effect: { multiplier: 5.0, duration: 3, rarityThreshold: 1000 },
            cost: 1500
        },
        {
            id: 14,
            name: "Mythic Card Beacon",
            icon: "\u2b50",
            description: "Increases chance of getting mythic cards (1 in 10000+ rarity) by 1000% for 2 packs",
            rarity: "legendary",
            type: "card_luck_boost",
            effect: { multiplier: 10.0, duration: 2, rarityThreshold: 10000 },
            cost: 3000
        },
        {
            id: 15,
            name: "Ultimate Card Catalyst",
            icon: "\ud83d\udee0",
            description: "Massively increases chance of getting the rarest cards (1 in 50000+) by 2000% for 1 pack",
            rarity: "legendary",
            type: "card_luck_boost",
            effect: { multiplier: 20.0, duration: 1, rarityThreshold: 50000 },
            cost: 5000
        },
        {
            id: 16,
            name: "Guaranteed Legend Token",
            icon: "\ud83c\udfab",
            description: "Next pack is guaranteed to contain a legendary card (1 in 1000+ rarity)",
            rarity: "epic",
            type: "card_guarantee",
            effect: { uses: 1, rarityThreshold: 1000 },
            cost: 2500
        },
        {
            id: 17,
            name: "Mythic Guarantee Scroll",
            icon: "\ud83d\udcdc",
            description: "Next pack is guaranteed to contain a mythic card (1 in 10000+ rarity)",
            rarity: "legendary",
            type: "card_guarantee",
            effect: { uses: 1, rarityThreshold: 10000 },
            cost: 6000
        }
    ];

    let playerItems = {};
    let activeEffects = {
        luck_boost: [],
        rarity_guarantee: [],
        rarity_boost: [],
        set_focus: [],
        card_luck_boost: [],
        card_guarantee: []
    };

    const init = () => {
        loadPlayerItems();
        renderItems();

        if (Object.keys(playerItems).length === 0) {
            addItem(1, 3);
            addItem(7, 2);
            savePlayerItems();
        }
    };

    const addItem = (itemId, quantity = 1) => {
        if (playerItems[itemId]) {
            playerItems[itemId] += quantity;
        } else {
            playerItems[itemId] = quantity;
        }
        savePlayerItems();
        renderItems();
    };

    // Add level rewards pool and drop chance
    const addLevelRewards = (level) => {
        const rewardsPool = [
            { id: 1, weight: 50 },
            { id: 2, weight: 40 },
            { id: 3, weight: 30 },
            { id: 4, weight: 20 },
            { id: 5, weight: 10 }
        ];

        // Increase weight for better items based on level
        const adjustedPool = rewardsPool.map(item => {
            let weight = item.weight;
            if (level >= 10 && item.id >= 4) weight *= 2;
            if (level >= 20 && item.id === 5) weight *= 3;
            return { id: item.id, weight };
        });

        let totalWeight = adjustedPool.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (const item of adjustedPool) {
            random -= item.weight;
            if (random <= 0) {
                addItem(item.id, 1);
                showNotification(`Level ${level} reward: You received ${itemsDatabase.find(i => i.id === item.id).name}!`);
                break;
            }
        }
    };

    const useItem = (itemId, quantity = 1) => {
        const item = itemsDatabase.find(i => i.id === itemId);
        if (!item || !playerItems[itemId] || playerItems[itemId] < quantity) {
            return false;
        }

        // For effects that should stack durations, check if effect already exists and add duration instead of pushing new
        const addOrExtendEffect = (effectArray, newEffect) => {
            const existing = effectArray.find(e => {
                if (e.multiplier && newEffect.multiplier) return e.multiplier === newEffect.multiplier;
                if (e.rarity === newEffect.rarity) return true;
                if (e.force_upgrade === newEffect.force_upgrade) return true;
                if (e.rarityThreshold && newEffect.rarityThreshold) return e.rarityThreshold === newEffect.rarityThreshold;
                return false;
            });
            if (existing) {
                existing.remaining += newEffect.remaining;
            } else {
                effectArray.push(newEffect);
            }
        };

        for (let i = 0; i < quantity; i++) {
            switch (item.type) {
                case 'luck_boost':
                    if(!activeEffects.luck_boost) activeEffects.luck_boost = [];
                    addOrExtendEffect(activeEffects.luck_boost, {
                        id: Date.now() + i,
                        multiplier: item.effect.multiplier,
                        remaining: item.effect.duration
                    });
                    break;

                case 'rarity_guarantee':
                    if(!activeEffects.rarity_guarantee) activeEffects.rarity_guarantee = [];
                    addOrExtendEffect(activeEffects.rarity_guarantee, {
                        id: Date.now() + i,
                        rarity: item.effect.guaranteed_rarity,
                        remaining: item.effect.uses
                    });
                    break;

                case 'rarity_boost':
                    if(!activeEffects.rarity_boost) activeEffects.rarity_boost = [];
                    addOrExtendEffect(activeEffects.rarity_boost, {
                        id: Date.now() + i,
                        force_upgrade: item.effect.force_upgrade,
                        remaining: item.effect.duration
                    });
                    break;

                case 'bulk_open':
                    if(i === 0) openBulkPacks(item.effect.pack_count);
                    break;

                case 'set_focus':
                    if(i === 0) showSeriesSelection(item);
                    return false;

                case 'card_luck_boost':
                    if(!activeEffects.card_luck_boost) activeEffects.card_luck_boost = [];
                    addOrExtendEffect(activeEffects.card_luck_boost, {
                        id: Date.now() + i,
                        multiplier: item.effect.multiplier,
                        remaining: item.effect.duration,
                        rarityThreshold: item.effect.rarityThreshold
                    });
                    break;

                case 'card_guarantee':
                    if(!activeEffects.card_guarantee) activeEffects.card_guarantee = [];
                    addOrExtendEffect(activeEffects.card_guarantee, {
                        id: Date.now() + i,
                        rarityThreshold: item.effect.rarityThreshold,
                        remaining: item.effect.uses
                    });
                    break;

                case 'reroll':
                    showNotification(`${item.name} used! Last card rerolled.`);
                    break;
            }
        }

        playerItems[itemId] -= quantity;
        if (playerItems[itemId] <= 0) delete playerItems[itemId];

        savePlayerItems();
        renderItems();
        return true;
    };

    const decreaseEffectDurations = () => {
        const updateEffects = (effectsArray, name) => {
            for (let i = effectsArray.length - 1; i >=0; i--) {
                effectsArray[i].remaining--;
                if (effectsArray[i].remaining <= 0) {
                    effectsArray.splice(i, 1);
                    showNotification(`${name} effect has worn off.`);
                }
            }
        };

        updateEffects(activeEffects.luck_boost, 'Luck Boost');
        updateEffects(activeEffects.rarity_guarantee, 'Rarity Guarantee');
        updateEffects(activeEffects.rarity_boost, 'Rarity Boost');
        updateEffects(activeEffects.set_focus, 'Set Focus');
        updateEffects(activeEffects.card_luck_boost, 'Rare Card Luck Boost');
        updateEffects(activeEffects.card_guarantee, 'Rare Card Guarantee');

        if (Math.random() < 0.1) {
            const itemRarities = {
                1: 100,2: 100,4: 100,7: 100,
                8: 50,11: 50,12: 50,
                3: 20,6: 20,10: 20,13: 20,
                5: 5,9: 5,16: 5,
                14: 1,15: 1,17: 1
            };
            let totalWeight = 0;
            Object.values(itemRarities).forEach(w => totalWeight += w);
            let random = Math.random() * totalWeight;
            let cumulative = 0;
            let selected = 1;
            for (const [id, w] of Object.entries(itemRarities)) {
                cumulative += w;
                if (random <= cumulative) {
                    selected = parseInt(id);
                    break;
                }
            }
            addItem(selected,1);
            const item = itemsDatabase.find(i => i.id === selected);
            showNotification(`Found ${getRarityText(selected)} ${item.name}!`);
        }

        savePlayerItems();
    };

    const getLuckMultiplier = () => {
        if(!activeEffects.luck_boost || activeEffects.luck_boost.length === 0) return 1;
        return activeEffects.luck_boost.reduce((max,e) => Math.max(max, e.multiplier), 1);
    };

    const getActiveEffects = () => {
        return {
            luck_boost: activeEffects.luck_boost && activeEffects.luck_boost.length > 0 ? {
                multiplier: getLuckMultiplier(),
                remaining: activeEffects.luck_boost.reduce((sum, e) => sum + e.remaining, 0)
            } : null,
            rarity_guarantee: activeEffects.rarity_guarantee && activeEffects.rarity_guarantee.length > 0 ? {
                rarity: activeEffects.rarity_guarantee[0].rarity,
                remaining: activeEffects.rarity_guarantee.reduce((sum, e) => sum + e.remaining, 0)
            } : null,
            rarity_boost: activeEffects.rarity_boost && activeEffects.rarity_boost.length > 0 ? {
                force_upgrade: activeEffects.rarity_boost[0].force_upgrade,
                remaining: activeEffects.rarity_boost.reduce((sum, e) => sum + e.remaining, 0)
            } : null,
            set_focus: activeEffects.set_focus && activeEffects.set_focus.length > 0 ? {
                series: activeEffects.set_focus[0].series,
                remaining: activeEffects.set_focus.reduce((sum, e) => sum + e.remaining, 0)
            } : null,
            card_luck_boost: activeEffects.card_luck_boost && activeEffects.card_luck_boost.length > 0 ? {
                multiplier: Math.max(...activeEffects.card_luck_boost.map(e => e.multiplier)),
                remaining: activeEffects.card_luck_boost.reduce((sum, e) => sum + e.remaining, 0),
                rarityThreshold: Math.min(...activeEffects.card_luck_boost.map(e => e.rarityThreshold))
            } : null,
            card_guarantee: activeEffects.card_guarantee && activeEffects.card_guarantee.length > 0 ? {
                rarityThreshold: Math.min(...activeEffects.card_guarantee.map(e => e.rarityThreshold)),
                remaining: activeEffects.card_guarantee.reduce((sum, e) => sum + e.remaining, 0)
            } : null
        }
    };

    const openBulkPacks = async (count) => {
        const results = [];
        for (let i=0; i<count; i++) {
            const result = await CardPacks.openPack();
            if (result.card) results.push(result.card);
        }
        showBulkResults(results);
    };

    const showBulkResults = (cards) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            overflow-y: auto;
            padding: 20px;
        `;

        const title = document.createElement('h2');
        title.textContent = `Bulk Pack Results - ${cards.length} Cards Opened!`;
        title.style.cssText = 'color: #fff; margin-bottom: 20px; text-align: center;';

        const cardGrid = document.createElement('div');
        cardGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            max-width: 1200px;
            margin-bottom: 20px;
        `;

        const rarityCount = { standard: 0, gold: 0, rainbow: 0 };

        cards.forEach(card => {
            rarityCount[card.rarityClass.replace('rarity-', '')]++;

            const cardElement = document.createElement('div');
            cardElement.style.cssText = `
                width: 120px;
                height: 160px;
                background: url('${card.image}') center/cover;
                border: 2px solid;
                border-radius: 8px;
                position: relative;
                display: flex;
                align-items: flex-end;
                padding: 5px;
                font-size: 10px;
                color: #fff;
                text-shadow: 1px 1px 2px #000;
            `;

            if(card.rarityClass === 'rarity-gold'){
                cardElement.style.borderColor = '#ffd700';
                cardElement.style.boxShadow = '0 0 10px #ffd700';
            }else if(card.rarityClass === 'rarity-rainbow'){
                cardElement.style.borderColor = '#ff00ff';
                cardElement.style.boxShadow = '0 0 15px #ff00ff';
            }else{
                cardElement.style.borderColor = '#ccc';
            }

            cardElement.textContent = card.displayName;

            cardGrid.appendChild(cardElement);
        });

        const stats = document.createElement('div');
        stats.style.cssText = 'color: #fff; text-align: center; margin-bottom: 20px;';
        stats.innerHTML = `
            <p>Standard: ${rarityCount.standard} | Gold: ${rarityCount.gold} | Rainbow: ${rarityCount.rainbow}</p>
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: #e94560;
            color: #fff;
            border: none;
            padding: 10px 30px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
            renderCards();
        };

        modal.appendChild(title);
        modal.appendChild(stats);
        modal.appendChild(cardGrid);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    };

    const showSeriesSelection = (item) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            padding: 20px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Select Series for Set Booster';
        title.style.cssText = 'color: #fff; margin-bottom: 30px; text-align: center;';

        const description = document.createElement('p');
        description.textContent = 'Choose which series to focus on for the next 10 packs:';
        description.style.cssText = 'color: #aaa; margin-bottom: 30px; text-align: center;';

        const allSeries = [...new Set(window.cardDatabase.map(c => c.series))];

        const seriesContainer = document.createElement('div');
        seriesContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            max-width: 800px;
            margin-bottom: 30px;
        `;

        allSeries.forEach(series => {
            const btn = document.createElement('button');
            btn.textContent = series;
            btn.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                border: none;
                padding: 20px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            `;

            btn.onmouseover = () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
            };

            btn.onmouseout = () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            };

            btn.onclick = () => {
                selectSeries(series, item);
                document.body.removeChild(modal);
            };

            seriesContainer.appendChild(btn);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            background: #666;
            color: #fff;
            border: none;
            padding: 10px 30px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        `;
        cancelBtn.onclick = () => {
            document.body.removeChild(modal);
        };

        modal.appendChild(title);
        modal.appendChild(description);
        modal.appendChild(seriesContainer);
        modal.appendChild(cancelBtn);
        document.body.appendChild(modal);
    };

    const selectSeries = (series, item) => {
        activeEffects.set_focus.push({
            id: Date.now(),
            series,
            remaining: item.effect.duration
        });

        playerItems[item.id]--;
        if (playerItems[item.id] <= 0)
            delete playerItems[item.id];

        savePlayerItems();
        renderItems();
        showNotification(`${item.name} activated! Next ${item.effect.duration} packs will focus on ${series} series.`);
    };

    const showNotification = message => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: #fff;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode)
                notification.parentNode.removeChild(notification);
        }, 3000);
    };

    const renderItems = () => {
        const container = document.getElementById('items-container');
        if (!container)
            return;

        container.innerHTML = '';

        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 30px; width: 100%;';

        header.innerHTML = `
<p style="color: #aaa; font-size: 16px; margin-bottom: 10px;">
    Items are randomly found when opening packs (10% chance per pack)<br>
    <small style="color: #666;">Drop Rates: Common ~77%, Uncommon ~16%, Rare ~6%, Epic ~1%, Legendary ~0.02%, Ultra ~0.0008%</small>
</p>
<div style="background: rgba(76, 175, 80, 0.1); border: 1px solid #4caf50; border-radius: 8px; padding: 15px; margin: 10px 0;">
    <h4 style="color: #4caf50; margin: 0 0 10px 0;">🔥 Active Effects</h4>
    <div style="color: #fff; font-size: 14px;">
        ${activeEffects.luck_boost && activeEffects.luck_boost.length > 0 ? 
            `<div style="background: rgba(255,215,0,0.2); padding: 8px; border-radius: 5px; margin: 5px 0; border-left: 3px solid #ffd700;">
                ✨ Luck Boost x${getLuckMultiplier()} (${activeEffects.luck_boost[0].remaining} packs remaining)
            </div>` : ''
        }
        ${activeEffects.rarity_guarantee && activeEffects.rarity_guarantee.length > 0 ? 
            `<div style="background: rgba(255,20,147,0.2); padding: 8px; border-radius: 5px; margin: 5px 0; border-left: 3px solid #ff1493;">
                🎯 ${activeEffects.rarity_guarantee[0].rarity.toUpperCase()} Guarantee (${activeEffects.rarity_guarantee[0].remaining} uses remaining)
            </div>` : ''
        }
        ${activeEffects.rarity_boost && activeEffects.rarity_boost.length > 0 ? 
            `<div style="background: rgba(138,43,226,0.2); padding: 8px; border-radius: 5px; margin: 5px 0; border-left: 3px solid #8a2be2;">
                ⬆️ Rarity Boost (${activeEffects.rarity_boost[0].remaining} packs remaining)
            </div>` : ''
        }
        ${activeEffects.set_focus && activeEffects.set_focus.length > 0 ? 
            `<div style="background: rgba(34,139,34,0.2); padding: 8px; border-radius: 5px; margin: 5px 0; border-left: 3px solid #228b22;">
                🎯 Set Focus: ${activeEffects.set_focus[0].series} (${activeEffects.set_focus[0].remaining} packs remaining)
            </div>` : ''
        }
        ${activeEffects.card_luck_boost && activeEffects.card_luck_boost.length > 0 ? 
            `<div style="background: rgba(0,191,255,0.2); padding: 8px; border-radius: 5px; margin: 5px 0; border-left: 3px solid #00bfff;">
                🧲 Rare Card Luck x${activeEffects.card_luck_boost[0].multiplier} (${activeEffects.card_luck_boost[0].remaining} packs remaining)
            </div>` : ''
        }
        ${activeEffects.card_guarantee && activeEffects.card_guarantee.length > 0 ? 
            `<div style="background: rgba(255,140,0,0.2); padding: 8px; border-radius: 5px; margin: 5px 0; border-left: 3px solid #ff8c00;">
                🧲 Rare Card Guarantee (${activeEffects.card_guarantee[0].remaining} uses remaining)
            </div>` : ''
        }
        ${(!activeEffects.luck_boost || activeEffects.luck_boost.length === 0) && (!activeEffects.rarity_guarantee || activeEffects.rarity_guarantee.length === 0) && (!activeEffects.rarity_boost || activeEffects.rarity_boost.length === 0) &&
          (!activeEffects.set_focus || activeEffects.set_focus.length === 0) && (!activeEffects.card_luck_boost || activeEffects.card_luck_boost.length === 0) && (!activeEffects.card_guarantee || activeEffects.card_guarantee.length === 0) ? 
          `<div style="color: #aaa; font-style: italic; text-align: center; padding: 10px;">No active effects</div>` : ''
        }
    </div>
</div>
`;

        container.appendChild(header);
        itemsDatabase.forEach(item => {
            const quantity = playerItems[item.id] || 0;

            const itemElement = document.createElement('div');
            itemElement.className = `item rarity-${item.rarity}`;

            itemElement.innerHTML = `
                ${quantity > 0 ? `<div class="item-quantity">${quantity}</div>` : ''}
                <div class="item-icon">${item.icon}</div>
                <h3>${item.name}</h3>
                <div class="item-description">${item.description}</div>
                <input type="number" min="1" max="${quantity}" value="1" class="item-quantity-input" id="item-quantity-${item.id}" style="width: 50px; margin-right: 10px;" />
                <button class="item-use-btn" ${quantity <= 0 ? 'disabled' : ''} onclick="ItemsSystem.useItem(${item.id}, parseInt(document.getElementById('item-quantity-${item.id}').value) || 1)">
                    ${quantity > 0 ? 'Use Item' : 'Not Owned'}
                </button>
            `;

            container.appendChild(itemElement);
        });
    };

    const savePlayerItems = () => {
        localStorage.setItem('playerItems', JSON.stringify(playerItems));
        localStorage.setItem('activeEffects', JSON.stringify(activeEffects));
    };

    const loadPlayerItems = () => {
        const saved = localStorage.getItem('playerItems');
        if (saved) playerItems = JSON.parse(saved);

        const savedEffects = localStorage.getItem('activeEffects');
        if (savedEffects) {
            const effects = JSON.parse(savedEffects);
            activeEffects.luck_boost = Array.isArray(effects.luck_boost) ? effects.luck_boost : [];
            activeEffects.rarity_guarantee = Array.isArray(effects.rarity_guarantee) ? effects.rarity_guarantee : [];
            activeEffects.rarity_boost = Array.isArray(effects.rarity_boost) ? effects.rarity_boost : [];
            activeEffects.set_focus = Array.isArray(effects.set_focus) ? effects.set_focus : [];
            activeEffects.card_luck_boost = Array.isArray(effects.card_luck_boost) ? effects.card_luck_boost : [];
            activeEffects.card_guarantee = Array.isArray(effects.card_guarantee) ? effects.card_guarantee : [];
        }
    };

    const getRarityText = (itemId) => {
        const rarityMap = {
            1: '', 2: '', 4: '', 7: '',
            8: '🟢', 11: '🟢', 12: '🟢',
            3: '🔵', 6: '🔵', 10: '🔵', 13: '🔵',
            5: '🟣', 9: '🟣', 16: '🟣',
            14: '🟠', 15: '🟠', 18: '🟠',
            16: '💎'
        };
        return rarityMap[itemId] || '';
    };

    return {
        init,
        addItem,
        useItem,
        renderItems,
        getActiveEffects,
        decreaseEffectDurations,
        openBulkPacks,
        loadPlayerItems,
        itemsDatabase
    };
})();

window.ItemsSystem = ItemsSystem;

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0;}
        to { transform: translateX(0); opacity: 1;}
    }  
`;
document.head.appendChild(style);