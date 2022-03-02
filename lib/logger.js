const log4js = require("log4js")

async function log(message, level) {
    const { logConsole, logFile } = await getLogger()
    
    level = level ? level : 'info'

    logConsole[level](message)
    logFile[level](message)
}

async function getLogger() {
    log4js.configure({
        appenders: { 
            fileLog: { 
                type: "file", 
                filename: "./store.log" 
            },
            consoleLog: {
                type: 'console'
            }
        },
        categories: { 
            default: { 
                appenders: ["fileLog"], 
                level: "trace"
            },
            fileLog: {
                appenders: ['fileLog'],
                level: 'all'
            },
            consoleLog: {
                appenders: ['consoleLog'],
                level: log4js.levels.ALL
            }
        }
    })

    const logConsole = log4js.getLogger("consoleLog")
    const logFile = log4js.getLogger("fileLog")

    return { logConsole, logFile }
}

module.exports = {
    getLogger,
    log
}
