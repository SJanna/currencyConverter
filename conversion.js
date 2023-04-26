const conversionForm = document.getElementById('conversion-form');
const resultContainer = document.getElementById('result-container');
const conversionTable = document.getElementById('conversion-table');

// // API URL
const apiUrl = 'https://api.apilayer.com/fixer/convert';
// Función para realizar la conversión de moneda
var myHeaders = new Headers();
myHeaders.append("apikey", "3eygHmA5eDM6OD3XDJqR9sJ4zCMRhPap");
var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};
function convertCurrency(event) {
    event.preventDefault();
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = document.getElementById('amount').value;
    fetch(`${apiUrl}?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            const result = data.result;
            resultContainer.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
        })
}
conversionForm.addEventListener('submit', convertCurrency);


//Mostrar las distintas opciones de moneda
const fromCurrencySelect = document.querySelector('#from-currency');
const toCurrencySelect = document.querySelector('#to-currency');
const tableCurrencySelect = document.querySelector('#table-fromCurrency');


const Agregar = document.getElementById('addCurrency');
const mySelect = document.getElementById('selectCurrency');
const data = ['USD', 'COP', 'EUR']

Agregar.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página
    const selectedValue = mySelect.value;
    if (!data.includes(selectedValue)){
        data.push(selectedValue);
    }
    console.log(data); // Para verificar que el elemento se agregó correctamente
});

function actualizarTabla(){
    const table = document.getElementById('conversionTable');
    table.innerHTML=""
    const fromCurrency = document.getElementById('table-fromCurrency').value;
    amount = 1
    data.forEach((item) => {
        fetch(`${apiUrl}?to=${item}&from=${fromCurrency}&amount=${amount}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                const result = data.result;
                // Crear una fila de tabla
                const row = table.insertRow(0);
                // Insertar celdas en la fila y asignarles valores
                const idCell = row.insertCell(0);
                idCell.innerHTML = `${amount} ${fromCurrency} = ${result} ${item}`;
            })

    })
};
window.addEventListener('load', actualizarTabla) 
document.getElementById('table-fromCurrency').addEventListener('change', actualizarTabla) 
document.getElementById('addCurrency').addEventListener('submit', actualizarTabla) 

fetch("https://api.apilayer.com/fixer/symbols", requestOptions)
    .then(response => response.json())
    .then(data => {
        const symbols = data.symbols;
        const options = Object.keys(symbols).map(symbol => {
            return `<option value="${symbol}">${symbol} - ${symbols[symbol]}</option>`;
        }).join('');
        fromCurrencySelect.innerHTML = options;
        toCurrencySelect.innerHTML = options;
        tableCurrencySelect.innerHTML = options;
        mySelect.innerHTML=options;
    });