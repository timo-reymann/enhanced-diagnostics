enhanced-diagnostics
===
This is a simple tool for transmitting device information and local log to your endpoint. 

The idea behind this package is to provide more information to find bugs and help users faster without 
recording their whole session or destroying their privacy. The user decides if and then he wants to send the data.


## Install

### npm
``npm install enhanced-diagnostics --save``

### yarn
``yarn add enhanced-diagnostics --save``


## General usage

| Step                                                   | Code                                                                                   |
| :------------------------------------------------------| :------------------------------------------------------------------------------------- |
| Intercept xhr, fetch and console api                   | ``window.logger = new DatabaseLogger('my_log_db', 1)``                                 |
| Log all network requests and console stuff to IndexedDB| Let diagnostics do the work.                                                          |
| User triggers report of bug/error, collect data        | ``let logReporter = new LogReporter(logger)``                                          |
| Build report, break into chunks, encrypt the chunks    | This happens in the sendReport step.                                                   |
| Send report encrypted to server                        | ``await logReporter.sendReport("report.php", publicKey)``                              |
| Process report                                         | You must implement this on your server. Sample can be found in /development/report.php |


## Reporting

| ![Process](https://raw.githubusercontent.com/timo-reymann/enhanced-diagnostics/master/graphics/process.svg?sanitize=true)
|:--:| 
| Blue parts are handeled using diagnostics, as explained above. The steps in orange you must implement yourself on server side. |

## Code Sample

You can find an code sample in [/development](https://github.com/timo-reymann/enhanced-diagnostics/tree/master/development).


## Custom report uploading

If you just need the encrypted plugins but want to specify custom parameters/values or a custom fetch config you can use ``LogReporter#buildReportChunks`(publicKey : String) : Promise<String>`. This gives you the report chunks as json string.


## Libraries for your server side

- [Java](https://github.com/timo-reymann/enhanced-diagnostics-java)
- [Spring Boot](https://github.com/timo-reymann/enhanced-diagnostics-spring-boot-starter)
- [PHP](https://github.com/timo-reymann/enhanced-diagnostics-php)


## What is coming next?
- PHP library for diagnostics
