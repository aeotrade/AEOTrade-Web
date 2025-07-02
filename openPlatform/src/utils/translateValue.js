function changeDate(time,dateType,isTimeGroup) {
  if(!isTimeGroup){
    return time;
  }
  time = time.toString()
  var timeYear = time.slice(0,4);
  var timeMonth = time.slice(4,6);
  var monthLastDay = new Date(timeYear,timeMonth,0).getDate();//获取月末
  if(dateType === 0){
    return [time,time]
  }else if(dateType === 1){
    return [time.slice(0,6)+'01',time.slice(0,6)+monthLastDay];
  }else {
    return [timeYear+'0101',timeYear+'1231']
  }

}
export default function (nameEn,row,dateType,isTimeGroup) {
  let dataObj = {
    "DecHead_DeclDate":{"DecHead_DeclDate":changeDate(row.value,dateType,isTimeGroup)},
    "DecHead_IEDate":{"DecHead_IEDate":changeDate(row.value,dateType,isTimeGroup)},
    "DecHead_TradeAreaCode":{"DecHead_TradeAreaCode":changeDate(row.code,dateType,isTimeGroup)},
    "DecHead_TradeMode":{"DecHead_TradeMode":changeDate(row.code,dateType,isTimeGroup)},
    "DecHead_TradeName":{"DecHead_TradeName":changeDate(row.code,dateType,isTimeGroup)},
    "DecLists_DecList_GName":{"DecLists_DecList_GName.GName":changeDate(row.code,dateType,isTimeGroup)},
    "DecLists_DecList_kind":{"DecLists_DecList_kind.kind":changeDate(row.code,dateType,isTimeGroup)}
  }
  let result = null;
  if(dataObj[nameEn]){
    result = dataObj[nameEn];
  }else {
    let obj = {}
    obj[nameEn] = changeDate(row.value,dateType,isTimeGroup)
    result = obj;
  }
  return result;
}
