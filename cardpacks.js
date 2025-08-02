// Card Pack Opening System
const CardPacks = (() => {
    // Pack types based on the rarity rolled
    const PACK_TYPES = {
        basic: {
            name: 'Basic Pack',
            image: 'images/packs/basic-pack.png',  // corrected folder name to lowercase 'packs'
            rarityRange: [0, 499]  // Anything below 500
        },
        lucky: {
            name: 'Lucky Pack',
            image: 'images/packs/lucky-pack.png',
            rarityRange: [500, 4999]  // 500-5000
        },
        superLucky: {
            name: 'Super Lucky Pack',
            image: 'images/packs/super-lucky-pack.png',
            rarityRange: [5000, 49999]  // 5000-50000
        },
        ultraLucky: {
            name: 'Ultra Lucky Pack',
            image: 'images/packs/ultra-lucky-pack.png',
            rarityRange: [50000, 999999]  // 50000-999999
        },
        secret: {
            name: 'Secret Pack',
            image: 'images/packs/secret-pack.png',
            rarityRange: [1000000, Infinity]  // 1000000+
        }
    };

    // Determine pack type based on card rarity value
    const determinePackType = (rarityValue) => {
        for (const [type, packInfo] of Object.entries(PACK_TYPES)) {
            const [min, max] = packInfo.rarityRange;
            if (rarityValue >= min && rarityValue <= max) {
                return type;
            }
        }
        // Fallback to basic pack
        return 'basic';
    };

// Extract numeric rarity value from rarity string (e.g., "1 in 5000" -> 5000)
const extractRarityValue = (rarityString) => {
    if (typeof rarityString !== 'string') return 0;
    const match = rarityString.match(/1 in (\d+)/);
    if (match && match[1]) {
        const val = parseInt(match[1], 10);
        return isNaN(val) ? 0 : val;
    }
    return 0;
};

// Open a card pack
const openPack = async () => {
    if (!window.generateCard || typeof window.generateCard !== 'function') {
    console.error("generateCard function not available");
    return { card: null, packType: 'basic' };
    }
    try {
        // Check for active item effects
        const activeEffects = ItemsSystem ? ItemsSystem.getActiveEffects() : null;
        let newCard;

        // Apply rarity guarantee if active
        if (activeEffects && activeEffects.card_guarantee && activeEffects.card_guarantee.remaining > 0) {
            const guaranteedRarityThreshold = activeEffects.card_guarantee.rarityThreshold;
            newCard = generateCard();

            if (newCard) {
                const cardRarityValue = extractRarityValue(newCard.baseRarity);
                if (cardRarityValue < guaranteedRarityThreshold) {
                    // Upgrade card rarity to meet guarantee
                    if (guaranteedRarityThreshold >= 10000) {
                        newCard.rarityClass = 'rarity-rainbow';
                        newCard.damage = Math.floor(newCard.damage * 10);
                        newCard.hp = Math.floor(newCard.hp * 10);
                        newCard.rarity = `1 in ${extractRarityValue(newCard.baseRarity) * 10}`;
                        newCard.displayName = `Rainbow ${newCard.name}`;
                    } else if (guaranteedRarityThreshold >= 1000) {
                        newCard.rarityClass = 'rarity-gold';
                        newCard.damage = Math.floor(newCard.damage * 3);
                        newCard.hp = Math.floor(newCard.hp * 3);
                        newCard.rarity = `1 in ${extractRarityValue(newCard.baseRarity) * 3}`;
                        newCard.displayName = `Gold ${newCard.name}`;
                    }
                }
                // Decrement uses and clear effect if none remain
                activeEffects.card_guarantee.remaining--;
                if (activeEffects.card_guarantee.remaining <= 0) {
                    activeEffects.card_guarantee = null;
                }
            }
        } else if (activeEffects && activeEffects.rarity_guarantee && activeEffects.rarity_guarantee.remaining > 0) {
            const guaranteedRarity = activeEffects.rarity_guarantee.rarity;
            newCard = generateCard(); // Generate base card first

            if (newCard) {
                // Apply guaranteed rarity effects
                if (guaranteedRarity === 'gold') {
                    newCard.rarityClass = 'rarity-gold';
                    newCard.damage = Math.floor(newCard.damage * 3);
                    newCard.hp = Math.floor(newCard.hp * 3);
                    const originalRarity = extractRarityValue(newCard.baseRarity);
                    newCard.rarity = `1 in ${originalRarity * 3}`;
                    newCard.displayName = `Gold ${newCard.name}`;
                } else if (guaranteedRarity === 'rainbow') {
                    newCard.rarityClass = 'rarity-rainbow';
                    newCard.damage = Math.floor(newCard.damage * 10);
                    newCard.hp = Math.floor(newCard.hp * 10);
                    const originalRarity = extractRarityValue(newCard.baseRarity);
                    newCard.rarity = `1 in ${originalRarity * 10}`;
                    newCard.displayName = `Rainbow ${newCard.name}`;
                }
                // Decrement uses and clear effect if none remain
                activeEffects.rarity_guarantee.remaining--;
                if (activeEffects.rarity_guarantee.remaining <= 0) {
                    activeEffects.rarity_guarantee = null;
                }
            }
        } else {
            // Normal generation
            newCard = generateCard();

            if (newCard && activeEffects && activeEffects.luck_boost && activeEffects.luck_boost.remaining > 0) {
                const luckMultiplier = activeEffects.luck_boost.multiplier;
                const originalRandom = Math.random();
                const boostedRandom = originalRandom / luckMultiplier;

                if (boostedRandom < 0.0025 && newCard.rarityClass === 'rarity-standard') {
                    // Upgrade to rainbow
                    newCard.rarityClass = 'rarity-rainbow';
                    newCard.damage = Math.floor(newCard.damage * 10);
                    newCard.hp = Math.floor(newCard.hp * 10);
                    const originalRarity = extractRarityValue(newCard.baseRarity);
                    newCard.rarity = `1 in ${originalRarity * 10}`;
                    newCard.displayName = `Rainbow ${newCard.name}`;
                } else if (boostedRandom < 0.0125 && newCard.rarityClass === 'rarity-standard') {
                    // Upgrade to gold
                    newCard.rarityClass = 'rarity-gold';
                    newCard.damage = Math.floor(newCard.damage * 3);
                    newCard.hp = Math.floor(newCard.hp * 3);
                    const originalRarity = extractRarityValue(newCard.baseRarity);
                    newCard.rarity = `1 in ${originalRarity * 3}`;
                    newCard.displayName = `Gold ${newCard.name}`;
                }
            }
        }

        if (!newCard) throw new Error('Failed to generate card');

        // Debug logs for rarity and pack type
        console.log("Generated card:", newCard.name, "rarity:", newCard.rarity, "rarityClass:", newCard.rarityClass);
        const rarityValue = extractRarityValue(newCard.rarity);
        console.log("Extracted rarity value:", rarityValue);
        const packType = determinePackType(rarityValue);
        console.log("Determined pack type:", packType);

        // Add card to user's collection
        playerCards.push(newCard);
        savePlayerCards();

        // Decrease item effect durations
        if (ItemsSystem) {
            ItemsSystem.decreaseEffectDurations();
        }

        return {
            card: newCard,
            packType: packType
        };
    } catch (error) {
        console.error('Failed to open pack:', error);
        return {
            card: null,
            packType: 'basic'
        };
    }
};

// Display pack opening animation and results
const showPackOpeningAnimation = (result) => {
    const { card, packType } = result;
    if (!card) return;

    const packInfo = PACK_TYPES[packType];
    const packOpeningContainer = document.getElementById('pack-opening-container');
    if (!packOpeningContainer) {
        console.error("Pack opening container not found!");
        return;
    }

    // Clear previous content and show container
    packOpeningContainer.innerHTML = '';
    packOpeningContainer.classList.add('active');

    // Create pack title
    const packTitle = document.createElement('h2');
    packTitle.textContent = `You got a ${packInfo.name}!`;
    packTitle.className = 'pack-title';
    packOpeningContainer.appendChild(packTitle);

    // Create pack animation container
    const packAnimation = document.createElement('div');
    packAnimation.className = 'pack-animation';
    packOpeningContainer.appendChild(packAnimation);

    // Create pack visual
    const packVisual = document.createElement('div');
    packVisual.className = 'pack-visual';

    // Load pack image or fallback text
    const packImg = new Image();
    packImg.onload = () => {
        packVisual.style.backgroundImage = `url('${packInfo.image}')`;
        packVisual.style.backgroundSize = 'cover';
        packVisual.style.backgroundPosition = 'center';
    };
    packImg.onerror = () => {
        packVisual.textContent = packInfo.name;
        packVisual.style.fontSize = '18px';
        packVisual.style.fontWeight = 'bold';
        packVisual.style.color = '#fff';
    };
    packImg.src = packInfo.image;

    // Add click instruction
    const instruction = document.createElement('p');
    instruction.textContent = 'Click the pack to open it!';
    instruction.style.color = '#fff';
    instruction.style.fontSize = '18px';
    instruction.style.marginTop = '20px';

    packAnimation.appendChild(packVisual);
    packAnimation.appendChild(instruction);

    // Create revealed card element (hidden initially)
    const revealedCard = document.createElement('div');
    revealedCard.className = `revealed-card ${card.rarityClass}`;

    // Load card image
    const cardImg = new Image();
    cardImg.onload = () => {
        revealedCard.style.backgroundImage = `url('${card.image}')`;
    };
    cardImg.onerror = () => {
        revealedCard.style.backgroundColor = '#333';
    };
    cardImg.src = card.image;

    revealedCard.innerHTML = `
        <div class="card-set">${card.set}</div>
        <h2 class="card-name">${card.displayName}</h2>
        <div class="ability-name">${card.abilityName}</div>
        <div class="ability">${card.abilityText}</div>
        <div class="bottom-info">
            <div class="damage outlined-text">⚔️ ${card.damage}</div>
            <div class="hitpoints outlined-text">💚 ${card.hp}</div>
            <div class="rarity-label">${card.rarity}</div>
        </div>
    `;

    packOpeningContainer.appendChild(revealedCard);

    // Create close button (hidden initially)
    const closeButton = document.createElement('button');
    closeButton.className = 'close-pack-btn';
    closeButton.textContent = 'Close';
    closeButton.style.display = 'none';
    closeButton.addEventListener('click', () => {
        packOpeningContainer.classList.remove('active');
        renderCards(); // Update card display after closing pack
    });
    packOpeningContainer.appendChild(closeButton);

    // Pack click handler
    packVisual.addEventListener('click', () => {
        packVisual.classList.add('opening');
        instruction.style.opacity = '0';

        setTimeout(() => {
            packAnimation.style.display = 'none';
            revealedCard.classList.add('show');
            closeButton.style.display = 'block';
        }, 1000);
    });
};

    // Initialize pack opening buttons on the Packs tab
    const initPackButtons = () => {
        const packButton = document.createElement('button');
        packButton.className = 'open-pack-btn';
        packButton.textContent = 'Open a Pack';
        packButton.addEventListener('click', async () => {
            const result = await openPack();
            showPackOpeningAnimation(result);
        });

        // Replace contents of .packs-container with the single pack open button
        const packsContainer = document.querySelector('.packs-container');
        if (packsContainer) {
            packsContainer.innerHTML = '';
            packsContainer.appendChild(packButton);
        }
    };

    return {
        openPack,
        showPackOpeningAnimation,
        initPackButtons,
        PACK_TYPES
    };
})();