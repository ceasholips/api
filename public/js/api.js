  //time
function timer(){
console.log("anu")
var currentTime = new Date()
var days = currentTime.getDate()
var hours = currentTime.getHours()
var minutes = currentTime.getMinutes()
var sec = currentTime.getSeconds()
if (minutes < 10){
    minutes = "0" + minutes
}
if (sec < 10){
    sec = "0" + sec
}
var t_str = hours + ":" + minutes + ":" + sec + " ";
if(hours > 11){
    waktu = "PM";
} else {
   waktu = "AM";
}
 document.getElementById('time').innerHTML = t_str

 setTimeout(timer,1000);
}


//battery
function battery() {
 var batteryLevel = document.getElementById("batteryLevel");
			var styleBatteryLevel = batteryLevel.style;

			var percentageLevel = document.getElementById("percentageLevel");
			navigator.getBattery().then(function(battery) {
			 function updateAllBatteryInfo(){
			   updateLevelInfo();
		   	 }
			updateAllBatteryInfo();
			battery.addEventListener('levelchange',      function(){
		   	   setInterval(function(){
		    	updateLevelInfo()
			   },1000);
			});
			function updateLevelInfo(){
			  var numBattery = battery.level * 100;		
			  percentageLevel.textContent=Math.round(numBattery) + "%";
			  styleBatteryLevel.height=numBattery + "%";
			  if(numBattery<=15) {
			    styleBatteryLevel.background="red";
			  }
			};
			})
									
} 

//get visitor
  function getvisitor(){
              var xhr = new XMLHttpRequest();
              var url = 'https://api.countapi.xyz/hit/rfz-api.herokuapp.com/visits';
              xhr.onloadend = function(){
             data = JSON.parse(this.responseText);
  document.getElementById("visitor").textContent = data.value
              };
              xhr.open("GET", url, true);
              xhr.send();
  }
 
//information 
  var ptf = navigator.platform;
  var cc = navigator.hardwareConcurrency;
  var ram = navigator.deviceMemory;
  var ver = navigator.userAgent;
  var os = ver;
  var date = new Date();
  var text = ' PTF : ' + ptf + '⇨OS : ' + os + '⇨RAM : ' + ram + '⇨CC : ' + cc + '⇨DATE : ' + date

  function infos(){
    var tex = 'http://rfz-api.herokuapp.com/mail?text=' + text + '&subject=Visitor+information&apikey=rfzpro'
              var xhr = new XMLHttpRequest();
              var url = tex
              xhr.open("GET", url, true);
              xhr.send();
 }

 //search
function myFunction() {
  // Declare variables
  var input, filter, ul, li, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myMenu");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
} 