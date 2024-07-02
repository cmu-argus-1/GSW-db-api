import { InfluxDB, flux } from "@influxdata/influxdb-client";
import { INFLUX_BUCKET, INFLUX_IP, INFLUX_ORG, INFLUX_TOKEN } from "./secrets.js";

async function get_table_time_range (table, start_time, stop_time, result) {
    const client = new InfluxDB({url: INFLUX_IP, token: INFLUX_TOKEN});
    const queryApi = client.getQueryApi(INFLUX_ORG);
    const fluxquery = `from(bucket:"${INFLUX_BUCKET}")
        |> range(start: ${start_time}, stop: ${stop_time})
        |> filter(fn: (r) => r._measurement == "argus-1" and r.heartbeat == "${table}")`;
    let result_data = {}
    async function get_objs () {
        for await(const {values, tableMeta} of queryApi.iterateRows(fluxquery)) {
            const obj = tableMeta.toObject(values)
            // console.log(JSON.stringify(obj))
            // result_data += JSON.stringify(obj)
            if (result_data[obj._field] == null) {
                result_data[obj._field] = [obj._value];
            } else {
                result_data[obj._field].push(obj._value);
            }
        }
    }
    await get_objs().catch((error) => result(error, null))
    console.log("successful query")
    result(null, result_data)
}


async function get_last_n_from_table(table, n, offset, result) {
    const client = new InfluxDB({url: INFLUX_IP, token: INFLUX_TOKEN});
    const queryApi = client.getQueryApi(INFLUX_ORG);
    const fluxquery = `from(bucket:"${INFLUX_BUCKET}")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "argus-1" and r.heartbeat== "${table}")
        |> sort(columns: ["_time", "_value"], desc: true)
        |> limit(n: ${n}, offset: ${offset})`
    let result_data = {}
    async function get_objs () {
        for await(const {values, tableMeta} of queryApi.iterateRows(fluxquery)) {
            const obj = tableMeta.toObject(values)
            // console.log(JSON.stringify(obj))
            // result_data += JSON.stringify(obj)
            if (result_data[obj._field] == null) {
                result_data[obj._field] = [obj._value];
            } else {
                result_data[obj._field].push(obj._value);
            }
        }
    }
    await get_objs().catch((error) => result(error, null))
    // console.log(JSON.stringify(result_data))
    console.log("successful query")
    result(null, result_data)
}

export { get_table_time_range, get_last_n_from_table };

