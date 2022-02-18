const express = require('express')
const cors = require('cors')
const app = express()
const multer = require('multer');
const spawn = require('child_process').spawn;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '_generated_upload/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.webm')
    }
})

const upload = multer({ storage: storage });
const bodyParser = require('body-parser')
const fs = require('fs');

const type = upload.single('recording');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
// for parsing application/json
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.raw({ type: 'audio/webm', limit: '500mb' }));

let convertFile = (file, output, onFinish) => {
    const { spawn } = require('child_process');
    const proc = spawn('ffmpeg', ['-i', file, output]);

    proc.on('close', onFinish);
};

let getInference = (waveFile, success) => {
    const { spawn } = require('child_process');
    const pyprog = spawn('python3', ['../test_audio.py', waveFile]);
    pyprog.stdout.on('data', function (data) {
        success(data.toString());
    });
};

app.get('/', (req, res) => {
    res.send('Fateh');
})

app.post('/classify', type, async (req, res) => {
    const file = req.file;

    console.log("RECIEVED AUDIO: ", file);

    const waveFile = `${file.destination}${Date.now() + '.wav'}`;
    convertFile(file.path, waveFile, () => {
        console.log("created: ", waveFile);
        getInference(waveFile, (data) => {
            console.log(data);
            const match = data.split(", ")[0].split("'")[1];
            const confidence = Number.parseFloat(data.split(", ")[1].split(")")[0])*100;
            // console.log(`Recorded and saved ${req.file.originalname}`);
            res.send({ match: match, confidence: confidence, message: `Recorded and saved ${req.file.originalname}` });
        });
    });
})

app.listen(4000, () => console.log('Application listening on port 4000!'))
