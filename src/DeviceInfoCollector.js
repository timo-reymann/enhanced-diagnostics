import "../lib/client.min"

/**
 * Collector for device metadata
 */
export default class DeviceInfoCollector {
    /**
     *
     * @param db {Dexie}
     */
    constructor(db) {
        this.db = db;
        this.client = new ClientJS()
    }

    /**
     * Collect device info
     *
     * @returns {{fingerprint: *, userAgent: *, browser, browserVersion: *, engine: *, engineVersion: *, os: *, osVersion: *, device: *, deviceType: *, deviceVendor: *, cpu: *, mobile: *, screenPrint: *, colorDepth: *, currentResolution: *, availableResolution: *, plugins: *, fonts: *, localStorageSupported: *, sessionStorageSupported: *, language: *}}
     * @private
     */
    _collect() {
        return {
            fingerprint: this.client.getFingerprint(),
            userAgent: this.client.getUserAgent(),
            browser: this.client.getBrowser(),
            browserVersion: this.client.getBrowserVersion(),
            engine: this.client.getEngine(),
            engineVersion: this.client.getEngineVersion(),
            os: this.client.getOS(),
            osVersion: this.client.getOSVersion(),
            device: this.client.getDevice(),
            deviceType: this.client.getDeviceType(),
            deviceVendor: this.client.getDeviceVendor(),
            cpu: this.client.getCPU(),
            mobile: this.client.isMobile(),
            screenPrint: this.client.getScreenPrint(),
            colorDepth: this.client.getColorDepth(),
            currentResolution: this.client.getCurrentResolution(),
            availableResolution: this.client.getAvailableResolution(),
            plugins: this.client.getPlugins(),
            fonts: this.client.getFonts(),
            localStorageSupported: this.client.isLocalStorage(),
            sessionStorageSupported: this.client.isSessionStorage(),
            language: this.client.getLanguage()
        }
    }

    /**
     * Persist device info to db
     *
     * @param info Info from _collect
     * @private
     */
    _persist(info) {
        Object.keys(info).forEach(k => {
            this.db.device.put({key: k, value: info[k] ? info[k] : null})
        });

        this.db.device.put({
            key: '_collectionDate',
            value: Date.now()
        })
    }

    /**
     * Run collector
     */
    run() {
        this._persist(this._collect())
    }
}