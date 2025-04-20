let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameMode = '';
let difficulty = '';
let soundOn = true;
let isComputerTurn = false;
let stats = {
    pvp: { wins: 0, losses: 0, draws: 0 },
    pvcEasy: { wins: 0, losses: 0, draws: 0 },
    pvcMedium: { wins: 0, losses: 0, draws: 0 },
    pvcHard: { wins: 0, losses: 0, draws: 0 }
};
let emojiStyles = {
    hearts: { X: '❤️', O: '💙' },
    faces: { X: '😀', O: '😈' },
    animals: { X: '🐶', O: '🐱' }
};
let currentEmojiStyle = 'hearts';
let themes = [
    { name: 'default', icon: '🌑' },
    { name: 'dark', icon: '🌙' },
    { name: 'ocean', icon: '🌊' },
    { name: 'neon', icon: '💡' },
    { name: 'space', icon: '🚀' }
];
let currentTheme = 'default';
let adminCode = 'I AM ADMIN 000';
let turnLogic = 'alternate';
let supportMessages = [];
let gridAnimation = 'wave';
let gameStartedWithX = true;
let buttonStyles = {
    pvp: { text: 'Player vs Player', icon: '⚡', color: 'bg-blue-600' },
    pvc: { text: 'Player vs Computer', icon: '🤖', color: 'bg-green-600' },
    reset: { text: 'Reset', icon: '💥', color: 'bg-red-600' },
    mainMenu: { text: 'Main Menu', icon: '🌀', color: 'bg-blue-600' }
};
let gameLogo = '';

const sounds = {
    click: new Audio('https://freesound.org/data/previews/171/171671_2437358-lq.mp3'),
    placeX: new Audio('https://freesound.org/data/previews/276/276237_5123851-lq.mp3'),
    placeO: new Audio('https://freesound.org/data/previews/341/341695_5858296-lq.mp3'),
    win: new Audio('https://freesound.org/data/previews/511/511484_5123851-lq.mp3'),
    draw: new Audio('https://freesound.org/data/previews/243/243020_71257-lq.mp3')
};

Object.values(sounds).forEach(sound => {
    sound.preload = 'auto';
    sound.load();
});

function createParticles() {
    try {
        const particlesContainer = document.getElementById('particles');
        particlesContainer.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particlesContainer.appendChild(particle);
        }
    } catch (e) {
        console.error('Error creating particles:', e);
    }
}

function applyTheme(themeName) {
    try {
        currentTheme = themeName;
        document.body.className = `text-white ${themeName}`;
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.background = themeName === 'neon' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(31, 41, 55, 0.4)';
            cell.style.borderColor = themeName === 'retro' ? '#ff69b4' : 'rgba(255, 255, 255, 0.5)';
        });
        updateButtonStyles();
    } catch (e) {
        console.error('Error applying theme:', e);
    }
}

function applyGridAnimation(animation) {
    try {
        gridAnimation = animation;
        const cells = document.querySelectorAll('.cell');
        const animations = {
            wave: 'wave 2s infinite',
            zoom: 'zoom 1.5s infinite',
            rotate: 'rotate 5s infinite',
            'color-shift': 'color-shift 3s infinite',
            flip: 'flip-cell 2s infinite',
            blink: 'blink 1s infinite',
            slide: 'slide-0 2s infinite',
            'border-glow': 'lightning 1.5s infinite',
            checkerboard: 'checkerboard 2s infinite'
        };
        cells.forEach((cell, i) => {
            cell.style.animation = '';
            if (animation === 'slide') {
                cell.style.animation = `slide-${i % 4} 2s infinite`;
            } else if (animation === 'checkerboard') {
                cell.style.animation = `checkerboard 2s infinite ${i % 2 === 0 ? '0s' : '1s'}`;
            } else {
                cell.style.animation = animations[animation];
            }
        });
    } catch (e) {
        console.error('Error applying grid animation:', e);
    }
}

function playSound(soundKey) {
    if (soundOn) {
        try {
            sounds[soundKey].currentTime = 0;
            sounds[soundKey].play();
        } catch (e) {
            console.error(`Sound play error (${soundKey}):`, e);
        }
    }
}

function toggleSound() {
    soundOn = !soundOn;
    document.getElementById('sound-icon').innerText = soundOn ? '🔊' : '🔇';
}

function updateButtonStyles() {
    try {
        document.getElementById('pvp').innerHTML = `${buttonStyles.pvp.icon} ${buttonStyles.pvp.text}`;
        document.getElementById('pvp').className = `${buttonStyles.pvp.color} text-white px-6 py-3 rounded-lg glow pulse text-xl`;
        document.getElementById('pvc').innerHTML = `${buttonStyles.pvc.icon} ${buttonStyles.pvc.text}`;
        document.getElementById('pvc').className = `${buttonStyles.pvc.color} text-white px-6 py-3 rounded-lg glow pulse text-xl`;
        document.getElementById('reset').innerHTML = `${buttonStyles.reset.icon} ${buttonStyles.reset.text}`;
        document.getElementById('reset').className = `${buttonStyles.reset.color} text-white px-4 py-2 rounded-lg glow`;
        document.getElementById('main-menu-btn').innerHTML = `${buttonStyles.mainMenu.icon} ${buttonStyles.mainMenu.text}`;
        document.getElementById('main-menu-btn').className = `${buttonStyles.mainMenu.color} text-white px-4 py-2 rounded-lg glow`;
    } catch (e) {
        console.error('Error updating button styles:', e);
    }
}

function updateTurnIndicator() {
    try {
        const emoji = emojiStyles[currentEmojiStyle][currentPlayer];
        const label = gameMode === 'pvc' && currentPlayer === 'O' ? 'Computer' : 'Player';
        document.getElementById('turn-indicator').innerHTML = `${emoji} ${label}'s Turn`;
    } catch (e) {
        console.error('Error updating turn indicator:', e);
    }
}

function createBoard() {
    try {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';
        board.forEach((_, i) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleCellClick(i));
            boardElement.appendChild(cell);
        });
        applyTheme(currentTheme);
        applyGridAnimation(gridAnimation);
        updateTurnIndicator();
    } catch (e) {
        console.error('Error creating board:', e);
    }
}

function handleCellClick(index) {
    try {
        if (board[index] || checkWinner() || isComputerTurn) return;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.classList.add('click-anim');
        setTimeout(() => cell.classList.remove('click-anim'), 500);
        playSound(currentPlayer === 'X' ? 'placeX' : 'placeO');
        board[index] = currentPlayer;
        updateBoard();
        if (checkWinner()) {
            playSound('win');
            const winner = gameMode === 'pvc' && currentPlayer === 'O' ? 'Computer' : 'Player';
            document.getElementById('game-status').innerHTML = `${winner} Wins!`;
            updateStats(currentPlayer);
            highlightWinningLine();
            confetti();
            return;
        }
        if (board.every(cell => cell)) {
            playSound('draw');
            document.getElementById('game-status').innerHTML = 'Draw!';
            updateStats(null);
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();
        if (gameMode === 'pvc' && currentPlayer === 'O') {
            isComputerTurn = true;
            setTimeout(aiMove, 1000);
        }
    } catch (e) {
        console.error('Error handling cell click:', e);
    }
}

function updateBoard() {
    try {
        const cells = document.querySelectorAll('.cell');
        board.forEach((value, i) => {
            cells[i].innerHTML = value ? emojiStyles[currentEmojiStyle][value] : '';
        });
    } catch (e) {
        console.error('Error updating board:', e);
    }
}

function checkWinner() {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winCombos.some(combo => {
        if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            return true;
        }
        return false;
    });
}

function getWinningCombo() {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winCombos) {
        if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            return combo;
        }
    }
    return null;
}

function highlightWinningLine() {
    try {
        const combo = getWinningCombo();
        if (combo) {
            combo.forEach(index => {
                document.querySelector(`.cell[data-index="${index}"]`).classList.add('winner-line');
            });
        }
    } catch (e) {
        console.error('Error highlighting winning line:', e);
    }
}

function updateStats(winner) {
    try {
        if (gameMode === 'pvp') {
            if (winner) {
                stats.pvp[winner === 'X' ? 'wins' : 'losses']++;
            } else {
                stats.pvp.draws++;
            }
        } else {
            const statKey = `pvc${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
            if (winner === 'X') {
                stats[statKey].wins++;
            } else if (winner === 'O') {
                stats[statKey].losses++;
            } else {
                stats[statKey].draws++;
            }
        }
        updateStatsDisplay();
    } catch (e) {
        console.error('Error updating stats:', e);
    }
}

function updateStatsDisplay() {
    try {
        document.getElementById('pvp-stats').innerHTML = `${stats.pvp.wins}W/${stats.pvp.losses}L/${stats.pvp.draws}D`;
        document.getElementById('pvc-easy-stats').innerHTML = `${stats.pvcEasy.wins}W/${stats.pvcEasy.losses}L/${stats.pvcEasy.draws}D`;
        document.getElementById('pvc-medium-stats').innerHTML = `${stats.pvcMedium.wins}W/${stats.pvcMedium.losses}L/${stats.pvcMedium.draws}D`;
        document.getElementById('pvc-hard-stats').innerHTML = `${stats.pvcHard.wins}W/${stats.pvcHard.losses}L/${stats.pvcHard.draws}D`;

        const pvpTotal = stats.pvp.wins + stats.pvp.losses + stats.pvp.draws;
        document.getElementById('pvp-progress').style.width = pvpTotal ? `${(stats.pvp.wins / pvpTotal) * 100}%` : '0%';

        const easyTotal = stats.pvcEasy.wins + stats.pvcEasy.losses + stats.pvcEasy.draws;
        document.getElementById('pvc-easy-progress').style.width = easyTotal ? `${(stats.pvcEasy.wins / easyTotal) * 100}%` : '0%';

        const mediumTotal = stats.pvcMedium.wins + stats.pvcMedium.losses + stats.pvcMedium.draws;
        document.getElementById('pvc-medium-progress').style.width = mediumTotal ? `${(stats.pvcMedium.wins / mediumTotal) * 100}%` : '0%';

        const hardTotal = stats.pvcHard.wins + stats.pvcHard.losses + stats.pvcHard.draws;
        document.getElementById('pvc-hard-progress').style.width = hardTotal ? `${(stats.pvcHard.wins / hardTotal) * 100}%` : '0%';
    } catch (e) {
        console.error('Error updating stats display:', e);
    }
}

function aiMove() {
    try {
        let move;
        if (difficulty === 'easy') {
            move = getRandomMove();
        } else if (difficulty === 'medium') {
            move = getBlockingMove() || getRandomMove();
        } else {
            move = minimax(board, 'O').index;
        }
        if (move !== undefined) {
            const cell = document.querySelector(`.cell[data-index="${move}"]`);
            cell.classList.add('click-anim');
            setTimeout(() => cell.classList.remove('click-anim'), 500);
            board[move] = 'O';
            playSound('placeO');
            updateBoard();
            if (checkWinner()) {
                playSound('win');
                document.getElementById('game-status').innerHTML = 'Computer Wins!';
                updateStats('O');
                highlightWinningLine();
                confetti();
                isComputerTurn = false;
                return;
            }
            if (board.every(cell => cell)) {
                playSound('draw');
                document.getElementById('game-status').innerHTML = 'Draw!';
                updateStats(null);
                isComputerTurn = false;
                return;
            }
            currentPlayer = 'X';
            updateTurnIndicator();
            isComputerTurn = false;
        }
    } catch (e) {
        console.error('Error in AI move:', e);
        isComputerTurn = false;
    }
}

function getRandomMove() {
    const emptyCells = board.map((val, i) => val ? null : i).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBlockingMove() {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] === 'X' && board[a] === board[b] && !board[c]) return c;
        if (board[a] === 'X' && board[a] === board[c] && !board[b]) return b;
        if (board[b] === 'X' && board[b] === board[c] && !board[a]) return a;
    }
    return null;
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, i) => val ? null : i).filter(val => val !== null);

    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winCombos.some(combo => {
        return board[combo[0]] === player && board[combo[1]] === player && board[combo[2]] === player;
    });
}

function resetGame() {
    try {
        board = Array(9).fill(null);
        isComputerTurn = false;
        if (turnLogic === 'random') {
            currentPlayer = Math.random() > 0.5 ? 'X' : 'O';
        } else if (turnLogic === 'x-first') {
            currentPlayer = 'X';
        } else if (turnLogic === 'o-first') {
            currentPlayer = 'O';
        } else {
            currentPlayer = gameStartedWithX ? 'O' : 'X';
            gameStartedWithX = !gameStartedWithX;
        }
        document.getElementById('game-status').innerHTML = '';
        document.getElementById('game-board').innerHTML = '';
        createBoard();
        if (gameMode === 'pvc' && currentPlayer === 'O') {
            isComputerTurn = true;
            setTimeout(aiMove, 1000);
        }
    } catch (e) {
        console.error('Error resetting game:', e);
    }
}

function confetti() {
    try {
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)];
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    } catch (e) {
        console.error('Error creating confetti:', e);
    }
}

function updateThemeModal() {
    try {
        const themeGrid = document.getElementById('theme-grid');
        themeGrid.innerHTML = '';
        themes.forEach(theme => {
            const card = document.createElement('div');
            card.className = 'theme-card';
            card.dataset.theme = theme.name;
            card.innerHTML = `${theme.icon} ${theme.name}`;
            card.addEventListener('click', () => {
                playSound('click');
                applyTheme(theme.name);
            });
            themeGrid.appendChild(card);
        });

        const emojiGrid = document.getElementById('emoji-grid');
        emojiGrid.innerHTML = '';
        Object.keys(emojiStyles).forEach(style => {
            const card = document.createElement('div');
            card.className = 'theme-card';
            card.dataset.emoji = style;
            card.innerHTML = `${emojiStyles[style].X} ${emojiStyles[style].O}`;
            card.addEventListener('click', () => {
                playSound('click');
                currentEmojiStyle = style;
                updateBoard();
                updateTurnIndicator();
            });
            emojiGrid.appendChild(card);
        });

        const deleteThemeSelect = document.getElementById('delete-theme');
        deleteThemeSelect.innerHTML = '<option value="">Select Theme</option>';
        themes.forEach(theme => {
            if (theme.name !== 'default') {
                const option = document.createElement('option');
                option.value = theme.name;
                option.text = `${theme.icon} ${theme.name}`;
                deleteThemeSelect.appendChild(option);
            }
        });

        const deleteEmojiSelect = document.getElementById('delete-emoji');
        deleteEmojiSelect.innerHTML = '<option value="">Select Emoji Style</option>';
        Object.keys(emojiStyles).forEach(style => {
            if (style !== 'hearts') {
                const option = document.createElement('option');
                option.value = style;
                option.text = `${emojiStyles[style].X} ${emojiStyles[style].O}`;
                deleteEmojiSelect.appendChild(option);
            }
        });
    } catch (e) {
        console.error('Error updating theme modal:', e);
    }
}

function updateSupportMessages() {
    try {
        const messagesDiv = document.getElementById('support-messages');
        messagesDiv.innerHTML = supportMessages.length ? supportMessages.map(msg => `<p>${msg}</p>`).join('') : 'No messages yet.';
    } catch (e) {
        console.error('Error updating support messages:', e);
    }
}

function handleSupportQuery(query) {
    query = query.toLowerCase().trim();
    if (query === adminCode.toLowerCase()) {
        return { isAdmin: true };
    }
    const responses = {
        'how to play': 'Click a cell to place your X or O. Get three in a row to win! Choose PVP or PVC, customize themes, and track stats in the profile.',
        'profile': 'Upload a profile picture by dragging and dropping or selecting a file. View your win/loss/draw stats with progress bars.',
        'themes': 'Select themes like Neon or Space via the 🖌️ icon. Admins can add/delete themes with custom icons.',
        'sound': 'Toggle sound with 🔊/🔇. X, O, and win sounds can be customized by admins.',
        'admin': 'Admins can change the game name, logo, buttons, sounds, and more. Enter the admin code in Support.',
        'difficulty': 'Choose Easy (😊), Medium (🤔), or Hard (😈) for PVC. Use the Back button to return to the main menu.',
        default: 'Welcome to the ultimate Tic-Tac-Toe experience! Play, customize, and conquer. Try keywords like "how to play", "themes", or "profile" for specific help.'
    };
    const response = responses[query] || responses.default;
    supportMessages.push(`User: ${query}\nAI: ${response}`);
    updateSupportMessages();
    return { isAdmin: false, response };
}

function initializeEventListeners() {
    try {
        document.getElementById('sound-toggle').addEventListener('click', () => {
            playSound('click');
            toggleSound();
        });

        document.getElementById('pvp').addEventListener('click', () => {
            playSound('click');
            gameMode = 'pvp';
            document.getElementById('main-menu').classList.add('hidden');
            document.getElementById('game').classList.remove('hidden');
            resetGame();
        });

        document.getElementById('pvc').addEventListener('click', () => {
            playSound('click');
            document.getElementById('main-menu').classList.add('hidden');
            document.getElementById('difficulty').classList.remove('hidden');
        });

        document.getElementById('easy').addEventListener('click', () => {
            playSound('click');
            difficulty = 'easy';
            gameMode = 'pvc';
            document.getElementById('difficulty').classList.add('hidden');
            document.getElementById('game').classList.remove('hidden');
            resetGame();
        });

        document.getElementById('medium').addEventListener('click', () => {
            playSound('click');
            difficulty = 'medium';
            gameMode = 'pvc';
            document.getElementById('difficulty').classList.add('hidden');
            document.getElementById('game').classList.remove('hidden');
            resetGame();
        });

        document.getElementById('hard').addEventListener('click', () => {
            playSound('click');
            difficulty = 'hard';
            gameMode = 'pvc';
            document.getElementById('difficulty').classList.add('hidden');
            document.getElementById('game').classList.remove('hidden');
            resetGame();
        });

        document.getElementById('back').addEventListener('click', () => {
            playSound('click');
            document.getElementById('difficulty').classList.add('hidden');
            document.getElementById('main-menu').classList.remove('hidden');
        });

        document.getElementById('reset').addEventListener('click', () => {
            playSound('click');
            resetGame();
        });

        document.getElementById('main-menu-btn').addEventListener('click', () => {
            playSound('click');
            document.getElementById('game').classList.add('hidden');
            document.getElementById('main-menu').classList.remove('hidden');
        });

        document.getElementById('profile').addEventListener('click', () => {
            playSound('click');
            document.getElementById('profile-modal').classList.remove('hidden');
        });

        document.getElementById('close-profile').addEventListener('click', () => {
            playSound('click');
            document.getElementById('profile-modal').classList.add('hidden');
        });

        document.getElementById('support').addEventListener('click', () => {
            playSound('click');
            document.getElementById('support-modal').classList.remove('hidden');
        });

        document.getElementById('close-support').addEventListener('click', () => {
            playSound('click');
            document.getElementById('support-modal').classList.add('hidden');
        });

        document.getElementById('theme').addEventListener('click', () => {
            playSound('click');
            document.getElementById('theme-modal').classList.remove('hidden');
        });

        document.getElementById('close-theme').addEventListener('click', () => {
            playSound('click');
            document.getElementById('theme-modal').classList.add('hidden');
        });

        const profilePicUpload = document.getElementById('profile-pic-upload');
        profilePicUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            profilePicUpload.classList.add('drag-over');
        });

        profilePicUpload.addEventListener('dragleave', () => {
            profilePicUpload.classList.remove('drag-over');
        });

        profilePicUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            profilePicUpload.classList.remove('drag-over');
            try {
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        document.getElementById('avatar').src = reader.result;
                        document.getElementById('no-file').innerText = 'Image uploaded!';
                    };
                    reader.readAsDataURL(file);
                } else {
                    document.getElementById('no-file').innerText = 'Please drop an image file.';
                }
            } catch (e) {
                console.error('Error uploading profile picture:', e);
            }
        });

        document.getElementById('profile-pic-input').addEventListener('change', (e) => {
            try {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        document.getElementById('avatar').src = reader.result;
                        document.getElementById('no-file').innerText = 'Image uploaded!';
                    };
                    reader.readAsDataURL(file);
                } else {
                    document.getElementById('no-file').innerText = 'Please select an image file.';
                }
            } catch (e) {
                console.error('Error selecting profile picture:', e);
            }
        });

        document.getElementById('submit-support').addEventListener('click', () => {
            playSound('click');
            try {
                const input = document.getElementById('support-input').value.trim();
                const { isAdmin, response } = handleSupportQuery(input);
                if (isAdmin) {
                    document.getElementById('support-modal').classList.add('hidden');
                    document.getElementById('admin-panel').classList.remove('hidden');
                    document.getElementById('support-input').value = '';
                    document.getElementById('support-response').innerHTML = '';
                } else {
                    document.getElementById('support-response').innerHTML = response;
                }
            } catch (e) {
                console.error('Error in support submit:', e);
            }
        });

        document.getElementById('update-game-name').addEventListener('click', () => {
            playSound('click');
            try {
                const name = document.getElementById('game-name').value.trim();
                const logo = document.getElementById('game-logo').value.trim();
                if (name) {
                    document.getElementById('game-title').innerText = name;
                    document.getElementById('game-header').innerHTML = `${logo ? logo + ' ' : ''}${name}`;
                    gameLogo = logo;
                    document.getElementById('game-name').value = '';
                    document.getElementById('game-logo').value = '';
                    alert('Game name and logo updated!');
                }
            } catch (e) {
                console.error('Error updating game name:', e);
            }
        });

        document.getElementById('update-admin-code').addEventListener('click', () => {
            playSound('click');
            try {
                const code = document.getElementById('admin-code').value.trim();
                if (code) {
                    adminCode = code;
                    document.getElementById('admin-code').value = '';
                    alert('Admin code updated!');
                }
            } catch (e) {
                console.error('Error updating admin code:', e);
            }
        });

        document.getElementById('update-turn-logic').addEventListener('click', () => {
            playSound('click');
            try {
                turnLogic = document.getElementById('turn-logic').value;
                alert('Turn logic updated!');
                resetGame();
            } catch (e) {
                console.error('Error updating turn logic:', e);
            }
        });

        document.getElementById('update-button').addEventListener('click', () => {
            playSound('click');
            try {
                const text = document.getElementById('button-text').value.trim();
                const icon = document.getElementById('button-icon').value.trim();
                const color = document.getElementById('button-color').value.trim();
                if (text && icon && color) {
                    buttonStyles.pvp = { text, icon, color };
                    buttonStyles.pvc = { text: text.replace('PVP', 'PVC'), icon, color };
                    buttonStyles.reset = { text: 'Reset', icon: '💥', color };
                    buttonStyles.mainMenu = { text: 'Main Menu', icon: '🌀', color };
                    updateButtonStyles();
                    document.getElementById('button-text').value = '';
                    document.getElementById('button-icon').value = '';
                    document.getElementById('button-color').value = '';
                    alert('Button styles updated!');
                }
            } catch (e) {
                console.error('Error updating button styles:', e);
            }
        });

        document.getElementById('update-sounds').addEventListener('click', () => {
            playSound('click');
            try {
                const soundX = document.getElementById('sound-x').value.trim();
                const soundO = document.getElementById('sound-o').value.trim();
                const soundWin = document.getElementById('sound-win').value.trim();
                if (soundX) sounds.placeX = new Audio(soundX);
                if (soundO) sounds.placeO = new Audio(soundO);
                if (soundWin) sounds.win = new Audio(soundWin);
                if (soundX || soundO || soundWin) {
                    Object.values(sounds).forEach(sound => {
                        sound.preload = 'auto';
                        sound.load();
                    });
                    document.getElementById('sound-x').value = '';
                    document.getElementById('sound-o').value = '';
                    document.getElementById('sound-win').value = '';
                    alert('Sounds updated!');
                }
            } catch (e) {
                console.error('Error updating sounds:', e);
            }
        });

        document.getElementById('add-theme').addEventListener('click', () => {
            playSound('click');
            try {
                const name = document.getElementById('theme-name').value.trim();
                const colors = document.getElementById('theme-colors').value.trim();
                const icon = document.getElementById('theme-icon').value.trim() || '🎨';
                if (name && colors) {
                    themes.push({ name, icon });
                    updateThemeModal();
                    document.getElementById('theme-name').value = '';
                    document.getElementById('theme-colors').value = '';
                    document.getElementById('theme-icon').value = '';
                    alert('Theme added!');
                }
            } catch (e) {
                console.error('Error adding theme:', e);
            }
        });

        document.getElementById('delete-theme-btn').addEventListener('click', () => {
            playSound('click');
            try {
                const themeName = document.getElementById('delete-theme').value;
                if (themeName && themeName !== 'default') {
                    themes = themes.filter(t => t.name !== themeName);
                    if (currentTheme === themeName) applyTheme('default');
                    updateThemeModal();
                    alert('Theme deleted!');
                }
            } catch (e) {
                console.error('Error deleting theme:', e);
            }
        });

        document.getElementById('add-emoji').addEventListener('click', () => {
            playSound('click');
            try {
                const x = document.getElementById('emoji-x').value.trim();
                const o = document.getElementById('emoji-o').value.trim();
                if (x && o) {
                    const styleName = `custom-${Date.now()}`;
                    emojiStyles[styleName] = { X: x, O: o };
                    updateThemeModal();
                    document.getElementById('emoji-x').value = '';
                    document.getElementById('emoji-o').value = '';
                    alert('Emoji style added!');
                }
            } catch (e) {
                console.error('Error adding emoji:', e);
            }
        });

        document.getElementById('delete-emoji-btn').addEventListener('click', () => {
            playSound('click');
            try {
                const style = document.getElementById('delete-emoji').value;
                if (style && style !== 'hearts') {
                    delete emojiStyles[style];
                    if (currentEmojiStyle === style) currentEmojiStyle = 'hearts';
                    updateThemeModal();
                    alert('Emoji style deleted!');
                }
            } catch (e) {
                console.error('Error deleting emoji:', e);
            }
        });

        document.getElementById('update-grid-animation').addEventListener('click', () => {
            playSound('click');
            try {
                const animation = document.getElementById('grid-animation').value;
                applyGridAnimation(animation);
                alert('Grid animation updated!');
            } catch (e) {
                console.error('Error updating grid animation:', e);
            }
        });

        document.getElementById('close-admin').addEventListener('click', () => {
            playSound('click');
            document.getElementById('admin-panel').classList.add('hidden');
        });
    } catch (e) {
        console.error('Error initializing event listeners:', e);
    }
}

try {
    createParticles();
    updateThemeModal();
    updateSupportMessages();
    createBoard();
    updateStatsDisplay();
    updateButtonStyles();
    initializeEventListeners();
    console.log('Game initialized successfully');
} catch (e) {
    console.error('Initialization error:', e);
}