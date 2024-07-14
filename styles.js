const gameArea = document.getElementById('gameArea');
const tank = document.getElementById('tank');
const scoreDisplay = document.getElementById('score');
let score = 0;
let tankX = 280;
let tankY = 280;
let tankAngle = 0;
const enemies = [];
const bullets = [];
const enemyBullets = [];

function updateTankPosition() {
    tank.style.left = `${tankX}px`;
    tank.style.top = `${tankY}px`;
    tank.style.transform = `rotate(${tankAngle}deg)`;
}

function handleKeydown(event) {
    switch(event.key) {
        case 'ArrowUp':
            tankX += 5 * Math.cos(tankAngle * Math.PI / 180);
            tankY += 5 * Math.sin(tankAngle * Math.PI / 180);
            break;
        case 'ArrowDown':
            tankX -= 5 * Math.cos(tankAngle * Math.PI / 180);
            tankY -= 5 * Math.sin(tankAngle * Math.PI / 180);
            break;
        case 'ArrowLeft':
            tankAngle -= 5;
            break;
        case 'ArrowRight':
            tankAngle += 5;
            break;
        case ' ':
            shoot();
            break;
    }
    updateTankPosition();
}

function shoot() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${tankX + 20}px`;
    bullet.style.top = `${tankY + 20}px`;
    gameArea.appendChild(bullet);

    bullets.push({
        element: bullet,
        x: tankX + 20,
        y: tankY + 20,
        angle: tankAngle
    });
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'tank enemy';
    enemy.style.left = `${Math.random() * 560}px`;
    enemy.style.top = `${Math.random() * 560}px`;
    gameArea.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: parseFloat(enemy.style.left),
        y: parseFloat(enemy.style.top),
        angle: Math.random() * 360,
        health: 3
    });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += 2 * Math.cos(enemy.angle * Math.PI / 180);
        enemy.y += 2 * Math.sin(enemy.angle * Math.PI / 180);

        // Change direction if hit the boundary
        if (enemy.x <= 0 || enemy.x >= 560 || enemy.y <= 0 || enemy.y >= 560) {
            enemy.angle = (enemy.angle + 180) % 360;
        }

        // Enemy shooting
        if (Math.random() < 0.02) {
            enemyShoot(enemy);
        }

        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;
        enemy.element.style.transform = `rotate(${enemy.angle}deg)`;
    });
}

function enemyShoot(enemy) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${enemy.x + 20}px`;
    bullet.style.top = `${enemy.y + 20}px`;
    gameArea.appendChild(bullet);

    enemyBullets.push({
        element: bullet,
        x: enemy.x + 20,
        y: enemy.y + 20,
        angle: enemy.angle
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += 5 * Math.cos(bullet.angle * Math.PI / 180);
        bullet.y += 5 * Math.sin(bullet.angle * Math.PI / 180);
        bullet.element.style.left = `${bullet.x}px`;
        bullet.element.style.top = `${bullet.y}px`;

        // Check collisions with enemies
        enemies.forEach(enemy => {
            if (bullet.x > enemy.x && bullet.x < enemy.x + 40 && bullet.y > enemy.y && bullet.y < enemy.y + 40) {
                enemy.health--;
                if (enemy.health <= 0) {
                    enemy.element.remove();
                    enemies.splice(enemies.indexOf(enemy), 1);
                    score++;
                    scoreDisplay.innerText = `Score: ${score}`;
                }
                bullet.element.remove();
                bullets.splice(index, 1);
            }
        });

        // Remove bullet if it goes out of game area
        if (bullet.x < 0 || bullet.x > 600 || bullet.y < 0 || bullet.y > 600) {
            bullet.element.remove();
            bullets.splice(index, 1);
        }
    });

    enemyBullets.forEach((bullet, index) => {
        bullet.x += 5 * Math.cos(bullet.angle * Math.PI / 180);
        bullet.y += 5 * Math.sin(bullet.angle * Math.PI / 180);
        bullet.element.style.left = `${bullet.x}px`;
        bullet.element.style.top = `${bullet.y}px`;

        // Check collisions with player tank
        if (bullet.x > tankX && bullet.x < tankX + 40 && bullet.y > tankY && bullet.y < tankY + 40) {
            alert('Game Over!');
            location.reload();
        }

        // Remove bullet if it goes out of game area
        if (bullet.x < 0 || bullet.x > 600 || bullet.y < 0 || bullet.y > 600) {
            bullet.element.remove();
            enemyBullets.splice(index, 1);
        }
    });
}

function gameLoop() {
    moveEnemies();
    moveBullets();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleKeydown);
updateTankPosition();
createEnemy();
createEnemy();
createEnemy();
gameLoop();