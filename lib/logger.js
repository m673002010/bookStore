const log4js = require("log4js")

function log(message, level) {
    const { logConsole, logFile } = getLogger()
    
    level = level ? level : 'info'

    logConsole[level](message)
    logFile[level](message)
}

function getLogger() {
    log4js.configure({
        appenders: { 
            bookStore_fileLog: { 
                type: "file", 
                filename: "./store.log" 
            },
            bookStore_Console: {
                type: 'console'
            }
        },
        categories: { 
            default: { 
                appenders: ["bookStore_fileLog"], 
                level: "trace"
            },
            bookStore_fileLog: {
                appenders: ['bookStore_fileLog'],
                level: 'all'
            },
            bookStore_Console: {
                appenders: ['bookStore_Console'],
                level: log4js.levels.ALL
            }
        }
    })

    const logConsole = log4js.getLogger("bookStore_Console")
    const logFile = log4js.getLogger("bookStore_fileLog")

    return { logConsole, logFile }
}

module.exports = {
    getLogger,
    log
}
