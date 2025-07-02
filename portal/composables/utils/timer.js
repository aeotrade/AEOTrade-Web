/*将时间戳转化为多久之前*/
export   function timestampFormat( timestamp ) {
    if (timestamp.length>=12){
      timestamp/=1000
    }
    function zeroize( num ) {
      return (String(num).length == 1 ? '0' : '') + num;
    }
  
    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  
    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
  
    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
  
    if ( timestampDiff < 60 ) { // 一分钟以内
      return "刚刚";
    } else if( timestampDiff < 3600 ) { // 一小时前之内
      return Math.floor( timestampDiff / 60 ) + "分钟前";
    } else if (  timestampDiff < 86400 ) {
      return Math.floor( timestampDiff / 3600 ) + "小时前";
    } else {
      var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
      if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
        return '昨天' + zeroize(H) + ':' + zeroize(i);
      } else if ( curDate.getFullYear() == Y ) {
        return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
      } else {
        return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
      }
    }
  }
  
  export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  
    let date;
  
    if (typeof time === 'object') {
      date = time;
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)
  
  
      ) {
        time = parseInt(time);
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      'y': date.getFullYear(),
      'm': date.getMonth() + 1,
      'd': date.getDate(),
      'h': date.getHours(),
      'i': date.getMinutes(),
      's': date.getSeconds(),
      'a': date.getDay()
    };
  
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key];
  
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ]; }
      return value.toString().padStart(2, '0');
    });
  
    return time_str;
  }
  