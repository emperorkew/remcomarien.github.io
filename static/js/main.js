/* ============================================
   Remco Marien — Interactive Portfolio
   ============================================ */

(function () {
  'use strict';

  // === Theme ===
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) {
    html.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // === Custom Cursor ===
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

  if (cursor && trail && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Grow cursor on interactive elements
    document.querySelectorAll('a, button, .magnetic, input[type="range"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-grow');
        trail.classList.add('trail-grow');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-grow');
        trail.classList.remove('trail-grow');
      });
    });
  }

  // === Scroll Progress ===
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      progressBar.style.transform = `scaleX(${scrolled})`;
    });
  }

  // === Scroll Reveal ===
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // === Scroll Hint hide ===
  const scrollHint = document.getElementById('scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) scrollHint.classList.add('hidden');
    }, { passive: true });
  }

  // === P&ID Parallax ===
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroBg.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // === Magnetic Buttons ===
  document.querySelectorAll('.magnetic').forEach(el => {
    const strength = parseInt(el.dataset.strength) || 20;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x / strength * 2}px, ${y / strength * 2}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => el.style.transition = '', 400);
    });
  });


  // === Typing Effect ===
  const typed = document.getElementById('typed');
  if (typed) {
    const words = ['pharma engineer', 'reactor whisperer', 'process nerd', 'data wrangler', 'automation addict', 'embedded systems', 'real-time control'];
    let wordIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
      const word = words[wordIdx];
      if (!deleting) {
        typed.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
        setTimeout(typeLoop, 70 + Math.random() * 40);
      } else {
        typed.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          setTimeout(typeLoop, 300);
          return;
        }
        setTimeout(typeLoop, 35);
      }
    }
    typeLoop();
  }

  // === Counter Animation ===
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        if (!target) return;
        let current = 0;
        const step = target / 40;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = Math.round(current) + suffix;
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // === Live Sensor & DCS Simulation ===
  function simulateProcess() {
    const els = {
      temp: document.getElementById('sv-temp'),
      pres: document.getElementById('sv-pres'),
      flow: document.getElementById('sv-flow'),
      level: document.getElementById('sv-level'),
      dcsT: document.getElementById('dcs-t1'),
      dcsP: document.getElementById('dcs-p1'),
      dcsF: document.getElementById('dcs-f1'),
      dcsYield: document.getElementById('dcs-yield'),
      modbus: document.getElementById('dcs-modbus')
    };
    if (!els.temp) return;

    let t = 342.7, p = -0.85, f = 14.8, l = 67.2, y = 87.3;

    function update() {
      t += (Math.random() - 0.5) * 0.5;
      p += (Math.random() - 0.5) * 0.02;
      f += (Math.random() - 0.5) * 0.3;
      l += (Math.random() - 0.5) * 0.3;
      y += (Math.random() - 0.5) * 0.2;
      t = Math.max(338, Math.min(348, t));
      p = Math.max(-0.92, Math.min(-0.78, p));
      f = Math.max(13, Math.min(16.5, f));
      l = Math.max(60, Math.min(75, l));
      y = Math.max(85, Math.min(92, y));

      els.temp.textContent = t.toFixed(1);
      els.pres.textContent = p.toFixed(2);
      els.flow.textContent = f.toFixed(1);
      els.level.textContent = l.toFixed(1);

      if (els.dcsT) els.dcsT.textContent = t.toFixed(1) + ' K';
      if (els.dcsP) els.dcsP.textContent = p.toFixed(2) + ' bar';
      if (els.dcsF) els.dcsF.textContent = f.toFixed(1) + ' m\u00B3/h';
      if (els.dcsYield) els.dcsYield.textContent = y.toFixed(1) + '%';

      // Fake Modbus frames in DCS panel
      if (els.modbus) {
        const bytes = Array.from({length: 6}, () =>
          Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
        );
        els.modbus.textContent = 'TX: ' + bytes.join(' ');
      }
    }

    setInterval(update, 1100);
  }
  simulateProcess();

  // === MODBUS Frame Inspector Animation ===
  function animateModbus() {
    const ids = ['mb-addr','mb-func','mb-regh','mb-regl','mb-cnth','mb-cntl','mb-crch','mb-crcl'];
    const els = ids.map(id => document.getElementById(id));
    if (!els[0]) return;

    const funcs = ['01','02','03','04','05','06'];
    function update() {
      const addr = (Math.floor(Math.random() * 5) + 1).toString(16).padStart(2,'0').toUpperCase();
      const func = funcs[Math.floor(Math.random() * funcs.length)];
      const regH = '00';
      const regL = (Math.floor(Math.random() * 30) + 1).toString(16).padStart(2,'0').toUpperCase();
      const cntH = '00';
      const cntL = (Math.floor(Math.random() * 8) + 1).toString(16).padStart(2,'0').toUpperCase();
      const crcH = Math.floor(Math.random() * 256).toString(16).padStart(2,'0').toUpperCase();
      const crcL = Math.floor(Math.random() * 256).toString(16).padStart(2,'0').toUpperCase();

      const vals = [addr, func, regH, regL, cntH, cntL, crcH, crcL];
      els.forEach((el, i) => {
        if (el) el.textContent = vals[i];
      });
    }

    setInterval(update, 2500);
  }
  animateModbus();

  // === Reaction Rate Demo ===
  const tempSlider = document.getElementById('temp-slider');
  const concSlider = document.getElementById('conc-slider');
  const eaSlider = document.getElementById('ea-slider');
  const reactionCanvas = document.getElementById('reaction-canvas');

  if (tempSlider && concSlider && eaSlider && reactionCanvas) {
    const ctx = reactionCanvas.getContext('2d');
    const R = 8.314; // Gas constant
    const A = 1e8; // Pre-exponential factor

    function updateDemo() {
      const T = parseInt(tempSlider.value);
      const C = parseInt(concSlider.value) / 10;
      const Ea = parseInt(eaSlider.value) * 1000;

      document.getElementById('temp-value').textContent = T + ' K';
      document.getElementById('conc-value').textContent = C.toFixed(1) + ' mol/L';
      document.getElementById('ea-value').textContent = (Ea / 1000).toFixed(0) + ' kJ/mol';

      // Arrhenius equation
      const k = A * Math.exp(-Ea / (R * T));
      const rate = k * C;

      document.getElementById('rate-k').textContent = k.toExponential(2) + ' s\u207B\u00B9';
      document.getElementById('rate-r').textContent = rate.toExponential(2) + ' mol/(L\u00B7s)';

      // Draw graph: rate vs temperature curve
      drawGraph(T, C, Ea);
    }

    function drawGraph(currentT, C, Ea) {
      const w = reactionCanvas.width;
      const h = reactionCanvas.height;
      const dpr = window.devicePixelRatio || 1;
      reactionCanvas.width = reactionCanvas.offsetWidth * dpr;
      reactionCanvas.height = reactionCanvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      const cw = reactionCanvas.offsetWidth;
      const ch = reactionCanvas.offsetHeight;

      ctx.clearRect(0, 0, cw, ch);

      const isDarkMode = html.getAttribute('data-theme') === 'dark';
      const gridColor = isDarkMode ? 'rgba(168,162,158,0.1)' : 'rgba(87,83,78,0.06)';
      const textColor = isDarkMode ? '#a8a29e' : '#57534e';
      const lineColor = isDarkMode ? '#f59e0b' : '#b45309';
      const dotColor = isDarkMode ? '#5eead4' : '#0f766e';

      // Grid
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = (ch / 5) * i;
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(cw - 10, y); ctx.stroke();
      }

      // Axes labels
      ctx.fillStyle = textColor;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('T (K)', cw / 2, ch - 4);
      ctx.save();
      ctx.translate(10, ch / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Rate', 0, 0);
      ctx.restore();

      // Rate vs T curve
      const points = [];
      let maxRate = 0;
      for (let T = 250; T <= 500; T += 2) {
        const k = A * Math.exp(-Ea / (R * T));
        const r = k * C;
        points.push({ T, r });
        if (r > maxRate) maxRate = r;
      }

      if (maxRate === 0) maxRate = 1;
      const padX = 50, padY = 20;
      const graphW = cw - padX - 20;
      const graphH = ch - padY * 2;

      // Draw curve
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;
      points.forEach((p, i) => {
        const x = padX + ((p.T - 250) / 250) * graphW;
        const y = padY + graphH - (p.r / maxRate) * graphH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Gradient fill under curve
      const gradient = ctx.createLinearGradient(0, padY, 0, ch - padY);
      gradient.addColorStop(0, isDarkMode ? 'rgba(245,158,11,0.12)' : 'rgba(180,83,9,0.08)');
      gradient.addColorStop(1, 'transparent');
      ctx.lineTo(padX + graphW, padY + graphH);
      ctx.lineTo(padX, padY + graphH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Current point
      const currentK = A * Math.exp(-Ea / (R * currentT));
      const currentRate = currentK * C;
      const cx2 = padX + ((currentT - 250) / 250) * graphW;
      const cy2 = padY + graphH - (currentRate / maxRate) * graphH;

      // Pulse
      ctx.beginPath();
      ctx.arc(cx2, cy2, 12, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? 'rgba(94,234,212,0.15)' : 'rgba(15,118,110,0.1)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx2, cy2, 5, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // T labels
      ctx.fillStyle = textColor;
      ctx.font = '9px JetBrains Mono, monospace';
      [250, 350, 450].forEach(t => {
        const x = padX + ((t - 250) / 250) * graphW;
        ctx.fillText(t + '', x - 8, ch - padY + 14);
      });
    }

    tempSlider.addEventListener('input', updateDemo);
    concSlider.addEventListener('input', updateDemo);
    eaSlider.addEventListener('input', updateDemo);
    updateDemo();

    // Redraw on theme change
    if (toggle) {
      toggle.addEventListener('click', () => setTimeout(updateDemo, 50));
    }
  }

  // === Tilt effect on cards ===
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  // === Header hide on scroll ===
  let lastScroll = 0;
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 100) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScroll = current;
    }, { passive: true });
  }

})();
