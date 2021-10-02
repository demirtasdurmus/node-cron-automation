const express = require('express');
const cron = require('node-cron');
const app = express()
const port = 3000
const { exec } = require('child_process');


// // Schedule tasks to be run on the server.
// cron.schedule('* * * * *', function () {
//     console.log('running a task every minute');
// });

// running this task everyday at 23.59
cron.schedule('59 23 * * *', function () {
    console.log('---------------------');
    console.log('Running Cron Job');

    // pull in credentials from .env
    const dbToBackup = process.env.DB_NAME;
    const password = process.env.DB_PASSWORD;
    const format = "sql";

    // create a custom backup file name with date info
    const date = new Date();
    const current_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    const backup_file_ext = `E:\\09.Emparazon\\00.back-ups\\${dbToBackup}\\${dbToBackup}_${current_date}.${format}`;

    // execute node child process(exec)
    exec(`"./backup.sh" ${password} ${dbToBackup} ${backup_file_ext}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            console.log(`Backed up your db successfully: ${stdout}`);
        })
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})