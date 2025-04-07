

  const data = [
    { item: "HTML", match: "Structure" },
    { item: "CSS", match: "Styling" },
    { item: "JavaScript", match: "Behavior" },
  ];

  let correctCount = 0;

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function loadGame() {
    const itemsContainer = document.getElementById('itemsContainer');
    const targetsContainer = document.getElementById('targetsContainer');
    const scoreDisplay = document.getElementById('score');

    itemsContainer.innerHTML = '';
    targetsContainer.innerHTML = '';
    scoreDisplay.textContent = '';
    correctCount = 0;

    const shuffledItems = shuffle([...data]);
    const shuffledTargets = shuffle([...data]);

    shuffledItems.forEach((entry, index) => {
      const div = document.createElement('div');
      div.className = 'draggable';
      div.draggable = true;
      div.textContent = entry.item;
      div.id = `item-${index}`;
      div.dataset.item = entry.item;

      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', entry.item);
      });

      itemsContainer.appendChild(div);
    });

    shuffledTargets.forEach((entry, index) => {
      const dropzone = document.createElement('div');
      dropzone.className = 'dropzone';
      dropzone.textContent = entry.match;
      dropzone.dataset.match = entry.item;

      dropzone.addEventListener('dragover', (e) => e.preventDefault());

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedItem = e.dataTransfer.getData('text/plain');

        if (draggedItem === dropzone.dataset.match) {
          dropzone.textContent = draggedItem;
          dropzone.classList.add('correct');
          dropzone.classList.remove('incorrect');

          const draggedEl = document.querySelector(`[data-item="${draggedItem}"]`);
          if (draggedEl) draggedEl.style.visibility = 'hidden';

          correctCount++;
        } else {
          dropzone.classList.add('incorrect');
          dropzone.classList.remove('correct');
        }

        if (correctCount === data.length) {
          scoreDisplay.textContent = `✅ You got all ${data.length} correct!`;
        }
      });

      targetsContainer.appendChild(dropzone);
    });
  }

  function resetGame() {
    loadGame();
  }

  // Start game on load
  window.onload = loadGame;

