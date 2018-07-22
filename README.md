enhanced-diagnostics
===
This is a simple tool for transmitting device information and local log to your endpoint. 

The idea behind this package is to provide more information to find bugs and help users faster without 
recording their whole session or destroying their privacy. The user decides if and then he wants to send the data.

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

## What is coming next?

- Spring Boot Starter for usage of diagnostics
- PHP library for diagnostics