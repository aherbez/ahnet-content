require = function() {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function(r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
}()({
  AndroidAppInterface: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "997eaXqZOdOhqjqzbBysbd6", "AndroidAppInterface");
    "use strict";
    var AppInterface = require("AppInterface");
    var AndroidAppInterface = cc.Class({
      extends: AppInterface,
      applicationInit: function applicationInit() {
        try {
          var class_Cocos3GameActivity = "com/lumoslabs/lumosity/activity/Cocos3GameActivity";
          var game_parameters = jsb.reflection.callStaticMethod(class_Cocos3GameActivity, "getGameParameters", "()Ljava/lang/String;");
          game_parameters && (this.parameters = JSON.parse(game_parameters));
        } catch (e) {}
      },
      applicationLoadComplete: function applicationLoadComplete() {},
      applicationBegin: function applicationBegin() {},
      applicationPause: function applicationPause() {},
      applicationResume: function applicationResume() {},
      applicationQuit: function applicationQuit() {
        this.scheduleOnce(function() {
          cc.director.end();
        }, .1);
      },
      applicationComplete: function applicationComplete(dataHash) {
        try {
          var class_Cocos3GameActivity = "com/lumoslabs/lumosity/activity/Cocos3GameActivity";
          jsb.reflection.callStaticMethod(class_Cocos3GameActivity, "setGameResult", "(Ljava/lang/String;)V", JSON.stringify(dataHash));
        } catch (e) {}
      },
      applicationHeartbeat: function applicationHeartbeat(dataHash) {}
    });
    module.exports = AndroidAppInterface;
    cc._RF.pop();
  }, {
    AppInterface: "AppInterface"
  } ],
  AnimationPauseManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c37c6389o1CUruW5WHBYd97", "AnimationPauseManager");
    "use strict";
    var AnimationPauseManager = cc.Class({
      properties: {
        _animations: null,
        _prePausedAnimations: null
      },
      ctor: function ctor() {
        this._animations = [];
        this._prePausedAnimations = [];
      },
      addAnimation: function addAnimation(animation) {
        var i = this._animations.indexOf(animation);
        -1 == i && this._animations.push(animation);
      },
      removeAnimation: function removeAnimation(animation) {
        var i = this._animations.indexOf(animation);
        -1 != i && this._animations.splice(i, 1);
        i = this._prePausedAnimations.indexOf(animation);
        -1 != i && this._prePausedAnimations.splice(i, 1);
      },
      pauseAnimations: function pauseAnimations() {
        var i;
        var animation;
        var animator;
        var animationState;
        for (i = 0; i < this._animations.length; i++) {
          animation = this._animations[i];
          animator = animation._animator;
          null != animator && (animator.isPaused ? this._prePausedAnimations.push(animation) : animation.pause());
        }
      },
      resumeAnimations: function resumeAnimations() {
        var i;
        var animation;
        var index;
        for (i = 0; i < this._animations.length; i++) {
          animation = this._animations[i];
          index = this._prePausedAnimations.indexOf(animation);
          -1 == index && animation.resume();
        }
        this._prePausedAnimations.length = 0;
      }
    });
    AnimationPauseManager._instance = null;
    AnimationPauseManager.getInstance = function() {
      null === AnimationPauseManager._instance && (AnimationPauseManager._instance = new AnimationPauseManager());
      return AnimationPauseManager._instance;
    };
    module.exports = AnimationPauseManager;
    cc._RF.pop();
  }, {} ],
  AnimationPauseTracker: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee0b7Ov8X5PvbMXjNMS4DkR", "AnimationPauseTracker");
    "use strict";
    var AnimationPauseManager = require("AnimationPauseManager");
    var AnimationPauseTracker = cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        var animation = this.getComponent(cc.Animation);
        null != animation && AnimationPauseManager.getInstance().addAnimation(animation);
      },
      onDestroy: function onDestroy() {
        var animation = this.getComponent(cc.Animation);
        null != animation && AnimationPauseManager.getInstance().removeAnimation(animation);
      }
    });
    module.exports = AnimationPauseTracker;
    cc._RF.pop();
  }, {
    AnimationPauseManager: "AnimationPauseManager"
  } ],
  AnimationView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ac429KHJpxKb7ZcyEvFWDMl", "AnimationView");
    "use strict";
    var SceneNodeView = require("SceneNodeView");
    var DebugUtil = require("DebugUtil");
    var AnimationView = cc.Class({});
    AnimationView.isVerbose = false;
    AnimationView.verboseObject = null;
    AnimationView._states = new Map();
    AnimationView._isCompletes = new Map();
    AnimationView._startTimes = new Map();
    AnimationView._speeds = new Map();
    AnimationView._owners = [];
    AnimationView._animators = [];
    AnimationView._nullInfo = null;
    AnimationView.format = function(prefix, animatorOwner, state) {
      return prefix + SceneNodeView.getAddress(animatorOwner) + ": " + state;
    };
    AnimationView.getState = function(animatorOwner) {
      return AnimationView._states.has(animatorOwner) ? AnimationView._states.get(animatorOnwer) : null;
    };
    AnimationView.setState = function(animatorOwner, state, isRestart, isSimulate, isTrigger) {
      if (null == animatorOwner) {
        DebugUtil.log("Tried to set state " + state + " on null animatorOwner");
        return false;
      }
      "undefined" === typeof isRestart && (isRestart = false);
      "undefined" === typeof isSimulate && (isSimulate = false);
      "undefined" === typeof isTrigger && (isTrigger = false);
      var isChange = false;
      var animator = animatorOwner.getComponent(cc.Animation);
      if (null != animator && (animator.isInitialized || isSimulate)) {
        if (isTrigger) {
          console.log("AnimationView.setState: trigger not supported");
          return;
        }
        if (isRestart) {
          isChange = true;
          animator.play(state, 0);
        } else if (!isSimulate) {
          isChange = !AnimationView._states.has(animatorOwner) || AnimationView._states.get(animatorOwner) != state;
          animator.play(state);
        }
        if (isChange || isSimulate) {
          if (AnimationView.isVerbose || AnimationView.verboseObject === animatorOwner) {
            var message = AnimationView.format("AnimationView.SetState: ", animatorOwner, state);
            DebugUtil.log(message);
          }
          AnimationView._isCompletes.set(animatorOwner, false);
          AnimationView._startTimes.set(animatorOwner, new Date().getTime());
        }
        AnimationView._states.set(animatorOwner, state);
        if (AnimationView._owners.indexOf(animatorOwner) <= -1) {
          AnimationView._owners.push(animatorOwner);
          AnimationView._animators.push(animator);
        }
      } else null == animator && DebugUtil.log(AnimationView.format("AnimationView.SetState: Does animator exist? ", animatorOwner, state));
      return isChange;
    };
    AnimationView.play = function(animatorOwner, animationName) {
      animatorOwner.getComponent(cc.Animation).play(animationName);
    };
    AnimationView.setTrigger = function(animatorOwner, state) {
      console.log("[AnimationView] setTrigger not supported");
    };
    AnimationView.setTriggers = function(animatorOwners, name) {
      return;
    };
    AnimationView.completedNow = function(animatorOwner, layer) {
      return false;
    };
    AnimationView.stop = function(animatorOwner) {
      var animation = animatorOnwer.getComponent(cc.Animation);
      null != animation && animation.stop();
    };
    AnimationView.pauseAllExcluding = function(excludes) {
      "undefined" === typeof excludes && (excludes = null);
      for (var index = 0; index < AnimationView._owners.length; index++) {
        var owner = AnimationView._owners[index];
        var animator = AnimationView._animators[index];
        if (null == owner || null == animator) continue;
        (null == excludes || excludes.indexOf(owner) <= -1) && animator.pause();
      }
    };
    AnimationView.resumeAllExcluding = function(excludes) {
      "undefined" === typeof excludes && (excludes = null);
      for (var index = 0; index < AnimationView._owners.length; index++) {
        var owner = AnimationView._owners[index];
        var animator = AnimationView._animators[index];
        if (null == owner || null == animator) continue;
        (null == excludes || excludes.indexOf(owner) <= -1) && animator.resume();
      }
    };
    module.exports = AnimationView;
    cc._RF.pop();
  }, {
    DebugUtil: "DebugUtil",
    SceneNodeView: "SceneNodeView"
  } ],
  AppInterface: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9cc680iNu1BzLQHXbCrpZYT", "AppInterface");
    "use strict";
    var AppInterface = cc.Class({
      extends: cc.Component,
      properties: {
        parameters: null
      },
      setParameters: function setParameters() {
        throw new Error("must implement setParameters in derived class");
      },
      applicationInit: function applicationInit() {
        throw new Error("must implement applicationInit in derived class");
      },
      applicationLoadComplete: function applicationLoadComplete() {
        throw new Error("must implement applicationLoadComplete in derived class");
      },
      applicationBegin: function applicationBegin() {
        throw new Error("must implement applicationBegin in derived class");
      },
      applicationPause: function applicationPause() {
        throw new Error("must implement applicationPause in derived class");
      },
      applicationResume: function applicationResume() {
        throw new Error("must implement applicationResume in derived class");
      },
      applicationQuit: function applicationQuit() {
        throw new Error("must implement applicationQuit in derived class");
      },
      applicationComplete: function applicationComplete(dataHash) {
        throw new Error("must implement applicationComplete in derived class");
      },
      applicationHeartbeat: function applicationHeartbeat(dataHash) {
        throw new Error("must implement applicationHeartbeat in derived class");
      },
      loadAsset: function loadAsset(path, extension, cb) {
        "string" === typeof extension && extension.length > 0 && "." !== extension.charAt(0) && (extension = "." + extension);
        var url = cc.url.raw("resources/" + path + extension);
        cc.loader.load(url, function(err, result) {
          if (err) {
            cc.error("LumosAppInterface failed to load the asset found at resources/" + url + " .\n" + err);
            cb(void 0);
          } else cb(result);
        });
      }
    });
    module.exports = AppInterface;
    cc._RF.pop();
  }, {} ],
  AudioManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "93fc0ujYQpKFKjBEGh97fbD", "AudioManager");
    "use strict";
    var _cc$Class;
    function _defineProperty(obj, key, value) {
      key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    var AudioManager = cc.Class((_cc$Class = {
      extends: cc.Component,
      properties: {
        _backgroundAudioSources: {
          default: [],
          type: [ cc.AudioSource ],
          visible: true
        },
        _sfxAudioSources: {
          default: [],
          type: [ cc.AudioSource ],
          visible: true
        },
        _isBackgroundEnabled: true,
        _isSFXEnabled: true
      },
      onLoad: function onLoad() {
        AudioManager._instance = this;
      },
      init: function init(enableBackgroundAudio, enableSFXAudio) {
        this.configure(enableBackgroundAudio, enableSFXAudio);
      },
      configure: function configure(enableBackgroundAudio, enableSFXAudio) {
        this._isBackgroundEnabled = enableBackgroundAudio;
        this._isSFXEnabled = enableSFXAudio;
        this._setSourcesEnabled(this._backgroundAudioSources, this._isBackgroundEnabled);
        this._setSourcesEnabled(this._sfxAudioSources, this._isSFXEnabled);
      },
      _setSourceEnabled: function _setSourceEnabled(source, isEnabled) {
        source.mute = source.isMuted = !isEnabled;
        if (null === source.audio._element && source.defaultOnLoad) {
          source.defaultOnLoad = source.onLoad;
          source.onLoad = function() {
            this.defaultOnLoad && this.defaultOnLoad();
            this.mute = this.isMuted;
          }.bind(source);
        }
        if (void 0 === source.defaultClip) {
          var clip = Object.getOwnPropertyDescriptor(cc.AudioSource.prototype, "clip");
          Object.defineProperty(source, "defaultClip", clip);
          Object.defineProperty(source, "clip", {
            get: function get() {
              return this.defaultClip;
            },
            set: function set(val) {
              this.defaultClip = "";
              this.defaultClip = val;
              this.mute = this.isMuted;
            },
            configurable: true
          });
        }
      },
      _setSourcesEnabled: function _setSourcesEnabled(sources, isEnabled) {
        var source;
        var i;
        for (i = 0; i < sources.length; i++) {
          source = sources[i];
          this._setSourceEnabled(source, isEnabled);
        }
      },
      addSFXAudioSource: function addSFXAudioSource(source) {
        this._setSourceEnabled(source, this._isSFXEnabled);
        this._sfxAudioSources.push(source);
      },
      addSFXAudioSources: function addSFXAudioSources(sources) {
        this._setSourcesEnabled(sources, this._isSFXEnabled);
        this._sfxAudioSources = this._sfxAudioSources.concat(sources);
      },
      addBackgroundAudioSource: function addBackgroundAudioSource(source) {
        this._setSourceEnabled(source, this._isBackgroundEnabled);
        this._isBackgroundEnabled.push(source);
      }
    }, _defineProperty(_cc$Class, "addBackgroundAudioSource", function addBackgroundAudioSource(sources) {
      this._setSourcesEnabled(sources, this._isBackgroundEnabled);
      this._backgroundAudioSources = this._backgroundAudioSources.concat(sources);
    }), _defineProperty(_cc$Class, "removeSFXAudioSources", function removeSFXAudioSources(sources) {
      var i;
      var index;
      var total = sources.length;
      for (i = 0; i < total; i++) this.removeSFXAudioSource(sources[i]);
    }), _defineProperty(_cc$Class, "removeSFXAudioSource", function removeSFXAudioSource(source) {
      var index = this._sfxAudioSources.indexOf(source);
      -1 != index && this._sfxAudioSources.splice(index, 1);
    }), _defineProperty(_cc$Class, "removeBackgroundAudioSources", function removeBackgroundAudioSources(sources) {
      var i;
      var index;
      var total = sources.length;
      for (i = 0; i < total; i++) this.removeBackgroundAudioSource(sources[i]);
    }), _defineProperty(_cc$Class, "removeBackgroundAudioSource", function removeBackgroundAudioSource(source) {
      var index = this._backgroundAudioSources.indexOf(source);
      -1 != index && this._backgroundAudioSources.splice(index, 1);
    }), _cc$Class));
    AudioManager._instance = null;
    AudioManager.getInstance = function() {
      if (null == AudioManager._instance) {
        cc.error("AudioManager::getInstance _instance is null. Make sure AudioManager exists in scene. Please see the AudioManager documentation for more details.");
        var message = "AudioManager._instance is not initialized.";
        var node = cc.find("AudioManager");
        null == node ? message += " The Node with attached 'AudioManager' component is null or undefined: " + node : node.active ? message += " The Node with attached 'AudioManager' exists in the scene and is active. This may mean that AudioManager onLoad has not been called." : message += " The Node with attached 'AudioManager' is not active in the scene: " + node.active;
        AudioManager._instance = new AudioManager();
        throw new Error(message);
      }
      return AudioManager._instance;
    };
    module.exports = AudioManager;
    cc._RF.pop();
  }, {} ],
  BaseController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54b62f13ndK/YC0KF5wdeiX", "BaseController");
    "use strict";
    var BaseView = require("BaseView");
    var BaseSettings = require("BaseSettings");
    var BaseUIController = require("BaseUIController");
    var BaseState = require("BaseState");
    var LumosAppInterface = require("LumosAppInterface");
    var BaseTitleScreenController = require("BaseTitleScreenController");
    var BaseEndScreenController = require("BaseEndScreenController");
    var BaseStageController = require("BaseStageController");
    var BaseTutorialController = require("BaseTutorialController");
    var AnimationPauseManager = require("AnimationPauseManager");
    var LumosAppUtil = require("LumosAppUtil");
    var AudioManager = require("AudioManager");
    var LumosRandom = require("LumosRandom");
    var HeartbeatController = require("HeartbeatController");
    var BaseController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: {
          default: null,
          type: BaseView,
          visible: true
        },
        _settings: {
          default: null,
          type: BaseSettings,
          visible: true
        },
        _uiController: {
          default: null,
          type: BaseUIController,
          visible: true
        },
        _titleScreenController: {
          default: null,
          type: BaseTitleScreenController,
          visible: true
        },
        _endScreenController: {
          default: null,
          type: BaseEndScreenController,
          visible: true
        },
        _stageController: {
          default: null,
          type: BaseStageController,
          visible: true
        },
        _tutorialController: {
          default: null,
          type: BaseTutorialController,
          visible: true
        },
        _prevState: 0,
        _currState: 0,
        _model: null,
        _metadataController: null,
        _heartbeatController: null
      },
      _createModel: function _createModel() {
        throw new Error("must implement createModel in derived class");
      },
      _createMetadataController: function _createMetadataController() {
        throw new Error("must implement createMetadataController in derived class");
      },
      onLoad: function onLoad() {
        this._model = this._createModel();
        this._metadataController = this._createMetadataController();
        this._heartbeatController = new HeartbeatController();
      },
      start: function start() {
        LumosAppInterface.getInstance().applicationLoadComplete();
        this._heartbeatController.setMilestone("load_complete");
        this._init();
      },
      _init: function _init() {
        var parameters = LumosAppInterface.getInstance().getParameters();
        this._initModel(parameters);
        this._metadataController.init(this._model);
        this._initUIController();
        this._initAudioManager();
      },
      _initModel: function _initModel(parameters) {
        this._model.seed = Date.now();
        LumosRandom.seed = this._model.seed;
        this._model.bestStatKey = this._settings.bestStatKey;
        this._model.version = this._settings.version;
        this._model.isDebug = LumosAppUtil.isDebugMode(parameters);
        this._model.sessionLevel = LumosAppUtil.getLastSessionLevel(parameters);
        this._model.userLevel = this._model.sessionLevel;
        this._model.userLevel <= 0 ? this._model.isFirstPlay = true : this._model.isFirstPlay = false;
        this._model.savedUserData = LumosAppUtil.getSavedUserData(parameters);
        this._model.startTutorial = LumosAppUtil.isHowToPlay(parameters);
        this._model.defaultLocale = LumosAppUtil.getLocale(parameters);
      },
      _initUIController: function _initUIController() {
        this._uiController.init();
        this._uiController.pauseButtonPressedCallback = this._onPause.bind(this);
        this._uiController.skipTutorialButtonPressedCallback = this._onSkipTutorial.bind(this);
        this._uiController.resumeButtonPressedCallback = this._onResume.bind(this);
        this._uiController.restartButtonPressedCallback = this._onRestart.bind(this);
        this._uiController.tutorialButtonPressedCallback = this._onTutorial.bind(this);
        this._uiController.muteSoundButtonPressedCallback = this._onMuteSound.bind(this);
        this._uiController.hearSoundButtonPressedCallback = this._onHearSound.bind(this);
        this._uiController.pauseMenuInAnimationCompleteCallback = this._onPauseMenuIn.bind(this);
        this._uiController.pauseMenuOutAnimationCompleteCallback = this._onPauseMenuOut.bind(this);
        this._uiController.quitButtonPressedCallback = this._onQuit.bind(this);
        if (this._model.isDebug) {
          this._uiController.onDebugMenuShowCallback = this._onDebugMenuShow.bind(this);
          this._uiController.onDebugMenuHideCallback = this._onDebugMenuHide.bind(this);
          this._uiController.shortGameToggledOnCallback = this._onShortGameOn.bind(this);
          this._uiController.shortGameToggledOffCallback = this._onShortGameOff.bind(this);
          this._uiController.perfectModeToggledOnCallback = this._onPerfectModeOn.bind(this);
          this._uiController.perfectModeToggledOffCallback = this._onPerfectModeOff.bind(this);
          this._uiController.cycleLevelButtonPressedCallback = this._onCycleLevel.bind(this);
          this._uiController.cycleContentButtonPressedCallback = this._onCycleContent.bind(this);
          this._uiController.tutorialToggledOnCallback = this._onTutorialOn.bind(this);
          this._uiController.tutorialToggledOffCallback = this._onTutorialOff.bind(this);
          this._uiController.activateDebugToggle();
        } else this._uiController.deactivateDebugToggle();
      },
      _initAudioManager: function _initAudioManager() {
        AudioManager.getInstance().init(this._model.isMusicEnabled, this._model.isSFXEnabled);
      },
      update: function update(delta) {
        this._model.isPaused || this._tick(delta);
        this._uiController.tick(delta);
      },
      _tick: function _tick(delta) {
        this._metadataController.tick(delta);
        this._heartbeatController.tick(delta);
        this._currState === BaseState.stage ? this._stageController.tick(delta) : this._currState === BaseState.tutorial && this._tutorialController.tick(delta);
      },
      _titleScreenBegin: function _titleScreenBegin() {
        this._changeState(BaseState.titleScreen);
        this._titleScreenController.init();
        this._titleScreenController.onPlayButtonPressedCallback = this._titleScreenPlayButtonPressed.bind(this);
        this._titleScreenController.onTutorialButtonPressedCallback = this._titleScreenTutorialButtonPressed.bind(this);
        this._titleScreenController.onOffAnimationFinishedCallback = this._titleScreenEnd.bind(this);
        this._titleScreenController.show();
        this._heartbeatController.setMilestone("title_screen_begin");
      },
      _titleScreenEnd: function _titleScreenEnd() {},
      _titleScreenPlayButtonPressed: function _titleScreenPlayButtonPressed() {
        this._titleScreenAnyButtonPressed();
      },
      _titleScreenTutorialButtonPressed: function _titleScreenTutorialButtonPressed() {
        this._titleScreenAnyButtonPressed();
      },
      _titleScreenAnyButtonPressed: function _titleScreenAnyButtonPressed() {
        LumosAppInterface.getInstance().applicationBegin();
      },
      _tutorialBegin: function _tutorialBegin() {
        this._changeState(BaseState.tutorial);
        this._heartbeatController.setMilestone("tutorial_begin");
        this._metadataController.tutorialSessionBegin();
        this._model.numTutorialStart++;
      },
      _tutorialAbort: function _tutorialAbort() {
        this._tutorialController.abort();
      },
      _tutorialComplete: function _tutorialComplete() {
        this._heartbeatController.setMilestone("tutorial_complete");
        this._metadataController.tutorialSessionEnd();
        this._model.numTutorialEnd++;
      },
      _stageBegin: function _stageBegin() {
        this._changeState(BaseState.stage);
        this._heartbeatController.setMilestone("stage_begin");
        this._metadataController.sessionBegin();
      },
      _stageAbort: function _stageAbort() {
        this._stageController.abort();
      },
      _stageComplete: function _stageComplete() {
        this._heartbeatController.setMilestone("stage_complete");
        this._metadataController.sessionEnd();
      },
      _endScreenBegin: function _endScreenBegin() {
        this._changeState(BaseState.endScreen);
        this._heartbeatController.setMilestone("end_screen_begin");
        this._endScreenController.init(this._model);
        this._endScreenController.onFinishedCallback = this._endScreenEnd.bind(this);
        this._endScreenController.show();
      },
      _endScreenEnd: function _endScreenEnd() {
        this._applicationComplete();
      },
      _applicationComplete: function _applicationComplete() {
        LumosAppInterface.getInstance().applicationQuit();
      },
      _stageToStage: function _stageToStage() {
        this._stageAbort();
        this._stageBegin();
      },
      _stageToTutorial: function _stageToTutorial() {
        this._stageAbort();
        this._tutorialBegin();
      },
      _tutorialToTutorial: function _tutorialToTutorial() {
        this._tutorialAbort();
        this._tutorialBegin();
      },
      _tutorialToStage: function _tutorialToStage() {
        this._tutorialAbort();
        this._stageBegin();
      },
      _changeState: function _changeState(newState) {
        this._prevState = this._currState;
        this._currState = newState;
      },
      _onPause: function _onPause(lostFocus) {
        this._model.isPaused = true;
        LumosAppInterface.getInstance().applicationPause();
        AnimationPauseManager.getInstance().pauseAnimations();
        this._metadataController.onPause(lostFocus);
        if (this._currState == BaseState.tutorial) {
          this._uiController.hideSkipTutorialButton();
          this._uiController.showPauseButton();
        }
      },
      _onPauseMenuIn: function _onPauseMenuIn() {},
      _onPauseMenuOut: function _onPauseMenuOut() {
        this._model.isPaused = false;
        AnimationPauseManager.getInstance().resumeAnimations();
        this._metadataController.onResume();
      },
      _onSkipTutorial: function _onSkipTutorial() {},
      _onRestart: function _onRestart() {
        this._model.restartCount++;
      },
      _onResume: function _onResume() {
        LumosAppInterface.getInstance().applicationResume();
        if (this._currState == BaseState.tutorial) {
          this._uiController.hidePauseButton();
          this._uiController.showSkipTutorialButton();
        }
      },
      _onBack: function _onBack() {},
      _onTutorial: function _onTutorial() {
        this._currState == BaseState.stage ? this._stageToTutorial() : this._currState == BaseState.tutorial && this._tutorialToTutorial();
      },
      _onQuit: function _onQuit() {
        LumosAppInterface.getInstance().applicationQuit();
      },
      _onMuteSound: function _onMuteSound() {
        this._model.isSFXEnabled = this._model.isMusicEnabled = false;
        AudioManager.getInstance().configure(this._model.isMusicEnabled, this._model.isSFXEnabled);
      },
      _onHearSound: function _onHearSound() {
        this._model.isSFXEnabled = this._model.isMusicEnabled = true;
        AudioManager.getInstance().configure(this._model.isMusicEnabled, this._model.isSFXEnabled);
      },
      _onDebugMenuShow: function _onDebugMenuShow() {},
      _onDebugMenuHide: function _onDebugMenuHide() {},
      _onShortGameOn: function _onShortGameOn() {},
      _onShortGameOff: function _onShortGameOff() {},
      _onPerfectModeOn: function _onPerfectModeOn() {},
      _onPerfectModeOff: function _onPerfectModeOff() {},
      _onCycleLevel: function _onCycleLevel() {},
      _onCycleContent: function _onCycleContent() {},
      _onTutorialOn: function _onTutorialOn() {
        this._model.startTutorial = true;
      },
      _onTutorialOff: function _onTutorialOff() {
        this._model.startTutorial = false;
      },
      onFocusInEditor: function onFocusInEditor() {
        cc.log("Focus");
      }
    });
    module.exports = BaseController;
    cc._RF.pop();
  }, {
    AnimationPauseManager: "AnimationPauseManager",
    AudioManager: "AudioManager",
    BaseEndScreenController: "BaseEndScreenController",
    BaseSettings: "BaseSettings",
    BaseStageController: "BaseStageController",
    BaseState: "BaseState",
    BaseTitleScreenController: "BaseTitleScreenController",
    BaseTutorialController: "BaseTutorialController",
    BaseUIController: "BaseUIController",
    BaseView: "BaseView",
    HeartbeatController: "HeartbeatController",
    LumosAppInterface: "LumosAppInterface",
    LumosAppUtil: "LumosAppUtil",
    LumosRandom: "LumosRandom"
  } ],
  BaseEndScreenController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "98249tZly1GWK+tYJQ2aOVQ", "BaseEndScreenController");
    "use strict";
    var BaseEndScreenView = require("BaseEndScreenView");
    var BaseEndScreenController = cc.Class({
      extends: cc.Component,
      properties: {
        _pressed: false,
        onFinishedCallback: {
          default: null,
          visible: false
        },
        _view: {
          default: null,
          type: BaseEndScreenView,
          visible: true
        }
      },
      init: function init(model) {
        throw new Error("must implement EndScreenController.init in derived class");
      },
      show: function show() {
        this._view.onFinishedCallback = this._handleViewFinished.bind(this);
        this._view.show();
      },
      _handleViewFinished: function _handleViewFinished() {
        if (null != this.onFinishedCallback) {
          this.onFinishedCallback();
          this.onFinishedCallback = null;
        }
      }
    });
    module.exports = BaseEndScreenController;
    cc._RF.pop();
  }, {
    BaseEndScreenView: "BaseEndScreenView"
  } ],
  BaseEndScreenView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bbf8aD3Va9F5YfEgIkWF+cs", "BaseEndScreenView");
    "use strict";
    var BaseEndScreenView = cc.Class({
      extends: cc.Component,
      properties: {
        _pressed: false,
        onFinishedCallback: {
          default: null,
          visible: false
        }
      },
      show: function show() {
        this.node.active = true;
        var animation = this.node.getComponent(cc.Animation);
        animation.play("EndScreenOn");
      },
      hide: function hide() {
        if (true === this._pressed) return;
        this._pressed = true;
        var animation = this.node.getComponent(cc.Animation);
        animation.on("finished", this._handleAnimateOffFinished, this);
        animation.play("EndScreenOff");
      },
      _handleAnimateOffFinished: function _handleAnimateOffFinished() {
        var animation = this.node.getComponent(cc.Animation);
        animation.off("finished", this._onAnimationFinished, this);
        this.node.active = false;
        if (null != this.onFinishedCallback) {
          this.onFinishedCallback();
          this.onFinishedCallback = null;
        }
      }
    });
    module.exports = BaseEndScreenView;
    cc._RF.pop();
  }, {} ],
  BaseMetadataController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c5b00h7syVMeqNe6AXcyhuM", "BaseMetadataController");
    "use strict";
    var Metadata = require("Metadata");
    var ScreenView = require("ScreenView");
    var LumosAppInterface = require("LumosAppInterface");
    var SavedUserDataUtil = require("SavedUserDataUtil");
    var BaseMetadataController = cc.Class({
      properties: {
        metadata: null,
        _model: null,
        hash: null,
        json: ""
      },
      get Session() {
        return void 0 === this.metadata ? null : this.metadata.session;
      },
      ctor: function ctor() {
        this.metadata = new Metadata();
      },
      init: function init(model) {
        this._model = model;
      },
      sessionBegin: function sessionBegin() {
        this._model.width = ScreenView.getWidth();
        this._model.height = ScreenView.getHeight();
        this.nextSession(false);
      },
      setSessionData: function setSessionData(key, value) {
        this.metadata.session[key] = value;
      },
      tick: function tick(deltaTime) {
        this.metadata.update(deltaTime);
      },
      onPause: function onPause(didLoseFocus) {
        this._model.pauseCount++;
        this._model.hasLostFocus = didLoseFocus;
        this._model.hasLostFocus && this._model.defocusCount++;
        this._model.pauseTime = this.metadata.getMilliseconds();
      },
      tutorialSessionBegin: function tutorialSessionBegin() {
        this.nextSession(true);
      },
      setTutorialSessionData: function setTutorialSessionData(key, val) {
        this.metadata.tutorial[key] = val;
      },
      tutorialSessionEnd: function tutorialSessionEnd() {
        this.metadata.tutorial["trial_csv"] = this.metadata.getTrialCSV();
      },
      trialBegin: function trialBegin() {
        this.metadata.startTrial();
      },
      setTrialData: function setTrialData(key, val) {
        this.metadata.trial[key] = val;
      },
      trialEnd: function trialEnd(isCorrect) {
        this.metadata.endTrial(isCorrect);
      },
      responseBegin: function responseBegin() {
        this.metadata.responseBegin();
      },
      setResponseData: function setResponseData(key, val) {
        this.metadata.response[key] = val;
      },
      responseEnd: function responseEnd(correct) {
        this.metadata.responseEnd(correct);
      },
      nextSession: function nextSession(isTutorial) {
        this.metadata.nextSession(isTutorial);
        this._model.pauseInfos = "";
        this._model.pauseCount = 0;
        this._model.defocusCount = 0;
      },
      getCurrentTimeOffset: function getCurrentTimeOffset() {
        return this.metadata.getCurrentTimeOffset();
      },
      onResume: function onResume() {
        var pauseInfo = "";
        "" != this._model.pauseInfos && (pauseInfo += ";");
        var isUser = !this._model.hasLostFocus;
        var now = this.metadata.getMilliseconds();
        var duration = now - this._model.pauseTime;
        this.metadata.trialBeginTime += duration;
        this.metadata.responseBeginTime += duration;
        this.metadata.sessionBeginTime += duration;
        pauseInfo += Math.round(this._model.pauseTime) + ":" + Math.round(now) + ":" + (true === isUser ? "T" : "F");
        this._model.pauseInfos += pauseInfo;
      },
      sessionEnd: function sessionEnd() {
        this.metadata.session["num_defocus"] = this._model.defocusCount;
        this.metadata.session["num_restart"] = this._model.restartCount;
        this.metadata.session["num_pauses"] = this._model.pauseCount;
        this.metadata.session["pauses"] = this._model.pauseInfos;
        this.metadata.session["width"] = this._model.width;
        this.metadata.session["height"] = this._model.height;
        this.metadata.session["locale_id"] = this._model.locale;
        this.metadata.session["default_locale_id"] = this._model.defaultLocale;
        this.metadata.session["version"] = this.getFormattedVersionString(this._model.version);
        this.metadata.session["seed"] = this._model.seed;
        this.metadata.session["tutorial_start"] = this._model.numTutorialStart;
        this.metadata.session["tutorial_finish"] = this._model.numTutorialEnd;
        this.metadata.session["tutorial"] = null === this.metadata.tutorial ? "" : this.metadata.tutorial;
        this.metadata.session["trial_csv"] = this.metadata.getTrialCSV();
        this.metadata.session["response_csv"] = this.metadata.getResponseCSV();
        this.metadata.endGame();
        SavedUserDataUtil.sendSavedUserData(this._model);
        this.hash = this.organize(this.metadata.session);
        this.json = this.report(this.hash);
      },
      organize: function organize(sessionMetadata) {
        var hash = {};
        hash["score"] = this._model.score;
        hash["session_level"] = this._model.sessionLevel;
        hash["user_level"] = this._model.userLevel;
        null != this._model.savedUserData && Object.keys(this._model.savedUserData).length > 0 && (hash["savedUserData"] = this._model.savedUserData);
        hash["game_result_data"] = sessionMetadata;
        hash["gameStats"] = {};
        return hash;
      },
      getFormattedVersionString: function getFormattedVersionString(versionString) {
        var version = 0;
        var formattedVersion = versionString;
        var parts = formattedVersion.split(".");
        for (var i = parts.length - 1; i >= 0; --i) {
          var multiplier = Math.pow(100, i);
          var index = parts.length - (i + 1);
          version += parseInt(parts[index], 10) * multiplier;
        }
        formattedVersion = version > 0 ? version + "" : "";
        return formattedVersion;
      },
      report: function report(hash) {
        var json = JSON.stringify(hash);
        this.metadata.isVerbose && cc.log(json);
        LumosAppInterface.getInstance().applicationComplete(hash);
      }
    });
    module.exports = BaseMetadataController;
    cc._RF.pop();
  }, {
    LumosAppInterface: "LumosAppInterface",
    Metadata: "Metadata",
    SavedUserDataUtil: "SavedUserDataUtil",
    ScreenView: "ScreenView"
  } ],
  BaseModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "da7a71jhXRO05r2Y0eQOQT8", "BaseModel");
    "use strict";
    var BaseModel = cc.Class({
      properties: {
        bestStatKey: "Level",
        isFirstPlay: true,
        isDebug: true,
        startTutorial: false,
        numTutorialStart: 0,
        numTutorialEnd: 0,
        score: 0,
        userLevel: 0,
        stat: 0,
        sessionLevel: 0,
        restartCount: 0,
        pauseCount: 0,
        defocusCount: 0,
        hasLostFocus: false,
        pauseInfos: "",
        pauseTime: -1,
        isPaused: false,
        isMusicEnabled: true,
        isSFXEnabled: true,
        width: -1,
        height: -1,
        locale: "",
        defaultLocale: "",
        version: "",
        seed: "",
        savedUserData: {
          default: {}
        }
      },
      ctor: function ctor() {}
    });
    module.exports = BaseModel;
    cc._RF.pop();
  }, {} ],
  BaseSettings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f49b3Y8OUZNZKlpnCi9prwp", "BaseSettings");
    "use strict";
    var BaseSettings = cc.Class({
      extends: cc.Component,
      properties: {
        bestStatKey: "",
        version: "1.0.0"
      }
    });
    module.exports = BaseSettings;
    cc._RF.pop();
  }, {} ],
  BaseStageController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d443eJ9TuNMNq/oE5ZiREJz", "BaseStageController");
    "use strict";
    var BaseStageModel = require("BaseStageModel");
    var BaseStageView = require("BaseStageView");
    var BaseStageController = cc.Class({
      extends: cc.Component,
      properties: {
        _model: null,
        onCompleteCallback: null
      },
      onLoad: function onLoad() {
        this._model = this._createModel();
      },
      init: function init() {
        throw new error("must override BaseStageController.init() in derived class");
      },
      begin: function begin() {},
      tick: function tick(delta) {
        this._model.elapsedTimeSeconds += delta;
      },
      _finish: function _finish() {},
      abort: function abort() {},
      _cleanup: function _cleanup() {},
      _createModel: function _createModel() {
        throw new error("must override BaseStageController.init() in derived class");
      }
    });
    module.exports = BaseStageController;
    cc._RF.pop();
  }, {
    BaseStageModel: "BaseStageModel",
    BaseStageView: "BaseStageView"
  } ],
  BaseStageModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fc7fdBcYb5E6pwcJS+JPayA", "BaseStageModel");
    "use strict";
    var BaseStageModel = cc.Class({
      properties: {
        elapsedTimeSeconds: 0,
        score: 0
      },
      ctor: function ctor() {},
      clear: function clear() {
        this.elapsedTimeSeconds = 0;
        this.score = 0;
      }
    });
    module.exports = BaseStageModel;
    cc._RF.pop();
  }, {} ],
  BaseStageView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2bbbcEOB9RI9qWcnxtbcYme", "BaseStageView");
    "use strict";
    var BaseStageView = cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {}
    });
    module.exports = BaseStageView;
    cc._RF.pop();
  }, {} ],
  BaseState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "694b0OGEEBLgaVYXfAntS0M", "BaseState");
    "use strict";
    var BaseState = cc.Class({});
    BaseState.titleScreen = "titleScreen";
    BaseState.tutorial = "tutorial";
    BaseState.stage = "stage";
    BaseState.endScreen = "endScreen";
    module.exports = BaseState;
    cc._RF.pop();
  }, {} ],
  BaseTitleScreenController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "22989+cao9PTLW9vrpgtsDd", "BaseTitleScreenController");
    "use strict";
    var BaseTitleScreenView = require("BaseTitleScreenView");
    var BaseTitleScreenController = cc.Class({
      extends: cc.Component,
      properties: {
        onPlayButtonPressedCallback: {
          default: null,
          visible: false
        },
        onTutorialButtonPressedCallback: {
          default: null,
          visible: false
        },
        onOffAnimationFinishedCallback: {
          default: null,
          visible: false
        },
        _view: {
          default: null,
          type: BaseTitleScreenView,
          visible: true
        }
      },
      init: function init() {
        this._view.onPlayButtonPressedCallback = this._handlePlayButtonPressed.bind(this);
        this._view.onTutorialButtonPressedCallback = this._handleTutorialButtonPressed.bind(this);
        this._view.onOffAnimationFinishedCallback = this._handleOffAnimationFinished.bind(this);
      },
      show: function show() {
        this._view.show();
      },
      _handlePlayButtonPressed: function _handlePlayButtonPressed() {
        if (this.onPlayButtonPressedCallback) {
          this.onPlayButtonPressedCallback();
          this.onPlayButtonPressedCallback = null;
        }
      },
      _handleTutorialButtonPressed: function _handleTutorialButtonPressed() {
        if (this.onTutorialButtonPressedCallback) {
          this.onTutorialButtonPressedCallback();
          this.onTutorialButtonPressedCallback = null;
        }
      },
      _handleOffAnimationFinished: function _handleOffAnimationFinished() {
        if (null != this.onOffAnimationFinishedCallback) {
          this.onOffAnimationFinishedCallback();
          this.onOffAnimationFinishedCallback = null;
        }
      }
    });
    module.exports = BaseTitleScreenController;
    cc._RF.pop();
  }, {
    BaseTitleScreenView: "BaseTitleScreenView"
  } ],
  BaseTitleScreenView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "23981/uHvZBdbDH+c1MLP2Q", "BaseTitleScreenView");
    "use strict";
    var BaseTitleScreenView = cc.Class({
      extends: cc.Component,
      properties: {
        _pressed: false,
        _animation: null,
        onPlayButtonPressedCallback: {
          default: null,
          visible: false
        },
        onTutorialButtonPressedCallback: {
          default: null,
          visible: false
        },
        onOffAnimationFinishedCallback: {
          default: null,
          visible: false
        }
      },
      onLoad: function onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
      },
      show: function show() {
        this.node.active = true;
      },
      handlePlayButtonPressed: function handlePlayButtonPressed() {
        if (true === this._pressed) return;
        this._pressed = true;
        if (null != this.onPlayButtonPressedCallback) {
          this.onPlayButtonPressedCallback();
          this.onPlayButtonPressedCallback = null;
        }
        this._buttonPressed();
      },
      handleTutorialButtonPressed: function handleTutorialButtonPressed() {
        if (true === this._pressed) return;
        if (null != this.onTutorialButtonPressedCallback) {
          this.onTutorialButtonPressedCallback();
          this.onTutorialButtonPressedCallback = null;
        }
        this._buttonPressed();
      },
      _buttonPressed: function _buttonPressed() {
        this._pressed = true;
        this._animation.on("finished", this._handleOffAnimationFinished, this);
        this._animation.play();
        this._resumeAudioContext();
      },
      _resumeAudioContext: function _resumeAudioContext() {
        cc && cc.sys && cc.sys.__audioSupport && cc.sys.__audioSupport.context && cc.sys.__audioSupport.context.resume().then(function() {
          console.log("BaseTitleScreenView::_resumeAudioContext Playback resumed successfully.");
        });
      },
      _handleOffAnimationFinished: function _handleOffAnimationFinished() {
        this._animation.off("finished", this._handleOffAnimationFinished, this);
        this.node.active = false;
        if (null != this.onOffAnimationFinishedCallback) {
          this.onOffAnimationFinishedCallback();
          this.onOffAnimationFinishedCallback = null;
        }
      }
    });
    module.exports = BaseTitleScreenView;
    cc._RF.pop();
  }, {} ],
  BaseTutorialController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e660arD6Q5EeLrj6w02ArSa", "BaseTutorialController");
    "use strict";
    var BaseTutorialModel = require("BaseTutorialModel");
    var BaseTutorialView = require("BaseTutorialView");
    var BaseTutorialController = cc.Class({
      extends: cc.Component,
      properties: {
        _model: null,
        onCompleteCallback: null
      },
      onLoad: function onLoad() {
        this._model = this._createModel();
      },
      init: function init() {
        throw new error("must override BaseTutorialController.init() in derived class");
      },
      begin: function begin() {},
      tick: function tick(delta) {},
      _finish: function _finish() {},
      abort: function abort() {},
      _cleanup: function _cleanup() {},
      _createModel: function _createModel() {
        throw new error("must override BaseTutorialController.init() in derived class");
      }
    });
    module.exports = BaseTutorialController;
    cc._RF.pop();
  }, {
    BaseTutorialModel: "BaseTutorialModel",
    BaseTutorialView: "BaseTutorialView"
  } ],
  BaseTutorialModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "37483HsP7xI/KZ5x41XPukr", "BaseTutorialModel");
    "use strict";
    var BaseTutorialModel = cc.Class({
      properties: {},
      ctor: function ctor() {},
      clear: function clear() {}
    });
    module.exports = BaseTutorialModel;
    cc._RF.pop();
  }, {} ],
  BaseTutorialView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dc1c6kRm6RLOqZkr4sJpsMv", "BaseTutorialView");
    "use strict";
    var BaseTutorialView = cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {}
    });
    module.exports = BaseTutorialView;
    cc._RF.pop();
  }, {} ],
  BaseUIController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bef9frH/cBNKpFUyW6WEVql", "BaseUIController");
    "use strict";
    var LumosityPauseController = require("LumosityPauseController");
    var DebugPanelController = require("DebugPanelController");
    var PanelToggleController = require("PanelToggleController");
    var BaseUIView = require("BaseUIView");
    var BaseUIController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: {
          type: BaseUIView,
          default: null,
          visible: true
        },
        _debugToggle: {
          type: PanelToggleController,
          default: null,
          visible: true
        }
      },
      _pauseController: null,
      pauseButtonPressedCallback: function pauseButtonPressedCallback() {},
      skipTutorialButtonPressedCallback: function skipTutorialButtonPressedCallback() {},
      resumeButtonPressedCallback: function resumeButtonPressedCallback() {},
      restartButtonPressedCallback: function restartButtonPressedCallback() {},
      tutorialButtonPressedCallback: function tutorialButtonPressedCallback() {},
      muteSoundButtonPressedCallback: function muteSoundButtonPressedCallback() {},
      hearSoundButtonPressedCallback: function hearSoundButtonPressedCallback() {},
      quitButtonPressedCallback: function quitButtonPressedCallback() {},
      onDebugMenuShowCallback: function onDebugMenuShowCallback() {},
      onDebugMenuHideCallback: function onDebugMenuHideCallback() {},
      shortGameToggledOnCallback: function shortGameToggledOnCallback() {},
      shortGameToggledOffCallback: function shortGameToggledOffCallback() {},
      perfectModeToggledOnCallback: function perfectModeToggledOnCallback() {},
      perfectModeToggledOffCallback: function perfectModeToggledOffCallback() {},
      tutorialToggledOnCallback: function tutorialToggledOnCallback() {},
      tutorialToggledOffCallback: function tutorialToggledOffCallback() {},
      cycleLevelButtonPressedCallback: function cycleLevelButtonPressedCallback() {},
      cycleContentButtonPressedCallback: function cycleContentButtonPressedCallback() {},
      webStartScreenPlayButtonPressedCallback: function webStartScreenPlayButtonPressedCallback() {},
      webEndScreenContinueButtonPressedCallback: function webEndScreenContinueButtonPressedCallback() {},
      pauseMenuInAnimationCompleteCallback: function pauseMenuInAnimationCompleteCallback() {},
      pauseMenuOutAnimationCompleteCallback: function pauseMenuOutAnimationCompleteCallback() {},
      backButtonPressedCallback: function backButtonPressedCallback() {},
      _isDebugMode: false,
      _prevIsShortGamesMode: false,
      _prevIsPerfectMode: false,
      _prevIsTutorial: false,
      _prevCycleLevel: 0,
      _prevIsDebugMenuShowing: false,
      onLoad: function onLoad() {
        this._pauseController = new LumosityPauseController();
      },
      init: function init() {
        this._pauseController.setup();
        this._pauseController.pauseMenuInAnimationCompleteCallback = this._onPauseMenuInAnimationComplete.bind(this);
        this._pauseController.pauseMenuOutAnimationCompleteCallback = this._onPauseMenuOutAnimationComplete.bind(this);
        this._debugToggle.toggleCheckedCallback = this.onDebugMenuShow.bind(this);
        this._debugToggle.toggleUncheckedCallback = this.onDebugMenuHide.bind(this);
      },
      tick: function tick(delta) {
        this._pauseUpdate();
      },
      _pauseUpdate: function _pauseUpdate() {
        this._pauseController.update();
        "pause" == this._pauseController.stateNow ? this.pauseButtonPressedCallback(false) : "pauseInstant" == this._pauseController.stateNow ? this.pauseButtonPressedCallback(true) : "skipTutorial" == this._pauseController.stateNow ? this.skipTutorialButtonPressedCallback() : "resume" == this._pauseController.stateNow ? this.resumeButtonPressedCallback() : "restart" == this._pauseController.stateNow ? this.restartButtonPressedCallback() : "howToPlay" == this._pauseController.stateNow ? this.tutorialButtonPressedCallback() : "quit" == this._pauseController.stateNow ? this.quitButtonPressedCallback() : "muteSound" == this._pauseController.stateNow ? this.muteSoundButtonPressedCallback() : "hearSound" == this._pauseController.stateNow && this.hearSoundButtonPressedCallback();
        this._pauseController.isEscapeNow && this.backButtonPressedCallback();
      },
      _onPauseMenuInAnimationComplete: function _onPauseMenuInAnimationComplete() {
        this.pauseMenuInAnimationCompleteCallback();
      },
      _onPauseMenuOutAnimationComplete: function _onPauseMenuOutAnimationComplete() {
        this.pauseMenuOutAnimationCompleteCallback();
      },
      activateDebugToggle: function activateDebugToggle() {
        this._debugToggle.show();
      },
      deactivateDebugToggle: function deactivateDebugToggle() {
        this._debugToggle.hide();
      },
      onDebugMenuShow: function onDebugMenuShow() {
        this.onDebugMenuShowCallback();
      },
      onDebugMenuHide: function onDebugMenuHide() {
        this.onDebugMenuHideCallback();
      },
      activatePauseMenuQuitButton: function activatePauseMenuQuitButton() {
        this._pauseController.view.quitButton.active = true;
      },
      deactivatePauseMenuQuitButton: function deactivatePauseMenuQuitButton() {
        this._pauseController.view.quitButton.active = false;
      },
      activatePauseMenuMuteSoundButton: function activatePauseMenuMuteSoundButton() {
        this._pauseController.view.muteSoundButton.active = true;
      },
      deactivatePauseMenuMuteSoundButton: function deactivatePauseMenuMuteSoundButton() {
        this._pauseController.view.muteSoundButton.active = false;
      },
      showPauseButton: function showPauseButton() {
        this._pauseController.showButton(true);
      },
      hidePauseButton: function hidePauseButton() {
        this._pauseController.showButton(false);
      },
      isPaused: function isPaused() {
        return this._pauseController.isPaused;
      },
      enableQuitOnBack: function enableQuitOnBack() {
        this._pauseController.isQuitEnabled = true;
      },
      disableQuitOnBack: function disableQuitOnBack() {
        this._pauseController.isQuitEnabled = false;
      },
      showSkipTutorialButton: function showSkipTutorialButton() {
        this._pauseController.showSkipTutorialButton(true);
      },
      hideSkipTutorialButton: function hideSkipTutorialButton() {
        this._pauseController.showSkipTutorialButton(false);
      }
    });
    cc._RF.pop();
  }, {
    BaseUIView: "BaseUIView",
    DebugPanelController: "DebugPanelController",
    LumosityPauseController: "LumosityPauseController",
    PanelToggleController: "PanelToggleController"
  } ],
  BaseUIView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cc8e5ZtFMJMFJrzzWF7W2HY", "BaseUIView");
    "use strict";
    var BaseUIView = cc.Class({
      extends: cc.Component
    });
    module.exports = BaseUIView;
    cc._RF.pop();
  }, {} ],
  BaseView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a17e5YRzmBBAafJa0qAZYgp", "BaseView");
    "use strict";
    var BaseView = cc.Class({
      extends: cc.Component
    });
    module.exports = BaseView;
    cc._RF.pop();
  }, {} ],
  BonusMultiplierHUDController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fc3ebDVGudESK1fWEvSTFlh", "BonusMultiplierHUDController");
    "use strict";
    var BonusMultiplierHUDView = require("BonusMultiplierHUDView");
    var BonusMultiplierHUDController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: null
      },
      onLoad: function onLoad() {
        this._view = this.getComponent(BonusMultiplierHUDView);
        if (null == this._view) throw new error("Must have ScoreHUDView on same node as ScoreHUDController");
      },
      reset: function reset() {
        this._view.reset();
      },
      fillPip: function fillPip(pipNumber) {
        this._view.fillPip(pipNumber);
      },
      clearAllPips: function clearAllPips() {
        this._view.clearAllPips();
      },
      playMultiplierUp: function playMultiplierUp(multiplier, isMax) {
        this._view.playMultiplierUp(multiplier, isMax);
      },
      playMultiplierDown: function playMultiplierDown(multiplier) {
        this._view.playMultiplierDown(multiplier);
      }
    });
    module.exports = BonusMultiplierHUDController;
    cc._RF.pop();
  }, {
    BonusMultiplierHUDView: "BonusMultiplierHUDView"
  } ],
  BonusMultiplierHUDView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f8e2bPKb/5A9KkM4PdGAn2r", "BonusMultiplierHUDView");
    "use strict";
    var BonusMultiplierPip = require("BonusMultiplierPip");
    var BonusMultiplierHUDView = cc.Class({
      extends: cc.Component,
      properties: {
        _animation: null,
        _multiplier: 1,
        _isMax: false,
        _numFillingDuringTransition: 0,
        _isTransitioningUp: false,
        _multiplierText: {
          default: null,
          type: cc.Label,
          visible: true
        },
        _pips: {
          default: [],
          type: BonusMultiplierPip,
          visible: true
        },
        _pipsContainer: {
          default: null,
          type: cc.Node,
          visible: true
        },
        _maxContainer: {
          default: null,
          type: cc.Node,
          visible: true
        }
      },
      onLoad: function onLoad() {
        this._animation = this.getComponent(cc.Animation);
        this.reset();
      },
      reset: function reset() {
        this._multiplier = 1;
        this._numFillingDuringTransition = 0;
        this._isMax = false;
        this._maxContainer.active = false;
        this._pipsContainer.active = true;
        this._isTransitioningUp = false;
        this.clearAllPips();
        this.setMultiplier(1);
      },
      playMultiplierUp: function playMultiplierUp(newMultiplier, isMax) {
        this._multiplier = newMultiplier;
        this._isMax = isMax;
        this._numFillingDuringTransition = 0;
        this._isTransitioningUp = true;
        this._playBackgroundFlash();
      },
      _playBackgroundFlash: function _playBackgroundFlash() {
        this._animation.play("BonusFlash");
        this._animation.on("finished", this._animateOffUp, this);
      },
      _animateOffUp: function _animateOffUp() {
        this._animation.off("finished", this._animateOffUp, this);
        this._animation.play("BonusOffUp");
        this._animation.on("finished", this._changeMultiplierTextUp, this);
      },
      _changeMultiplierTextUp: function _changeMultiplierTextUp() {
        this._animation.off("finished", this._changeMultiplierTextUp, this);
        this.setMultiplier(this._multiplier);
        this.clearAllPips();
        if (this._isMax) {
          this._pipsContainer.active = false;
          this._maxContainer.active = true;
        }
        this._animateOnFromBottom();
      },
      _animateOnFromBottom: function _animateOnFromBottom() {
        this._animation.play("BonusOnFromBottom");
        this._isTransitioningUp = false;
      },
      playMultiplierDown: function playMultiplierDown(newMultiplier) {
        this._animation.setCurrentTime(0, "BonusFlash");
        this._isTransitioningUp = false;
        this._animation.unscheduleAllCallbacks();
        this._multiplier = newMultiplier;
        this._animateOffDown();
      },
      _animateOffDown: function _animateOffDown() {
        this._animation.play("BonusOffDown");
        this._animation.on("finished", this._changeMultiplierTextDown, this);
      },
      _changeMultiplierTextDown: function _changeMultiplierTextDown() {
        this._animation.off("finished", this._changeMultiplierTextDown, this);
        if (false === this._pipsContainer.active) {
          this._pipsContainer.active = true;
          this._maxContainer.active = false;
        }
        this.setMultiplier(this._multiplier);
        this._animateOnFromTop();
      },
      _animateOnFromTop: function _animateOnFromTop() {
        this._animation.play("BonusOnFromTop");
      },
      fillPip: function fillPip(pipNumber) {
        pipNumber < this._pips.length && this._pips[pipNumber].playFill();
        true === this._isTransitioningUp && this._numFillingDuringTransition++;
      },
      clearAllPips: function clearAllPips() {
        for (var i = 0; i < this._pips.length; i++) (i >= this._numFillingDuringTransition || false === this._isTransitioningUp) && this._pips[i].playEmptyInstant();
      },
      setMultiplier: function setMultiplier(multiplier) {
        this._multiplierText.string = "×" + multiplier.toString();
      }
    });
    module.exports = BonusMultiplierHUDView;
    cc._RF.pop();
  }, {
    BonusMultiplierPip: "BonusMultiplierPip"
  } ],
  BonusMultiplierPip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ffadHeUNxLCZyuB2CsJRmv", "BonusMultiplierPip");
    "use strict";
    var BonusMultiplierPip = cc.Class({
      extends: cc.Component,
      properties: {
        _animator: null,
        _isEmpty: true
      },
      onLoad: function onLoad() {
        this._animator = this.getComponent(cc.Animation);
      },
      playFill: function playFill() {
        cc.log("PlayFill pip");
        if (true === this._isEmpty) {
          this._isEmpty = false;
          this._animator.play("BonusPipFill");
        }
      },
      playEmpty: function playEmpty() {
        if (false === this._isEmpty) {
          this._isEmpty = true;
          this._animator.play("BonusPipEmpty");
        }
      },
      playEmptyInstant: function playEmptyInstant() {
        if (false === this._isEmpty) {
          this._isEmpty = true;
          this._animator.play("BonusPipEmptyInstant");
        }
      }
    });
    module.exports = BonusMultiplierPip;
    cc._RF.pop();
  }, {} ],
  BonusRollupHUDController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "70c231dSWpPLrN5337gK8M3", "BonusRollupHUDController");
    "use strict";
    var BonusRollupHUDView = require("BonusRollupHUDView");
    var BonusRollupHUDController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: {
          default: null,
          type: BonusRollupHUDView,
          visible: true
        },
        onFinishedCallback: {
          default: null,
          visible: false
        }
      },
      init: function init(callback) {
        this.onFinishedCallback = callback;
      },
      showBonusScore: function showBonusScore(bonusAmount) {
        this._view.onFinishedCallback = this._handleBonusAnimationFinished.bind(this);
        this._view.showBonusScore(bonusAmount);
      },
      _handleBonusAnimationFinished: function _handleBonusAnimationFinished() {
        null != this.onFinishedCallback && this.onFinishedCallback();
      }
    });
    module.exports = BonusRollupHUDController;
    cc._RF.pop();
  }, {
    BonusRollupHUDView: "BonusRollupHUDView"
  } ],
  BonusRollupHUDView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "59e00/nN1xDp591BLISKezX", "BonusRollupHUDView");
    "use strict";
    var BonusRollupHUDView = cc.Class({
      extends: cc.Component,
      properties: {
        _bonusLabel: {
          default: null,
          type: cc.Label,
          visible: true
        },
        onFinishedCallback: {
          default: null,
          visible: false
        },
        _animator: null
      },
      onLoad: function onLoad() {
        this._animator = this.getComponent(cc.Animation);
      },
      showBonusScore: function showBonusScore(bonusAmount) {
        if (isNaN(bonusAmount)) throw new error("Bonus amount in BonusRollupHUD must be a number, is NaN");
        this._bonusLabel.string = "+" + bonusAmount;
        this._animator.on("finished", this.handleAnimationFinished, this);
        this._animator.play("BonusScoreRollup");
      },
      handleAnimationFinished: function handleAnimationFinished() {
        this._animator.off("finished", this.handleAnimationFinished, this);
        if (null != this.onFinishedCallback) {
          this.onFinishedCallback();
          this.onFinishedCallback = null;
        }
      }
    });
    module.exports = BonusRollupHUDView;
    cc._RF.pop();
  }, {} ],
  BottomButtonController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b9f0aS2wmtBAbuqu2nXDB0V", "BottomButtonController");
    "use strict";
    var BottomButtonView = require("BottomButtonView");
    var ButtonController = require("ButtonController");
    var BottomButtonController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: {
          default: null,
          type: BottomButtonView,
          visible: true
        },
        _buttonController: {
          default: null,
          type: ButtonController,
          visible: true
        },
        onButtonDownCallback: {
          default: null,
          visible: false
        },
        onButtonUpCallback: {
          default: null,
          visible: false
        }
      },
      onLoad: function onLoad() {
        this._buttonController.onButtonDownCallback = this._handleOnButtonDown.bind(this);
        this._buttonController.onButtonUpCallback = this._handleOnButtonUp.bind(this);
      },
      show: function show() {
        this.node.active = true;
      },
      hide: function hide() {
        this.node.active = false;
      },
      enable: function enable() {
        this._view.enable();
        this._buttonController.enable();
      },
      disable: function disable() {
        this._view.disable();
        this._buttonController.disable();
      },
      setText: function setText(text) {
        this._view.setText(text);
      },
      _handleOnButtonDown: function _handleOnButtonDown() {
        null != this.onButtonDownCallback && this.onButtonDownCallback();
      },
      _handleOnButtonUp: function _handleOnButtonUp() {
        null != this.onButtonUpCallback && this.onButtonUpCallback();
      }
    });
    module.exports = BottomButtonController;
    cc._RF.pop();
  }, {
    BottomButtonView: "BottomButtonView",
    ButtonController: "ButtonController"
  } ],
  BottomButtonView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e084fwz1c1C6Zjpu5BpxoH1", "BottomButtonView");
    "use strict";
    var BottomButtonView = cc.Class({
      extends: cc.Component,
      properties: {
        _buttons: null,
        _text: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      onLoad: function onLoad() {
        this._buttons = this.node.getComponents(cc.Button);
      },
      setText: function setText(text) {
        null != this._text && (this._text.string = text);
      },
      enable: function enable() {
        this._buttons.forEach(function(button) {
          button.interactable = true;
        });
      },
      disable: function disable() {
        this._buttons.forEach(function(button) {
          button.interactable = false;
        });
      }
    });
    module.exports = BottomButtonView;
    cc._RF.pop();
  }, {} ],
  ButtonController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cfe48oD7iNLnaZuqD5aM1WT", "ButtonController");
    "use strict";
    var ButtonView = require("ButtonView");
    var ButtonController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: {
          default: null,
          type: ButtonView,
          visible: true
        },
        _isEnabled: {
          default: true,
          visible: true
        },
        onButtonDownCallback: {
          default: null,
          visible: false
        },
        onButtonUpCallback: {
          default: null,
          visible: false
        }
      },
      onLoad: function onLoad() {
        this._view.onButtonDownCallback = this._handleButtonDown.bind(this);
        this._view.onButtonUpCallback = this._handleButtonUp.bind(this);
      },
      enable: function enable() {
        this._isEnabled = true;
        this._view.enable();
      },
      disable: function disable() {
        this._isEnabled = false;
        this._view.disable();
      },
      _handleButtonDown: function _handleButtonDown(event) {
        null != this.onButtonDownCallback && this._isEnabled && this.onButtonDownCallback(event);
      },
      _handleButtonUp: function _handleButtonUp(event) {
        null != this.onButtonUpCallback && this._isEnabled && this.onButtonUpCallback(event);
      }
    });
    module.exports = ButtonController;
    cc._RF.pop();
  }, {
    ButtonView: "ButtonView"
  } ],
  ButtonView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fb1f8KDhD5FbaGoUfRCyY+U", "ButtonView");
    "use strict";
    var ButtonView = cc.Class({
      extends: cc.Component,
      properties: {
        onButtonDownCallback: {
          default: null,
          visible: false
        },
        onButtonUpCallback: {
          default: null,
          visible: false
        }
      },
      onLoad: function onLoad() {
        this.enable();
      },
      onDestroy: function onDestroy() {
        this.disable();
      },
      _handleButtonDown: function _handleButtonDown(event) {
        this.onButtonDownCallback(event);
      },
      _handleButtonUp: function _handleButtonUp(event) {
        this.onButtonUpCallback(event);
      },
      enable: function enable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._handleButtonDown, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._handleButtonUp, this);
      },
      disable: function disable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._handleButtonDown, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._handleButtonUp, this);
      }
    });
    module.exports = ButtonView;
    cc._RF.pop();
  }, {} ],
  CookingPapaController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2c3e1zwbRFOoJbiCbQkDNCL", "CookingPapaController");
    "use strict";
    var EndScreenController = require("EndScreenController");
    var InstructionSheetController = require("InstructionSheetController");
    var ItemController = require("ItemController");
    var ItemData = require("ItemData");
    var ItemLookup = require("ItemLookup");
    var OvenUIController = require("OvenUIController");
    var Recipie = require("Recipie");
    var RecipieList = require("RecipieList");
    var StoveUIController = require("StoveUIController");
    var CookingPapaController = cc.Class({
      extends: cc.Component,
      properties: {
        submitStepButton: {
          default: null,
          type: cc.Node,
          visible: true
        },
        recipieLookup: {
          default: null,
          type: RecipieList,
          visible: false
        },
        itemLookup: {
          default: null,
          type: ItemLookup,
          visible: false
        },
        instructions: {
          default: null,
          type: InstructionSheetController,
          visible: true
        },
        recipiesLoaded: false,
        itemsLoaded: false,
        currentStepWidget: {
          default: null,
          type: cc.Node,
          visible: true
        },
        currentStepText: {
          default: null,
          type: cc.Label,
          visible: true
        },
        selectedTools: {
          default: [],
          type: ItemController,
          visible: false
        },
        selectedItems: {
          default: [],
          type: ItemController,
          visible: false
        },
        selectedServing: {
          default: null,
          type: ItemController,
          visible: false
        },
        itemPrefab: {
          default: null,
          type: cc.Prefab,
          visible: true
        },
        recipie: {
          default: null,
          type: Recipie,
          visible: false
        },
        ingredientsParent: {
          default: null,
          type: cc.Node,
          visible: true
        },
        toolsParent: {
          default: null,
          type: cc.Node,
          visible: true
        },
        servingParent: {
          default: null,
          type: cc.Node,
          visible: true
        },
        itemIds: {
          default: null,
          type: Number,
          visible: false
        },
        stoveUI: {
          default: null,
          type: StoveUIController,
          visible: true
        },
        ovenUI: {
          default: null,
          type: OvenUIController,
          visible: true
        },
        imgCorrect: {
          default: null,
          type: cc.Node,
          visible: true
        },
        imgIncorrect: {
          default: null,
          type: cc.Node,
          visible: true
        },
        endScreen: {
          default: null,
          type: EndScreenController,
          visible: true
        },
        stepsTaken: 0
      },
      start: function start() {
        this.itemLookup = this.node.getComponent("ItemLookup");
        this.recipieLookup = this.node.getComponent("RecipieList");
        this.reset();
      },
      reset: function reset() {
        this.itemIds = [];
        this.hideInstructions();
        this.clearInstructions();
        this.submitStepButton.active = false;
        this.currentStepText.string = "";
        this.endScreen.node.active = false;
        this.instructions.reset();
        this._setupItemIcons();
        this.recipieLookup.reset();
        this.stepsTaken = 0;
      },
      startTrial1: function startTrial1() {
        this._startTrial(1);
      },
      startTrial2: function startTrial2() {
        this._startTrial(2);
      },
      _startTrial: function _startTrial(trialID) {
        this.reset();
        var recipie = this.recipieLookup.getRecipie(trialID);
        if (null != recipie) {
          this.recipie = recipie;
          this.instructions.init(this.recipie);
          this.showInstructions();
        }
      },
      _setupItemIcons: function _setupItemIcons() {
        var _this = this;
        if (!this.itemsLoaded) return;
        this.ingredientsParent.removeAllChildren();
        this.toolsParent.removeAllChildren();
        this.servingParent.removeAllChildren();
        var shelfItemIDs = [ 3, 14, 13, 15, 20, 21, 25 ];
        var itemData = null;
        var newItem = null;
        var newItemController = null;
        shelfItemIDs.forEach(function(id) {
          _this._addNewItem(id, _this.ingredientsParent);
        });
        var counterItemIDs = [ 19, 16, 22, 1 ];
        counterItemIDs.forEach(function(id) {
          _this._addNewItem(id, _this.toolsParent);
        });
        var servingItemIDs = [ 4, 5, 23, 24 ];
        servingItemIDs.forEach(function(id) {
          _this._addNewItem(id, _this.servingParent);
        });
      },
      _addNewItem: function _addNewItem(id, parent) {
        if (-1 != this.itemIds.indexOf(id)) return;
        var itemData = this.itemLookup.getItem(id);
        var newItem = cc.instantiate(this.itemPrefab);
        var newItemController = newItem.getComponent("ItemController");
        newItemController.init(itemData);
        newItemController.selectedCallback = this.itemSelectedCallback.bind(this);
        parent.addChild(newItem);
        this.itemIds.push(id);
      },
      markItemsLoaded: function markItemsLoaded() {
        this.itemsLoaded = true;
        this._setupItemIcons();
        this.node.getComponent("RecipieList").loadRecipies();
      },
      clearFeedback: function clearFeedback() {
        this.imgCorrect.active = false;
        this.imgIncorrect.active = false;
      },
      clearInstructions: function clearInstructions() {
        this.selectedServing && this.selectedServing.setSelected(false);
        this.selectedItems.forEach(function(itemController) {
          itemController.setSelected(false);
        });
        this.selectedTools.forEach(function(itemController) {
          itemController.setSelected(false);
        });
        this.selectedServing = null;
        this.selectedItems = [];
        this.selectedTools = [];
        this.clearFeedback();
        this.currentStepText.string = "";
      },
      submitAction: function submitAction() {
        var _this2 = this;
        var action = [];
        var correctAction = false;
        if (null != this.selectedServing) action.push(this.selectedServing.itemData.id); else if (this.selectedTools.length > 0 && this.selectedItems.length > 0) {
          action.push(this.selectedTools[0].itemData.id);
          action.push(this.selectedItems[0].itemData.id);
        } else if (this.selectedItems.length > 1) {
          action.push(this.selectedItems[0].itemData.id);
          action.push(this.selectedItems[1].itemData.id);
        }
        correctAction = this.recipie.maybeAdvanceStep(action);
        var actionInRecipie = this.recipie.containsAction(action);
        this.stepsTaken++;
        if (correctAction) {
          if (this.selectedTools.length > 0) {
            var _action = this.selectedTools[0].itemData.getAction();
            "" != _action && this.selectedItems.length > 0 && this._maybeApplyTransform(_action, this.selectedItems[0]);
          } else this.selectedItems.forEach(function(thing) {
            _this2._maybeApplyTransform("any", thing);
          });
          this.recipie.completed && this.showEndScreen(this.stepsTaken, this.recipie.numSteps);
        }
        this.clearInstructions();
        this.showFeedback(correctAction, actionInRecipie);
      },
      showEndScreen: function showEndScreen(stepsTaken, recipieSteps) {
        this.endScreen.setResultText(stepsTaken, recipieSteps);
        this.endScreen.node.active = true;
      },
      showFeedback: function showFeedback(wasCorrect, actionInRecipie) {
        if (wasCorrect) {
          this.imgCorrect.active = true;
          this.imgIncorrect.active = false;
          this.currentStepText.string = "Good work!";
        } else {
          this.imgCorrect.active = true;
          this.imgIncorrect.active = true;
          this.currentStepText.string = actionInRecipie ? "Almost right, but not now" : "Not quite right";
        }
      },
      _maybeApplyTransform: function _maybeApplyTransform(transform, applyTo) {
        var itemAction = applyTo.itemData.transforms[transform];
        if (itemAction) {
          cc.log("performing action: " + itemAction.actionName);
          var itemData = void 0;
          if (itemAction.replaceOriginal) {
            itemData = this.itemLookup.getItem(itemAction.newId);
            applyTo.init(itemData);
          } else this._addNewItem(itemAction.newId, this.ingredientsParent);
        }
      },
      itemHoverCallback: function itemHoverCallback(itemData) {},
      itemSelectedCallback: function itemSelectedCallback(itemController) {
        if (this.instructions.node.active) return;
        this.hideApplianceUI();
        this.clearFeedback();
        if (itemController.itemData.isServing()) if (itemController.isSelected()) {
          this.selectedServing = null;
          itemController.setSelected(false);
        } else {
          this.selectedServing = itemController;
          itemController.setSelected(true);
        } else if (itemController.itemData.isTool()) {
          if (itemController.isSelected()) {
            itemController.setSelected(false);
            this.selectedTools = this.selectedTools.filter(function(item) {
              return item.itemData.id != itemController.itemData.id;
            });
          } else {
            this.selectedTools.push(itemController);
            this.selectedTools.length > 1 && this.selectedTools.shift().setSelected(false);
            itemController.setSelected(true);
          }
          cc.log(this.selectedTools);
        } else if (itemController.isSelected()) {
          itemController.setSelected(false);
          this.selectedItems = this.selectedItems.filter(function(item) {
            return item.itemData.id != itemController.itemData.id;
          });
        } else {
          this.selectedItems.push(itemController);
          (this.selectedItems.length > 2 || this.selectedTools.length > 0 && this.selectedItems.length > 1) && this.selectedItems.shift().setSelected(false);
          itemController.setSelected(true);
        }
        this._updateStepText();
      },
      _updateStepText: function _updateStepText() {
        this.currentStepWidget.active = true;
        var action = "";
        var conjunction = "";
        var s = "";
        if (null != this.selectedServing) s = "Serve in " + this.selectedServing.itemData.name; else if (this.selectedTools.length > 0) {
          action = this.selectedTools[0].itemData.getAction();
          s = this.selectedItems.length > 0 ? action + " " + this.selectedItems[0].itemData.name : "" + this.selectedTools[0].itemData.name;
        } else this.selectedItems.length > 1 ? s = "Combine " + this.selectedItems[0].itemData.name + " and " + this.selectedItems[1].itemData.name : 1 == this.selectedItems.length && (s = "" + this.selectedItems[0].itemData.name);
        this.currentStepText.string = s;
      },
      submitStep: function submitStep() {},
      markRecipiesLoaded: function markRecipiesLoaded() {
        this.recipiesLoaded = true;
        this.itemsLoaded && this._startTrial(1);
      },
      initInstructions: function initInstructions() {
        this.recipie = this.recipieLookup.getRecipie(1);
        this.instructions.init(this.recipie);
        this.showInstructions();
      },
      showInstructions: function showInstructions() {
        this.instructions.node.active = true;
      },
      hideInstructions: function hideInstructions() {
        this.instructions.node.active = false;
        this.submitStepButton.active = true;
      },
      showStoveUI: function showStoveUI() {
        this.clearInstructions();
        this.hideApplianceUI();
        this.stoveUI.node.active = true;
      },
      hideStoveUI: function hideStoveUI() {
        this.stoveUI.node.active = false;
      },
      showOvenUI: function showOvenUI() {
        this.clearInstructions();
        this.hideApplianceUI();
        this.ovenUI.node.active = true;
      },
      hideOvenUI: function hideOvenUI() {
        this.ovenUI.node.active = false;
      },
      hideApplianceUI: function hideApplianceUI() {
        this.hideOvenUI();
        this.hideStoveUI();
      }
    });
    cc._RF.pop();
  }, {
    EndScreenController: "EndScreenController",
    InstructionSheetController: "InstructionSheetController",
    ItemController: "ItemController",
    ItemData: "ItemData",
    ItemLookup: "ItemLookup",
    OvenUIController: "OvenUIController",
    Recipie: "Recipie",
    RecipieList: "RecipieList",
    StoveUIController: "StoveUIController"
  } ],
  CountdownController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "498fcJLR55JcZrRD56DcMwJ", "CountdownController");
    "use strict";
    var CountdownController = cc.Class({
      extends: cc.Component,
      properties: {
        onCompleteCallback: {
          default: null,
          visible: false
        },
        _animation: null
      },
      onLoad: function onLoad() {
        this._animation = this.getComponent(cc.Animation);
      },
      show: function show() {
        this._animation.on("finished", this._handleAnimationFinished, this);
        this._animation.play();
      },
      _handleAnimationFinished: function _handleAnimationFinished() {
        if (null != this.onCompleteCallback) {
          this._animation.off("finished", this._handleAnimationFinished, this);
          this.onCompleteCallback();
        }
      },
      reset: function reset() {
        this.onCompleteCallback = null;
        this._animation.off("finished", this._handleAnimationFinished, this);
        this._animation.setCurrentTime(0, "Countdown");
        this._animation.stop();
      }
    });
    module.exports = CountdownController;
    cc._RF.pop();
  }, {} ],
  DebugPanelController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d926c31UO9AsYLZM4EjxCMw", "DebugPanelController");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _panelToggle: {
          type: cc.Node,
          default: null,
          visible: true
        }
      },
      show: function show() {
        this._panelToggle.active = true;
      },
      hide: function hide() {
        this._panelToggle.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  DebugPanelView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "608be3+kGNOVq52Txg0WxH+", "DebugPanelView");
    "use strict";
    var SceneNodeView = require("SceneNodeView");
    var DebugPanelView = cc.Class({
      extends: cc.Component,
      properties: {
        cycleContentButton: null,
        cycleContentText: null,
        cycleLevelText: null,
        cycleLevelButton: null,
        debugModeToggle: null,
        fpsText: null,
        howToPlayToggle: null,
        isVerboseToggle: null,
        levelText: null,
        numTrialsText: null,
        parent: null,
        panel: null,
        panelToggle: null,
        perfectModeToggle: null,
        shortGameToggle: null,
        showFPSToggle: null,
        timeScaleTextOwner: null,
        timeScaleUpButton: null,
        timeScaleDownButton: null,
        throwErrorButton: null
      },
      onLoad: function onLoad() {
        DebugPanelView.instance = this;
      },
      setup: function setup() {
        this.cycleContentButton = SceneNodeView.getChild(this.node, "Panel/Layout/CycleContent", this.cycleContentButton);
        this.cycleContentText = SceneNodeView.getChild(this.node, "Panel/Layout/CycleContent/Text", this.cycleContentText);
        this.cycleLevelText = SceneNodeView.getChild(this.node, "Panel/Layout/CycleLevel/Text", this.cycleLevelText);
        this.cycleLevelButton = SceneNodeView.getChild(this.node, "Panel/Layout/CycleLevel", this.cycleLevelButton);
        this.debugModeToggle = SceneNodeView.getChild(this.node, "Panel/Layout/DebugMode", this.debugModeToggle);
        this.fpsText = SceneNodeView.getChild(this.node, "FPSText", this.fpsText);
        this.howToPlayToggle = SceneNodeView.getChild(this.node, "Panel/Layout/HowToPlay", this.howToPlayToggle);
        this.levelText = SceneNodeView.getChild(this.node, "Panel/Layout/Level/Input", this.levelText);
        this.numTrialsText = SceneNodeView.getChild(this.node, "Panel/Layout/NumTrials/Input", this.numTrialsText);
        this.panel = SceneNodeView.getChild(this.node, "Panel", this.panel);
        this.panelToggle = SceneNodeView.getChild(this.node, "PanelToggle", this.panelToggle);
        this.shortGameToggle = SceneNodeView.getChild(this.node, "Panel/Layout/ShortGame", this.shortGameToggle);
        this.showFPSToggle = SceneNodeView.getChild(this.node, "Panel/Layout/ShowFPS", this.showFPSToggle);
        this.perfectModeToggle = SceneNodeView.getChild(this.node, "Panel/Layout/PerfectMode", this.perfectModeToggle);
        this.timeScaleTextOwner = SceneNodeView.getChild(this.node, "Panel/Layout/TimeScale/Input", this.timeScaleTextOwner);
        this.timeScaleDownButton = SceneNodeView.getChild(this.node, "Panel/Layout/TimeScaleDown", this.timeScaleDownButton);
        this.timeScaleUpButton = SceneNodeView.getChild(this.node, "Panel/Layout/TimeScaleUp", this.timeScaleUpButton);
        this.throwErrorButton = SceneNodeView.getChild(this.node, "Panel/Layout/ThrowError", this.throwErrorButton, true);
        this.isVerboseToggle = SceneNodeView.getChild(this.node, "Panel/Layout/IsVerbose", this.isVerboseToggle, true);
        this.parent = null == this.parent ? this.node : this.parent;
      }
    });
    DebugPanelView.instance = null;
    DebugPanelView.getInstance = function() {
      return DebugPanelView.instance;
    };
    module.exports = DebugPanelView;
    cc._RF.pop();
  }, {
    SceneNodeView: "SceneNodeView"
  } ],
  DebugUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a2c0e1wE7FIa4ctxl4ZVCsg", "DebugUtil");
    "use strict";
    var DebugUtil = cc.Class({});
    DebugUtil.isEnabled = true;
    DebugUtil.log = function(message) {
      DebugUtil.isEnabled && console.log(message);
    };
    module.exports = DebugUtil;
    cc._RF.pop();
  }, {} ],
  EndScreenController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9246d31OJ1OSY5Ep/oFnZa5", "EndScreenController");
    "use strict";
    var EndScreenController = cc.Class({
      extends: cc.Component,
      properties: {
        resultText: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      setResultText: function setResultText(stepsTaken, recipieSteps) {
        this.resultText.string = stepsTaken > recipieSteps ? stepsTaken - recipieSteps + " extra steps taken." : "Perfect!!!";
      }
    });
    cc._RF.pop();
  }, {} ],
  FeedbackController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f73e8rmj21MWaN6h1ROtXk+", "FeedbackController");
    "use strict";
    var FeedbackController = cc.Class({
      extends: cc.Component,
      properties: {
        _animation: cc.Animation
      },
      onLoad: function onLoad() {
        this._animation = this.getComponent(cc.Animation);
      },
      show: function show() {
        this._animation.play("ShowFeedback");
      },
      hide: function hide() {
        this._animation.play("ShowFeedback", this._animation.getClips()[0].duration);
      }
    });
    module.exports = FeedbackController;
    cc._RF.pop();
  }, {} ],
  HeartbeatController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "83fe7TlIUFMaIKTmX44DGRF", "HeartbeatController");
    "use strict";
    var LumosAppInterface = require("LumosAppInterface");
    var Metadata = require("Metadata");
    var HeartbeatController = cc.Class({
      properties: {
        _hash: {
          default: {}
        },
        _metadata: {
          default: {}
        },
        _currentSendTime: 0,
        _maxSendTime: 5,
        _currentMilestoneTime: 0,
        _milestone: "load_begin",
        _milestoneKey: "type",
        _milestoneTimeKey: "timing",
        _metadataKey: "metadata"
      },
      setMilestone: function setMilestone(milestone) {
        this._milestone = milestone;
        this._currentMilestoneTime = 0;
        this._currentSendTime = 0;
        this._sendEvent();
      },
      setMetadata: function setMetadata(key, data) {
        this._metadata[key] = data;
      },
      tick: function tick(dt) {
        this._currentMilestoneTime += dt;
        this._currentSendTime += dt;
        if (this._currentSendTime >= this._maxSendTime) {
          this._currentSendTime = 0;
          this._sendEvent();
        }
      },
      _sendEvent: function _sendEvent() {
        this._hash[this._milestoneKey] = this._milestone;
        this._hash[this._milestoneTimeKey] = Metadata.toMilliseconds(this._currentMilestoneTime);
        Object.keys(this._metadata).length > 0 && (this._hash[this._metadataKey] = this._metadata);
        LumosAppInterface.getInstance().applicationHeartbeat(this._hash);
      }
    });
    cc._RF.pop();
  }, {
    LumosAppInterface: "LumosAppInterface",
    Metadata: "Metadata"
  } ],
  InputBehaviour: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2224dw2Wu9DMZAon/TOIzia", "InputBehaviour");
    "use strict";
    var DebugUtil = require("DebugUtil");
    var InputBehaviour = cc.Class({
      extends: cc.Component,
      properties: {
        controller: null
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onPointerDown, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onPointerUp, this);
      },
      onDestroy: function onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onPointerDown, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onPointerUp, this);
      },
      onPointerDown: function onPointerDown(event) {
        this.controller.down(this.node.name);
      },
      onPointerUp: function onPointerUp(event) {
        this.controller.up(this.node.name);
      }
    });
    module.exports = InputBehaviour;
    cc._RF.pop();
  }, {
    DebugUtil: "DebugUtil"
  } ],
  InputController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3521bXNrCRLFJYbkm8G1Ohn", "InputController");
    "use strict";
    var InputView = require("InputView");
    var InputController = cc.Class({
      properties: {
        buttonName: "",
        buttonNameNext: "",
        currents: {
          default: {}
        },
        isAnyNow: false,
        view: null
      },
      ctor: function ctor() {
        this.view = new InputView();
        this.view.controller = this;
      },
      update: function update() {
        this.buttonName = this.buttonNameNext;
        this.isAnyNow = "" != this.buttonName;
        this.buttonNameNext = "";
        this.view.target = this.view.targetNext;
        this.view.targetNext = null;
      },
      listen: function listen(name) {
        this.up(name);
      },
      up: function up(name) {
        this.currents[name] = false;
      },
      down: function down(name) {
        console.log("Down: " + name);
        this.buttonNameNext = name;
        this.currents[name] = true;
      }
    });
    module.exports = InputController;
    cc._RF.pop();
  }, {
    InputView: "InputView"
  } ],
  InputView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5931bl1RkJP8oN4WMBpyuc4", "InputView");
    "use strict";
    var InputController = require("InputController");
    var InputBehaviour = require("InputBehaviour");
    var DebugUtil = require("DebugUtil");
    var InputView = cc.Class({
      extends: cc.Component,
      properties: {
        controller: null,
        target: cc.Node,
        targetNext: cc.Node
      },
      listen: function listen(view) {
        if (null == view) {
          DebugUtil.log("[InputView] tried to listen to null view");
          return;
        }
        var behaviour = view.getComponent(InputBehaviour);
        null == behaviour && (behaviour = view.addComponent(InputBehaviour));
        behaviour.controller = this.controller;
        this.controller.listen(view.name);
      }
    });
    InputView.isAnyMouseButtonDown = function() {
      console.log("isAnyMouseButtonDown not implemented");
      return false;
    };
    InputView.isEscapeDown = function() {
      return;
    };
    InputView.isToggledOn = function(toggleOwner) {
      console.log("isToggledOn not implemented");
      return false;
    };
    InputView.setToggleOn = function(toggleOwner, isOn) {
      console.log("setToggleOn not implemented");
    };
    module.exports = InputView;
    cc._RF.pop();
  }, {
    DebugUtil: "DebugUtil",
    InputBehaviour: "InputBehaviour",
    InputController: "InputController"
  } ],
  InstructionSheetController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e485eK6ORIRIJypZVE4xvz", "InstructionSheetController");
    "use strict";
    var CookingPapaController = require("CookingPapaController");
    var ItemLookup = require("ItemLookup");
    var Recipie = require("Recipie");
    var RecipieStepController = require("RecipieStepController");
    var InstructionSheetController = cc.Class({
      extends: cc.Component,
      properties: {
        mainController: {
          default: null,
          type: CookingPapaController,
          visible: true
        },
        recipieNameText: {
          default: null,
          type: cc.Label,
          visible: true
        },
        stepsParent: {
          default: null,
          type: cc.Node,
          visible: true
        },
        stepPrefab: {
          default: null,
          type: cc.Prefab,
          visible: true
        },
        steps: {
          default: [],
          type: RecipieStepController,
          visible: false
        },
        itemLookup: {
          default: null,
          type: ItemLookup,
          visible: true
        }
      },
      ctor: function ctor() {},
      init: function init(recipieData) {
        var _this = this;
        this.recipieNameText.string = recipieData.name;
        recipieData.steps.forEach(function(step, i) {
          _this._addStep(step, i + 1);
        });
      },
      reset: function reset() {
        this.stepsParent.removeAllChildren();
      },
      _addStep: function _addStep(data, num) {
        var newStep = cc.instantiate(this.stepPrefab);
        newStep.getComponent("RecipieStepController").init(data, this.itemLookup);
        this.stepsParent.addChild(newStep);
      }
    });
    cc._RF.pop();
  }, {
    CookingPapaController: "CookingPapaController",
    ItemLookup: "ItemLookup",
    Recipie: "Recipie",
    RecipieStepController: "RecipieStepController"
  } ],
  ItemAction: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e79c4W82bNAyqfolpWUR8bw", "ItemAction");
    "use strict";
    var ItemAction = cc.Class({
      properties: {
        actionName: "",
        newId: -1,
        replaceOriginal: false
      },
      ctor: function ctor(data) {}
    });
    cc._RF.pop();
  }, {} ],
  ItemController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "95c78Pnx7FMGY1B41aOcdKp", "ItemController");
    "use strict";
    function _defineProperty(obj, key, value) {
      key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    var ItemData = require("ItemData");
    var ItemController = cc.Class(_defineProperty({
      extends: cc.Component,
      properties: {
        baseSprite: {
          default: null,
          type: cc.Sprite,
          visible: true
        },
        frames: {
          default: [],
          type: [ cc.SpriteFrame ],
          visible: true
        },
        itemData: {
          default: null,
          type: ItemData,
          visible: true
        },
        selectedIcon: {
          default: null,
          type: cc.Node,
          visible: true
        },
        selectedCallback: null,
        mouseOverCallback: null,
        mouseOutCallback: null,
        isTool: false,
        BOILING_WATER: 0
      },
      start: function start() {
        this.setSelected(false);
      },
      setSelected: function setSelected(isSelected) {
        this.selectedIcon.active = isSelected;
      },
      isSelected: function isSelected() {
        return this.selectedIcon.active;
      },
      init: function init(itemData) {
        this.itemData = itemData;
        this.itemData.hasOwnProperty("actions") && this.itemData["actions"].length > 0 && (this.isTool = true);
        var itemID = itemData.frameID;
        if (itemID < 0 || itemID >= this.frames.length) {
          cc.error("itemID out of bounds " + itemID);
          return;
        }
        this.baseSprite.spriteFrame = this.frames[itemID];
        this.setSelected(false);
      },
      itemSelected: function itemSelected() {
        null != this.selectedCallback && this.selectedCallback(this);
      },
      itemMouseOver: function itemMouseOver() {
        cc.log("mouseOver " + this.itemData.name);
        null != this.mouseOverCallback && this.mouseOverCallback(this);
      },
      itemMouseOut: function itemMouseOut() {
        cc.log("mouseOut " + this.itemData.name);
        null != this.mouseOutCallback && this.mouseOutCallback(this);
      }
    }, "start", function start() {}));
    cc._RF.pop();
  }, {
    ItemData: "ItemData"
  } ],
  ItemData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77018jbQeZAmoR1LGXf7S+c", "ItemData");
    "use strict";
    var _slicedToArray = function() {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            !_n && _i["return"] && _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      return function(arr, i) {
        if (Array.isArray(arr)) return arr;
        if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }();
    var ItemAction = require("ItemAction");
    var ItemData = cc.Class({
      properties: {
        offsetX: 0,
        offsetY: 0,
        id: -1,
        frameID: -1,
        name: "",
        transforms: {},
        actions: [],
        frame: cc.SpriteFrame
      },
      ctor: function ctor(data) {
        this.offsetX = data.offsetX;
        this.offsetY = data.offsetY;
        this.id = data.id;
        this.frameID = data.frameId;
        this.name = data.name;
        this.actions = data.actions ? data.actions.slice() : [];
        this.transforms = {};
        if (data.hasOwnProperty("transforms")) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = void 0;
          try {
            for (var _iterator = Object.entries(data.transforms)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _ref = _step.value;
              var _ref2 = _slicedToArray(_ref, 2);
              var transformName = _ref2[0];
              var actionData = _ref2[1];
              var action = new ItemAction();
              action.actionName = transformName;
              action.newId = actionData.newId;
              action.replaceOriginal = true === actionData.replace;
              this.transforms[transformName] = action;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              !_iteratorNormalCompletion && _iterator.return && _iterator.return();
            } finally {
              if (_didIteratorError) throw _iteratorError;
            }
          }
        }
      },
      isTool: function isTool() {
        return this.actions.length > 0;
      },
      isServing: function isServing() {
        var servingItems = [ 23, 24, 4, 5 ];
        return -1 != servingItems.indexOf(this.id);
      },
      getAction: function getAction() {
        if (this.actions.length > 0) return this.actions[0];
        return "";
      }
    });
    cc._RF.pop();
  }, {
    ItemAction: "ItemAction"
  } ],
  ItemImageSheet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1ea7x4e01AJajwQM5Bxqnl", "ItemImageSheet");
    "use strict";
    var ItemImageSheet = cc.Class({
      properties: {
        imageSrc: {
          default: "",
          type: String,
          visible: true
        },
        gridSize: {
          default: 10,
          type: Number,
          visible: true
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ItemLookup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6bf60BR5kxK3KU+FRXwVgN0", "ItemLookup");
    "use strict";
    var CookingPapaController = require("CookingPapaController");
    var ItemData = require("ItemData");
    var ItemImageSheet = require("ItemImageSheet");
    var ItemLookup = cc.Class({
      extends: cc.Component,
      properties: {
        item_json: null,
        imageSheets: {
          default: [],
          type: [ ItemImageSheet ],
          visible: true
        },
        items: null
      },
      ctor: function ctor() {},
      _loadItems: function _loadItems() {
        var _this = this;
        this.items = new Map();
        var itemData = void 0;
        this.item_json.items.forEach(function(item) {
          itemData = new ItemData(item);
          _this.items.set(itemData.id, itemData);
        });
        this.node.getComponent("CookingPapaController").markItemsLoaded();
      },
      getItem: function getItem(itemID) {
        return this.items.get(itemID);
      },
      start: function start() {
        cc.log("ITEM LOOKUP START");
        var self = this;
        var path = "resources/items.json";
        cc.loader.load(cc.url.raw(path), function(err, res) {
          if (null != res) {
            cc.log(res);
            self.item_json = res;
            self._loadItems();
          }
        });
      }
    });
    cc._RF.pop();
  }, {
    CookingPapaController: "CookingPapaController",
    ItemData: "ItemData",
    ItemImageSheet: "ItemImageSheet"
  } ],
  LevelHUDController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "45b31UrPIBFGrQImkKP0uYJ", "LevelHUDController");
    "use strict";
    var LevelHUDView = require("LevelHUDView");
    var LevelHUDController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: null
      },
      onLoad: function onLoad() {
        this._view = this.getComponent(LevelHUDView);
        if (null == this._view) throw new error("Must have LevelHUDView on same node as LevelHUDController");
      },
      setCurrentLevel: function setCurrentLevel(currentLevelNumber) {
        this._view.setCurrentLevel(currentLevelNumber);
      }
    });
    module.exports = LevelHUDController;
    cc._RF.pop();
  }, {
    LevelHUDView: "LevelHUDView"
  } ],
  LevelHUDView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b137dRkxlRHj4Uv8XhXfK+L", "LevelHUDView");
    "use strict";
    var LevelHUDView = cc.Class({
      extends: cc.Component,
      properties: {
        _currentLevelLabel: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      setCurrentLevel: function setCurrentLevel(currentLevelNumber) {
        this._currentLevelLabel.string = currentLevelNumber.toString();
      }
    });
    module.exports = LevelHUDView;
    cc._RF.pop();
  }, {} ],
  Loader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1cf42rMNk9EB5wL6t0QTJb8", "Loader");
    "use strict";
    cc.Class({
      extends: cc.Component,
      hasFinishedLoading: false
    });
    cc._RF.pop();
  }, {} ],
  LoadingController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "36d31JKo4BAZ6GoBXxWwPeV", "LoadingController");
    "use strict";
    var Loader = require("Loader");
    cc.Class({
      extends: cc.Component,
      properties: {
        mainSceneName: "",
        WEB_SCENE_NAME: {
          default: "WebScene",
          visible: false
        },
        MOBILE_SCENE_NAME: {
          default: "MobileScene",
          visible: false
        }
      },
      onLoad: function onLoad() {
        this._determineMainSceneName();
        this._loaders = this.getComponents(Loader);
      },
      update: function update(dt) {
        this.hasFinishedLoading() && this.loadMainScene();
      },
      hasFinishedLoading: function hasFinishedLoading() {
        var loaderIndex;
        for (loaderIndex = 0; loaderIndex < this._loaders.length; loaderIndex++) if (!this._loaders[loaderIndex].hasFinishedLoading) return false;
        return true;
      },
      _determineMainSceneName: function _determineMainSceneName() {
        var isRunViaCreator = this._isRunViaCreator();
        isRunViaCreator ? console.assert(this.mainSceneName, "LoadingController::_determineMainSceneName appears to be running from CocosCreator and scene name is not defined. Please specify scene name to load in IntroScene.") : cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID ? this.mainSceneName = this.MOBILE_SCENE_NAME : cc.sys.isBrowser ? this.mainSceneName = this.WEB_SCENE_NAME : cc.error("LoadingController::_determineMainSceneName unknown os " + cc.sys.os);
      },
      _isRunViaCreator: function _isRunViaCreator() {
        var isRunViaCreatorBrowser = (!window || !window.Lumos) && cc.sys.isBrowser;
        var isRunViaCreatorSimulator = !cc.sys.isBrowser && (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS || cc.sys.os === cc.sys.OS_LINUX);
        var isRunViaCreator = isRunViaCreatorBrowser || isRunViaCreatorSimulator;
        return isRunViaCreator;
      },
      loadMainScene: function loadMainScene() {
        if (this._isLoadingMainScene) return;
        this._isLoadingMainScene = true;
        if (!cc.director.loadScene(this.mainSceneName)) {
          var errorMessage = "LoadingController - Couldn't load the scene: \"" + this.mainSceneName + '". Make sure it exists, or put the proper name into LoadingController in the IntroScene.';
          cc.error(errorMessage);
          window && window.alert && window.alert(errorMessage);
        }
      }
    });
    cc._RF.pop();
  }, {
    Loader: "Loader"
  } ],
  LumosAppFactory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7a5c4YzdKJF9Krl7tdcC3CR", "LumosAppFactory");
    "use strict";
    var LumosAppFactory = cc.Class({});
    LumosAppFactory.createAppInterface = function() {
      var appInterface = null;
      var node = null;
      if (cc.sys.isBrowser || cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS || cc.sys.os === cc.sys.OS_LINUX) {
        node = new cc.Node("WebAppInterface");
        appInterface = node.addComponent("WebAppInterface");
      } else if (cc.sys.os === cc.sys.OS_IOS) {
        node = new cc.Node("iOSAppInterface");
        appInterface = node.addComponent("iOSAppInterface");
      } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        node = new cc.Node("AndroidAppInterface");
        appInterface = node.addComponent("AndroidAppInterface");
      } else cc.error("LumosAppFactory::createAppInterface unknown os " + cc.sys.os);
      return appInterface;
    };
    module.exports = LumosAppFactory;
    cc._RF.pop();
  }, {} ],
  LumosAppInterface: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05b315hIpVPybeGbBFRsGN0", "LumosAppInterface");
    "use strict";
    var AppInterface = require("AppInterface");
    var LumosAppFactory = require("LumosAppFactory");
    var LumosAppInterface = cc.Class({
      extends: cc.Component,
      properties: {
        _appInterface: null
      },
      onLoad: function onLoad() {
        if (LumosAppInterface._instance && LumosAppInterface._instance !== this) {
          this.destroy();
          return;
        }
        this._initializeSingleton();
      },
      _initializeSingleton: function _initializeSingleton() {
        if (!this._appInterface) {
          this._appInterface = LumosAppFactory.createAppInterface();
          this._appInterface.applicationInit();
        }
      },
      start: function start() {},
      applicationLoadComplete: function applicationLoadComplete() {
        if (!this._hasCompletedLoading) {
          this._appInterface.applicationLoadComplete();
          this._hasCompletedLoading = true;
        }
      },
      applicationBegin: function applicationBegin() {
        if (null == this._appInterface) return;
        this._appInterface.applicationBegin();
      },
      applicationPause: function applicationPause() {
        if (null == this._appInterface) return;
        this._appInterface.applicationPause();
      },
      applicationResume: function applicationResume() {
        if (null == this._appInterface) return;
        this._appInterface.applicationResume();
      },
      applicationQuit: function applicationQuit() {
        if (null == this._appInterface) return;
        this._appInterface.applicationQuit();
      },
      applicationComplete: function applicationComplete(dataHash) {
        if (null == this._appInterface) return;
        this._appInterface.applicationComplete(dataHash);
      },
      applicationHeartbeat: function applicationHeartbeat(dataHash) {
        if (null == this._appInterface) return;
        this._appInterface.applicationHeartbeat(dataHash);
      },
      getParameters: function getParameters() {
        var parameters = null;
        if (null == this._appInterface) return parameters;
        parameters = this._appInterface.parameters;
        return parameters;
      },
      loadAsset: function loadAsset(asset, extension, cb) {
        this._appInterface.loadAsset(asset, extension, cb);
      }
    });
    LumosAppInterface._instance = null;
    LumosAppInterface.getInstance = function() {
      if (!LumosAppInterface._instance) {
        var node = new cc.Node("LumosAppInterface");
        LumosAppInterface._instance = node.addComponent(LumosAppInterface);
        LumosAppInterface._instance._initializeSingleton();
      }
      return LumosAppInterface._instance;
    };
    module.exports = LumosAppInterface;
    cc._RF.pop();
  }, {
    AppInterface: "AppInterface",
    LumosAppFactory: "LumosAppFactory"
  } ],
  LumosAppUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "65dfftGSp5HQ4R+m2kpHVKM", "LumosAppUtil");
    "use strict";
    var LumosAppUtil = cc.Class({});
    LumosAppUtil.DEFAULT_LOCALE = "en_us";
    LumosAppUtil.isDebugMode = function(parameters) {
      if (null == parameters) return true;
      var debugMode = false;
      parameters.hasOwnProperty("environment") ? "staging" === parameters.environment && (debugMode = true) : parameters.hasOwnProperty("debug_mode") && ("true" !== parameters.debug_mode && true !== parameters.debug_mode || (debugMode = true));
      return debugMode;
    };
    LumosAppUtil.getLastSessionLevel = function(parameters) {
      var level = 0;
      null != parameters && (parameters.hasOwnProperty("last_results") ? parameters.last_results.hasOwnProperty("user_level") && (level = parameters.last_results.user_level) : parameters.hasOwnProperty("level") && (level = parameters.level));
      return level;
    };
    LumosAppUtil.getSavedUserData = function(parameters) {
      if (null == parameters) return null;
      var savedUserData = null;
      var lastResults = null;
      if (parameters.hasOwnProperty("last_results")) {
        lastResults = parameters.last_results;
        if (lastResults.hasOwnProperty("gameStats")) {
          var gameStats = lastResults.gameStats;
          gameStats.hasOwnProperty("savedUserData") && (savedUserData = gameStats.savedUserData);
        }
        lastResults.hasOwnProperty("savedUserData") && (savedUserData = lastResults.savedUserData);
      }
      null == savedUserData && parameters.hasOwnProperty("savedUserData") && null != parameters.savedUserData.data && null != parameters.savedUserData.data.data && (savedUserData = parameters.savedUserData.data.data);
      return savedUserData;
    };
    LumosAppUtil.isHowToPlay = function(parameters) {
      if (null == parameters) return;
      var isStartInTutorial = false;
      parameters.hasOwnProperty("show_tutorial") ? isStartInTutorial = parameters.show_tutorial : parameters.hasOwnProperty("how_to_play") && (isStartInTutorial = "true" === parameters.how_to_play || true === parameters.how_to_play);
      return isStartInTutorial;
    };
    LumosAppUtil.getLocale = function(parameters) {
      if (null == parameters) return "";
      var locale = "";
      parameters.hasOwnProperty("locale_id") && (locale = parameters.locale_id);
      return locale;
    };
    LumosAppUtil.hashStat = function(dataHash, statValue, bestStatKey) {
      console.error("LumosAppUtil.hashStat() not yet implemented");
    };
    LumosAppUtil.test = function() {
      console.log("[LumosAppUtil.test()] Beginning LumosAppUtil tests");
      var p1 = {};
      p1.environment = "dev";
      p1.debug_mode = true;
      console.log("[LumosAppUtil.test()] env=dev, debug_mode=true: " + LumosAppUtil.isDebugMode(p1));
      var p2 = {};
      p2.environment = "staging";
      p2.debug_mode = "true";
      console.log("[LumosAppUtil.test()] env=staging, debug_mode='true': " + LumosAppUtil.isDebugMode(p2));
    };
    module.exports = LumosAppUtil;
    cc._RF.pop();
  }, {} ],
  LumosQueue: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cd329ktMrVIMZyWmlMYoDho", "LumosQueue");
    "use strict";
    var LumosQueue = cc.Class({
      properties: {
        _data: []
      },
      ctor: function ctor() {
        this._data = [];
      },
      enqueue: function enqueue(object) {
        this._data.push(object);
      },
      dequeue: function dequeue() {
        var object = null;
        this._data.length > 0 && (object = this._data.shift());
        return object;
      },
      count: function count() {
        var result = this._data.length;
        return result;
      },
      contains: function contains(object) {
        var result = !(this._data.indexOf(object) < 0);
        return result;
      }
    });
    module.exports = LumosQueue;
    cc._RF.pop();
  }, {} ],
  LumosRandom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c108b5dZ5lOopy8sdJax+D+", "LumosRandom");
    "use strict";
    var LumosRandom = cc.Class({});
    LumosRandom.seed = 123456;
    var PERIOD = 2147483647;
    LumosRandom.nextInt = function() {
      return LumosRandom.seed = 48271 * LumosRandom.seed % PERIOD;
    };
    LumosRandom.value = function() {
      return LumosRandom.nextInt() / (PERIOD - 1);
    };
    LumosRandom.range = function(min, max) {
      if (Math.floor(min) === min && Math.floor(max) === max) return LumosRandom.integerExclusive(min, max);
      return LumosRandom.float(min, max);
    };
    LumosRandom.integer = function(min, max, exclusiveMin, exclusiveMax) {
      var range = max - min + (exclusiveMin ? exclusiveMax ? -1 : 0 : exclusiveMax ? 0 : 1);
      var add = exclusiveMin ? min + 1 : min;
      return LumosRandom.nextInt() % range + add;
    };
    LumosRandom.integerExclusive = function(min, max) {
      return LumosRandom.integer(min, max, false, true);
    };
    LumosRandom.float = function(min, max) {
      var range = max - min;
      return LumosRandom.value() * range + min;
    };
    module.exports = LumosRandom;
    cc._RF.pop();
  }, {} ],
  LumosityPauseController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "de43e3FjmxGypiSouxkj8Xb", "LumosityPauseController");
    "use strict";
    var DebugUtil = require("DebugUtil");
    var LumosityPauseView = require("LumosityPauseView");
    var AnimationView = require("AnimationView");
    var ScreenView = require("ScreenView");
    var InputController = require("InputController");
    var InputView = require("InputView");
    var SceneNodeView = require("SceneNodeView");
    var LumosityPauseController = cc.Class({
      properties: {
        isEscapeNow: false,
        isEscapeAnytime: false,
        isGamePlaying: false,
        isInputEnabledMenu: true,
        isInputEnabledPauseButton: true,
        isInputEnabledTutorialButton: true,
        isPaused: false,
        isPortrait: false,
        isPracticeMode: false,
        isQuitEnabled: false,
        isShowButton: false,
        isShowTutorialButton: false,
        isSound: true,
        isVerbose: false,
        canvasState: "",
        completedNow: "",
        pauseButtonCompletedNow: "",
        pauseButtonState: "",
        state: "",
        stateBefore: "",
        stateNow: "",
        skipTutorialButtonCompleteNow: "",
        animation: "",
        isPopUp: false,
        popUpCompletedNow: "",
        pauseMenuInAnimationCompleteCallback: function pauseMenuInAnimationCompleteCallback() {},
        pauseMenuOutAnimationCompleteCallback: function pauseMenuOutAnimationCompleteCallback() {}
      },
      view: null,
      input: null,
      _isSimulatePauseAtStart: false,
      ctor: function ctor() {
        this.input = new InputController();
      },
      setup: function setup() {
        this.view = LumosityPauseView.getInstance();
        this.view.controller = this;
        this.view.setup();
        this.view.pauseMenuInAnimationCompleteCallback = this._onPauseMenuInAnimationComplete.bind(this);
        this.view.pauseMenuOutAnimationCompleteCallback = this._onPauseMenuOutAnimationComplete.bind(this);
        this._updateIsPortrait(true);
        null != this.view.sharedPauseParent && this.view.additionalPauseParents.push(this.view.sharedPauseParent);
        null != this.view.pauseParent && this.view.additionalPauseParents.push(this.view.pauseParent);
        this._setupExcludesFromPause();
        var length = this.view.additionalPauseParents.length;
        length > 0 && null == this.view.animatorOwner && (this.view.animatorOwner = this.view.additionalPauseParents[length - 1]);
        this.input.view.listen(this.view.quitButton);
        this.input.view.listen(this.view.resumeButton);
        this.input.view.listen(this.view.restartButton);
        this.input.view.listen(this.view.howToPlayButton);
        this.input.view.listen(this.view.muteSoundButton);
        this.input.view.listen(this.view.pauseButtonDefault);
        this.input.view.listen(this.view.pauseButtonRetracted);
        this.input.view.listen(this.view.pauseButtonExpanded);
        this.input.view.listen(this.view.skipTutorialButton);
        this.isInputEnabledMenu = true;
        this.isInputEnabledPauseButton = true;
        this.isInputEnabledTutorialButton = true;
        if (this.isSimulatePauseAtStart) {
          DebugUtil.log("LumosityPauseController.Setup: SIMULATING PAUSE AT START.");
          this.view.isPausedNow = true;
          this.isVerbose = true;
          AnimationView.verboseObject = this.view.pauseButtons;
        }
      },
      _setupExcludesFromPause: function _setupExcludesFromPause() {
        null != this.view.pauseButtonDefault && this.view.excludesFromPause.push(this.view.pauseButtonDefault);
        null != this.view.pauseButtonExpanded && this.view.excludesFromPause.push(this.view.pauseButtonExpanded);
        null != this.view.pauseButtonRetracted && this.view.excludesFromPause.push(this.view.pauseButtonRetracted);
        null != this.view.skipTutorial && this.view.excludesFromPause.push(this.view.skipTutorial);
        for (var index = 0; index < this.view.additionalPauseParents.length; index++) this.view.excludesFromPause.push(this.view.additionalPauseParents[index]);
      },
      _updateInput: function _updateInput() {
        this.input.update();
        null != this.view && (this.isEscapeNow = InputView.isEscapeDown());
        this.updateEscape(this.isEscapeNow);
        if (!this.isInputEnabled()) return this.state;
        var next = this.state;
        if (null == this.view) ; else if (this.view.pauseButtonDefault.name === this.input.buttonName) next = "pause"; else if (this.view.pauseButtonRetracted.name === this.input.buttonName) next = "pause"; else if (this.view.pauseButtonExpanded.name === this.input.buttonName) next = "resume"; else if (this.view.quitButton.name === this.input.buttonName) next = "quit"; else if (this.view.resumeButton.name === this.input.buttonName) next = "resume"; else if (this.view.restartButton.name === this.input.buttonName) next = "restart"; else if (this.view.howToPlayButton.name === this.input.buttonName) next = "howToPlay"; else if (this.view.muteSoundButton.name === this.input.buttonName) {
          this.isSound = !this.isSound;
          next = this.isSound ? "hearSound" : "muteSound";
        } else this.view.skipTutorialButton.name === this.input.buttonName && (next = "skipTutorial");
        this.isVerbose && next != this.state && DebugUtil.Log("LumosityPauseController.UpdateInput: <" + this.state + "> to <" + next + ">");
        return next;
      },
      popUp: function popUp(isBegin) {
        this.isPopUp = isBegin;
        var state = isBegin ? "begin" : "end";
        AnimationView.setState(this.view.popUp, state);
      },
      updatePopUp: function updatePopUp() {
        if (null == this.view) return;
        this.popUpCompletedNow = AnimationView.completedNow(this.view.popUp);
        this.isPopUp && ("begin" === this.popUpCompletedNow || this.InputView.isAnyMouseButtonDown()) && this.popUp(false);
      },
      update: function update() {
        this.updateState();
        this.updateView();
      },
      _updateIsPortrait: function _updateIsPortrait(isForce) {
        "undefined" === typeof isForce && (isForce = false);
        var screenIsPortrait = ScreenView.isPortrait();
        if (isForce || null != this.view && this.isPortrait != screenIsPortrait) {
          this.isPortrait = screenIsPortrait;
          this.canvasState = this.isPortrait ? "mobile" : "web";
          null != this.view && AnimationView.setState(this.view.canvas, this.canvasState, true);
        }
      },
      updatePauseInstant: function updatePauseInstant(isPausedNow) {
        var isInstant = false;
        if (isPausedNow && this.isGamePlaying) {
          null != this.view && (this.view.isPausedNow = false);
          if (!this.isPaused) {
            isInstant = true;
            this.state = "pauseInstant";
          }
        }
        return isInstant;
      },
      updateState: function updateState() {
        this.updateAnimation();
        this.updatePopUp();
        this._updateIsPortrait();
        this.state = this._updateInput();
        this.updatePauseInstant(null != this.view && this.view.isPausedNow);
        if (this.stateBefore != this.state) {
          this.isVerbose && DebugUtil.log("LumosityPauseController.Update: from <" + this.stateBefore + "> to <" + state + ">");
          this.stateNow = this.state;
          this.stateBefore = this.state;
          if ("pause" === this.state || "pauseInstant" === this.state) this.isPaused = true; else if ("resume" === this.state || "restart" === this.state || "skipTutorial" === this.state || "howToPlay" === this.state) {
            this.isPaused = false;
            this.isGamePlaying = true;
          }
        } else this.stateNow = "";
        null == this.view && (this.isEscapeNow = false);
      },
      isInputEnabled: function isInputEnabled() {
        return true;
      },
      updateEscape: function updateEscape(isEscapeDownNow) {
        this.isEscapeNow = isEscapeDownNow;
        var isQuitNow = this.isEscapeNow && isQuitEnabled;
        isQuitNow && !this.isPaused ? this.state = "quit" : (this.isPortrait || this.isGamePlaying) && this.isEscapeNow && this.togglePause();
      },
      togglePause: function togglePause() {
        var isChange = false;
        if (!this.isPaused || "pause" !== this.state && "pauseInstant" !== this.state) {
          if (!this.isPaused && "pause" != this.state && "pauseInstant" != this.state) {
            this.state = "pause";
            isChange = true;
          }
        } else {
          this.state = "resume";
          this.isChange = true;
        }
        isChange && this.isVerbose && DebugUtil.log("LumosityPauseController.TogglePause: " + this.state);
      },
      updateView: function updateView() {
        "pauseInstant" === this.stateNow ? this.show(true) : "pause" === this.stateNow ? this.show(false) : "resume" === this.stateNow ? this.hide() : "restart" === this.stateNow ? this.hide() : "howToPlay" === this.stateNow ? this.hide() : "quit" === this.stateNow ? this.hide() : "muteSound" === this.state ? this._updateSoundToggle() : "hearSound" === this.stateNow ? this._updateSoundToggle() : "skipTutorial" === this.stateNow;
      },
      _updateSoundToggle: function _updateSoundToggle() {
        if (null == this.view) return;
        SceneNodeView.setVisible(this.view.soundOnGroup, this.isSound);
        SceneNodeView.setVisible(this.view.soundOffGroup, !this.isSound);
      },
      updateAnimation: function updateAnimation() {
        null != this.view && (this.completedNow = AnimationView.completedNow(this.view.animatorOwner));
        if ("PauseMenuOn" === this.completedNow) {
          this.isVerbose && DebugUtil.log("LumosityPauseController.UpdateAnimation: PauseMenuIn animation finished");
          this.isInputEnabledMenu = true;
        } else if ("PauseMenuOff" === this.completedNow) {
          this.isVerbose && DebugUtil.log("LumosityPauseController.UpdateAnimation: PauseMenuOut animation finished");
          this.isInputEnabledMenu = true;
          this.isPaused = "quit" == state;
        }
        null != this.view && (this.pauseButtonCompletedNow = AnimationView.completedNow(this.view.pauseButtons));
        if ("PauseButtonOn" === this.pauseButtonCompletedNow) {
          this.isVerbose && DebugUtil.Log("LumosityPauseController.UpdateAnimation: PauseIn animation finished");
          this.isInputEnabledPauseButton = true;
        } else if ("PauseButtonOff" === this.pauseButtonCompletedNow) {
          this.isVerbose && DebugUtil.log("LumosityPauseController.UpdateAnimation: PauseButtonOff animation finished");
          this.isInputEnabledPauseButton = true;
        }
        null != this.view && (this.skipTutorialButtonCompleteNow = AnimationView.completedNow(this.view.skipTutorial));
        "SkipTutorialIn" === this.skipTutorialButtonCompleteNow ? this.isInputEnabledTutorialButton = true : "SkipTutorialOut" === this.skipTutorialButtonCompleteNow && (this.isInputEnabledTutorialButton = true);
      },
      howToPlay: function howToPlay() {
        this.state = "howToPlay";
      },
      pause: function pause() {
        this.state = "pause";
      },
      quit: function quit() {
        this.state = "quit";
      },
      restart: function restart() {
        this.state = "restart";
      },
      resume: function resume() {
        this.state = "resume";
      },
      show: function show(isInstant) {
        this.isInputEnabledMenu = isInstant;
        this.animation = isInstant ? "PauseMenuOnInstant" : "PauseMenuOn";
        if (null != this.view) {
          SceneNodeView.setVisible(this.view.pauseButtonDefault, false);
          SceneNodeView.setVisible(this.view.pauseButtonExpanded, true);
          SceneNodeView.setVisible(this.view.pauseButtonRetracted, false);
        }
        (this.isPracticeMode || isInstant) && this.showButton(true, isInstant);
        this.isPracticeMode && this.showSkipTutorialButton(false);
        if (isInstant) {
          this.isInputEnabledPauseButton = true;
          this.isInputEnabledTutorialButton = true;
        }
        this.view.show(this.animation);
      },
      hide: function hide() {
        this.isInputEnabledMenu = false;
        this.animation = "PauseMenuOff";
        if (null != this.view) {
          SceneNodeView.setVisible(this.view.pauseButtonDefault, false);
          SceneNodeView.setVisible(this.view.pauseButtonExpanded, false);
          SceneNodeView.setVisible(this.view.pauseButtonRetracted, true);
        }
        if (this.isPracticeMode) {
          this.showButton(false);
          this.showSkipTutorialButton(true);
        }
        this.view.hide(this.animation);
      },
      showButton: function showButton(isVisible) {
        var isInstant = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        "undefined" === typeof isInstant && (isInstant = false);
        var isInstantlyVisible = isVisible && isInstant;
        if (this.isShowButton != isVisible || isInstantlyVisible) {
          this.pauseButtonState = isVisible ? "PauseButtonOn" : "PauseButtonOff";
          this.isShowButton = isVisible;
          this.isGamePlaying = isVisible;
          null != this.view && AnimationView.play(this.view.pauseButtons, this.pauseButtonState);
          this.isInputEnabledPauseButton = false;
          this.isVerbose && DebugUtil.log("LumosityPauseController.ShowButton: " + isVisible + " pauseButtonState " + pauseButtonState);
        } else this.isVerbose && DebugUtil.log("LumosityPauseController.ShowButton: Ignoring, because it was already " + isVisible);
      },
      showSkipTutorialButton: function showSkipTutorialButton(isVisible) {
        if (this.isShowTutorialButton != isVisible) {
          this.isShowTutorialButton = isVisible;
          this.isGamePlaying = isVisible;
          var state = isVisible ? "SkipTutorialOn" : "SkipTutorialOff";
          null != this.view && AnimationView.play(this.view.skipTutorial, state);
          this.isInputEnabledTutorialButton = false;
          this.isVerbose && DebugUtil.log("LumosityPauseController.ShowSkipTutorialButton: " + isVisible + " state " + state);
        } else this.isVerbose && DebugUtil.log("LumosityPauseController.ShowSkipTutorialButton: Ignoring, because it was already " + isVisible);
      },
      _onPauseMenuInAnimationComplete: function _onPauseMenuInAnimationComplete() {
        this.pauseMenuInAnimationCompleteCallback();
      },
      _onPauseMenuOutAnimationComplete: function _onPauseMenuOutAnimationComplete() {
        this.pauseMenuOutAnimationCompleteCallback();
      },
      handleApplicationPaused: function handleApplicationPaused(isPausedNow) {
        if (true !== this.isGamePlaying) return;
        null != this.view && (this.view.isPausedNow = isPausedNow);
        this.updatePauseInstant(isPausedNow) && this.show(true);
      }
    });
    module.exports = LumosityPauseController;
    cc._RF.pop();
  }, {
    AnimationView: "AnimationView",
    DebugUtil: "DebugUtil",
    InputController: "InputController",
    InputView: "InputView",
    LumosityPauseView: "LumosityPauseView",
    SceneNodeView: "SceneNodeView",
    ScreenView: "ScreenView"
  } ],
  LumosityPauseView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "421b7oylGVOYY1wwaOkWe/Y", "LumosityPauseView");
    "use strict";
    var SceneNodeView = require("SceneNodeView");
    var LumosityPauseController = require("LumosityPauseController");
    var LumosityPauseView = cc.Class({
      extends: cc.Component,
      properties: {
        sharedPauseParent: null,
        pauseParent: null,
        additionalPauseParents: [],
        animatorOwner: null,
        excludesFromPause: [],
        canvas: null,
        pauseButtons: null,
        pauseButtonDefault: null,
        pauseButtonExpanded: null,
        pauseButtonRetracted: null,
        skipTutorial: null,
        skipTutorialButton: null,
        popUp: null,
        popUpText: null,
        quitButton: null,
        resumeButton: null,
        restartButton: null,
        howToPlayButton: null,
        muteSoundButton: null,
        soundOnGroup: null,
        soundOffGroup: null,
        pauseMenuContainer: null,
        controller: null,
        isPausedNow: false,
        pauseMenuInAnimationCompleteCallback: function pauseMenuInAnimationCompleteCallback() {},
        pauseMenuOutAnimationCompleteCallback: function pauseMenuOutAnimationCompleteCallback() {}
      },
      onLoad: function onLoad() {
        LumosityPauseView.instance = this;
        cc.game.on(cc.game.EVENT_GAME_CANVAS_BLUR, function() {
          cc.log("[GAME] EVENT_GAME_CANVAS_BLUR");
          this.onApplicationPause(true);
        }.bind(this));
        cc.game.on(cc.game.EVENT_HIDE, function() {
          cc.log("[GAME] EVENT_HIDE");
          this.onApplicationPause(true);
        }.bind(this));
      },
      setup: function setup() {
        this.canvas = SceneNodeView.find("UI/UICanvas", this.canvas);
        this.skipTutorial = SceneNodeView.getChild(this.canvas, "SkipTutorialButton", this.skipTutorial);
        this.skipTutorialButton = SceneNodeView.getChild(this.skipTutorial, "Container/Background", this.skipTutorialButton);
        this.pauseButtons = SceneNodeView.getChild(this.canvas, "PauseButton", this.pauseButtons);
        this.pauseButtonDefault = SceneNodeView.getChild(this.pauseButtons, "Container/PauseButtonDefault", this.pauseButtonDefault);
        this.pauseButtonExpanded = SceneNodeView.getChild(this.pauseButtons, "Container/PauseButtonExpanded", this.pauseButtonExpanded);
        this.pauseButtonRetracted = SceneNodeView.getChild(this.pauseButtons, "Container/PauseButtonRetracted", this.pauseButtonRetracted);
        this.pauseParent = SceneNodeView.find("PauseParent", this.pauseParent);
        this.sharedPauseParent = SceneNodeView.getChild(this.canvas, "SharedPauseParent", this.sharedPauseParent);
        this.quitButton = SceneNodeView.getChild(this.sharedPauseParent, "PauseMenu/ButtonContainer/Quit", this.quitButton);
        this.resumeButton = SceneNodeView.getChild(this.sharedPauseParent, "PauseMenu/ButtonContainer/Resume", this.resumeButton);
        this.restartButton = SceneNodeView.getChild(this.sharedPauseParent, "PauseMenu/ButtonContainer/Restart", this.restartButton);
        this.howToPlayButton = SceneNodeView.getChild(this.sharedPauseParent, "PauseMenu/ButtonContainer/HowToPlay", this.howToPlayButton);
        this.muteSoundButton = SceneNodeView.getChild(this.sharedPauseParent, "PauseMenu/ButtonContainer/MuteSound", this.muteSoundButton);
        this.soundOnGroup = SceneNodeView.getChild(this.muteSoundButton, "ContentsOn", this.soundOnGroup);
        this.soundOffGroup = SceneNodeView.getChild(this.muteSoundButton, "ContentsOff", this.soundOffGroup);
        this.popUp = SceneNodeView.getChild(this.sharedPauseParent, "PopUpWeb/PopUpAnimationContainer", this.popUp);
        this.popUpText = SceneNodeView.getChild(this.popUp, "Black Box/White Box/Text", this.popUpText);
        this.pauseMenuContainer = SceneNodeView.getChild(this.sharedPauseParent, "PauseMenu/ButtonContainer", this.pauseMenuContainer);
      },
      setupIsQuit: function setupIsQuit(isQuit) {
        SceneNodeView.setVisible(quitButton, isQuit);
      },
      show: function show(animationName) {
        var animation = this.sharedPauseParent.getComponent(cc.Animation);
        animation.play(animationName, void 0, false);
        animation.on("finished", this._onPauseMenuInAnimationComplete, this);
      },
      _onPauseMenuInAnimationComplete: function _onPauseMenuInAnimationComplete() {
        var animation = this.sharedPauseParent.getComponent(cc.Animation);
        animation.off("finished");
        this.pauseMenuInAnimationCompleteCallback();
      },
      hide: function hide(animationName) {
        var animation = this.sharedPauseParent.getComponent(cc.Animation);
        animation.play(animationName, void 0, false);
        animation.on("finished", this._onPauseMenuOutAnimationComplete, this);
      },
      _onPauseMenuOutAnimationComplete: function _onPauseMenuOutAnimationComplete() {
        var animation = this.sharedPauseParent.getComponent(cc.Animation);
        animation.off("finished", this._onPauseMenuOutAnimationComplete, this);
        this.pauseMenuOutAnimationCompleteCallback();
      },
      onApplicationPause: function onApplicationPause(isPaused) {
        null != this.controller && this.controller.handleApplicationPaused(isPaused);
      }
    });
    LumosityPauseView.instance = null;
    LumosityPauseView.getInstance = function() {
      return LumosityPauseView.instance;
    };
    module.exports = LumosityPauseView;
    cc._RF.pop();
  }, {
    LumosityPauseController: "LumosityPauseController",
    SceneNodeView: "SceneNodeView"
  } ],
  Metadata: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48f238ULEFAw7g86I5k7RKV", "Metadata");
    "use strict";
    var Metadata = cc.Class({
      properties: {
        trials: {
          default: []
        },
        responses: {
          default: []
        },
        _begin: 0,
        trialBeginTime: 0,
        responseBeginTime: 0,
        _elapsedSeconds: 0,
        _elapsedMilliseconds: 0,
        isReportNow: false,
        _isReport: false,
        session: {
          default: {}
        },
        trial: {
          default: {}
        },
        response: {
          default: {}
        },
        tutorial: {
          default: {}
        },
        isVerboseTrial: false,
        isVerbose: false
      },
      ctor: function ctor() {},
      nextSession: function nextSession(isPracticeMode) {
        this._isReport = false;
        this.isReportNow = false;
        this.session = {};
        this.session["num_correct"] = 0;
        this.session["num_tries"] = 0;
        this.session["num_pauses"] = 0;
        this.session["num_defocus"] = 0;
        this.session["num_restart"] = 0;
        this.session["width"] = 0;
        this.session["height"] = 0;
        this.session["locale_id"] = "";
        this.session["default_locale_id"] = "";
        this.session["version"] = "";
        this.session["seed"] = "";
        this.trial = null;
        this.response = null;
        this.responses = [];
        this.trials = [];
        this._elapsedSeconds = 0;
        this.deltaMilliseconds = 0;
        this._elapsedMilliseconds = 0;
        this.sessionBeginTime = 0;
      },
      startTrial: function startTrial() {
        this.trial = {};
        this.trialBeginTime = this.getMilliseconds();
        this.trial["time_offset"] = Math.round(this.trialBeginTime - this._begin);
        this.trial["correct"] = "";
        this.trial["num_responses"] = 0;
        this.trial["num_tries"] = 0;
        this.trials.push(this.trial);
        if (this.isVerboseTrial && this.isVerbose && null != this.trial) {
          var trialString = JSON.stringify(this.trial);
          cc.log("Metadata.ResponseBegin: " + trialString);
        }
      },
      responseBegin: function responseBegin() {
        this.responseBeginTime = this.getMilliseconds();
        this.response = {};
        this.response["correct"] = "";
        this.response["time_offset"] = this.responseBeginTime - this._begin;
        this.response["response_time"] = -1;
        this.response["trial_id"] = -1;
        this.responses.push(this.response);
        if (this.isVerboseTrial && this.isVerbose && null != this.response) {
          var responseString = JSON.stringify(this.response);
          cc.log("Metadata.ResponseBegin: " + responseString);
        }
      },
      responseEnd: function responseEnd(isCorrect) {
        this.response["correct"] = isCorrect ? "T" : "F";
        this.trial["num_responses"] = parseInt(this.trial["num_responses"]) + 1;
        this.trial["num_tries"] = this.trial["num_responses"];
        this.responseBeginTime >= 0 && this.responseBeginTime < this.getMilliseconds() && (this.response["response_time"] = this.getResponseMilliseconds());
        this.response["trial_id"] = this.trials.length - 1;
      },
      endTrial: function endTrial(correct) {
        this.trial["correct"] = correct ? "T" : "F";
        correct && (this.session["num_correct"] = parseInt(this.session["num_correct"]) + 1);
        if (this.isVerboseTrial && this.isVerbose) {
          var trialString = JSON.stringify(this.trial);
          cc.log("Metadata.ResponseBegin: " + trialString);
        }
      },
      getMilliseconds: function getMilliseconds() {
        return this._elapsedMilliseconds;
      },
      getResponseMilliseconds: function getResponseMilliseconds() {
        return this.getMilliseconds() - this.responseBeginTime;
      },
      toCSV: function toCSV(data) {
        if (data.length <= 0) return "";
        var dataCSV = "";
        var keys = [];
        var key;
        for (key in data[0]) if (data[0].hasOwnProperty(key)) {
          keys.push(key);
          dataCSV += key + ",";
        }
        if (keys.length <= 0) return "";
        dataCSV = dataCSV.substring(0, dataCSV.length - 1) + "/";
        var objectIndex;
        var keyIndex;
        for (objectIndex = 0; objectIndex < data.length; objectIndex++) {
          for (keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            dataCSV += data[objectIndex][keys[keyIndex]];
            keyIndex < keys.length - 1 && (dataCSV += ",");
          }
          objectIndex < data.length - 1 && (dataCSV += "/");
        }
        dataCSV.replace("/\n/g", "/");
        return dataCSV;
      },
      getTrialCSV: function getTrialCSV() {
        return this.toCSV(this.trials);
      },
      getResponseCSV: function getResponseCSV() {
        return this.toCSV(this.responses);
      },
      endGame: function endGame() {
        this.session["num_trials"] = this.trials.length;
        this.session["playTime"] = Math.round(this.getMilliseconds() - this.sessionBeginTime);
        this.session["num_responses"] = this.responses.length;
        this.session["num_tries"] = this.responses.length;
      },
      merge: function merge(first, second) {
        console.error("Metadata.merge() not yet implemented");
      },
      update: function update(deltaSeconds) {
        this._elapsedSeconds += deltaSeconds;
        this._elapsedMilliseconds = Metadata.toMilliseconds(this._elapsedSeconds);
        this.deltaMilliseconds = Metadata.toMilliseconds(deltaSeconds);
        this.isReportNow = false;
        if (this.reportPending <= 0 && false === this._isReport) {
          this._isReport = true;
          this.isReportNow = true;
          this.reportPending = true;
        }
      }
    });
    Metadata.toMilliseconds = function(seconds) {
      return parseInt(1e3 * seconds);
    };
    Metadata.keys = function(hash) {
      console.log("Metadata.keys not implemented");
    };
    Metadata.values = function(hash) {
      console.log("Metadata.values not implemented");
    };
    Metadata.props = function(arrayOfObjects, key) {
      console.log("Metadata.props not implemented");
    };
    Metadata.commaToTab = function(escapedCsv) {
      console.log("Metadata.commaToTab not implemented");
    };
    module.exports = Metadata;
    cc._RF.pop();
  }, {} ],
  OvenUIController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "726d5NPlSdN9KDJVuQeMV7D", "OvenUIController");
    "use strict";
    var OvenUIController = cc.Class({
      extends: cc.Component,
      properies: {},
      ctor: function ctor() {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  PanelToggleController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "20a64Mc3vVMka304ebS0ByN", "PanelToggleController");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _panelView: {
          type: cc.Node,
          default: null,
          visible: true
        },
        _toggle: {
          type: cc.Toggle,
          default: null,
          visible: false
        },
        toggleCheckedCallback: {
          default: null,
          visible: false
        },
        toggleUncheckedCallback: {
          default: null,
          visible: false
        }
      },
      onLoad: function onLoad() {
        this._toggle = this.node.getComponent(cc.Toggle);
        this._panelView.active = this._toggle.isChecked;
      },
      handleToggle: function handleToggle() {
        if (!this._panelView) return;
        if (true === this._toggle.isChecked) {
          this._panelView.active = true;
          this.toggleCheckedCallback();
        } else {
          this._panelView.active = false;
          this.toggleUncheckedCallback();
        }
      },
      show: function show() {
        this.node.active = true;
      },
      hide: function hide() {
        this.node.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  RecipieList: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "26b73RET0JJFqQPaVCTiQNF", "RecipieList");
    "use strict";
    var CookingPapaController = require("CookingPapaController");
    var ItemLookup = require("ItemLookup");
    var Recipie = require("Recipie");
    var RecipieList = cc.Class({
      extends: cc.Component,
      properties: {
        recipieJson: null,
        itemLookup: {
          default: null,
          type: ItemLookup,
          visible: false
        },
        recipies: {
          default: {},
          type: Recipie,
          visible: true
        }
      },
      ctor: function ctor() {},
      getRecipie: function getRecipie(id) {
        if (this.recipies.hasOwnProperty(id)) return this.recipies[id];
        return null;
      },
      _parseRecipies: function _parseRecipies() {
        var _this = this;
        if (null === this.recipieJson) return;
        cc.log(this.recipieJson);
        this.recipieJson.recipies.forEach(function(recipieData) {
          var newRecipie = new Recipie(recipieData, _this.itemLookup);
          _this.recipies[newRecipie.id] = newRecipie;
        });
      },
      reset: function reset() {
        this._parseRecipies();
      },
      loadRecipies: function loadRecipies() {
        this.itemLookup = this.node.getComponent("ItemLookup");
        var self = this;
        var path = "resources/recipies.json";
        cc.loader.load(cc.url.raw(path), function(err, res) {
          if (null != res) {
            self.recipieJson = res;
            self._parseRecipies();
            self.node.getComponent("CookingPapaController").markRecipiesLoaded();
          }
        });
      }
    });
    cc._RF.pop();
  }, {
    CookingPapaController: "CookingPapaController",
    ItemLookup: "ItemLookup",
    Recipie: "Recipie"
  } ],
  RecipieStepController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f10e6Q4e21B/LzdrORS+tRk", "RecipieStepController");
    "use strict";
    var RecipieStepController = cc.Class({
      extends: cc.Component,
      properties: {
        instructionsText: {
          default: null,
          type: cc.Label,
          visible: true
        },
        itemsParent: {
          default: null,
          type: cc.Node,
          visible: true
        },
        itemPrefab: {
          default: null,
          type: cc.Prefab,
          visible: true
        }
      },
      init: function init(data, itemLookup) {
        var _this = this;
        this.instructionsText.string = data.stepNum + ") " + data.stepText;
        var itemData = null;
        data.itemIDs.forEach(function(itemID) {
          itemData = itemLookup.getItem(itemID);
          _this._addItem(itemData);
        });
      },
      _addItem: function _addItem(itemData) {
        var newItem = cc.instantiate(this.itemPrefab);
        newItem.getComponent("ItemController").init(itemData);
        this.itemsParent.addChild(newItem);
      }
    });
    cc._RF.pop();
  }, {} ],
  RecipieStep: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fa990DcYqVHBIm4iTIYEaKB", "RecipieStep");
    "use strict";
    var RecipieStep = cc.Class({
      properties: {
        stepNum: 0,
        stepText: "",
        itemsIDs: [],
        actions: []
      },
      ctor: function ctor(data, stepNum) {
        var _this = this;
        this.stepNum = stepNum;
        this.stepText = data.text;
        this.itemIDs = data.items.slice();
        data.actions.forEach(function(action) {
          _this.actions.push(action.slice());
        });
      },
      _makeArrayHash: function _makeArrayHash(a) {
        return a.sort().join("_");
      },
      getHashes: function getHashes() {
        return this.actions.map(this._makeArrayHash);
      },
      applyAction: function applyAction(currentAction) {
        var currHash = this._makeArrayHash(currentAction);
        var self = this;
        var startingActionsLength = this.actions.length;
        this.actions = this.actions.filter(function(action) {
          return self._makeArrayHash(action) != currHash;
        });
        if (this.actions.length < startingActionsLength) return true;
        return false;
      },
      checkForCompletion: function checkForCompletion() {
        return this.actions.length < 1;
      }
    });
    cc._RF.pop();
  }, {} ],
  Recipie: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46cfd4KQDNB+a1xX9edlgku", "Recipie");
    "use strict";
    var RecipieStep = require("RecipieStep");
    var Recipie = cc.Class({
      properties: {
        name: "",
        id: 0,
        steps: {
          default: [],
          type: RecipieStep,
          visible: true
        },
        containedActions: [],
        numSteps: 0,
        currentStep: -1,
        completed: false
      },
      ctor: function ctor(data, itemLookup) {
        var _this = this;
        this.name = data.name;
        this.id = data.id;
        this.containedActions = [];
        data.steps.forEach(function(stepData, index) {
          var newStep = new RecipieStep(stepData);
          newStep.stepNum = index + 1;
          _this.containedActions = _this.containedActions.concat(newStep.getHashes());
          _this.numSteps += newStep.actions.length;
          _this.steps.push(newStep);
        });
        this.currentStep = 0;
      },
      containsAction: function containsAction(currentAction) {
        var hash = currentAction.sort().join("_");
        return -1 != this.containedActions.indexOf(hash);
      },
      maybeAdvanceStep: function maybeAdvanceStep(currentAction) {
        if (this.completed) return false;
        var correctAction = this.steps[this.currentStep].applyAction(currentAction);
        if (this.steps[this.currentStep].checkForCompletion()) {
          this.currentStep++;
          this.currentStep >= this.steps.length && (this.completed = true);
        }
        return correctAction;
      }
    });
    cc._RF.pop();
  }, {
    RecipieStep: "RecipieStep"
  } ],
  SavedUserDataUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3eb811V0BFAHbkezpzSXl8I", "SavedUserDataUtil");
    "use strict";
    var SavedUserDataUtil = cc.Class({});
    SavedUserDataUtil.sendSavedUserData = function(model) {
      if (!window.Lumos || !model.savedUserData || model.savedUserData === {}) return;
      var payload = {};
      payload.data = {};
      payload.data.data = model.savedUserData;
      var json = JSON.stringify(payload);
      var baseUrl = "/api/v2/games/";
      var gameSlug = window.Lumos.gamevars.game_param;
      var GAME_SETTINGS_ENDPOINT = "/game_setting";
      var combinedUrl = baseUrl + gameSlug + GAME_SETTINGS_ENDPOINT + "?_method=PUT";
      var xhr = new XMLHttpRequest();
      xhr.open("POST", combinedUrl, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onload = function() {
        var result = JSON.parse(xhr.responseText);
        4 == xhr.readyState && "200" == xhr.status ? console.log(result) : console.error(result);
      };
      xhr.send(json);
    };
    module.exports = SavedUserDataUtil;
    cc._RF.pop();
  }, {} ],
  SceneNodeViewTests: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bb22d+OU11PCIi6BYendGIU", "SceneNodeViewTests");
    "use strict";
    var SceneNodeView = require("SceneNodeView");
    var SceneNodeViewTests = cc.Class({});
    SceneNodeViewTests.numRun = 0;
    SceneNodeViewTests.numFailed = 0;
    SceneNodeViewTests.run = function() {
      console.log("[SceneNodeViewTests] Running tests...");
      SceneNodeViewTests.numRun = 0;
      SceneNodeViewTests.numFailed = 0;
      SceneNodeViewTests.testWorldXY();
      console.log("[SceneNodeViewTests] " + SceneNodeViewTests.numRun + " tests complete. ");
      SceneNodeViewTests.numFailed > 0 && console.log("[SceneNodeViewTests] " + SceneNodeViewTests.numFailed + " FAILED");
    };
    SceneNodeViewTests.testWorldXY = function() {
      console.log("[SceneNodeViewTests] testWorldXY running");
      SceneNodeViewTests.numRun++;
      var failed = false;
      var parent = new cc.Node();
      parent.setPosition(10, 6);
      parent.rotation = 42;
      var child = new cc.Node();
      child.parent = parent;
      child.setPosition(1, 1);
      var x = 2;
      var y = 5;
      SceneNodeView.setWorldXY(child, x, y);
      var worldXY = SceneNodeView.getWorldXY(child);
      if (worldXY.x === x && worldXY.y === y) console.log("testWorldXY passed: got " + worldXY.x + "," + worldXY.y + ", expected " + x + "," + y); else if (worldXY.x !== x) {
        console.log("x not equal: got " + worldXY.x + ", expected " + y);
        SceneNodeViewTests.numFailed++;
      } else if (worldXY.y !== y) {
        console.log("y not equal: got " + worldXY.y + ", expected " + y);
        SceneNodeViewTests.numFailed++;
      } else {
        console.log("Something went wrong.");
        SceneNodeViewTests.numFailed++;
      }
    };
    module.exports = SceneNodeViewTests;
    cc._RF.pop();
  }, {
    SceneNodeView: "SceneNodeView"
  } ],
  SceneNodeView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71d27T+UxVA3ZylfE4LIbGK", "SceneNodeView");
    "use strict";
    var DebugUtil = require("DebugUtil");
    var SceneNodeView = cc.Class({});
    SceneNodeView.isVerbose = false;
    SceneNodeView.find = function(address, overrideObject, isTolerant) {
      console.log("[SceneNodeView.find] beginning search for " + address);
      if (null != overrideObject) return overrideObject;
      "undefined" === typeof isTolerant && (isTolerant = false);
      var child = cc.find(address);
      if (null == child && !isTolerant) {
        var message = "Expected to find Node named <" + address + "> but failed";
        DebugUtil.log(message);
      }
      return child;
    };
    SceneNodeView.getChild = function(parent, name, overrideObject, isTolerant) {
      if (null != overrideObject) return overrideObject;
      "undefined" === typeof isTolerant && (isTolerant = false);
      var child = cc.find(name, parent);
      if (null == child && !isTolerant) {
        var message = "Expected to find Node named <" + name + "> but failed";
        DebugUtil.log(message);
      }
      return child;
    };
    SceneNodeView.getParent = function(child) {
      if (null == child) return null;
      return child.parent;
    };
    SceneNodeView.getAddress = function(self) {
      if (null == self) return "";
      var parentAddress = SceneNodeView.getAddress(self.parent);
      "" != parentAddress && (parentAddress += "/");
      return parentAddress + self.name;
    };
    SceneNodeView.addChild = function(parent, child) {
      child.parent = parent;
    };
    SceneNodeView.destroy = function(child) {
      child.destroy();
    };
    SceneNodeView.getChildren = function(parentObject, isActiveOnly) {
      "undefined" === typeof isActiveOnly && (isActiveOnly = false);
      var children = parentObject.children;
      if (true === isActiveOnly) {
        var activeChildren = [];
        for (var i = 0; i < children.length; i++) children[i].active && activeChildren.push(children[i]);
        children = activeChildren;
      }
      return children;
    };
    SceneNodeView.destroyChildren = function(parent) {
      var children = parent.children;
      for (var child in children) child.destroy();
    };
    SceneNodeView.replaceChildren = function(source, target) {
      var sources = source.children;
      SceneNodeView.destroyChildren(target);
      for (var child in sources) SceneNodeView.addChild(target, child);
    };
    SceneNodeView.getName = function(viewObject) {
      return viewObject.name;
    };
    SceneNodeView.setName = function(viewObject, name) {
      viewObject.name = name;
    };
    SceneNodeView.getLocalX = function(viewObject) {
      return viewObject.position.x;
    };
    SceneNodeView.getLocalY = function(viewObject) {
      return viewObject.position.y;
    };
    SceneNodeView.getLocalZ = function(viewObject) {
      return 0;
    };
    SceneNodeView.setLocalX = function(viewObject, x) {
      viewObject.setPositionX(x);
    };
    SceneNodeView.setLocalY = function(viewObject, y) {
      viewobject.setPositionY(y);
    };
    SceneNodeView.setLocalZ = function() {};
    SceneNodeView.setLocalXY = function(child, x, y) {
      child.setPosition(x, y);
    };
    SceneNodeView.getWorldXY = function(viewObject) {
      return viewObject.convertToWorldSpace(0, 0);
    };
    SceneNodeView.getWorldX = function(viewObject) {
      return viewObject.convertToWorldSpace(0, 0).x;
    };
    SceneNodeView.getWorldY = function(viewObject) {
      return viewObject.convertToWorldSpace(0, 0).y;
    };
    SceneNodeView.getWorldZ = function(viewObject) {
      return 0;
    };
    SceneNodeView.setWorldXY = function(viewObject, x, y) {
      var worldPos = viewObject.convertToNodeSpace(cc.v2(x, y));
      console.log("world: " + worldPos.x + "," + worldPos.y);
      console.log("local: " + viewObject.position.x + "," + viewObject.position.y);
      viewObject.setPosition(viewObject.position.x + worldPos.x, viewObject.position.y + worldPos.y);
    };
    SceneNodeView.setWorldX = function(viewObject, x) {
      throw new Error("setWorldX not implemented");
    };
    SceneNodeView.setWorldY = function(viewObject, Y) {
      throw new Error("setWorldY not implemented");
    };
    SceneNodeView.setWorldZ = function(viewObject, Z) {
      throw new Error("setWorldZ not implemented");
    };
    SceneNodeView.getLocalScaleX = function(viewObject) {
      return viewObject.scaleX;
    };
    SceneNodeView.getLocalScaleY = function(viewObject) {
      return viewObject.scaleY;
    };
    SceneNodeView.setLocalScaleX = function(viewObject, x) {
      viewObject.scaleX = x;
    };
    SceneNodeView.setLocalScaleY = function(viewObject, y) {
      viewObject.scaleY = y;
    };
    SceneNodeView.setLocalScaleXY = function(viewObject, scale) {
      viewObject.scale = scale;
    };
    SceneNodeView.getWorldScaleX = function(viewObject) {
      throw new Error("getWorldScaleX not implemented");
    };
    SceneNodeView.getWorldScaleY = function(viewObject) {
      throw new Error("getWorldScaleY not implemented");
    };
    SceneNodeView.setWorldScaleX = function(viewObject) {
      throw new Error("setWorldScaleX not implemented");
    };
    SceneNodeView.setWorldScaleY = function(viewObject) {
      throw new Error("setWorldScaleY not implemented");
    };
    SceneNodeView.getWidth = function(viewObject) {
      return viewObject.width;
    };
    SceneNodeView.getVisible = function(gameObject) {
      return gameObject.active;
    };
    SceneNodeView.setVisible = function(gameObject, isVisible) {
      gameObject.active = isVisible;
    };
    SceneNodeView.rotate = function(viewObject, degrees) {
      viewObject.rotation += degrees;
    };
    SceneNodeView.getWorldRotationZ = function(viewObject) {
      throw new Error("getWorldRotationZ not implemented");
    };
    SceneNodeView.setWorldRotationZ = function(viewObject, rotation) {
      throw new Error("setWorldRotationZ not implemented");
    };
    SceneNodeView.getRotationZ = function(viewObject) {
      throw new Error("getRotationZ not implemented");
    };
    SceneNodeView.setRotationZ = function(viewObject, rotation) {
      throw new Error("setRotationZ not implemented");
    };
    SceneNodeView.reposition = function(traveler, destination) {
      traveler.position = destination.position;
    };
    SceneNodeView.getAlpha = function(viewObject) {
      return viewObject.opacity;
    };
    SceneNodeView.setAlpha = function(viewObject, opacity) {
      viewObject.opacity = opacity;
    };
    SceneNodeView.setColor = function(viewObject, r, g, b) {
      viewObject.color = new cc.Color(r, g, b);
    };
    SceneNodeView.setMaterial = function(child, material) {
      throw new Error("setMaterial not implemented");
    };
    SceneNodeView.setMaterialOnChildren = function(child, material) {
      throw new Error("setMaterialOnChildren not implemented");
    };
    SceneNodeView.model = function(viewObject) {
      throw new Error("model not implemented");
    };
    SceneNodeView.worldModel = function(viewObject) {
      throw new Error("worldModel not implemented");
    };
    SceneNodeView.listWorldModels = function(viewObjects) {
      throw new Error("listWorldModels not implemented");
    };
    SceneNodeView.repositionToModel = function(viewObject, model) {
      throw new Error("repositionToModel not implemented");
    };
    SceneNodeView.modelChildrenByName = function(parent) {
      throw new Error("modelChildrenByName not implemented");
    };
    SceneNodeView.localToLocal = function(point, from, to) {
      throw new Error("localToLocal not implemented");
    };
    SceneNodeView.localToGlobal = function(localNode, point) {
      throw new Error("localToGlobal not implemented");
    };
    module.exports = SceneNodeView;
    cc._RF.pop();
  }, {
    DebugUtil: "DebugUtil"
  } ],
  ScoreHUDController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "55d88VUAoRKu6EKIpOMw/vC", "ScoreHUDController");
    "use strict";
    var ScoreHUDView = require("ScoreHUDView");
    var ScoreHUDController = cc.Class({
      extends: cc.Component,
      properties: {
        onCompleteCallback: null,
        _view: null,
        _targetScore: 0,
        _lastShown: 0,
        _isRollingUp: false,
        _audio: {
          type: cc.AudioSource,
          default: null,
          visible: true
        },
        _countingSfx: {
          url: cc.AudioClip,
          default: null,
          visible: true
        },
        _countEndSfx: {
          url: cc.AudioClip,
          default: null,
          visible: true
        },
        _INCREMENT: 50
      },
      onLoad: function onLoad() {
        this._view = this.getComponent(ScoreHUDView);
        if (null == this._view) throw new error("Must have ScoreHUDView on same node as ScoreHUDController");
      },
      update: function update() {
        if (true === this._isRollingUp) {
          this._lastShown += this._INCREMENT;
          if (this._lastShown >= this._targetScore) {
            this._lastShown = this._targetScore;
            this._isRollingUp = false;
            this._view.setHighlightActive(false);
            this._audio.stop();
            this._audio.clip = this._countEndSfx;
            this._audio.play();
            this.scheduleOnce(this.onCompleteCallback, .5);
          }
          this._view.showScore(this._lastShown);
        }
      },
      showScore: function showScore(score) {
        this._lastShown = score;
        this._view.showScore(score);
      },
      rollUpBonusScore: function rollUpBonusScore(targetAmount) {
        this._audio.clip = this._countingSfx;
        this._audio.play();
        this._isRollingUp = true;
        this._view.setHighlightActive(true);
        this._targetScore = targetAmount;
      }
    });
    module.exports = ScoreHUDController;
    cc._RF.pop();
  }, {
    ScoreHUDView: "ScoreHUDView"
  } ],
  ScoreHUDView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2a773IKpmFNhJdKeUtd9lvk", "ScoreHUDView");
    "use strict";
    var ScoreHUDView = cc.Class({
      extends: cc.Component,
      properties: {
        _scoreLabel: {
          default: null,
          type: cc.Label,
          visible: true
        },
        _animator: null
      },
      onLoad: function onLoad() {
        this._animator = this.getComponent(cc.Animation);
      },
      showScore: function showScore(score) {
        isNaN(score) ? this._scoreLabel.string = "-" : this._scoreLabel.string = score;
      },
      setHighlightActive: function setHighlightActive(isActive) {
        true === isActive ? this._animator.play("ScoreHighlightOn") : this._animator.play("ScoreHighlightOff");
      }
    });
    module.exports = ScoreHUDView;
    cc._RF.pop();
  }, {} ],
  ScreenView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c77e7vqnu9OcbuEcxB4Rzbv", "ScreenView");
    "use strict";
    var ScreenView = cc.Class({
      properties: {},
      ctor: function ctor() {}
    });
    ScreenView.getWidth = function() {
      return cc.director.getWinSize().width;
    };
    ScreenView.getHeight = function() {
      return cc.director.getWinSize().height;
    };
    ScreenView.isPortrait = function() {
      return ScreenView.getWidth() < ScreenView.getHeight();
    };
    module.exports = ScreenView;
    cc._RF.pop();
  }, {} ],
  ShelvesController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a47f1ZJmlBJrrCEN1eWQVpf", "ShelvesController");
    "use strict";
    var ItemController = require("ItemController");
    var ShelvesController = cc.Class({
      extends: cc.Component,
      properties: {
        items: {
          default: [],
          type: ItemController,
          visible: true
        }
      },
      ctor: function ctor() {}
    });
    cc._RF.pop();
  }, {
    ItemController: "ItemController"
  } ],
  ShowFPSController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "94889im3tpJM6raaiSh5nIZ", "ShowFPSController");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _fpsLabel: {
          type: cc.Label,
          default: null,
          visible: true
        },
        _fpsToggle: {
          type: cc.Toggle,
          default: null,
          visible: true
        },
        _slowestFrame: 0
      },
      fpsToggled: function fpsToggled() {
        this._fpsLabel.node.active = this._fpsToggle.isChecked;
      },
      show: function show() {
        this._fpsLabel.node.active = true;
      },
      hide: function hide() {
        this._fpsLabel.node.active = false;
      },
      setText: function setText(text) {
        this._fpsLabel.string = text;
      },
      update: function update(dt) {
        if (dt > this._slowestFrame) {
          var text = 1e3 * dt + " ms\n" + Math.round(1 / dt) + " fps\nat slowest";
          this._slowestFrame = dt;
          this.setText(text);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  StoveUIController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c0b3bTTswtHRKO9BV2SNT1a", "StoveUIController");
    "use strict";
    var StoveUIController = cc.Class({
      extends: cc.Component,
      properties: {},
      ctor: function ctor() {}
    });
    cc._RF.pop();
  }, {} ],
  StringsLoader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aceea5IzzFI+7VSfP7ysQab", "StringsLoader");
    "use strict";
    var Strings = require("Strings");
    var Loader = require("Loader");
    cc.Class({
      extends: Loader,
      onLoad: function onLoad() {
        Strings.init(function() {
          this.hasFinishedLoading = true;
        }.bind(this));
      }
    });
    cc._RF.pop();
  }, {
    Loader: "Loader",
    Strings: "Strings"
  } ],
  Strings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bbd87SvX5lA+JBiHYLGB6nJ", "Strings");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var LumosAppUtil = require("LumosAppUtil");
    var LumosAppInterface = require("LumosAppInterface");
    var LumosRandom = require("LumosRandom");
    var Strings = cc.Class({});
    Strings.STRINGS_PATHS = [ "Locale/game/{0}/strings", "Locale/shared/{0}/strings" ];
    Strings._languageTables = null;
    Strings._remainingArrayIndices = {};
    Strings.language = "en_us";
    Strings.defaultLanguage = "en_us";
    Strings.usedLanguage = null;
    Strings.init = function(cb) {
      if (this.isInitialized()) {
        cb && cb();
        return;
      }
      this.defaultLanguage = LumosAppUtil.DEFAULT_LOCALE;
      this.language = LumosAppUtil.getLocale(LumosAppInterface.getInstance().getParameters());
      cc.log('Strings – Using a language of "' + this.language + '" and a default of "' + this.defaultLanguage + '"');
      this.remainingArrayIndices = {};
      this._loadAllStringsFiles([ this.language, this.defaultLanguage ], function() {
        cb && cb();
      });
    };
    Strings.isInitialized = function() {
      return null !== this._languageTables;
    };
    Strings.get = function(key) {
      if (!this.isInitialized()) {
        this.init();
        cc.warn("Strings is not yet initialized and you called Strings.get()! This is asynchronous so you're borked. :'-(");
        return 'UNINITIALIZED: "' + key + '"';
      }
      var val = this._getValueForKey(key);
      if (void 0 === val) return 'ERROR: "' + key + '"';
      if ("string" !== typeof val) return 'BAD TYPE: "' + key + '"';
      var substitutions = [];
      var paramIndex;
      for (paramIndex = 1; paramIndex < arguments.length; paramIndex++) substitutions.push(arguments[paramIndex]);
      return this._getSubstitutedString(val, substitutions);
    };
    Strings.getCount = function(key) {
      if (!this.isInitialized()) {
        this.init();
        cc.warn("Strings is not yet initialized and you called Strings.getCount()! This is asynchronous so you're borked. :'-(");
        return -1;
      }
      var val = this._getValueForKey(key);
      if (void 0 === val || !(val instanceof Array)) return -1;
      return val.length;
    };
    Strings._loadAllStringsFiles = function(locales, cb) {
      this._languageTables = [];
      var files = [];
      var localeIndex;
      var localePerPath = [];
      for (localeIndex = 0; localeIndex < locales.length; localeIndex++) {
        var locale = locales[localeIndex];
        if (locale) {
          locale = locale.replace(/-/g, "_").toLowerCase();
          var partialLocale = locale;
          var underscoreIndex = locale.indexOf("_");
          underscoreIndex >= 0 && (partialLocale = locale.substring(0, underscoreIndex));
          var pathIndex;
          for (pathIndex = 0; pathIndex < Strings.STRINGS_PATHS.length; pathIndex++) {
            files.push(this._getSubstitutedString(Strings.STRINGS_PATHS[pathIndex], [ locale ]));
            localePerPath.push(locale);
            if (partialLocale !== locale) {
              files.push(this._getSubstitutedString(Strings.STRINGS_PATHS[pathIndex], [ partialLocale ]));
              localePerPath.push(partialLocale);
            }
          }
        }
      }
      var loadedFiles = {};
      var loadedCount = 0;
      var loadedFunction = function loadedFunction(index, str) {
        loadedFiles[index] = str;
        loadedCount++;
        if (loadedCount >= files.length) {
          var loadedFileIndex;
          for (loadedFileIndex = 0; loadedFileIndex < files.length; loadedFileIndex++) if (loadedFiles[loadedFileIndex]) {
            this._languageTables.push(loadedFiles[loadedFileIndex]);
            null === this.usedLanguage && (this.usedLanguage = localePerPath[loadedFileIndex]);
          }
          cb();
        }
      };
      if (files.length <= 0) cb(); else {
        var fileIndex;
        for (fileIndex = 0; fileIndex < files.length; fileIndex++) this._loadStringsFile(files[fileIndex], loadedFunction.bind(this, fileIndex));
      }
    };
    Strings._loadStringsFile = function(path, cb) {
      LumosAppInterface.getInstance().loadAsset(path, "json", function(stringsData) {
        if (void 0 !== stringsData) cb(stringsData); else {
          cc.warn("Strings – Failed to load the locale strings table at " + path + ".json");
          cb(void 0);
        }
      }.bind(this));
    };
    Strings._getValueForKey = function(key, languageTableIndex) {
      languageTableIndex = languageTableIndex || 0;
      if (void 0 === this._languageTables) return 'UNINITIALIZED: "' + key + '"';
      if (languageTableIndex >= this._languageTables.length) return 'ERROR: "' + key + '"';
      var languageTable = this._languageTables[languageTableIndex];
      var keyParts = key.split("/");
      var parentKey = "";
      var val = languageTable;
      var partIndex;
      for (partIndex = 0; partIndex < keyParts.length; partIndex++) {
        var keyPart = keyParts[partIndex];
        val = val instanceof Array ? this._getArrayValue(val, keyPart, parentKey) : "object" === ("undefined" === typeof val ? "undefined" : _typeof(val)) ? val[keyPart] : void 0;
        parentKey += keyPart;
        if (void 0 === val) return this._getValueForKey(key, languageTableIndex + 1);
      }
      return val;
    };
    Strings._getSubstitutedString = function(str, substitutions) {
      if (substitutions.length <= 0) return str;
      if (str.indexOf("{") < 0) return str;
      return str.replace(/\{([0-9]+)\}/g, function(_, index) {
        return substitutions[index];
      });
    };
    Strings._getArrayValue = function(arr, keyPart, parentKey) {
      return "?" === keyPart ? this._getRandomElement(arr) : "!" === keyPart ? this._getRandomExcludedElement(arr, parentKey) : "b" === keyPart.charAt(0) ? this._getBoundedElement(arr, keyPart.substring(1)) : this._getElement(arr, keyPart);
    };
    Strings._getRandomElement = function(arr) {
      if (arr.length <= 0) return;
      return arr[LumosRandom.range(0, arr.length)];
    };
    Strings._getRandomExcludedElement = function(arr, key) {
      if (arr.length <= 0) return;
      void 0 === this._remainingArrayIndices[key] && (this._remainingArrayIndices[key] = []);
      if (this._remainingArrayIndices[key].length <= 0) {
        var index;
        for (index = 0; index < arr.length; index++) this._remainingArrayIndices[key].push(index);
      }
      var randIndex = LumosRandom.range(0, this._remainingArrayIndices[key].length);
      var arrIndex = this._remainingArrayIndices[key][randIndex];
      this._remainingArrayIndices[key].splice(randIndex, 1);
      return arr[arrIndex];
    };
    Strings._getBoundedElement = function(arr, key) {
      if (arr.length <= 0) return;
      key < 0 ? key = 0 : key >= arr.length && (key = arr.length - 1);
      return arr[key];
    };
    Strings._getElement = function(arr, key) {
      return arr[key];
    };
    cc._RF.pop();
  }, {
    LumosAppInterface: "LumosAppInterface",
    LumosAppUtil: "LumosAppUtil",
    LumosRandom: "LumosRandom"
  } ],
  TemplateController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5db87KmZ99Ac5hEohAIj5MT", "TemplateController");
    "use strict";
    var BaseController = require("BaseController");
    var TemplateModel = require("TemplateModel");
    var TemplateMetadataController = require("TemplateMetadataController");
    var LumosAppUtil = require("LumosAppUtil");
    var TimedPopUpController = require("TimedPopUpController");
    cc.Class({
      extends: BaseController,
      properties: {},
      _init: function _init() {
        this._super();
        this._titleScreenBegin();
      },
      _initUIController: function _initUIController() {
        this._super();
        this._uiController.onTimedPopUpCompleteCallback = this._handlePopUpComplete.bind(this);
      },
      _handlePopUpComplete: function _handlePopUpComplete() {
        this._endScreenBegin();
      },
      _titleScreenBegin: function _titleScreenBegin() {
        this._super();
      },
      _titleScreenPlayButtonPressed: function _titleScreenPlayButtonPressed() {
        this._super();
      },
      _titleScreenTutorialButtonPressed: function _titleScreenTutorialButtonPressed() {
        this._super();
        this._model.startTutorial = true;
      },
      _titleScreenEnd: function _titleScreenEnd() {
        this._model.startTutorial ? this._tutorialBegin() : this._stageBegin();
        this._super();
      },
      _tutorialBegin: function _tutorialBegin() {
        this._super();
        this._uiController.showSkipTutorialButton();
        this._uiController.hidePauseButton();
        this._tutorialController.init(this._uiController, this._metadataController);
        this._tutorialController.onCompleteCallback = this._tutorialComplete.bind(this);
        this._tutorialController.begin();
      },
      _tutorialAbort: function _tutorialAbort() {
        this._super();
        this._uiController.hideSkipTutorialButton();
      },
      _tutorialComplete: function _tutorialComplete() {
        this._super();
        this._stageBegin();
      },
      _stageBegin: function _stageBegin() {
        this._super();
        this._uiController.showPauseButton();
        this._uiController.hideSkipTutorialButton();
        this._model.isFirstPlay = false;
        this._stageController.init(this._uiController, this._metadataController);
        this._stageController.onCompleteCallback = this._stageComplete.bind(this);
        this._stageController.begin();
      },
      _stageAbort: function _stageAbort() {
        this._super();
        this._uiController.hidePauseButton();
        this._uiController.hideHUD();
      },
      _stageComplete: function _stageComplete(stageModel) {
        this._model.score = stageModel.score;
        this._uiController.hidePauseButton();
        this._uiController.hideHUD();
        this._uiController.showTimedPopUp();
        this._model.savedUserData = this._model.savedUserData || {};
        this._model.savedUserData.default = "Default saved user data for testing.";
        this._model.savedUserData.number = this._model.savedUserData.number || 0;
        this._model.savedUserData.number += 1;
        this._super();
      },
      _endScreenBegin: function _endScreenBegin() {
        this._super();
      },
      _endScreenEnd: function _endScreenEnd() {
        this._super();
      },
      _onSkipTutorial: function _onSkipTutorial() {
        this._metadataController.tutorialSessionEnd();
        this._tutorialToStage();
      },
      _createModel: function _createModel() {
        return new TemplateModel();
      },
      _createMetadataController: function _createMetadataController() {
        return new TemplateMetadataController();
      }
    });
    cc._RF.pop();
  }, {
    BaseController: "BaseController",
    LumosAppUtil: "LumosAppUtil",
    TemplateMetadataController: "TemplateMetadataController",
    TemplateModel: "TemplateModel",
    TimedPopUpController: "TimedPopUpController"
  } ],
  TemplateEndScreenController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2d2c84jLXFPOo7JuJGRgXDN", "TemplateEndScreenController");
    "use strict";
    var BaseEndScreenController = require("BaseEndScreenController");
    var TemplateEndScreenController = cc.Class({
      extends: BaseEndScreenController,
      init: function init(model) {
        this._view.setScore(model.score);
        this._view.setAmountCorrect(model.numCorrect, model.numAttempted);
        this._view.setAccuracy(model.numCorrect / model.numAttempted);
      }
    });
    module.exports = TemplateEndScreenController;
    cc._RF.pop();
  }, {
    BaseEndScreenController: "BaseEndScreenController"
  } ],
  TemplateEndScreenView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "676a1xRwLJL56Tp6uUKUSQm", "TemplateEndScreenView");
    "use strict";
    var BaseEndScreenView = require("BaseEndScreenView");
    var TemplateEndScreenView = cc.Class({
      extends: BaseEndScreenView,
      properties: {
        _scoreLabel: {
          default: null,
          type: cc.Label,
          visible: true
        },
        _correctLabel: {
          default: null,
          type: cc.Label,
          visible: true
        },
        _accuracyLabel: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      show: function show() {
        this._super();
      },
      hide: function hide() {
        this._super();
      },
      setScore: function setScore(score) {
        this._scoreLabel.string = score;
      },
      setAmountCorrect: function setAmountCorrect(numCorrect, numAttempted) {
        this._correctLabel.string = numCorrect + " of " + numAttempted;
      },
      setAccuracy: function setAccuracy(accuracyPercent) {
        this._accuracyLabel.string = Math.trunc(accuracyPercent) + "%";
      }
    });
    module.exports = TemplateEndScreenView;
    cc._RF.pop();
  }, {
    BaseEndScreenView: "BaseEndScreenView"
  } ],
  TemplateMetadataController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2ccaaLQRllPIr+9aUSqR0SZ", "TemplateMetadataController");
    "use strict";
    var BaseMetadataController = require("BaseMetadataController");
    var LumosAppInterface = require("LumosAppInterface");
    var TemplateMetadataController = cc.Class({
      extends: BaseMetadataController,
      tutorialSessionEnd: function tutorialSessionEnd() {
        this.removeIncompleteMetadata();
        this.metadata.tutorial["num_correct"] = this.metadata.session["num_correct"];
        this.metadata.tutorial["num_tries"] = this.metadata.responses.length;
        this.metadata.tutorial["response_time"] = this.getResponseTime();
        this.metadata.tutorial["num_errors"] = this.metadata.tutorial["num_tries"] - this.metadata.tutorial["num_correct"];
        this._super();
      },
      trialEnd: function trialEnd(trialModel) {
        this.metadata.trial["left_number"] = trialModel.number;
        this.metadata.trial["right_number"] = trialModel.compareTarget;
        this._super(trialModel.correct);
      },
      sessionEnd: function sessionEnd() {
        this.removeIncompleteMetadata();
        this.metadata.session["num_tries"] = this.metadata.responses.length;
        this.metadata.session["response_time"] = this.getResponseTime();
        this.metadata.session["num_errors"] = this.metadata.session["num_tries"] - this.metadata.session["num_correct"];
        this.metadata.session["time"] = Math.round(this.metadata.getMilliseconds() - this.metadata.sessionBeginTime);
        this._super();
      },
      organize: function organize(sessionMetadata) {
        this._model.sessionLevel = 2;
        var hash = this._super(sessionMetadata);
        hash["gameStats"]["numbers"] = this.metadata.session["num_correct"];
        hash["bestStatKey"] = "numbers";
        hash["stat"] = this.metadata.session["num_correct"];
        return hash;
      },
      removeIncompleteMetadata: function removeIncompleteMetadata() {
        this.metadata.trials.length > 0 && "" === this.metadata.trials[this.metadata.trials.length - 1]["correct"] && this.metadata.trials.splice(this.metadata.trials.length - 1, 1);
        this.metadata.responses.length > 0 && -1 === this.metadata.responses[this.metadata.responses.length - 1]["trial_id"] && this.metadata.responses.splice(this.metadata.responses.length - 1, 1);
      },
      getResponseTime: function getResponseTime(filterFunction) {
        if (0 === this.metadata.responses.length) return "";
        var totalResponseTime = 0;
        for (var i = 0; i < this.metadata.responses.length; i++) void 0 != filterFunction ? filterFunction(this.metadata.responses[i]) && (totalResponseTime += this.metadata.responses[i]["response_time"]) : totalResponseTime += this.metadata.responses[i]["response_time"];
        return Math.round(totalResponseTime / this.metadata.responses.length);
      }
    });
    module.exports = TemplateMetadataController;
    cc._RF.pop();
  }, {
    BaseMetadataController: "BaseMetadataController",
    LumosAppInterface: "LumosAppInterface"
  } ],
  TemplateModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e403fiKxM9IGKyJU82tzzZR", "TemplateModel");
    "use strict";
    var BaseModel = require("BaseModel");
    var TemplateModel = cc.Class({
      extends: BaseModel,
      properties: {
        stageModel: null
      },
      ctor: function ctor() {
        this.version = 1e4;
        this.locale = "en_US";
      }
    });
    module.exports = TemplateModel;
    cc._RF.pop();
  }, {
    BaseModel: "BaseModel"
  } ],
  TemplateSettings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8fa8aON711NHLHXTIzfUc5t", "TemplateSettings");
    "use strict";
    var BaseSettings = require("BaseSettings");
    var TemplateSettings = cc.Class({
      extends: BaseSettings,
      properties: {}
    });
    module.exports = TemplateSettings;
    cc._RF.pop();
  }, {
    BaseSettings: "BaseSettings"
  } ],
  TemplateStageController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d62b6dv0F5CXZ+gfxoW9sTX", "TemplateStageController");
    "use strict";
    var BaseStageController = require("BaseStageController");
    var TemplateStageModel = require("TemplateStageModel");
    var TemplateStageView = require("TemplateStageView");
    var TrialController = require("TrialController");
    var CountdownController = require("CountdownController");
    var TemplateMetadataController = require("TemplateMetadataController");
    var LumosRandom = require("LumosRandom");
    var TemplateStageController = cc.Class({
      extends: BaseStageController,
      properties: {
        _uiController: null,
        _metadataController: null,
        _countdownController: {
          default: null,
          type: CountdownController,
          visible: true
        },
        _stageView: {
          default: null,
          type: TemplateStageView,
          visible: true
        },
        _trialController: {
          default: null,
          type: TrialController,
          visible: true
        }
      },
      init: function init(uiController, metadataController, settings) {
        this._uiController = uiController;
        this._metadataController = metadataController;
        this._trialController.init(this._uiController, this._metadataController);
        this._countdownController.onCompleteCallback = this._handleCountdownFinished.bind(this);
        this._trialController.onCompleteCallback = this._handleTrialFinished.bind(this);
        this._model.clear();
      },
      begin: function begin() {
        this._model.seed = Date.now();
        LumosRandom.seed = LumosRandom.seed;
        this._model.currentTrial = 1;
        this._uiController.showPauseButton();
        this._countdownController.show();
        this._uiController.showHUD();
        this._trialController.show();
        this._updateStageUI();
        this._uiController.clearAllPips();
      },
      tick: function tick(delta) {
        if (true != this._model.isCountdownComplete) return;
        this._super(delta);
        this._updateStageUI();
        if (true != this._model.isComplete && this._model.elapsedTimeSeconds > this._model.stageDurationSeconds && null != this.onCompleteCallback) {
          cc.log("[TemplateStageController] done");
          this._trialController.abort();
          this._finish();
        }
      },
      _handleTrialFinished: function _handleTrialFinished(wasSuccessful) {
        true === wasSuccessful ? this._handleTrialWon() : this._handleTrialLost();
        var trialParams = {};
        trialParams.difficulty = 1;
        this._trialController.populate(trialParams);
        this._trialController.show();
      },
      _handleTrialWon: function _handleTrialWon() {
        this._model.correctAnswersAtThisMultiplier++;
        this._uiController.fillPip(this._model.correctAnswersAtThisMultiplier - 1);
        if (this._model.correctAnswersAtThisMultiplier >= this._model.answersPerLevel && this._model.currentMultiplier < this._model.maxMultiplier) {
          this._model.correctAnswersAtThisMultiplier = 0;
          this._model.currentMultiplier++;
          this._uiController.multiplierUp(this._model.currentMultiplier, this._model.currentMultiplier === this._model.maxMultiplier);
        }
        this._model.score += 50 * this._model.currentMultiplier;
      },
      _handleTrialLost: function _handleTrialLost() {
        if (0 === this._model.correctAnswersAtThisMultiplier) {
          if (this._model.currentMultiplier > 1) {
            this._model.currentMultiplier--;
            this._uiController.multiplierDown(this._model.currentMultiplier);
          }
        } else {
          this._model.correctAnswersAtThisMultiplier = 0;
          this._uiController.clearAllPips();
        }
      },
      _handleCountdownFinished: function _handleCountdownFinished() {
        this._model.isCountdownComplete = true;
        var trialParams = {};
        trialParams.difficulty = 1;
        this._trialController.populate(trialParams);
        this._uiController.showBottomButtons();
      },
      _updateStageUI: function _updateStageUI() {
        this._updateHUDTimer();
        this._updateHUDScore();
      },
      _updateHUDTimer: function _updateHUDTimer() {
        var remaining = this._model.stageDurationSeconds - this._model.elapsedTimeSeconds;
        this._uiController.setRemainingTimeSeconds(remaining);
      },
      _updateHUDScore: function _updateHUDScore() {
        this._uiController.showScore(this._model.score);
      },
      _finish: function _finish() {
        this._uiController.hideBottomButtons();
        this._model.isComplete = true;
        this.onCompleteCallback(this._model);
      },
      abort: function abort() {
        this._cleanup();
      },
      _cleanup: function _cleanup() {
        this._super();
        this.unscheduleAllCallbacks();
        this._countdownController.reset();
        this._uiController.hideBottomButtons();
      },
      _createModel: function _createModel() {
        return new TemplateStageModel();
      }
    });
    module.exports = TemplateStageController;
    cc._RF.pop();
  }, {
    BaseStageController: "BaseStageController",
    CountdownController: "CountdownController",
    LumosRandom: "LumosRandom",
    TemplateMetadataController: "TemplateMetadataController",
    TemplateStageModel: "TemplateStageModel",
    TemplateStageView: "TemplateStageView",
    TrialController: "TrialController"
  } ],
  TemplateStageModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1c62G/fy9Dar6mffGTNGpt", "TemplateStageModel");
    "use strict";
    var BaseStageModel = require("BaseStageModel");
    var TemplateStageModel = cc.Class({
      extends: BaseStageModel,
      properties: {
        stageDurationSeconds: 45,
        correctAnswersAtThisMultiplier: 0,
        answersPerLevel: 4,
        currentMultiplier: 1,
        maxMultiplier: 10,
        totalTrials: 5,
        currentTrial: 0,
        isCountdownComplete: false,
        isComplete: false
      },
      ctor: function ctor() {},
      clear: function clear() {
        this._super();
        this.stageDurationSeconds = 45;
        this.isComplete = false;
      }
    });
    module.exports = TemplateStageModel;
    cc._RF.pop();
  }, {
    BaseStageModel: "BaseStageModel"
  } ],
  TemplateStageView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "864a49X/3lCcochVzNJCPvq", "TemplateStageView");
    "use strict";
    var BaseStageView = require("BaseStageView");
    var TemplateStageView = cc.Class({
      extends: BaseStageView,
      properties: {}
    });
    module.exports = TemplateStageView;
    cc._RF.pop();
  }, {
    BaseStageView: "BaseStageView"
  } ],
  TemplateState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "90f22o5EP1JiLjtz2w5qnaC", "TemplateState");
    "use strict";
    var BaseState = require("BaseState");
    var TemplateState = cc.Class({
      extends: BaseState
    });
    module.exports = TemplateState;
    cc._RF.pop();
  }, {
    BaseState: "BaseState"
  } ],
  TemplateTitleScreenController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30e13X4EJ5J76dVDnflIPEj", "TemplateTitleScreenController");
    "use strict";
    var BaseTitleScreenController = require("BaseTitleScreenController");
    var TemplateTitleScreenController = cc.Class({
      extends: BaseTitleScreenController,
      init: function init() {
        this._super();
      },
      show: function show() {
        this._super();
      },
      _handlePlayButtonPressed: function _handlePlayButtonPressed() {
        this._super();
      },
      _handleTutorialButtonPressed: function _handleTutorialButtonPressed() {
        this._super();
      },
      _handleOffAnimationFinished: function _handleOffAnimationFinished() {
        this._super();
      }
    });
    module.exports = TemplateTitleScreenController;
    cc._RF.pop();
  }, {
    BaseTitleScreenController: "BaseTitleScreenController"
  } ],
  TemplateTitleScreenView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cd476IMaCpPtKsCKetgZYsL", "TemplateTitleScreenView");
    "use strict";
    var BaseTitleScreenView = require("BaseTitleScreenView");
    var TemplateTitleScreenView = cc.Class({
      extends: BaseTitleScreenView,
      show: function show() {
        this._super();
      },
      handlePlayButtonPressed: function handlePlayButtonPressed() {
        this._super();
      },
      handleTutorialButtonPressed: function handleTutorialButtonPressed() {
        this._super();
      },
      _handleOffAnimationFinished: function _handleOffAnimationFinished() {
        this._super();
      }
    });
    module.exports = TemplateTitleScreenView;
    cc._RF.pop();
  }, {
    BaseTitleScreenView: "BaseTitleScreenView"
  } ],
  TemplateTutorialController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f746aMx54BFzImvrclQMT4E", "TemplateTutorialController");
    "use strict";
    var BaseTutorialController = require("BaseTutorialController");
    var TemplateTutorialModel = require("TemplateTutorialModel");
    var TemplateTutorialView = require("TemplateTutorialView");
    var TrialController = require("TrialController");
    var LumosRandom = require("LumosRandom");
    var TemplateTutorialController = cc.Class({
      extends: BaseTutorialController,
      properties: {
        _uiController: null,
        _metadataController: null,
        _tutorialView: {
          default: null,
          type: TemplateTutorialView,
          visible: true
        },
        _trialController: {
          default: null,
          type: TrialController,
          visible: true
        }
      },
      init: function init(uiController, metadataController, settings) {
        this._uiController = uiController;
        this._metadataController = metadataController;
        this._trialController.init(this._uiController, this._metadataController);
        this._trialController.onCompleteCallback = this._handleTrialFinished.bind(this);
        this._model.clear();
      },
      begin: function begin() {
        LumosRandom.seed = Date.now();
        this._model.currentTrial = 1;
        var trialParams = {};
        trialParams.difficulty = 1;
        this._trialController.populate(trialParams);
        this._trialController.show();
        this._uiController.showBottomButtons();
      },
      tick: function tick(delta) {
        this._super(delta);
      },
      _handleTrialFinished: function _handleTrialFinished(wasSuccessful) {
        true === wasSuccessful ? this._handleTrialWon() : this._handleTrialLost();
        this._model.currentTrial++;
        if (this._model.isComplete()) this._finish(); else {
          var trialParams = {};
          trialParams.difficulty = 1;
          this._trialController.populate(trialParams);
          this._trialController.show();
        }
        console.log(this._model);
      },
      _handleTrialWon: function _handleTrialWon() {},
      _handleTrialLost: function _handleTrialLost() {},
      _finish: function _finish() {
        this.onCompleteCallback(this._model);
      },
      abort: function abort() {
        this._cleanup();
      },
      _cleanup: function _cleanup() {
        this._uiController.hideBottomButtons();
      },
      _createModel: function _createModel() {
        return new TemplateTutorialModel();
      }
    });
    module.exports = TemplateTutorialController;
    cc._RF.pop();
  }, {
    BaseTutorialController: "BaseTutorialController",
    LumosRandom: "LumosRandom",
    TemplateTutorialModel: "TemplateTutorialModel",
    TemplateTutorialView: "TemplateTutorialView",
    TrialController: "TrialController"
  } ],
  TemplateTutorialModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd61aiEH7hK9q2J7mVFFqNk", "TemplateTutorialModel");
    "use strict";
    var BaseTutorialModel = require("BaseTutorialModel");
    var TemplateTutorialModel = cc.Class({
      extends: BaseTutorialModel,
      properties: {
        totalTrials: 5,
        currentTrial: 0
      },
      ctor: function ctor() {},
      clear: function clear() {
        this._super();
      },
      isComplete: function isComplete() {
        return this.currentTrial >= this.totalTrials;
      }
    });
    module.exports = TemplateTutorialModel;
    cc._RF.pop();
  }, {
    BaseTutorialModel: "BaseTutorialModel"
  } ],
  TemplateTutorialView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a82065UDBNGbrevbi5lUIpL", "TemplateTutorialView");
    "use strict";
    var BaseTutorialView = require("BaseTutorialView");
    var TemplateTutorialView = cc.Class({
      extends: BaseTutorialView,
      properties: {}
    });
    module.exports = TemplateTutorialView;
    cc._RF.pop();
  }, {
    BaseTutorialView: "BaseTutorialView"
  } ],
  TemplateUIController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4e497H7BB9POZRQna/4nkau", "TemplateUIController");
    "use strict";
    var BaseUIController = require("BaseUIController");
    var TimeHUDController = require("TimeHUDController");
    var ScoreHUDController = require("ScoreHUDController");
    var TrialCounterHUDController = require("TrialCounterHUDController");
    var BonusMultiplierHUDController = require("BonusMultiplierHUDController");
    var TimedPopUpController = require("TimedPopUpController");
    var FeedbackController = require("FeedbackController");
    var BottomButtonController = require("BottomButtonController");
    var TemplateUIController = cc.Class({
      extends: BaseUIController,
      properties: {
        _timeHUDController: {
          default: null,
          type: TimeHUDController,
          visible: true
        },
        _scoreHUDController: {
          default: null,
          type: ScoreHUDController,
          visible: true
        },
        _bonusMultiplierHUDController: {
          default: null,
          type: BonusMultiplierHUDController,
          visible: true
        },
        _timedPopUpController: {
          default: null,
          type: TimedPopUpController,
          visible: true
        },
        _correctFeedbackController: {
          default: null,
          type: FeedbackController,
          visible: true
        },
        _incorrectFeedbackController: {
          default: null,
          type: FeedbackController,
          visible: true
        },
        _noBottomButtonController: {
          default: null,
          type: BottomButtonController,
          visible: true
        },
        _yesBottomButtonController: {
          default: null,
          type: BottomButtonController,
          visible: true
        },
        onTimedPopUpCompleteCallback: null,
        onNoBottomButtonDownCallback: null,
        onYesBottomButtonDownCallback: null
      },
      init: function init() {
        this._super();
        this._timedPopUpController.init();
        this._timedPopUpController.onCompleteCallback = this._handleTimedPopUpComplete.bind(this);
        this._noBottomButtonController.onButtonDownCallback = this._handleNoBottomButtonDown.bind(this);
        this._yesBottomButtonController.onButtonDownCallback = this._handleYesBottomButtonDown.bind(this);
      },
      tick: function tick(delta) {
        this._super(delta);
        this._timedPopUpController.tick(delta);
      },
      showTimedPopUp: function showTimedPopUp() {
        this._timedPopUpController.show();
      },
      hideTimedPopUp: function hideTimedPopUp() {
        this._timedPopUpController.hide();
      },
      _handleTimedPopUpComplete: function _handleTimedPopUpComplete() {
        this.onTimedPopUpCompleteCallback();
      },
      showHUD: function showHUD() {
        this._view.showHUD();
      },
      hideHUD: function hideHUD() {
        this._view.hideHUD();
      },
      showBottomButtons: function showBottomButtons() {
        this._view.showBottomButtons();
      },
      hideBottomButtons: function hideBottomButtons() {
        this._view.hideBottomButtons();
      },
      showCorrectFeedback: function showCorrectFeedback() {
        this._correctFeedbackController.show();
      },
      showIncorrectFeedback: function showIncorrectFeedback() {
        this._incorrectFeedbackController.show();
      },
      hideCorrectFeedback: function hideCorrectFeedback() {
        this._correctFeedbackController.hide();
      },
      hideIncorrectFeedback: function hideIncorrectFeedback() {
        this._incorrectFeedbackController.hide();
      },
      setRemainingTimeSeconds: function setRemainingTimeSeconds(seconds) {
        this._timeHUDController.setRemainingTimeSeconds(seconds);
      },
      showScore: function showScore(score) {
        this._scoreHUDController.showScore(score);
      },
      fillPip: function fillPip(pipNumber) {
        this._bonusMultiplierHUDController.fillPip(pipNumber);
      },
      clearAllPips: function clearAllPips() {
        this._bonusMultiplierHUDController.clearAllPips();
      },
      multiplierUp: function multiplierUp(multiplier, isMax) {
        this._bonusMultiplierHUDController.playMultiplierUp(multiplier, isMax);
      },
      multiplierDown: function multiplierDown(multiplier) {
        this._bonusMultiplierHUDController.playMultiplierDown(multiplier);
      },
      resetBonusMultiplier: function resetBonusMultiplier() {
        this._bonusMultiplierHUDController.reset();
      },
      _handleNoBottomButtonDown: function _handleNoBottomButtonDown() {
        this.onNoBottomButtonDownCallback();
      },
      _handleYesBottomButtonDown: function _handleYesBottomButtonDown() {
        this.onYesBottomButtonDownCallback();
      }
    });
    module.exports = TemplateUIController;
    cc._RF.pop();
  }, {
    BaseUIController: "BaseUIController",
    BonusMultiplierHUDController: "BonusMultiplierHUDController",
    BottomButtonController: "BottomButtonController",
    FeedbackController: "FeedbackController",
    ScoreHUDController: "ScoreHUDController",
    TimeHUDController: "TimeHUDController",
    TimedPopUpController: "TimedPopUpController",
    TrialCounterHUDController: "TrialCounterHUDController"
  } ],
  TemplateUIView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "572f0WeD+FDVY+CB+lyBimt", "TemplateUIView");
    "use strict";
    var BaseUIView = require("BaseUIView");
    var TemplateUIView = cc.Class({
      extends: BaseUIView,
      properties: {
        _hud: {
          default: null,
          type: cc.Animation,
          visible: true
        },
        _correctFeedback: {
          default: null,
          visible: true
        },
        _incorrectFeedback: {
          default: null,
          visible: true
        },
        _bottomButtons: {
          default: null,
          type: cc.Animation,
          visible: true
        }
      },
      showHUD: function showHUD() {
        this._hud.play("HUDIn");
      },
      hideHUD: function hideHUD() {
        this._hud.play("HUDOut");
      },
      showBottomButtons: function showBottomButtons() {
        this._bottomButtons.play("BottomButtonsIn");
      },
      hideBottomButtons: function hideBottomButtons() {
        this._bottomButtons.play("BottomButtonsOut");
      },
      showCorrectFeedback: function showCorrectFeedback() {
        this._correctFeedback.showFeedback();
      },
      hideCorrectFeedback: function hideCorrectFeedback() {
        this._correctFeedback.hideFeedback();
      },
      showIncorrectFeedback: function showIncorrectFeedback() {
        this._incorrectFeedback.showFeedback();
      },
      hideIncorrectFeedback: function hideIncorrectFeedback() {
        this._incorrectFeedback.hideFeedback();
      },
      updateRemainingTime: function updateRemainingTime(remaining) {}
    });
    cc._RF.pop();
  }, {
    BaseUIView: "BaseUIView"
  } ],
  TemplateView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bad30DLrsZPwqoR5nW0TwEz", "TemplateView");
    "use strict";
    var BaseView = require("BaseView");
    var TemplateView = cc.Class({
      extends: BaseView,
      properties: {},
      onLoad: function onLoad() {}
    });
    module.exports = TemplateView;
    cc._RF.pop();
  }, {
    BaseView: "BaseView"
  } ],
  TextLocalizer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd2ddHLui1GCJaP8177iUEN", "TextLocalizer");
    "use strict";
    var Strings = require("Strings");
    var TextLocalizer = cc.Class({
      extends: cc.Component,
      properties: {
        key: "",
        substitutions: []
      },
      onLoad: function onLoad() {
        this.applyArray = [ this.key ];
        var substitutionIndex;
        for (substitutionIndex = 0; substitutionIndex < this.substitutions.length; substitutionIndex++) this.applyArray.push(this.substitutions[substitutionIndex]);
        this.localizeText();
      },
      localizeText: function localizeText() {
        var text = this.getComponent(cc.Label);
        text ? text.string = Strings.get.apply(Strings, this.applyArray) : cc.warn("TextLocalizer expects to be attached to a cc.Label component.");
      }
    });
    cc._RF.pop();
  }, {
    Strings: "Strings"
  } ],
  ThrowExceptionController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "885744cgaBG2adNAbg6gKG5", "ThrowExceptionController");
    "use strict";
    function LumosityException(message) {
      this.message = message;
      this.name = "LumosityException";
      this.toString = function() {
        return this.name + ": " + this.message;
      };
    }
    cc.Class({
      extends: cc.Component,
      buttonPressed: function buttonPressed() {
        throw new LumosityException("Testing exceptions!");
      }
    });
    cc._RF.pop();
  }, {} ],
  TimeHUDController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3d245yv1JxO/qePumxpk1BX", "TimeHUDController");
    "use strict";
    var TimeHUDView = require("TimeHUDView");
    var TimeHUDController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: null
      },
      onLoad: function onLoad() {
        this._view = this.getComponent(TimeHUDView);
        if (null == this._view) throw new error("Must have TimeHUDView on same node as TimeHUDController");
      },
      setRemainingTimeSeconds: function setRemainingTimeSeconds(seconds) {
        this._view.setRemainingTimeSeconds(seconds);
      }
    });
    module.exports = TimeHUDController;
    cc._RF.pop();
  }, {
    TimeHUDView: "TimeHUDView"
  } ],
  TimeHUDView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77cde16ioREx7ed89PMJck7", "TimeHUDView");
    "use strict";
    var TimeHUDView = cc.Class({
      extends: cc.Component,
      properties: {
        _timeLabel: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      onLoad: function onLoad() {
        this._dateObj = new Date();
      },
      setRemainingTimeSeconds: function setRemainingTimeSeconds(totalSeconds) {
        if (isNaN(totalSeconds)) this._timeLabel.string = "-:--"; else if (totalSeconds <= 0) this._timeLabel.string = "0:00"; else {
          totalSeconds = Math.ceil(totalSeconds);
          var minutes = Math.floor(totalSeconds / 60);
          var seconds = totalSeconds % 60;
          seconds < 10 && (seconds = "0" + seconds.toString());
          this._timeLabel.string = minutes + ":" + seconds;
        }
      }
    });
    module.exports = TimeHUDView;
    cc._RF.pop();
  }, {} ],
  TimeScaleController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c03e19L8KpGSKfC7P2XBqz3", "TimeScaleController");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _editBox: {
          type: cc.EditBox,
          default: null,
          visible: true
        }
      },
      onLoad: function onLoad() {
        this._editBox.string = 1;
      },
      valueEntered: function valueEntered() {
        var scheduler = cc.director.getScheduler();
        scheduler.setTimeScale(this._editBox.string);
      }
    });
    cc._RF.pop();
  }, {} ],
  TimedPopUpController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "51adafmHORAprd/evNDxeAj", "TimedPopUpController");
    "use strict";
    var TimedPopUpView = require("TimedPopUpView");
    var TimedPopUpSettings = require("TimedPopUpSettings");
    var TimedPopUpController = cc.Class({
      extends: cc.Component,
      properties: {
        onCompleteCallback: {
          default: null,
          visible: false
        },
        _view: {
          default: null,
          type: TimedPopUpView,
          visible: true
        },
        _settings: {
          default: null,
          type: TimedPopUpSettings,
          visible: true
        },
        isShowing: false,
        currentShowTime: 0
      },
      tick: function tick(deltaTime) {
        true === this.isShowing && this._showUpdate(deltaTime);
      },
      init: function init() {
        this._view.onShowCompleteCallback = this._startTimer.bind(this);
        this._view.onHideCompleteCallback = this._handleViewFinished.bind(this);
      },
      show: function show() {
        this._view.show();
      },
      hide: function hide() {
        this._view.hide();
      },
      setText: function setText(text) {
        this._view.setText(text);
      },
      _startTimer: function _startTimer() {
        this.isShowing = true;
        this.currentShowTime = 0;
      },
      _showUpdate: function _showUpdate(deltaTime) {
        if (this.currentShowTime < this._settings.maxShowTime) this.currentShowTime += deltaTime; else {
          this.isShowing = false;
          this.hide();
        }
      },
      _handleViewFinished: function _handleViewFinished() {
        null != this.onCompleteCallback && this.onCompleteCallback();
      }
    });
    module.exports = TimedPopUpController;
    cc._RF.pop();
  }, {
    TimedPopUpSettings: "TimedPopUpSettings",
    TimedPopUpView: "TimedPopUpView"
  } ],
  TimedPopUpSettings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7d1b0wERnZD5LkyqFI2GMvO", "TimedPopUpSettings");
    "use strict";
    var TimedPopUpSettings = cc.Class({
      extends: cc.Component,
      properties: {
        maxShowTime: 3
      }
    });
    module.exports = TimedPopUpSettings;
    cc._RF.pop();
  }, {} ],
  TimedPopUpView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d78dfLlpnVAyKPzNl5NJzqR", "TimedPopUpView");
    "use strict";
    var TimedPopUpView = cc.Class({
      extends: cc.Component,
      properties: {
        onShowCompleteCallback: null,
        onHideCompleteCallback: null,
        _animator: null,
        text: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      onLoad: function onLoad() {
        this._animator = this.getComponent(cc.Animation);
      },
      show: function show() {
        this._animator.play("TimedPopUpOn");
        this._animator.on("finished", this.showComplete, this);
      },
      hide: function hide() {
        this._animator.play("TimedPopUpOff");
      },
      showComplete: function showComplete() {
        this._animator.off("finished", this.showComplete, this);
        null != this.onShowCompleteCallback && this.onShowCompleteCallback();
      },
      animationEvent_hideComplete: function animationEvent_hideComplete() {
        cc.log("animationEvent_hideComplete");
        if (null != this.onHideCompleteCallback) {
          cc.log("animationEvent_hideComplete callback");
          this.onHideCompleteCallback();
        }
      },
      setText: function setText(text) {
        this.text.string = text;
      }
    });
    module.exports = TimedPopUpView;
    cc._RF.pop();
  }, {} ],
  TrialController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "25e1f5Qh3BE9oAZQeVgct0Q", "TrialController");
    "use strict";
    var _properties;
    function _defineProperty(obj, key, value) {
      key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    var TrialModel = require("TrialModel");
    var TrialView = require("TrialView");
    var LumosRandom = require("LumosRandom");
    var TrialController = cc.Class({
      extends: cc.Component,
      properties: (_properties = {
        onCompleteCallback: null,
        _uiController: null,
        _metadataController: null
      }, _defineProperty(_properties, "_uiController", null), _defineProperty(_properties, "_trialView", {
        default: null,
        type: TrialView,
        visible: true
      }), _defineProperty(_properties, "_trialModel", null), _defineProperty(_properties, "_listenToInput", false), 
      _properties),
      onLoad: function onLoad() {
        this._trialModel = new TrialModel();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._handleUserInput, this);
      },
      init: function init(uiController, metadataController) {
        this._uiController = uiController;
        this._metadataController = metadataController;
        this._metadataController.responseBegin();
        this._uiController = uiController;
        this._uiController.onNoBottomButtonDownCallback = this._handleNoBottomButtonDown.bind(this);
        this._uiController.onYesBottomButtonDownCallback = this._handleYesBottomButtonDown.bind(this);
      },
      populate: function populate(trialParams) {
        this._trialModel.difficultyLevel = trialParams.difficultyLevel;
      },
      show: function show() {
        this._metadataController.trialBegin();
        this._metadataController.responseBegin();
        this._trialModel.trialStartTime = this._metadataController.metadata.getMilliseconds();
        this._trialModel.number = this._chooseRandomNumber();
        this._trialModel.compareTarget = this._chooseRandomNumber();
        this._trialView.updateView(this._trialModel);
        this._listenToInput = true;
      },
      abort: function abort() {
        this._listenToInput = false;
      },
      _chooseRandomNumber: function _chooseRandomNumber() {
        return LumosRandom.integer(1, 10, false, false);
      },
      _handleUserInput: function _handleUserInput(event) {
        if (false === this._listenToInput) return;
        switch (event.keyCode) {
         case cc.KEY.left:
          this._handleNoBottomButtonDown();
          break;

         case cc.KEY.right:
          this._handleYesBottomButtonDown();
        }
      },
      _handleNoBottomButtonDown: function _handleNoBottomButtonDown() {
        this._listenToInput = false;
        this._evaluateInput(false);
      },
      _handleYesBottomButtonDown: function _handleYesBottomButtonDown() {
        this._listenToInput = false;
        this._evaluateInput(true);
      },
      _evaluateInput: function _evaluateInput(didGuessYes) {
        var correct = false;
        true === this._trialModel.numberGreaterThanTarget() === (true === didGuessYes) && (correct = true);
        this._metadataController.responseEnd(correct);
        this._trialModel.responseTime = Math.round(this._metadataController.metadata.getMilliseconds() - this._trialModel.trialStartTime);
        if (true === correct) {
          console.log("Gussed correctly");
          this._uiController.hideIncorrectFeedback();
          this._uiController.showCorrectFeedback();
        } else {
          console.log("Guessed incorrectly");
          this._uiController.hideCorrectFeedback();
          this._uiController.showIncorrectFeedback();
        }
        this._trialModel.correct = correct;
        this._metadataController.trialEnd(this._trialModel);
        null != this.onCompleteCallback && this.onCompleteCallback(correct);
      }
    });
    module.exports = TrialController;
    cc._RF.pop();
  }, {
    LumosRandom: "LumosRandom",
    TrialModel: "TrialModel",
    TrialView: "TrialView"
  } ],
  TrialCounterHUDController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "67c20Sn5cVHE4HhUb8EcDvd", "TrialCounterHUDController");
    "use strict";
    var TrialCounterHUDView = require("TrialCounterHUDView");
    var TrialCounterHUDController = cc.Class({
      extends: cc.Component,
      properties: {
        _view: null
      },
      onLoad: function onLoad() {
        this._view = this.getComponent(TrialCounterHUDView);
        if (null == this._view) throw new error("Must have TrialCounterHUDView on same node as TrialCounterHUDController");
      },
      setCurrentTrial: function setCurrentTrial(currentTrialNumber) {
        this._view.setCurrentTrial(currentTrialNumber);
      },
      setTotalTrials: function setTotalTrials(totalTrialsNumber) {
        this._view.setTotalTrials(totalTrialsNumber);
      }
    });
    module.exports = TrialCounterHUDController;
    cc._RF.pop();
  }, {
    TrialCounterHUDView: "TrialCounterHUDView"
  } ],
  TrialCounterHUDView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "89c1fbA3gBDir6+hXB8k4cE", "TrialCounterHUDView");
    "use strict";
    var TrialCounterHUDView = cc.Class({
      extends: cc.Component,
      properties: {
        _currentTrialLabel: {
          default: null,
          type: cc.Label,
          visible: true
        },
        _totalTrialsLabel: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      setCurrentTrial: function setCurrentTrial(currentTrialNumber) {
        this._currentTrialLabel.string = currentTrialNumber.toString();
      },
      setTotalTrials: function setTotalTrials(totalTrialsNumber) {
        this._totalTrialsLabel.string = totalTrialsNumber.toString();
      }
    });
    module.exports = TrialCounterHUDView;
    cc._RF.pop();
  }, {} ],
  TrialModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6a79bxqOMZJ6oHGqasdQD0k", "TrialModel");
    "use strict";
    var TrialModel = cc.Class({
      properties: {
        number: 0,
        compareTarget: 0,
        difficultyLevel: 0,
        trialStartTime: 0,
        correct: false
      },
      ctor: function ctor() {},
      numberGreaterThanTarget: function numberGreaterThanTarget() {
        return this.number > this.compareTarget;
      }
    });
    module.exports = TrialModel;
    cc._RF.pop();
  }, {} ],
  TrialView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a971wpJYtK+4qeRhbOVTM2", "TrialView");
    "use strict";
    var TrialView = cc.Class({
      extends: cc.Component,
      properties: {
        _promptLabel: {
          default: null,
          type: cc.Label,
          visible: true
        },
        _numberLabel: {
          default: null,
          type: cc.Label,
          visible: true
        }
      },
      updateView: function updateView(trialModel) {
        this._promptLabel.string = "Is the number greater than " + trialModel.compareTarget + "?";
        this._numberLabel.string = trialModel.number;
      }
    });
    module.exports = TrialView;
    cc._RF.pop();
  }, {} ],
  WebAppInterface: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fad61ID7NRPz6MdbpgdBJ9/", "WebAppInterface");
    "use strict";
    var AppInterface = require("AppInterface");
    var WebAppInterface = cc.Class({
      extends: AppInterface,
      properties: {
        EVENT_GAME_LOADCOMPLETE: "game:loadComplete",
        EVENT_GAME_START: "game:start",
        EVENT_GAME_QUIT: "game:quit",
        EVENT_GAME_COMPLETE: "game:complete",
        EVENT_GAME_ABORT_UPDATE: "game:abort_update"
      },
      applicationInit: function applicationInit() {
        window.Lumos && this.setParameters(window.Lumos.gamevars);
      },
      applicationLoadComplete: function applicationLoadComplete() {
        if (window.sendToJavaScript) {
          cc.loader.onProgress = null;
          document.querySelector("canvas#gameCanvas").style.visibility = "visible";
          window.sendToJavaScript(this.EVENT_GAME_LOADCOMPLETE);
        }
      },
      applicationBegin: function applicationBegin() {
        window.sendToJavaScript && window.sendToJavaScript(this.EVENT_GAME_START);
      },
      applicationPause: function applicationPause() {},
      applicationResume: function applicationResume() {},
      applicationQuit: function applicationQuit() {
        window.sendToJavaScript && window.sendToJavaScript(this.EVENT_GAME_QUIT);
      },
      applicationComplete: function applicationComplete(dataHash) {
        var parameters = [];
        parameters.push(this.EVENT_GAME_COMPLETE);
        parameters.push(dataHash);
        window.sendToJavaScript && window.sendToJavaScript(parameters);
      },
      applicationHeartbeat: function applicationHeartbeat(dataHash) {
        var parameters = [];
        parameters.push(this.EVENT_GAME_ABORT_UPDATE);
        parameters.push(dataHash);
        window.sendToJavaScript && window.sendToJavaScript(parameters);
      },
      setParameters: function setParameters(params) {
        this.parameters = this._extractParameters(params);
      },
      _extractParameters: function _extractParameters(params) {
        var hash = params;
        var xml;
        var levelText;
        var level;
        if (hash.hasOwnProperty("game_user_settings")) {
          xml = hash["game_user_settings"];
          levelText = xml.split("<level>")[1].split("</level>")[0];
          if ("" !== levelText) {
            level = parseInt(levelText);
            hash["level"] = level;
          }
        }
        return hash;
      }
    });
    module.exports = WebAppInterface;
    cc._RF.pop();
  }, {
    AppInterface: "AppInterface"
  } ],
  iOSAppInterface: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ad546QdvlRIEbtyyE3F4gfC", "iOSAppInterface");
    "use strict";
    var AppInterface = require("AppInterface");
    var iOSAppInterface = cc.Class({
      extends: AppInterface,
      applicationInit: function applicationInit() {},
      applicationLoadComplete: function applicationLoadComplete() {},
      applicationBegin: function applicationBegin() {},
      applicationPause: function applicationPause() {},
      applicationResume: function applicationResume() {},
      applicationQuit: function applicationQuit() {
        jsb.reflection.callStaticMethod("ActivityViewController", "exitCocos3Game");
        cc.director.end();
      },
      applicationComplete: function applicationComplete(dataHash) {},
      applicationHeartbeat: function applicationHeartbeat(dataHash) {}
    });
    module.exports = iOSAppInterface;
    cc._RF.pop();
  }, {
    AppInterface: "AppInterface"
  } ]
}, {}, [ "AnimationPauseManager", "AnimationPauseTracker", "AndroidAppInterface", "AppInterface", "LumosAppFactory", "LumosAppInterface", "LumosAppUtil", "SavedUserDataUtil", "WebAppInterface", "iOSAppInterface", "AudioManager", "BaseController", "BaseEndScreenController", "BaseEndScreenView", "BaseMetadataController", "BaseModel", "BaseSettings", "BaseState", "BaseTitleScreenController", "BaseTitleScreenView", "BaseUIController", "BaseUIView", "BaseView", "HeartbeatController", "Loader", "LoadingController", "StringsLoader", "BaseStageController", "BaseStageModel", "BaseStageView", "BaseTutorialController", "BaseTutorialModel", "BaseTutorialView", "BottomButtonController", "BottomButtonView", "ButtonController", "ButtonView", "CountdownController", "LumosQueue", "Strings", "TextLocalizer", "LumosRandom", "Metadata", "ScreenView", "SceneNodeViewTests", "TimedPopUpController", "TimedPopUpSettings", "TimedPopUpView", "AnimationView", "PanelToggleController", "ShowFPSController", "ThrowExceptionController", "TimeScaleController", "DebugPanelController", "DebugPanelView", "DebugUtil", "FeedbackController", "InputBehaviour", "InputController", "InputView", "LumosityPauseController", "LumosityPauseView", "BonusMultiplierHUDController", "BonusMultiplierHUDView", "BonusMultiplierPip", "BonusRollupHUDController", "BonusRollupHUDView", "LevelHUDController", "LevelHUDView", "ScoreHUDController", "ScoreHUDView", "TimeHUDController", "TimeHUDView", "TrialCounterHUDController", "TrialCounterHUDView", "SceneNodeView", "OvenUIController", "StoveUIController", "CookingPapaController", "EndScreenController", "InstructionSheetController", "Recipie", "RecipieList", "RecipieStep", "RecipieStepController", "ItemAction", "ItemController", "ItemData", "ItemImageSheet", "ItemLookup", "ShelvesController", "TemplateStageController", "TemplateStageModel", "TemplateStageView", "TemplateController", "TemplateEndScreenController", "TemplateEndScreenView", "TemplateMetadataController", "TemplateModel", "TemplateSettings", "TemplateState", "TemplateTitleScreenController", "TemplateTitleScreenView", "TemplateUIController", "TemplateUIView", "TemplateView", "TrialController", "TrialModel", "TrialView", "TemplateTutorialController", "TemplateTutorialModel", "TemplateTutorialView" ]);