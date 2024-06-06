const express = require('express');
const router = express.Router();
const { Ar_data, Sequelize } = require('../models');
const dayjs = require('dayjs');
const { Op } = require('sequelize');



router.post('/', async (req, res, next) => { //GET accounts
  const sttdate = String((dayjs(req.body.sttdate).add(9,'hour')).format('YYYY-MM-DD HH:mm:ss'));
  const enddate = String((dayjs(req.body.enddate).add(1,'day').add(9,'hour')).format('YYYY-MM-DD HH:mm:ss'));//한국시간으로 변경
  
  console.log('testtest',enddate)
    try {
      let where = { time : {[Op.and] : { [Op.gte] : sttdate, [Op.lte]:enddate }},
                    mixture_id : 1,
                    unit_exp : '1d-1h'}
       const logs = await Ar_data.findAll({
           where: where,
           order: ['zone_id', 'time'],
           attributes: ['zone_id', 'data', 'time'],
         }); 
      res.status(200).json(logs);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

module.exports = router;