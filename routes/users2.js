const express = require('express')

const router = express.Router();
const Host = require('../models/host');

//creating a user
router.post('/',(req, res) =>{
    const{name, email, role, password, confirPassword} = req.body;
    const newHost = new Host ({name, email, role, password, confirPassword});
    newHost.save()
    .then((host) =>{
        res.json(host);
    })
    .catch((err)=>{
       res.status(500).json({error: 'Error creating user'});

    });
});
router.get('/', (req, res)=>{
    Host.find()
    .then((host) => {
        res.json(hosts)
    })
    .catch
})
