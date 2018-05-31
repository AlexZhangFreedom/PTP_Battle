const express = require('express');
const app = express();
var http = require('http').Server(app);
var users = [];

const io = require('socket.io')(http);
function bg3(){
    var r=Math.floor(Math.random()*256);
    var g=Math.floor(Math.random()*256);
    var b=Math.floor(Math.random()*256);
    return "rgb("+r+','+g+','+b+")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}
app.use(express.static('public'))
app.get('/', (req, res) => res.send('Hello World!'))
io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(socket.id);

    users.push({
        uuid:socket.id,
        bgColor:bg3(),
        top:100*Math.random(),
        left:100*Math.random()
    })
    socket.broadcast.emit('newUser',users);

    // socket.on('newUser',function(msg){

    // });
    
    socket.on('pos', function (msg) {
        users.forEach(item=>{
            if(item.uuid === socket.id){
                item.top = msg.top
                item.left = msg.left
            }
        });
        msg.uuid = socket.id;
        socket.broadcast.emit('pos', msg);
    });

    socket.on('disconnect', function () {
        console.log('a user disconnected');
        users.splice(users.findIndex(item => item.uuid === socket.id), 1)
        socket.broadcast.emit('userLeave',{
           uuid:socket.id 
        });
    });
});
http.listen(3000, () => console.log('Example app listening on port 3000!'))