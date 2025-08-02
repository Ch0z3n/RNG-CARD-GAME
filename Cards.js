// cards.js
const cardDatabase = [
    {
        id: 1,
        name: "Saibaimen",
        series: "Dragon Ball",
        set: "Frieza Army",
        type: "combat",
        abilityName: "Strength in Numbers",
        abilityText: "For every card you have equipped from \"Frieza Army\" gain 20% damage.",
        damage: 20,
        hp: 40,
        baseRarity: "1 in 2",
        image: "images/cards/saibaimen-card.jpg"  // Updated to use the new path
    },
    {
        id: 2,
        name: "Goku",
        series: "Dragon Ball",
        set: "Z Fighters",
        type: "combat",
        abilityName: "Kamehameha",
        abilityText: "Deal 50% additional damage to enemies with HP below 30%.",
        damage: 40,
        hp: 80,
        baseRarity: "1 in 5",
        image: "images/cards/goku-card.png"  // These will need to be added
    },
    {
        id: 3,
        name: "Vegeta",
        series: "Dragon Ball",
        set: "Z Fighters",
        type: "combat",
        abilityName: "Final Flash",
        abilityText: "20% chance to deal double damage on attack.",
        damage: 40,
        hp: 80,
        baseRarity: "1 in 5",
        image: "images/cards/vegeta-card.png"
    },
    {
        id: 4,
        name: "Frieza",
        series: "Dragon Ball",
        set: "Frieza Army",
        type: "combat",
        abilityName: "Death Ball",
        abilityText: "Deals 15% of target's maximum HP as additional damage.",
        damage: 250,
        hp: 500,
        baseRarity: "1 in 1000",
        image: "images/cards/frieza-card.png"
    },
    {
        id: 5,
        name: "Cell",
        series: "Dragon Ball",
        set: "Androids",
        type: "combat",
        abilityName: "Absorption",
        abilityText: "Heal for 20% of damage dealt. Gain 5 HP for each defeated opponent.",
        damage: 140,
        hp: 360,
        baseRarity: "1 in 100",
        image: "images/cards/cell-card.png"
    },
    {
        id: 6,
        name: "Gohan (Teen)",
        series: "Dragon Ball",
        set: "Z Fighters",
        type: "combat",
        abilityName: "Father-Son Kamehameha",
        abilityText: "When HP drops below 40%, increase damage by 75% for 3 turns.",
        damage: 82,
        hp: 175,
        baseRarity: "1 in 20",
        image: "images/cards/gohan-card.png"
    },
    {
        id: 7,
        name: "Majin Buu",
        series: "Dragon Ball",
        set: "Majin",
        type: "combat",
        abilityName: "Candy Beam",
        abilityText: "15% chance to turn opponent into candy, skipping their next turn.",
        damage: 520,
        hp: 1300,
        baseRarity: "1 in 50000",
        image: "images/cards/buu-card.png"
    },
    {
        id: 8,
        name: "Ultra Instinct Goku",
        series: "Dragon Ball",
        set: "Gods",
        type: "combat",
        abilityName: "Ultra Instinct",
        abilityText: "30% chance to dodge any attack. If a dodge is succesful counter-attacks dealing 150% of this card's damage.",
        damage: 1200,
        hp: 2350,
        baseRarity: "1 in 100000",
        image: "images/cards/ui-goku-card.png"
    },
    {
        id: 11,
        name: "Ultra Ego Vegeta",
        series: "Dragon Ball",
        set: "Gods",
        type: "combat",
        abilityName: "Ultra Ego",
        abilityText: "For every percent of HP missing from this card gain 3% extra damage. If this card survives a fatal attack with 1 HP remaining, attack for 250% of this card's damage.",
        damage: 1300,
        hp: 2150,
        baseRarity: "1 in 100000",
        image: "images/cards/ue-vegeta-card.png"
    },
    {
        id: 9,
        name: "Jiren",
        series: "Dragon Ball",
        set: "Universe 11",
        type: "combat",
        abilityName: "Raw Power",
        abilityText: "Ignore 25% of opponent's defense. Each attack increases damage by 5% (max 50%).",
        damage: 210,
        hp: 420,
        baseRarity: "1 in 3500",
        image: "images/cards/jiren-card.png"
    },
        {
        id: 12,
        name: "Broly",
        series: "Dragon Ball",
        set: "Strongest Saiyan",
        type: "combat",
        abilityName: "Wrathful",
        abilityText: "Gains a 50% damage boost once damage has been taken. (Single-activation)",
        damage: 700,
        hp: 1400,
        baseRarity: "1 in 100000",
        image: "images/cards/broly-card.png"
    },
    {
        id: 13,
        name: "Zeno",
        series: "Dragon Ball",
        set: "Lord of Everything",
        type: "combat",
        abilityName: "I'm bored",
        abilityText: "Has a 1% chance to instantly win the game.",
        damage: 5000,
        hp: 10000,
        baseRarity: "1 in 100000000",
        image: "images/cards/zeno-card.png"
    },
    {
        id: 14,
        name: "Black Frieza",
        series: "Dragon Ball",
        set: "Frieza Army",
        type: "combat",
        abilityName: "Ruthless Blow",
        abilityText: "Deals 30% extra damage every attack and gains ((This card's rarity/Final Enemy Card Rarity)*15)% damage (rounded up) upon entering the field.",
        damage: 900,
        hp: 1800,
        baseRarity: "1 in 600000",
        image: "images/cards/bfrieza-card.png"
    },
    {
        id: 10,
        name: "Piccolo",
        series: "Dragon Ball",
        set: "Z Fighters",
        type: "combat",
        abilityName: "Special Beam Cannon",
        abilityText: "Every two turns deals 20% extra damage on attack.",
        damage: 70,
        hp: 160,
        baseRarity: "1 in 15",
        image: "images/cards/piccolo-card.png"
    },

    {
        id: 1000,
        name: "Healing Drone",
        series: "Dragon Ball",
        set: "Capsule Corp",
        type: "support",
        abilityName: "Heal Boost",
        abilityText: "Heals the attached card for 5% HP each turn.",
        baseRarity: "1 in 2",
        image: "images/cards/healing-drone-card.png"
    },

    {
        id: 1001,
        name: "Senzu Bean",
        series: "Dragon Ball",
        set: "Food",
        type: "support",
        abilityName: "Full Restore",
        abilityText: "Has a 10% chance to completely restore the attached card's HP at the end of a turn.",
        baseRarity: "1 in 10000",
        image: "images/cards/senzubean-card.png"
    },

    {
        id: 1002,
        name: "Dragon Ball",
        series: "Dragon Ball",
        set: "7 Balls of Power",
        type: "support",
        abilityName: "Fraction of Power",
        abilityText: "Upon entering the field the attached card gains one of the three effects: 20% extra attack, 20% extra HP or steals 10% of the enemy's HP and attack.",
        baseRarity: "1 in 1000",
        image: "images/cards/dragonball-card.png"
    },

    {
        id: 1003,
        name: "Shenron",
        series: "Dragon Ball",
        set: "Dragon",
        type: "support",
        abilityName: "Wish",
        abilityText: "Each turn the attached card has a 10% chance to make a wish and gain 50% of the attached card's HP and attack.",
        baseRarity: "1 in 100000",
        image: "images/cards/shenron-card.png"
    },
    
    {
        id: 1004,
        name: "Porunga",
        series: "Dragon Ball",
        set: "Dragon",
        type: "support",
        abilityName: "Strong Wish",
        abilityText: "Each turn the attached card has a 20% chance to make a wish and gain 50% of this card's HP and attack.",
        baseRarity: "1 in 500000",
        image: "images/cards/porunga-card.png"
    },

    {
        id: 1005,
        name: "Potara Earrings",
        series: "Dragon Ball",
        set: "Fuuuuuuusiiiionnnnn!",
        type: "support",
        abilityName: "Fusion",
        abilityText: "If the attached card has 'Goku' or 'Vegeta' in the name and you have another card with the other option of 'Goku' or 'Vegeta' in the name these two cards merge into either 'Gogeta' (If this card has Goku) or 'Vegito' (If this card has Vegeta). (Maintains this attached card's rarity standard, gold or rainbow)",
        baseRarity: "1 in 1000000",
        image: "images/cards/potaraearrings-card.png"
    },

    {
        id: 1006,
        name: "Damage Drone",
        series: "Dragon Ball",
        set: "Capsule Corp",
        type: "support",
        abilityName: "Damage Boost",
        abilityText: "The attached card gains 5% damage each turn.",
        baseRarity: "1 in 50",
        image: "images/cards/damage-drone-card.png"
    },
    {
    id: 1007,
    name: "Ultra Instinct Gogeta",
    series: "Dragon Ball",
    set: "Gods Fusion",
    type: "combat",
    abilityName: "Ultra Fusion",
    abilityText: "Fused state of Ultra Instinct Goku and Vegeta. Massive damage and special abilities.",
    damage: 2000,
    hp: 4000,
    baseRarity: "1 in 1000000",
    image: "images/cards/ui-gogeta-card.png"
},
{
    id: 1008,
    name: "Ultra Ego Vegito",
    series: "Dragon Ball",
    set: "Gods Fusion",
    type: "combat",
    abilityName: "Ultra Ego Fusion",
    abilityText: "Fused state of Ultra Ego Vegeta and Goku. Unmatched power and resilience.",
    damage: 2100,
    hp: 3900,
    baseRarity: "1 in 1000000",
    image: "images/cards/ue-vegito-card.png"
},
{
    id: 1009,
    name: "Gogeta",
    series: "Dragon Ball",
    set: "Fusion Warriors",
    type: "combat",
    abilityName: "Fusion Dance",
    abilityText: "Powerful fusion of Goku and Vegeta with balanced stats and unique abilities.",
    damage: 1200,
    hp: 2400,
    baseRarity: "1 in 100000",
    image: "images/cards/gogeta-card.png"
},
{
    id: 1010,
    name: "Vegito",
    series: "Dragon Ball",
    set: "Fusion Warriors",
    type: "combat",
    abilityName: "Potara Fusion",
    abilityText: "Potara fusion of Goku and Vegeta. High damage output with durable HP.",
    damage: 1400,
    hp: 2800,
    baseRarity: "1 in 100000",
    image: "images/cards/vegito-card.png"
},
// Jujutsu Kaisen Combat Cards

{
    id: 2001,
    name: "Yuji Itadori",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Divergent Fist",
    abilityText: "Deals double damage every third attack.",
    damage: 85,
    hp: 230,
    baseRarity: "1 in 15",
    image: "images/cards/yuji-card.png"
},
{
    id: 2002,
    name: "Megumi Fushiguro",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Shadow Shikigami",
    abilityText: "Summons shikigami to absorb 20% of damage taken.",
    damage: 92,
    hp: 240,
    baseRarity: "1 in 15",
    image: "images/cards/megumi-card.png"
},
{
    id: 2003,
    name: "Nobara Kugisaki",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Straw Doll Technique",
    abilityText: "Has 25% chance to stun the enemy for one turn.",
    damage: 95,
    hp: 220,
    baseRarity: "1 in 20",
    image: "images/cards/nobara-card.png"
},
{
    id: 2004,
    name: "Satoru Gojo",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Infinity",
    abilityText: "30% chance to completely negate damage and counterattack.",
    damage: 255,
    hp: 520,
    baseRarity: "1 in 1000",
    image: "images/cards/gojo-card.png"
},
{
    id: 2005,
    name: "Ryomen Sukuna",
    series: "Jujutsu Kaisen",
    set: "Cursed Spirits",
    type: "combat",
    abilityName: "Malevolent Shrine",
    abilityText: "Deals 30% extra damage and has a 10% chance to instantly defeat enemy.",
    damage: 460,
    hp: 1100,
    baseRarity: "1 in 10000",
    image: "images/cards/sukuna-card.png"
},

{
    id: 2006,
    name: "Hanami",
    series: "Jujutsu Kaisen",
    set: "Cursed Spirits",
    type: "combat",
    abilityName: "Nature's Wrath",
    abilityText: "All attacks ignore 25% defense and deal bleed damage over time.",
    damage: 720,
    hp: 1400,
    baseRarity: "1 in 50000",
    image: "images/cards/hanami-card.png"
},
{
    id: 2007,
    name: "Toji Fushiguro",
    series: "Jujutsu Kaisen",
    set: "Special Grade",
    type: "combat",
    abilityName: "Heavenly Restriction",
    abilityText: "Uncanny reflexes grant additional 50% damage on first attack.",
    damage: 1300,
    hp: 2400,
    baseRarity: "1 in 100000",
    image: "images/cards/toji-card.png"
},
{
    id: 2008,
    name: "Mahito",
    series: "Jujutsu Kaisen",
    set: "Cursed Spirits",
    type: "combat",
    abilityName: "Idle Death Gamble",
    abilityText: "10% chance to reshape enemy HP to 1, bypassing defense.",
    damage: 1500,
    hp: 2800,
    baseRarity: "1 in 100000",
    image: "images/cards/mahito-card.png"
},
{
    id: 2009,
    name: "Geto Suguru",
    series: "Jujutsu Kaisen",
    set: "Special Grade",
    type: "combat",
    abilityName: "Cursed Spirit Command",
    abilityText: "Summons random cursed spirit with every attack.",
    damage: 1800,
    hp: 3700,
    baseRarity: "1 in 200000",
    image: "images/cards/geto-card.png"
},

{
    id: 2010,
    name: "Domain Expansion Yuji",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Black Flash",
    abilityText: "Increases damage by 200% on next attack after hit.",
    damage: 2300,
    hp: 3200,
    baseRarity: "1 in 1000000",
    image: "images/cards/domain-yuji-card.png"
},

{
    id: 2001,
    name: "Yuji Itadori",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Divergent Fist",
    abilityText: "Deals double damage every third attack.",
    damage: 85,
    hp: 230,
    baseRarity: "1 in 15",
    image: "images/cards/yuji-card.png"
},
{
    id: 2002,
    name: "Megumi Fushiguro",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Shadow Shikigami",
    abilityText: "Summons shikigami to absorb 20% of damage taken.",
    damage: 92,
    hp: 240,
    baseRarity: "1 in 15",
    image: "images/cards/megumi-card.png"
},
{
    id: 2003,
    name: "Nobara Kugisaki",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Straw Doll Technique",
    abilityText: "Has 25% chance to stun the enemy for one turn.",
    damage: 95,
    hp: 220,
    baseRarity: "1 in 20",
    image: "images/cards/nobara-card.png"
},
{
    id: 2004,
    name: "Satoru Gojo",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Sorcerers",
    type: "combat",
    abilityName: "Infinity",
    abilityText: "30% chance to completely negate damage and counterattack.",
    damage: 255,
    hp: 520,
    baseRarity: "1 in 1000",
    image: "images/cards/gojo-card.png"
},
{
    id: 2005,
    name: "Ryomen Sukuna",
    series: "Jujutsu Kaisen",
    set: "Cursed Spirits",
    type: "combat",
    abilityName: "Malevolent Shrine",
    abilityText: "Deals 30% extra damage and has a 10% chance to instantly defeat enemy.",
    damage: 460,
    hp: 1100,
    baseRarity: "1 in 10000",
    image: "images/cards/sukuna-card.png"
},
{
    id: 3001,
    name: "Nodrama",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Support",
    type: "support",
    abilityName: "Protective Shield",
    abilityText: "Reduces incoming damage by 10% for attached card.",
    baseRarity: "1 in 20",
    image: "images/cards/nodrama-card.png"
},
{
    id: 3002,
    name: "Echo Pope",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Support",
    type: "support",
    abilityName: "Healing Wave",
    abilityText: "Heals attached card for 8% HP each turn.",
    baseRarity: "1 in 100",
    image: "images/cards/echo-card.png"
},
{
    id: 3003,
    name: "Inumaki's Cursed Speech",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Support",
    type: "support",
    abilityName: "Silence",
    abilityText: "15% chance to silence enemy cards’ abilities for one turn.",
    baseRarity: "1 in 500",
    image: "images/cards/inumaki-card.png"
},
{
    id: 3004,
    name: "Geto's Spirit",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Support",
    type: "support",
    abilityName: "Cursed Chain",
    abilityText: "Boosts damage of all your cursed spirit cards by 20%.",
    baseRarity: "1 in 1000",
    image: "images/cards/geto-spirit-card.png"
},
{
    id: 3005,
    name: "Tengen",
    series: "Jujutsu Kaisen",
    set: "Jujutsu Support",
    type: "support",
    abilityName: "Immortal Barrier",
    abilityText: "Attached card regenerates 5% HP every turn and nullifies one fatal attack.",
    baseRarity: "1 in 3000",
    image: "images/cards/tengen-card.png"
}
];

let playerCards = [];

// cards.js

// Helper to extract rarity number from rarity string like "1 in 5000"
const extractRarityValue = (rarityString) => {
    if (typeof rarityString !== 'string') return 0;
    const match = rarityString.match(/1 in (\d+)/);
    if (match && match[1]) {
        const val = parseInt(match[1], 10);
        return isNaN(val) ? 0 : val;
    }
    return 0;
};

const rarityExponent = 0.7; // Adjust this for balancing

function generateCard(baseCardId) {
    if (baseCardId !== undefined) {
        // Generate specific card by ID or random if no id given
        const supportCards = cardDatabase.filter(c => c.type === 'support');
        const combatCards = cardDatabase.filter(c => !c.type || c.type === 'combat');

        if (baseCardId === null) {
            // Pick random if baseCardId null or not passed explicitly
            if (supportCards.length > 0 && Math.random() < 0.15) {
                baseCardId = supportCards[Math.floor(Math.random() * supportCards.length)].id;
            } else if (combatCards.length > 0) {
                baseCardId = combatCards[Math.floor(Math.random() * combatCards.length)].id;
            } else {
                return null;
            }
        }

        const baseCard = cardDatabase.find(c => c.id === baseCardId);
        if (!baseCard) return null;

        const cardCopy = { ...baseCard };
        cardCopy.instanceId = Date.now() + Math.floor(Math.random() * 1000);

        if (cardCopy.type !== 'support') {
            // Combat cards: apply rarity upgrades based on random roll
            const randomValue = Math.random();

            if (randomValue < 0.0025) {
                cardCopy.rarityClass = 'rarity-rainbow';
                cardCopy.damage = Math.floor(cardCopy.damage * 10);
                cardCopy.hp = Math.floor(cardCopy.hp * 10);
                const originalRarity = extractRarityValue(cardCopy.baseRarity);
                cardCopy.rarity = `1 in ${originalRarity * 10}`;
                cardCopy.displayName = `Rainbow ${cardCopy.name}`;
            } else if (randomValue < 0.0125) {
                cardCopy.rarityClass = 'rarity-gold';
                cardCopy.damage = Math.floor(cardCopy.damage * 3);
                cardCopy.hp = Math.floor(cardCopy.hp * 3);
                const originalRarity = extractRarityValue(cardCopy.baseRarity);
                cardCopy.rarity = `1 in ${originalRarity * 3}`;
                cardCopy.displayName = `Gold ${cardCopy.name}`;
            } else {
                cardCopy.rarityClass = 'rarity-standard';
                cardCopy.rarity = cardCopy.baseRarity;
                cardCopy.displayName = cardCopy.name;
            }
        } else {
            // Support cards: no rarity upgrades
            cardCopy.rarityClass = 'rarity-standard';
            cardCopy.rarity = cardCopy.baseRarity;
            cardCopy.displayName = cardCopy.name;
        }

        return cardCopy;
    }

    // No baseCardId: weighted random selection among combat cards only
    const activeEffects = window.ItemsSystem ? window.ItemsSystem.getActiveEffects() : null;
    const combatCards = cardDatabase.filter(card => card.type !== 'support');

    let totalWeight = 0;
    const weightedCards = combatCards.map(card => {
        const rarityVal = extractRarityValue(card.baseRarity);
        const safeRarity = rarityVal > 0 ? rarityVal : 1;
        let weight = 1 / Math.pow(safeRarity, rarityExponent);

        // Apply card luck boost multiplier if active
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

    // Fallback, pick first card if any
    return generateCard(combatCards.length ? combatCards[0].id : null);
}

window.generateCard = generateCard;

function savePlayerCards() {
    localStorage.setItem('playerCards', JSON.stringify(playerCards));
}

function loadPlayerCards() {
    const saved = localStorage.getItem('playerCards');
    if (saved) playerCards = JSON.parse(saved);
}

function renderCards(filterType = 'all', filterValue = 'all') {
    const container = document.getElementById('card-container');
    if (!container) return;
    container.innerHTML = '';

    let cardsToShow = cardDatabase;
    if (filterType !== 'all' && filterValue !== 'all') {
        if (filterType === 'series') cardsToShow = cardDatabase.filter(c => c.series === filterValue);
        else if (filterType === 'set') cardsToShow = cardDatabase.filter(c => c.set === filterValue);
    }

    cardsToShow.sort((a,b) => {
        const ra = parseInt(a.baseRarity.split(' in ')[1]);
        const rb = parseInt(b.baseRarity.split(' in ')[1]);
        return rb - ra;
    });

    const ownedCardsMap = new Map();
    for (const card of playerCards) {
        if (!ownedCardsMap.has(card.id)) {
            ownedCardsMap.set(card.id, {
                card,
                count: 0,
                rarityCounts: { standard: 0, gold: 0, rainbow: 0 }
            });
        }
        const data = ownedCardsMap.get(card.id);
        data.count++;
        if (card.rarityClass === 'rarity-rainbow') data.rarityCounts.rainbow++;
        else if (card.rarityClass === 'rarity-gold') data.rarityCounts.gold++;
        else data.rarityCounts.standard++;
    }

    cardsToShow.forEach(baseCard => {
        const cardElement = document.createElement('div');
        const isOwned = ownedCardsMap.has(baseCard.id);
        const ownedData = isOwned ? ownedCardsMap.get(baseCard.id) : null;
        const displayCard = isOwned ? ownedData.card : baseCard;

        const typeClass = displayCard.type === 'support' ? 'support-card' : '';
        cardElement.className = `card ${isOwned ? displayCard.rarityClass : 'rarity-standard locked'} ${typeClass}`;
        cardElement.dataset.cardId = baseCard.id;
        cardElement.dataset.damage = displayCard.damage;
        cardElement.dataset.hp = displayCard.hp;

        cardElement.classList.add('no-image');

        const img = new Image();
        img.onload = () => {
            cardElement.style.backgroundImage = `url('${displayCard.image}')`;
            cardElement.classList.remove('no-image');
        };
        img.onerror = () => { };
        img.src = displayCard.image;

        let quantityBadge = '';
        if (isOwned && ownedData.count > 1) {
            quantityBadge = `<div class="card-quantity">${ownedData.count}</div>`;
        }

        let rarityBadge = '';
        if (isOwned) {
            const counts = ownedData.rarityCounts;
            const parts = [];
            if (counts.standard) parts.push(`Std: ${counts.standard}`);
            if (counts.gold) parts.push(`Gold: ${counts.gold}`);
            if (counts.rainbow) parts.push(`Rainbow: ${counts.rainbow}`);
            rarityBadge = `<div class="card-rarity-counts" style="font-size: 12px; color: #ffe; margin-bottom: 6px;">${parts.join(' | ')}</div>`;
        }

        cardElement.innerHTML = `
            ${quantityBadge}
            ${rarityBadge}
            <div class="card-series" style="font-size: 10px; color: #aaa; margin-bottom: 2px;">${displayCard.series}</div>
            <div class="card-set">${displayCard.set}</div>
            <h2 class="card-name">${isOwned ? displayCard.displayName : baseCard.name}</h2>
            <div class="ability-name">${displayCard.abilityName}</div>
            <div class="ability">${displayCard.abilityText}</div>
            <div class="bottom-info">
                <div class="damage outlined-text">⚔️ ${displayCard.damage}</div>
                <div class="hitpoints outlined-text">💚 ${displayCard.hp}</div>
                <div class="rarity-label">${isOwned ? displayCard.rarity : baseCard.baseRarity}</div>
            </div>
        `;

        container.appendChild(cardElement);
    });
}

function filterBy(filterType, filterValue) {
    renderCards(filterType, filterValue);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPlayerCards();
    renderCards();
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const fType = btn.dataset.filterType || 'set';
                const fValue = btn.dataset.value || btn.dataset.set || 'all';
                filterBy(fType, fValue);
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
});

window.generateCard = generateCard;
window.renderCards = renderCards;
window.filterBy = filterBy;
window.playerCards = playerCards;
window.cardDatabase = cardDatabase;