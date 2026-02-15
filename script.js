const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('open-card-btn');
const music = document.getElementById('bg-music');
const typingText = document.getElementById('typing-text');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const message = "🎆 Năm mới 2026 🎆\nChúc em luôn tỏa sáng như những ánh pháo hoa rực rỡ trên bầu trời.\n💖 Vạn sự như ý, mã đáo thành công! 💫";

btn.addEventListener('click', () => {
    music.play();
    btn.style.display = 'none';
    typeWriter();
    animate();
});

// Hiệu ứng gõ chữ
function typeWriter() {
    let i = 0;
    function type() {
        if (i < message.length) {
            typingText.innerHTML += message.charAt(i);
            i++;
            setTimeout(type, 60);
        }
    }
    type();
}

// ----------- CLASS FIREWORK -----------
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.4);
        this.speed = Math.random() * 3 + 6;
        this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.alive = true;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.05;

        if (this.velocity.y >= 0 || this.y <= this.targetY) {
            explode(this.x, this.y);
            this.alive = false;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y);
        for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
    }
}

// ----------- CLASS PARTICLE -----------
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        this.alpha = 1;
        this.friction = 0.95;
        this.gravity = 0.18;
        this.size = Math.random() * 2 + 1.5;
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// ----------- EXPLODE -----------
let fireworks = [];
let particles = [];

function explode(x, y) {
    const hue = Math.random() * 360;
    for (let i = 0; i < 100; i++) {
        const color = `hsl(${hue + Math.random() * 30}, 100%, 60%)`;
        particles.push(new Particle(x, y, color));
    }
}

// ----------- ANIMATION LOOP -----------
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (!fw.alive) fireworks.splice(index, 1);
    });

    particles.forEach((p, index) => {
        if (p.alpha > 0) {
            p.update();
            p.draw();
        } else {
            particles.splice(index, 1);
        }
    });

    if (Math.random() < 0.04) {
        fireworks.push(new Firework());
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
