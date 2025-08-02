// combat-logic.js
const CombatLogic = (() => {
    // Applies character abilities during specific phases of combat
    // phase: 'attack', 'defense', 'post-attack', 'post-damage', 'turnStart', 'turnEnd', 'battleStart'
    // context optionally provides additional info like the target of an attack, damage dealt, etc.
    const applyCharacterAbility = (card, battleState, phase, context = null) => {
        const result = {
            damage: false,
            multiplier: 1,
            bonusDamage: 0,
            dodged: false,
            counterDamage: 0,
            healing: 0,
            message: null,
        };
        const cardName = card.name;
        const cardId = card.instanceId || card.id;
        if (!battleState.abilityStates[cardId]) {
            battleState.abilityStates[cardId] = {
                piccolo_turnCount: 0,
                gohan_lowHpTriggered: false,
                gohan_enragedTurns: 0,
                broly_damaged: false,
                broly_wrathful: false,
                jiren_damageStacks: 0,
                ultraEgo_survivalTriggered: false,
                // You can add more state flags for abilities here
            };
        }
        const abilityState = battleState.abilityStates[cardId];

        switch (cardName) {
            case "Goku":
                if (phase === "attack" && battleState.enemyCards.some(enemy => enemy.currentHp < enemy.hp * 0.3)) {
                    result.damage = true;
                    result.multiplier = 1.5;
                    result.message = `${card.displayName || card.name} uses Kamehameha for extra damage!`;
                }
                break;

            case "Vegeta":
                if (phase === "attack" && Math.random() < 0.2) {
                    result.damage = true;
                    result.multiplier = 2.0;
                    result.message = `${card.displayName || card.name} triggers Final Flash for double damage!`;
                }
                break;

            case "Frieza":
                if (phase === "post-attack" && context) {
                    const percentDamage = Math.floor(context.hp * 0.15);
                    result.bonusDamage = percentDamage;
                    result.message = `Frieza's Death Ball deals ${percentDamage} additional damage!`;
                }
                break;

            case "Cell":
                if (phase === "post-damage" && context) {
                    const healing = Math.floor(context.damage * 0.2);
                    result.healing = healing;
                    result.message = `Cell absorbs energy and heals for ${healing} HP!`;
                }
                break;

            case "Ultra Instinct Goku":
                if (phase === "defense" && Math.random() < 0.3) {
                    result.dodged = true;
                    result.counterDamage = Math.floor(card.damage * 1.5);
                    result.message = `Ultra Instinct Goku dodges the attack completely!`;
                }
                break;

            case "Ultra Ego Vegeta":
                if (phase === "attack") {
                    const hpMissingPercent = ((card.hp - card.currentHp) / card.hp) * 100;
                    const damageBonus = 1 + (hpMissingPercent * 0.03);
                    result.damage = true;
                    result.multiplier = damageBonus;
                    if (damageBonus > 1.1) {
                        result.message = `Ultra Ego Vegeta gains power from damage! (+${Math.floor((damageBonus - 1) * 100)}% damage)`;
                    }
                }
                break;

            case "Gohan (Teen)":
                if (phase === "attack" && card.currentHp < card.hp * 0.4 && !abilityState.gohan_lowHpTriggered) {
                    abilityState.gohan_lowHpTriggered = true;
                    abilityState.gohan_enragedTurns = 3;
                    result.message = `Gohan gets enraged! Father-Son Kamehameha activated for 3 turns!`;
                }
                if (abilityState.gohan_enragedTurns > 0) {
                    result.damage = true;
                    result.multiplier = 1.75;
                    abilityState.gohan_enragedTurns--;
                }
                break;

            case "Piccolo":
                abilityState.piccolo_turnCount++;
                if (phase === "attack" && abilityState.piccolo_turnCount % 2 === 0) {
                    result.damage = true;
                    result.multiplier = 1.2;
                    result.message = `Piccolo charges Special Beam Cannon for extra damage!`;
                }
                break;

            case "Jiren":
                if (phase === "attack") {
                    abilityState.jiren_damageStacks = Math.min(10, abilityState.jiren_damageStacks + 1);
                    const stackBonus = 1 + (abilityState.jiren_damageStacks * 0.05);
                    result.damage = true;
                    result.multiplier = stackBonus;
                    if (abilityState.jiren_damageStacks > 1) {
                        result.message = `Jiren's Raw Power increases! (+${abilityState.jiren_damageStacks * 5}% damage)`;
                    }
                }
                break;

            case "Broly":
                if (phase === "post-damage" && !abilityState.broly_damaged) {
                    abilityState.broly_damaged = true;
                    abilityState.broly_wrathful = true;
                    result.message = `Broly becomes Wrathful! Damage permanently increased by 50%!`;
                }
                if (phase === "attack" && abilityState.broly_wrathful) {
                    result.damage = true;
                    result.multiplier = 1.5;
                }
                break;

            case "Majin Buu":
                if (phase === "attack" && Math.random() < 0.15) {
                    battleState.enemyTurnSkip = true;
                    result.message = `Majin Buu turns enemy into candy! Enemy's next turn is skipped!`;
                }
                break;

            case "Zeno":
                if (phase === "attack" && Math.random() < 0.01) {
                    battleState.instantWin = true;
                    result.message = `Zeno is bored and erases all enemies! Instant victory!`;
                }
                break;

            case "Black Frieza":
                if (phase === "attack") {
                    result.damage = true;
                    result.multiplier = 1.3;
                    if (battleState.enemyCards.length > 0) {
                        const enemyRarity = 2; // Placeholder rarity value
                        const cardRarityValue = parseInt(card.baseRarity?.split(' in ')[1] || '2');
                        const rarityBonus = Math.ceil((cardRarityValue / enemyRarity) * 0.15);
                        result.multiplier += rarityBonus;
                        result.message = `Black Frieza's ruthless power overwhelms the enemy! (+${Math.floor((result.multiplier - 1) * 100)}% damage)`;
                    }
                }
                break;

            default:
                break;
        }
        return result;
    };

    // Applies effects of support cards on their linked combat card during battle phases
    // phase examples: 'turnStart', 'turnEnd', 'battleStart', 'attack'
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
                    if ((combatCard.name.includes('Goku') || combatCard.name.includes('Vegeta'))) {
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

                            // Remove the two fused cards
                            battleState.playerCards = battleState.playerCards.filter(c => c.instanceId !== combatCard.instanceId && c.instanceId !== otherCard.instanceId);

                            // Add fusion card
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

    // Limits how many times a card's damage counts per battle (max 3 uses by default)
    const limitCardUsage = (card, damage, usageCount, maxUses = 3) => {
        if (usageCount > maxUses) {
            return 0;
        }
        return damage;
    };

    // Runs a full player attack phase: calculates total damage, applies abilities, updates enemies hp, etc.
    // Returns final damage dealt
    const performPlayerAttack = (battleState) => {
        let totalPlayerDamage = 0;
        let abilityDamageBonus = 0;
        battleState.playerCards.forEach(card => {
            if (card.currentHp <= 0) return;
            let cardDamage = card.damage;
            const abilityResult = applyCharacterAbility(card, battleState, 'attack');
            if (abilityResult.damage) {
                cardDamage = Math.floor(cardDamage * abilityResult.multiplier);
                if (abilityResult.message) {
                    battleState.battleLog.push(abilityResult.message);
                }
            }
            if (abilityResult.bonusDamage) {
                abilityDamageBonus += abilityResult.bonusDamage;
            }
            battleUsageTracker[card.instanceId || card.id] = (battleUsageTracker[card.instanceId || card.id] || 0) + 1;
            cardDamage = limitCardUsage(card, cardDamage, battleUsageTracker[card.instanceId || card.id]);
            totalPlayerDamage += cardDamage;
        });

        if (battleState.enemyCards.length === 0) return 0;

        const weakestEnemy = battleState.enemyCards.reduce((weakest, card) => card.currentHp < weakest.currentHp ? card : weakest, battleState.enemyCards[0]);
        const finalDamage = totalPlayerDamage + abilityDamageBonus;

        weakestEnemy.currentHp = Math.max(0, weakestEnemy.currentHp - finalDamage);
        battleState.battleLog.push(`Your cards deal ${finalDamage} damage to ${weakestEnemy.name}!`);

        battleState.playerSupportCards.forEach((supportCard, idx) => {
            if (supportCard) {
                const combatCard = battleState.playerCards[idx];
                applySupportEffect(supportCard, combatCard, battleState, 'attack');
            }
        });

        battleState.playerCards.forEach(card => {
            if (card.currentHp <= 0) return;
            const postAttackResult = applyCharacterAbility(card, battleState, 'post-attack', weakestEnemy);
            if (postAttackResult.message) battleState.battleLog.push(postAttackResult.message);
            if (postAttackResult.bonusDamage) {
                weakestEnemy.currentHp = Math.max(0, weakestEnemy.currentHp - postAttackResult.bonusDamage);
            }
        });

        return finalDamage;
    };

    // Runs a full enemy attack phase: deal damage to player cards, applies abilities, etc.
    // Returns total damage dealt to player
    const performEnemyAttack = (battleState) => {
        if (battleState.enemyCards.length === 0) return 0;
        if (battleState.playerCards.length === 0) return 0;

        const enemyDamage = battleState.enemyCards.reduce((sum, card) => sum + card.damage, 0);
        const weakestPlayer = battleState.playerCards.reduce((weakest, card) => card.currentHp < weakest.currentHp ? card : weakest, battleState.playerCards[0]);
        let actualDamage = enemyDamage;
        let dodged = false;

        battleState.playerCards.forEach(card => {
            if (card.currentHp <= 0) return;
            const defenseResult = applyCharacterAbility(card, battleState, 'defense', { damage: actualDamage });
            if (defenseResult.dodged) {
                dodged = true;
                actualDamage = 0;
                if (defenseResult.message) battleState.battleLog.push(defenseResult.message);
                if (defenseResult.counterDamage) {
                    const randomEnemy = battleState.enemyCards[Math.floor(Math.random() * battleState.enemyCards.length)];
                    randomEnemy.currentHp = Math.max(0, randomEnemy.currentHp - defenseResult.counterDamage);
                    battleState.battleLog.push(`${card.displayName || card.name} counter-attacks for ${defenseResult.counterDamage} damage!`);
                }
            }
        });

        if (!dodged) {
            weakestPlayer.currentHp = Math.max(0, weakestPlayer.currentHp - actualDamage);
            battleState.battleLog.push(`Enemy deals ${actualDamage} damage to your ${weakestPlayer.displayName || weakestPlayer.name}!`);
            battleState.playerCards.forEach(card => {
                if (card.currentHp <= 0) return;
                const healResult = applyCharacterAbility(card, battleState, 'post-damage', { damage: actualDamage });
                if (healResult.healing) {
                    card.currentHp = Math.min(card.hp, card.currentHp + healResult.healing);
                    if (healResult.message) {
                        battleState.battleLog.push(healResult.message);
                    }
                }
            });
        }

        return actualDamage;
    };

    // Evaluates end of turn conditions and returns string status: 'victory', 'defeat', or 'continue'
    const evaluateBattleStatus = (battleState) => {
        battleState.enemyCards = battleState.enemyCards.filter(card => card.currentHp > 0);
        battleState.playerCards = battleState.playerCards.filter(card => card.currentHp > 0);

        if (battleState.enemyCards.length === 0) {
            return 'victory';
        } else if (battleState.playerCards.length === 0) {
            return 'defeat';
        }
        return 'continue';
    };

    // Resets the ability states and battle usage tracker for a new battle
    const resetBattleStates = (battleState) => {
        battleState.abilityStates = {};
        for (const key in battleUsageTracker) {
            if (Object.hasOwnProperty.call(battleUsageTracker, key)) {
                delete battleUsageTracker[key];
            }
        }
    };

    // Full battle turn cycle: player attacks, check status, enemy attacks, check status
    // Returns an object { status: 'victory'|'defeat'|'continue', battleState }
    const processTurn = (battleState) => {
        if (!battleState || !battleState.playerCards || !battleState.enemyCards) {
            throw new Error('Invalid battle state passed to processTurn.');
        }

        const playerDamage = performPlayerAttack(battleState);
        let status = evaluateBattleStatus(battleState);
        if (status === 'victory') {
            return { status, battleState };
        }

        if (battleState.enemyTurnSkip) {
            battleState.battleLog.push('Enemy skips their turn!');
            battleState.enemyTurnSkip = false;
        } else {
            const enemyDamage = performEnemyAttack(battleState);
            status = evaluateBattleStatus(battleState);
            if (status !== 'continue') {
                return { status, battleState };
            }
        }

        // Proceed to next turn
        battleState.turnCount = (battleState.turnCount || 0) + 1;
        battleState.currentTurn = 'player';

        return { status: 'continue', battleState };
    };

    return {
        applyCharacterAbility,
        applySupportEffect,
        limitCardUsage,
        performPlayerAttack,
        performEnemyAttack,
        evaluateBattleStatus,
        resetBattleStates,
        processTurn,
    };
})();

window.CombatLogic = CombatLogic;