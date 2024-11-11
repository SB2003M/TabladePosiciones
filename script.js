document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el archivo JSON');
            return response.json();
        })
        .then(data => {
            // Renderiza la tabla ordenada
            const renderTable = () => {
                data.sort((a, b) => b.pts - a.pts);
                const tableBody = document.querySelector('#positions-table tbody');
                tableBody.innerHTML = ''; 

                data.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.equipo}</td>
                        <td>${item.pts}</td>
                        <td>${item.pj}</td>
                        <td>${item.g}</td>
                        <td>${item.e}</td>
                        <td>${item.p}</td>
                        <td>${item.gf}</td>
                        <td>${item.gc}</td>
                        <td>${item.dg}</td>
                        <td><button class="edit-btn" data-index="${index}">Editar</button></td>
                    `;
                    tableBody.appendChild(row);
                });

                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', handleEdit);
                });
            };

            // Función de edición con validación estricta
            const handleEdit = event => {
                const index = event.target.dataset.index;
                const item = data[index];

                const getValidInput = (field, min, max) => {
                    let isValid = false;
                    let value;

                    // Continúa solicitando hasta que el valor sea válido
                    while (!isValid) {
                        value = prompt(`Ingresa nuevo valor para ${field.toUpperCase()} (entre ${min} y ${max}):`, item[field]);

                        // Verificar si el usuario cancela
                        if (value === null) return null; // Si el valor es null, el usuario canceló

                        value = parseInt(value);

                        if (!isNaN(value) && value >= min && value <= max) {
                            isValid = true;
                        } else {
                            alert(`Valor inválido para ${field.toUpperCase()}. Debe estar entre ${min} y ${max}.`);
                        }
                    }
                    return value;
                };

                // Lista de campos con sus restricciones
                item.pts = getValidInput('pts', 0, 114);
                if (item.pts === null) return; // Si el usuario canceló, salimos

                item.pj = getValidInput('pj', 0, 38);
                if (item.pj === null) return;

                item.g = getValidInput('g', 0, 38);
                if (item.g === null) return;

                item.e = getValidInput('e', 0, 38);
                if (item.e === null) return;

                item.p = getValidInput('p', 0, 38);
                if (item.p === null) return;

                item.gf = getValidInput('gf', 0, Infinity);
                if (item.gf === null) return;

                item.gc = getValidInput('gc', 0, Infinity);
                if (item.gc === null) return;

                // Recalcula la diferencia de goles
                item.dg = item.gf - item.gc;

                renderTable();
            };

            renderTable();
        })
        .catch(error => console.error('Error al cargar los datos:', error));
});
