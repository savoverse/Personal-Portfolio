// PRELOADER
      window.addEventListener("load", () => {
        setTimeout(() => {
          document.getElementById("preloader").classList.add("hidden");
          initAnimations();
        }, 100);
      });

      // CURSOR
      const cursor = document.getElementById("cursor"),
        cursorDot = document.getElementById("cursorDot");
      let mouseX = 0,
        mouseY = 0,
        cursorX = 0,
        cursorY = 0;
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX - 3 + "px";
        cursorDot.style.top = mouseY - 3 + "px";
      });
      function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX - 10 + "px";
        cursor.style.top = cursorY - 10 + "px";
        requestAnimationFrame(animateCursor);
      }
      animateCursor();
      document
        .querySelectorAll("a,button,.tilt-card,input,textarea")
        .forEach((el) => {
          el.addEventListener("mouseenter", () =>
            cursor.classList.add("hover"),
          );
          el.addEventListener("mouseleave", () =>
            cursor.classList.remove("hover"),
          );
        });

      // PARTICLES
      const pC = document.getElementById("particles-canvas"),
        pCtx = pC.getContext("2d");
      let particles = [];
      function resizeP() {
        pC.width = window.innerWidth;
        pC.height = window.innerHeight;
      }
      resizeP();
      window.addEventListener("resize", resizeP);
      class Particle {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * pC.width;
          this.y = Math.random() * pC.height;
          this.size = Math.random() * 2 + 0.5;
          this.speedX = (Math.random() - 0.5) * 0.4;
          this.speedY = (Math.random() - 0.5) * 0.4;
          this.opacity = Math.random() * 0.4 + 0.1;
          const c = ["0,212,255", "168,85,247", "6,255,210"];
          this.color = c[Math.floor(Math.random() * c.length)];
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          if (
            this.x < 0 ||
            this.x > pC.width ||
            this.y < 0 ||
            this.y > pC.height
          )
            this.reset();
        }
        draw() {
          pCtx.beginPath();
          pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          pCtx.fillStyle = `rgba(${this.color},${this.opacity})`;
          pCtx.fill();
        }
      }
      for (let i = 0; i < 70; i++) particles.push(new Particle());
      function animateP() {
        pCtx.clearRect(0, 0, pC.width, pC.height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
        for (let i = 0; i < particles.length; i++)
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x,
              dy = particles[i].y - particles[j].y,
              d = Math.sqrt(dx * dx + dy * dy);
            if (d < 100) {
              pCtx.beginPath();
              pCtx.strokeStyle = `rgba(0,212,255,${0.05 * (1 - d / 100)})`;
              pCtx.lineWidth = 0.5;
              pCtx.moveTo(particles[i].x, particles[i].y);
              pCtx.lineTo(particles[j].x, particles[j].y);
              pCtx.stroke();
            }
          }
        requestAnimationFrame(animateP);
      }
      animateP();

      // NAVBAR
      const navbar = document.getElementById("navbar");
      window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
      });
      function toggleMenu() {
        document.getElementById("menuToggle").classList.toggle("active");
        document.getElementById("navLinks").classList.toggle("open");
      }
      function closeMenu() {
        document.getElementById("menuToggle").classList.remove("active");
        document.getElementById("navLinks").classList.remove("open");
      }

      // TYPED TEXT
      const roles = [
        "Graphic Designer",
        "Video Editor",
        "Web Developer",
        "Web Designer",
        "Python Programmer",
        "Canva Designer",
        "Script Writer",
      ];
      let roleIndex = 0,
        charIndex = 0,
        isDeleting = false;
      const typedEl = document.getElementById("typedText");
      function typeEffect() {
        const c = roles[roleIndex];
        if (isDeleting) {
          typedEl.textContent = c.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typedEl.textContent = c.substring(0, charIndex + 1);
          charIndex++;
        }
        let s = isDeleting ? 30 : 80;
        if (!isDeleting && charIndex === c.length) {
          s = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          s = 500;
        }
        setTimeout(typeEffect, s);
      }
      typeEffect();

      // HERO 3D BACKGROUND
      const hC = document.getElementById("hero-3d-canvas"),
        hCtx = hC.getContext("2d");
      let hW,
        hH,
        hTime = 0;
      function resizeH() {
        const r = hC.parentElement.getBoundingClientRect();
        hW = hC.width = r.width;
        hH = hC.height = r.height;
      }
      resizeH();
      window.addEventListener("resize", resizeH);
      class V3 {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        rotY(a) {
          const c = Math.cos(a),
            s = Math.sin(a);
          return new V3(
            this.x * c + this.z * s,
            this.y,
            -this.x * s + this.z * c,
          );
        }
        rotX(a) {
          const c = Math.cos(a),
            s = Math.sin(a);
          return new V3(
            this.x,
            this.y * c - this.z * s,
            this.y * s + this.z * c,
          );
        }
        proj(w, h, f, d) {
          const s = f / (d + this.z);
          return {
            x: this.x * s + w / 2,
            y: -this.y * s + h / 2,
            z: this.z,
            s,
          };
        }
      }
      // DNA Helix
      function createHelix(r, h, turns, pts) {
        const v = [];
        const e = [];
        for (let i = 0; i < pts; i++) {
          const t = (i / pts) * Math.PI * 2 * turns;
          const y = (i / pts - 0.5) * h;
          v.push(new V3(Math.cos(t) * r, y, Math.sin(t) * r));
          v.push(
            new V3(Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r),
          );
          const idx = i * 2;
          if (i > 0) {
            e.push([idx - 2, idx]);
            e.push([idx - 1, idx + 1]);
          }
          if (i % 3 === 0) e.push([idx, idx + 1]);
        }
        return { v, e };
      }
      const helix = createHelix(150, 500, 3, 60);
      // Orbiting rings
      function createRing(R, pts) {
        const v = [];
        const e = [];
        for (let i = 0; i < pts; i++) {
          const a = (i / pts) * Math.PI * 2;
          v.push(new V3(Math.cos(a) * R, 0, Math.sin(a) * R));
          if (i > 0) e.push([i - 1, i]);
        }
        e.push([pts - 1, 0]);
        return { v, e };
      }
      const ring1 = createRing(200, 40);
      const ring2 = createRing(250, 50);
      let hMouseX = 0,
        hMouseY = 0;
      document.addEventListener("mousemove", (e) => {
        hMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        hMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
      // Floating energy particles
      const eParts = [];
      for (let i = 0; i < 30; i++)
        eParts.push({
          x: (Math.random() - 0.5) * 500,
          y: (Math.random() - 0.5) * 600,
          z: (Math.random() - 0.5) * 500,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.01 + 0.005,
          offset: Math.random() * Math.PI * 2,
          color: ["0,212,255", "168,85,247", "6,255,210"][
            Math.floor(Math.random() * 3)
          ],
        });

      function drawHero() {
        hCtx.clearRect(0, 0, hW, hH);
        hTime += 0.006;
        const rY = hTime * 0.3 + hMouseX * 0.2;
        const rX = hMouseY * 0.15;
        const fov = 400;
        const dist = 600;
        // Ring 1
        hCtx.strokeStyle = "rgba(0,212,255,0.08)";
        hCtx.lineWidth = 1;
        ring1.e.forEach(([a, b]) => {
          const va = ring1.v[a]
            .rotY(rY)
            .rotX(hTime * 0.2 + 0.3)
            .proj(hW / 2, hH / 2, fov, dist);
          const vb = ring1.v[b]
            .rotY(rY)
            .rotX(hTime * 0.2 + 0.3)
            .proj(hW / 2, hH / 2, fov, dist);
          hCtx.beginPath();
          hCtx.moveTo(va.x, va.y);
          hCtx.lineTo(vb.x, vb.y);
          hCtx.stroke();
        });
        // Ring 2
        hCtx.strokeStyle = "rgba(168,85,247,0.06)";
        ring2.e.forEach(([a, b]) => {
          const va = ring2.v[a]
            .rotY(-rY * 0.7)
            .rotX(hTime * 0.15 - 0.2)
            .proj(hW / 2, hH / 2, fov, dist);
          const vb = ring2.v[b]
            .rotY(-rY * 0.7)
            .rotX(hTime * 0.15 - 0.2)
            .proj(hW / 2, hH / 2, fov, dist);
          hCtx.beginPath();
          hCtx.moveTo(va.x, va.y);
          hCtx.lineTo(vb.x, vb.y);
          hCtx.stroke();
        });
        // DNA Helix
        helix.e.forEach(([a, b]) => {
          const va = helix.v[a].rotY(rY * 0.5).proj(hW / 2, hH / 2, fov, dist);
          const vb = helix.v[b].rotY(rY * 0.5).proj(hW / 2, hH / 2, fov, dist);
          const g = hCtx.createLinearGradient(va.x, va.y, vb.x, vb.y);
          g.addColorStop(0, "rgba(0,212,255,0.15)");
          g.addColorStop(1, "rgba(168,85,247,0.15)");
          hCtx.strokeStyle = g;
          hCtx.lineWidth = 0.8;
          hCtx.beginPath();
          hCtx.moveTo(va.x, va.y);
          hCtx.lineTo(vb.x, vb.y);
          hCtx.stroke();
        });
        // Energy particles
        eParts.forEach((p) => {
          const ox = p.x + Math.sin(hTime * 2 + p.offset) * 60;
          const oy = p.y + Math.cos(hTime * 1.5 + p.offset) * 60;
          const oz = p.z + Math.sin(hTime + p.offset) * 40;
          const pv = new V3(ox, oy, oz)
            .rotY(rY * 0.2)
            .proj(hW / 2, hH / 2, fov, dist);
          const glow = hCtx.createRadialGradient(
            pv.x,
            pv.y,
            0,
            pv.x,
            pv.y,
            p.size * 5,
          );
          glow.addColorStop(0, `rgba(${p.color},0.5)`);
          glow.addColorStop(1, `rgba(${p.color},0)`);
          hCtx.fillStyle = glow;
          hCtx.beginPath();
          hCtx.arc(pv.x, pv.y, p.size * 5, 0, Math.PI * 2);
          hCtx.fill();
        });
        requestAnimationFrame(drawHero);
      }
      drawHero();

      // SCROLL REVEAL
      function initAnimations() {
        const reveals = document.querySelectorAll(".reveal");
        const obs = new IntersectionObserver(
          (e) => {
            e.forEach((en) => {
              if (en.isIntersecting) en.target.classList.add("active");
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
        );
        reveals.forEach((el) => obs.observe(el));
        const skillBars = document.querySelectorAll(".skill-bar-fill");
        const sObs = new IntersectionObserver(
          (e) => {
            e.forEach((en) => {
              if (en.isIntersecting) {
                en.target.style.width =
                  en.target.getAttribute("data-width") + "%";
              }
            });
          },
          { threshold: 0.5 },
        );
        skillBars.forEach((b) => sObs.observe(b));
        animateCounters();
      }

      // COUNTERS
      function animateCounters() {
        const counters = document.querySelectorAll(
          ".count[data-target],.stat-number[data-count]",
        );
        const obs = new IntersectionObserver(
          (e) => {
            e.forEach((en) => {
              if (en.isIntersecting) {
                const t = parseInt(
                  en.target.getAttribute("data-target") ||
                    en.target.getAttribute("data-count"),
                );
                let c = 0;
                const inc = t / 60;
                const timer = setInterval(() => {
                  c += inc;
                  if (c >= t) {
                    c = t;
                    clearInterval(timer);
                  }
                  en.target.textContent = Math.floor(c) + "+";
                }, 25);
                obs.unobserve(en.target);
              }
            });
          },
          { threshold: 0.5 },
        );
        counters.forEach((c) => obs.observe(c));
      }

      // TILT
      document.querySelectorAll(".tilt-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const cx = r.width / 2;
          const cy = r.height / 2;
          const rx = (y - cy) / 12;
          const ry = (cx - x) / 12;
          card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform =
            "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        });
      });

      // SMOOTH SCROLL
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          const t = document.querySelector(this.getAttribute("href"));
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      // CONTACT
      function handleSubmit(e) {
        e.preventDefault();
        const b = e.target.querySelector(".form-submit");
        b.textContent = "Message Sent! ✓";
        b.style.background = "linear-gradient(135deg,#06ffd2,#00d4ff)";
        setTimeout(() => {
          b.textContent = "Send Message ✉";
          b.style.background = "";
          e.target.reset();
        }, 3000);
      }

      // PARALLAX
      window.addEventListener("scroll", () => {
        const s = window.scrollY;
        document.querySelectorAll(".hero-bg-glow").forEach((g, i) => {
          g.style.transform = `translate(${i === 2 ? "-50%,-50%" : "0,0"}) translateY(${s * (0.08 + i * 0.04)}px)`;
        });
      });

      // ACTIVE NAV
      const sections = document.querySelectorAll("section[id]");
      window.addEventListener("scroll", () => {
        let c = "";
        sections.forEach((s) => {
          if (window.scrollY >= s.offsetTop - 200) c = s.getAttribute("id");
        });
        document.querySelectorAll(".nav-links a").forEach((l) => {
          l.style.color = "";
          if (l.getAttribute("href") === "#" + c)
            l.style.color = "var(--neon-blue)";
        });
      });

      // Person image parallax on mouse
      const personImg = document.querySelector(".person-image");
      if (personImg) {
        document.addEventListener("mousemove", (e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 10;
          const y = (e.clientY / window.innerHeight - 0.5) * 5;
          personImg.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
        });
      }