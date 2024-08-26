class Scene {
  constructor(
    canvasRef,
    player1SettingsRef,
    player2SettingsRef,
    startButtonRef,
    scorebarRef,
    mouseModeChangerRef,
    colorPickerRef
  ) {
    this.canvas = canvasRef.current;
    this.scorebar = scorebarRef.current;
    this.canvas.width = 500;
    this.canvas.height = 500;

    this.player1 = new Player({
      x: 20,
      y: 10,
      radius: 20,
      velocity: 1,
      freq: 1,
      settings: player1SettingsRef.current,
      canvas: canvasRef.current,
      addProjectile: this.addProjectile.bind(this),
      name: "player1",
      color: "green",
      colorPicker: colorPickerRef.current
    });

    this.player2 = new Player({
      x: this.canvas.width - 20,
      y: 10,
      radius: 20,
      velocity: 1,
      freq: 1,
      settings: player2SettingsRef.current,
      canvas: canvasRef.current,
      addProjectile: this.addProjectile.bind(this),
      name: "player2",
      color: "red",
      colorPicker: colorPickerRef.current
    });

    this.mouse = new Mouse({ canvas: canvasRef.current, modeChangerRef: mouseModeChangerRef });
    this.projectiles = [];

    this.canvas.addEventListener("click", (event) => {
      let mouseParams = this.mouse.getParams();
      let playerParams = this.player1.getParams();
      if (this.detectMouseCollision(mouseParams, playerParams) && this.mouse.mode === "cursor") {
        this.player1.pickColor()
      }

      playerParams = this.player2.getParams();
      if (this.detectMouseCollision(mouseParams, playerParams) && this.mouse.mode === "cursor") {
        this.player2.pickColor()
      }
    });

    
  }

  addProjectile(projectile) {
    this.projectiles.push(projectile);
  }

  detectMouseCollision(mouseParams, playerParams) {
    let distX = mouseParams.x - playerParams.x;
    let distY = mouseParams.y - playerParams.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    return distance < playerParams.radius + mouseParams.radius;
  }

  render() {
    //clear
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //detect collision
    let mouseParams = this.mouse.getParams();
    let param1 = this.player1.getParams();
    if (this.detectMouseCollision(mouseParams, param1) && this.mouse.mode === "ball") {
      if (mouseParams.y > param1.y && this.player1.velocity > 0) {
        this.player1.reverseVelocity();
      } else if (mouseParams.y < param1.y && this.player1.velocity < 0) {
        this.player1.reverseVelocity();
      }
    }

    let param2 = this.player2.getParams();
    if (this.detectMouseCollision(mouseParams, param2) && this.mouse.mode === "ball") {
      if (mouseParams.y > param2.y && this.player2.velocity > 0) {
        this.player2.reverseVelocity();
      } else if (mouseParams.y < param2.y && this.player2.velocity < 0) {
        this.player2.reverseVelocity();
      }
    }
    this.projectiles = this.projectiles.filter(
      (projectile) => projectile.x < this.canvas.width && projectile.x > 0
    )
    this.projectiles.forEach((projectile) => {
      if (projectile.detectCollision(this.player1)) {
        if (projectile.source === "player2") {
          this.player2.incrementScore();
          projectile.moveOutOfCanvas()
        }
      } else if (projectile.detectCollision(this.player2)) {
        if (projectile.source === "player1") {
            this.player1.incrementScore();
            projectile.moveOutOfCanvas()
          }
      }
    })
    this.projectiles = this.projectiles.filter(
        (projectile) => projectile != null
      )
    //render
    this.projectiles.forEach((projectile) => {
      projectile.render(ctx);
    });
    this.player1.render(ctx);
    this.player2.render(ctx);
    this.mouse.render(ctx);

    this.scorebar.children[0].innerHTML = this.player1.getScore();
    this.scorebar.children[1].innerHTML = this.player2.getScore();
  }
}

class Player {

  constructor({
    x,
    y,
    radius,
    velocity,
    freq,
    settings,
    canvas,
    color,
    addProjectile,
    name,
    colorPicker,
  }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.freq = freq;
    this.color = color;
    this.score = 0;
    this.canvas = canvas;
    this.velocityInput = settings.children[2];
    this.freqInput = settings.children[4];
    this.addProjectile = addProjectile;
    this.name = name;
    this.colorPicker = colorPicker;
    this.gun = setInterval(() => {
      this.fire();
    }, 5000 / this.freq);

    this.velocityInput.addEventListener("input", () => {
      this.setVelocity((this.velocityInput.value * 2) / 100);
    });

    this.freqInput.addEventListener("input", () => {
      this.setFreq(this.freqInput.value);
    });
  }
  setVelocity(velocity) {
    if (this.velocity >= 0) {
      this.velocity = velocity;
    } else if (this.velocity < 0) {
      this.velocity = -velocity;
    }
  }

  setColor(color) {
    this.color = color;
  }

  reverseVelocity() {
    this.velocity = -this.velocity;
  }

  getParams() {
    return {
      x: this.x,
      y: this.y,
      radius: this.radius,
      velocity: this.velocity,
      freq: this.freq,
    };
  }

  pickColor() {
    this.colorPicker.innerHTML = `
    <p>Цвет ${this.name}</p>
    <input type="color" value="${this.color} placeholder="Pick a color" />
    <button>✓</button>
    `;
    this.colorPicker.children[1].addEventListener("input", (e) => {
      this.setColor(e.target.value);
    });
    this.colorPicker.children[2].addEventListener("click", () => {
      this.colorPicker.innerHTML = "";
    })
  }

  setFreq(freq) {
    this.freq = freq;
    clearInterval(this.gun);
    this.gun = setInterval(() => {
      this.fire();
    }, 5000 / this.freq);
  }

  incrementScore() {
    this.score++;
  }

  getScore() {
    return this.score;
  }

  move() {
    this.y += this.velocity;
  }

  fire() {
    this.addProjectile(
      new Projectile({
        x: this.x,
        y: this.y,
        radius: 5,
        velocity: this.x < this.canvas.width / 2 ? 1 : -1,
        canvas: this.canvas,
        source: this.name,
        color: this.color,
      })
    );
  }

  detectCollision() {
    if (this.y + this.radius >= this.canvas.height) {
      this.y = this.canvas.height - this.radius;
      this.reverseVelocity();
    } else if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.reverseVelocity();
    }
  }

  render(ctx) {
    this.move();
    this.detectCollision();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

class Mouse {
  constructor({ canvas, modeChangerRef }) {
    this.x = 0;
    this.y = 0;
    this.canvas = canvas
    this.radius = 10;
    this.modeChanger = modeChangerRef.current;
    this.setMode('cursor');
    

    this.modeChanger.children[0].addEventListener("click", () => {
      this.setMode("cursor");
    });

    this.modeChanger.children[1].addEventListener("click", () => {
      this.setMode("ball");
    });

    window.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      this.x = event.clientX - rect.left - this.radius / 2;
      this.y = event.clientY - rect.top - this.radius / 2;
    });
  }
  getParams() {
    return {
      x: this.x,
      y: this.y,
      radius: this.radius,
    };
  }
  setMode(mode) {
    this.mode = mode;
    if (this.mode === "cursor") {
      this.canvas.style.cursor = "pointer";
    } else if (this.mode === "ball") {
      this.canvas.style.cursor = "none";
    }
  }
  getMode() {
    return this.mode;
  }
  render(ctx) {
    if (this.mode === "ball") {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  }
}

class Projectile {
  constructor({ x, y, velocity, canvas, source, color }) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.velocity = velocity;
    this.canvas = canvas;
    this.source = source;
    this.color = color;
  }

  detectCollision(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + object.radius;
  }

  move() {
    this.x += this.velocity;
  }

  moveOutOfCanvas() {
    this.x = this.canvas.width + this.radius;
    this.y = this.canvas.height + this.radius;
  }

  render(ctx) {
    this.move();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

export default Scene;
