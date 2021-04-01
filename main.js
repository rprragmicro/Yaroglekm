const container = window.document.getElementsByClassName('container')[0];
let elements = [];
let size;

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
  let drawCount = 0;
  for (let i = 0; i < elements.length - 1; i++) {
    for (let j = 0; j < elements.length - 1 - i; j++) {
      if (Number(elements[j].getAttribute('index')) > Number(elements[j + 1].getAttribute('index'))) {
        await swap(j, j + 1);
        drawCount++;
      }
    }
  }
  console.log('bubbleSort done\n\ndrawCount = ' + drawCount);
}

async function quickSort() {
  let drawCount = 0;
  async function partition(array, left, right, pivotIndex) {
    const pivotValue = Number(array[pivotIndex].getAttribute('index'));
    await swap(pivotIndex, right); // 把pivot移到結尾
    let storeIndex = left;
    for (let i = left; i < right; i++) {
      if (Number(array[i].getAttribute('index')) <= pivotValue) {
        await swap(storeIndex, i);
        drawCount++;
        storeIndex++;
      }
    }
    await swap(right, storeIndex); // 把pivot移到它最後的地方
    drawCount++;
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
  console.log('quickSort done\n\ndrawCount = ' + drawCount);
}

async function selectionSort() {
  let drawCount = 0;
  for (let i = 0; i < elements.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < elements.length; j++) {
      if (Number(elements[j].getAttribute('index')) < Number(elements[minIndex].getAttribute('index'))) {
        minIndex = j;
      }
    }
    if (i < minIndex) {
      await swap(i, minIndex);
      drawCount++;
    }
  }
  console.log('selectionSort done\n\ndrawCount = ' + drawCount);
}

async function heapSort () {
  let drawCount = 0;
	async function max_heapify(start, end) {
		//建立父節點指標和子節點指標
		var dad = start;
		var son = dad * 2 + 1;
		if (son >= end)//若子節點指標超過範圍直接跳出函數
			return;
		if (son + 1 < end && Number(elements[son].getAttribute('index')) < Number(elements[son + 1].getAttribute('index')))//先比較兩個子節點大小，選擇最大的
			son++;
		if (Number(elements[dad].getAttribute('index')) <= Number(elements[son].getAttribute('index'))) {//如果父節點小於子節點時，交換父子內容再繼續子節點和孫節點比較
			await swap(dad, son);
      drawCount++;
			await max_heapify(son, end);
		}
	}

	var len = elements.length;
	//初始化，i從最後一個父節點開始調整
	for (var i = Math.floor(len / 2) - 1; i >= 0; i--)
		await max_heapify(i, len);
	//先將第一個元素和已排好元素前一位做交換，再從新調整，直到排序完畢
	for (var i = len - 1; i > 0; i--) {
		await swap(0, i);
		await max_heapify(0, i);
  }
  console.log('heapSort done\ndrawCount = ' + drawCount);
}

async function mergeSort() {
  let drawCount = 0;
  async function merge(left, right, previous, next){
    var result = [];
    while(left.length > 0 && right.length > 0){
      if(Number(left[0].getAttribute('index')) <= Number(right[0].getAttribute('index'))){
        result.push(left.shift());
      }else{
        result.push(right.shift());
      }
      elements = [...previous, ...result, ...left, ...right, ...next];
      await new Promise((resolve) => {
        setTimeout(() => {
          draw();
          drawCount++;
          resolve();
        }, 0);
      });
    }
    return result.concat(left, right);
  }
  async function mergeSortFunction(arr, startIndex){
    if(arr.length <=1) {
      return arr;
    }
    var middle = Math.floor(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle);
    const leftResult = await mergeSortFunction(left, startIndex);
    const rightResult = await mergeSortFunction(right, startIndex + middle);
    return await merge(leftResult, rightResult, elements.slice(0, startIndex), elements.slice(startIndex + arr.length));
  }
  await mergeSortFunction(elements, 0);
  console.log('mergeSort done\ndrawCount = ' + drawCount);
}

async function lessBogoSort() {
  let drawCount = 0;
  let array = elements.slice(0);
  let index = 0;
  while (array.length) {
    for (let i = 0; i < 16; i++) {
      array.sort(() => Math.random() - 0.5);
    }
    elements = [...elements.slice(0, index), ...array];
    await new Promise((resolve) => {
      setTimeout(() => {
        draw();
        drawCount++;
        resolve();
      }, 0);
    });
    let sortedFlag = true;
    for (let i = 1; i < array.length; i++) {
      if (Number(array[i].getAttribute('index')) < Number(array[0].getAttribute('index'))) {
        sortedFlag = false;
        break;
      }
    }
    if (sortedFlag) {
      array = array.slice(1);
      index++;
    }
  }
  console.log('lessBogoSort done\ndrawCount = ' + drawCount);
}

initial(2048);
random();
draw();