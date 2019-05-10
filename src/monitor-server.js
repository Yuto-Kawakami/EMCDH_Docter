const io = require('socket.io-client')
const axiosBase = require('axios');
const querystring = require('querystring');

let canCall = true;

// let socket = io.connect("http://localhost:3001")
let socket = io.connect("http://ec2-54-199-199-19.ap-northeast-1.compute.amazonaws.com:3013/")
socket.on("chat message", (message) => {
    data = decodeMessage(message);
    if (data === null) return;
    if (data['status'] === 1 && canCall && data.id === '01'){
        console.log("call!!!")
        makeCall("リンリンからの連絡です。作業員01が緊急事態に陥った可能性があります。至急、アプリケーションで確認して下さい。")
        canCall = false
        setTimeout(exit_after, 1000000)
    }
});

function exit_after (){
    exit(1)
}

function makeCall(word){
    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman" language="ja-jp" loop="3">' + word + '</Say></Response>';
    const axios = axiosBase.create({
        method: 'https',
        baseURL: 'https://api.twilio.com',
        headers: {
        'ContentType': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
        },
        responseType: 'json',
        auth: {
        username: 'ACfedd8cc98adade0f79c96964ecf5ad43',
        password: 'c1701e2ba401a6b4fc254a85683eeeba',
        }
    });

    axios.post('/2010-04-01/Accounts/ACfedd8cc98adade0f79c96964ecf5ad43/Calls', querystring.stringify({
        // Url: 'http://forestory-emergency-call.s3-ap-northeast-1.amazonaws.com/twilio.xml',
        Url: 'http://twimlets.com/echo?Twiml=' + querystring.escape(twiml),
        To: '+819091509831',
        From: '+815031864522',
        Method: 'GET',
    }));
}


function decodeMessage(message){
    console.log(message)
    let type = Number(message.slice(0,1));
    let id = message.slice(1,3);
    let lat = Number(message.slice(3, 12));
    let lng = Number(message.slice(12, 22));
    let status = Number(message.slice(22,23))

    if(type !== 0){
      return null 
    }

    let data = {
          id: id,
          lat: lat,
          lng: lng,
          name: '作業員' + id,
          timestamp: Date.now(),
          status: status
      };
      console.log(data)
    return data
};

function say(){
    setTimeout(say, 10);
}

say()