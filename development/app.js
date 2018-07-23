async function main() {
    const collectDeviceData = document.querySelector("#collectDeviceData");
    const exportLog = document.querySelector("#exportLog");
    const deviceDataArea = document.querySelector("#deviceDataArea");
    const exportLogArea = document.querySelector("#exportLogArea");
    const collect = document.querySelector("#collect");
    const collectArea = document.querySelector("#collectArea");

    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);

    window.logger = new DatabaseLogger('local_test', 1, yesterday);

    collectDeviceData.addEventListener("click", async () => {
        deviceDataArea.innerHTML = 'LOADING';
        logger.collectDeviceData();
        deviceDataArea.innerHTML = '<code>' + (await logger.exporter.exportDeviceInfo()) + '</code>'
    });

    exportLog.addEventListener("click", async () => {
        exportLogArea.innerHTML = 'LOADING';
        exportLogArea.innerHTML = '<code>' + (await logger.exporter.exportLog()) + '</code>'
    });

    collect.addEventListener("click", async () => {
        collectArea.innerHTML = 'LOADING';
        collectArea.innerHTML = JSON.stringify(await logger.exportDiagnostics());

        let logReporter = new LogReporter(logger);
        let pubKey = await fetch("report.php?pubkey").then(r => r.json())

        await logReporter.sendReport("report.php", pubKey.publicKey);
        alert("Your report was succesfuly sent!")
    });
    
    fetch("/test")
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});
