document.addEventListener('DOMContentLoaded', () => {
    if (!window.cardDatabase || !Array.isArray(window.cardDatabase)) {
        console.error("cardDatabase is undefined or not an array after DOM content loaded.");
        return;
    }

const SupportLogic = (() => {
    const originalGenerateCard = window.generateCard;

    const extractRarityValue = (rarityString) => {
        if (typeof rarityString !== 'string') return 0;
        const match = rarityString.match(/1 in (\d+)/);
        if (match && match[1]) {
            const val = parseInt(match[1], 10);
            return isNaN(val) ? 0 : val;
        }
        return 0;
    };

    function generateCard(baseCardId) {
        if (!window.cardDatabase || !Array.isArray(window.cardDatabase)) {
            console.error("cardDatabase is undefined or not an array. Make sure cards.js loads before support-logic.js");
            return null;
        }

        if (baseCardId !== undefined) {
            const card = window.cardDatabase.find(c => c.id === baseCardId);
            if (!card) return null;
            const cardCopy = { ...card };
            cardCopy.instanceId = Date.now() + Math.floor(Math.random() * 1000);

            if (cardCopy.type === "support") {
                cardCopy.rarityClass = 'rarity-standard';
                cardCopy.rarity = cardCopy.baseRarity;
                cardCopy.displayName = cardCopy.name;
                return cardCopy;
            } else {
                return originalGenerateCard(baseCardId);
            }
        }

        const activeEffects = window.ItemsSystem ? window.ItemsSystem.getActiveEffects() : null;
        const combatCards = window.cardDatabase.filter(card => card.type !== "support");

        if (!combatCards.length) return null;

        const rarityExponent = 0.7;

        let totalWeight = 0;
        const weightedCards = combatCards.map(card => {
            const rarityVal = extractRarityValue(card.baseRarity);
            const safeRarity = rarityVal > 0 ? rarityVal : 1;
            let weight = 1 / Math.pow(safeRarity, rarityExponent);

            if (activeEffects && activeEffects.card_luck_boost && activeEffects.card_luck_boost.remaining > 0) {
                if (rarityVal >= activeEffects.card_luck_boost.rarityThreshold) {
                    weight *= activeEffects.card_luck_boost.multiplier;
                }
            }

            totalWeight += weight;
            return { card, weight };
        });

        let randomVal = Math.random() * totalWeight;
        for (const entry of weightedCards) {
            randomVal -= entry.weight;
            if (randomVal <= 0) {
                return generateCard(entry.card.id);
            }
        }

        return generateCard(combatCards[0].id);
    }

    const applySupportEffect = (supportCard, combatCard, battleState, phase) => {
        if (!supportCard || !combatCard) return;

        switch (supportCard.abilityName) {
            case "Heal Boost":
                if (phase === "turnStart") {
                    const heal = Math.floor(combatCard.hp * 0.05);
                    combatCard.currentHp = Math.min(combatCard.hp, combatCard.currentHp + heal);
                    battleState.battleLog.push(`${supportCard.name} heals ${combatCard.displayName || combatCard.name} for ${heal} HP.`);
                }
                break;

            case "Full Restore":
                if (phase === "turnEnd" && Math.random() < 0.1) {
                    combatCard.currentHp = combatCard.hp;
                    battleState.battleLog.push(`${supportCard.name} fully restores ${combatCard.displayName || combatCard.name}!`);
                }
                break;

            case "Fraction of Power":
                if (phase === "battleStart") {
                    const rand = Math.random();
                    if (rand < 0.33) {
                        combatCard.damage = Math.floor(combatCard.damage * 1.2);
                        battleState.battleLog.push(`${supportCard.name} grants ${combatCard.displayName || combatCard.name} +20% attack.`);
                    } else if (rand < 0.66) {
                        combatCard.hp = Math.floor(combatCard.hp * 1.2);
                        combatCard.currentHp = combatCard.hp;
                        battleState.battleLog.push(`${supportCard.name} grants ${combatCard.displayName || combatCard.name} +20% HP.`);
                    } else if (battleState.enemyCards.length > 0) {
                        const enemy = battleState.enemyCards[Math.floor(Math.random() * battleState.enemyCards.length)];
                        const stealHp = Math.floor(enemy.currentHp * 0.1);
                        const stealDamage = Math.floor(enemy.damage * 0.1);
                        enemy.currentHp = Math.max(0, enemy.currentHp - stealHp);
                        combatCard.currentHp = Math.min(combatCard.hp, combatCard.currentHp + stealHp);
                        combatCard.damage += stealDamage;
                        battleState.battleLog.push(`${supportCard.name} steals 10% HP and damage from enemy for ${combatCard.displayName || combatCard.name}!`);
                    }
                }
                break;

            case "Wish":
                if (phase === "turnStart" && Math.random() < 0.1) {
                    const hpGain = Math.floor(combatCard.hp * 0.5);
                    const dmgGain = Math.floor(combatCard.damage * 0.5);
                    combatCard.currentHp = Math.min(combatCard.hp, combatCard.currentHp + hpGain);
                    combatCard.damage += dmgGain;
                    battleState.battleLog.push(`${supportCard.name} grants a wish: +${hpGain} HP and +${dmgGain} damage to ${combatCard.displayName || combatCard.name}!`);
                }
                break;

            case "Strong Wish":
                if (phase === "turnStart" && Math.random() < 0.2) {
                    const hpGain = Math.floor(combatCard.hp * 0.5);
                    const dmgGain = Math.floor(combatCard.damage * 0.5);
                    combatCard.currentHp = Math.min(combatCard.hp, combatCard.currentHp + hpGain);
                    combatCard.damage += dmgGain;
                    battleState.battleLog.push(`${supportCard.name} grants a strong wish: +${hpGain} HP and +${dmgGain} damage to ${combatCard.displayName || combatCard.name}!`);
                }
                break;

            case "Fusion":
                if (phase === "battleStart") {
                    if (!battleState || !Array.isArray(battleState.playerCards)) return;

                    if (combatCard.name.includes('Goku') || combatCard.name.includes('Vegeta')) {
                        const otherName = combatCard.name.includes('Goku') ? 'Vegeta' : 'Goku';
                        const otherIndex = battleState.playerCards.findIndex(c => c && c.name.includes(otherName) && c.instanceId !== combatCard.instanceId);

                        if (otherIndex !== -1) {
                            const otherCard = battleState.playerCards[otherIndex];

                            let fusionName = null;

                            if (combatCard.name.includes('Goku')) {
                                if (combatCard.name.includes('Ultra Instinct')) {
                                    fusionName = 'Ultra Instinct Gogeta';
                                } else {
                                    fusionName = 'Gogeta';
                                }
                            } else if (combatCard.name.includes('Vegeta')) {
                                if (combatCard.name.includes('Ultra Ego')) {
                                    fusionName = 'Ultra Ego Vegito';
                                } else {
                                    fusionName = 'Vegito';
                                }
                            }

                            const fusionBase = window.cardDatabase.find(c => c.name === fusionName);
                            if (!fusionBase) {
                                battleState.battleLog.push(`${supportCard.name} cannot find fusion card ${fusionName}.`);
                                return;
                            }

                            const fusionCard = { ...fusionBase };
                            fusionCard.instanceId = Date.now() + Math.floor(Math.random() * 1000);

                            fusionCard.rarityClass = combatCard.rarityClass || 'rarity-standard';
                            fusionCard.rarity = combatCard.rarity || fusionCard.baseRarity;
                            fusionCard.displayName = fusionName;

                            fusionCard.damage = Math.max(combatCard.damage, otherCard.damage);
                            fusionCard.hp = Math.max(combatCard.hp, otherCard.hp);
                            fusionCard.currentHp = fusionCard.hp;

                            battleState.playerCards = battleState.playerCards.filter(c => c.instanceId !== combatCard.instanceId && c.instanceId !== otherCard.instanceId);
                            battleState.playerCards.push(fusionCard);

                            battleState.battleLog.push(`${supportCard.name} triggered Fusion! ${combatCard.displayName || combatCard.name} and ${otherCard.displayName || otherCard.name} merged into ${fusionName}!`);
                        }
                    }
                }
                break;

            case "Damage Boost":
                if (phase === "turnStart") {
                    const inc = Math.floor(combatCard.damage * 0.05);
                    combatCard.damage += inc;
                    battleState.battleLog.push(`${supportCard.name} increases damage of ${combatCard.displayName || combatCard.name} by 5% (${inc}).`);
                }
                break;

            default:
                break;
        }
    };

    window.generateCard = generateCard;

    return {
        generateCard,
        applySupportEffect,
    };
})();

    window.SupportLogic = SupportLogic;
});
