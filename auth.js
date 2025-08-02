// auth.js

const Auth = (() => {
    let currentUser = null;

    const init = () => {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            currentUser = JSON.parse(saved);
            loadUserGameData(currentUser.username);
            showGameInterface();
        } else {
            showAuthScreen();
        }
    };

    const showAuthScreen = () => {
        document.getElementById('auth-screen').classList.add('active');
        document.getElementById('game-interface').classList.remove('active');
    };

    const showGameInterface = () => {
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('game-interface').classList.add('active');
        if (currentUser) {
            document.getElementById('username-display').textContent = currentUser.username;
            if (window.AdminSystem) AdminSystem.init(currentUser.username);
            setTimeout(() => { if (window.initializeGame) initializeGame(); }, 100);
        }
    };

    const showLogin = () => {
        document.getElementById('login-form').classList.add('active');
        document.getElementById('signup-form').classList.remove('active');
        clearMessages();
    };

    const showSignup = () => {
        document.getElementById('signup-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
        clearMessages();
    };

    const showError = (message, formType = 'login') => {
        clearMessages();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        const form = document.getElementById(`${formType}-form`);
        const formElement = form.querySelector('form');
        form.insertBefore(errorDiv, formElement);
    };

    const showSuccess = (message, formType = 'signup') => {
        clearMessages();
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        const form = document.getElementById(`${formType}-form`);
        const formElement = form.querySelector('form');
        form.insertBefore(successDiv, formElement);
    };

    const clearMessages = () => {
        document.querySelectorAll('.error-message,.success-message').forEach(msg => msg.remove());
    };

    const login = (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }
        const users = JSON.parse(localStorage.getItem('gameUsers') || '{}');
        if (!users[username]) {
            showError('Username not found. Please check your username or sign up.');
            return;
        }
        if (users[username].password !== password) {
            showError('Incorrect password. Please try again.');
            return;
        }
        if (currentUser && currentUser.username !== username) {
            saveUserGameData(currentUser.username);
            clearGameData();
        }
        currentUser = {
            username: users[username].username,
            email: users[username].email,
            joinDate: users[username].joinDate
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadUserGameData(username);
        showGameInterface();
        if (window.AdminSystem) AdminSystem.init(currentUser.username);
        setTimeout(() => { if (window.initializeGame) initializeGame(); }, 100);
    };

    const signup = (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        if (!username || !email || !password || !confirmPassword) {
            showError('Please fill in all fields', 'signup');
            return;
        }
        if (username.length < 3) {
            showError('Username must be at least 3 characters long', 'signup');
            return;
        }
        if (password.length < 6) {
            showError('Password must be at least 6 characters long', 'signup');
            return;
        }
        if (password !== confirmPassword) {
            showError('Passwords do not match', 'signup');
            return;
        }
        const users = JSON.parse(localStorage.getItem('gameUsers') || '{}');
        if (users[username]) {
            showError('Username already exists. Please choose a different one.', 'signup');
            return;
        }
        if (Object.values(users).some(u => u.email === email)) {
            showError('Email already registered. Please use a different email.', 'signup');
            return;
        }
        users[username] = {
            username,
            email,
            password,
            joinDate: new Date().toISOString()
        };
        localStorage.setItem('gameUsers', JSON.stringify(users));
        initializeNewUserData(username);
        showSuccess('Account created successfully! Please sign in to start playing.');
        document.getElementById('signup-form').querySelector('form').reset();
        setTimeout(() => { showLogin(); }, 2000);
    };

    const signout = () => {
        if (!confirm('Are you sure you want to sign out?')) return;
        if (currentUser) saveUserGameData(currentUser.username);
        currentUser = null;
        localStorage.removeItem('currentUser');
        clearGameData();
        showAuthScreen();
        document.querySelectorAll('form').forEach(form => form.reset());
        clearMessages();
    };

    const loadUserGameData = (username) => {
        const key = `gameData_${username}`;
        const userData = localStorage.getItem(key);
        if (userData) {
            const data = JSON.parse(userData);
            window.playerCards = data.playerCards || [];
            localStorage.setItem('playerCards', JSON.stringify(window.playerCards));
            localStorage.setItem('playerItems', JSON.stringify(data.playerItems || {}));
            localStorage.setItem('activeEffects', JSON.stringify(data.activeEffects || {}));
            localStorage.setItem('storyProgress', JSON.stringify(data.storyProgress || { currentChapter: 1, completedBattles: [] }));
            localStorage.setItem('playerDeck', JSON.stringify(data.playerDeck || [null,null,null]));
            localStorage.setItem('playerSupportDeck', JSON.stringify(data.playerSupportDeck || [null,null,null]));
            localStorage.setItem('playerXP', data.playerXP || 0);
            localStorage.setItem('playerLevel', data.playerLevel || 1);
        } else {
            clearGameData();
        }
    };

    const saveUserGameData = (username) => {
        const key = `gameData_${username}`;
        const data = {
            playerCards: JSON.parse(localStorage.getItem('playerCards') || '[]'),
            playerItems: JSON.parse(localStorage.getItem('playerItems') || '{}'),
            activeEffects: JSON.parse(localStorage.getItem('activeEffects') || '{}'),
            storyProgress: JSON.parse(localStorage.getItem('storyProgress') || '{}'),
            playerDeck: JSON.parse(localStorage.getItem('playerDeck') || '[null,null,null]'),
            playerSupportDeck: JSON.parse(localStorage.getItem('playerSupportDeck') || '[null,null,null]'),
            playerXP: parseInt(localStorage.getItem('playerXP')) || 0,
            playerLevel: parseInt(localStorage.getItem('playerLevel')) || 1,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));
    };

    const initializeNewUserData = (username) => {
        const key = `gameData_${username}`;
        const data = {
            playerCards: [],
            playerItems: {},
            activeEffects: {},
            storyProgress: { currentChapter: 1, completedBattles: [] },
            playerDeck: [null,null,null],
            playerSupportDeck: [null,null,null],
            playerXP: 0,
            playerLevel: 1,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));
    };

    const clearGameData = () => {
        localStorage.removeItem('playerCards');
        localStorage.removeItem('playerItems');
        localStorage.removeItem('activeEffects');
        localStorage.removeItem('storyProgress');
        localStorage.removeItem('playerDeck');
        localStorage.removeItem('playerSupportDeck');
        localStorage.removeItem('playerXP');
        localStorage.removeItem('playerLevel');
        if(window.playerCards) window.playerCards = [];
    };

    const getCurrentUser = () => currentUser;

    const setupAutoSave = () => {
        setInterval(() => {
            if(currentUser) saveUserGameData(currentUser.username);
        }, 30000);
    };

    return {
        init,
        login,
        signup,
        signout,
        showLogin,
        showSignup,
        getCurrentUser,
        saveUserGameData,
        setupAutoSave
    };
})();

window.Auth = Auth;
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    Auth.setupAutoSave();
});
