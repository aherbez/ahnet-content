(function () {
    'use strict';
    window.sendToJavaScript('game:loadStart')
    window.sendToJavaScript(['game:loadProgress', 0]);
    document.querySelector('canvas#gameCanvas').style.visibility = 'hidden';

    loadSettings();
    function loadSettings() 
    {
        var settingsScript = document.createElement('script');
        settingsScript.async = true;
        settingsScript.src = window.Lumos.gamevars.game_resources_url + 'src/settings.js';
        var settingsLoaded = function()
        {
            document.body.removeChild(settingsScript);
            settingsScript.removeEventListener('load', settingsLoaded, false);
            loadScripts();
        }
        settingsScript.addEventListener('load', settingsLoaded, false);
        document.body.appendChild(settingsScript);
    }
    function loadScripts()
    {
        var cocos2d = document.createElement('script');
        cocos2d.async = true;
        cocos2d.src = window.Lumos.gamevars.game_resources_url + (window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
        var engineLoaded = function() 
        {
            console.log("engine loaded");
            document.body.removeChild(cocos2d);
            cocos2d.removeEventListener('load', engineLoaded, false);
            // After the engine is loaded, load the game.
            var gameScriptName = 'src/' + (window._CCSettings.debug ? 'project.dev.js' : 'project.js');
            var gameCode = document.createElement('script');
            gameCode.async = true;
            gameCode.src = window.Lumos.gamevars.game_resources_url + gameScriptName;
            
            var gameLoaded = function() 
            {
                console.log("game loaded");
                document.body.removeChild(gameCode);
                gameCode.removeEventListener('load', gameLoaded, false);
                boot();
            }
            gameCode.addEventListener('load', gameLoaded, false);
            document.body.appendChild(gameCode);
        };
        cocos2d.addEventListener('load', engineLoaded, false);
        document.body.appendChild(cocos2d);
    }
    function boot() 
    {
        console.log("boot");
        var settings = window._CCSettings;
        window._CCSettings = undefined;
        if ( !settings.debug ) {
            var uuids = settings.uuids;

            var rawAssets = settings.rawAssets;
            var assetTypes = settings.assetTypes;
            var realRawAssets = settings.rawAssets = {};
            for (var mount in rawAssets) {
                var entries = rawAssets[mount];
                var realEntries = realRawAssets[mount] = {};
                for (var id in entries) {
                    var entry = entries[id];
                    var type = entry[1];
                    // retrieve minified raw asset
                    if (typeof type === 'number') {
                        entry[1] = assetTypes[type];
                    }
                    // retrieve uuid
                    realEntries[uuids[id] || id] = entry;
                }
            }
            
            var scenes = settings.scenes;
            for (var i = 0; i < scenes.length; ++i) {
                var scene = scenes[i];
                if (typeof scene.uuid === 'number') {
                    scene.uuid = uuids[scene.uuid];
                }
            }
            var packedAssets = settings.packedAssets;
            for (var packId in packedAssets) {
                var packedIds = packedAssets[packId];
                for (var j = 0; j < packedIds.length; ++j) {
                    if (typeof packedIds[j] === 'number') {
                        packedIds[j] = uuids[packedIds[j]];
                    }
                }
            }
        }

        var calculateTotalAssetsToLoad = function()
        {
            var assetsCount = Object.keys( settings.rawAssets.assets ).length;
            for( var key in settings.packedAssets )
            {
                // check if the property/key is defined in the object itself, not in parent
                if( settings.packedAssets.hasOwnProperty( key ) )
                {
                    var nestedDictLength = Object.keys( settings.packedAssets[ key ] ).length;
                    assetsCount += nestedDictLength;
                }
            }
            return assetsCount;
        };

        // init engine
        var canvas = document.getElementById( 'gameCanvas' );
        cc.game.EVENT_GAME_CANVAS_BLUR = "game_canvas_blur";
        canvas.addEventListener("blur", function () { cc.game.emit(cc.game.EVENT_GAME_CANVAS_BLUR, cc.game); }, !1);
        canvas.addEventListener("focus", function () { cc.game.emit(cc.game.EVENT_SHOW, cc.game); }, !1);

        function setLoadingDisplay()
        {
            var myCompletedCount = 0;
            var lastProgress = 0;
            var myTotalCount = calculateTotalAssetsToLoad();
            var loadedAssets = {};
            cc.loader.onProgress =
                function( completedCount, totalCount, item )
                {
                    if( !loadedAssets.hasOwnProperty( item.rawUrl ) )
                    {
                        myCompletedCount++;
                        loadedAssets[ item.rawUrl ] = 1;
                    }
                    if( window.sendToJavaScript )
                    {
                        var progress = ( myCompletedCount * 1.0 ) / myTotalCount * 1.0;
                        if( totalCount == 1 && completedCount == 1 )
                        {
                            progress = 0;
                        } // hack: the first load is the manifest and will be 1/1'
                        if( progress <= 1.0 && progress >= lastProgress )
                        {
                            window.sendToJavaScript( [ "game:loadProgress", progress ] );
                            lastProgress = progress;
                        }
                    }
                };
        }

        var onStart = function () 
        {
            console.log("onStart");
            cc.view.resizeWithBrowserSize(true);
            // UC browser on many android devices have performance issue with retina display
            if (cc.sys.os !== cc.sys.OS_ANDROID || cc.sys.browserType !== cc.sys.BROWSER_TYPE_UC) 
            {
                cc.view.enableRetina(true);
            }
            setLoadingDisplay();
            // init assets
            cc.AssetLibrary.init(
            {
                libraryPath: window.Lumos.gamevars.game_resources_url + 'res/import',
                rawAssetsBase: window.Lumos.gamevars.game_resources_url + 'res/raw-',
                rawAssets: settings.rawAssets,
                packedAssets: settings.packedAssets
            });
            var launchScene = settings.launchScene;
            // load scene
            if (cc.runtime) 
            {   
                cc.director.setRuntimeLaunchScene(launchScene);
            }
            cc.director.loadScene(launchScene, null,
                function () {}
            );
        };
        // jsList
        var jsList = settings.jsList;
        if(jsList) 
        { 
            jsList = jsList.map(function (x) { return 'src/' + x; });
        }
        var option = {
            id: 'gameCanvas',
            scenes: settings.scenes,
            debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
            showFPS: settings.debug,
            frameRate: 60,
            jsList: jsList,
            groupList: settings.groupList,
            collisionMatrix: settings.collisionMatrix,
            renderMode: 0
        };

        var retrieveSavedUserData = function()
        {
            var baseUrl = "/api/v2/games/";
            var gameSlug = window.Lumos.gamevars.game_param;
            var GAME_SETTINGS_ENDPOINT = "/game_setting";
        
            var combinedUrl = baseUrl + gameSlug + GAME_SETTINGS_ENDPOINT;
            
            var xhr = new XMLHttpRequest();
            xhr.open("GET", combinedUrl, false); // HACK: THIS IS SYNCHRONOUS
            xhr.onload = function () 
            {
                var result = JSON.parse(xhr.responseText);
                
                if (xhr.readyState == 4 && xhr.status == "200") 
                {
                    console.log("Retrieved saved user data: " + result);
                    window.Lumos.gamevars.savedUserData = result;
                } 
                else 
                {
                    console.error("Failed to load saved user data: " + result);
                }
            }
            xhr.send();
        };
        retrieveSavedUserData();

        cc.game.run(option, onStart);
    }
})();
