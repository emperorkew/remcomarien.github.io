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
      html.classList.add('theme-transitioning');
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      setTimeout(() => html.classList.remove('theme-transitioning'), 500);
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


  // === HMI Boot Sequence ===
  const bootOverlay = document.getElementById('hmi-boot');
  const heroText = document.querySelector('.hero-text');
  if (bootOverlay && heroText && !sessionStorage.getItem('booted')) {
    heroText.classList.add('booting');
    var bootLines = bootOverlay.querySelectorAll('.boot-line');
    var progressFill = document.getElementById('boot-progress-fill');
    var totalDelay = 0;
    bootLines.forEach(function(line, i) {
      var d = parseInt(line.dataset.delay) || 0;
      totalDelay = Math.max(totalDelay, d);
      setTimeout(function() {
        line.classList.add('visible');
        if (progressFill) progressFill.style.width = Math.round(((i + 1) / bootLines.length) * 100) + '%';
      }, d + 100);
    });
    setTimeout(function() {
      bootOverlay.classList.add('done');
      heroText.classList.remove('booting');
      sessionStorage.setItem('booted', '1');
    }, totalDelay + 600);
  } else if (bootOverlay) {
    bootOverlay.style.display = 'none';
  }

  // === HMI Clock ===
  const hmiClock = document.getElementById('hmi-clock');
  if (hmiClock) {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      hmiClock.textContent = 'BATCH-2026-0137  ' + h + ':' + m + ':' + s;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

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

  // === Hero Statusbar Live Simulation ===
  function simulateProcess() {
    const heroTemp = document.getElementById('hero-temp');
    const heroFlow = document.getElementById('hero-flow');
    const heroYield = document.getElementById('hero-yield');
    if (!heroTemp) return;

    let t = 342.7, f = 14.8, y = 87.3;

    function update() {
      t += (Math.random() - 0.5) * 0.5;
      f += (Math.random() - 0.5) * 0.3;
      y += (Math.random() - 0.5) * 0.2;
      t = Math.max(338, Math.min(348, t));
      f = Math.max(13, Math.min(16.5, f));
      y = Math.max(85, Math.min(92, y));

      heroTemp.textContent = t.toFixed(1) + ' K';
      heroFlow.textContent = f.toFixed(1) + ' m\u00B3/h';
      heroYield.textContent = y.toFixed(1) + '%';
    }

    setInterval(update, 1100);

    // COMM status flicker
    const heroComm = document.getElementById('hero-comm');
    if (heroComm) {
      const commStates = ['OK', 'TX', 'RX', 'POLL', 'OK', 'OK', 'OK'];
      setInterval(() => {
        const state = commStates[Math.floor(Math.random() * commStates.length)];
        heroComm.textContent = state;
        if (state !== 'OK') {
          heroComm.style.color = 'var(--accent)';
          setTimeout(() => { heroComm.style.color = ''; }, 300);
        }
      }, 2000);
    }
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
        if (el && el.textContent !== vals[i]) {
          el.textContent = vals[i];
          el.style.transition = 'none';
          el.style.color = 'var(--accent)';
          requestAnimationFrame(() => {
            el.style.transition = 'color 1.5s';
            el.style.color = '';
          });
        }
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

      // CSTR live calculation
      const cstrK = document.getElementById('cstr-k');
      if (cstrK) {
        const V = 2500; // 2.5 m³ = 2500 L
        const tau = (rate > 0) ? C / rate : Infinity;
        cstrK.textContent = k.toExponential(2);
        document.getElementById('cstr-rate').textContent = rate.toExponential(2);
        document.getElementById('cstr-tau').textContent = isFinite(tau) ? tau.toFixed(2) : '\u221E';
      }

      // Sync hero statusbar with demo values
      const heroTemp = document.getElementById('hero-temp');
      if (heroTemp) {
        heroTemp.textContent = T.toFixed(1) + ' K';
      }

      // Draw graph: rate vs temperature curve
      drawGraph(T, C, Ea);
    }

    let canvasReady = false;
    function setupCanvas() {
      const dpr = window.devicePixelRatio || 1;
      reactionCanvas.width = reactionCanvas.offsetWidth * dpr;
      reactionCanvas.height = reactionCanvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasReady = true;
    }
    setupCanvas();
    window.addEventListener('resize', () => { setupCanvas(); updateDemo(); });

    function drawGraph(currentT, C, Ea) {
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

    if (toggle) {
      toggle.addEventListener('click', () => {
        reactionCanvas.style.transition = 'opacity 0.2s';
        reactionCanvas.style.opacity = '0';
        setTimeout(() => {
          updateDemo();
          reactionCanvas.style.opacity = '1';
        }, 200);
      });
    }
  }

  // === P&ID Equipment Popups ===
  const pidData = {
    'V-101': {
      name: 'Feed Tank',
      type: 'Vertical Storage Vessel',
      desc: 'Stores the starting material solution before feeding to the reactor. Equipped with vent, drain valve, and level indication.',
      specs: [
        ['Volume', '3.0 m\u00B3'],
        ['Material', '316L SS'],
        ['Design P', '0.5 barg'],
      ],
      fact: 'In pharma, every vessel needs documented CIP (Clean-In-Place) procedures. A single residue from a previous batch can invalidate an entire production run \u2014 and that\u2019s a very expensive mistake.'
    },
    'P-101': {
      name: 'Feed Pump',
      type: 'Centrifugal Pump',
      desc: 'Transfers feed solution from V-101 through the preheater into the reactor at a controlled flow rate.',
      specs: [
        ['Flow', '2.5 m\u00B3/h'],
        ['Head', '15 m'],
        ['Power', '1.5 kW'],
      ],
      fact: 'Pump seal design is critical in pharma \u2014 mechanical seals prevent product contamination AND protect operators from exposure to potent API compounds. A leaking seal can shut down an entire facility.'
    },
    'E-101': {
      name: 'Preheater',
      type: 'Shell & Tube Heat Exchanger',
      desc: 'Heats the feed stream to the target reactor inlet temperature using plant steam on the shell side.',
      specs: [
        ['Duty', '45 kW'],
        ['Area', '2.8 m\u00B2'],
        ['LMTD', '28 K'],
      ],
      fact: 'Precise inlet temperature control can determine which crystal polymorph forms. A 2\u00B0C difference at the wrong moment created a $250M problem for Abbott\u2019s Ritonavir in 1998.'
    },
    'R-101': {
      name: 'CSTR Reactor',
      type: 'Jacketed Continuous Stirred Tank Reactor',
      desc: 'The heart of the process. Performs the API synthesis reaction under controlled temperature, pressure, and agitation. Equipped with dual impellers, baffles, cooling jacket, and safety relief valve.',
      specs: [
        ['Volume', '2.5 m\u00B3'],
        ['Temp', '340 K'],
        ['Speed', '180 RPM'],
      ],
      fact: 'The baffles aren\u2019t decorative \u2014 without them, the liquid would just spin in a vortex and barely mix. Four baffles at 90\u00B0 spacing convert rotational flow into turbulent radial mixing. The difference in reaction yield can be 20%+.'
    },
    'E-102': {
      name: 'Cooler',
      type: 'Shell & Tube Heat Exchanger',
      desc: 'Cools the reactor product stream before crystallization. The cooling rate is critical \u2014 it directly affects crystal nucleation and growth.',
      specs: [
        ['Duty', '60 kW'],
        ['CW Flow', '8 m\u00B3/h'],
        ['Tout', '285 K'],
      ],
      fact: 'Cooling too fast creates millions of tiny crystal nuclei (fines) that are impossible to filter. Too slow and you get a few massive crystals with impurities trapped inside. The cooling profile is often the most critical CPP in the entire process.'
    },
    'CR-101': {
      name: 'Crystallizer',
      type: 'Draft Tube Baffle Crystallizer',
      desc: 'Controlled crystallization of the API from the cooled solution. Temperature profile and agitation determine crystal size distribution and polymorph form.',
      specs: [
        ['Volume', '1.8 m\u00B3'],
        ['Temp', '278 K'],
        ['Yield', '87%'],
      ],
      fact: 'The same molecule can crystallize into different polymorphs \u2014 same atoms, different arrangement. Polymorph II of a drug might dissolve 10x faster than Polymorph I, completely changing its bioavailability. Controlling which form you get is both an art and a science.'
    },
    'CF-101': {
      name: 'Centrifuge',
      type: 'Peeler Centrifuge',
      desc: 'Separates API crystals from the mother liquor by centrifugal force. The mother liquor is recycled back to recover dissolved product.',
      specs: [
        ['Speed', '1200 RPM'],
        ['G-force', '800 G'],
        ['Cake', '~120 kg'],
      ],
      fact: 'The mother liquor recycle is an economic necessity but a quality nightmare \u2014 impurities accumulate with each recycle pass. Process engineers use "purge ratios" to balance yield against impurity buildup across campaigns.'
    },
    'D-101': {
      name: 'Vacuum Dryer',
      type: 'Agitated Vacuum Dryer',
      desc: 'Removes residual solvent from the wet crystal cake under vacuum with nitrogen sweep. Lower pressure means lower boiling point, protecting heat-sensitive APIs.',
      specs: [
        ['Pressure', '50 mbar'],
        ['Temp', '313 K'],
        ['LOD', '<0.5%'],
      ],
      fact: 'ICH Q3C sets strict limits on residual solvents in APIs. Class 2 solvents (like dichloromethane) must be below 600 ppm. That\u2019s like finding 6 specific grains of sand in 10,000 \u2014 and your patients\u2019 safety depends on hitting that target.'
    },
    'FIC-103': {
      name: 'Flow Controller',
      type: 'Flow Indicator Controller',
      desc: 'Controls feed flow rate to the reactor via the control valve. The flow totalizer tracks exact amounts for the batch record.',
      specs: [
        ['Range', '0\u201310 m\u00B3/h'],
        ['Signal', '4\u201320 mA'],
        ['Action', 'Reverse'],
      ],
      fact: 'In GMP manufacturing, the flow totalizer reading is a legal document. If the batch record says 2,500.0 L of reagent A was added, that number goes to the FDA. No pressure.'
    },
    'TI-104': {
      name: 'Temperature Indicator',
      type: 'RTD Temperature Sensor (Pt100)',
      desc: 'Monitors preheater outlet temperature. Provides feedback for steam valve adjustment.',
      specs: [
        ['Range', '0\u2013200 \u00B0C'],
        ['Accuracy', '\u00B10.1 K'],
        ['Element', 'Pt100'],
      ],
      fact: 'Pt100 sensors use the fact that platinum\u2019s electrical resistance changes linearly with temperature. At 0\u00B0C it\u2019s exactly 100\u03A9 \u2014 hence the name. Pharma prefers them over thermocouples for their stability and accuracy.'
    },
    'TIC-101': {
      name: 'Reactor Temperature Controller',
      type: 'Temperature Indicator Controller',
      desc: 'The most critical control loop in the process. Controls reactor temperature by modulating cooling water flow through the jacket. Prevents thermal runaway.',
      specs: [
        ['Setpoint', '342.7 K'],
        ['Control', 'Cascade PID'],
        ['Output', 'CW valve'],
      ],
      fact: 'Exothermic reactions can run away \u2014 higher temperature increases reaction rate, which generates more heat, which raises temperature further. TIC-101 is literally the loop that prevents an explosion. It doesn\u2019t get coffee breaks.'
    },
    'PI-102': {
      name: 'Pressure Indicator',
      type: 'Pressure Transmitter',
      desc: 'Monitors reactor headspace pressure. A sudden pressure rise can indicate a runaway reaction or blocked vent.',
      specs: [
        ['Range', '0\u20136 barg'],
        ['Alarm H', '2.5 barg'],
        ['PSV set', '3.5 barg'],
      ],
      fact: 'The PSV (pressure safety valve) above the reactor is the last line of defense. If PI-102, the control system, AND the operator all fail to catch a pressure excursion, the PSV pops open mechanically. No power needed. Pure physics saving lives.'
    },
    'AIC-108': {
      name: 'pH Controller',
      type: 'Analytical Indicator Controller',
      desc: 'Controls reactor pH by dosing acid or base. Many pharmaceutical reactions are highly pH-dependent \u2014 a shift of 0.5 pH units can crash yield from 90% to 30%.',
      specs: [
        ['Range', 'pH 0\u201314'],
        ['Setpoint', 'pH 7.2'],
        ['Probe', 'Glass electrode'],
      ],
      fact: 'pH probes in reactors live a rough life \u2014 organic solvents, high temperatures, aggressive chemicals. They drift constantly and need calibrating every batch. Inline pH is one of the hardest measurements to keep accurate in pharma.'
    },
    'TIC-105': {
      name: 'Crystallizer Temperature Controller',
      type: 'Temperature Indicator Controller',
      desc: 'Controls the cooling profile in the crystallizer. Typically follows a programmed curve \u2014 fast cooling to nucleation, then slow cooling for crystal growth.',
      specs: [
        ['Profile', 'Linear ramp'],
        ['Rate', '-0.3 K/min'],
        ['End T', '278 K'],
      ],
      fact: 'The "metastable zone width" is the temperature gap between saturation and spontaneous nucleation. Staying inside it means controlled crystal growth. Cross it and you get an uncontrolled nucleation storm \u2014 millions of tiny useless crystals.'
    },
    'LIC-106': {
      name: 'Level Controller',
      type: 'Level Indicator Controller',
      desc: 'Controls the crystallizer fill level. Determines when the batch is transferred to the centrifuge for solid-liquid separation.',
      specs: [
        ['Range', '0\u2013100%'],
        ['Type', 'Radar'],
        ['Alarm L', '15%'],
      ],
      fact: 'Radar level measurement works through vapor and foam \u2014 unlike older float-based sensors that get coated with crystals and stick. In a crystallizer full of slurry, non-contact measurement isn\u2019t a luxury, it\u2019s survival.'
    },
    'PIC-107': {
      name: 'Dryer Pressure Controller',
      type: 'Pressure Indicator Controller',
      desc: 'Controls vacuum level in the dryer. Lower pressure lowers the solvent boiling point, enabling drying at mild temperatures.',
      specs: [
        ['Setpoint', '50 mbar'],
        ['Vacuum', 'Liquid ring'],
        ['N\u2082 sweep', '5 L/min'],
      ],
      fact: 'The nitrogen sweep serves two purposes: it carries away evaporated solvent AND prevents an explosive atmosphere inside the dryer. Many organic solvents form explosive mixtures with air \u2014 N\u2082 inerting keeps the oxygen below the LOC (Limiting Oxygen Concentration).'
    },
  };

  const popup = document.getElementById('pid-popup');
  if (popup) {
    const popupTag = document.getElementById('pid-popup-tag');
    const popupName = document.getElementById('pid-popup-name');
    const popupType = document.getElementById('pid-popup-type');
    const popupDesc = document.getElementById('pid-popup-desc');
    const popupSpecs = document.getElementById('pid-popup-specs');
    const popupFact = document.getElementById('pid-popup-fact');
    const popupClose = document.getElementById('pid-popup-close');

    // Hover hint
    const hint = document.createElement('div');
    hint.className = 'pid-hint';
    document.body.appendChild(hint);

    const popupLive = document.getElementById('pid-popup-live');
    const popupFlow = document.getElementById('pid-popup-flow');
    const popupStatus = document.getElementById('pid-popup-status');
    const popupPrev = document.getElementById('pid-popup-prev');
    const popupNext = document.getElementById('pid-popup-next');
    const clickHint = document.getElementById('pid-click-hint');
    let liveInterval = null;
    let currentTag = null;
    const allTags = Object.keys(pidData);

    // Process flow chain
    const flowChain = ['V-101','P-101','E-101','R-101','E-102','CR-101','CF-101','D-101'];
    // Map instruments to their parent equipment
    const instParent = {
      'FIC-103': 'P-101', 'TI-104': 'E-101', 'TIC-101': 'R-101',
      'PI-102': 'R-101', 'AIC-108': 'R-101', 'TIC-105': 'CR-101',
      'LIC-106': 'CR-101', 'PIC-107': 'D-101'
    };

    // Live process values per equipment
    const liveData = {
      'V-101': [
        { label: 'Level', unit: '%', base: 62, range: 5 },
        { label: 'Temp', unit: 'K', base: 295, range: 2 },
      ],
      'P-101': [
        { label: 'Flow', unit: 'm\u00B3/h', base: 2.5, range: 0.3 },
        { label: 'dP', unit: 'bar', base: 1.2, range: 0.15 },
        { label: 'Amps', unit: 'A', base: 3.8, range: 0.4 },
      ],
      'R-101': [
        { label: 'Temp', unit: 'K', base: 342.7, range: 1.5 },
        { label: 'Press', unit: 'barg', base: 1.1, range: 0.1 },
        { label: 'RPM', unit: '', base: 180, range: 3 },
      ],
      'E-101': [
        { label: 'Tin', unit: 'K', base: 295, range: 1 },
        { label: 'Tout', unit: 'K', base: 338, range: 2 },
      ],
      'E-102': [
        { label: 'Tin', unit: 'K', base: 340, range: 2 },
        { label: 'Tout', unit: 'K', base: 285, range: 1.5 },
      ],
      'CR-101': [
        { label: 'Temp', unit: 'K', base: 278, range: 0.8 },
        { label: 'Level', unit: '%', base: 74, range: 3 },
        { label: 'Slurry', unit: 'g/L', base: 145, range: 12 },
      ],
      'CF-101': [
        { label: 'Speed', unit: 'RPM', base: 1200, range: 15 },
        { label: 'Vibr', unit: 'mm/s', base: 2.1, range: 0.6 },
      ],
      'D-101': [
        { label: 'Vac', unit: 'mbar', base: 50, range: 5 },
        { label: 'Temp', unit: 'K', base: 313, range: 1.5 },
        { label: 'LOD', unit: '%', base: 0.3, range: 0.15 },
      ],
    };

    function showPopup(tag, rect) {
      const data = pidData[tag];
      if (!data) return;

      // Track current, highlight on P&ID
      currentTag = tag;
      document.querySelectorAll('.pid-clickable.pid-selected').forEach(function(el) {
        el.classList.remove('pid-selected');
      });
      var selectedEl = document.querySelector('[data-pid="' + tag + '"]');
      if (selectedEl) selectedEl.classList.add('pid-selected');

      // Hide hint, stop previous live interval
      hint.classList.remove('visible');
      if (liveInterval) clearInterval(liveInterval);

      popupTag.textContent = tag;
      popupName.textContent = data.name;
      popupType.textContent = data.type;
      popupDesc.textContent = data.desc;
      popupFact.textContent = data.fact;

      popupSpecs.innerHTML = data.specs.map(function(s) {
        return '<div class="pid-popup-spec"><span class="pid-popup-spec-label">' + s[0] + '</span><span class="pid-popup-spec-val">' + s[1] + '</span></div>';
      }).join('');

      // Flow position indicator
      var activeEquip = instParent[tag] || tag;
      if (flowChain.indexOf(activeEquip) >= 0) {
        popupFlow.innerHTML = flowChain.map(function(eq, i) {
          var cls = eq === activeEquip ? 'pid-flow-step active' : 'pid-flow-step';
          var arrow = i < flowChain.length - 1 ? '<span class="pid-flow-arrow">\u2192</span>' : '';
          return '<span class="' + cls + '" data-nav="' + eq + '">' + eq + '</span>' + arrow;
        }).join('');
        popupFlow.style.display = '';
        // Click to navigate
        popupFlow.querySelectorAll('.pid-flow-step:not(.active)').forEach(function(step) {
          step.addEventListener('click', function(e) {
            e.stopPropagation();
            var navTag = step.getAttribute('data-nav');
            var el = document.querySelector('[data-pid="' + navTag + '"]');
            if (el) showPopup(navTag, el.getBoundingClientRect());
          });
        });
      } else {
        popupFlow.style.display = 'none';
      }

      // Hide click hint on first interaction
      if (clickHint) clickHint.classList.add('hidden');

      // Live readout
      var live = liveData[tag];
      if (live) {
        popupLive.classList.add('has-data');
        popupLive.innerHTML = live.map(function(l, i) {
          return '<div class="pid-popup-live-item"><span class="pid-popup-live-label">' + l.label + '</span><span class="pid-popup-live-val" id="plv-' + i + '">' + l.base.toFixed(1) + ' ' + l.unit + '</span></div>';
        }).join('');
        liveInterval = setInterval(function() {
          live.forEach(function(l, i) {
            var el = document.getElementById('plv-' + i);
            if (el) {
              var val = l.base + (Math.random() - 0.5) * l.range;
              el.textContent = val.toFixed(1) + ' ' + l.unit;
            }
          });
        }, 1200);
      } else {
        popupLive.classList.remove('has-data');
        popupLive.innerHTML = '';
      }

      popup.classList.remove('active');
      // Force reflow for re-animation
      void popup.offsetWidth;
      popup.classList.add('active');

      // Position: prefer below-right of element, fallback above
      var pw = 340;
      var left = rect.left + rect.width / 2 - pw / 2;
      var top = rect.bottom + 14;

      // Keep within viewport horizontally
      if (left < 16) left = 16;
      if (left + pw > window.innerWidth - 16) left = window.innerWidth - pw - 16;

      // If popup would go below viewport, show above
      requestAnimationFrame(function() {
        var ph = popup.offsetHeight;
        if (top + ph > window.innerHeight - 16) {
          top = rect.top - ph - 14;
        }
        // Still off-screen? Clamp to top
        if (top < 16) top = 16;
        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
      });

      popup.style.left = left + 'px';
      popup.style.top = top + 'px';
    }

    function hidePopup() {
      popup.classList.remove('active');
      if (liveInterval) { clearInterval(liveInterval); liveInterval = null; }
      currentTag = null;
      document.querySelectorAll('.pid-clickable.pid-selected').forEach(function(el) {
        el.classList.remove('pid-selected');
      });
    }

    function navigatePopup(dir) {
      if (!currentTag) return;
      var idx = allTags.indexOf(currentTag);
      if (idx < 0) return;
      idx = (idx + dir + allTags.length) % allTags.length;
      var nextTag = allTags[idx];
      var el = document.querySelector('[data-pid="' + nextTag + '"]');
      var rect = el ? el.getBoundingClientRect() : { left: 400, top: 200, width: 40, height: 40, bottom: 240 };
      showPopup(nextTag, rect);
    }

    document.querySelectorAll('.pid-clickable').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var tag = el.getAttribute('data-pid');
        var rect = el.getBoundingClientRect();
        showPopup(tag, rect);
      });

      // Hover hint
      el.addEventListener('mouseenter', function(e) {
        if (popup.classList.contains('active')) return;
        var tag = el.getAttribute('data-pid');
        var data = pidData[tag];
        hint.textContent = tag + (data ? ' \u2014 ' + data.name : '');
        hint.classList.add('visible');
      });
      el.addEventListener('mousemove', function(e) {
        hint.style.left = (e.clientX + 14) + 'px';
        hint.style.top = (e.clientY - 8) + 'px';
      });
      el.addEventListener('mouseleave', function() {
        hint.classList.remove('visible');
      });
    });

    popupClose.addEventListener('click', function(e) {
      e.stopPropagation();
      hidePopup();
    });
    if (popupPrev) popupPrev.addEventListener('click', function(e) { e.stopPropagation(); navigatePopup(-1); });
    if (popupNext) popupNext.addEventListener('click', function(e) { e.stopPropagation(); navigatePopup(1); });

    document.addEventListener('click', function(e) {
      if (popup.classList.contains('active') && !popup.contains(e.target) && !e.target.closest('.pid-clickable')) {
        hidePopup();
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') hidePopup();
      if (!popup.classList.contains('active')) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); navigatePopup(-1); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); navigatePopup(1); }
    });
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

  // === Facts counter animation ===
  const factsStrip = document.querySelector('.facts-strip');
  if (factsStrip) {
    var factsAnimated = false;
    var factsObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !factsAnimated) {
        factsAnimated = true;
        factsStrip.querySelectorAll('.fact-value').forEach(function(el) {
          var final = el.textContent;
          var chars = final.split('');
          var duration = 600;
          var start = Date.now();
          var scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-.';
          function scramble() {
            var elapsed = Date.now() - start;
            var progress = Math.min(elapsed / duration, 1);
            var revealed = Math.floor(progress * chars.length);
            var display = chars.map(function(c, i) {
              if (i < revealed) return c;
              if (c === ' ' || c === '/') return c;
              return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }).join('');
            el.textContent = display;
            if (progress < 1) requestAnimationFrame(scramble);
          }
          scramble();
        });
      }
    }, { threshold: 0.5 });
    factsObs.observe(factsStrip);
  }

  // === Section nav dots + header section label ===
  const sectionDots = document.querySelectorAll('.section-dot');
  const sectionLabel = document.getElementById('nav-section-label');
  const sections = ['hero', 'narrative', 'demo', 'expertise', 'embedded', 'connect'];
  const sectionNames = { hero: '', narrative: 'SEC-101 Process Description', demo: 'SEC-201 Reaction Kinetics', expertise: 'SEC-301 Equipment List', embedded: 'SEC-401 Automation Layer', connect: 'SEC-501 Connect' };
  if (sectionDots.length) {
    var sectionEls = sections.map(function(id) { return document.getElementById(id); }).filter(Boolean);
    var sectionObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          sectionDots.forEach(function(dot) {
            dot.classList.toggle('active', dot.getAttribute('data-section') === id);
          });
          // Update header section label
          if (sectionLabel) {
            var name = sectionNames[id] || '';
            sectionLabel.textContent = name;
            sectionLabel.classList.toggle('visible', name.length > 0);
          }
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
    sectionEls.forEach(function(el) { sectionObs.observe(el); });
  }

  // === Project domain filtering ===
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card[data-domain]');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = btn.dataset.filter;
        filterBtns.forEach(function(b) { b.classList.remove('filter-active'); });
        btn.classList.add('filter-active');
        projectCards.forEach(function(card) {
          if (filter === 'all' || card.dataset.domain === filter) {
            card.classList.remove('filtered-out');
          } else {
            card.classList.add('filtered-out');
          }
        });
      });
    });
  }

  // === Narrative active step ===
  const narrativeSteps = document.querySelectorAll('.narrative-step');
  if (narrativeSteps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('step-active', entry.isIntersecting);
      });
    }, { threshold: 0.6 });
    narrativeSteps.forEach(step => stepObserver.observe(step));
  }

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

  // === Hamburger Menu ===
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('menu-open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', open);
    });
    // Close on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('menu-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // === Footer Uptime ===
  const uptimeEl = document.getElementById('footer-uptime');
  if (uptimeEl) {
    const startTime = Date.now();
    setInterval(function() {
      var secs = Math.floor((Date.now() - startTime) / 1000);
      var m = Math.floor(secs / 60);
      var s = secs % 60;
      uptimeEl.textContent = m + ':' + String(s).padStart(2, '0');
    }, 1000);
  }

  // === Back to Top ===
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
