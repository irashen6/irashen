let gameStarted = false;
let playerX = 400;
let playerY = 250;
let speed = 5;
let bubbles = [];
let itemsCollected = 0;

const player = document.getElementById('player');

// 键盘控制
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
    
    document.querySelector('.game-canvas').appendChild(bubble);
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
    const items = document.querySelectorAll('.powerup');
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

function startGame() {
    gameStarted = true;
    player.style.animation = 'none';
    player.style.animation = 'playerMove 0.2s steps(4) infinite';
    
    // 添加粒子效果
    createParticles();
}

function resetGame() {
    gameStarted = false;
    playerX = 400;
    playerY = 250;
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
    itemsCollected = 0;
    
    // 清除所有气泡
    bubbles.forEach(b => b.element.remove());
    bubbles = [];
    
    // 重新生成道具
    regenerateItems();
}

function regenerateItems() {
    const itemsContainer = document.querySelector('.items');
    itemsContainer.innerHTML = `
        <div class="item powerup" data-type="speed"></div>
        <div class="item powerup" data-type="bomb"></div>
        <div class="item powerup" data-type="range"></div>
    `;
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
            
            document.querySelector('.game-canvas').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 4000);
        }, i * 100);
    }
}

// 添加CSS动画
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

// 初始化
console.log('Irashen QQ堂风格主页已加载！');
console.log('使用方向键或WASD移动，空格键放泡泡');

// 自动播放背景音乐（模拟）
function playBackgroundMusic() {
    console.log('🎵 背景音乐播放中...');
}

// 鼠标跟随效果
document.addEventListener('mousemove', (e) => {
    const canvas = document.querySelector('.game-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 创建跟随粒子
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

// 添加轨迹动画
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5); }
    }
`;
document.head.appendChild(trailStyle);