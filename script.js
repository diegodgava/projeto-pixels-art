const paleta = document.querySelectorAll('.color');
const coresMenosPrimeira = document.querySelectorAll('.color:not(.color1)');
const botaoLimpar = document.getElementById('clear-board');
const pixelBoard = document.getElementById('pixel-board');
const botaoGrid = document.getElementById('generate-board');
const inputUsuario = document.getElementById('board-size');
const footer = document.getElementById('header');
const header = document.getElementById('footer');

const corAleatória = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const gerarPaletaAleatoria = () => {
  const botaoCorAleatoria = document.getElementById('button-random-color');
  botaoCorAleatoria.addEventListener('click', () => {
    const coresAtuais = [];

    for (let i = 0; i < coresMenosPrimeira.length; i += 1) {
      const novaCor = corAleatória();
      coresMenosPrimeira[i].style.backgroundColor = novaCor;
      coresAtuais.push(novaCor);
      botaoCorAleatoria.style.backgroundColor = corAleatória();
      botaoLimpar.style.backgroundColor = corAleatória();
      botaoGrid.style.backgroundColor = corAleatória();
      footer.style.backgroundColor = corAleatória();
      header.style.backgroundColor = corAleatória();
    }
    localStorage.setItem('colorPalette', JSON.stringify(coresAtuais));
    localStorage.setItem('corDoHeader', JSON.stringify(corAleatória()));
    localStorage.setItem('corDoFooter', JSON.stringify(corAleatória()));
  });
};
const carregarCoresFootHead = () => {
  const corDoHeader = JSON.parse(localStorage.getItem('corDoHeader'));
  const corDoFooter = JSON.parse(localStorage.getItem('corDoFooter'));
  if (corDoHeader) header.style.backgroundColor = corDoHeader;
  if (corDoFooter) footer.style.backgroundColor = corDoFooter;
}
const carregaCoresDaPaleta = () => {
  const colorPalette = JSON.parse(localStorage.getItem('colorPalette'));
  for (let i = 0; i < coresMenosPrimeira.length; i += 1) {
    if (colorPalette) {
      coresMenosPrimeira[i].style.backgroundColor = colorPalette[i];
    }
  }
};

const selecionaPaleta = () => {
  for (let i = 0; i < paleta.length; i += 1) {
    paleta[i].addEventListener('click', (event) => {
      const selected = document.querySelector('.selected');
      if (selected) {
        selected.classList.remove('selected');
      }
      event.target.classList.add('selected');
    });
  }
};

const pixels = [];

function createGrid(tamanho) {
  pixelBoard.innerHTML = '';
  const tamanhoASalvar = inputUsuario.value;
  for (let i = 0; i < tamanho * tamanho; i += 1) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixelBoard.appendChild(pixel);
    pixels.push(pixel);
    pixel.addEventListener('click', (event) => {
      const item = event.target;
      item.style.backgroundColor = document.querySelector('.selected').style.backgroundColor;
      localStorage.setItem(`pixelBoard${i}`, JSON.stringify(event.target.style.backgroundColor));
      localStorage.setItem('pixelBoard', JSON.stringify(event.target.style.backgroundColor));
    });
    pixelBoard.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
    pixelBoard.style.gridTemplateRows = `repeat(${tamanho}, 1fr)`;
    localStorage.setItem('boardSize', JSON.stringify(tamanhoASalvar));
  }
  return pixels;
}
botaoGrid.addEventListener('click', () => {
  let tamanho = inputUsuario.value;
  if (tamanho === '') alert('Board inválido!');
  if (tamanho < 5) tamanho = 5;
  if (tamanho > 50) tamanho = 50;
  if (tamanho > 0) {
    createGrid(tamanho);
  } else {
    alert('Board inválido!');
  }
  window.location.reload();
});

function recuperarCoresSalvas() {
  for (let i = 0; i < pixels.length; i += 1) {
    const corArmazenada = localStorage.getItem(`pixelBoard${i}`);
    if (corArmazenada) {
      pixels[i].style.backgroundColor = JSON.parse(corArmazenada);
    }
  }
}
const limpar = () => {
  botaoLimpar.addEventListener('click', () => {
    const grid = document.querySelectorAll('.pixel');
    for (let i = 0; i < grid.length; i += 1) {
      grid[i].style.backgroundColor = 'white';
      localStorage.removeItem('pixelBoard');
      localStorage.removeItem(`pixelBoard${i}`);
    }
  });
};

window.onload = () => {
  recuperarCoresSalvas();
  selecionaPaleta();
  carregaCoresDaPaleta();
  carregarCoresFootHead();
  gerarPaletaAleatoria();
  limpar();
};

let savedGridSize = JSON.parse(localStorage.getItem('boardSize'));
if (savedGridSize) {
  inputUsuario.value = savedGridSize;
  createGrid(savedGridSize);
} else {
  createGrid(5);
  savedGridSize = 5;
}

// Extra - FIRULAS EXTRAS DESNECESSÁRIAS

let isMouseDown = false;

const MouseDown = () => {
  isMouseDown = true;
};

const MouseUp = () => {
  isMouseDown = false;
};

const MouseOver = (event, i) => { // Função pra conseguir pintar e salvar
  if (isMouseDown) {
    const item = event.target;
    item.style.backgroundColor = document.querySelector('.selected').style.backgroundColor;
    localStorage.setItem(`pixelBoard${i}`, JSON.stringify(item.style.backgroundColor));
  }
};

pixelBoard.addEventListener('mousedown', MouseDown);
pixelBoard.addEventListener('mouseup', MouseUp);

for (let i = 0; i < pixels.length; i += 1) {
  pixels[i].addEventListener('mouseover', (event) => {
    MouseOver(event, i);
  });
}
// Borracha
const selecionaBorracha = () => {
  const borracha = document.getElementById('borracha');
  borracha.addEventListener('click', (event) => {
    const borrachaSelect = document.querySelector('.selected');
    if (borrachaSelect) {
      borrachaSelect.classList.remove('selected');
    }
    event.target.classList.add('selected');
  });
};
selecionaBorracha();


const canvas = document.getElementById('canvas');
const btnDownload = document.getElementById('btn-download');

const pixelSize = 42;

const rows = savedGridSize;
const cols = savedGridSize;

canvas.width = pixelSize * cols;
canvas.height = pixelSize * rows;

const ctx = canvas.getContext('2d');


const pixelss = [];
for (let i = 0; i < rows * cols; i++) {
  const color = JSON.parse(localStorage.getItem(`pixelBoard${i}`));
  if (color) {
    pixelss.push(color);
  } else {
    pixelss.push('white');
  }
}

for (let i = 0; i < pixelss.length; i++) {
  const row = Math.floor(i / cols);
  const col = i % cols;
  const color = pixelss[i];
  ctx.fillStyle = color;
  ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
}

btnDownload.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'pixel-board.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Desenho livre no canvas
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// alterar visualização

const botaoVisao = document.getElementById('mudar-visao');

botaoVisao.addEventListener('click', () => {
  const tipoVisualizacao = localStorage.getItem('tipo-visualizacao');
  if (tipoVisualizacao === 'canvas') {
    pixelBoard.style.display = 'grid';
    canvas.style.display = 'none';
    localStorage.setItem('tipo-visualizacao', 'pixelboard');
  } else {
    pixelBoard.style.display = 'none';
    canvas.style.display = 'block';
    localStorage.setItem('tipo-visualizacao', 'canvas');
  }
  window.location.reload();
});

const tipoVisualizacao = localStorage.getItem('tipo-visualizacao');
if (tipoVisualizacao === 'canvas') {
  pixelBoard.style.display = 'none';
  canvas.style.display = 'block';
} else {
  pixelBoard.style.display = 'grid';
  canvas.style.display = 'none';
}