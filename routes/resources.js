//const userqueries = require('./userqueries');

"use strict";
const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/",(req,res)=>{
    knex
      .select('*')
      .from("resources")
      .then((results)=>{
        console.log(results)
        res.json(results);

    });
  });

  return router;
}