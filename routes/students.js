const express = require("express");
const { StudentsModel, validateStudent } = require("../models/studentsModel");
const router = express.Router();


// students?limit=&page=&sort=&reverse=
router.get("/", async(req,res) => {
  try{
    const limit = req.query.limit || 5;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;

    let filterFind = {};
    if(req.query.s){  
      const searchExp = new RegExp(req.query.s,"i");
      filterFind = {name:searchExp}
    }
    const data = await StudentsModel
    .find(filterFind)
    .limit(limit)
    .skip(page * limit)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// הוספת רשומה חדשה
router.post("/", async(req,res) => {
  const validBody = validateStudent(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const student = new StudentsModel(req.body);
    await student.save();
    res.status(201).json(student)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// מחיקת רשומה לפי איי די
router.delete("/:id",async(req,res) => {
  try{
    const _id = req.params.id;
    const data = await StudentsModel.deleteOne({_id});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// עריכת רשומה לפי איי די
router.put("/:id",async(req,res) => {
  const validBody = validateStudent(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const _id = req.params.id;
    const data = await StudentsModel.updateOne({_id},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



module.exports = router;