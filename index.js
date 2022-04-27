const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const res = require('express/lib/response');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const verify = require('jsonwebtoken/verify');

// middle ware 
app.use(cors())
app.use(express.json())

// user : genius1
// pass : 5qdKE8HdhJTd8LAY



const uri = `mongodb+srv://${process.env.USER_NAME}:5qdKE8HdhJTd8LAY@genius-car.aszyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

      try {
            await client.connect();
            const serviceCollection = client.db("genius").collection("service");
            const orderCollection = client.db("geniusOrder").collection("order");

            // service celeltion read api 
            app.get('/service', async (req, res) => {
                  const query = {}
                  const cursor = serviceCollection.find(query)
                  const service = await cursor.toArray()
                  res.send(service)
            })

            // service callation read jast one 

            app.get('/service/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: ObjectId(id) }
                  const findOne = await serviceCollection.findOne(query)

                  res.send(findOne)
            })

            // order calletion 
            app.post('/order', async (req, res) => {
                  const order = req.body
                  // token resive 
                  const tokenInfo = req.headers.authorization

                  // stap 4 
                  // email or accestoken niye chak korbo judi bile tkon take post korte edebo 
                  const [email, accessToken] = tokenInfo?.split(" ")

                  // verify token 
                  // stap -5
                  // const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
                  const decoded = verifyToken(accessToken)
                  console.log(decoded);

                  // stap - 6 
                  // ebar decoder email er sate decoder milate hobe 
                  if (email == decoded.email) {

                        

                              const result = await orderCollection.insertOne(order)
                              res.send({ success: 'order successful' })
                        
                  }
                  else{
                        res.send({ success: 'Unauthrize Access' })

                  }

                  console.log(decoded);

            })

            // total order koto hoise ta dekar jonno 
            app.get('/order', async (req, res) => {
                  const email = req.query.email
                  const query = { email: email }
                  const cursor = orderCollection.find(query)
                  const order = await cursor.toArray()
                  res.send(order)
            })



            // stap 1
            // access token create kora 

            app.post('/login', async (req, res) => {
                  const email = req.body

                  const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN)
                  console.log(accessToken);
                  res.send({ accessToken })
            })

      }

      finally {

      }
      // ed7bd3cb21f1c9b9dfc564c0efc06424d8fb8d2ddde0988de7145e9419c4eef347c6b2e7d8028d745267417b8bd9169b28f545e99a4f7d27ccb7d41d8d1768b3'

}

run().catch(console.dir)


 function verifyToken(token) {
       let email
      jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
            if(err){
                  email = 'invalid emial'
            }
            if(decoded){
                  console.log(email);
                  email = decoded
            }
            
          });
          return email
     

}

app.get('/', (req, res) => {
      res.send('Hello World!')
})

app.listen(port, () => {
      console.log(`Example app listening on port `, port)
})