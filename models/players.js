const usersModel = {
    getAll: `
        SELECT * FROM jugadores LIMIT 5`,

    getByID:`SELECT * FROM jugadores WHERE id= ?`, 

    addRow: `INSERT INTO jugadores (name, lastname, apodo, dorsal, edad, nacionalidad, posicion)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              
    getByname: `
    SELECT * FROM jugadores WHERE name = ?`,

    getBydorsal: `
    SELECT * FROM jugadores WHERE dorsal = ?`,


    updateRow: `UPDATE jugadores SET
                 name = ?,
                 lastname = ?,
                 apodo = ?,
                 dorsal = ?,
                 edad = ?,
                 nacionalidad = ?,
                 posicion = ?
                 WHERE id =?`,

    deleteRow: `UPDATE jugadores SET dorsal = 0 WHERE id = ?`,

};

module.exports = usersModel;
