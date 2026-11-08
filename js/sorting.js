/**
 * Interactive Algorithm Sorting Lab
 * Ahmad Abdul Mujahid — Portofolio Mahasiswa Ilmu Komputer
 *
 * Mendukung: Bubble Sort, Selection Sort, dan Insertion Sort
 * Fitur: Pengaturan Kecepatan, Live Metrics (Perbandingan & Pertukaran),
 * Kompleksitas Waktu & Ruang, serta Pembatalan/Reset yang aman.
 */

(function () {
  const barsEl = document.getElementById('bars');
  const statusEl = document.getElementById('status');
  const shuffleBtn = document.getElementById('shuffle');
  const startBtn = document.getElementById('start-sort');
  const resetBtn = document.getElementById('reset-sort');
  const algoSelect = document.getElementById('algo-select');
  const speedInput = document.getElementById('speed');
  const cmpEl = document.getElementById('stat-cmp');
  const swapEl = document.getElementById('stat-swap');
  const timeEl = document.getElementById('stat-time');
  const spaceEl = document.getElementById('stat-space');
  const vizCard = document.querySelector('.viz');

  if (!barsEl || !statusEl) return;

  const N = 20;
  let data = [];
  let bars = [];
  let isSorting = false;
  let cancelToken = false;
  let comparisons = 0;
  let swaps = 0;

  // Metadata algoritma
  const ALGO_META = {
    bubble: {
      name: 'Bubble Sort',
      time: 'O(n²)',
      space: 'O(1)',
      desc: 'Membandingkan dan menukar elemen bertetangga'
    },
    selection: {
      name: 'Selection Sort',
      time: 'O(n²)',
      space: 'O(1)',
      desc: 'Mencari nilai terkecil lalu memindahkannya ke depan'
    },
    insertion: {
      name: 'Insertion Sort',
      time: 'O(n²) | Best O(n)',
      space: 'O(1)',
      desc: 'Menyisipkan setiap elemen ke posisi yang tepat'
    }
  };

  function updateMeta() {
    const key = algoSelect ? algoSelect.value : 'bubble';
    const meta = ALGO_META[key] || ALGO_META.bubble;
    if (timeEl) timeEl.textContent = meta.time;
    if (spaceEl) spaceEl.textContent = meta.space;
    if (!isSorting && statusEl) {
      statusEl.textContent = `${meta.name}: Siap diuji`;
    }
  }

  function getDelay() {
    // Range 10-150 ms; slider terbalik: nilai tinggi = delay rendah (lebih cepat)
    const val = speedInput ? parseInt(speedInput.value, 10) : 60;
    return Math.max(10, 160 - val);
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function updateStats() {
    if (cmpEl) cmpEl.textContent = comparisons;
    if (swapEl) swapEl.textContent = swaps;
  }

  function resetStats() {
    comparisons = 0;
    swaps = 0;
    updateStats();
  }

  function draw() {
    bars.forEach((b, i) => {
      b.style.height = (data[i] / N * 100) + '%';
    });
  }

  function initArray() {
    cancelToken = true;
    barsEl.innerHTML = '';
    data = Array.from({ length: N }, (_, i) => i + 1);

    // Acak data (Fisher-Yates shuffle)
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    bars = data.map((v) => {
      const b = document.createElement('div');
      b.className = 'bar';
      b.style.height = (v / N * 100) + '%';
      barsEl.appendChild(b);
      return b;
    });

    resetStats();
    setControlsSortingState(false);
    updateMeta();
  }

  function setControlsSortingState(sorting) {
    isSorting = sorting;
    if (startBtn) startBtn.disabled = sorting;
    if (shuffleBtn) shuffleBtn.disabled = sorting;
    if (algoSelect) algoSelect.disabled = sorting;
    if (resetBtn) resetBtn.disabled = !sorting;
  }

  // ==========================================
  // Implementasi Algoritma
  // ==========================================

  // 1. Bubble Sort
  async function runBubbleSort() {
    const n = data.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (cancelToken) return false;

        bars[j].classList.add('cmp');
        bars[j + 1].classList.add('cmp');
        comparisons++;
        updateStats();

        if (data[j] > data[j + 1]) {
          bars[j].classList.add('swap');
          bars[j + 1].classList.add('swap');
          [data[j], data[j + 1]] = [data[j + 1], data[j]];
          draw();
          swaps++;
          updateStats();
        }

        await wait(getDelay());
        bars[j].classList.remove('cmp', 'swap');
        bars[j + 1].classList.remove('cmp', 'swap');
      }
      bars[n - i - 1].classList.add('done');
    }
    bars[0].classList.add('done');
    return true;
  }

  // 2. Selection Sort
  async function runSelectionSort() {
    const n = data.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      bars[minIdx].classList.add('cmp');

      for (let j = i + 1; j < n; j++) {
        if (cancelToken) return false;

        bars[j].classList.add('cmp');
        comparisons++;
        updateStats();

        if (data[j] < data[minIdx]) {
          bars[minIdx].classList.remove('cmp');
          minIdx = j;
          bars[minIdx].classList.add('cmp');
        }

        await wait(getDelay());
        if (j !== minIdx) bars[j].classList.remove('cmp');
      }

      if (minIdx !== i) {
        bars[i].classList.add('swap');
        bars[minIdx].classList.add('swap');
        [data[i], data[minIdx]] = [data[minIdx], data[i]];
        draw();
        swaps++;
        updateStats();
        await wait(getDelay());
        bars[i].classList.remove('swap');
        bars[minIdx].classList.remove('swap', 'cmp');
      } else {
        bars[minIdx].classList.remove('cmp');
      }

      bars[i].classList.add('done');
    }
    bars[n - 1].classList.add('done');
    return true;
  }

  // 3. Insertion Sort
  async function runInsertionSort() {
    const n = data.length;
    bars[0].classList.add('done');

    for (let i = 1; i < n; i++) {
      const key = data[i];
      let j = i - 1;

      bars[i].classList.add('cmp');
      await wait(getDelay());

      while (j >= 0 && data[j] > key) {
        if (cancelToken) return false;

        comparisons++;
        swaps++;
        updateStats();

        bars[j].classList.add('swap');
        data[j + 1] = data[j];
        draw();

        await wait(getDelay());
        bars[j].classList.remove('swap');
        j--;
      }

      if (j >= 0) {
        comparisons++;
        updateStats();
      }

      data[j + 1] = key;
      draw();
      bars[i].classList.remove('cmp');

      for (let k = 0; k <= i; k++) {
        bars[k].classList.add('done');
      }
    }
    return true;
  }

  // ==========================================
  // Handler Eksekusi
  // ==========================================
  async function startSorting() {
    if (isSorting) return;
    cancelToken = false;
    setControlsSortingState(true);
    resetStats();

    // Hapus status sebelumnya
    bars.forEach((b) => b.classList.remove('done', 'cmp', 'swap'));

    const algo = algoSelect ? algoSelect.value : 'bubble';
    const algoName = (ALGO_META[algo] || ALGO_META.bubble).name;
    statusEl.textContent = `Menjalankan ${algoName}...`;

    let completed = false;
    if (algo === 'selection') {
      completed = await runSelectionSort();
    } else if (algo === 'insertion') {
      completed = await runInsertionSort();
    } else {
      completed = await runBubbleSort();
    }

    if (completed && !cancelToken) {
      statusEl.textContent = `Selesai: ${swaps} pertukaran, ${comparisons} perbandingan!`;
    } else {
      statusEl.textContent = `Pengurutan dihentikan.`;
    }

    setControlsSortingState(false);
  }

  function stopAndReset() {
    cancelToken = true;
    initArray();
  }

  // Event Listeners
  if (startBtn) startBtn.addEventListener('click', startSorting);
  if (shuffleBtn) shuffleBtn.addEventListener('click', () => { cancelToken = true; initArray(); });
  if (resetBtn) resetBtn.addEventListener('click', stopAndReset);
  if (algoSelect) algoSelect.addEventListener('change', () => { cancelToken = true; initArray(); });

  // Efek Paralaks 3D pada Kursor
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches && vizCard) {
    vizCard.addEventListener('mousemove', (e) => {
      const rect = vizCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      vizCard.style.transform = `perspective(750px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    vizCard.addEventListener('mouseleave', () => {
      vizCard.style.transform = '';
    });
  }

  // Inisialisasi awal
  initArray();
})();

