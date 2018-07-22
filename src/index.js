import DatabaseLogger from "./DatabaseLogger"
import DeviceInfoCollector from "./DeviceInfoCollector"
import LogExporter from "./LogExporter"
import LogReporter from "./LogReporter"
import JSEncrypt from "jsencrypt"

window.DatabaseLogger = DatabaseLogger;
window.DeviceInfoCollector = DeviceInfoCollector;
window.LogExporter = LogExporter;
window.LogReporter = LogReporter;
window.JSEncrypt = JSEncrypt;

export default {
    DatabaseLogger,
    DeviceInfoCollector,
    LogExporter,
    LogReporter,
    JSEncrypt
}