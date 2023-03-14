var UNKNOWN 	= 0;
var IOS 		= 1;
var ANDROID 	= 2;

var divIDs = ['Desktop','iOS', 'Android'];

function getMobileOperatingSystem() 
{
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // return IOS;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    // return 'iOS';
    return IOS;
  }
  else if( userAgent.match( /Android/i ) )
  {
    // return 'Android';
  	return ANDROID;
  }
  return UNKNOWN;
}


function showLink()
{
	var os = getMobileOperatingSystem();

	for (i=0; i < 3; i++)
	{
		var el = document.getElementById(divIDs[i]);
		
		if (os == i)
		{
			el.style.display = "block";
		}
		else
		{
			el.style.display = "none";
		}
	}
}

function verifySMS()
{
	document.getElementById("SMSConfirm").style.display = "block";
}

function sendSMS(form) 
{
	var phone = form.phone.value;

	console.log('SENDING APP TO: ' + phone);

	var linkData = {
		tags: [],
		channel: 'Website',
		feature: 'TextMeTheApp',
		data: {
			'foo': 'bar'
		}
	};

	var options = {};
	var callback = function(err, result) 
	{
		if (err) {
			console.log(err);
			alert("Sorry, something went wrong. " + err);
		}
		else 
		{
			console.log();
			verifySMS();
		}
	};

	branch.sendSMS(phone, linkData, options, callback);
	form.phone.value = "";
}

// showLink();

