const storyEl = document.getElementById("story");
const puzzleEl = document.getElementById("puzzle");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

let stage = 0;

const stages = [
  {
    title: "Пролог: Снег и остановка",
    text: `Восточный экспресс встал среди снежной бури. Нэнси едет инкогнито и слышит крик из купе миллионера Армана Ренара. Утром его находят мёртвым, дверь заперта изнутри, а проводник клянётся, что ночью видел только фигуру в красном кимоно.`
  },
  {
    title: "Дело №1: Шифр багажной бирки",
    text: `На месте преступления Нэнси находит оборванную багажную бирку с буквами: "КФС ЛУШРЮ ЙЭЩТ".

Подсказка от Неда по телеграфу: "Это классический сдвиг, которым часто пользуются контрабандисты в портах".`
  },
  {
    title: "Дело №2: Замок купе",
    text: `В духе старых загадок Nancy Drew нужно открыть аварийный замок. На панели три рычага: Луна, Волк, Снег.

Записка в кармане жертвы: "Волк воет после луны, снег ложится последним".`
  },
  {
    title: "Дело №3: Кто лжёт о времени",
    text: `Каждый из трёх пассажиров утверждает, что был в вагоне-ресторане в момент убийства (00:45):

• Госпожа Валуа: "Я ушла из ресторана в 00:30".
• Полковник Марек: "Я пришёл в ресторан ровно в 00:50".
• Доктор Ансель: "Мы трое одновременно были там в 00:45".

Кто говорит неправду?`
  },
  {
    title: "Финал: Развязка в салон-вагоне",
    text: `Нэнси собирает пассажиров и раскрывает правду: Ренар шантажировал целую семью, замешанную в старом похищении. Убийство было актом отчаяния и мести, заранее спланированным группой, где каждый дал ложное алиби.

Нэнси тихо произносит: "Иногда справедливость не помещается в один протокол" — и решает передать властям только часть фактов, оставляя моральный выбор игроку.`
  }
];

function renderStage() {
  const data = stages[stage];
  storyEl.innerHTML = `<h2>${data.title}</h2><p>${data.text.replace(/\n/g, "<br>")}</p>`;
  puzzleEl.classList.add("hidden");
  nextBtn.disabled = true;

  if (stage === 0 || stage === stages.length - 1) {
    nextBtn.disabled = false;
    if (stage === stages.length - 1) {
      nextBtn.textContent = "Эпилог завершён";
      nextBtn.disabled = true;
    } else {
      nextBtn.textContent = "К расследованию";
    }
  }

  if (stage === 1) {
    renderPuzzle1();
  }
  if (stage === 2) {
    renderPuzzle2();
  }
  if (stage === 3) {
    renderPuzzle3();
  }
}

function createFeedback(el, ok, goodText, badText) {
  el.textContent = ok ? goodText : badText;
  el.className = `feedback ${ok ? "ok" : "bad"}`;
}

function renderPuzzle1() {
  puzzleEl.classList.remove("hidden");
  puzzleEl.innerHTML = `
    <h3>Головоломка: дешифровка сообщения</h3>
    <p>Введите расшифрованный текст (2 слова).</p>
    <label>Ответ
      <input id="cipherInput" placeholder="например: ..." />
    </label>
    <button class="btn" id="cipherCheck">Проверить</button>
    <p class="feedback" id="cipherFeedback"></p>
  `;

  document.getElementById("cipherCheck").addEventListener("click", () => {
    const value = document.getElementById("cipherInput").value.trim().toLowerCase();
    const ok = value === "был кинжал ночью" || value === "кинжал ночью";
    createFeedback(
      document.getElementById("cipherFeedback"),
      ok,
      "Верно! Нэнси отмечает: это прямое указание на время и орудие.",
      "Пока мимо. Попробуйте сдвиг по алфавиту на 2 символа назад."
    );
    nextBtn.disabled = !ok;
    nextBtn.textContent = ok ? "К следующей улике" : "Дальше";
  });
}

function renderPuzzle2() {
  puzzleEl.classList.remove("hidden");
  puzzleEl.innerHTML = `
    <h3>Головоломка: порядок рычагов</h3>
    <p>Выберите порядок активации.</p>
    <label>Первый
      <select id="lock1">
        <option>Луна</option>
        <option>Волк</option>
        <option>Снег</option>
      </select>
    </label>
    <label>Второй
      <select id="lock2">
        <option>Луна</option>
        <option>Волк</option>
        <option>Снег</option>
      </select>
    </label>
    <label>Третий
      <select id="lock3">
        <option>Луна</option>
        <option>Волк</option>
        <option>Снег</option>
      </select>
    </label>
    <button class="btn" id="lockCheck">Проверить</button>
    <p class="feedback" id="lockFeedback"></p>
  `;

  document.getElementById("lockCheck").addEventListener("click", () => {
    const a = document.getElementById("lock1").value;
    const b = document.getElementById("lock2").value;
    const c = document.getElementById("lock3").value;
    const ok = a === "Луна" && b === "Волк" && c === "Снег";

    createFeedback(
      document.getElementById("lockFeedback"),
      ok,
      "Щелчок! Тайник открыт, внутри — платок с инициалами М.В.",
      "Замок не поддаётся. Подсказка: фраза задаёт строгую последовательность."
    );

    nextBtn.disabled = !ok;
    nextBtn.textContent = ok ? "Сверить алиби" : "Дальше";
  });
}

function renderPuzzle3() {
  puzzleEl.classList.remove("hidden");
  puzzleEl.innerHTML = `
    <h3>Головоломка: логическая дедукция</h3>
    <p>Кого Нэнси уличает во лжи?</p>
    <label>Выберите пассажира
      <select id="logicSelect">
        <option>Госпожа Валуа</option>
        <option>Полковник Марек</option>
        <option>Доктор Ансель</option>
      </select>
    </label>
    <button class="btn" id="logicCheck">Проверить</button>
    <p class="feedback" id="logicFeedback"></p>
    <ul class="clue-list">
      <li>Если Валуа ушла в 00:30, она не могла быть там в 00:45.</li>
      <li>Если Марек пришёл в 00:50, он тоже не мог быть там в 00:45.</li>
      <li>Значит утверждение о "всех троих в 00:45" невозможно.</li>
    </ul>
  `;

  document.getElementById("logicCheck").addEventListener("click", () => {
    const value = document.getElementById("logicSelect").value;
    const ok = value === "Доктор Ансель";

    createFeedback(
      document.getElementById("logicFeedback"),
      ok,
      "Именно! Доктор соврал, пытаясь склеить несовместимые алиби.",
      "Подумайте ещё: чья фраза противоречит двум другим одновременно?"
    );

    nextBtn.disabled = !ok;
    nextBtn.textContent = ok ? "К финалу" : "Дальше";
  });
}

nextBtn.addEventListener("click", () => {
  if (stage < stages.length - 1) {
    stage += 1;
    renderStage();
  }
});

restartBtn.addEventListener("click", () => {
  stage = 0;
  nextBtn.textContent = "Дальше";
  renderStage();
});

renderStage();
