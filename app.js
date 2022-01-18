var express = require('express');
var app = express();
let fs = require('fs-extra')
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const MongoClient = require('mongodb').MongoClient;
const remindersDb = 'reminders';
const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true
});

app.get('/', function (req, res) {
    res.send('<h1>Yarin express http server</h1>');
});

app.post('/contact-us', function (req, res) {
    try {
        let jsonContacts = fs.readJSONSync('./public/json/contacts.json')
        jsonContacts.push({
            ...req.body
        });
        fs.writeJSONSync('./public/json/contacts.json', jsonContacts);
    } catch (err) {
        console.log(err);
        res.send('Try again');
    }
    res.json({
        ...req.body
    })

    client.connect(function () {

        const db = client.db(remindersDb);
        const data = fs.readFileSync('./public/json/contacts.json');
        const docs = JSON.parse(data.toString());

        db.collection('remind')
            .insertMany(docs, function (err, result) {
                if (err) throw err;
                console.log('Inserted docs:', result.insertedCount);
                client.close();
            });
    });

});

app.get('/contact-us', function (req, res) {
    res.json(fs.readJSONSync('./public/json/contacts.json'));
});

app.post('/reminders', function (req, res) {
    let jsonReminders = fs.readJSONSync('./public/json/reminders.json');
    jsonReminders.push({
        ...req.body
    })
    fs.writeJSONSync('./public/json/reminders.json', jsonReminders);

    res.json({
        ...req.body
    })

    client.connect(function () {

        const db = client.db(remindersDb);
        const data = fs.readFileSync('./public/json/reminders.json');
        const docs = JSON.parse(data.toString());

        db.collection('remind')
            .insertMany(docs, function (err, result) {
                if (err) throw err;
                console.log('Inserted docs:', result.insertedCount);
                client.close();
            });
    });
});

app.get('/reminders', function (req, res) {
    res.json(fs.readJSONSync('./public/json/reminders.json'));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});