const DateTime = luxon.DateTime;

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
            .filter(componente => componente.tipo === 'resistor')
            .reduce((total, componente) => total + componente.valor, 0);
    }

    calcularVoltajeTotal() {
        return this.componentes
            .filter(componente => componente.tipo === 'bateria' || componente.tipo === 'transformador')
            .reduce((total, componente) => total + componente.valor, 0);
    }

    calcularCorriente() {
        const resistenciaTotal = this.calcularResistenciaTotal();
        const voltajeTotal = this.calcularVoltajeTotal();
        return resistenciaTotal === 0 ? 0 : voltajeTotal / resistenciaTotal;
    }

    guardarComponentes() {
        const componentesConMetodos = this.componentes.map(c => ({
            tipo: c.tipo,
            valor: c.valor,
            imagen: c.imagen,
            x: c.x,
            y: c.y
        }));
        localStorage.setItem('componentes', JSON.stringify(componentesConMetodos));
        localStorage.setItem('fechaGuardado', DateTime.now().toISO());
    }

    cargarComponentes() {
        const componentesGuardados = JSON.parse(localStorage.getItem('componentes'));
        if (componentesGuardados) {
            this.componentes = componentesGuardados.map(c => new Componente(c.tipo, c.valor, c.imagen, c.x, c.y));
            const fechaGuardado = localStorage.getItem('fechaGuardado');

            if (this.componentes.length > 0 && fechaGuardado !== null) {
                const fechaGuardadoFormat = DateTime.fromISO(fechaGuardado).toFormat('dd LLL yyyy HH:mm:ss');
                Swal.fire(`Componentes cargados. Última modificación: ${fechaGuardadoFormat}`);
            }
        }
    }
}

const circuito = new Circuito();

// Inicializa la lista de componentes disponibles y los botones de cálculo
actualizarComponentesDisponibles();
crearBotonesCalculo();
mostrarComponentesMesaGuardados();

// Función para crear los botones de cálculo y de resetear
function crearBotonesCalculo() {
    const opcionesCalculo = document.getElementById('opciones-calculo');

    const botones = [
        { text: "Calcular Resistencia Total", onclick: calcularResistenciaTotal },
        { text: "Calcular Voltaje Total", onclick: calcularVoltajeTotal },
        { text: "Calcular Corriente", onclick: calcularCorriente }
    ];

    botones.forEach(boton => {
        const button = document.createElement('button');
        button.textContent = boton.text;
        button.addEventListener('click', boton.onclick);
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

// Función para resetear la mesa de trabajo y los componentes
function resetear() {
    circuito.componentes = [];
    circuito.guardarComponentes();
    actualizarComponentesDisponibles();
    const mesaGrande = document.getElementById('mesa-grande');
    mesaGrande.innerHTML = '';
    Swal.fire(`Circuito reseteado exitosamente`, '', 'success');
}

// Función para calcular la resistencia total y mostrar el resultado
function calcularResistenciaTotal() {
    Swal.fire(`La resistencia total del circuito es: ${circuito.calcularResistenciaTotal()} Ohms`, '', 'success');
}

// Función para calcular el voltaje total y mostrar el resultado
function calcularVoltajeTotal() {
    Swal.fire(`El voltaje total del circuito es: ${circuito.calcularVoltajeTotal()} Volts`, '', 'success');
}

// Función para calcular la corriente total y mostrar el resultado
function calcularCorriente() {
    Swal.fire(`La corriente total del circuito es: ${circuito.calcularCorriente()} Amperios`, '', 'success');
}

// Función para actualizar la lista de componentes disponibles en la interfaz
function actualizarComponentesDisponibles() {
    fetch('componentes.json')
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('componentes-disponibles');
            lista.innerHTML = '';

            data.forEach(disponible => {
                const li = document.createElement('li');
                li.classList.add('componente');
                li.setAttribute('draggable', 'true');
                li.dataset.componente = JSON.stringify(disponible);

                const img = document.createElement('img');
                img.src = disponible.imagen;
                img.width = 50;

                const nombre = document.createElement('span');
                nombre.textContent = ` ${disponible.tipo.charAt(0).toUpperCase() + disponible.tipo.slice(1)} (${disponible.valor})`;

                li.appendChild(img);
                li.appendChild(nombre);
                lista.appendChild(li);
            });

            lista.addEventListener('dragstart', event => {
                const componente = event.target.dataset.componente;
                event.dataTransfer.setData('componente', componente);
            });
        })
        .catch(error => console.error('Error al cargar los componentes:', error));
}

// Función para mostrar los componentes guardados en la mesa de trabajo
function mostrarComponentesMesaGuardados() {
    circuito.componentes.forEach(componente => {
        agregarComponenteMesa(componente);
    });
}

// Función para agregar un componente a la mesa de trabajo
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
        circuito.componentes = circuito.componentes.filter(c => c != componente);
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

            componente.y = parseFloat(div.style.top);
            circuito.guardarComponentes();
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Eventos para la mesa grande para arrastrar y soltar los componentes
const mesaGrande = document.getElementById('mesa-grande');

mesaGrande.addEventListener('dragover', event => {
    event.preventDefault();
});

mesaGrande.addEventListener('drop', event => {
    event.preventDefault();
    const data = event.dataTransfer.getData('componente');
    const componente = JSON.parse(data);
    componente.x = event.clientX - mesaGrande.offsetLeft;
    componente.y = event.clientY - mesaGrande.offsetTop;
    const nuevoComponente = new Componente(componente.tipo, componente.valor, componente.imagen, componente.x, componente.y);
    circuito.agregarComponente(nuevoComponente);
    agregarComponenteMesa(nuevoComponente);
    circuito.guardarComponentes();
});

// Alertas
function sweetAlertCarga(mensaje) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: mensaje,
        showConfirmButton: false,
        timer: 1000
    });
}

function sweetAlertReseteo() {
    Swal.fire({
        icon: "question",
        title: "¿Desea resetear la mesa de trabajo?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, resetear",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            resetear();
        }
    });
}
