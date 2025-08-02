// Card Collection System
const CardCollection = (() => {
    // Initialize the collection
    const init = async () => {
        try {
            await CardDB.init();
            const cards = await CardDB.getAllCards();
            
            // If no cards in DB, store the initial card data
            if (cards.length === 0) {
                await CardDB.storeAllCards(cardDatabase);
                console.log('Initial card data stored in database');
            }
            
            // Display user's collection
            await refreshCollectionView();
            
            return true;
        } catch (error) {
            console.error('Failed to initialize collection:', error);
            return false;
        }
    };
    
    // Refresh the collection view
    const refreshCollectionView = async () => {
        try {
            const collection = await CardDB.getUserCollection();
            const collectionContainer = document.getElementById('collection-container');
            
            if (!collectionContainer) return;
            
            // Clear existing content
            collectionContainer.innerHTML = '';
            
            if (collection.length === 0) {
                collectionContainer.innerHTML = '<p class="empty-collection">Your collection is empty. Open card packs to get cards!</p>';
                return;
            }
            
            // Get all cards for reference
            const allCards = await CardDB.getAllCards();
            
            // Create a card element for each card in collection
            for (const item of collection) {
                const card = allCards.find(c => c.id === item.cardId);
                if (!card) continue;
                
                const cardElement = document.createElement('div');
                cardElement.className = `collection-card ${card.rarityClass}`;
                
                cardElement.innerHTML = `
                    <div class="card-image" style="background-image: url('${card.image}')"></div>
                    <div class="card-info">
                        <h3>${card.name}</h3>
                        <p class="card-set">${card.set}</p>
                        <p class="card-count">Owned: ${item.count}</p>
                    </div>
                `;
                
                collectionContainer.appendChild(cardElement);
            }
        } catch (error) {
            console.error('Failed to refresh collection view:', error);
        }
    };
    
    // Add cards to collection
    const addCards = async (cards) => {
        try {
            for (const card of cards) {
                await CardDB.addCardToCollection(card.id);
            }
            await refreshCollectionView();
            return true;
        } catch (error) {
            console.error('Failed to add cards to collection:', error);
            return false;
        }
    };
    
    return {
        init,
        refreshCollectionView,
        addCards
    };
})();
