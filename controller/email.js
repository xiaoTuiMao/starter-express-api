const nodemailer = require('nodemailer');
const ejs = require('ejs');
const rss = require('../services/rss');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com', // SMTP 服务器
  port: 465, // SMTP 端口
  secure: true, // 如果是 465 端口使用 true，其他端口使用 false
  auth: {
      user: process.env.EMAIL_USER, // 你的邮箱账号
      pass: process.env.EMAIL_PASS // 邮箱密码或授权码
  }
});

// 设置邮件内容
const mailOptions = {
  from: 'pengbingapple@163.com', // 发送者
  to: '460976963@qq.com', // 接收者
  subject: 'Hello from Node', // 主题
  text: 'Hello world?', // 纯文本正文
  html: '<b>Hello world?</b>' // HTML正文
};


 const disposalData = async (req, res, next) => {
  const rssInfo = await rss.getRSSInfo();
  const template = `
  <style>
  * {
    margin: 0;
    padding: 0;
  }
  </style>
  <div style="display: flex;">
    <% rssInfo.forEach((item) => { %>
      <div style="width: <%= 100 / rssInfo.length %>%; padding: 10px; box-sizing: border-box">
        <h2 style="margin-bottom: 10px"><%= item.source %></h2>
        <% item.contents.forEach((content) => { %>
          <div style="
          padding: 10px;
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          cursor: pointer;
      ">
            <a target='_blank' href="<%= content.link %>"><%= content.title %></a>
            <p style="margin-top: 10px">发布时间<%= content.pubDate %></p>
          </div>
        <%});%>
      </div>
    <%});%>
  </div>
  `
  req.html = ejs.render(template, { rssInfo });
  res.send(req.html);
  // next();
 }

const sendEmail = (req, res, next) => {
  transporter.sendMail({
    from: 'pengbingapple@163.com', // 发送者
    to: '460976963@qq.com', // 接收者
    subject: '每日简讯', // 主题
    html: JSON.stringify(req.html), // 纯文本正文
  }, (error, info) => {
    if (error) {
      res.send(error.toString());
      return;
    }
    res.send('send email ok');
  });
}

const setup = (app) => {
  app.get('/rss-1', disposalData, sendEmail);
}

module.exports = {
  setup,
};