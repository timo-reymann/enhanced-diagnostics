import DeviceInfoCollector from "./DeviceInfoCollector";
import LogExporter from "./LogExporter"
import Dexie from "dexie"

/**
 * DatabaseLogger
 */
export default class DatabaseLogger {
    /**
     *
     * @param databaseName
     * @param version
     * @param deleteOlderThan
     */
    constructor(databaseName, version, deleteOlderThan) {
        this.db = new Dexie(databaseName);
        this.fetchApi = null;
        this._initDB(version, deleteOlderThan);
        this.infoCollector = new DeviceInfoCollector(this.db);
        this.exporter = new LogExporter(this);
        this.init()
    }

    /**
     *
     * @param version
     * @param deleteOlderThan
     * @returns {Promise<void>}
     * @private
     */
    async _initDB(version, deleteOlderThan) {
        this.db.version(version ? version : 1).stores({
            log: 'timestamp, message',
            device: 'key'
        });
        await this.db.open();

        if (deleteOlderThan) {
            this.db.log.where("timestamp")
                .below(deleteOlderThan)
                .delete()
        }
    }

    /**
     * Log to db
     *
     * @param level {string} Log level
     * @param type {string} Type
     * @param payloadToLog {string|object} Payload
     */
    log(level, type, payloadToLog) {
        let payload = JSON.stringify(payloadToLog.payload, null, 1);
        let message = payloadToLog.message;
        let timestamp = new Date(Date.now());

        this.db.log.put({
            timestamp,
            level,
            type,
            message,
            payload
        });
    }

    /**
     * Parse js arguments
     *
     * @param argumentList
     */
    static parseArguments(argumentList) {
        let message = argumentList.length > 0 ? argumentList[0] : null;
        let payload = argumentList.length > 1 ? argumentList[1] : null;
        let args = {};

        if (message)
            args.message = message;

        if (payload)
            args.payload = payload;

        return args;
    }

    /**
     * Initialize logger
     */
    init() {
        this._interceptConsole();
        this._registerGlobalErrorHandler();
        this._interceptFetch();
        this._interceptXhr()
    }

    /**
     * Intercept window.console
     *
     * @private
     */
    _interceptConsole() {
        const logger = this;

        window.console = (function (oldCons) {
            logger.consoleApi = oldCons;

            return {
                log: function () {
                    oldCons.log.apply(this, arguments);
                    logger.log('LOG', 'console', DatabaseLogger.parseArguments(arguments))
                },
                info: function () {
                    oldCons.info.apply(this, arguments);
                    logger.log('INFO', 'console', DatabaseLogger.parseArguments(arguments))
                },
                warn: function () {
                    oldCons.warn.apply(this, arguments);
                    logger.log('WARN', 'console', DatabaseLogger.parseArguments(arguments))
                },
                error: function () {
                    oldCons.error.apply(this, arguments);
                    logger.log('ERROR', 'console', DatabaseLogger.parseArguments(arguments))
                }
            };
        }(window.console));
    }

    /**
     * Intercept window.fetch
     *
     * @private
     */
    _interceptFetch() {
        const logger = this;

        (function () {
            const originalFetch = fetch;
            logger.fetchApi = originalFetch;

            fetch = function () {
                let url = arguments.length > 0 ? arguments[0] : null;
                let config = arguments.length > 1 ? arguments[1] : null;

                logger.log('DEBUG', 'network', {message: 'Fetch started', payload: {url, config}});

                return originalFetch.apply(this, arguments).then(function (response) {
                    response.clone().text().then((text) => {
                        let payload = {
                            url: response.url,
                            status: response.status,
                            redirected: response.redirected,
                            headers: response.headers,
                            data: text
                        };

                        logger.log('ERROR', 'network', {message: 'Fetch failed', payload: payload})
                    });

                    return response;
                });
            };
        })();
    }

    /**
     * Intercept XMLHttpRequest
     *
     * @private
     */
    _interceptXhr() {
        const logger = this;

        (function (open) {
            XMLHttpRequest.prototype.open = function () {
                const args = arguments;
                const url = args[1];
                const method = args[0];
                const async = args[2];

                logger.log('DEBUG', 'network', {message: 'XHR started', payload: {method, url, async}});

                this.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) // Abgeschlossen
                        logger.log('DEBUG', 'network', {message: 'XHR successful', payload: {method, url, async}})
                }, false);

                this.addEventListener("error", (e) => {
                    const errorMessage = e.target.responseText || 'Network request failed';
                    logger.log('ERROR', 'network', {message: 'XHR failed', payload: {method, url, async, errorMessage}})
                });

                open.apply(this, arguments);
            };
        })(XMLHttpRequest.prototype.open);
    }

    /**
     * Register custom global error handler for javascript syntax errors
     * @private
     */
    _registerGlobalErrorHandler() {
        const logger = this;

        window.onerror = (msg, url, line, column, error) => {
            const string = msg.toLowerCase();
            const substring = "script error";
            const payload = {msg, url, line, column, error};

            if (string.indexOf(substring) > -1) {
                logger.log('ERROR', 'runtime', {message: 'Unknown Script Error', payload: payload})
            } else {
                logger.log('ERROR', 'runtime', {message: msg, payload: payload})
            }

            return true;
        };
    }

    /**
     * Collect device data using infoCollector
     */
    collectDeviceData() {
        this.infoCollector.run()
    }

    /**
     * Export diagnostics
     *
     * @returns {Promise<{deviceInfo: *, log: *}>}
     */
    async exportDiagnostics() {
        this.collectDeviceData();
        let deviceInfo = await this.exporter.exportDeviceInfo(true);
        let log = await this.exporter.exportLog(true);

        return {
            deviceInfo,
            log
        };
    }

    /**
     * Clear database
     *
     * @returns {Promise<void>}
     */
    async clear() {
        await this.db.delete();
        this._initDB(1)
    }
}