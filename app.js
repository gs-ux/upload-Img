const express = require('express');
const multiparty = require('multiparty')
const fs = require('fs');
const path = require("path");
const app = express();
//上传文件目录
app.use('/upload', express.static('upload'))

app.post('/adddata', function (req, res) {
    const form = new multiparty.Form();
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.uploadDir = 'upload'
    form.parse(req, function (err, flields, files) {
        //path.extname() 方法返回 path 的扩展名例如.jpg .png等等
        const extname = path.extname(files.file[0].originalFilename);
        //uuid生成 图片名称(uuid.v4()会返回一个随机类似"34586f70-169d-4681-90cc-151ac288ae8d"的字符串)，replace方法把 - 全部去掉
        const nameID = (uuid.v4()).replace(/\-/g, '');
        const oldpath = path.normalize(files.file[0].path);//原来的图片路径，并使用path.normalize()将其规范化
        let newfilename = nameID + extname;       //新的文件名：uuid生成的字符串加上扩展名
        var newpath = './upload/' + newfilename;  //新的存储路径
        fs.rename(oldpath, newpath, function (err) {  //改名
            if (err) {
                res.send('success').end();
            } else {
                res.send('fail').end();
            }
        })
    })
})
app.listen(6000)
console.log('running...')