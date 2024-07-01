import { InfluxDB, flux } from "@influxdata/influxdb-client";
import { INFLUX_BUCKET, INFLUX_IP, INFLUX_ORG, INFLUX_TOKEN } from "./secrets.js";

async function get_table (table, result) {
    const client = new InfluxDB({url: INFLUX_IP, token: INFLUX_TOKEN});
    const queryApi = client.getQueryApi(INFLUX_ORG);
    const fluxquery = `from(bucket:"${INFLUX_BUCKET}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "argus-1")
        |> last()`;
    return await new Promise((resolve, reject) => {
        queryApi.queryRows(fluxquery, {
            next: (row, tableMeta) => {
                const obj = tableMeta.toObject(row);
                console.log(`${obj._time}, ${obj._measurement}`);
            },
            error: (error) => {
                result(error, null)
                console.error(error);
                console.log('\nQueryRows ERROR');
            },
            complete: () => {
                result(null, "successful query")
                console.log('\nQueryRows SUCCESS');
            },
        });
    });
}

export { get_table };
