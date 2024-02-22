const axios = require('axios');
const xml2js = require('xml2js')
// const

const RSS_TASKS = [
  'https://www.zhihu.com/rss',
  'https://feeds.feedburner.com/zhihu-daily'
]

const createRSSTask = async(task) => {
  const res = await axios.get(task);
  const xmlData = await xml2js.parseStringPromise(res.data);
  const result = {
    source: task,
    desc: xmlData.rss.channel[0].description[0],
    contents: [],
  }
  xmlData.rss.channel[0].item.forEach(item => {
    result.contents.push({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate[0],
    })
  })
  return result;
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
