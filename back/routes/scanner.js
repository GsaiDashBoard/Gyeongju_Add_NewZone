const express = require('express');
const router = express.Router();
const { Culturescanner, Culturezone, Historyscanner, Historyzone } = require('../models');
const dayjs = require('dayjs');
const { Op } = require('sequelize');


router.get('/scanner', async (req, res, next) => { //GET zones
  try {
    //const test = req.body.sttdate;
    //console.log('test',test);
    const scanners = await Culturescanner.findAll({
      //order: [['zoneid', 'DESC']],
      attributes: ['zone', 'zoneid', 'num', 'mac', 'intmac', 'status', 'type', 'lat', 'lon'],
    });
    res.status(200).json(scanners);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/zone', async (req, res, next) => { //GET zones
  try {
    //const test = req.body.sttdate;
    //console.log('test',test);
    const zones = await Culturezone.findAll({
      //order: [['zoneid', 'DESC']],
      attributes: ['zone', 'zoneid', 'zonename', 'lat', 'lon', 'radius', 'boundstartlat', 'boundstartlon', 'boundendlat', 'boundendlon', 'boundcolor', 'textlat', 'textlon'],
    });
    res.status(200).json(zones);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/scannerhistory', async (req, res, next) => { //GET zones
  try {
    //const test = req.body.sttdate;
    //console.log('test',test);
    const scanners = await Historyscanner.findAll({
      //order: [['zoneid', 'DESC']],
      attributes: ['zone', 'zoneid', 'num', 'mac', 'intmac', 'status', 'type', 'lat', 'lon'],
    });
    res.status(200).json(scanners);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/zonehistory', async (req, res, next) => { //GET zones
  try {
    //const test = req.body.sttdate;
    //console.log('test',test);
    const zones = await Historyzone.findAll({
      //order: [['zoneid', 'DESC']],
      attributes: ['zone', 'zoneid', 'zonename', 'lat', 'lon', 'boundstartlat', 'boundstartlon', 'boundendlat', 'boundendlon', 'boundcolor', 'textlat', 'textlon'],
    });
    res.status(200).json(zones);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;