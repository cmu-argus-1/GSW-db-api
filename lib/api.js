import { InfluxDB, flux } from "@influxdata/influxdb-client";
import { INFLUX_BUCKET, INFLUX_IP, INFLUX_ORG, INFLUX_TOKEN } from "./secrets.js";

async function get_table (table, start_time, stop_time, result) {
    const client = new InfluxDB({url: INFLUX_IP, token: INFLUX_TOKEN});
    const queryApi = client.getQueryApi(INFLUX_ORG);
    const fluxquery = `from(bucket:"${INFLUX_BUCKET}")
        |> range(start: ${start_time}, stop: ${stop_time})
        |> filter(fn: (r) => r._measurement == "argus-1" and r.heartbeat == "${table}")
        |> last()`;
    function get_objs () {
        for await(const {values, tableMeta} of queryApi.iterateRows(fluxquery)) {
            const obj = tableMeta.toObject(values)
            console.log(JSON.stringify(obj))
        }
    }
    get_objs().catch((error) => result(error, null))
    console.log("success")
    result(null, "success")
    // await new Promise((resolve, reject) => {
    //     queryApi.queryRows(fluxquery, {
    //         next: (row, tableMeta) => {
    //             const obj = tableMeta.toObject(row);
    //             console.log(`${obj._time}, ${obj._measurement}`);
    //             const json_data = JSON.stringify(obj)
    //             console.log(json_data)
    //         },
    //         error: (error) => {
    //             result(error, null)
    //             console.error(error);
    //             console.log('\nQueryRows ERROR');
    //         },
    //         complete: () => {
    //             result(null, "successful query")
    //             console.log('\nQueryRows SUCCESS');
    //         },
    //     });
    // });
}

export { get_table };
