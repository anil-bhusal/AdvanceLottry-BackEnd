const express = require('express')
const app = express()
const port = 3000

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())

// mongodb://localhost:27017

const mongoose = require('mongoose')
const { json } = require('body-parser')

const { Schema } = mongoose;

const connect = async() => {
    try{
       await mongoose.connect('mongodb://127.0.0.1:27017/winticket', {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("connected to mongodb");
    }catch(error){
        console.error(error);
    }
}
// connect() 

// USER SCHEMA
const usersSchema = new Schema({
  name: {type: String, required: true},
  ticketNo: Number
},
{collection: 'users'})

// user MODEL
const Users = mongoose.model('Users', usersSchema)



//winner schema
const winnerSchema = new Schema({
  ticketNo : Number,
  color : String
}, 
{collection: 'winner'})

//winner model
const Winner = mongoose.model('Winner', winnerSchema)

// app.get('/users/:user', (req, res) => {
//   console.log(req.params.user)
// //   res.json({
// //     anil: "my name is anil"
// //   })
// })

// app.post('/name', (req, res) => {
//     console.log(req.body.anil)
// })

// app.post('/register', (req, res) => {
//     console.log(req.body.ticket)
//   })


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


// const a = Math.floor(Math.random())
// console.log(a)




app.get('/ticket', async (req, res) => {
// console.log(req.query.filter)
try{
  const data = await Users.find()
  res.json({
      ticketList: data
  })
}catch(e){
  console.log(e)
}

})

// app.get('/tickets/:ticketno', (req, res) => {
//   console.log(req.params.ticketno)
// })

// app.post('/tickets', (req, res) => {
//   console.log(req.body.ticket)
// })

app.get('/users', async(req, res) => {
    const userList = await Users.findOne({name: req.query.name})
    const searchWinColor = await Winner.findOne({ticketNo: req.query.ticketNo})
    if(searchWinColor?.color === req.query.color && userList){
      res.json({
        msg: 'hurry! winner winner chicken dinner'
      })
      }
    else{
      if(!userList){
        res.json({
          errMsg: "not register"
        })
      }else{
        res.json({
          msg: "you have lost"
        })
      }       
    }
})

app.put('/register', async(req, res) => {
  try{
    const updateUser =await Users.findOneAndUpdate(req.body)
    if(updateUser){
      res.json({
        msg: 'user updated'
      })
    }else{
      msg:"error"
    }
  }
  catch(e){
    console.log(e)
  }

})

app.post('/register', async(req, res) => {
  // console.log(req.body)
  // await Users.create(req.body)
  try{
    // const receive = {
    //   // name: req.body.name,
    //   // ticketNo: req.body.ticket
    // }
    //backend validataion
    const userList = await Users.findOne({name: req.body.name})
    if(userList){
      res.json({
        msg: 'User name already exist'
      })
    }
    else{
      const data = await Users.create(req.body)
      if(data){
          res.json({
              msg: 'user registered'
          })
      }else{
          res.json({
              msg: 'registration failed'
          })
      }
    }

  }catch(err){
      console.log(err)
  }
})

app.post('/winner', async(req, res) => {
  try{
    const data = await Winner.create(req.body)
    if(data){
      res.json({
        msg: `ticket no: ${req.body.ticketNo} and color: ${req.body.color} is the winner`
      })}
      else{
        res.json({
          msg:'something went wrong'
        })
      }
    }
    catch(e){
      console.log(e)
    }
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connect()
})

