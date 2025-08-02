const StoryMode = (() => {
    let playerDeck = [
        { combat: null, support: null },
        { combat: null, support: null },
        { combat: null, support: null }
    ];

    let storyProgress = {
        currentChapter: 1,
        completedBattles: [],
        playerXP: 0,
        playerLevel: 1
    };

    let currentBattle = null;
    let battleState = {
        playerCards: [],
        playerSupportCards: [],
        enemyCards: [],
        currentTurn: 'player',
        battleLog: [],
        turnCount: 0,
        abilityStates: {},
        instantWin: false,
        enemyTurnSkip: false
    };
    let battleUsageTracker = {};

    const storyData = [
        {
            id: 1,
            title: "Chapter 1: Earth's Weakest Warriors",
            description: "Face off against some of Earth's earliest threats. Perfect for testing your new cards!",
            battles: [
                {
                    id: 1,
                    name: "Saibaimen Squad",
                    description: "Fight against three weak Saibaimen",
                    enemy: {
                        cards: [
                            { name: "Saibaimen Alpha", damage: 15, hp: 30, image: "images/cards/saibaimen-card.jpg" },
                            { name: "Saibaimen Beta", damage: 18, hp: 32, image: "images/cards/saibaimen-card.jpg" },
                            { name: "Saibaimen Gamma", damage: 12, hp: 28, image: "images/cards/saibaimen-card.jpg" }
                        ]
                    },
                    rewards: { items: [1, 7], experience: 50 }
                },
                {
                    id: 2,
                    name: "Nappa's Arrival",
                    description: "The Saiyan elite warrior tests your strength",
                    enemy: {
                        cards: [
                            { name: "Nappa", damage: 45, hp: 85, image: "images/cards/nappa-card.png" }
                        ]
                    },
                    rewards: { items: [2, 4], experience: 100 }
                }
            ]
        },
        {
            id: 2,
            title: "Chapter 2: Saiyan Saga",
            description: "The real Saiyan threat arrives on Earth. Only the strongest cards will survive!",
            battles: [
                {
                    id: 3,
                    name: "Vegeta's Challenge",
                    description: "Face the Prince of all Saiyans in single combat",
                    enemy: {
                        cards: [
                            { name: "Saiyan Saga Vegeta", damage: 55, hp: 120, image: "images/cards/vegeta-card.png" }
                        ]
                    },
                    rewards: { items: [3, 5], experience: 150 }
                },
                {
                    id: 4,
                    name: "Great Ape Vegeta",
                    description: "Vegeta transforms! This massive foe requires your best strategy",
                    enemy: {
                        cards: [
                            { name: "Great Ape Vegeta", damage: 80, hp: 200, image: "images/cards/great-ape-vegeta.png" }
                        ]
                    },
                    rewards: { items: [6, 8], experience: 250 }
                }
            ]
        },
        {
            id: 3,
            title: "Chapter 3: Frieza Force",
            description: "Travel to Namek and face the galaxy's most feared army!",
            battles: [
                {
                    id: 5,
                    name: "Dodoria & Zarbon",
                    description: "Frieza's elite henchmen attack together",
                    enemy: {
                        cards: [
                            { name: "Dodoria", damage: 65, hp: 110, image: "images/cards/dodoria-card.png" },
                            { name: "Zarbon", damage: 70, hp: 105, image: "images/cards/zarbon-card.png" }
                        ]
                    },
                    rewards: { items: [2, 9], experience: 200 }
                },
                {
                    id: 6,
                    name: "The Ginyu Force",
                    description: "Face all five members of Frieza's special forces",
                    enemy: {
                        cards: [
                            { name: "Captain Ginyu", damage: 75, hp: 130, image: "images/cards/ginyu-card.png" },
                            { name: "Recoome", damage: 70, hp: 140, image: "images/cards/recoome-card.png" },
                            { name: "Burter", damage: 65, hp: 115, image: "images/cards/burter-card.png" }
                        ]
                    },
                    rewards: { items: [5, 10], experience: 300 }
                },
                {
                    id: 7,
                    name: "Emperor Frieza",
                    description: "The ultimate villain! Frieza at full power",
                    enemy: {
                        cards: [
                            { name: "Final Form Frieza", damage: 120, hp: 250, image: "images/cards/frieza-card.png" }
                        ]
                    },
                    rewards: { items: [3, 11], experience: 500 }
                }
            ]
        },
        {
            id: 4,
            title: "Chapter 4: Android Menace",
            description: "Artificial beings threaten the world. Face Dr. Gero's creations!",
            battles: [
                {
                    id: 8,
                    name: "Android 19 & 20",
                    description: "The first androids to appear",
                    enemy: {
                        cards: [
                            { name: "Android 19", damage: 85, hp: 160, image: "images/cards/android19-card.png" },
                            { name: "Dr. Gero", damage: 80, hp: 150, image: "images/cards/android20-card.png" }
                        ]
                    },
                    rewards: { items: [4, 7], experience: 350 }
                },
                {
                    id: 9,
                    name: "Perfect Cell",
                    description: "The ultimate artificial life form",
                    enemy: {
                        cards: [
                            { name: "Perfect Cell", damage: 140, hp: 300, image: "images/cards/cell-card.png" }
                        ]
                    },
                    rewards: { items: [5, 8], experience: 600 }
                }
            ]
        },
        {
            id: 5,
            title: "Chapter 5: Majin Terror",
            description: "Ancient evil awakens. Face the pink terror that threatens the universe!",
            battles: [
                {
                    id: 10,
                    name: "Majin Buu",
                    description: "The innocent-looking but deadly Majin Buu",
                    enemy: {
                        cards: [
                            { name: "Fat Buu", damage: 100, hp: 280, image: "images/cards/buu-card.png" }
                        ]
                    },
                    rewards: { items: [6, 9], experience: 700 }
                },
                {
                    id: 11,
                    name: "Kid Buu",
                    description: "Buu's most dangerous form - pure evil incarnate",
                    enemy: {
                        cards: [
                            { name: "Kid Buu", damage: 180, hp: 350, image: "images/cards/kid-buu-card.png" }
                        ]
                    },
                    rewards: { items: [3, 10, 11], experience: 1000 }
                }
            ]
        },
        {
            id: 6,
            title: "Chapter 6: Gods & Mortals",
            description: "Enter the realm of divine beings. Only the strongest cards can compete here!",
            battles: [
                {
                    id: 12,
                    name: "Jiren the Gray",
                    description: "Universe 11's strongest warrior",
                    enemy: {
                        cards: [
                            { name: "Jiren", damage: 200, hp: 400, image: "images/cards/jiren-card.png" }
                        ]
                    },
                    rewards: { items: [5, 9, 11], experience: 1500 }
                },
                {
                    id: 13,
                    name: "The Legendary Super Saiyan",
                    description: "Face Broly's overwhelming power",
                    enemy: {
                        cards: [
                            { name: "Legendary Broly", damage: 250, hp: 500, image: "images/cards/broly-card.png" }
                        ]
                    },
                    rewards: { items: [3, 10, 11], experience: 2000 }
                },
                {
                    id: 14,
                    name: "Omni-King Zeno",
                    description: "The ultimate challenge - face the ruler of all universes",
                    enemy: {
                        cards: [
                            { name: "Zeno", damage: 500, hp: 1000, image: "images/cards/zeno-card.png" }
                        ]
                    },
                    rewards: { items: [3, 5, 9, 10, 11, 12, 13, 16], experience: 5000 }
                }
            ]
        },
        {
            id: 7,
            title: "Chapter 7: Cursed Energy Unleashed",
            description: "Dive into the world of Jujutsu Kaisen. Face off against powerful curses and sorcerers wielding cursed energy!",
            battles: [
                {
                    id: 15,
                    name: "Cursed Womb: Death Paintings",
                    description: "Encounter the Death Paintings, half-human cursed corpses with deadly abilities.",
                    enemy: {
                        cards: [
                            { name: "Eso", damage: 900, hp: 2200, image: "images/cards/eso-card.png" },
                            { name: "Kechizu", damage: 850, hp: 2100, image: "images/cards/kechizu-card.png" }
                        ]
                    },
                    rewards: { items: [5, 12], experience: 1800 }
                },
                {
                    id: 16,
                    name: "Mahito's Experiment",
                    description: "Face Mahito, the cursed spirit with manipulation powers.",
                    enemy: {
                        cards: [
                            { name: "Mahito", damage: 2500, hp: 3800, image: "images/cards/mahito-card.png" }
                        ]
                    },
                    rewards: { items: [13, 16], experience: 3000 }
                },
                {
                    id: 17,
                    name: "The Tokyo Goodwill Event",
                    description: "Battle multiple sorcerers and cursed spirits during the Tokyo event.",
                    enemy: {
                        cards: [
                            { name: "Junpei", damage: 700, hp: 1800, image: "images/cards/junpei-card.png" },
                            { name: "Hanami", damage: 1600, hp: 3500, image: "images/cards/hanami-card.png" },
                            { name: "Toji Fushiguro", damage: 2800, hp: 4200, image: "images/cards/toji-card.png" }
                        ]
                    },
                    rewards: { items: [4, 14, 17], experience: 3500 }
                },
                {
                    id: 18,
                    name: "Geto Suguru's Revolt",
                    description: "Confront Geto Suguru and his army of cursed spirits.",
                    enemy: {
                        cards: [
                            { name: "Geto Suguru", damage: 3000, hp: 4500, image: "images/cards/geto-card.png" }
                        ]
                    },
                    rewards: { items: [14, 15, 17], experience: 4000 }
                },
                {
                    id: 19,
                    name: "Kenjaku's Scheme",
                    description: "Face the ancient sorcerer Kenjaku and his formidable cursed body.",
                    enemy: {
                        cards: [
                            { name: "Kenjaku", damage: 3200, hp: 4600, image: "images/cards/kenjaku-card.png" }
                        ]
                    },
                    rewards: { items: [15, 16, 17], experience: 4500 }
                }
            ]
        }
    ];

    const init = () => {
        loadProgress();
        renderStoryProgress();
        renderDeck();
    };

    const loadProgress = () => {
        const saved = localStorage.getItem('storyProgress');
        if (saved) {
            storyProgress = JSON.parse(saved);
        }
        const savedDeck = localStorage.getItem('playerDeck');
        const savedSupportDeck = localStorage.getItem('playerSupportDeck');
        if (savedDeck) {
            const deckCards = JSON.parse(savedDeck);
            if (savedSupportDeck) {
                const supportCards = JSON.parse(savedSupportDeck);
                playerDeck = deckCards.map((card, i) => ({ combat: card, support: supportCards[i] || null }));
            } else {
                playerDeck = deckCards.map(card => ({ combat: card, support: null }));
            }
        }
    };

    const saveProgress = () => {
        storyProgress.playerXP = parseInt(localStorage.getItem('playerXP')) || 0;
        storyProgress.playerLevel = parseInt(localStorage.getItem('playerLevel')) || 1;
        localStorage.setItem('storyProgress', JSON.stringify(storyProgress));
        localStorage.setItem('playerDeck', JSON.stringify(playerDeck.map(slot => slot.combat)));
        localStorage.setItem('playerSupportDeck', JSON.stringify(playerDeck.map(slot => slot.support)));
    };

    const renderStoryProgress = () => {
        const container = document.getElementById('story-chapters');
        if (!container) return;
        container.innerHTML = '';
        storyData.forEach(chapter => {
            const isUnlocked = chapter.id <= storyProgress.currentChapter;
            const isCompleted = chapter.battles.every(b => storyProgress.completedBattles.includes(b.id));
            const chapterElement = document.createElement('div');
            chapterElement.className = `story-chapter ${isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`;
            const statusText = isCompleted ? 'COMPLETED' : isUnlocked ? 'UNLOCKED' : 'LOCKED';
            const statusClass = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';
            chapterElement.innerHTML =
                `<div class="chapter-header">
                    <h3 class="chapter-title">${chapter.title}</h3>
                    <span class="chapter-status ${statusClass}">${statusText}</span>
                </div>
                <p class="chapter-description">${chapter.description}</p>
                <div class="chapter-battles">
                    ${chapter.battles.map(battle => {
                        const battleCompleted = storyProgress.completedBattles.includes(battle.id);
                        const battleUnlocked = isUnlocked && (battle.id === 1 || storyProgress.completedBattles.includes(battle.id - 1));
                        return `
                            <div class="battle-node ${battleCompleted ? 'completed' : battleUnlocked ? 'unlocked' : 'locked'}"
                                 onclick="${battleUnlocked ? `StoryMode.startBattle(${battle.id})` : ''}">
                                <div class="enemy-name">${battle.name}</div>
                                <div class="enemy-power">Power: ${battle.enemy.cards.reduce((sum, c) => sum + c.damage + c.hp, 0)}</div>
                                ${battleCompleted ? '<div style="color: #4caf50; font-size: 12px; margin-top: 5px;">✓ COMPLETED</div>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>`;
            container.appendChild(chapterElement);
        });
    };

    const renderDeck = () => {
        const slots = document.querySelectorAll('.deck-slot');
        slots.forEach((slot, index) => {
            slot.innerHTML = '';
            const slotData = playerDeck[index];
            if (slotData && slotData.combat) {
                slot.classList.add('equipped');
                slot.style.backgroundImage = `url('${slotData.combat.image}')`;
                const cardElement = document.createElement('div');
                cardElement.className = 'equipped-card';
                const supportName = slotData.support ? slotData.support.displayName || slotData.support.name : 'None';
                cardElement.innerHTML =
                    `<div style="font-weight: bold; font-size: 14px;">${slotData.combat.displayName || slotData.combat.name}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px;">
                        <span>⚔️ ${slotData.combat.damage}</span>
                        <span>💚 ${slotData.combat.hp}</span>
                    </div>
                    <div style="font-size: 10px; color: #ccc; margin-top: 8px;">Support: ${supportName}</div>`;
                slot.appendChild(cardElement);
            } else {
                slot.classList.remove('equipped');
                slot.style.backgroundImage = '';
                slot.innerHTML = '<div class="slot-placeholder">Click to equip card</div>';
            }
        });
    };

    const openCardSelection = (slotIndex, isSupport = false) => {
        if (!playerCards || playerCards.length === 0) {
            alert('You need to own some cards first! Open card packs to get cards.');
            return;
        }
        const modal = document.getElementById('card-selection-modal');
        const container = document.getElementById('available-cards');
        container.innerHTML = '';
        const uniqueCards = new Map();
        playerCards.forEach(card => {
            if (!uniqueCards.has(card.id) || (card.rarityClass === 'rarity-rainbow') || (card.rarityClass === 'rarity-gold' && uniqueCards.get(card.id).rarityClass !== 'rarity-rainbow')) {
                uniqueCards.set(card.id, card);
            }
        });
        uniqueCards.forEach(card => {
            if (isSupport && card.type !== 'support') return;
            if (!isSupport && card.type === 'support') return;

            // Prevent selecting a card already in the deck
            const isAlreadyInDeck = playerDeck.some(slot => slot.combat && slot.combat.instanceId === card.instanceId);
            if (!isSupport && isAlreadyInDeck) return;

            const cardElement = document.createElement('div');
            cardElement.className = `selectable-card ${card.rarityClass}`;
            cardElement.style.backgroundImage = `url('${card.image}')`;
            cardElement.innerHTML =
                `<div style="font-weight: bold; font-size: 12px;">${card.displayName || card.name}</div>
                 <div style="font-size: 10px;">⚔️ ${card.damage} 💚 ${card.hp}</div>`;
            cardElement.addEventListener('click', () => {
                selectCard(slotIndex, card, isSupport);
            });
            container.appendChild(cardElement);
        });
        modal.classList.add('active');
    };

    const selectCard = (slotIndex, card, isSupport = false) => {
        if (isSupport) {
            playerDeck[slotIndex].support = { ...card };
        } else {
            playerDeck[slotIndex].combat = { ...card };
            if (!playerDeck[slotIndex].support)
                playerDeck[slotIndex].support = null;
        }
        saveProgress();
        renderDeck();
        closeCardSelection();
    };

    const closeCardSelection = () => {
        const modal = document.getElementById('card-selection-modal');
        modal.classList.remove('active');
    };

    const startBattle = (battleId) => {
        currentBattle = storyData.flatMap(ch => ch.battles).find(b => b.id === battleId);
        if (!currentBattle) return;

        // Check if player has enough cards to start battle
        const equippedCombatCards = playerDeck.map(slot => slot.combat).filter(Boolean);
        if (equippedCombatCards.length === 0) {
            alert('You must equip at least one combat card to start a battle.');
            return;
        }

        // Check if support deck is equipped properly
        const equippedSupportCards = playerDeck.map(slot => slot.support).slice(0, equippedCombatCards.length);
        if (equippedSupportCards.length !== equippedCombatCards.length) {
            alert('Your support deck must have the same number of cards as your combat deck.');
            return;
        }

        const equippedCombatCardsWithHp = equippedCombatCards.map(card => ({ ...card, currentHp: card.hp }));

        const enemyCards = currentBattle.enemy.cards.map(card => ({ ...card, currentHp: card.hp }));

        battleState = {
            playerCards: equippedCombatCardsWithHp,
            playerSupportCards: equippedSupportCards,
            enemyCards,
            currentTurn: 'player',
            battleLog: [`Battle begins against ${currentBattle.name}!`],
            turnCount: 0,
            abilityStates: {},
            instantWin: false,
            enemyTurnSkip: false
        };

        if (window.CombatLogic) {
            CombatLogic.resetBattleStates(battleState);
        }

        renderBattleScreen();
    };

    const renderBattleScreen = () => {
        const modal = document.getElementById('battle-screen');
        const container = document.getElementById('battle-ui');
        if (!container) return;

        container.innerHTML =
            `<h2 style="color: #fff; text-align: center; margin-bottom: 20px;">${currentBattle?.name || ''}</h2>
            <div class="battle-field">
                <div class="player-side">
                    <h3 style="color: #4caf50;">Your Cards</h3>
                    <div class="battle-cards">
                        ${battleState.playerCards.map((card) =>
                `<div class="battle-card ${card.rarityClass}" style="background-image: url('${card.image}'); ${card.currentHp <= 0 ? 'opacity: 0.3; filter: grayscale(100%);' : ''}">
                                <div class="card-hp" style="color: ${card.currentHp <= 0 ? '#ff4444' : '#4caf50'}">${card.currentHp}/${card.hp}</div>
                            </div>`
            ).join('')}
                    </div>
                    <div style="color: #fff;">Total Power: ${battleState.playerCards.reduce((sum, card) => sum + card.damage, 0)}</div>
                </div>
                <div style="color: #fff; font-size: 2rem;">VS</div>
                <div class="enemy-side">
                    <h3 style="color: #ff6b81;">Enemy Cards</h3>
                    <div class="battle-cards">
                        ${battleState.enemyCards.map((card) =>
                `<div class="battle-card" style="background-image: url('${card.image}'); ${card.currentHp <= 0 ? 'opacity: 0.3; filter: grayscale(100%);' : ''}">
                                <div class="card-hp" style="color: ${card.currentHp <= 0 ? '#ff4444' : '#4caf50'}">${card.currentHp}/${card.hp}</div>
                            </div>`
            ).join('')}
                    </div>
                    <div style="color: #fff;">Total Power: ${battleState.enemyCards.reduce((sum, card) => sum + card.damage, 0)}</div>
                </div>
            </div>
            <div class="battle-log" id="battle-log" style="overflow-y:auto; max-height:150px; color:#fff; font-size:14px; line-height:1.4; padding:10px; background:rgba(0,0,0,0.5); border-radius:10px;">
                ${battleState.battleLog.map(log => `<div>${log}</div>`).join('')}
            </div>
            <div class="battle-actions" style="margin-top:20px; display:flex; justify-content:center; gap:10px;">
                <button class="battle-btn" onclick="StoryMode.attack()" ${battleState.currentTurn !== 'player' ? 'disabled' : ''}>Attack</button>
                <button class="battle-btn" onclick="StoryMode.endBattle()" style="background: #666;">Retreat</button>
            </div>`;
        modal.classList.add('active');
    };

    const attack = () => {
        if (battleState.currentTurn !== 'player') return;
        if (!window.CombatLogic) {
            alert("CombatLogic is not loaded.");
            return;
        }
        const result = CombatLogic.processTurn(battleState);

        battleState = result.battleState;

        if (result.status === 'victory') {
            battleState.battleLog.push('Victory! You defeated all enemies!');
            renderBattleScreen();
            setTimeout(() => completeBattle(), 1500);
            return;
        } else if (result.status === 'defeat') {
            battleState.battleLog.push('Defeat! All your cards have been defeated!');
            renderBattleScreen();
            setTimeout(() => endBattle(), 1500);
            return;
        }

        renderBattleScreen();
    };

    const completeBattle = () => {
        if (!storyProgress.completedBattles.includes(currentBattle.id)) {
            storyProgress.completedBattles.push(currentBattle.id);
            const currentChapterBattles = storyData.find(ch => ch.id === storyProgress.currentChapter)?.battles || [];
            const allCurrentComplete = currentChapterBattles.every(b => storyProgress.completedBattles.includes(b.id));
            if (allCurrentComplete && storyProgress.currentChapter < storyData.length)
                storyProgress.currentChapter++;

            // Unlock Jujutsu Kaisen chapter only if Dragonball storyline is cleared or set selector used
            if (storyProgress.currentChapter === 7) {
                const dragonballCleared = storyProgress.currentChapter > 6;
                const hasSetFocus = window.ItemsSystem && window.ItemsSystem.getActiveEffects().set_focus;
                if (!dragonballCleared && !hasSetFocus) {
                    alert('You must clear the Dragonball storyline or use the Set Selector item to unlock Jujutsu Kaisen storyline.');
                    storyProgress.currentChapter = 6; // revert to last unlocked chapter
                    saveProgress();
                    renderStoryProgress();
                    return;
                }
            }

            if (currentBattle.rewards.items && window.ItemsSystem) {
                currentBattle.rewards.items.forEach(itemId => ItemsSystem.addItem(itemId, 1));
            }
            if (typeof battleState.instantWin === 'boolean' && currentBattle.rewards.experience) {
                storyProgress.playerXP = (storyProgress.playerXP || 0) + currentBattle.rewards.experience;
            }
            updatePlayerLevel();
            saveProgress();
        }
        endBattle();
        renderStoryProgress();
        setTimeout(() => {
            const rewardsText =
                currentBattle.rewards ?
                    ((currentBattle.rewards.items ? `${currentBattle.rewards.items.length} items` : '') +
                        (currentBattle.rewards.experience ? ` ${currentBattle.rewards.experience} XP` : '')).trim() :
                    'Experience';
            alert(`Victory! You earned rewards: ${rewardsText.trim()}`);
        }, 500);
    };

    const updatePlayerLevel = () => {
        const xp = storyProgress.playerXP || 0;
        let level = storyProgress.playerLevel || 1;
        while (xp >= xpForNextLevel(level)) {
            level++;
        }
        if (level !== storyProgress.playerLevel) {
            storyProgress.playerLevel = level;
            localStorage.setItem('playerLevel', level);
            showLevelUpNotification(level);
            if (window.ItemsSystem) {
                ItemsSystem.addLevelRewards(level);
            }
        }
        localStorage.setItem('playerXP', xp);
    };

    const xpForNextLevel = (level) => {
        return 100 * Math.pow(level, 1.5);
    };

    const showLevelUpNotification = (level) => {
        const notif = document.createElement('div');
        notif.textContent = `Level Up! You reached level ${level}!`;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2196f3;
            color: white;
            padding: 15px 30px;
            border-radius: 15px;
            z-index: 4000;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 0 15px #2196f3;
        `;
        document.body.appendChild(notif);
        setTimeout(() => {
            if (notif.parentNode) notif.parentNode.removeChild(notif);
        }, 4000);
    };

    const endBattle = () => {
        const modal = document.getElementById('battle-screen');
        modal.classList.remove('active');
        currentBattle = null;
        battleState = {
            playerCards: [],
            playerSupportCards: [],
            enemyCards: [],
            currentTurn: 'player',
            battleLog: [],
            turnCount: 0,
            abilityStates: {},
            instantWin: false,
            enemyTurnSkip: false
        };
        battleUsageTracker = {};
    };

    const setupDeckHandlers = () => {
        setTimeout(() => {
            const slots = document.querySelectorAll('.deck-slot');
            slots.forEach((slot, index) => {
                slot.replaceWith(slot.cloneNode(true));
                const newSlot = document.querySelector(`.deck-slot[data-slot="${index}"]`);
                newSlot.addEventListener('click', () => {
                    openCardSelection(index, false);
                });

                // Add support card selection button
                const supportBtn = document.createElement('button');
                supportBtn.textContent = 'Select Support';
                supportBtn.style.cssText = 'position: absolute; bottom: 5px; right: 5px; font-size: 10px; padding: 2px 5px; cursor: pointer;';
                supportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openCardSelection(index, true);
                });
                newSlot.style.position = 'relative';
                newSlot.appendChild(supportBtn);
            });
        }, 100);
    };

    return {
        init,
        openCardSelection,
        selectCard,
        closeCardSelection,
        startBattle,
        attack,
        endBattle,
        setupDeckHandlers
    };
})();

window.StoryMode = StoryMode;