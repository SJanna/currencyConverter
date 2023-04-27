const conversionForm = document.getElementById('conversion-form');
const resultContainer = document.getElementById('result-container');
const conversionTable = document.getElementById('conversion-table');

// API URL
const apiUrl = 'https://api.apilayer.com/currency_data/convert';
const apiKey = 'VaZO7TkXB143lgJUrogj9kRcNzFzZo4e';
const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: new Headers({
    'apikey': apiKey
  })
};

// Función para realizar la conversión de moneda
let conversionStorage = JSON.parse(localStorage.getItem('Convertion')) || [];

function convertCurrency(event) {
  event.preventDefault();

  resultContainer.textContent = 'Haciendo la conversión...'
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  const amount = document.getElementById('amount').value;

  fetch(`${apiUrl}?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      const result = data.result;
      const message = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;

      resultContainer.textContent = message;
      conversionStorage.unshift(message);
      localStorage.setItem('Convertion', JSON.stringify(conversionStorage));
      mostrarConvertions(conversionStorage);
    });
}

conversionForm.addEventListener('submit', convertCurrency);

// Mostrar las distintas opciones de moneda
const fromCurrencySelect = document.querySelector('#from-currency');
const toCurrencySelect = document.querySelector('#to-currency');
const tableCurrencySelect = document.querySelector('#table-fromCurrency');

const addCurrencyForm = document.getElementById('addCurrency');
const selectCurrency = document.getElementById('selectCurrency');
let currenciesStorage = JSON.parse(localStorage.getItem('currencies')) || ['USD', 'COP', 'EUR'];

addCurrencyForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const selectedValue = selectCurrency.value;
  currenciesStorage.push(selectedValue);
  localStorage.setItem('currencies', JSON.stringify(currenciesStorage));
  if (!currenciesStorage.includes(selectedValue)) {
    currenciesStorage.push(selectedValue);
  }
});

//Función para crear y actualizar la tabla
// let addStorage = localStorage.getItem('addMoneda');
function actualizarTabla() {
  let currenciesStorage = JSON.parse(localStorage.getItem('currencies')) || ['USD', 'COP', 'EUR'];
  const table = document.getElementById('conversionTable');
  // let fromCurrencySt = document.getElementById('table-fromCurrency');
  const fromCurrency = document.getElementById('table-fromCurrency').value;
  const amount = 1;
  //Guardamos la moneda seleccionada en el localStorage
  // localStorage.setItem('addMoneda', fromCurrency);
  // fromCurrencySt.value = addStorage
  // Limpiamos la tabla
  table.textContent = "";

  // Creamos la cabecera de la tabla
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  const th1 = document.createElement("th");
  th1.className = "border-b dark:border-slate-600 font-large p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-center";
  th1.innerHTML = "Moneda";
  headerRow.appendChild(th1);
  const th2 = document.createElement("th");
  th2.className = "border-b dark:border-slate-600 font-large p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-center";
  th2.innerHTML = "Tasa de cambio";
  headerRow.appendChild(th2);
console.log(currenciesStorage);
  // Creamos las filas de la tabla
  currenciesStorage.forEach((currency) => {
    fetch(`${apiUrl}?to=${currency}&from=${fromCurrency}&amount=${amount}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const result = data.result;
        const message = `${amount} ${fromCurrency} = ${result} ${currency}`;

        const row = table.insertRow();
        const cell1 = row.insertCell();
        cell1.className = "border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center";
        cell1.innerHTML = currency;
        const cell2 = row.insertCell();
        cell2.className = "border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400 text-center";
        cell2.innerHTML = result;
      });
  });

}

//Eliminar TOTAS las currencies de Tasas de Conversión
document.getElementById("eliminarCurrencies").addEventListener('click', (event) =>{
  localStorage.removeItem('currencies')
  actualizarTabla()
})



window.addEventListener('load', actualizarTabla);
document.getElementById('table-fromCurrency').addEventListener('change', actualizarTabla);
addCurrencyForm.addEventListener('submit', actualizarTabla);

//Obtener desde la API la lista de currencies
fetch('https://api.apilayer.com/currency_data/list', requestOptions)
  .then(response => response.json())
  .then(data => {
    const currencies = data.currencies;
    const options = Object.entries(currencies).map(([currencie, name]) => {
      return `<option value="${currencie}">${currencie} - ${name}</option>`;
    }).join('');

    fromCurrencySelect.innerHTML = options;
    toCurrencySelect.innerHTML = options;
    tableCurrencySelect.innerHTML = options;
    selectCurrency.innerHTML = options;
  });

  function mostrarConvertions() {
    const conversiones = JSON.parse(localStorage.getItem('Convertion') || '[]');
    const container = document.createElement('div');
    container.classList.add('conversiones-container');
    container.innerHTML = conversiones.map(c => `<p>${c}</p>`).join('');
    const registro = document.getElementById('registro');
    registro.innerHTML = '';
    registro.appendChild(container);
  
    const tabla = document.getElementById('registro');
    tabla.innerHTML = `<thead>
                        <tr>
                          <th class="border-b dark:border-slate-600 font-large p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-center" colspan="2">Historial de Conversiones</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white dark:bg-slate-800">
                        ${conversiones.map(c => `<tr><td class="bg-gray-200 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">${c}</td></tr>`).join('')}
                      </tbody>`;
  }
  mostrarConvertions()

  document.getElementById("eliminarRegistro").addEventListener('click', (event) =>{
    localStorage.removeItem('addMoneda')
    mostrarConvertions()
  })