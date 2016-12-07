/*
 * 
 * v2.0 Initial Version
 * v2.1 Included more video types
 * v2.2 Enabled the fullscreen Option
 * v2.3 Included the status bar and adjusts to play in a window
 * v2.4 Included a shuffle option
 *      fixed the problem of pressing the next button rapidly
 *      The list updates automaticaly at start
 * v2.5 It can now logs the steps (have to enable it on the videoplayer-v2.js & videoplayer.sh files)
 *		closes the app if is not the current (first attempt)
 *		fixes the issue of pressing mutiple times the search video button
 *		fixes the application not showing the controls again when a video play fails
 *		fixes playing the same video when shuffle is active
 *		starts using a swap file on start of the app if not running (still have to create the swap with the AIO)
 */
var enableLog = false;

var currentVideoTrack = null;
var playbackRepeat = false;
var playbackVideo = '';
var currentVideoListContainer = 0;
var totalVideoListContainer = 0;
var FullScreen = false;
var Shuffle = false;
var waitingWS = false;
var waitingForClose=false;
var totalVideos = 0;
//var ws = null;
var intervalVideoPlayer;

$(document).ready(function(){
	try
	{
		$('#SbSpeedo').fadeOut();
	}
	catch(err)
	{
		
	}
	
	if (enableLog === true)
    {
		var dt = new Date();
        myVideoWs('enable-write');
        console.log('enable-write' + dt.toISOString() + " " + dt.getMilliseconds() + ";");
    }
	
	myVideoWs('start-swap');
	
	writeLog(" ");
	writeLog("---------------------------------------------------------------------------------");
    writeLog("app start");
	
	/* start up
	==================================================================================*/
	// $("#myMainBtnDiv").append('<img src="addon-player/myVideoBtn.png" id="myVideoBtnDiv"><img src="addon-player/rebootBtn.png" class="rebootBtnDiv">');
	// $('#myVideoContainer').css({'display' : 'none'});

	/* reboot system
	==================================================================================*/
	$('.rebootBtnDiv').click(function(){
		writeLog("rebootBtn Clicked");
		myRebootSystem();
	});

	/* open player
	==================================================================================*/
	// $('#myVideoBtnDiv').click(function(){
	// 	$('#myVideoContainer').fadeIn();
	// });

	/* retrieve video list
	==================================================================================*/
	$('#myVideoMovieBtn').click(function(){
		writeLog("myVideoMovieBtn Clicked");
		myVideoListRequest();
	});

	/* scroll up video list
	==================================================================================*/
	$('#myVideoScrollUp').click(function(){
		writeLog("myVideoScrollUp Clicked");
		myVideoListScrollUpDown('up');
	});

	/* scroll down video list
	==================================================================================*/
	$('#myVideoScrollDown').click(function(){
		writeLog("myVideoScrollDown Clicked");
		myVideoListScrollUpDown('down');
	});

	/* stop playback
	==================================================================================*/
	$('#myVideoStopBtn').click(function(){
		writeLog("myVideoStopBtn Clicked");
		myVideoStopRequest();
	});

	/* start playback
	==================================================================================*/
	$('#myVideoList').on("click", "li", function() {
		writeLog("myVideoList Clicked");
		myVideoStartRequest($(this));
	});

	/* next track
	==================================================================================*/
	$('#myVideoNextBtn').click(function(){
		writeLog("myVideoNextBtn Clicked");
		myVideoNextRequest();
	});

	/* close player and back to menu
	==================================================================================*/
	// $('#myVideoBackBtn').click(function(){
	// 	myVideoStopRequest();
	// 	$('#myVideoContainer').fadeOut();
	// });

	/* repeat option (looping single track)
	==================================================================================*/
	$('#myVideoRepeatBtn').click(function(){
		writeLog("myVideoRepeatBtn Clicked");
		if(playbackRepeat){
			playbackRepeat = false;
			$('#myVideoRepeatBtn').css({'background-image' : 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoUncheckBox.png)'});
		} else {
			playbackRepeat = true;
			$('#myVideoRepeatBtn').css({'background-image' : 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoCheckedBox.png)'});
		}
	});
	
	/* Full Screen option
	==================================================================================*/
	$('#myVideoFullScrBtn').click(function(){
		writeLog("myVideoFullScrBtn Clicked");
		if(FullScreen)
		{
			FullScreen = false;
			$('#myVideoFullScrBtn').css({'background-image' : 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoUncheckBox.png)'});
		} 
		else 
		{
			FullScreen = true;
			$('#myVideoFullScrBtn').css({'background-image' : 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoCheckedBox.png)'});
		}
	});
	
	/* Shuffle option
	==================================================================================*/
	$('#myVideoShuffleBtn').click(function(){
		writeLog("myVideoShuffleBtn Clicked");
		if(Shuffle)
		{
			Shuffle = false;
			$('#myVideoShuffleBtn').css({'background-image' : 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoUncheckBox.png)'});
		} 
		else 
		{
			Shuffle = true;
			$('#myVideoShuffleBtn').css({'background-image' : 'url(apps/_videoplayer/templates/VideoPlayer/images/myVideoCheckedBox.png)'});
		}
	});
	
    setTimeout(function () {
        writeLog("setTimeout started");
        myVideoListRequest();
    }, 1000);

});



// try not to make changes to the lines below

// Start of Video Player
// #############################################################################################

/* reboot system
==========================================================================================================*/
function myRebootSystem(){
	writeLog("myRebootSystem called");
    myVideoWs('reboot-system');
}

/* video list request / response
==========================================================================================================*/
function myVideoListRequest(){
	writeLog("myVideoListRequest called");
	if (!waitingWS)
	{
		waitingWS=true;
		currentVideoListContainer = 0;
		$('#myVideoScrollUp').css({'visibility' : 'hidden'});
		$('#myVideoScrollDown').css({'visibility' : 'hidden'});
		$('#myVideoList').html("<img id='ajaxLoader' src='apps/_videoplayer/templates/VideoPlayer/images/ajax-loader.gif'>");
		try
		{
			writeLog("Global.Pause");
			framework.sendEventToMmui("Common", "Global.Pause");
		}
		catch(err)
		{
			writeLog("Error: " + err);
		}
		
		myVideoWs('playback-list');
	}
	
	writeLog("myVideoListRequest end");
	
}

function myVideoListResponse(data, count){
	writeLog("myVideoListResponse called");
    if(data.length < 2){
		writeLog("No videos found");
        data = 'No videos found<br/><br/>Tap <img src="apps/_videoplayer/templates/VideoPlayer/images/myVideoMovieBtn.png" style="margin-left:8px; margin-right:8px" /> to search again';
        //totalVideoListContainer = 0;
    }
	writeLog("myVideoList insert data");
	
	try
	{
		$('#myVideoList').html(data);
		totalVideoListContainer = $('.videoListContainer').length;
		if(totalVideoListContainer > 1){
			$('#myVideoScrollDown').css({'visibility' : 'visible'});
		}
		totalVideos = count;
		
		waitingWS=false;
	}
	catch(err)
	{
		writeLog("Error: " + err);
	}
	
	
	writeLog("myVideoListResponse end");
}

/* video list scroll up / down
==========================================================================================================*/
function myVideoListScrollUpDown(action){
	writeLog("myVideoListScrollUpDown called");
	
    if(action === 'up'){
        currentVideoListContainer--;
    } else if (action === 'down'){
        currentVideoListContainer++;
    }
	
    if(currentVideoListContainer === 0){
        $('#myVideoScrollUp').css({'visibility' : 'hidden'});
    } else if(currentVideoListContainer > 0){
        $('#myVideoScrollUp').css({'visibility' : 'visible'});
    }
	
    if((currentVideoListContainer + 1) === totalVideoListContainer){
        $('#myVideoScrollDown').css({'visibility' : 'hidden'});
    } else if((currentVideoListContainer + 1) < totalVideoListContainer){
        $('#myVideoScrollDown').css({'visibility' : 'visible'});
    }
	
    $('.videoListContainer').each(function(index){
        $(this).css({'display' : 'none'});
    });
	
    $(".videoListContainer:eq(" + currentVideoListContainer + ")").css("display", "");
	
	writeLog("myVideoListScrollUpDown end");
}

/* start playback request / response
==========================================================================================================*/
function myVideoStartRequest(obj){
	writeLog("myVideoStartRequest called");
	
	currentVideoTrack = $(".videoTrack").index(obj);
	var videoToPlay = obj.attr('video-data');
	playbackVideo = obj.attr('video-name');
	$('#myVideoStatus').html('Preparing to play...');
	$('#myVideoStatus').css({'display' : 'block'});
	
	writeLog("myVideoStartRequest - " + videoToPlay);
	
	try
	{
		if (FullScreen===false)
		{
			writeLog("myVideoStartRequest play");
			myVideoWs('playback-start#' + videoToPlay);
		}
		else
		{
			writeLog("myVideoStartRequest play FullScreen");
			myVideoWs('playback_fullscreen#' + videoToPlay);
		}
	
		$('#myVideoList').css({'visibility' : 'hidden'});
		$('#myVideoScrollDown').css({'visibility' : 'hidden'});
		$('#myVideoScrollUp').css({'visibility' : 'hidden'});
		waitingWS = true;
	
		//try to close the video if the videoplayer is not the current app
		intervalVideoPlayer = setInterval(function () {
			//writeLog("setInterval intervalVideoPlayer - " + framework.getCurrentApp());
			
			if ((!waitingForClose) && (framework.getCurrentApp() !== '_videoplayer')) {
				if (enableLog === true)
				{
					var dt = new Date();
					console.log('disable-write' + dt.toISOString() + " " + dt.getMilliseconds() + ";");
					myVideoWs('disable-write');					
				}
				
				waitingForClose = true;
				myVideoStopRequest();
				
				clearInterval(intervalVideoPlayer);
			}
		}, 1);//some performance issues ??
	}
	catch(err)
	{
		writeLog("Error: " + err);
	}
	
	writeLog("myVideoStartRequest end");
}

function myVideoStartResponse(data){
	writeLog("myVideoStartResponse called");
	
    if(data > 0){
        $('#myVideoNextBtn').css({'display' : ''});
        $('#myVideoStopBtn').css({'display' : ''});
        $('#myVideoStatus').html(playbackVideo);
		waitingWS = false;
		
        setTimeout(function(){
            myVideoStatusRequest();
        },3000);
    } else {
        currentVideoTrack = null;
		waitingWS = false;
        $('#myVideoStatus').html('Failed to play...');
        $('#myVideoList').css({'visibility' : 'visible'});
        myVideoListScrollUpDown('other');
        clearInterval(intervalVideoPlayer);
    }
	
	writeLog("myVideoStartResponse end");
}

/* playback status request / response
==========================================================================================================*/
function myVideoStatusRequest(){
	//writeLog("myVideoStatusRequest called");
	
    myVideoWs('playback-status');
	
	//writeLog("myVideoStatusRequest end");
}

function myVideoStatusResponse(data){
	//writeLog("myVideoStatusResponse called");
    if(data > 0){                           // still playing
		writeLog("myVideoStatusResponse video still playing");
        if(currentVideoTrack !== null){
            setTimeout(function(){
                myVideoStatusRequest();
            },3000);
        }
    } else {
		writeLog("myVideoStatusResponse video Ended");
        if(currentVideoTrack !== null){
            myVideoNextRequest();
        }
    }
	//writeLog("myVideoStatusResponse end");
}

/* playback next track request / response
==========================================================================================================*/
function myVideoNextRequest(){
    writeLog("myVideoNextRequest called");
	
    clearInterval(intervalVideoPlayer);
    myVideoWs('playback-next');
	
    writeLog("myVideoNextRequest end");
}

function myVideoNextResponse(){
	writeLog("myVideoNextResponse called");
	
	if (!waitingWS)
	{
		var nextVideoTrack=0;
		
		if(playbackRepeat)
		{
			nextVideoTrack = currentVideoTrack;
		} 
		else 
		{
			if (Shuffle)
			{
				var prevVideoTrack = currentVideoTrack;
				currentVideoTrack = Math.floor(Math.random() * totalVideos) -1;
				
				while (prevVideoTrack === currentVideoTrack)
				{
					currentVideoTrack = Math.floor(Math.random() * totalVideos) -1;
				}
			}
			
			nextVideoTrack = currentVideoTrack + 1;
		}
		
		writeLog("myVideoNextResponse select next track");
		
		var nextVideoObject = $(".videoTrack:eq(" + nextVideoTrack + ")");
		if(nextVideoObject.length !== 0){
			myVideoStartRequest(nextVideoObject);
		} else {
			myVideoStopRequest();
		}
	}
	
	writeLog("myVideoNextResponse end");
}

/* stop playback request / response
==========================================================================================================*/
function myVideoStopRequest(){
	writeLog("myVideoStopRequest called");
	
    myVideoWs('playback-stop');
	$('#myVideoList').css({'visibility' : 'visible'});
	myVideoListScrollUpDown('other');
	
	writeLog("myVideoStopRequest end");
}

function myVideoStopResponse(){
	writeLog("myVideoStopResponse called");
	
    currentVideoTrack = null;
    $('#myVideoNextBtn').css({'display' : 'none'});
    $('#myVideoStopBtn').css({'display' : 'none'});
    $('#myVideoStatus').css({'display' : 'none'});
	
	writeLog("myVideoStopResponse clearInterval intervalVideoPlayer - " + framework.getCurrentApp());
	clearInterval(intervalVideoPlayer);
	
	writeLog("myVideoStopResponse end");
}


/* write log
==========================================================================================================*/
function writeLog(logText){
    if (enableLog === true)
    {
        var dt = new Date();
        myVideoWs('write_log#' + logText);
        console.log('write_log#' + dt.toISOString() + " " + dt.getMilliseconds() + "; " + logText);
    }
}


/* websocket
============================================================================================= */
function myVideoWs(action){
    var ws = new WebSocket('ws://127.0.0.1:55555/');
    ws.onmessage = function(event){
        var res = event.data.split('#');
        //var resType = res[0];
        //var resData = res[1];
		
        switch(res[0]){
		case 'playback-list':   myVideoListResponse(res[1], res[2]);
								break;
		case 'playback-start':  myVideoStartResponse(res[1]);
								break;
		case 'playback-stop':   myVideoStopResponse();
								break;
		case 'playback-status': myVideoStatusResponse(res[1]);
								break;
		case 'playback-next':   myVideoNextResponse();
								break;
	}
        
	ws.close();
	ws=null;
		
    };
    ws.onopen = function(){
        ws.send(action);
    };
	
}

// #############################################################################################
// End of Video Player

