/**
 * LogReporter
 */
export default class LogReporter {
    /**
     *
     * @param logger {DatabaseLogger}
     */
    constructor(logger) {
        this.crypt = new JSEncrypt()
        this.logger = logger
    }

    /**
     * Collect data from diagnostics
     *
     * @returns {Promise<string>}
     * @private
     */
    async _collectData() {
        return JSON.stringify(await this.logger.exportDiagnostics())
    }

    /**
     *
     * @param data
     * @returns {*|string[]}
     * @private
     */
    static _buildChunks(data) {
        return data.split(/(.{256})/)
    }

    /**
     *
     * @param chunks
     * @returns {Array}
     * @private
     */
    _encryptChunks(chunks) {
        let encryptedChunks = []

        chunks.forEach(c => {
            encryptedChunks.push(this.crypt.encrypt(c))
        })

        return encryptedChunks
    }

    /**
     * Split report json into smaller chunks for encryption
     *
     * @param publicKey {string} Public key for encryption
     * @returns {Promise<string>}
     * @private
     */
    async _buildReportChunks(publicKey) {
        if (!publicKey || publicKey === null) {
            throw 'Public key is required, for encryption'
        }

        this.crypt.setKey(publicKey)
        return JSON.stringify(this._encryptChunks(LogReporter._buildChunks(await this._collectData())));
    }

    /**
     * Send report to a given url in chunks
     * @param url Url to post report to
     * @param publicKey {string} Public key for encryption
     * @returns {Promise<void>}
     */
    async sendReport(url, publicKey) {
        return await fetch(url, {
            method: 'POST',
            body: await this._buildReportChunks(publicKey)
        }).then(() => this.logger.clear());
    }
}