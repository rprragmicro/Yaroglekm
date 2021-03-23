const container = window.document.getElementsByClassName('container')[0];
const elements = [];
let size = 256;

function initial(...args) {
  size = args[0];
  const angle = 360 / size;
  const width = 250 * Math.sin(angle / 360 * Math.PI);
  const height = 250 * Math.cos(angle / 360 * Math.PI);
  for (let i = 0; i < size; i++) {
    let r;
    if (i <= size / 6) {
      r = 255;
    } else if (i <= size / 3) {
      r = (size / 3 - i) * 255 / (size / 6);
    } else if (i <= 2 * size / 3) {
      r = 0;
    } else if (i <= 5 * size / 6) {
      r = (i - 2 * size / 3) * 255 / (size / 6);
    } else {
      r = 255;
    }
    let g;
    if (i <= size / 6) {
      g = i * 255 / (size / 6);
    } else if (i <= size / 2) {
      g = 255;
    } else if (i <= 2 * size / 3) {
      g = (2 * size / 3 - i) * 255 / (size / 6);
    } else {
      g = 0;
    }
    let b;
    if (i <= size / 3) {
      b = 0;
    } else if (i <= size / 2) {
      b = (i - size / 3) * 255 / (size / 6);
    } else if (i <= 5 * size / 6) {
      b = 255;
    } else {
      b = (size - i) * 255 / (size / 6);
    }
    const element = window.document.createElement('div');
    element.style.position = 'absolute';
    element.style.margin = 'auto';
    element.style.left = '0';
    element.style.right = '0';
    element.style.top = '0';
    element.style.width = '0';
    element.style.height = '0';
    element.style.borderTop = `${height}px solid rgba(${r}, ${g}, ${b}, 1)`;
    element.style.borderLeft = `${width}px solid transparent`;
    element.style.borderRight = `${width}px solid transparent`;
    element.style.transformOrigin = '50% 100%';
    element.style.transform = `rotate(${i * angle}deg)`;
    element.setAttribute('index', i);
    elements.push(element);
  }
}

function draw() {
  container.innerHTML = '';
  elements.forEach((element, i) => {
    element.style.transform = `rotate(${i * 360 / size}deg)`;
    container.appendChild(element);
  })
}

function random() {
  for (let i = 0; i < 16; i++) {
    elements.sort(() => Math.random() - 0.5);
  }
  draw();
}

async function swap(i, j) {
  await new Promise((resolve) => {
    setTimeout(() => {
      const temp = elements[i];
      elements[i] = elements[j];
      elements[j] = temp;
      draw();
      resolve();
    }, 0);
  });
}

async function bubbleSort() {
  for (let i = 0; i < elements.length - 1; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      if (Number(elements[i].getAttribute('index')) > Number(elements[j].getAttribute('index'))) {
        await swap(i, j);
      }
    }
  }
  console.log('done');
}

async function quickSort() {
  async function partition(array, left, right, pivotIndex) {
    const pivotValue = Number(array[pivotIndex].getAttribute('index'));
    await swap(pivotIndex, right); // 把pivot移到結尾
    let storeIndex = left;
    for (let i = left; i < right; i++) {
      if (Number(array[i].getAttribute('index')) <= pivotValue) {
        await swap(storeIndex, i);
        storeIndex++;
      }
    }
    await swap(right, storeIndex); // 把pivot移到它最後的地方
    return storeIndex;
  }
  async function quicksortFunction(array, left, right) {
    if (right > left) {
      const pivotIndex = left + Math.floor(Math.random() * (right - left));
      const pivotNewIndex = await partition(array, left, right, pivotIndex);
      await quicksortFunction(array, left, pivotNewIndex - 1);
      await quicksortFunction(array, pivotNewIndex + 1, right);
    }
  }
  await quicksortFunction(elements, 0, elements.length - 1);
  console.log('done');
}

async function selectionSort() {
  for (let i = 0; i < elements.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < elements.length; j++) {
      if (Number(elements[j].getAttribute('index')) < Number(elements[minIndex].getAttribute('index'))) {
        minIndex = j;
      }
    }
    if (i < minIndex) {
      await swap(i, minIndex);
    }
  }
  console.log('done');
}

initial(512);
random();
draw();