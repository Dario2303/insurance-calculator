function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo =tipo;
}

//realiza la cotizacion  con los datos
Seguro.prototype.cotizarSeguro = function () {

    let cantidad;
    const base = 8000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.30;
            break;
        default:
            break;
    }
    
    //leer el año
    const diferencia = new Date().getFullYear() - this.year;

    //mayor diferencia entre los años, el costo  reduce un 3%
    cantidad = cantidad - ((diferencia * 3) * cantidad) / 100; 

    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    }else{
        cantidad *= 1.50;
    }

    return cantidad;
}


function UI() {}


//completando las opciones de los años
UI.prototype.optionYear = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--) {
        let option = document.createElement('OPTION');

        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option)
    }
}



// mostrando alerta en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('DIV')

    if(tipo === 'error') {
        div.classList.add('error')
    }else{
        div.classList.add('correcto')
    }

    div.classList.add('mensaje', 'mt-10')
    div.textContent = mensaje;

    //insertar el div en el HTML
    const form = document.querySelector('#cotizar-seguro');
    form.insertBefore(div, document.querySelector('#resultado'))

    setTimeout(() => {
        div.remove(); 
    }, 2000);
}

UI.prototype.mostrarResultado = (total, seguro) => {
    
    const {marca, year, tipo} = seguro;
    let textoMarca;

    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break; 
        case '2':
            textoMarca = 'Asiatico';
            break; 
        case '3':
            textoMarca = 'Europeo';
            break; 
        default:
            break;
    }

    //resultado
    const div = document.createElement('DIV');
    div.classList.add('mt-10')

    div.innerHTML = `
        <p class='header'> Tu resumen</p>
        <p class='font-bold'> Marca: <span class='font-normal'>${textoMarca}</span></p>
        <p class='font-bold'> Año: <span class='font-normal'>${year}</span></p>
        <p class='font-bold'> Tipo: <span class='font-normal capitalize'>${tipo}</span></p>
        <p class='font-bold'> Total: <span class='font-normal'>$${total}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    

    //Mostrar spiner

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 2000);
}


//instanciando interfaz de usuario
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.optionYear();
})


eventForm();

function eventForm() {
    const form = document.querySelector('#cotizar-seguro');
    form.addEventListener('submit', cotizar)
}

function cotizar(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error')
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'correcto')



    //ocultando cotizaciones previas
    const resultados = document.querySelector('#resultado div')
    if (resultados != null) {
        resultados.remove();
    }

    //instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //Utilizar prototype que vamos a utilizar
    ui.mostrarResultado(total, seguro);

}