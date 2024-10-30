
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const urlParams = new URLSearchParams(window.location.search);
    const friendNameFromURL = urlParams.get('name');
    if (friendNameFromURL) {
      document.getElementById('welcomeScreen').style.display = 'none';
      updateGreeting(decodeURIComponent(friendNameFromURL));
    }
    
    function startCelebration() {
      const friendName = document.getElementById('friendName').value.trim();
      if (friendName) {
        document.getElementById('welcomeScreen').style.display = 'none';
        updateGreeting(friendName);
      } else {
        alert('Please enter your friend\'s name!');
      }
    }

    function updateGreeting(name) {
      const greetingText = document.getElementById('greetingText');
      greetingText.innerHTML = `Dear <span class="friend-name">${name}</span>,<br>
        Wishing you a very Happy Diwali 2024!<br>
        🪔✨ May this festival of lights bring<br>joy, prosperity, and happiness to your life! ✨🪔`;
    }

    function shareWishes() {
      const friendName = document.getElementById('friendName').value;
      const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(friendName)}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Happy Diwali 2024!',
          text: `Click to see your personalized Diwali wishes!`,
          url: shareUrl
        });
      } else {
        navigator.clipboard.writeText(shareUrl)
          .then(() => alert('Link copied to clipboard! Share it with your friends!'))
          .catch(() => alert('Failed to copy link. Please try again.'));
      }
    }
    
    class Firework {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.speed = 3 + Math.random() * 3;
        this.particles = [];
        this.hue = Math.random() * 360;
        this.exploded = false;
      }
      
      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          
          if (this.y <= this.targetY) {
            this.explode();
          }
        } else {
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.alpha -= 0.01;
            
            if (p.alpha <= 0) {
              this.particles.splice(i, 1);
            }
          }
          
          if (this.particles.length === 0) {
            this.reset();
          }
        }
      }
      
      explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
          const angle = (Math.PI * 2 * i) / 50;
          const speed = 2 + Math.random() * 2;
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1
          });
        }
      }
      
      draw() {
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
          ctx.fill();
        } else {
          for (const p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${p.alpha})`;
            ctx.fill();
          }
        }
      }
    }
    
    const fireworks = Array(5).fill().map(() => new Firework());
    
    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      fireworks.forEach(fw => {
        fw.update();
        fw.draw();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  