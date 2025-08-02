// Admin System
const AdminSystem = (() => {
    let isAdmin = false;

    // Initialize admin system
    const init = (username) => {
        isAdmin = username === 'Admin';
        
        if (isAdmin) {
            // Show admin panel
            document.querySelector('.admin-only').style.display = 'block';
            setupAdminInterface();
            logToConsole('Admin privileges enabled for user: ' + username, 'info');
        } else {
            // Hide admin panel
            document.querySelector('.admin-only').style.display = 'none';
        }
    };

    // Setup admin interface
    const setupAdminInterface = () => {
        populateUserSelects();
        populateItemSelect();
        populateCardSelect();
        logToConsole('Admin interface initialized', 'info');
    };

    // Log message to admin console
    const logToConsole = (message, type = 'info') => {
        const console = document.getElementById('admin-console-output');
        if (!console) return;

        const timestamp = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = `[${timestamp}] ${message}`;
        
        console.appendChild(line);
        console.scrollTop = console.scrollHeight;
    };

    // Populate user select dropdowns
    const populateUserSelects = () => {
        const users = JSON.parse(localStorage.getItem('gameUsers') || '{}');
        const userSelects = [
            document.getElementById('admin-target-user'),
            document.getElementById('admin-reset-user')
        ];

        userSelects.forEach(select => {
            if (!select) return;
            select.innerHTML = '<option value="">Select User...</option>';
            
            Object.keys(users).forEach(username => {
                const option = document.createElement('option');
                option.value = username;
                option.textContent = username + (username === 'Admin' ? ' (You)' : '');
                select.appendChild(option);
            });
        });
    };

    // Populate item select
    const populateItemSelect = () => {
        const select = document.getElementById('admin-item-select');
        if (!select || !window.ItemsSystem) return;

        select.innerHTML = '<option value="">Select Item...</option>';
        
        // Access items from ItemsSystem (we'll need to expose the items database)
        const items = [
            {id: 1, name: "Minor Luck Potion"},
            {id: 2, name: "Major Luck Potion"},
            {id: 3, name: "Supreme Luck Elixir"},
            {id: 4, name: "Golden Dust"},
            {id: 5, name: "Rainbow Crystal"},
            {id: 6, name: "Rarity Amplifier"},
            {id: 7, name: "Pack Bundle"},
            {id: 8, name: "Mega Pack Bundle"},
            {id: 9, name: "Ultimate Pack Crate"},
            {id: 10, name: "Card Reroll Token"},
            {id: 11, name: "Set Booster"},
            {id: 12, name: "Rare Card Magnet"},
            {id: 13, name: "Legendary Card Seeker"},
            {id: 14, name: "Mythic Card Beacon"},
            {id: 15, name: "Ultimate Card Catalyst"},
            {id: 16, name: "Guaranteed Legend Token"},
            {id: 17, name: "Mythic Guarantee Scroll"}
        ];

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
        });
    };

    // Populate card select
    const populateCardSelect = () => {
        const select = document.getElementById('admin-card-select');
        if (!select || !window.cardDatabase) return;

        select.innerHTML = '<option value="">Select Card...</option>';
        
        window.cardDatabase.forEach(card => {
            const option = document.createElement('option');
            option.value = card.id;
            option.textContent = card.name + ' (' + card.set + ')';
            select.appendChild(option);
        });
    };

    // Show all users
    const showAllUsers = () => {
        const users = JSON.parse(localStorage.getItem('gameUsers') || '{}');
        const display = document.getElementById('admin-user-display');
        
        if (Object.keys(users).length === 0) {
            display.innerHTML = '<p>No users found.</p>';
            return;
        }

        let html = '<h4>All Registered Users:</h4>';
        Object.values(users).forEach(user => {
            const userData = localStorage.getItem(`gameData_${user.username}`);
            const gameData = userData ? JSON.parse(userData) : null;
            
            html += `
                <div class="user-card">
                    <h4>${user.username}</h4>
                    <p>Email: ${user.email}</p>
                    <p>Joined: ${new Date(user.joinDate).toLocaleDateString()}</p>
                    <p>Cards: ${gameData ? gameData.playerCards.length : 0}</p>
                    <p>Story Progress: Chapter ${gameData ? gameData.storyProgress.currentChapter : 1}</p>
                </div>
            `;
        });

        display.innerHTML = html;
        logToConsole(`Displayed ${Object.keys(users).length} users`);
    };

    // Show user search interface
    const showUserSearch = () => {
        const display = document.getElementById('admin-user-display');
        display.innerHTML = `
            <div style="margin-bottom: 15px;">
                <input type="text" id="user-search-input" placeholder="Enter username..." 
                       style="padding: 8px; border-radius: 5px; border: none; margin-right: 10px;">
                <button onclick="AdminSystem.searchUser()" class="admin-btn">Search</button>
            </div>
            <div id="search-results"></div>
        `;
    };

    // Search for specific user
    const searchUser = () => {
        const searchInput = document.getElementById('user-search-input');
        const resultsDiv = document.getElementById('search-results');
        const username = searchInput.value.trim();

        if (!username) {
            resultsDiv.innerHTML = '<p style="color: #ff6b6b;">Please enter a username</p>';
            return;
        }

        const users = JSON.parse(localStorage.getItem('gameUsers') || '{}');
        const user = users[username];

        if (!user) {
            resultsDiv.innerHTML = '<p style="color: #ff6b6b;">User not found</p>';
            logToConsole(`User search failed: ${username}`, 'warning');
            return;
        }

        const userData = localStorage.getItem(`gameData_${username}`);
        const gameData = userData ? JSON.parse(userData) : null;

        resultsDiv.innerHTML = `
            <div class="user-card">
                <h4>${user.username}</h4>
                <p>Email: ${user.email}</p>
                <p>Joined: ${new Date(user.joinDate).toLocaleDateString()}</p>
                <p>Cards Owned: ${gameData ? gameData.playerCards.length : 0}</p>
                <p>Items: ${gameData ? Object.keys(gameData.playerItems).length : 0}</p>
                <p>Story Progress: Chapter ${gameData ? gameData.storyProgress.currentChapter : 1}</p>
                <p>Battles Completed: ${gameData ? gameData.storyProgress.completedBattles.length : 0}</p>
                <p>Last Saved: ${gameData ? new Date(gameData.lastSaved).toLocaleString() : 'Never'}</p>
            </div>
        `;

        logToConsole(`User details displayed: ${username}`);
    };

    // Show game statistics
    const showGameStats = () => {
        const users = JSON.parse(localStorage.getItem('gameUsers') || '{}');
        const display = document.getElementById('admin-user-display');
        
        let totalCards = 0;
        let totalItems = 0;
        let activeUsers = 0;
        let completedStory = 0;

        Object.keys(users).forEach(username => {
            const userData = localStorage.getItem(`gameData_${username}`);
            if (userData) {
                const gameData = JSON.parse(userData);
                totalCards += gameData.playerCards.length;
                totalItems += Object.values(gameData.playerItems).reduce((sum, count) => sum + count, 0);
                
                if (gameData.lastSaved) {
                    const lastSave = new Date(gameData.lastSaved);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    if (lastSave > weekAgo) activeUsers++;
                }
                
                if (gameData.storyProgress.currentChapter >= 6) completedStory++;
            }
        });

        display.innerHTML = `
            <h4>📊 Game Statistics</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                <div style="background: rgba(76, 175, 80, 0.1); padding: 15px; border-radius: 8px;">
                    <h5 style="color: #4caf50;">Total Users</h5>
                    <p style="font-size: 24px; font-weight: bold;">${Object.keys(users).length}</p>
                </div>
                <div style="background: rgba(33, 150, 243, 0.1); padding: 15px; border-radius: 8px;">
                    <h5 style="color: #2196f3;">Active Users (7 days)</h5>
                    <p style="font-size: 24px; font-weight: bold;">${activeUsers}</p>
                </div>
                <div style="background: rgba(255, 152, 0, 0.1); padding: 15px; border-radius: 8px;">
                    <h5 style="color: #ff9800;">Total Cards</h5>
                    <p style="font-size: 24px; font-weight: bold;">${totalCards}</p>
                </div>
                <div style="background: rgba(156, 39, 176, 0.1); padding: 15px; border-radius: 8px;">
                    <h5 style="color: #9c27b0;">Story Completed</h5>
                    <p style="font-size: 24px; font-weight: bold;">${completedStory}</p>
                </div>
            </div>
        `;

        logToConsole('Game statistics displayed');
    };

    // Give item to user
    const giveItem = () => {
        const username = document.getElementById('admin-target-user').value;
        const itemId = parseInt(document.getElementById('admin-item-select').value);
        const quantity = parseInt(document.getElementById('admin-item-quantity').value) || 1;

        if (!username || !itemId) {
            logToConsole('Please select both user and item', 'error');
            return;
        }

        const userDataKey = `gameData_${username}`;
        const userData = localStorage.getItem(userDataKey);
        
        if (!userData) {
            logToConsole(`User data not found: ${username}`, 'error');
            return;
        }

        const gameData = JSON.parse(userData);
        
        if (!gameData.playerItems[itemId]) {
            gameData.playerItems[itemId] = 0;
        }
        gameData.playerItems[itemId] += quantity;
        
        localStorage.setItem(userDataKey, JSON.stringify(gameData));
        
        // Update localStorage for current user if it's them
        if (username === Auth.getCurrentUser()?.username) {
            localStorage.setItem('playerItems', JSON.stringify(gameData.playerItems));
            
            // Force reload of items system data and re-render
            if (window.ItemsSystem) {
                // Update the internal player items state
                window.ItemsSystem.loadPlayerItems();
                window.ItemsSystem.renderItems();
            }
        }

        logToConsole(`Gave ${quantity}x Item #${itemId} to ${username}`);
    };

    // Give card to user
    const giveCard = () => {
        const username = document.getElementById('admin-target-user').value;
        const cardId = parseInt(document.getElementById('admin-card-select').value);
        const rarity = document.getElementById('admin-card-rarity').value;
        const quantity = parseInt(document.getElementById('admin-card-quantity').value) || 1;

        if (!username || !cardId) {
            logToConsole('Please select both user and card', 'error');
            return;
        }

        const userDataKey = `gameData_${username}`;
        const userData = localStorage.getItem(userDataKey);
        
        if (!userData) {
            logToConsole(`User data not found: ${username}`, 'error');
            return;
        }

        const gameData = JSON.parse(userData);
        const baseCard = window.cardDatabase.find(c => c.id === cardId);
        
        if (!baseCard) {
            logToConsole(`Card not found: ${cardId}`, 'error');
            return;
        }

        for (let i = 0; i < quantity; i++) {
            const card = {...baseCard};
            card.instanceId = Date.now() + Math.floor(Math.random() * 1000) + i;
            
            // Apply rarity
            if (rarity === 'gold') {
                card.rarityClass = 'rarity-gold';
                card.damage = Math.floor(card.damage * 3);
                card.hp = Math.floor(card.hp * 3);
                const originalRarity = parseInt(card.baseRarity.split(' in ')[1]);
                card.rarity = `1 in ${originalRarity * 3}`;
                card.displayName = `Gold ${card.name}`;
            } else if (rarity === 'rainbow') {
                card.rarityClass = 'rarity-rainbow';
                card.damage = Math.floor(card.damage * 10);
                card.hp = Math.floor(card.hp * 10);
                const originalRarity = parseInt(card.baseRarity.split(' in ')[1]);
                card.rarity = `1 in ${originalRarity * 10}`;
                card.displayName = `Rainbow ${card.name}`;
            } else {
                card.rarityClass = 'rarity-standard';
                card.rarity = card.baseRarity;
                card.displayName = card.name;
            }
            
            gameData.playerCards.push(card);
        }
        
        localStorage.setItem(userDataKey, JSON.stringify(gameData));
        
        // Update current user if it's them
        if (username === Auth.getCurrentUser()?.username) {
            localStorage.setItem('playerCards', JSON.stringify(gameData.playerCards));
            if (window.renderCards) renderCards();
        }

        logToConsole(`Gave ${quantity}x ${rarity} ${baseCard.name} to ${username}`);
    };

    // Reset user data
    const resetUserData = () => {
        const username = document.getElementById('admin-reset-user').value;
        
        if (!username) {
            logToConsole('Please select a user to reset', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to reset ALL data for ${username}? This cannot be undone!`)) {
            return;
        }

        const userDataKey = `gameData_${username}`;
        const initialData = {
            playerCards: [],
            playerItems: {},
            activeEffects: {},
            storyProgress: { currentChapter: 1, completedBattles: [] },
            playerDeck: [null, null, null],
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem(userDataKey, JSON.stringify(initialData));
        
        // If it's the current user, update their session
        if (username === Auth.getCurrentUser()?.username) {
            localStorage.setItem('playerCards', JSON.stringify([]));
            localStorage.setItem('playerItems', JSON.stringify({}));
            localStorage.setItem('activeEffects', JSON.stringify({}));
            localStorage.setItem('storyProgress', JSON.stringify({ currentChapter: 1, completedBattles: [] }));
            localStorage.setItem('playerDeck', JSON.stringify([null, null, null]));
            
            // Refresh interfaces
            if (window.renderCards) renderCards();
            if (window.ItemsSystem) ItemsSystem.renderItems();
            if (window.StoryMode) StoryMode.init();
        }

        logToConsole(`Reset all data for user: ${username}`, 'warning');
    };

    // Reset all user data
    const resetAllData = () => {
        if (!confirm('Are you ABSOLUTELY sure you want to reset ALL user data? This will delete EVERYTHING and cannot be undone!')) {
            return;
        }

        if (!confirm('This is your final warning. This will permanently delete all user accounts and game data. Type "RESET" in the prompt to confirm.')) {
            return;
        }

        const confirmation = prompt('Type "RESET" to confirm:');
        if (confirmation !== 'RESET') {
            logToConsole('Reset cancelled - incorrect confirmation', 'info');
            return;
        }

        // Clear all user data
        localStorage.removeItem('gameUsers');
        
        // Clear all game data
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('gameData_')) {
                localStorage.removeItem(key);
            }
        });

        logToConsole('ALL USER DATA HAS BEEN RESET', 'error');
        alert('All data has been reset. Page will reload.');
        location.reload();
    };

    // Set story progress
    const setStoryProgress = () => {
        const username = document.getElementById('admin-story-user').value.trim();
        const chapter = parseInt(document.getElementById('admin-chapter').value);

        if (!username || !chapter || chapter < 1 || chapter > 6) {
            logToConsole('Please enter valid username and chapter (e.g. 3)', 'error');
            return;
        }

        const userDataKey = `gameData_${username}`;
        const userData = localStorage.getItem(userDataKey);
        
        if (!userData) {
            logToConsole(`User data not found: ${username}`, 'error');
            return;
        }

        const gameData = JSON.parse(userData);
        gameData.storyProgress.currentChapter = chapter;
        
        // Complete all battles up to the chapter
        const battlesPerChapter = [2, 2, 3, 2, 2, 3]; // battles in each chapter
        gameData.storyProgress.completedBattles = [];
        
        let battleId = 1;
        for (let i = 0; i < chapter - 1; i++) {
            for (let j = 0; j < battlesPerChapter[i]; j++) {
                gameData.storyProgress.completedBattles.push(battleId);
                battleId++;
            }
        }
        
        localStorage.setItem(userDataKey, JSON.stringify(gameData));
        
        // Update current user if it's them
        if (username === Auth.getCurrentUser()?.username) {
            localStorage.setItem('storyProgress', JSON.stringify(gameData.storyProgress));
            if (window.StoryMode) StoryMode.init();
        }

        logToConsole(`Set ${username} story progress to Chapter ${chapter}`);
    };

    // Export all data
    const exportAllData = () => {
        const allData = {
            users: JSON.parse(localStorage.getItem('gameUsers') || '{}'),
            gameData: {}
        };

        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('gameData_')) {
                allData.gameData[key] = JSON.parse(localStorage.getItem(key));
            }
        });

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `card_game_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        logToConsole('All data exported successfully');
    };

    // Clear console
    const clearConsole = () => {
        const console = document.getElementById('admin-console-output');
        if (console) {
            console.innerHTML = '<div class="console-line">Console cleared</div>';
        }
    };

    // Simulate pack opening
    const simulatePackOpening = () => {
        if (!window.generateCard) {
            logToConsole('generateCard function not available', 'error');
            return;
        }

        const results = { standard: 0, gold: 0, rainbow: 0 };
        
        for (let i = 0; i < 100; i++) {
            const card = window.generateCard();
            if (card.rarityClass === 'rarity-rainbow') results.rainbow++;
            else if (card.rarityClass === 'rarity-gold') results.gold++;
            else results.standard++;
        }

        logToConsole(`100 pack simulation: ${results.standard} standard, ${results.gold} gold, ${results.rainbow} rainbow`);
    };

    // Simulate item drops
    const simulateItemDrops = () => {
        const itemCounts = {};
        const totalSimulations = 10000;
        let itemsFound = 0;
        
        // Simulate the item drop system
        for (let i = 0; i < totalSimulations; i++) {
            if (Math.random() < 0.1) { // 10% chance to get an item
                itemsFound++;
                
                // Use the same logic as the actual item drop system
                const itemRarities = {
                    1: 100, 2: 100, 4: 100, 7: 100,
                    8: 50, 11: 50, 12: 50,
                    3: 20, 6: 20, 10: 20, 13: 20,
                    5: 5, 9: 5, 16: 5,
                    14: 1, 15: 1, 17: 1
                };
                
                let totalWeight = 0;
                Object.values(itemRarities).forEach(weight => {
                    totalWeight += weight;
                });
                
                let random = Math.random() * totalWeight;
                let cumulativeWeight = 0;
                
                for (const [itemId, weight] of Object.entries(itemRarities)) {
                    cumulativeWeight += weight;
                    if (random <= cumulativeWeight) {
                        const id = parseInt(itemId);
                        itemCounts[id] = (itemCounts[id] || 0) + 1;
                        break;
                    }
                }
            }
        }
        
        logToConsole(`Item drop simulation (${totalSimulations} packs):`);
        logToConsole(`Total items found: ${itemsFound} (${(itemsFound/totalSimulations*100).toFixed(2)}%)`);
        
        // Show results by rarity
        const rarityGroups = {
            'Common': [1, 2, 4, 7],
            'Uncommon': [8, 11, 12],
            'Rare': [3, 6, 10, 13],
            'Epic': [5, 9, 16],
            'Legendary': [14, 15, 17]
        };
        
        Object.entries(rarityGroups).forEach(([rarity, items]) => {
            const count = items.reduce((sum, id) => sum + (itemCounts[id] || 0), 0);
            const percentage = itemsFound > 0 ? (count / itemsFound * 100).toFixed(2) : '0.00';
            logToConsole(`${rarity}: ${count} items (${percentage}%)`);
        });
        
        // Show rarest items specifically
        if (itemCounts[17]) {
            logToConsole(`Mythic Guarantee Scroll found ${itemCounts[17]} times (${(itemCounts[17]/totalSimulations*100).toFixed(4)}% of all packs)`, 'warning');
        }
    };

    // Send global announcement
    const sendAnnouncement = () => {
        const message = document.getElementById('admin-announcement').value.trim();
        
        if (!message) {
            logToConsole('Please enter an announcement message', 'error');
            return;
        }

        // Create a notification for all users (this would be better with a real backend)
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e94560;
            color: #fff;
            padding: 15px 30px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = `📢 Admin: ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 5000);

        logToConsole(`Global announcement sent: ${message}`);
        document.getElementById('admin-announcement').value = '';
    };

    // Select self for item/card giving
    const selectSelf = (type) => {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            logToConsole('No current user found', 'error');
            return;
        }

        if (type === 'item') {
            document.getElementById('admin-target-user').value = currentUser.username;
        } else if (type === 'card') {
            document.getElementById('admin-target-user').value = currentUser.username;
        }
        
        logToConsole(`Selected self (${currentUser.username}) for ${type} giving`);
    };

    // Quick give functions for admin convenience
    const quickGiveItems = () => {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || currentUser.username !== 'Admin') return;

        // Give admin useful starting items
        const quickItems = [
            {id: 1, quantity: 100},
            {id: 2, quantity: 100},
            {id: 3, quantity: 100},
            {id: 4, quantity: 100},
            {id: 5, quantity: 100},
            {id: 6, quantity: 100},
            {id: 7, quantity: 100},
            {id: 8, quantity: 100},
            {id: 9, quantity: 100},
            {id: 10, quantity: 100},
            {id: 11, quantity: 100},
            {id: 12, quantity: 100}, // Supreme Luck Elixir
            {id: 13, quantity: 100},  // Rainbow Crystal
            {id: 14, quantity: 100},  // Ultimate Pack Crate
            {id: 15, quantity: 100}, // Set Booster
            {id: 16, quantity: 100}, // Ultimate Card Catalyst
            {id: 17, quantity: 100} // Guaranteed Legend Token
        ];

        const userDataKey = `gameData_${currentUser.username}`;
        const userData = localStorage.getItem(userDataKey);
        
        if (!userData) {
            logToConsole('Admin user data not found', 'error');
            return;
        }

        const gameData = JSON.parse(userData);
        let itemsGiven = 0;
        
        quickItems.forEach(item => {
            if (!gameData.playerItems[item.id]) {
                gameData.playerItems[item.id] = 0;
            }
            gameData.playerItems[item.id] += item.quantity;
            itemsGiven++;
        });
        
        localStorage.setItem(userDataKey, JSON.stringify(gameData));
        localStorage.setItem('playerItems', JSON.stringify(gameData.playerItems));
        
        if (window.ItemsSystem) ItemsSystem.renderItems();
        
        logToConsole(`Quick-gave ${itemsGiven} different admin items to self`);
    };

    return {
        init,
        setupAdminInterface,
        showAllUsers,
        showUserSearch,
        searchUser,
        showGameStats,
        giveItem,
        giveCard,
        resetUserData,
        resetAllData,
        setStoryProgress,
        exportAllData,
        clearConsole,
        simulatePackOpening,
        simulateItemDrops,
        sendAnnouncement,
        selectSelf,
        quickGiveItems,
        logToConsole
    };
})();

// Make AdminSystem globally accessible
window.AdminSystem = AdminSystem;
