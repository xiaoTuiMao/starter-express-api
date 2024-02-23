const axios = require('axios');
const Parser = require('rss-parser')
const parser = new Parser();

const RSS_TASKS = [
  {
    link: 'https://codersblock.com/rss.xml',
    name: 'codersblock',
  },
  {
    link: 'https://buttondown.email/whatever_jamie/rss',
    name: 'whatever_jamie',
  },
  {
    link: 'https://www.zhangxinxu.com/wordpress/feed/',
    name: '张鑫旭',
  }
]

const createRSSTask = async(task) => {
  try {
    const rssData = await parser.parseURL(task.link);
    return {
      source: task.name,

      contents: rssData.items.slice(0, 5).map(item => ({
        link: item.link,
        title: item.title,
        pubDate: item.pubDate,
      }))
    }
  } catch(e) {
    return {
      source: task.name,
      contents: [],
      error: `${task.name} 消息订阅失败。Error: ${e}`,
    }
  }
};

/**
 * 获取 rss 信息
 */
const getRSSInfo = async () => {
  const rssInfo = await Promise.all(RSS_TASKS.map(task => createRSSTask(task)));
  return rssInfo;
}

module.exports = {
  getRSSInfo,
}
