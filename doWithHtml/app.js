var glob = require('glob');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var jsdom = require('jsdom');

var basePath = path.join(__dirname,'src');


getAllFileAsync()
.then(function(fileList){
    var promises = [];
    fileList.forEach(function(file){
        promises.push(handlerHtml(file));
    })
    return Promise.all(promises);
})
.then(function(){
    console.log('done!');
});



function getAllFileAsync(){
    return new Promise(function(resolve,reject){
        glob(basePath+'/**/*.html',function(err,fileList){
            if(err){
                console.log('err :',err);
                reject(err)
            }
            resolve(fileList);
        })
    });
}

function handlerHtml(file){
    //readFile 得到html文件中的所有文本。
    return fs.readFileAsync(file, 'utf-8')
    .then(function(buffer){
        jsdom.env(buffer, function(err,window){
            if(err){
                console.log('jsdom err:',err);
            }
            var doc = window.document;
            //console.log('doc:',doc.querySelectorAll('script'));
            //把第一个script标签添加name属性
            var script1 =  doc.querySelectorAll('script')[0];
            script1.setAttribute('name','addTest');
            
            //writeFile可以把字符串或者buffer写入指定的file
            return fs.writeFileAsync(file,'<!DOCTYPE html>\n' + doc.documentElement.outerHTML);
        })
    })
    
}

