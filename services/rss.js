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
  },

  {
    link: 'https://hughfenghen.github.io/rss.xml',
    name: '风痕 · 術&思',
  },
  {
    link: 'https://changelog.com/jsparty/feed',
    name: 'changelog-jsParty',
  },
  {
    link: 'https://cprss.s3.amazonaws.com/react.statuscode.com.xml',
    name: 'react',
  },
  {
    link: 'https://cprss.s3.amazonaws.com/frontendfoc.us.xml',
    name: 'html',
  },
]

const createRSSTask = async(task) => {
  try {
    const rssData = await parser.parseURL(task.link);
    return {
      source: task.name,

      contents: rssData.items.sort((a, b) => {
        return new Date(b.pubDate) - new Date(a.pubDate);
      }).slice(0, 5).map(item => ({
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
const getRSSInfo = async (index = 1) => {
  const rssInfo = await Promise.all(RSS_TASKS.slice((index - 1) * 3, index * 3).map(task => createRSSTask(task)));
  return rssInfo;
}

module.exports = {
  getRSSInfo,
}
