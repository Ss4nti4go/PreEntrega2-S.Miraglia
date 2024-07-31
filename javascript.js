class Componente {
    constructor(tipo, valor) {
        this.tipo = tipo;
        this.valor = valor;
    }
}

// utilizo clases para crear un objeto de cada componente y uno del circuito
class Circuito {
    constructor() {
        // array para contener y modificar los componentes del circuito
        this.componentes = [];
    }

    agregarComponente(componente) {
        this.componentes.push(componente);
    }

    calcularResistenciaTotal() {
        // filtro los componentes para obtener solo resistores y sumo sus valores
        return this.componentes.filter(componente => componente.tipo === 'resistor').reduce((total, componente) => total + componente.valor, 0);
    }

    calcularVoltajeTotal() {
        // filtro los componentes para obtener solo baterías y sumo sus valores
        return this.componentes.filter(componente => componente.tipo === 'bateria').reduce((total, componente) => total + componente.valor, 0);
    }

    calcularCorriente() {
        const resistenciaTotal = this.calcularResistenciaTotal();
        const voltajeTotal = this.calcularVoltajeTotal();
        if (resistenciaTotal === 0) {
            return 0;
        }
        return voltajeTotal / resistenciaTotal; // ley de ohm para calcular el amperaje total
    }

    mostrarComponentes() {
        // utilizo un map y template literals para mostrar todos los componentes que contiene el array y mostrar el valor y la unidad de medida de cada componente
        return this.componentes.map(componente =>
            `${componente.tipo === 'resistor' ? 'Resistor' : 'Batería'}: ${componente.valor} ${componente.tipo === 'resistor' ? 'Ohms' : 'Volts'}`
        ).join('\n');
    }
}

// creo un objeto de circuito para trabajar
const circuito = new Circuito();

const menuPrincipal = () => {
    let opcion;
    do {
        opcion = prompt(
            "Simulador de Circuitos Eléctricos\n" +
            "1. Agregar Resistor\n" +
            "2. Agregar Batería\n" +
            "3. Calcular Resistencia Total\n" +
            "4. Calcular Voltaje Total\n" +
            "5. Calcular Corriente Total\n" +
            "6. Mostrar Componentes\n" +
            "0. Salir\n" +
            "Seleccione una opción:"
        );

        switch (opcion) {
            case '1':
                agregarResistor();
                break;
            case '2':
                agregarBateria();
                break;
            case '3':
                calcularResistenciaTotal();
                break;
            case '4':
                calcularVoltajeTotal();
                break;
            case '5':
                calcularCorriente();
                break;
            case '6':
                mostrarComponentes();
                break;
            case '0':
                alert("Saliendo del simulador...");
                break;
            default:
                alert("Opción inválida. Por favor, intente de nuevo.");
        }
    } while (opcion !== '0');
};

// funciones para agregar componentes al circuito
const agregarResistor = () => {
    const valor = parseFloat(prompt("Ingrese el valor del resistor en Ohms:"));
    if (!isNaN(valor) && valor > 0) {
        circuito.agregarComponente(new Componente('resistor', valor));
        alert("Resistor agregado.");
    } else {
        alert("Valor inválido. Por favor, ingrese un número positivo.");
    }
};

const agregarBateria = () => {
    const valor = parseFloat(prompt("Ingrese el valor de la batería en Volts:"));
    if (!isNaN(valor) && valor > 0) {
        circuito.agregarComponente(new Componente('bateria', valor));
        alert("Batería agregada.");
    } else {
        alert("Valor inválido. Por favor, ingrese un número positivo.");
    }
};

// funciones para llamar a las funciones que hacen su debido cálculo, y mostrar el valor que devuelvan en pantalla
const calcularResistenciaTotal = () => {
    const resistenciaTotal = circuito.calcularResistenciaTotal();
    alert(`La resistencia total del circuito es: ${resistenciaTotal} Ohms`);
};

const calcularVoltajeTotal = () => {
    const voltajeTotal = circuito.calcularVoltajeTotal();
    alert(`El voltaje total del circuito es: ${voltajeTotal} Volts`);
};

const calcularCorriente = () => {
    const corriente = circuito.calcularCorriente();
    alert(`La corriente total del circuito es: ${corriente} Amperios`);
};

const mostrarComponentes = () => {
    const componentes = circuito.mostrarComponentes();
    alert(componentes);
};

menuPrincipal();