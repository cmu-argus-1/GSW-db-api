# GSW-db-api

the database api for the groundstation influxdb database. Returns queried data to the frontend. Designed to simplify the influxdb querying process for our specific purposes in the frontend.

# index
 - [Client Usage](#client-usage)
    - [By Time Range](#by-time-range)
    - [By Last N entries](#by-last-n-entries)
 - [Host Usage](#host-usage)
    - [Pre-requisites](#pre-requisites)
    - [Running](#running)
# Client Usage
There are two methods in which you can query data from this API. You can either supply a time range or you can supply a last `n` amount of entries you want to see. 

## By time range
### summary
The route is /heartbeat/by_time/\<heartbeat_type\>. 
There are 2 optional query parameters.

### Query Parameters
 - start_time
    - default value `-1h`, 1 hour before time query was made
    - The beginning of the time range which your data will come from
    - Can be any IQL time input
    - examine [Influx Query Language time](https://docs.influxdata.com/influxdb/cloud/query-data/influxql/explore-data/time-and-timezone/) to learn more about the IQL times.
 - stop_time: 
    - default value: `now()`, time when query was made
    - The end of the time range in which your data will come from
    - Can be any IQL time input
    - examine [Influx Query Language time](https://docs.influxdata.com/influxdb/cloud/query-data/influxql/explore-data/time-and-timezone/) to learn more about the IQL times.

### Example
`http://hostname:port/heartbeat/by_time/imu?start_time=-5d&stop_time=-1h`

This gets all imu heartbeat data from 5 days ago to 1 hour ago


## by last n entries
### summary
The route for these queries is /heartbeat/by_last/\<heartbeat_type\>. There are again two optional query parameters.

This method gets the most recently added `n` entries with an optional 

### Query Parameters
`offset`
 - n
    - default value: `20`
    - the number of returned entries
    - `int`
 - offset
    - default value: `0`
    - the offset in entries from the most recent entry
    - `int`

### Example
`http://hostname:port/heartbeat/by_last/sun?n=5&offset=10`
This query gets the 10th to 15th most recent entries from the sun heartbeat data. 

# Host Usage

## Pre-requisites
This API needs to communicate with some InfluxDB instance. The InfluxDB instance should be running at `INFLUX_ADDRESS` (for example, if it is running locally it is probably at `http://localhost:8086`). You will also need to create an API token with propert permissions within your influxdb instance to use as `INFLUX_TOKEN`. This API will also access the data stored at `INFLUX_BUCKET` and will be part of the organization `INFLUX_ORG`.

All of these `INFLUX_*` constants should be stored in a file at `/lib/secrets.js`.

## running
This API uses NodeJS and was developed using v18.19.0, older versions have not been verified. Ensure that you [download and install NodeJS](https://nodejs.org/en/download/package-manager).

Once you have NodeJS, run:

`npm install`

at the project root directory to install the necessary packages.

create a value called `host_ip` in ./lib/secrets.js which will be the IP from which the server is run. You can also configure port in `server.js` to change the port on which the server will run.

Once you have configured your port and IP, to start the API server just run:

`node server.js`

in your terminal