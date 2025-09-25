/* ===== RunnerJS ES5 compatible (sin mover diseño) ===== */
(function () {
  // Ejecuta cuando la página esté lista, incluso sin defer
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnce, false);
  } else {
    initOnce();
  }

  function initOnce() {
    try { init(); }
    catch (e) {
      console.error('[RunnerJS] init error:', e);
    }
  }

  function $(id) { return document.getElementById(id); }

  function init() {
    var canvas = $('game-canvas');
    if (!canvas) { console.error('Falta #game-canvas'); return; }
    var ctx = canvas.getContext('2d');

    // Pantallas (si no existen, no pasa nada)
    var menu  = $('menu-screen');
    var over  = $('game-over-screen');
    var board = $('leaderboard-screen');

    // Botones (opcionales)
    var btnStart   = $('start-btn');
    var btnAgain   = $('play-again-btn');
    var btnRestart = $('restart-game-btn');
    var btnOpenLB  = $('open-leaderboard-btn');
    var btnViewLB  = $('view-leaderboard-btn');
    var btnBack    = $('back-to-menu-btn');
    var btnBackPort= $('back-to-portfolio-btn');

    // UI
    var finalScoreEl = $('final-score');
    var scoreListEl  = $('score-list');
    var saveForm     = $('save-score-form');
    var nameInput    = $('player-name');
    var serverStatus = $('server-status');

    // Helpers de pantalla (soportan .hidden o .active)
    function show(el){ if(!el) return; addClass(el, 'active'); removeClass(el, 'hidden'); }
    function hide(el){ if(!el) return; addClass(el, 'hidden'); removeClass(el, 'active'); }
    function goMenu(){ show(menu); hide(over); hide(board); }
    function goOver(){ hide(menu); show(over); hide(board); }
    function goBoard(){ hide(menu); hide(over); show(board); }

    function addClass(el, c){ if (el.classList) el.classList.add(c); }
    function removeClass(el, c){ if (el.classList) el.classList.remove(c); }

    // Canvas DPR-safe (si el parent mide 0, usamos ventana)
    function resize() {
      var dpr = Math.max(1, window.devicePixelRatio || 1);
      var parent = canvas.parentElement;
      var cssW = Math.max(320, (parent && parent.clientWidth) ? parent.clientWidth : window.innerWidth);
      var cssH = Math.max(300, (parent && parent.clientHeight) ? parent.clientHeight : Math.round(window.innerHeight * 0.7));
      canvas.style.width  = cssW + 'px';
      canvas.style.height = cssH + 'px';
      canvas.width  = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      groundY = canvas.clientHeight - 20;
    }
    window.addEventListener('resize', resize, false);
    resize();

    // Estado del juego
    var running = false;
    var score = 0;
    var level = 1;
    var speed = 5;
    var high = getHigh();
    var groundY = canvas.clientHeight - 20;
    var obstacles = [];
    var spawnTimer = 0;

    var player = { x:50, y:0, w:20, h:40, vy:0, g:0.8, j:-16, jumping:false };

    function getHigh(){ 
      var v = localStorage.getItem('cyberRunnerHighScore');
      return v ? parseInt(v, 10) : 0;
    }
    function setHigh(v){ localStorage.setItem('cyberRunnerHighScore', String(v)); }

    // Dibujo / lógica
    function drawGround(){
      ctx.strokeStyle = '#7df9ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.clientWidth, groundY);
      ctx.stroke();
    }
    function drawHUD(){
      ctx.fillStyle = '#e6f7ff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';   ctx.fillText('Score: ' + score, 20, 30);
      ctx.textAlign = 'center'; ctx.fillText('Nivel: ' + level, canvas.clientWidth/2, 30);
      ctx.textAlign = 'right';  ctx.fillText('High: ' + high, canvas.clientWidth-20, 30);
    }
    function drawPlayer(){ ctx.fillStyle = '#00e5ff'; ctx.fillRect(player.x, player.y, player.w, player.h); }
    function updatePlayer(){
      player.vy += player.g; player.y += player.vy;
      if (player.y > groundY - player.h) { player.y = groundY - player.h; player.vy = 0; player.jumping = false; }
    }
    function jump(){ if (!player.jumping) { player.vy = player.j; player.jumping = true; } }

    function Obstacle(s){
      this.w = 20 + ((Math.random()*21) | 0);
      this.h = 20 + ((Math.random()*31) | 0);
      this.x = canvas.clientWidth;
      this.y = groundY - this.h;
      this.s = s;
    }
    Obstacle.prototype.draw = function(){ ctx.fillStyle = '#7df9ff'; ctx.fillRect(this.x, this.y, this.w, this.h); };
    Obstacle.prototype.update = function(){ this.x -= this.s; };

    function collide(){
      var i, o;
      for (i=0; i<obstacles.length; i++){
        o = obstacles[i];
        if (player.x < o.x + o.w && player.x + player.w > o.x &&
            player.y < o.y + o.h && player.y + player.h > o.y) {
          return true;
        }
      }
      return false;
    }
    function tick(){
      score++;
      if (score > 0 && score % 400 === 0) { level++; speed += 0.6; }
      var minGap = Math.max(35, 90 - level * 8);
      if (spawnTimer <= 0) {
        obstacles.push(new Obstacle(speed));
        spawnTimer = (minGap + Math.random() * (minGap * 0.8)) | 0;
      } else {
        spawnTimer--;
      }
    }

    function loop(){
      if (!running) return;
      ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
      drawGround();
      updatePlayer();
      drawPlayer();
      var i;
      for (i=0; i<obstacles.length; i++){ obstacles[i].update(); obstacles[i].draw(); }
      // filtrar fuera de pantalla
      var tmp = [];
      for (i=0; i<obstacles.length; i++){ if (obstacles[i].x + obstacles[i].w > 0) tmp.push(obstacles[i]); }
      obstacles = tmp;

      tick();
      drawHUD();

      if (collide()) { onGameOver(); return; }
      requestAnimationFrame(loop);
    }

    function start(){
      if (running) return;
      running = true;
      score = 0; level = 1; speed = 5;
      obstacles = []; spawnTimer = 0;
      resize();
      player.y = groundY - player.h; player.vy = 0;
      hide(menu); hide(over); hide(board);
      loop();
    }
    function onGameOver(){
      running = false;
      if (finalScoreEl) finalScoreEl.textContent = String(score);
      if (score > high) { high = score; setHigh(high); }
      goOver();
    }

    // Leaderboard seguro (usa api.js si existe; si no, local)
    function safeGetScores(cb){
      try {
        if (typeof window.getScores === 'function') {
          window.getScores().then(function(rows){ cb(null, rows); }).catch(function(){ cb(null, readLocal()); });
          return;
        }
      } catch(e){}
      cb(null, readLocal());
    }
    function safeSaveScore(name, score, level, cb){
      try {
        if (typeof window.saveScore === 'function') {
          window.saveScore(name, score, level).then(function(){ cb(null,true); }).catch(function(){ writeLocal(name,score,level); cb(null,false); });
          return;
        }
      } catch(e){}
      writeLocal(name,score,level); cb(null,true);
    }
    function readLocal(){
      var raw = localStorage.getItem('cyberRunnerScores') || '[]';
      try { return JSON.parse(raw); } catch(e){ return []; }
    }
    function writeLocal(name, score, level){
      var arr = readLocal();
      arr.push({ name:name, score:score, level:level });
      arr.sort(function(a,b){ return b.score - a.score; });
      localStorage.setItem('cyberRunnerScores', JSON.stringify(arr.slice(0,100)));
    }
    function refreshBoard(){
      if (!scoreListEl) return;
      scoreListEl.innerHTML = '<li>Cargando...</li>';
      safeGetScores(function(err, rows){
        scoreListEl.innerHTML = '';
        rows = rows || [];
        var i, li, s;
        for (i=0; i<rows.length && i<10; i++){
          s = rows[i];
          li = document.createElement('li');
          li.textContent = (i+1) + '. ' + String(s.name || 'Anónimo').slice(0,16) + ' — ' + s.score + '  Lvl ' + (s.level || 1);
          scoreListEl.appendChild(li);
        }
        if (!scoreListEl.childElementCount) scoreListEl.innerHTML = '<li>Sin registros aún.</li>';
      });
    }

    // Eventos
    if (btnStart)   btnStart.addEventListener('click', start, false);
    if (btnRestart) btnRestart.addEventListener('click', start, false);
    if (btnAgain)   btnAgain.addEventListener('click', start, false);
    if (btnOpenLB)  btnOpenLB.addEventListener('click', function(){ refreshBoard(); goBoard(); }, false);
    if (btnViewLB)  btnViewLB.addEventListener('click', function(){ refreshBoard(); goBoard(); }, false);
    if (btnBack)    btnBack.addEventListener('click', goMenu, false);
    if (btnBackPort)btnBackPort.addEventListener('click', function(){ window.location.href='../index.html'; }, false);

    canvas.addEventListener('click', function(){ if(!running) start(); else jump(); }, false);
    document.addEventListener('keydown', function(e){
      var code = e.code || e.key || '';
      if (code === 'Space' || code === ' ' || code === 'Enter') {
        if (e.preventDefault) e.preventDefault();
        if (!running) start(); else jump();
      }
    }, false);

    if (saveForm) {
      saveForm.addEventListener('submit', function(e){
        if (e && e.preventDefault) e.preventDefault();
        var name = nameInput && nameInput.value ? nameInput.value : 'Anónimo';
        safeSaveScore(name, score, level, function(){ refreshBoard(); goBoard(); });
      }, false);
    }

    // Mensaje servidor
    (function(){
      if (!serverStatus) return;
      safeGetScores(function(){ serverStatus.textContent='Servidor listo.'; });
    })();

    if (menu) show(menu);
  }
})();