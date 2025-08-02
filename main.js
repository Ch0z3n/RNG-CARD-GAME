// Main application script

// Initialize the application
async function initApp() {
    try {
        console.log('Initializing application...');
        
        // Initialize database
        await CardDB.init();
        console.log('Database initialized');
        
        // Initialize collection
        await CardCollection.init();
        console.log('Collection initialized');
        
        // Initialize card packs
        CardPacks.initPackButtons();
        console.log('Card packs initialized');
        
        // Setup UI components
        setupUI();
        console.log('UI setup complete');
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        alert('There was an error initializing the application. Please refresh the page and try again.');
    }
}

// Setup UI components
function setupUI() {
    // Setup tab navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const tabs = document.querySelectorAll('.tab');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active tab
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show selected tab
            const tabId = link.dataset.tab;
            tabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.id === tabId) {
                    tab.classList.add('active');
                }
            });
            
            // Refresh collection view when switching to collection tab
            if (tabId === 'collection') {
                CardCollection.refreshCollectionView();
            }
        });
    });
    
    // Setup filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.dataset.filterType || 'set';
                const filterValue = btn.dataset.value || btn.dataset.set || 'all';
                
                if (window.filterBy) {
                    filterBy(filterType, filterValue);
                }
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
