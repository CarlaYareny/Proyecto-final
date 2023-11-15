const {Router} = require('express');
const{playerslist, listPlayersByID, addPlayers, deletePlayers, updatePlayers} = require('../controllers/players');
const router = Router();
//http://localhost:3000/api/v1/personajes
router.get('/', playerslist);
router.get('/:id', listPlayersByID);
router.put('/', addPlayers);
router.patch('/:id', updatePlayers);
router.delete('/:id', deletePlayers);

module.exports = router;
