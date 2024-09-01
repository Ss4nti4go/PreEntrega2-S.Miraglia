document.addEventListener('DOMContentLoaded', () => {
    cargarComponentes();
    inicializarBotonesCalculo();
});

class Componente {
    constructor(tipo, valor, imagen, x = 0, y = 0) {
        this.tipo = tipo;
        this.valor = valor;
        this.imagen = imagen;
        this.x = x;
        this.y = y;
    }
}

class Circuito {
    constructor() {
        this.componentes = [];
        this.cargarComponentes();
    }

    agregarComponente(componente) {
        this.componentes.push(componente);
        this.guardarComponentes();
    }

    calcularResistenciaTotal() {
        return this.componentes
            .filter(c => c.tipo === 'resistor')
            .reduce((total, c) => total + c.valor, 0);
    }

    calcularVoltajeTotal() {
        return this.componentes
            .filter(c => c.tipo === 'bateria' || c.tipo === 'transformador')
            .reduce((total, c) => total + c.valor, 0);
    }

    calcularCorriente() {
        const resistenciaTotal = this.calcularResistenciaTotal();
        const voltajeTotal = this.calcularVoltajeTotal();
        return resistenciaTotal === 0 ? 0 : voltajeTotal / resistenciaTotal;
    }

    guardarComponentes() {
        const componentesParaGuardar = this.componentes.map(c => ({
            tipo: c.tipo,
            valor: c.valor,
            imagen: c.imagen,
            x: c.x,
            y: c.y
        }));
        localStorage.setItem('componentes', JSON.stringify(componentesParaGuardar));
    }

    cargarComponentes() {
        const componentesGuardados = JSON.parse(localStorage.getItem('componentes'));
        if (componentesGuardados) {
            this.componentes = componentesGuardados.map(c => new Componente(c.tipo, c.valor, c.imagen, c.x, c.y));
            mostrarComponentesMesaGuardados(this.componentes);
        }
    }
}

const circuito = new Circuito();

function cargarComponentes() {
    fetch('componentes.json')
        .then(response => response.json())
        .then(data => mostrarComponentesDisponibles(data))
        .catch(error => console.error('Error al cargar los componentes:', error));
}

function mostrarComponentesDisponibles(componentes) {
    const lista = document.getElementById('componentes-disponibles');
    lista.innerHTML = '';

    componentes.forEach(componente => {
        const li = document.createElement('li');
        li.classList.add('componente');
        li.setAttribute('draggable', 'true');
        li.setAttribute('data-tipo', componente.tipo);
        li.setAttribute('data-valor', componente.valor);
        li.innerHTML = `
            <img src="${componente.imagen}" alt="${componente.tipo}" />
            <span>${componente.tipo} (${componente.valor})</span>
        `;
        li.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', JSON.stringify(componente));
        });
        lista.appendChild(li);
    });

    document.getElementById('mesa-grande').addEventListener('dragover', event => {
        event.preventDefault();
    });

    document.getElementById('mesa-grande').addEventListener('drop', event => {
        event.preventDefault();
        const componente = JSON.parse(event.dataTransfer.getData('text/plain'));
        const nuevoComponente = new Componente(componente.tipo, componente.valor, componente.imagen, event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop);
        circuito.agregarComponente(nuevoComponente);
        mostrarComponentesMesaGuardados(circuito.componentes);
    });
}

function mostrarComponentesMesaGuardados(componentes) {
    const mesa = document.getElementById('mesa-grande');
    mesa.innerHTML = '';

    componentes.forEach(componente => {
        const div = document.createElement('div');
        div.classList.add('componente-en-mesa');
        div.style.left = `${componente.x}px`;
        div.style.top = `${componente.y}px`;
        div.innerHTML = `
            <img src="${componente.imagen}" alt="${componente.tipo}" />
            <span>${componente.tipo} (${componente.valor})</span>
        `;
        mesa.appendChild(div);
    });
}

function inicializarBotonesCalculo() {
    const opcionesCalculo = document.getElementById('opciones-calculo');

    const botones = [
        { text: "Calcular Resistencia Total", onclick: calcularResistenciaTotal },
        { text: "Calcular Voltaje Total", onclick: calcularVoltajeTotal },
        { text: "Calcular Corriente", onclick: calcularCorriente },
        { text: "Resetear", onclick: resetear }
    ];

    botones.forEach(boton => {
        const button = document.createElement('button');
        button.textContent = boton.text;
        button.addEventListener('click', boton.onclick);
        opcionesCalculo.appendChild(button);
    });

    const menuCalculo = document.getElementById('menu-calculo');
    menuCalculo.style.display = 'block';
    menuCalculo.addEventListener('click', () => {
        opcionesCalculo.style.display = opcionesCalculo.style.display === 'none' ? 'block' : 'none';
    });
}

function resetear() {
    circuito.componentes = [];
    circuito.guardarComponentes();
    mostrarComponentesMesaGuardados(circuito.componentes);
    Swal.fire('Circuito reseteado exitosamente', '', 'success');
}

function calcularResistenciaTotal() {
    Swal.fire(`La resistencia total del circuito es: ${circuito.calcularResistenciaTotal()} Ohms`, '', 'success');
}

function calcularVoltajeTotal() {
    Swal.fire(`El voltaje total del circuito es: ${circuito.calcularVoltajeTotal()} Volts`, '', 'success');
}

function calcularCorriente() {
    Swal.fire(`La corriente total del circuito es: ${circuito.calcularCorriente()} Amperios`, '', 'success');
}
