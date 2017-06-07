/**
 * Created by chenguojun on 2017/3/30.
 */
var flag = true;
var flagType = -1;
var testArr = ['2.11', '2.1.1', '2.122'];
for (i in testArr) {
    var v = testArr[i];
    v = v === '' ? 0 : v;
    var re = /^[0-9]+(.[0-9]{1,2})?$/;
    var re2 = /^[0-9]+.[0-9]+$/;
    if (flagType >= 0)
        continue;
    if (re.test(v)) {
        v = parseFloat(v)
    } else {
        if (isNaN(v)) {
            flagType = 0;
        } else if (v < 0) {
            flagType = 1;
        } else if (re2.test(v)) {
            flagType = 2;
        }
        flag = false;
    }
}

if (!flag) {
    switch (flagType) {
        case 0:
            console.log("请填写正确的数字");
            break;
        case 1:
            console.log("填写数字必须为整数");
            break;
        case 2:
            console.log("填写数字请保留两位小数");
            break;
        default:
            console.log("请填写正确的数字");
    }

}