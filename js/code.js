function iniciarPartida() {
    let files = parseInt(prompt("Número de files (min 10, max 30):", 10));
    let columnes = parseInt(prompt("Número de columnes (min 10, max 30):", 10));

    files = Math.max(10, Math.min(30, files));
    columnes = Math.max(10, Math.min(30, columnes));

    crearTaulell(files, columnes);
    setMines(files, columnes);
    calculaAdjacents(files, columnes);
}

function crearTaulell(files, columnes) {
    const taulell = document.getElementById('taulell');
    taulell.innerHTML = '';
    const taula = document.createElement('table');

    for (let i = 0; i < files; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < columnes; j++) {
            const celda = document.createElement('td');
            celda.setAttribute('data-mina', 'false');
            celda.setAttribute('data-num-mines', '0');
            celda.setAttribute('data-x', i);
            celda.setAttribute('data-y', j);
            celda.onclick = function () {
                obreCasella(i, j);
            };
            const img = document.createElement('img');
            img.src = 'img_buscaminas/fondo20px.jpg';
            celda.appendChild(img);
            fila.appendChild(celda);
        }
        taula.appendChild(fila);
    }
    taulell.appendChild(taula);
}

function setMines(files, columnes) {
    const numMines = Math.floor(files * columnes * 0.17);
    let minesPosades = 0;

    while (minesPosades < numMines) {
        const x = Math.floor(Math.random() * files);
        const y = Math.floor(Math.random() * columnes);
        const celda = document.querySelector(`td[data-x="${x}"][data-y="${y}"]`);
        if (celda.getAttribute('data-mina') === 'false') {
            celda.setAttribute('data-mina', 'true');
            minesPosades++;
        }
    }
}

function calculaAdjacents(files, columnes) {
    for (let i = 0; i < files; i++) {
        for (let j = 0; j < columnes; j++) {
            if (!esMina(i, j)) {
                let numMinesAdjacents = 0;
                for (let x = Math.max(0, i - 1); x <= Math.min(files - 1, i + 1); x++) {
                    for (let y = Math.max(0, j - 1); y <= Math.min(columnes - 1, j + 1); y++) {
                        if (esMina(x, y)) {
                            numMinesAdjacents++;
                        }
                    }
                }
                setMinesAdjacents(i, j, numMinesAdjacents);
            }
        }
    }
}

function esMina(x, y) {
    return document.querySelector(`td[data-x="${x}"][data-y="${y}"]`).getAttribute('data-mina') === 'true';
}

function setMinesAdjacents(x, y, nMinesAdjacents) {
    document.querySelector(`td[data-x="${x}"][data-y="${y}"]`).setAttribute('data-num-mines', nMinesAdjacents);
}

function obreCasella(x, y) {
    const celda = document.querySelector(`td[data-x="${x}"][data-y="${y}"]`);
    if (celda.getAttribute('data-mina') === 'true') {
        alert('Has perdut!');
        mostrarMines();
    } else {
        mostrarNumMines(celda);
        if (celda.getAttribute('data-num-mines') === '0') {
            obrirCasellesAdjacents(x, y);
        }
        verificarVictoria();
    }
}

function mostrarMines() {
    document.querySelectorAll('td[data-mina="true"]').forEach(celda => {
        celda.innerHTML = '<img src="img_buscaminas/mina20px.jpg" alt="mina">';
    });
}

function mostrarNumMines(celda) {
    const numMines = celda.getAttribute('data-num-mines');
    celda.innerHTML = numMines;
    celda.style.backgroundColor = 'lightgrey';
}

function obrirCasellesAdjacents(x, y) {
    for (let i = Math.max(0, x - 1); i <= Math.min(document.querySelectorAll('tr').length - 1, x + 1); i++) {
        for (let j = Math.max(0, y - 1); j <= Math.min(document.querySelectorAll('tr')[0].children.length - 1, y + 1); j++) {
            const celda = document.querySelector(`td[data-x="${i}"][data-y="${j}"]`);
            if (celda.innerHTML === '') {
                mostrarNumMines(celda);
                if (celda.getAttribute('data-num-mines') === '0') {
                    obrirCasellesAdjacents(i, j);
                }
            }
        }
    }
}

function verificarVictoria() {
    const caselles = document.querySelectorAll('td');
    let victoria = true;
    caselles.forEach(celda => {
        if (celda.getAttribute('data-mina') === 'false' && celda.innerHTML === '') {
            victoria = false;
        }
    });

    if (victoria) {
        alert('Has guanyat!');
    }
}