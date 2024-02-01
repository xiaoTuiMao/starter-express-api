const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs-extra');


// 设置邮件内容
const mailOptions = {
  from: 'pengbingapple@163.com', // 发送者
  to: '460976963@qq.com', // 接收者
  subject: 'Hello from Node', // 主题
  text: 'Hello world?', // 纯文本正文
  html: '<b>Hello world?</b>' // HTML正文
};

const sendEmail = (req, res, next) => {
  const { user, pass } = req.query;
  console.log(req.query);
  const jsonPath = path.join(__dirname, './user.json');
  if (user && pass) {
    console.log('=====');
    fs.writeJSONSync(jsonPath, { user, pass });
  }

  try{
    const userInfo = fs.readJSONSync(jsonPath);
    const transporter = nodemailer.createTransport({
      host: 'smtp.163.com', // SMTP 服务器
      port: 465, // SMTP 端口
      secure: true, // 如果是 465 端口使用 true，其他端口使用 false
      auth: {
          user: userInfo.user, // 你的邮箱账号
          pass: userInfo.pass // 你的邮箱密码
      }
    });
    // 发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.send(error.toString());
        return;
      }
      res.send('send email ok');
    });
    transporter.close();
  } catch (err){
    res.send(err.toString());
  }
}

const setup = (app) => {
  app.get('/email', sendEmail);
}

module.exports = {
  setup,
};