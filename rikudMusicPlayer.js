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

        //////////////////////////////////////

        minWheelSize = 125, maxWheelSize = 287, maxWheelExpandSize = (maxWheelSize - minWheelSize),
        progressbarWidth = 0,
        jSpeedBar = null,
        jProgressBar = null,
        jCurrentProgress = null,
        jWheelAnimation = null,

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
                    var onDropBoxLoaded = function onDropBoxLoaded () {
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
                    };

                    if (document.getElementById("dropboxjs")) {
                        var dropboxScript = addScript("https://www.dropbox.com/static/api/2/dropins.js");
                        dropboxScript.id = "dropboxjs";
                        dropboxScript.setAttribute("data-app-key","gtgt6pn5omtw4qc");
                        dropboxScript.onload = onDropBoxLoaded;
                    } else {
                        onDropBoxLoaded();
                    }
                })();

                (function addYoutubeExtension () {
                    var checkForYoutubeURL =
                    document.addEventListener("setFile",checkForYoutubeURL);
                    if (location.href.indexOf("//www.youtube.com/")>-1 || location.href.indexOf("//youtu.be/")>-1) {

                    }
                })();
            };
            addStyle ("graphics.css");
            addStyle ("lib/jquery-ui/jquery-ui.min.css");

            document.getElementById("body").className += " remote";
        };

        window.setTimeout(loadExtensions, 1);
})();