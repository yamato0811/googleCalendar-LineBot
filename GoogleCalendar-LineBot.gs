function numToDate(year, month, date, hour) {
  minite = 0;
  
  //もし分の記載があれば分を追加
  if(hour.indexOf(':') != -1) {
    hour = hour.split(':');
    minite = hour[1];
    hour = hour[0];
  }
  
  const time = new Date(year, parseInt(month)-1, parseInt(date), parseInt(hour), parseInt(minite), 0);
  return time;
}

function getYear() { 
  const date = new Date();

  if(date.getMonth() == 11){    //12月のとき
    year = date.getFullYear() + 1;
  }else{
    year = date.getFullYear();
  }
  return year;
}


function test() {
  Logger.log(getYear());
}


function createEvents(year, month, e_title, date, s_hour, e_hour) {
  const calendar = CalendarApp.getDefaultCalendar();

  const title = e_title;
  const startTime = numToDate(year, month, date, s_hour);
  const endTime = numToDate(year, month, date, e_hour);

  const event = calendar.createEvent(title, startTime, endTime);
  
  if (title == 'バイト'){
    event.setColor(CalendarApp.EventColor.YELLOW);
  }else if (title == 'ネイティブキャンプ'){
    event.setColor(CalendarApp.EventColor.PALE_RED);
  }
}


function main(all_msg) {
  var count = 0;
  
  for(var msg of all_msg){
    
    if(count == 0){
      split_msg = msg.split(' ');
      if (split_msg.length == 1){        //タイトルに何も指定されていないとき
        var month = split_msg[0];
        var e_title = 'バイト';
      }else{
        var month = split_msg[0];
        var e_title = split_msg[1];
      }
      
    }else{
      split_msg = msg.split(' ');
      const date = split_msg[0];
      
      split_msg = msg.split(' ')[1].split('-');
      const s_hour = split_msg[0];
      const e_hour = split_msg[1];
      
      createEvents(getYear(), month, e_title, date, s_hour, e_hour);  //イベントの作成
    }
    count++;
  }
}


//---------------------------------------------------------------------------------------------------------------------

// LINE developersのメッセージ送受信設定に記載のアクセストークン
const LINE_TOKEN = ''; // アクセストークン
const LINE_URL = 'https://api.line.me/v2/bot/message/reply';

//postリクエストを受取ったときに発火する関数
function doPost(e) {

  // 応答用Tokenを取得
  const replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // メッセージを取得
  const userMessage = JSON.parse(e.postData.contents).events[0].message.text;

  //メッセージを改行ごとに分割
  const all_msg = userMessage.split("\n");
  const msg_num = all_msg.length;
  
  main(all_msg);

  
  
  const messages = [];
　
  const after_msg = {
    'type': 'text',
    'text': "データの入力が完了しました",
  }
  messages.push(after_msg);

  //lineで返答する
  UrlFetchApp.fetch(LINE_URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${LINE_TOKEN}`,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages,
    }),
  });

  ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);

}

//公開を押して「ウェブアプリケーションとして導入」をすること！
//project versionはnewとする

