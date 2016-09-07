var func = {
  calTimeDuration: function (timeStr){
    var fmTime  = new Date(timeStr);
    var nowTime = new Date();

    // Convert milliseconds to minutes 
    var minutes = (nowTime - fmTime)/1000/60;

    var duration;
    if (minutes < 60) {
      duration = Math.ceil(minutes)+" minutes ago";
    } else if (minutes<(24*60)){
      duration = Math.round(minutes/60)+" hours ago";
    } else {
      duration = Math.round(minutes/60/24)+" days ago";
    }

    return duration;
  },

  ucfirst: function(str){
    return str.charAt(0).toUpperCase() + string.slice(1);
  },

};

module.exports = func;