const DateTime = luxon.DateTime;
const API_URL = './componentes.json';

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
            .filter(({ tipo }) => tipo === 'resistencia')
            .reduce((total, { valor }) => total + parseFloat(valor), 0);
    }

    calcularVoltajeTotal() {
        return this.componentes
            .filter(({ tipo }) => tipo === 'bateria' || tipo === 'transformador')
            .reduce((total, { valor }) => total + parseFloat(valor), 0);
    }

    calcularCorriente() {
        const resistenciaTotal = this.calcularResistenciaTotal();
        const voltajeTotal = this.calcularVoltajeTotal();
        return resistenciaTotal === 0 ? 0 : voltajeTotal / resistenciaTotal;
    }

    guardarComponentes() {
        const componentesConMetodos = this.componentes.map(({ tipo, valor, imagen, x, y }) => ({
            tipo, valor, imagen, x, y
        }));
        localStorage.setItem('componentes', JSON.stringify(componentesConMetodos));
        localStorage.setItem('fechaGuardado', DateTime.now().toISO());
    }

    cargarComponentes() {
        const componentesGuardados = JSON.parse(localStorage.getItem('componentes')) || [];
        if (componentesGuardados.length > 0) {
            this.componentes = componentesGuardados.map(({ tipo, valor, imagen, x, y }) =>
                new Componente(tipo, valor, imagen, x, y)
            );
            const fechaGuardado = localStorage.getItem('fechaGuardado');
            if (fechaGuardado) {
                const fechaGuardadoFormat = DateTime.fromISO(fechaGuardado).toFormat('dd LLL yyyy HH:mm:ss');
                Swal.fire(`Componentes cargados. Última modificación: ${fechaGuardadoFormat}`);
            }
            // Llamar a mostrarComponentesMesaGuardados después de cargarComponentes
            mostrarComponentesMesaGuardados();
        }
    }
}

const circuito = new Circuito();

actualizarComponentesDisponibles();
crearBotonesCalculo();

function crearBotonesCalculo() {
    const opcionesCalculo = document.getElementById('opciones-calculo');

    const botones = [
        { text: "Calcular Resistencia Total", onclick: calcularResistenciaTotal },
        { text: "Calcular Voltaje Total", onclick: calcularVoltajeTotal },
        { text: "Calcular Corriente", onclick: calcularCorriente }
    ];

    botones.forEach(({ text, onclick }) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onclick);
        opcionesCalculo.appendChild(button);
    });

    const botonReset = document.createElement('button');
    botonReset.textContent = 'Resetear';
    botonReset.addEventListener('click', sweetAlertReseteo);
    opcionesCalculo.appendChild(botonReset);

    const menuCalculo = document.getElementById('menu-calculo');
    menuCalculo.style.display = 'block';
    menuCalculo.addEventListener('click', () => {
        opcionesCalculo.style.display = opcionesCalculo.style.display === 'none' ? 'block' : 'none';
    });
}

function resetear() {
    circuito.componentes = [];
    circuito.guardarComponentes();
    actualizarComponentesDisponibles();
    const mesaGrande = document.getElementById('mesa-grande');
    mesaGrande.innerHTML = '';
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

function actualizarComponentesDisponibles() {
    fetch(API_URL)
        .then(response => response.json())
        .then(disponibles => {
            const lista = document.getElementById('componentes-disponibles');
            lista.innerHTML = '';

            disponibles.forEach(({ tipo, valor, imagen }) => {
                const li = document.createElement('li');
                li.classList.add('componente');
                li.setAttribute('draggable', 'true');
                li.dataset.componente = JSON.stringify({ tipo, valor, imagen });

                const img = document.createElement('img');
                img.src = imagen;
                img.width = 50;

                const nombre = document.createElement('span');
                nombre.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} (${valor})`;

                li.appendChild(img);
                li.appendChild(nombre);
                lista.appendChild(li);
            });

            lista.addEventListener('dragstart', event => {
                const componente = event.target.dataset.componente;
                event.dataTransfer.setData('componente', componente);
            });
        })
        .catch(error => console.error('Error cargando los componentes disponibles:', error));
}

function mostrarComponentesMesaGuardados() {
    circuito.componentes.forEach(componente => agregarComponenteMesa(componente));
}

function agregarComponenteMesa(componente, x = Math.random() * 90, y = Math.random() * 90) {
    const mesaGrande = document.getElementById('mesa-grande');

    const div = document.createElement('div');
    div.classList.add('componente-enMesa');
    div.style.left = `${x}%`;
    div.style.top = `${y}%`;

    const img = document.createElement('img');
    img.src = componente.imagen;

    const nombre = document.createElement('span');
    nombre.textContent = `${componente.tipo.charAt(0).toUpperCase() + componente.tipo.slice(1)} (${componente.valor})`;

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', () => {
        mesaGrande.removeChild(div);
        circuito.componentes = circuito.componentes.filter(c => c !== componente);
        circuito.guardarComponentes();
    });

    div.appendChild(img);
    div.appendChild(nombre);
    div.appendChild(botonEliminar);
    mesaGrande.appendChild(div);

    div.addEventListener('mousedown', (e) => {
        const desplazamientoX = e.clientX - div.getBoundingClientRect().left;
        const desplazamientoY = e.clientY - div.getBoundingClientRect().top;

        function onMouseMove(event) {
            div.style.left = `${event.clientX - desplazamientoX - mesaGrande.getBoundingClientRect().left}px`;
            div.style.top = `${event.clientY - desplazamientoY - mesaGrande.getBoundingClientRect().top}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            componente.x = parseFloat(div.style.left) / mesaGrande.clientWidth * 100;
            componente.y = parseFloat(div.style.top) / mesaGrande.clientHeight * 100;
            circuito.guardarComponentes();
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

const mesaGrande = document.getElementById('mesa-grande');

mesaGrande.addEventListener('dragover', event => {
    event.preventDefault();
});

mesaGrande.addEventListener('drop', event => {
    event.preventDefault();
    const data = event.dataTransfer.getData('componente');
    const componente = JSON.parse(data);
    componente.x = (event.clientX - mesaGrande.getBoundingClientRect().left) / mesaGrande.clientWidth * 100;
    componente.y = (event.clientY - mesaGrande.getBoundingClientRect().top) / mesaGrande.clientHeight * 100;
    const nuevoComponente = new Componente(componente.tipo, componente.valor, componente.imagen, componente.x, componente.y);
    circuito.agregarComponente(nuevoComponente);
    agregarComponenteMesa(nuevoComponente, componente.x, componente.y);
});

function sweetAlertReseteo() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esto eliminará todos los componentes del circuito!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, resetear'
    }).then((result) => {
        if (result.isConfirmed) {
            resetear();
        }
    });
}
