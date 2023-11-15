const {request, response} = require('express');
const bcrypt = require('bcrypt');
const usersModel = require('../models/players');
const pool = require('../db');

const playerslist = async (req=request, res = response) =>{
    let conn;
    try {
         conn = await pool.getConnection();

         const users = await conn.query(usersModel.getAll, (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         res.json(users);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    } 
}

const listPlayersByID = async (req=request, res = response) =>{
    const {id} = req.params;
 
    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn;
    try {
         conn = await pool.getConnection();

         const [user] = await conn.query(usersModel.getByID, [id], (err) => {
            if (err) {
                throw new Error(err);
            }
         }) 

         if (!user) {
            res.status(404).json({msg: 'User not found'});
            return;
         }

         res.json(user);
    } catch (error){
        res.status(500).json(error);

    }finally {
        if (conn) conn.end();
    } 
}

const addPlayers = async (req = request, res = response) => {
    const{
        name,
        lastname,
        apodo,
        dorsal,
        edad,
        nacionalidad,
        posicion
    } = req.body;

    if (!name || !lastname || !apodo || !dorsal || !edad || !nacionalidad || !posicion) {
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const player = [name, lastname, apodo, dorsal, edad, nacionalidad, posicion];

    let conn;

    try {
        conn = await pool.getConnection();

        const [namePlayer] = await conn.query(usersModel.getByname, [name], (error) => {
            if (err) throw err;
        });

        if (namePlayer) {
            res.status(409).json({msg: `Player with name ${name} already exists`});
            return;
        }

        const [dorsalPlayer] = await conn.query(usersModel.getBydorsal, [dorsal], (error) => {
            if (err) throw err;
        });

        if (dorsalPlayer) {
            res.status(409).json({msg: `Player with number ${dorsal} already exists`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow, [...player], (err) => {
            if (err) throw err;
        })
        
        
        if (userAdded.affectedRows === 0) throw new Error({msg: 'Failed to add player'});

        res.json({msg: 'Player added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }

}


const updatePlayers = async (req = request, res = response) => {

    const{
        name,
        lastname,
        apodo,
        dorsal,
        edad,
        nacionalidad,
        posicion
    } = req.body;
    const {id} = req.params;

  
    let newUserData = [
        name,
        lastname,
        apodo,
        dorsal,
        edad,
        nacionalidad,
        posicion
    ];
  
    let conn;

    try {
        conn = await pool.getConnection();

        
        const [userExists] = await conn.query (
            usersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!userExists) {
            res.status(404).json({msg: 'Player not found'});
            return
        }
        const [usernameUser] = await conn.query(usersModel.getByname, [name], (error) => {
            if (err) throw err;
        });

        if (usernameUser) {
            res.status(409).json({msg: `Player with name ${name} already exists`});
            return;
        }

        const oldUserData = [
            userExists.name,
            userExists.lastname,
            userExists.apodo,
            userExists.dorsal,
            userExists.edad,
            userExists.nacionalidad,
            userExists.posicion
        ];

        newUserData.forEach((userData, index) => {
            if (!userData) {
                newUserData[index] = oldUserData[index];
            }
        });
    

        const userUpdated = await conn.query(usersModel.updateRow, [...newUserData, id], (err) => {
            if (err) throw err;
        });
        
        
        if (userUpdated.affectedRows === 0) throw new Error({msg: 'Player not updated'});

        res.json({msg: 'Player updated succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}


const  deletePlayers = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {id} = req.params;

        const [userExists] = await conn.query (
            usersModel.getByID, [id], (err) => {if (err) throw err;}
        );

        if (!userExists) {
            res.status(404).json({msg: 'Player not found'});
            return;
        }

        const userDeleted = await conn.query (
            usersModel.deleteRow, [id], (err) => {if (err) throw err;}
        );

        if (userDeleted.affectedRows === 0) {
            throw new Error({msg: 'Failed to delete Player'})
        };

        res.json({msg: '´Player delete succesfully'});
        }catch (error) {
            console.log(error);
            res.status(500).json(error);
        } finally {
            if (conn) conn.end();
        }
    }



module.exports = {playerslist, listPlayersByID, addPlayers, updatePlayers, deletePlayers};
