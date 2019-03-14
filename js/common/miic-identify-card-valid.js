//身份证验证扩展
//加权位
var powers = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"];
//加权值
var parity_bit = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

var identify_sex = {
    "0": 0,
    "女": 0,
    "1": 1,
    "男": 1
};

//校验身份证号码的主调用
function valid_identify_id(identify_id) {
    //非空校验
    if (!identify_id || typeof identify_id !== "string" || identify_id.length != 18) return false;
    var num = identify_id.substr(0, 17);
    var bit = identify_id.substr(17);
    var power = 0;
    for (var i = 0; i < 17; i++) {
        var temp_num_str = num.charAt(i);
        //校验每一位的合法性
        if (!/\d/.test(temp_num_str)) {
            return false;
        } else {
            //加权
            power += parseInt(temp_num_str) * parseInt(powers[i]);
        }
    }
    //取模
    var mod = power % 11;
    if (parity_bit[mod] == bit) return true;
    return false;
}

//验证性别
function valid_identify_sex(identify_id, sex) {
    if (sex != null && sex != undefined) {
        var sex_str = identify_id.substr(16, 1);
        if (identify_sex[sex.toString()] == parseInt(sex_str) % 2) return true;
    }
    return false;
}

//验证生日
function valid_identify_birthday(identify_id, birthday) {
    if (birthday != null && birthday != undefined) {
        var birthday_str = identify_id.substring(6, 14);
        if (birthday.replace(/-|\//g, "") == birthday_str) return true;
    }
    return false;
}

$.extend({
    "ValidIdentifyID": valid_identify_id,
    "ValidIdentifySex": valid_identify_sex,
    "ValidIdentifyBirthday": valid_identify_birthday
});