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
  });
};

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
  gerarPaletaAleatoria();
  limpar();
};

const savedGridSize = JSON.parse(localStorage.getItem('boardSize'));
if (savedGridSize) {
  inputUsuario.value = savedGridSize;
  createGrid(savedGridSize);
} else {
  createGrid(5);
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



