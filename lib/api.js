import { InfluxDB, flux } from "@influxdata/influxdb-client";
import { INFLUX_BUCKET, INFLUX_IP, INFLUX_ORG, INFLUX_TOKEN } from "./secrets.js";

async function get_table (table, result) {
    const client = InfluxDB({url: INFLUX_IP, token: INFLUX_TOKEN})
    const queryApi = client.queryApi(INFLUX_ORG)

    return await new Promise((resolve, reject) => {
        queryApi.queryRows(fluxquery, {
            next: (row, tableMeta) => {
                const obj = tableMeta.toObject(row)
                console.log(`${o._time}, ${o._measurement}`)
            },
            error: (error) => {
                console.error(error)
                console.log('\nQueryRows ERROR')
            },
            complete: () => {
            console.log('\nQueryRows SUCCESS')
            },
        })
    })
}

export { get_table };
