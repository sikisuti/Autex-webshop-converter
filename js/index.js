import { Autex } from './supplyer/Autex.js';
import { Complex } from './supplyer/Complex.js';
import { csvHeaders } from './csvHeaders.js';

const csvDelimiter = ',';
let supplyer;

let supplyerPicker = document.getElementById("supplyerPicker");
supplyerPicker.addEventListener('change', () => {
  supplyer = getSupplyer(supplyerPicker.value);
  supplyerDiv.innerHTML = '';
  supplyer.renderDiv(supplyerDiv);
}, false);
let supplyerDiv = document.getElementById('supplyerDiv');
let btnConvert = document.getElementById('btnConvert');
btnConvert.addEventListener('click', readFile, false);

renderSupplyerPicker(['Autex', 'Complex']);

function renderSupplyerPicker(providerList) {
  providerList.forEach(element => {
    let option = document.createElement('option');
    option.text = element;
    option.value = element;
    supplyerPicker.add(option);
  });
}

function getSupplyer(supplyerName) {
  let supplyer;
  if (supplyerName === 'Autex') {
    supplyer = new Autex();
  } else if (supplyerName === 'Complex') {
    supplyer = new Complex();
  }

  return supplyer
}

function readFile(evt) {
  let files = evt.target.files;
  let file = files[0];
  let reader = new FileReader();
  reader.onload = function (event) {
    let arrDest = supplyer.convert(csvToArray(event.target.result));
    let destString = arrayToCsv(arrDest);
    console.log(destString);
    downloadFile(destString);
  }

  reader.readAsText(file)
}

function arrayToCsv(arrDest) {
  let destString = csvHeaders.join(',') + "\n";
  for (let i = 0; i < arrDest.length; i++) {
    let row = arrDest[i];
    for (let j = 0; j < row.length; j++) {
      let col = row[j];
      if (col && (col.includes(csvDelimiter) || col.includes(' '))) {
        row[j] = '"' + col.replace('"', '""') + '"';
      }
    };

    destString += row.join(',') + "\n";
  };

  return destString;
}

function downloadFile(destString) {
  let hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + destString;
  hiddenElement.target = '_blank';
  hiddenElement.download = 'source.csv';
  hiddenElement.click();
}

function csvToArray(csvSource) {
  let arrData = [];
  let lines = csvSource.split('\n');
  lines.forEach(line => {
    let arrLine = [];
    let fields = line.split(csvDelimiter);
    let startCol;
    let inField = false;
    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
      let field = fields[fieldIndex];
      if (field.startsWith("\"")) {
        if (field.endsWith("\"")) {
          arrLine.push(field.slice(1, field.length - 1));
        } else {
          startCol = fieldIndex;
          inField = true;
        }
      } else if (field.endsWith("\"")) {
        let value = '';
        for (let i = startCol; i <= fieldIndex; i++) {
          value += fields[i] + csvDelimiter;
        }

        arrLine.push(value.slice(1, value.length - 2));
        inField = false;
      } else if (!inField) {
        arrLine.push(field);
      }
    }

    arrData.push(arrLine);
  });

  return arrData;
}