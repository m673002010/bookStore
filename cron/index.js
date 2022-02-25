const cron = require('node-cron')
const { fetchCategory, updateCategory } = require('./category')
const { booksExpress } = require('./douban')

// 定时任务列表
const taskList = [
    {
        task: fetchCategory, // 抓取分类信息
        time: '' 
    },
    {
        task: updateCategory, // 更新分类信息
        time: '' 
    },
    {
        task: booksExpress, // 豆瓣新书速递
        time: '' 
    }
]

// 启动定时任务
function start () {
    for (const item of taskList) {
        if (!item.time) continue
        cron.schedule(item.time, item.task)
    }
}

module.exports = {
    start
}
