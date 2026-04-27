let gameStarted = true;
let playerX = 400;
let playerY = 250;
let speed = 15;
let bubbles = [];
let itemsCollected = 0;

const player = document.getElementById('player');
const grid = document.getElementById('grid');
const itemsContainer = document.getElementById('items');

function generateRandomGrid() {
    grid.innerHTML = '';
    const wallCount = 20 + Math.floor(Math.random() * 30);

    for (let i = 0; i < 70; i++) {
        const wall = document.createElement('div');
        wall.className = 'wall';
        wall.dataset.index = i;
        grid.appendChild(wall);
    }

    const walls = grid.querySelectorAll('.wall');
    const indices = Array.from({ length: 70 }, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    for (let i = 0; i < wallCount; i++) {
        if (indices[i] !== 0 && indices[i] !== 1) {
            walls[indices[i]].style.background = 'linear-gradient(135deg, #8B4513, #A0522D)';
        }
    }
}

function generateRandomItems() {
    itemsContainer.innerHTML = '';
    const itemTypes = ['speed', 'bomb', 'range'];
    const itemEmojis = { speed: '⚡', bomb: '💣', range: '🔥' };

    for (let i = 0; i < 3; i++) {
        const item = document.createElement('div');
        item.className = 'item powerup';
        item.dataset.type = itemTypes[i];
        item.innerHTML = itemEmojis[itemTypes[i]];
        item.style.position = 'absolute';
        item.style.left = (50 + Math.random() * 700) + 'px';
        item.style.top = (120 + Math.random() * 280) + 'px';
        itemsContainer.appendChild(item);
    }
}

generateRandomGrid();
generateRandomItems();

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            movePlayer(0, -speed);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            movePlayer(0, speed);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            movePlayer(-speed, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            movePlayer(speed, 0);
            break;
        case ' ':
            placeBubble();
            break;
    }
});

function movePlayer(dx, dy) {
    playerX = Math.max(20, Math.min(780, playerX + dx));
    playerY = Math.max(100, Math.min(440, playerY + dy));

    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    checkItemCollision();
}

function placeBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'placed-bubble';
    bubble.style.left = playerX + 'px';
    bubble.style.top = playerY + 'px';
    bubble.innerHTML = '💣';
    bubble.style.fontSize = '40px';
    bubble.style.position = 'absolute';
    bubble.style.animation = 'bubblePulse 0.5s ease-in-out infinite';

    document.getElementById('game-canvas').appendChild(bubble);
    bubbles.push({ element: bubble, x: playerX, y: playerY, time: 0 });

    setTimeout(() => {
        explodeBubble(bubble);
    }, 3000);
}

function explodeBubble(bubble) {
    bubble.style.animation = 'none';
    bubble.innerHTML = '💥';
    bubble.style.transform = 'scale(2)';

    setTimeout(() => {
        bubble.remove();
    }, 500);
}

function checkItemCollision() {
    const items = itemsContainer.querySelectorAll('.powerup');
    items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (isColliding(playerRect, rect)) {
            item.style.animation = 'collectItem 0.5s ease-out forwards';
            itemsCollected++;
            updateScore();

            setTimeout(() => {
                item.remove();
            }, 500);
        }
    });
}

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function updateScore() {
    console.log('Items collected:', itemsCollected);
}

function createParticles() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 900 + 'px';
            particle.style.top = '0px';
            particle.innerHTML = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
            particle.style.position = 'absolute';
            particle.style.fontSize = '20px';
            particle.style.animation = 'particleFall ' + (2 + Math.random() * 2) + 's linear forwards';
            particle.style.pointerEvents = 'none';

            document.getElementById('game-canvas').appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 4000);
        }, i * 100);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes playerMove {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }

    @keyframes bubblePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    @keyframes collectItem {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2) translateY(-30px); opacity: 0; }
    }

    @keyframes particleFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Irashen QQ堂风格主页已加载！');
console.log('使用方向键或WASD移动，空格键放泡泡');

document.addEventListener('mousemove', (e) => {
    const canvas = document.getElementById('game-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (Math.random() > 0.9) {
        const trail = document.createElement('div');
        trail.style.position = 'absolute';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        trail.innerHTML = '✨';
        trail.style.fontSize = '16px';
        trail.style.pointerEvents = 'none';
        trail.style.animation = 'trailFade 0.5s ease-out forwards';
        trail.style.zIndex = '1000';

        canvas.appendChild(trail);

        setTimeout(() => trail.remove(), 500);
    }
});

const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5); }
    }
`;
document.head.appendChild(trailStyle);