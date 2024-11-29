document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculateSize');
    const measurementInput = document.getElementById('measurement');
    const resultDiv = document.getElementById('sizeResult');

    const sizeChart = {
        '49': { eu: '9', us: '5' },
        '50': { eu: '10', us: '5.5' },
        '52': { eu: '12', us: '6' },
        // ... dodaj więcej rozmiarów
    };

    calculateButton.addEventListener('click', () => {
        const circumference = parseFloat(measurementInput.value);
        if (isNaN(circumference)) {
            resultDiv.textContent = 'Wprowadź prawidłową wartość';
            return;
        }

        const plSize = Math.round(circumference);
        const size = sizeChart[plSize] || { eu: '-', us: '-' };

        resultDiv.innerHTML = `
            <p>Rozmiar PL: ${plSize}</p>
            <p>Rozmiar EU: ${size.eu}</p>
            <p>Rozmiar US: ${size.us}</p>
        `;
    });

    // Wypełnij tabelę rozmiarów
    const tbody = document.querySelector('.size-chart tbody');
    Object.entries(sizeChart).forEach(([pl, sizes]) => {
        tbody.innerHTML += `
            <tr>
                <td>${pl}</td>
                <td>${sizes.eu}</td>
                <td>${sizes.us}</td>
                <td>${pl}</td>
            </tr>
        `;
    });
}); 