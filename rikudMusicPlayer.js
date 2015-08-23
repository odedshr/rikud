"using strict";
(function additionalScripts() {
    var addStyle = function (src) {
            var link = document.createElement( "link" );
            link.href = src;
            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen,print";
            document.getElementsByTagName( "head" )[0].appendChild( link );
        },
        addScript = function addScript (src) {
            var tag = document.createElement("script");
            tag.setAttribute("type","text/javascript");
            tag.src = src;
            document.getElementsByTagName("head")[0].appendChild(tag);
            return tag;
        },
        getSpeedParams = function getSliderParams (value) {
            return {
                range: "min",
                min: 50,
                max: 110,
                value: value,
                slide: onSpeedSlide
            }
        },
        //////////////////////////////////////
        onSpeedSlide = function onSlide ( event, ui ) {
            var value = ui.value;
            dAudio.playbackRate = value/100;
            dSpeed.value = ui.value;
        },
        refreshSpeedBar = function refreshSpeedBar () {
            var value = dSpeed.value;
            dAudio.playbackRate = value/100;
            jSpeedBar.slider(getSpeedParams(value));
        },
        ///////////////////////////////////
        setObjectSize = function setObjectSize (obj,size) {
            obj.style.height= (size/1)+"px";
            obj.style.width= (size/1)+"px";
        },
        updateProgress = function updateProgress () {
            var currentProgress= dAudio.currentTime/dAudio.duration,
                offsetProgress = (dAudio.currentTime-dStart.value)/dAudio.duration;
            jCurrentProgress.width ((offsetProgress*100)+"%");
            setObjectSize(dLeftWheel, minWheelSize + (currentProgress)*(maxWheelExpandSize) );
            setObjectSize(dRightWheel, maxWheelSize - (currentProgress)*(maxWheelExpandSize) );
        },

        getProgressBarParams = function getProgressBarParams (start, end) {
            return {
                range: true,
                values: [start,end],
                slide: onSlide
            }
        },
        refreshProgressBar = function refreshProgressBar () {
            var startValue = dStart.value ? dStart.value*100/dAudio.duration : 0,
                endValue = dEnd.value ? dEnd.value*100/dAudio.duration : 100,
                currentProgress= Math.min (((dAudio.currentTime-startValue)/dAudio.duration), 0);
            jCurrentProgress = $('<span class="progress-current"id="progress-current" style="left:'+currentProgress+'%"></span>');
            jProgressBar.slider(getProgressBarParams(startValue,endValue));
            jProgressBar.prepend(jCurrentProgress);
        },
        onSlide = function onSlide ( event, ui ) {
            var startPosition = (ui.values[ 0 ] * progressbarWidth / 100),
                currentProgress= Math.min ((dAudio.currentTime-startPosition)/dAudio.duration, 0);

            dStart.value = (ui.values[ 0 ] * dAudio.duration / 100).toFixed(2);
            dEnd.value = (ui.values[ 1 ]  * dAudio.duration / 100).toFixed(2);
            jCurrentProgress.css("left",startPosition+"px").width ((currentProgress*100)+"%");
        },
        startWheelAnimation = function startWheelAnimation () {
            jWheelAnimation.addClass("wheel-animation-play");
        },
        stopWheelAnimation = function stopWheelAnimation () {
            jWheelAnimation.removeClass("wheel-animation-play");
        },
        //////////////////////////////////////

        minWheelSize = 125, maxWheelSize = 287, maxWheelExpandSize = (maxWheelSize - minWheelSize),
        progressbarWidth = 0,
        jSpeedBar = null,
        jProgressBar = null,
        jCurrentProgress = null,
        jWheelAnimation = null,
        dLeftWheel = document.getElementById("wheel-left"),
        dRightWheel = document.getElementById("wheel-right"),
        dAudio = document.getElementById("audio"),
        dSpeed = document.getElementById("speed"),
        dStart = document.getElementById("start"),
        dEnd = document.getElementById("end"),
        loadExtensions = function loadExtensions () {
            addScript ("lib/jquery.js").onload = function onJQueryLoaded () {
                jWheelAnimation = $(".wheel-animation");
                document.addEventListener("play", startWheelAnimation);
                document.addEventListener("pause", stopWheelAnimation);

                addScript ("lib/jquery-ui/jquery-ui.min.js").onload = function onJQueryUILoaded () {
                    (function replaceProgressBar () {
                        jProgressBar = $('<div id="progressbar" class="progress-bar"></div>');
                        $("#progressBar").replaceWith(jProgressBar);
                        dStart.onblur = refreshProgressBar;
                        dEnd.onblur = refreshProgressBar;
                        refreshProgressBar();
                        updateProgress();
                        progressbarWidth = jProgressBar.width();

                        document.addEventListener("playing", updateProgress);
                    })();

                    (function replaceSpeedBar () {
                        jSpeedBar = $('<div id="speedBar" class="speed-bar"></div>');
                        $("#speedBar").replaceWith(jSpeedBar);
                        document.addEventListener("speed",refreshSpeedBar);
                        refreshSpeedBar();

                    })();
                };

                (function addDropboxExtension () {
                    var dropboxScript = addScript("https://www.dropbox.com/static/api/2/dropins.js");
                    dropboxScript.id = "dropboxjs";
                    dropboxScript.setAttribute("data-app-key","gtgt6pn5omtw4qc");
                    dropboxScript.onload = function onDropBoxLoaded () {
                        var dFile = document.getElementById("file"),
                            button = document.createElement("button"),
                            dropboxOptions = {
                                success: function(files) {
                                    dFile.value = files[0].link;
                                    dFile.onchange();
                                },
                                cancel: function() {},
                                linkType: "preview", // or "direct"
                                multiselect: false, // or true
                                extensions: ['.mp3', '.m4a', '.wav']
                            },
                            onDropboxButtonClicked = function () {
                                Dropbox.choose(dropboxOptions);
                            };
                        button.onclick = onDropboxButtonClicked;
                        button.className = "button dropbox";
                        dFile.className += " withBrowse";
                        document.getElementById("buttons").appendChild(button);
                    }
                })();
            };
            addStyle ("remote.css");
            addStyle ("lib/jquery-ui/jquery-ui.min.css");

            document.getElementById("body").className += " remote";
        };

        window.setTimeout(loadExtensions, 1);
})();