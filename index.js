const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cron = require('node-cron');
const app = express()
const { exec } = require('child_process');


// // Schedule tasks to be run on the server.
// cron.schedule('* * * * *', function () {
//     console.log('running a task every minute');
// });

// running this task everyday at 23.59
cron.schedule('* * * * * *', function () {
    console.log('---------------------');
    console.log('Running Cron Job');

    // pull in credentials from .env
    const dbToBackup = process.env.DB_NAME;
    const password = process.env.DB_PASS;
    const format = "sql";

    // create a custom backup file name with date info
    const date = new Date();
    const current_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    const backup_file_ext = `/Users/durmusdemirtas/Documents/b.sql`;

    // execute node child process(exec)
    exec("sh ./backup.sh " + dbToBackup + " " + backup_file_ext,
        (error, stdout, stderr) => {
            if (error) {
                return console.error(`exec error: ${error}`);
            }
            if (stderr) {
                return console.error(`stderr: ${stderr}`);
            }
            console.log(`Backed up your db successfully: ${stdout}`);
        })
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
    console.log(`Server is awake on port ${process.env.PORT}:${process.env.NODE_ENV}`)
})