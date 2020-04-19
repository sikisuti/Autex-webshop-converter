import { Dummy } from './provider/Dummy.js';
import { Another } from './provider/Another.js';
import { csvHeaders } from './csvHeaders.js';

const csvDelimiter = ',';

let providers = ['Dummy', 'Another'];

let providerChooser = document.getElementById("providerChooser");
providers.forEach(element => {
  let option = document.createElement('option');
  option.text = element;
  providerChooser.add(option);
});

document.getElementById('sourceFile').addEventListener('change', readFile, false);

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

function readFile (evt) {
    let files = evt.target.files;
    let file = files[0];           
    let reader = new FileReader();
    reader.onload = function(event) {  
      let selectedProvider = providerChooser.options[providerChooser.selectedIndex].text;
      let provider;
      if (selectedProvider === 'Dummy') {
        provider = new Dummy();
      } else if (selectedProvider === 'Another') {
        provider = new Another();
      }
      
      let arrDest = provider.convert(csvToArray(event.target.result)); 
      let destString = csvHeaders.join(',') + "\n";
      arrDest.forEach(row => {
        row.forEach(col => {
          if (col.includes(csvDelimiter)) {
            col = '"' + col.replace('"', '""'), + '"';
          }
        });

        destString += row.join(',') + "\n";
      });

      console.log(destString);
      let hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + destString;
      hiddenElement.target = '_blank';
      hiddenElement.download = 'source.csv';
      hiddenElement.click();
    }

    reader.readAsText(file)
 }