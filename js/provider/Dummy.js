import { defaults } from '../defaults.js'

class Dummy {
    constructor() {
    }

    convert(arrSource) {
        let arrDest = [];
        arrSource.forEach(sourceRow => {
            let destRow = Array(54).fill('');
            defaults.forEach((value, key) => {
                destRow[key] = value;
            });

            arrDest.push(destRow);
        });

        return arrDest;
    }
}

export { Dummy };