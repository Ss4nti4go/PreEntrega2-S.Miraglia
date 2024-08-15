
class Componente {
    // Constructor que inicializa el tipo, valor, imagen y posición del componente
    constructor(tipo, valor, imagen, x = 0, y = 0) {
        this.tipo = tipo; // Tipo de componente (ej. resistor, batería)
        this.valor = valor; // Valor del componente (ej. 100 Ohm, 9V)
        this.imagen = imagen; // URL de la imagen del componente
        this.x = x; // Posición horizontal del componente en la mesa
        this.y = y; // Posición vertical del componente en la mesa
    }
}

// Clase que maneja el circuito
class Circuito {
    // Constructor que inicializa la lista de componentes y carga los componentes guardados
    constructor() {
        this.componentes = [];
        this.cargarComponentes();
    }

    // Método para agregar un componente al circuito
    agregarComponente(componente) {
        this.componentes.push(componente); // Añade el componente a la lista
        this.guardarComponentes(); // Guarda la lista actualizada en el almacenamiento local
    }

    // Método para calcular la resistencia total del circuito
    calcularResistenciaTotal() {
        return this.componentes
            .filter(componente => componente.tipo === 'resistor') // Filtra solo los resistores
            .reduce((total, componente) => total + componente.valor, 0); // Suma los valores de las resistencias
    }

    // Método para calcular el voltaje total del circuito
    calcularVoltajeTotal() {
        return this.componentes
            .filter(componente => componente.tipo === 'bateria' || componente.tipo === 'transformador') // Filtra solo baterías y transformadores
            .reduce((total, componente) => total + componente.valor, 0); // Suma los valores del voltaje
    }

    // Método para calcular la corriente total del circuito
    calcularCorriente() {
        const resistenciaTotal = this.calcularResistenciaTotal(); // Calcula la resistencia total
        const voltajeTotal = this.calcularVoltajeTotal(); // Calcula el voltaje total
        return resistenciaTotal === 0 ? 0 : voltajeTotal / resistenciaTotal; // Calcula la corriente usando la ley de Ohm
    }

    // Método para guardar los componentes en el almacenamiento local
    guardarComponentes() {
        const componentesConMetodos = this.componentes.map(c => ({
            tipo: c.tipo,
            valor: c.valor,
            imagen: c.imagen,
            x: c.x,
            y: c.y
        }));
        localStorage.setItem('componentes', JSON.stringify(componentesConMetodos)); // Guarda los componentes como JSON
    }

    // metodo para cargar los componentes desde el almacenamiento local
    cargarComponentes() {
        const componentesGuardados = JSON.parse(localStorage.getItem('componentes'));
        if (componentesGuardados) {
            this.componentes = componentesGuardados.map(c => new Componente(c.tipo, c.valor, c.imagen, c.x, c.y)); // Crea objetos "componente" a partir de los datos guardados
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
    botonReset.addEventListener('click', resetear);
    opcionesCalculo.appendChild(botonReset);

    // Muestra u oculta el menú de cálculo al hacer clic en el menú
    const menuCalculo = document.getElementById('menu-calculo');
    menuCalculo.style.display = 'block';
    menuCalculo.addEventListener('click', () => {
        opcionesCalculo.style.display = opcionesCalculo.style.display === 'none' ? 'block' : 'none';
    });
}

// Función para resetear la mesa de trabajo y los componentes
function resetear() {
    circuito.componentes = []; // Limpia la lista de componentes
    circuito.guardarComponentes(); // Guarda la lista vacía en el almacenamiento local
    actualizarComponentesDisponibles(); // Actualiza la lista de componentes disponibles
    const mesaGrande = document.getElementById('mesa-grande');
    mesaGrande.innerHTML = ''; // Limpia la mesa de trabajo
}

// Función para calcular la resistencia total y mostrar el resultado
function calcularResistenciaTotal() {
    alert(`La resistencia total del circuito es: ${circuito.calcularResistenciaTotal()} Ohms`);
}

// Función para calcular el voltaje total y mostrar el resultado
function calcularVoltajeTotal() {
    alert(`El voltaje total del circuito es: ${circuito.calcularVoltajeTotal()} Volts`);
}

// Función para calcular la corriente total y mostrar el resultado
function calcularCorriente() {
    alert(`La corriente total del circuito es: ${circuito.calcularCorriente()} Amperios`);
}

// Función para actualizar la lista de componentes disponibles en la interfaz
function actualizarComponentesDisponibles() {
    const disponibles = [
        { tipo: 'resistor', valor: 100, imagen: 'https://imgs.search.brave.com/4UMVs4Bw2kU04CT4T0U9-4ga8KsJGfViB0pth3SxEwQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mZXJy/ZXRyb25pY2EuY29t/L2Nkbi9zaG9wL3By/b2R1Y3RzL3Jlc2lz/dGVuY2lhX21lZGlv/X3dhdHRfZmVycmV0/cm9uaWNhXzg4MmU5/YjA5LTY3MTYtNDU5/NC1hMGI4LWQ3NjNm/MzkxNDMzMV81MTJ4/LmpwZz92PTE1Nzc0/OTY2Mjg' },
        { tipo: 'bateria', valor: 9, imagen: 'https://imgs.search.brave.com/GyVXjkzL1tzOkivAmcLTxxN2bvnA3pOcZZcEgf7irSA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YXdzbGkuY29tLmJy/LzYwMHg0NTAvOTM0/LzkzNDU2MS9wcm9k/dXRvLzIyOTU5NTQz/MWM4NzZjOGM0YTYu/anBn' },
        { tipo: 'led', valor: 2, imagen: 'https://imgs.search.brave.com/pCTxgOYqWJdWEXTr5frpgqpS_WSfQLD_kFEH5ydS7j0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vd3d3LnRl/c2xhZWxlY3Ryb25p/Yy5jb20ucGUvd3At/Y29udGVudC91cGxv/YWRzLzIwMTgvMTIv/TGVkLlJvam9fLmpw/Zz9maXQ9NjAwLDYw/MCZzc2w9MQ' },
        { tipo: 'diodo', valor: 3, imagen: 'https://imgs.search.brave.com/V3c9amnoEjxfgERnck2KnJ4E7vZ9mT4PHiCHP1vYrpw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzMxNXRqVmxPbzdM/LmpwZw' },
        { tipo: 'transformador', valor: 12, imagen: 'https://imgs.search.brave.com/DTE0STCQuhZWB4Jx3GwX-XKw2YDGInkw77fvrFvPjZo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZXRh/bGhlcy5lZ2l0YW5h/LmVzL2Jvc3MtYnJj/LTIzMF81OWE4MmM4/N2JhN2JlLmpwZw' },
    ];

    const lista = document.getElementById('componentes-disponibles');
    lista.innerHTML = ''; // Limpia la lista de componentes disponibles

    disponibles.forEach(disponible => {
        const li = document.createElement('li');
        li.classList.add('componente');
        li.setAttribute('draggable', 'true'); // Hace el elemento arrastrable
        li.dataset.componente = JSON.stringify(disponible); // Guarda la información del componente en un atributo de datos

        const img = document.createElement('img');
        img.src = disponible.imagen; // imagen del componente
        img.width = 50;

        const nombre = document.createElement('span');
        nombre.textContent = `${disponible.tipo.charAt(0).toUpperCase() + disponible.tipo.slice(1)} (${disponible.valor})`; // Muestra el nombre y valor del componente

        li.appendChild(img);
        li.appendChild(nombre);
        lista.appendChild(li);
    });

    // Evento para manejar el inicio del arrastre del componente
    lista.addEventListener('dragstart', event => {
        const componente = event.target.dataset.componente;
        event.dataTransfer.setData('componente', componente); // Guarda los datos del componente en el arrastre
    });
}

// Función para mostrar los componentes guardados en la mesa de trabajo
function mostrarComponentesMesaGuardados() {
    circuito.componentes.forEach(componente => {
        agregarComponenteMesa(componente); // Agrega cada componente guardado a la mesa de trabajo
    });
}

// Función para agregar un componente a la mesa de trabajo
function agregarComponenteMesa(componente, x = Math.random() * 90, y = Math.random() * 90) {
    const mesaGrande = document.getElementById('mesa-grande');

    const div = document.createElement('div');
    div.classList.add('componente-enMesa');
    div.style.left = `${x}%`; // Establece la posición horizontal del componente
    div.style.top = `${y}%`; // Establece la posición vertical del componente

    const img = document.createElement('img');
    img.src = componente.imagen; // Establece la imagen del componente

    const nombre = document.createElement('span');
    nombre.textContent = `${componente.tipo.charAt(0).toUpperCase() + componente.tipo.slice(1)} (${componente.valor})`; // Muestra el nombre y valor del componente

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar'; // Texto del botón para eliminar el componente
    botonEliminar.addEventListener('click', () => {
        mesaGrande.removeChild(div); // Elimina el componente de la mesa de trabajo
        circuito.componentes = circuito.componentes.filter(c => c != componente); // Elimina el componente de la lista
        circuito.guardarComponentes(); // Guardar la lista actualizada en el almacenamiento local
    });

    div.appendChild(img);
    div.appendChild(nombre);
    div.appendChild(botonEliminar);
    mesaGrande.appendChild(div);

    // Evento para permitir el movimiento del componente en la mesa de trabajo
    div.addEventListener('mousedown', (e) => {
        const desplazamientoX  = e.clientX - div.getBoundingClientRect().left;
        const desplazamientoY  = e.clientY - div.getBoundingClientRect().top;

        function onMouseMove(event) {
            div.style.left = `${event.clientX - desplazamientoX  - mesaGrande.getBoundingClientRect().left}px`;
            div.style.top = `${event.clientY - desplazamientoY - mesaGrande.getBoundingClientRect().top}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            componente.y = parseFloat(div.style.top); // Actualiza la posición vertical del componente
            circuito.guardarComponentes(); // Guardo la posición actualizada en el almacenamiento local con la funcion gurdarcomponente()
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Eventos para la mesa grande para arrastrar y soltar los componentes
const mesaGrande = document.getElementById('mesa-grande');

mesaGrande.addEventListener('dragover', event => {
    event.preventDefault(); // evita el comportamiento por defecto asi permite el drop
});

mesaGrande.addEventListener('drop', event => {
    event.preventDefault();
    const data = event.dataTransfer.getData('componente');
    const componente = JSON.parse(data);
    componente.x = event.clientX - mesaGrande.offsetLeft;
    componente.y = event.clientY - mesaGrande.offsetTop;
    const nuevoComponente = new Componente(componente.tipo, componente.valor, componente.imagen, componente.x, componente.y);
    circuito.agregarComponente(nuevoComponente); // Agrega el nuevo componente al circuito
    agregarComponenteMesa(nuevoComponente); // Agrega el nuevo componente a la mesa de trabajo
});
