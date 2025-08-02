// Database module for card game
const CardDB = (() => {
    const DB_NAME = 'AnimeCardGameDB';
    const DB_VERSION = 1;
    let db;

    // Initialize the database
    const init = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = event => {
                console.error('IndexedDB error:', event.target.error);
                reject('Could not open database');
            };
            
            request.onsuccess = event => {
                db = event.target.result;
                console.log('Database opened successfully');
                resolve(db);
            };
            
            request.onupgradeneeded = event => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('cards')) {
                    const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
                    cardStore.createIndex('set', 'set', { unique: false });
                    cardStore.createIndex('rarity', 'rarityClass', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('userCollection')) {
                    const collectionStore = db.createObjectStore('userCollection', { keyPath: 'cardId' });
                    collectionStore.createIndex('count', 'count', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('userDecks')) {
                    db.createObjectStore('userDecks', { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    };

    // Store all cards in the database
    const storeAllCards = (cards) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cards'], 'readwrite');
            const cardStore = transaction.objectStore('cards');
            
            transaction.oncomplete = () => resolve('Cards stored successfully');
            transaction.onerror = event => reject(event.target.error);
            
            cards.forEach(card => {
                cardStore.put(card);
            });
        });
    };

    // Get all cards from the database
    const getAllCards = () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cards'], 'readonly');
            const cardStore = transaction.objectStore('cards');
            const request = cardStore.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = event => reject(event.target.error);
        });
    };

    // Get cards by set
    const getCardsBySet = (setName) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cards'], 'readonly');
            const cardStore = transaction.objectStore('cards');
            const index = cardStore.index('set');
            const request = index.getAll(setName);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = event => reject(event.target.error);
        });
    };

    // Add card to user collection
    const addCardToCollection = (cardId, count = 1) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['userCollection'], 'readwrite');
            const collectionStore = transaction.objectStore('userCollection');
            
            // Check if card already exists in collection
            const getRequest = collectionStore.get(cardId);
            
            getRequest.onsuccess = () => {
                const existingCard = getRequest.result;
                
                if (existingCard) {
                    // Update count if card exists
                    existingCard.count += count;
                    collectionStore.put(existingCard);
                } else {
                    // Add new card if it doesn't exist
                    collectionStore.add({ cardId, count });
                }
                
                resolve('Card added to collection');
            };
            
            getRequest.onerror = event => reject(event.target.error);
        });
    };

    // Get user's card collection
    const getUserCollection = () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['userCollection'], 'readonly');
            const collectionStore = transaction.objectStore('userCollection');
            const request = collectionStore.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = event => reject(event.target.error);
        });
    };

    return {
        init,
        storeAllCards,
        getAllCards,
        getCardsBySet,
        addCardToCollection,
        getUserCollection
    };
})();
