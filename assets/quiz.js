(function () {
  var data = window.QUIZ_DATA;
  var i = 0, score = 0, answered = false;
  var root = document.getElementById('quiz');
  var L = data.labels;

  function renderProgress() {
    var pct = (i / data.questions.length) * 100;
    document.getElementById('bar').style.width = pct + '%';
    document.getElementById('count').textContent =
      L.question + ' ' + Math.min(i + 1, data.questions.length) + ' / ' + data.questions.length;
  }

  function renderQuestion() {
    answered = false;
    renderProgress();
    var q = data.questions[i];
    var html = '<div class="card">' +
      '<div class="question"></div>' +
      '<div class="choices"></div>' +
      '<div class="explain"></div>' +
      '<button class="next-btn" style="display:none"></button>' +
      '</div>';
    root.innerHTML = html;
    root.querySelector('.question').textContent = q.q;
    var box = root.querySelector('.choices');
    q.choices.forEach(function (c, idx) {
      var b = document.createElement('button');
      b.className = 'choice';
      b.textContent = c;
      b.addEventListener('click', function () { pick(idx, b, q); });
      box.appendChild(b);
    });
  }

  function pick(idx, btn, q) {
    if (answered) return;
    answered = true;
    var buttons = root.querySelectorAll('.choice');
    buttons.forEach(function (b, j) {
      b.disabled = true;
      if (j === q.answer) b.classList.add('correct');
    });
    var good = idx === q.answer;
    if (good) score++;
    if (!good) btn.classList.add('wrong');
    var ex = root.querySelector('.explain');
    ex.innerHTML = '';
    var v = document.createElement('div');
    v.className = 'verdict ' + (good ? 'ok' : 'ko');
    v.textContent = good ? L.good : L.bad;
    var t = document.createElement('div');
    t.textContent = q.explain;
    ex.appendChild(v); ex.appendChild(t);
    ex.classList.add('show');
    var next = root.querySelector('.next-btn');
    next.style.display = 'block';
    next.textContent = (i + 1 < data.questions.length) ? L.next : L.result;
    next.addEventListener('click', function () {
      i++;
      if (i < data.questions.length) renderQuestion(); else renderScore();
    });
  }

  function renderScore() {
    document.getElementById('bar').style.width = '100%';
    document.getElementById('count').textContent = '';
    var total = data.questions.length;
    var msg = score === total ? L.m1 : (score >= total * 0.7 ? L.m2 : (score >= total * 0.4 ? L.m3 : L.m4));
    var stars = '★'.repeat(Math.max(1, Math.round((score / total) * 5))) + '☆'.repeat(5 - Math.max(1, Math.round((score / total) * 5)));
    root.innerHTML = '<div class="card score-box">' +
      '<div class="stars">' + stars + '</div>' +
      '<div class="score-num">' + score + ' / ' + total + '</div>' +
      '<div class="score-msg"></div>' +
      '<button class="restart-btn"></button>' +
      '</div>';
    root.querySelector('.score-msg').textContent = msg;
    var rb = root.querySelector('.restart-btn');
    rb.textContent = L.restart;
    rb.addEventListener('click', function () { i = 0; score = 0; renderQuestion(); });
  }

  renderQuestion();
})();
