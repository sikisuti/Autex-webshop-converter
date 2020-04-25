import { constants } from '../constants.js'

class Dummy {
    constructor() {
        this.rules = new Map([
            [0, 2],
            [3, 3],
            [8, 14],
            [15, 25]
        ]);
    }

    convert(arrSource) {
        let arrDest = [];
        for (let i = 0; i < arrSource.length; i++) {
            let sourceRow = arrSource[i];
            let checkField = sourceRow[15];
            if (!checkField || isNaN(checkField.replace(' ', ''))) {
                continue;
            };

            let destRow = Array(54).fill('');

            this.addConstants(destRow);
            this.addRules(sourceRow, destRow);

            arrDest.push(destRow);
        };

        return arrDest;
    }

    addConstants(destRow) {
        constants.forEach((value, key) => {
            destRow[key] = value;
        });

        destRow[48] = 'Autex';
    }

    addRules(sourceRow, destRow) {
        this.rules.forEach((value, key) => {
            destRow[value] = sourceRow[key];
        }); 
    }
}

export { Dummy };