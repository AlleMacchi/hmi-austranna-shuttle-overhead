const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const cors = require('cors');
  const rateLimit = require('express-rate-limit');
// ************** OPC UA - START ************************************************************
const {OPCUAClient, AttributeIds} = require('node-opcua');
const async = require('async');
const endpointURL = "opc.tcp://192.168.0.1:4840";
const client = OPCUAClient.create({endpointMustExist:false});

const DataRead = require("../data/OPC-UA-DataRead.json");
let ArrayToWrite 

client.on('backoff',(retry,delay)=>{
  console.log('try to connect ${endpointURL}, retry ${retry} next attemt in ${delay/1000} sec');
})

// connection
async.series([
function(callback){
    client.connect(endpointURL,(err)=>{
        if(err){
            console.log(' cannot connect to endpoint: ${endpoindURL}');
        } else {
            console.log('OPC - connected !');
        }
        callback();
    })
},
 // Create session
function(callback){
    client.createSession((err,session)=>{
        if(err){return}
        else{
            console.log("OPC - session created !");
        }
        the_session = session;
        callback();
    })
},

// OPC UA - READ
// Read a variable with read
function(){
    setInterval(()=>{

        let nodesToRead = DataRead;

        the_session.read(nodesToRead,(err,dataValue)=>{
            if(!err){
                dataValueArray = dataValue;
            }
        })

    // OPC UA - WRITE
    // Write a variable with write 
    let nodesToWrite=ArrayToWrite;  
    the_session.write(nodesToWrite,(err,statusCodes)=>{});

    },100)
}    
]);
// ************** OPC UA - END ************************************************************
  
  // Limitation Request
  server.use(cors());
  server.use(express.json());
  const limiter = rateLimit({
    windowMs: 1000, // 5 second
    max: 5, // limit each IP to 5 requests per windowMs
  });
  server.use('/api/data', limiter);
  
  
  server.get('/api/data', (req, res) => {
    const responseData = { message: dataValueArray };
    res.json(responseData);
  });

  server.post("/api/data", (req, res) => {  
    try {
        ArrayToWrite = req.body;   
        console.log('Received data:', ArrayToWrite);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error processing text:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
  });

  // Default route handler for Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
