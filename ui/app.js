const express = require('express')
const cors = require('cors')
const app = express()
const multer = require('multer');
const upload = multer({ dest: '_generated_upload/' });
const bodyParser = require('body-parser')
const fs = require('fs');

const type = upload.single('recording');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
// for parsing application/json
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));

// let runPy = new Promise(function(success, nosuccess) {
//     const { spawn } = require('child_process');
//     const pyprog = spawn('python3', ['app.py']);
//     pyprog.stdout.on('data', function(data) {
//         success(data);
//     });
//     pyprog.stderr.on('data', (data) => {
//         nosuccess(data);
//     });
// });

app.get('/', (req, res) => {
    res.send('Fateh');
})

app.post('/classify', type, (req, res) => {
    console.log("RECIEVED AUDIO: ", req.file);
    res.send(`Recorded and saved ${req.file.originalname}`);

    // /** When using the "single"
    //   data come in "req.file" regardless of the attribute "name". **/
    // const tmp_path = req.file.path;

    // /** The original name of the uploaded file
    //     stored in the variable "originalname". **/
    // const target_path = 'uploads/' + req.file.originalname;

    // /** A better way to copy the uploaded file. **/
    // const src = fs.createReadStream(tmp_path);
    // const dest = fs.createWriteStream(target_path);
    // src.pipe(dest);
    // src.on('end', function () { res.render('complete'); });
    // src.on('error', function (err) { res.render('error'); });


    // runPy.then(function(fromRunpy) {
    //     console.log(fromRunpy.toString());
    //     res.end(fromRunpy);
    // });
})

app.listen(4000, () => console.log('Application listening on port 4000!'))
