/**
 * Log exporter
 */
export default class LogExporter {
    /**
     *
     * @param databaseLogger {DatabaseLogger}
     */
    constructor(databaseLogger) {
        this.databaseLogger = databaseLogger
    }

    /**
     * Export device info
     *
     * @param raw Should the export be raw javascript or json
     * @returns {Promise<*>}
     */
    async exportDeviceInfo(raw) {
        return LogExporter._export(await this.databaseLogger.db.device.toArray(), raw)
    }

    /**
     * Export log
     *
     * @param raw
     * @returns {Promise<*>}
     */
    async exportLog(raw) {
        return LogExporter._export(await this.databaseLogger.db.log.toArray(), raw)
    }

    /**
     * Helper function for exporting data as raw javascript or json
     * @param data Data to export
     * @param raw Stringify or not
     * @returns {*}
     * @private
     */
    static _export(data, raw) {
        if (raw) {
            return data
        }

        return JSON.stringify(data)
    }
}