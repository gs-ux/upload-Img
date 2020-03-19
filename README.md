# upload-Img
**这一篇我们来聊聊用node作为服务器后台，处理微信小程序上传图片。**

我们用node设定一个后端接口，接受微信小程序发送的上传图片请求，然后把上传的图片保存到服务器一个文件夹下面，以便我们后续进行一系列操作。

我们需要借用npm中的一个名字叫**multiparty**的包即可，它可以帮助我们很简单的把微信小程序那边上传的图片存到我们的服务器上面。

在我们的项目文件里**新建一个app.js文件和一个upload文件夹**，其中app.js是运行的node文件，upload文件用来保存上传的图片。

在终端进行如下操作，安装`express`和`multiparty`两个包。

```shell
# 初始化npm
npm init --yes
# 安装express 和 multiparty
npm install express
npm install multiparty
```

在app.js文件中写入如下代码：

```js
const express = require('express');
const multiparty = require('multiparty')
const fs = require('fs');
const path = require("path");
const app = express();
//上传文件目录
app.use('/upload', express.static('upload'))

app.post('/adddata', function (req, res) {
    //创建对象
    const form = new multiparty.Form();
    //设置单文件大小限制 2M 
    form.maxFieldsSize = 2 * 1024 * 1024;
    //上传的文件夹
    form.uploadDir = 'upload'
    form.parse(req, function (err, flields, files) {
        //返回 success 字符串
        res.send('success')
    })
})
app.listen(6000)
console.log('running...')
```

很简单的使用步骤，`node app.js`运行app.js文件后，当我们在微信小程序那边上传图片，向`http://localhost:6000/adddata`发送请求后，node就会把图片存到upload文件夹里面，并向微信小程序那边返回`success`字符串。

------

不过如果要考虑到文件重名问题，我们再设置一个`adddata2`接口，增加一个把存入的文件随机命名的功能。

我们需要引入一个npm包：`uuid`，使用这个包可以实现随机命名图片名字。

```js
const express = require('express');
const multiparty = require('multiparty')
const fs = require('fs');
const path = require("path");
const uuid = require('uuid')

const app = express();
app.use('/upload', express.static('upload'))

app.post('/adddata2', function (req, res) {
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
```

两个接口，第二个要稍微复杂一点，里面一大推`path`相关的方法，还要会用`uuid`这个npm包。