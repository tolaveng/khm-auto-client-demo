

export const getToDay = function() {
    var today = new Date();
    var d = (today.getDate() < 10 ? '0' : '' )+ today.getDate();
    var m = ((today.getMonth() + 1) < 10 ? '0' :'') + (today.getMonth() + 1);
    var y = today.getFullYear();
    var x = String(y+"-"+m+"-"+d); 
    return x;
 }