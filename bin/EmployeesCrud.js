const express = require('express');
const chalk = require('chalk');
const employees = require('../libs/Employees.js');

const create = async (req, res) => {
    employees.create(req.body, (e, entry) => {
        if (e) { res.status(500).json({ error: e }); return; }
        res.send(entry);
    })
};

const all = (req, res) => {
    employees.all({}, req.query.sortcol, req.query.sortdir, 20, (e, rows) => {
        if (e) { res.status(500).json({ error: e }); return; }
        res.send(rows);
    })
};

const details = (req, res) => {
    if(!req.params._id) { console.log(`Employees details "No ID"`); res.status(401).send("No ID"); return;}
    employees.details(req.params._id, (e, rows) => {
        if (e) { res.status(500).json({ error: e }); return; }
        res.send(rows);
    })
};

const update = async (req, res) => {
    if(!req.params._id) { console.log(`Employees update "No ID"`); res.status(401).send("No ID");return;}
    employees.update(req.params._id, req.body, (e, entry) => {
        if (e) { res.status(500).json({ error: e }); return; }
        res.send(entry);
    })
};

const remove = (req, res) => {
    if(!req.params._id) { console.log(`Employees remove "No ID"`); res.status(401).send("No ID");return;}
    employees.remove(req.params._id, (e, rows) => {
        if (e) { res.status(500).json({ error: e }); return; }
        res.send(rows);
    })
};

const nametel = (req, res) => {
    if(!req.params._nametel) {res.status(401).send("No ID"); return;}
    employees.nametel(req.params._nametel, (e, rows) => {
        if (e) { res.status(500).json({ error: e }); return; }
        res.send(rows);
    })
};

// ======  // Routes  // ======
let router = express.Router();
router.use((req, res, next) => { console.log(chalk.blueBright(`Employees URL: ${req.originalUrl}`)); next(); });
router.post('/', create);
router.get('/all', all); // last 20
router.get('/details/:_id', details);
router.put('/:_id', update);
router.delete('/:_id', remove);
router.get('/nametel/:_nametel', nametel);
module.exports = router;
