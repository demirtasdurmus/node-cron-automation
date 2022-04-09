const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;
const app = express()
const { exec } = require('child_process');

// scheduling the backup job
var job = new CronJob(

    // cronTime - [REQUIRED] - The time to fire off your job.
    // This can be in the form of cron syntax or a JS Date object.
    '*/2 * * * * *',

    // onTick - [REQUIRED] - The function to fire at the specified time.
    // If an onComplete callback was provided, onTick will receive it 
    // as an argument. onTick may call onComplete when it has finished its work.
    function () {
        console.log('You will see this message every second');
        // backupDatabase();
    },

    // onComplete - [OPTIONAL] - A function that will fire when the job is
    // stopped with job.stop(), and may also be called by onTick at the end of each run.
    null,

    // start - [OPTIONAL] - Specifies whether to start the job just
    // before exiting the constructor. By default this is set to false. 
    // If left at default you will need to call job.start() in order to
    // start the job (assuming job is the variable you set the cronjob to). 
    // This does not immediately fire your onTick function, it just gives 
    // you more control over the behavior of your jobs.
    true,

    // timeZone - [OPTIONAL] - Specify the timezone for the execution.
    // This will modify the actual time relative to your timezone.
    // If the timezone is invalid, an error is thrown. You can check
    // all timezones available at Moment Timezone Website. Probably 
    // don't use both timeZone and utcOffset together or weird things may happen.
    // 'America/Los_Angeles',

    // context - [OPTIONAL] - The context within which to execute
    // the onTick method. This defaults to the cronjob itself allowing you
    // to call this.stop(). However, if you change this you'll have access
    // to the functions and values within your context object.
    // null,

    // runOnInit - [OPTIONAL] - This will immediately fire your onTick
    // function as soon as the requisite initialization has happened.
    // This option is set to false by default for backwards compatibility.
    // true,

    // utcOffset - [OPTIONAL] - This allows you to specify the offset of
    // your timezone rather than using the timeZone param. Probably don't
    // use both timeZone and utcOffset together or weird things may happen.
    // null,

    // unrefTimeout - [OPTIONAL] - If you have code that keeps the event
    // loop running and want to stop the node process when that finishes
    // regardless of the state of your cronjob, you can do so making use
    // of this parameter. This is off by default and cron will run as if
    // it needs to control the event loop. For more information take a
    // look at timers#timers_timeout_unref from the NodeJS docs.
);

const backupDatabase = () => {
    // extract credentials from .env
    const dbName = process.env.DB_NAME;
    const dbPass = process.env.DB_PASS;
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPort = process.env.DB_PORT;

    const format = "sql";

    // create a custom backup file name with date info
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    const backupFilePath = `/Users/durmusdemirtas/Documents/backups/${dbName}-${currentDate}.${format}`;

    // execute node child process(exec)
    exec(`sh ./backup.sh "${dbPass}" ${dbHost} ${dbUser} ${dbPort} ${dbName} ${backupFilePath}`,
        (error, stdout, stderr) => {
            if (error) {
                return console.error(`exec error: ${error}`);
            };
            if (stderr) {
                return console.error(`stderr: ${stderr}`);
            };
            console.log(`Created a backup of ${dbName} at ${date.toLocaleString()} successfully: ${stdout}`);
        })
};

// add a get route to check if the server is running
app.get('/:interval', (req, res) => {
    // dynamically set new cron time
    const time = new CronTime(`*/${req.params.interval} * * * * *`);
    job.setTime(time);
    job.start();
    console.log(`interval changed to ${req.params.interval} second`);
    res.send('sucess');
});

// set up server
app.listen(process.env.PORT, () => {
    console.log(`Server is awake on port ${process.env.PORT}:${process.env.NODE_ENV}`)
});