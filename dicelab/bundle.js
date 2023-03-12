/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/challenges/challenge_data.js":
/*!*********************************************!*\
  !*** ./src/js/challenges/challenge_data.js ***!
  \*********************************************/
/*! exports provided: Relations, ChallengeData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Relations\", function() { return Relations; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ChallengeData\", function() { return ChallengeData; });\nconst Relations = {\n    GREATER_OR_EQUAL: 1,\n    LESS_OR_EQUAL: 2,\n    GREATER: 3,\n    LESSER: 4\n}\n\nconst ChallengeData = [\n    {\n        id: 1,\n        dieA: {\n            sides: 6,\n            values: [3,3,3,3,3,3]\n        },\n        dieB: {\n            sides: 6,\n            values: [1,1,1,1,1,1]\n        },\n        playerPips: 21,\n        target: {\n            targetVal: 0.5,\n            targetRel: Relations.GREATER_OR_EQUAL\n        }\n    },\n    {\n        id: 2,\n        dieA: {\n            sides: 4,\n            values: [1,2,3,4]\n        },\n        dieB: {\n            sides: 4,\n            values: [3,3,3,3]\n        },\n        playerPips: -1,\n        target: {\n            targetVal: 0.25,\n            targetRel: Relations.GREATER_OR_EQUAL\n        }\n    },\n    {\n        id: 3,\n        dieA: {\n            sides: 8,\n            values: [2,4,2,4,2,4,6,6]\n        },\n        dieB: {\n            sides: 4,\n            values: [3,3,3,3]\n        },\n        playerPips: 16,\n        target: {\n            targetVal: 0.4,\n            targetRel: Relations.GREATER_OR_EQUAL\n        }\n    },\n]\n\n//# sourceURL=webpack:///./src/js/challenges/challenge_data.js?");

/***/ }),

/***/ "./src/js/challenges/challenge_manager.js":
/*!************************************************!*\
  !*** ./src/js/challenges/challenge_manager.js ***!
  \************************************************/
/*! exports provided: Challenge, ChallengeManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Challenge\", function() { return Challenge; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ChallengeManager\", function() { return ChallengeManager; });\n/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/utils */ \"./src/js/common/utils.js\");\n/* harmony import */ var _challenge_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./challenge_data */ \"./src/js/challenges/challenge_data.js\");\n \n\n\n\n\nclass Challenge {\n    constructor(data) {\n        this.id = data.id || -1;\n        this.dieA = {\n            sides: data.dieA.sides || 6,\n            values: data.dieA.values || [1,2,3,4,5,6]\n        }\n        \n        this.dieB = {\n            sides: data.dieB.sides || 6,\n            values: data.dieB.values || [1,2,3,4,5,6],\n        }\n\n        // -1 for no set number of pips to use\n        this.playerPips = data.playerPips || -1;\n\n        this.target = {\n            targetVal: data.target.targetVal || '0.4',\n            targetRel: data.target.targetRel || _challenge_data__WEBPACK_IMPORTED_MODULE_1__[\"Relations\"].GREATER_OR_EQUAL\n        }\n    }\n\n    get challengeText() {\n        let s = 'Can you make dice B win';\n        switch (this.target.targetRel) {\n            case _challenge_data__WEBPACK_IMPORTED_MODULE_1__[\"Relations\"].GREATER_OR_EQUAL:\n                s += ' at least ';\n                break;\n            case _challenge_data__WEBPACK_IMPORTED_MODULE_1__[\"Relations\"].LESS_OR_EQUAL:\n                s += ' at most ';\n                break;\n            default:\n                break;\n        }\n\n        s += `${Object(_common_utils__WEBPACK_IMPORTED_MODULE_0__[\"percentStr\"])(this.target.targetVal)} of the time`;\n\n        if (this.playerPips !== -1) {\n            s += ` using ${this.playerPips} or fewer pips`;\n        }\n\n        s += '?';\n\n        return s;\n    }\n}\n\nclass ChallengeManager {\n    constructor(gr) {\n        this.registry = gr;\n        this.challenges = new Map();\n        _challenge_data__WEBPACK_IMPORTED_MODULE_1__[\"ChallengeData\"].forEach(cData => {\n            const challenge = new Challenge(cData);\n            this.challenges.set(challenge.id, challenge);\n        });\n\n        this.lastChallengeID = -1;\n        this._currentChallenge = null;\n    }\n\n    setToFreeplay() {\n        this._currentChallenge = null;\n    }\n\n    setChallenge(id) {\n        if (this.challenges.has(id)) {\n            this._currentChallenge = this.challenges.get(id);\n        \n            // setup dice\n            this.lastChallengeID = id;\n        }\n    }\n\n    setToRandomChallenge() {\n        let keys = Array.from(this.challenges.keys());\n\n        // remove the most recent one\n        keys = keys.filter(v => {\n            return v !== this.lastChallengeID;\n        });\n\n        const challengeID = keys[Math.floor(Math.random() * keys.length)];\n\n        this.setChallenge(challengeID);\n    }\n\n    // null for freeplay mode\n    get currentChallenge() {\n        return this._currentChallenge;\n    }\n\n\n}\n\n//# sourceURL=webpack:///./src/js/challenges/challenge_manager.js?");

/***/ }),

/***/ "./src/js/common/entity.js":
/*!*********************************!*\
  !*** ./src/js/common/entity.js ***!
  \*********************************/
/*! exports provided: Entity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Entity\", function() { return Entity; });\n/**\n * Class for a game entity\n * (something that gets drawn to the screen, and can receive clicks)\n */\n\nclass Entity {\n    constructor() {\n        this.pos = {\n            x: 0,\n            y: 0\n        }\n        this.bounds = {\n            x: 0,\n            y: 0\n        }\n\n        this.rotation = 0;\n        this.children = [];\n\n        this.show();\n    }\n\n    // no-op in base class\n    onClick(pos) {}\n    render(ctx) {}\n\n    setPos(x, y) {\n        this.pos.x = x;\n        this.pos.y = y;\n    }\n\n    show() {\n        this.visible = true;\n        this.enabled = true;\n    }\n\n    hide() {\n        this.visible = false;\n        this.enabled = false;\n    }\n\n    // derives local click pos and passes event down to children\n    handleClickInternal(pos) {\n        if (!this.enabled || !this.visible) return;\n        \n        let localPos = {\n            x: pos.x - this.pos.x,\n            y: pos.y - this.pos.y\n        }\n\n        let stopPropagation = false;\n\n        this.children.forEach(c => {\n            if (c.handleClickInternal(localPos)) {\n                stopPropagation = true;\n            };\n        });\n\n        if (!stopPropagation) {\n            if ((localPos.x >= 0 && localPos.x < this.bounds.x) && \n            (localPos.y > 0 && localPos.y < this.bounds.y)) {\n                let thisStopPropagation = this.onClick(localPos);\n                if (thisStopPropagation) {\n                    stopPropagation = true;\n                }\n            }\n        }\n        return stopPropagation;\n    }\n\n    // handles local position and passes rendering down to children\n    _render(ctx) {\n        if (!this.visible) return;\n\n        ctx.save();\n        ctx.translate(this.pos.x, this.pos.y);\n        \n        this.render(ctx);\n\n        this.children.forEach(c => {\n            c._render(ctx);\n        });\n        ctx.restore();\n    }\n\n\n}\n\n//# sourceURL=webpack:///./src/js/common/entity.js?");

/***/ }),

/***/ "./src/js/common/utils.js":
/*!********************************!*\
  !*** ./src/js/common/utils.js ***!
  \********************************/
/*! exports provided: drawRoundedRect, percentStr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"drawRoundedRect\", function() { return drawRoundedRect; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"percentStr\", function() { return percentStr; });\nconst drawRoundedRect = (ctx, w, h, r) => {\n    ctx.beginPath();\n        \n    ctx.moveTo(r, 0);\n    ctx.lineTo(w-r, 0);\n    ctx.arcTo(w, 0, w, r, r);\n    ctx.lineTo(w, h-r);\n    ctx.arcTo(w, h, w-r, h, r);\n    ctx.lineTo(r,h);\n    ctx.arcTo(0, h, 0, h-r, r);\n    ctx.lineTo(0,r);\n    ctx.arcTo(0, 0, r, 0, r);\n\n    ctx.closePath();\n}\n\nconst percentStr = (p) => {\n    return `${(p * 100).toFixed(0)}%`;\n}\n\n//# sourceURL=webpack:///./src/js/common/utils.js?");

/***/ }),

/***/ "./src/js/dice/dice_data.js":
/*!**********************************!*\
  !*** ./src/js/dice/dice_data.js ***!
  \**********************************/
/*! exports provided: DiceData, DiceManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DiceData\", function() { return DiceData; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DiceManager\", function() { return DiceManager; });\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui/styles */ \"./src/js/ui/styles.js\");\n\n\nclass DiceData {\n    constructor(sides, label, color) {\n        this.numSides = sides;\n        this.values = [];\n        this.label = label || 'A';\n        this.color = color || '#fff';\n\n        this.onChangeCB = null;\n\n        this.setAscending();\n        this.print();\n    }\n\n    setAscending() {\n        this.values = Array.from(Array(this.numSides).keys()).map( v => v + 1);\n    }\n\n    setConstant(n) {\n        this.values = this.values.fill(n);\n    }\n\n    setValue(i, v) {\n        this.values[i] = v;\n        if (this.onChangeCB) {\n            this.onChangeCB();\n        }\n    }\n\n    print() {\n        let s = this.values.join(' ');\n        console.log(this.numSides, s);\n    }\n\n    get totalPips() {\n        return this.values.reduce((acc, v) => {\n            return acc + v;\n        });\n    }\n\n}\n\nclass DiceManager {\n    constructor(numDice, sides) {\n        this.dice = [];\n        this.lastResults = null;\n    }\n\n    get numDice() {\n        return this.dice.length;\n    }\n\n    clearDice() {\n        this.dice.forEach(d => {\n            d = null;\n        });\n        this.dice = [];\n    }\n\n    addDie(numSides) {\n        const index = this.dice.length;\n        const label = String.fromCharCode(index + 65);\n        const dd = new DiceData(numSides, label, _ui_styles__WEBPACK_IMPORTED_MODULE_0__[\"Colors\"].diceColors[index]);\n        dd.onChangeCB = this.updateResults.bind(this);\n        this.dice.push(dd);\n    }\n\n    getDie(index) {\n        if (index < 0 || index >= this.dice.length) return null;\n        return this.dice[index];\n    }\n\n    clearChallenge(numSides = 6) {\n        this.clearDice();\n        this.addDie(numSides);\n        this.addDie(numSides);\n\n        this.updateResults();\n    }\n\n    setFromChallenge(challengeData) {\n        const { dieA, dieB } = challengeData;\n        this.clearDice();\n        this.addDie(dieA.sides);\n        this.addDie(dieB.sides);\n\n        this.updateResults();\n    }\n\n    // default to getting the first two dice\n    getResults() {\n        if (this.lastResults === null) {\n            this.updateResults();\n        }\n        return this.lastResults;\n    }\n\n    updateResults() {\n        this.lastResults = this._compareDice(0, 1);\n    }\n\n    // ... but allow for more than two to be managed at a time\n    _compareDice(indexA, indexB) {\n        const d1 = this.getDie(indexA);\n        const d2 = this.getDie(indexB);\n        if (d1 === null || d2 === null) {\n            return {}\n        }\n\n        let outcome = {\n            totalContests: 0,\n            totalNoTies: 0,\n            ties: 0,\n            dieA: 0,\n            dieB: 0,\n            dieAFracStr: '',\n            dieBFracStr: '',\n            dieAPercent: 0,\n            dieBPercent: 0,\n            winners: [],\n            dieAindex: indexA,  // keep these here for ease of use when rendering results\n            dieBindex: indexB\n        }\n        for (let i=0; i < d1.values.length; i++) {\n            for (let j=0; j < d2.values.length; j++) {\n                const vA = d1.values[i];\n                const vB = d2.values[j];\n                \n                // -1 for a tie so that 0 and 1 can be used to index into the die list\n                let winner = -1;\n                let index = (j * d1.values.length) + i;\n\n                if (vA === vB) {\n                    outcome.ties++;\n                } else if (vA > vB) {\n                    outcome.dieA++;\n                    winner = 0;\n                } else {\n                    outcome.dieB++;\n                    winner = 1;\n                }\n                outcome.winners[index] = winner;\n            }\n        }\n\n        \n        outcome.totalContests = (d1.values.length * d2.values.length);\n        outcome.totalNoTies = outcome.totalContests - outcome.ties;\n        \n\n        outcome.dieAFracStr = `${outcome.dieA}/${outcome.totalNoTies}`;\n        outcome.dieBFracStr = `${outcome.dieB}/${outcome.totalNoTies}`;\n        \n        outcome.dieAPercent = (outcome.dieA / outcome.totalNoTies);\n        outcome.dieBPercent = (outcome.dieB / outcome.totalNoTies);\n\n        return outcome;\n    }\n}\n\n//# sourceURL=webpack:///./src/js/dice/dice_data.js?");

/***/ }),

/***/ "./src/js/dice/dice_panel.js":
/*!***********************************!*\
  !*** ./src/js/dice/dice_panel.js ***!
  \***********************************/
/*! exports provided: DicePanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DicePanel\", function() { return DicePanel; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/styles */ \"./src/js/ui/styles.js\");\n/* harmony import */ var _single_die_panel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./single_die_panel */ \"./src/js/dice/single_die_panel.js\");\n\n\n\n\nclass DicePanel extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(gr, diceData) {\n        super();\n        this.registry = gr;\n\n        this.diePanels = [];\n        this.setupDiceDisplays();\n    }\n\n    setChallenge(isChallenge) {\n        this.diePanels.forEach(dp => {\n            dp.setChallenge(isChallenge);\n        })\n    }\n\n    reset() {\n        // clear out any previous ones\n        this.diePanels.forEach(dp => {\n            dp = null;\n        });\n        this.diePanels = [];\n        this.children = [];\n\n        this.setupDiceDisplays();\n    }\n\n    setupDiceDisplays() {\n        const { diceManager } = this.registry;\n        const { dieSize, dieSeparation } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"]; \n\n        const offsetY = dieSize + (dieSeparation * 3);\n\n        diceManager.dice.forEach((diceData, i) => {\n            const label = String.fromCharCode(i + 65);\n            const diePanel = new _single_die_panel__WEBPACK_IMPORTED_MODULE_2__[\"SingleDiePanel\"](this.registry, label, diceData, (i > 0));\n            diePanel.setPos(0, (i * offsetY));\n            this.diePanels.push(diePanel);\n            this.children.push(diePanel);\n        });\n    }\n}\n\n//# sourceURL=webpack:///./src/js/dice/dice_panel.js?");

/***/ }),

/***/ "./src/js/dice/die_face.js":
/*!*********************************!*\
  !*** ./src/js/dice/die_face.js ***!
  \*********************************/
/*! exports provided: DieFace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DieFace\", function() { return DieFace; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/styles */ \"./src/js/ui/styles.js\");\n\n\n\nclass DiePip extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor() {\n        super();\n        const { pipRad } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n\n        this.bounds.x = pipRad;\n        this.bounds.y = pipRad;\n\n        this.removeCB = null;\n    }\n    \n    onClick(pos) {\n        /*\n        const { pipRad } = Dimensions;\n        console.log('removing pip!');\n        if (this.removeCB) {\n            this.removeCB();\n        }\n        return true;\n        */\n    }\n\n    render(ctx) {\n        const { pipRad } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        const { pipColor, dieColorActive, dieColorLocked } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Colors\"]; \n\n        ctx.save();\n\n        ctx.beginPath();\n        ctx.arc(pipRad/2, pipRad/2, pipRad, 0, Math.PI * 2);\n        ctx.fill();\n\n        ctx.restore();\n    }\n}\n\nclass DieFace extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(n, changeCB) {\n        super();\n        \n        const { dieSize, pipRad } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n\n        this.changeCB = changeCB || null;\n        this.numPips = n;\n        this.pips = [];\n\n        this.bounds.x = dieSize;\n        this.bounds.y = dieSize;\n\n        this.canAddPips = true;\n        this.canRemovePips = true;\n\n        this.updatePips();\n    }\n\n    onClick(pos) {\n        if (pos.y < this.bounds.y * 0.4) {\n            this.addPip();\n        } else if (pos.y > this.bounds.y * 0.6) {\n            this.removePip();\n        }\n    }\n\n    updatePips() {\n        const n = this.numPips;\n        const { dieSize, pipRad } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n\n        const pipOffset = -(pipRad/2);\n\n        const removeFunc = this.removePip.bind(this);\n\n        this.pips.forEach(p => {\n            p = null;\n        });\n        this.pips = [];\n\n        // top-left\n        if (n > 3) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.2 + pipOffset, dieSize * 0.2 + pipOffset);\n            this.pips.push(p);            \n        }\n\n        // top-right\n        if (n > 1) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.8 + pipOffset, dieSize * 0.2 + pipOffset);\n            this.pips.push(p);\n        }\n\n        // cent-left and cent-right\n        if (n > 5) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.2 + pipOffset, dieSize * 0.5 + pipOffset);\n            this.pips.push(p);            \n\n            const p2 = new DiePip();\n            p2.setPos(dieSize * 0.8 + pipOffset, dieSize * 0.5 + pipOffset);\n            this.pips.push(p2);\n        }\n\n        // center dot\n        if ((n % 2 === 1) || (n > 6)) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.5 + pipOffset, dieSize * 0.5 + pipOffset);\n            this.pips.push(p);\n        }\n\n        // bottom-left\n        if (n > 1) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.2 + pipOffset, dieSize * 0.8 + pipOffset);\n            this.pips.push(p); \n        }\n\n        // bottom-right\n        if (n > 3) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.8 + pipOffset, dieSize * 0.8 + pipOffset);\n            this.pips.push(p);\n        }\n\n        // top-cent\n        if (n > 7) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.5 + pipOffset, dieSize * 0.2 + pipOffset);\n            this.pips.push(p);\n        }\n\n        // bottom-cent\n        if (n > 8) {\n            const p = new DiePip();\n            p.setPos(dieSize * 0.5 + pipOffset, dieSize * 0.8 + pipOffset);\n            this.pips.push(p);\n        }\n\n        this.pips.forEach(p => {\n            p.removeCB = this.removePip.bind(this);\n        });\n\n        this.children = [];\n        this.children = this.children.concat(this.pips);\n    }\n\n    removePip() {\n        if (!this.canRemovePips) return;\n\n        if (this.numPips > 0) {\n            this.numPips--;\n            this.updatePips();\n            this.maybeSignalChange();\n        }\n    }\n\n    addPip() {\n        if (!this.canAddPips) return;\n\n        console.log('adding pip');\n        if (this.numPips < 9) {\n            this.numPips++;\n            this.updatePips();\n            this.maybeSignalChange();\n        }\n    }\n\n    maybeSignalChange() {\n        if (this.changeCB !== null) {\n            this.changeCB(this.numPips);\n        }\n    }\n\n    render(ctx) {\n        const { dieSize } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        const { dieColorActive, dieColorLocked } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Colors\"]; \n\n        ctx.save();\n\n        ctx.fillStyle = dieColorActive;\n        ctx.fillRect(0, 0, dieSize, dieSize);\n        ctx.strokeRect(0, 0, dieSize, dieSize);\n\n\n        ctx.restore();\n    }\n}\n\n//# sourceURL=webpack:///./src/js/dice/die_face.js?");

/***/ }),

/***/ "./src/js/dice/results_grid.js":
/*!*************************************!*\
  !*** ./src/js/dice/results_grid.js ***!
  \*************************************/
/*! exports provided: ResultsGrid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ResultsGrid\", function() { return ResultsGrid; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/styles */ \"./src/js/ui/styles.js\");\n\n\n\n/*\nRenders competitive results for two dice\nHard-coded to only support two, since more would require a drastically different\napproach to visual display\n*/\nclass ResultsGrid extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(gr) {\n        super();\n        this.registry = gr;\n\n        this.reset();\n    }\n\n    reset() {\n        const { diceManager } = this.registry;\n\n        this.dieA = diceManager.getDie(0) || null;\n        this.dieB = diceManager.getDie(1) || null;\n    }\n\n    renderError(ctx) {\n        const { resultsPanelSize } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"]; \n        \n        ctx.save();\n\n        ctx.textAlign = \"center\";\n        ctx.translate(resultsPanelSize/2, resultsPanelSize/2);\n        ctx.fillText('Grid requires two dice', 0, 0);\n        ctx.restore();\n    }\n\n    renderGrid(ctx) {\n        const { resultsPanelSize } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        \n        const d1 = this.dieA;\n        const d2 = this.dieB;\n\n        const valuesA = [...this.dieA.values].sort();\n        const valuesB = [...this.dieB.values].sort();\n\n        const gridUnitsX = d1.numSides + 1;\n        const gridUnitsY = d2.numSides + 1;\n\n        const cellWidth = resultsPanelSize / gridUnitsX;\n        const cellHeight = resultsPanelSize / gridUnitsY;\n\n        const fontSize = Math.floor(Math.min(cellWidth, cellHeight) * 0.8);\n\n        ctx.save();\n        ctx.fillStyle = '#fff';\n        ctx.fillRect(0, 0, resultsPanelSize, resultsPanelSize);\n\n        ctx.restore();\n\n\n        ctx.save();\n        ctx.font = `${fontSize}px Helvetica`;\n\n        ctx.save();\n        ctx.translate(cellWidth, cellHeight);\n\n        // render actual results\n        for (let i=0; i < d1.numSides; i++) {\n            for (let j=0; j < d2.numSides; j++) {\n                let fillColor = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Colors\"].tiedColor;\n                if (valuesA[i] > valuesB[j]) {\n                    fillColor = d1.color;\n                } else if (valuesB[j] > valuesA[i]) {\n                    fillColor = d2.color;\n                }\n                ctx.fillStyle = fillColor;\n                ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);\n                \n            }\n        }\n        ctx.restore();\n\n        ctx.strokeRect(0, 0, resultsPanelSize, resultsPanelSize);\n\n        // draw grid units\n        ctx.save();\n        for (let i=0; i < gridUnitsX; i++) {\n            ctx.beginPath();\n            ctx.moveTo(0, 0);\n            ctx.lineTo(0, resultsPanelSize);\n            ctx.stroke();\n\n            if (i > 0) {\n                ctx.save();\n                ctx.translate(cellWidth * 0.2, cellHeight * 0.8);\n                ctx.fillText(valuesA[i-1]+'', 0, 0);\n                ctx.restore();\n            }\n\n            ctx.translate(cellWidth, 0);\n        }\n        ctx.restore();\n\n        // draw grid units\n        ctx.save();\n        for (let i=0; i < gridUnitsY; i++) {\n            ctx.beginPath();\n            ctx.moveTo(0, 0);\n            ctx.lineTo(resultsPanelSize, 0);\n            ctx.stroke();\n\n            if (i > 0) {\n                ctx.save();\n                ctx.translate(cellWidth * 0.2, cellHeight * 0.8);\n                ctx.fillText(valuesB[i-1]+'', 0, 0);\n                ctx.restore();\n            }\n\n            ctx.translate(0, cellHeight);\n        }\n        ctx.restore();\n\n        \n        ctx.restore();\n    }\n\n    render(ctx) {\n        if (this.dieA === null || this.dieB === null) {\n            this.renderError(ctx);\n            return;\n        }\n\n        this.renderGrid(ctx);\n    } \n}\n\n//# sourceURL=webpack:///./src/js/dice/results_grid.js?");

/***/ }),

/***/ "./src/js/dice/results_percent.js":
/*!****************************************!*\
  !*** ./src/js/dice/results_percent.js ***!
  \****************************************/
/*! exports provided: ResultsPercent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ResultsPercent\", function() { return ResultsPercent; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/styles */ \"./src/js/ui/styles.js\");\n/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ \"./src/js/common/utils.js\");\n\n\n \n\nclass ResultsPercent extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(gr) {\n        super();\n        this.registry = gr;\n        const { percentPanelW, percentPanelH } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        \n        this.bounds.x = percentPanelW;\n        this.bounds.y = percentPanelH;\n        \n    }\n\n    render(ctx) {\n        const { diceManager } = this.registry;\n        const { percentPanelW, percentPanelH } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        const { tiedColor, textColor } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Colors\"]; \n\n        const outcome = diceManager.getResults();\n        const {\n            dieAindex,\n            dieBindex,\n            ties,\n            dieA,\n            dieB,\n            dieAPercent,\n            dieBPercent\n        } = outcome; \n\n        const dA = diceManager.getDie(dieAindex);\n        const dB = diceManager.getDie(dieBindex);\n\n        ctx.save();\n\n        const rowH = percentPanelH / 3;\n        const colW = percentPanelW / 4;\n\n        // draw color fills\n        ctx.save();\n        ctx.fillStyle = dA.color;\n        ctx.fillRect(0, 0, colW, rowH);\n        ctx.fillStyle = dB.color;\n        ctx.fillRect(0, rowH, colW, rowH);\n        ctx.fillStyle = tiedColor;\n        ctx.fillRect(0, (rowH * 2), colW, rowH);\n        ctx.restore();\n\n        // draw text\n        ctx.save();\n        ctx.fillStyle = textColor;\n        ctx.font = `${rowH * 0.8}px Helvetica`;\n        ctx.textAlign = \"center\";\n        ctx.fillText(dA.label, colW * 0.5, rowH * 0.8);\n        ctx.fillText(dB.label, colW * 0.5, rowH * 1.8);\n        ctx.font = `${colW/4}px Helvetica`;\n        ctx.fillText('tied', colW * 0.5, rowH * 2.8);\n        ctx.restore();\n\n        // draw totals\n        ctx.save();\n        ctx.fillStyle = textColor;\n        ctx.font = `${rowH * 0.6}px Helvetica`;\n        ctx.textAlign = \"center\";\n        ctx.fillText(`${dieA}`, colW * 1.5, rowH * 0.8);\n        ctx.fillText(`${dieB}`, colW * 1.5, rowH * 1.8);\n        ctx.fillText(`${ties}`, colW * 1.5, rowH * 2.8);\n        ctx.restore();\n\n        ctx.save();\n        ctx.fillStyle = textColor;\n        ctx.font = `${colW * 0.4}px Helvetica`;\n        ctx.textAlign = \"center\";\n        ctx.fillText(`${Object(_common_utils__WEBPACK_IMPORTED_MODULE_2__[\"percentStr\"])(dieAPercent)}`, colW * 2.5, rowH * 0.65);\n        ctx.fillText(`${Object(_common_utils__WEBPACK_IMPORTED_MODULE_2__[\"percentStr\"])(dieBPercent)}`, colW * 2.5, rowH * 1.65);\n        ctx.restore();\n\n        ctx.save();\n        // ctx.strokeRect(0, 0, percentPanelW, percentPanelH);\n\n        ctx.beginPath();\n        ctx.moveTo(0, 0);\n        ctx.lineTo(colW*3, 0);\n        ctx.moveTo(0, rowH);\n        ctx.lineTo(colW*3, rowH);\n        ctx.moveTo(0, rowH*2);\n        ctx.lineTo(colW*3, rowH*2);\n        ctx.moveTo(0, rowH*3);\n        ctx.lineTo(colW*2, rowH*3);\n\n        ctx.moveTo(0, 0);\n        ctx.lineTo(0, rowH*3);\n        ctx.moveTo(colW, 0);\n        ctx.lineTo(colW, rowH*3);\n        ctx.moveTo(colW*2, 0);\n        ctx.lineTo(colW*2, rowH*3);\n        ctx.moveTo(colW*3, 0);\n        ctx.lineTo(colW*3, rowH*2);\n\n        ctx.stroke();\n\n        ctx.restore();\n\n\n        ctx.restore();\n\n    }\n}\n\n//# sourceURL=webpack:///./src/js/dice/results_percent.js?");

/***/ }),

/***/ "./src/js/dice/single_die_panel.js":
/*!*****************************************!*\
  !*** ./src/js/dice/single_die_panel.js ***!
  \*****************************************/
/*! exports provided: SingleDiePanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SingleDiePanel\", function() { return SingleDiePanel; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/styles */ \"./src/js/ui/styles.js\");\n/* harmony import */ var _dice_die_face__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dice/die_face */ \"./src/js/dice/die_face.js\");\n\n\n\n\nclass SingleDiePanel extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(gr, label, diceData, isChallengePanel) {\n        super();\n        this.registry = gr;\n        this.diceData = diceData;\n\n        const { dieSize, dieSeparation, diePanelOffsetX } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"]; \n\n        this.bounds.x = (this.diceData.numSides * (dieSize + dieSeparation)) + diePanelOffsetX;\n        this.bounds.y = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"].dieSize + (_ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"].dieSeparation * 2);\n\n        // can this panel be manipulated in challenge mode?\n        this.isChallengePanel = isChallengePanel;\n\n        this.initFaces();\n    }\n\n    setChallenge(playingChallenge) {\n        if (playingChallenge && !this.isChallengePanel) {\n            this.enabled = false;\n        }\n    }\n\n    initFaces() {\n        const { dieSize, dieSeparation, diePanelOffsetX } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"]; \n\n        this.faces = [];\n        this.diceData.values.forEach((v, i) =>  {\n            const df = new _dice_die_face__WEBPACK_IMPORTED_MODULE_2__[\"DieFace\"](v, (newValue) => {\n                this.diceData.setValue(i, newValue);\n            });\n            df.setPos((i * (dieSize + dieSeparation)) + (dieSeparation/2) + diePanelOffsetX,\n                dieSeparation);\n            this.children.push(df);\n        });\n    }\n\n    // maybe alter pips\n    onClick(pos) {\n        console.log('clicked on dice panel');\n    }\n\n    drawDieName(ctx) {\n        const { dieSize, dieSeparation, diePanelOffsetX } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        const { textColor } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Colors\"]; \n\n        ctx.save();\n        ctx.font = '60px Helvetica';\n        ctx.textAlign = \"center\";\n        ctx.fillStyle = textColor;\n        ctx.fillText(this.diceData.label, dieSize/2, dieSize);\n        ctx.restore();\n    }\n\n    drawTotalPips(ctx) {\n\n        const { textColor } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Colors\"];\n        const { dieSize, dieSeparation, diePanelOffsetX } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        \n        const rightEdge = this.bounds.x + 10 + dieSize;\n        \n        // only get this once since the getter runs through the values array\n        const totalPips = this.diceData.totalPips;\n        let pipStr = `${totalPips}`;\n\n        const currChallenge = this.registry.challenges.currentChallenge;\n        if ((currChallenge !== null) && (currChallenge.playerPips !== -1)) {\n            pipStr = `${totalPips}/${currChallenge.playerPips}`;\n        }\n\n        ctx.save();\n        ctx.textAlign = \"center\";\n        ctx.fillStyle = textColor;\n        ctx.font = `${dieSize * 0.8}px Helvetica`;\n        ctx.fillText(pipStr, rightEdge, dieSize * 0.8);\n\n        ctx.font = `${dieSize * 0.2}px Helvetica`;\n        ctx.fillText('pips', rightEdge, dieSize);\n        ctx.restore();\n    }\n\n    drawLock(ctx) {\n        const { dieSize, dieSeparation, diePanelOffsetX } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Dimensions\"];\n        const rightEdge = this.bounds.x + 10 + dieSize/2;\n        \n        ctx.save();\n\n        ctx.fillStyle = '#E24E1B';\n        ctx.strokeStyle = '#E24E1B';\n\n        const circleRad = dieSize * 0.4;\n\n        let angleOffset = Math.sin(Math.PI/4) * circleRad;\n\n        ctx.lineWidth = 10;\n        ctx.beginPath();\n        ctx.arc(rightEdge, dieSize/2 + dieSeparation, circleRad, 0, Math.PI * 2);\n        ctx.moveTo(rightEdge + angleOffset, dieSize/2 + dieSeparation - angleOffset);\n        ctx.lineTo(rightEdge - angleOffset, dieSize/2 + dieSeparation + angleOffset);\n        ctx.stroke();\n\n        ctx.restore();\n    }\n\n    render(ctx) {\n        ctx.save();\n\n        ctx.fillStyle = this.diceData.color;\n        ctx.fillRect(0, 0, this.bounds.x, this.bounds.y);\n        ctx.strokeRect(0, 0, this.bounds.x, this.bounds.y);\n\n        this.drawDieName(ctx);\n\n        if (this.enabled) {\n            this.drawTotalPips(ctx);\n        } else {\n            this.drawLock(ctx);\n        }\n\n        ctx.restore();\n    }\n}\n\n//# sourceURL=webpack:///./src/js/dice/single_die_panel.js?");

/***/ }),

/***/ "./src/js/game.js":
/*!************************!*\
  !*** ./src/js/game.js ***!
  \************************/
/*! exports provided: DicelabClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DicelabClient\", function() { return DicelabClient; });\n/* harmony import */ var _game_registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_registry */ \"./src/js/game_registry.js\");\n/* harmony import */ var _game_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game_data */ \"./src/js/game_data.js\");\n/* harmony import */ var _ui_game_screen__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/game_screen */ \"./src/js/ui/game_screen.js\");\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui/styles */ \"./src/js/ui/styles.js\");\n/* harmony import */ var _dice_dice_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dice/dice_data */ \"./src/js/dice/dice_data.js\");\n/* harmony import */ var _challenges_challenge_manager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./challenges/challenge_manager */ \"./src/js/challenges/challenge_manager.js\");\n\n\n\n\n\n\n\n/**\n * DicelabClient: main game class\n */\n\nclass DicelabClient {\n\n    constructor(stageId) {\n        let mainScreen = null;\n        \n        this.initCanvas(stageId);\n\n        this.gameRegistry = new _game_registry__WEBPACK_IMPORTED_MODULE_0__[\"GameRegistry\"]();\n        \n        this.children = [];\n\n        document.onmousedown = this.mouseDown.bind(this);\n\n        this.startGame();\n        this.update();\n    }\n\n    initCanvas(stageId) {\n        this.canvasEl = document.getElementById(stageId);\n        this.ctx = this.canvasEl.getContext('2d');\n\n        this.bounds = {\n            width: this.canvasEl.clientWidth,\n            height: this.canvasEl.clientHeight,\n        }\n\n        this.pos = {\n            x: this.canvasEl.offsetLeft,\n            y: this.canvasEl.offsetTop\n        };\n    }\n\n    mouseDown(evt) {\n        let localPos = {\n            x: evt.clientX - this.pos.x,\n            y: evt.clientY - this.pos.y            \n        }\n        this.children.forEach(c => {\n            c.handleClickInternal(localPos);\n        })\n\n    }\n\n    startGame() {\n\n        const dm = new _dice_dice_data__WEBPACK_IMPORTED_MODULE_4__[\"DiceManager\"](2, 6);\n        dm.addDie(6);\n        dm.addDie(6);\n        this.gameRegistry.diceManager = dm;\n        this.gameRegistry.diceManager.dice[0].setConstant(3);\n\n        let challenges = new _challenges_challenge_manager__WEBPACK_IMPORTED_MODULE_5__[\"ChallengeManager\"](this.gameRegistry);\n        this.gameRegistry.challenges = challenges;\n\n        this.mainScreen = new _ui_game_screen__WEBPACK_IMPORTED_MODULE_2__[\"GameScreen\"](this.gameRegistry);\n        this.children.push(this.mainScreen);\n\n    }\n\n    /**\n     * render loop\n     */\n    render(dt) {\n        let ctx = this.ctx;\n        let { width, height } = this.bounds;        \n\n        ctx.clearRect(0, 0, width, height);\n        ctx.save();\n\n        ctx.save();\n        ctx.fillStyle = _ui_styles__WEBPACK_IMPORTED_MODULE_3__[\"Colors\"].backColorMain; // '#ffcb74';\n        ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);\n        ctx.restore();\n\n        if (this.mainScreen) {\n            this.mainScreen._render(ctx);\n        } else {\n            ctx.save();\n            ctx.translate(width/2, height/2);\n            ctx.fillText('loading', 0, 0);\n            ctx.restore();\n        }\n\n        ctx.restore();\n    }\n\n    update() {\n        let curr = Date.now();\n        let deltaTime = curr - this.lastTime;\n        this.lastTime = curr;\n\n        this.render(deltaTime);\n\n        requestAnimationFrame(this.update.bind(this));\n    }\n\n}\n\n//# sourceURL=webpack:///./src/js/game.js?");

/***/ }),

/***/ "./src/js/game_data.js":
/*!*****************************!*\
  !*** ./src/js/game_data.js ***!
  \*****************************/
/*! exports provided: GameData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GameData\", function() { return GameData; });\nconst SERVER_URL_DEV = 'http://localhost:8080';\nconst SERVER_URL = 'http://polar-earth-02456.herokuapp.com'\n\nclass GameData {\n    constructor() {\n        this.businessJSON = null;\n        this.achievementJSON = null;\n        this.upgradesJSON = null;\n\n        this.loaded = false;\n    }\n\n    getFromServer(callback) {\n        fetch(`${SERVER_URL}/gamedata`).then(res => {\n            res.json().then(resJSON => {\n                this.businessJSON = resJSON.businesses;\n                this.achievementJSON = resJSON.achievements;\n                this.upgradesJSON = resJSON.upgrades;\n\n                this.loaded = true;\n                callback();\n            });\n        });\n    }\n}\n\n//# sourceURL=webpack:///./src/js/game_data.js?");

/***/ }),

/***/ "./src/js/game_registry.js":
/*!*********************************!*\
  !*** ./src/js/game_registry.js ***!
  \*********************************/
/*! exports provided: GameRegistry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GameRegistry\", function() { return GameRegistry; });\nclass GameRegistry {\n    constructor() {\n        // dice data manager\n        this.diceManager = null;\n\n        // challenges\n        this.challenges = null;\n    }\n}\n\n//# sourceURL=webpack:///./src/js/game_registry.js?");

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/js/game.js\");\n\n\nlet client = new _game__WEBPACK_IMPORTED_MODULE_0__[\"DicelabClient\"]('stage');\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ }),

/***/ "./src/js/ui/button.js":
/*!*****************************!*\
  !*** ./src/js/ui/button.js ***!
  \*****************************/
/*! exports provided: ButtonDefaultStyle, Button */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ButtonDefaultStyle\", function() { return ButtonDefaultStyle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Button\", function() { return Button; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ \"./src/js/common/utils.js\");\n\n\n\nconst ButtonDefaultStyle = {\n    radius: 10,\n    fill: '#AFA',\n    disabledColor: '#AAA',\n    strokeColor: '#000',\n    strokeColorDisabled: '#000',\n    border: 3,    \n}\n\nclass Button extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(params) {\n        super();\n        this.bounds.x = params.width || 50;\n        this.bounds.y = params.height || 50;\n        this.callback = params.callback || null;\n        this.label = params.label || 'foo';\n\n        this.radius = params.radius || ButtonDefaultStyle.radius;\n        this.backColor = params.fill || ButtonDefaultStyle.fill;\n        this.disabledColor = params.disabledColor || ButtonDefaultStyle.disabledColor;\n        this.strokeColor = params.stroke || ButtonDefaultStyle.strokeColor;\n        this.strokeColorDisabled = params.strokeDisabled || ButtonDefaultStyle.strokeColorDisabled;\n        this.border = params.border || ButtonDefaultStyle.border;\n\n        this.enabled = true;\n    }\n\n    onClick(pos) {\n        if (!this.enabled || !this.visible) return;\n\n        if (this.callback) {\n            this.callback();\n        }\n    }\n\n    drawButtonBack(ctx) {\n        let r = this.radius;\n        let w = this.bounds.x;\n        let h = this.bounds.y;\n\n        ctx.save();\n\n        ctx.fillStyle = (this.enabled) ? this.backColor : this.disabledColor;\n        ctx.strokeStyle = (this.enabled) ? this.strokeColor : this.strokeColorDisabled;\n        ctx.lineWidth = this.border;\n\n        Object(_common_utils__WEBPACK_IMPORTED_MODULE_1__[\"drawRoundedRect\"])(ctx, w, h, r);\n\n        ctx.fill();\n        ctx.stroke();\n\n        ctx.restore();\n    }\n\n    render(ctx) {\n        let w = this.bounds.x;\n        let h = this.bounds.y;\n\n        this.drawButtonBack(ctx);\n\n        ctx.fillStyle = (this.enabled) ? this.strokeColor : this.strokeColorDisabled;\n\n        ctx.save();\n        ctx.textAlign = 'center';\n        ctx.translate(w/2, h/2);\n        ctx.font = '20px helvetica';\n        ctx.fillText(this.label, 0, 0);\n        ctx.restore();\n    }\n}\n\n//# sourceURL=webpack:///./src/js/ui/button.js?");

/***/ }),

/***/ "./src/js/ui/game_screen.js":
/*!**********************************!*\
  !*** ./src/js/ui/game_screen.js ***!
  \**********************************/
/*! exports provided: GameScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GameScreen\", function() { return GameScreen; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _game_registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../game_registry */ \"./src/js/game_registry.js\");\n/* harmony import */ var _ui_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/button */ \"./src/js/ui/button.js\");\n/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ \"./src/js/ui/styles.js\");\n/* harmony import */ var _dice_dice_panel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dice/dice_panel */ \"./src/js/dice/dice_panel.js\");\n/* harmony import */ var _dice_results_grid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dice/results_grid */ \"./src/js/dice/results_grid.js\");\n/* harmony import */ var _dice_results_percent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dice/results_percent */ \"./src/js/dice/results_percent.js\");\n/* harmony import */ var _text_box__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./text_box */ \"./src/js/ui/text_box.js\");\n\n\n\n\n\n\n\n\n\nconst INSTRUCTIONS = 'Click on the dice faces to change their values and experiement, or click on the challenges button to try a puzzle';\n\nclass GameScreen extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(gr) {\n        super();\n        this.registry = gr;\n\n        this.init();\n    }\n\n    init() {\n        this.dicePanel = new _dice_dice_panel__WEBPACK_IMPORTED_MODULE_4__[\"DicePanel\"](this.registry);\n        this.dicePanel.setPos(10, 10);\n        this.children.push(this.dicePanel);\n\n        this.resultsGrid = new _dice_results_grid__WEBPACK_IMPORTED_MODULE_5__[\"ResultsGrid\"](this.registry);\n        this.resultsGrid.setPos(10, 200);\n        this.children.push(this.resultsGrid);\n\n        this.resultsPercent = new _dice_results_percent__WEBPACK_IMPORTED_MODULE_6__[\"ResultsPercent\"](this.registry);\n        this.resultsPercent.setPos(400, 200);\n        this.children.push(this.resultsPercent);\n\n        this.challengeText = new _text_box__WEBPACK_IMPORTED_MODULE_7__[\"TextBox\"](400);\n        this.challengeText.setPos(400, 500);\n        this.children.push(this.challengeText);\n        this.challengeText.text = INSTRUCTIONS;\n\n\n        this.challengeButton = new _ui_button__WEBPACK_IMPORTED_MODULE_2__[\"Button\"]({\n            label: 'challenge',\n            callback: () => {this.setChallenge();},\n            width: 100,\n            radius: 2,\n            border: 1,\n            fill: '#E4572E'\n        });\n        this.challengeButton.setPos(690, 300);\n        this.children.push(this.challengeButton);\n\n        this.freeplayButton = new _ui_button__WEBPACK_IMPORTED_MODULE_2__[\"Button\"]({\n            label: 'freeplay',\n            callback: () => {this.clearChallenge();},\n            width: 100,\n            radius: 2,\n            border: 1,\n            fill: '#06BEE1'\n        });\n        this.freeplayButton.setPos(690, 200);\n        this.children.push(this.freeplayButton);\n\n        const diceSides = [4,6,8];\n        diceSides.forEach((numSides, i) => {\n            const b = new _ui_button__WEBPACK_IMPORTED_MODULE_2__[\"Button\"]({\n                label: `${numSides}`,\n                callback: () => {this.clearChallenge(numSides)},\n                width: 30,\n                height: 30,\n                radius: 2,\n                border: 1,\n                fill: '#06BEE1'\n\n            });\n            b.setPos(690 + (i*32) + 4, 256);\n            this.children.push(b);\n        });\n\n    }\n    \n    resetGame(isChallenge) {\n        this.dicePanel.reset();\n        this.resultsGrid.reset();\n\n        this.dicePanel.setChallenge(isChallenge);\n    }\n\n    clearChallenge(numSides = 6) {\n        const { challenges, diceManager } = this.registry;\n        challenges.setToFreeplay();\n        diceManager.clearChallenge(numSides);\n\n        this.challengeText.text = INSTRUCTIONS;\n\n        this.resetGame(false);\n    }\n\n    setChallenge() {\n        const { challenges, diceManager } = this.registry;\n        challenges.setToRandomChallenge();\n\n        const challenge = challenges.currentChallenge;\n\n        diceManager.setFromChallenge(challenge);\n        this.challengeText.text = challenge.challengeText;\n\n        this.resetGame(true);\n\n    }\n}\n\n//# sourceURL=webpack:///./src/js/ui/game_screen.js?");

/***/ }),

/***/ "./src/js/ui/styles.js":
/*!*****************************!*\
  !*** ./src/js/ui/styles.js ***!
  \*****************************/
/*! exports provided: Dimensions, Colors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Dimensions\", function() { return Dimensions; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Colors\", function() { return Colors; });\nconst Dimensions = {\n    panelWidth: 500,\n    dieSize: 60,\n    dieSeparation: 10,\n    diePanelOffsetY: 90,\n    pipRad: 5,\n    diePanelOffsetX: 70,\n    resultsPanelSize: 380,\n    percentPanelW: 300,\n    percentPanelH: 270,\n}\n\nconst Colors = {\n    backColorMain: '#EEF0F2', // F4E4BA\n    backColorOn: '#ec823a',\n    backColorOff: '#f9c49a',\n    borderColorMain: '#7c3c21',\n    backgroundBlue: '#12cad6',\n    pipColor: '#000',\n    diceColors: ['#3D52D5', '#84E296', '#00F'],\n    tiedColor: '#aaa',\n    textColor: '#000',\n    dieColorActive: '#fff',\n    dieColorLocked: '#aaa',\n}\n\n//# sourceURL=webpack:///./src/js/ui/styles.js?");

/***/ }),

/***/ "./src/js/ui/text_box.js":
/*!*******************************!*\
  !*** ./src/js/ui/text_box.js ***!
  \*******************************/
/*! exports provided: TextBox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TextBox\", function() { return TextBox; });\n/* harmony import */ var _common_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/entity */ \"./src/js/common/entity.js\");\n/* harmony import */ var _ui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/styles */ \"./src/js/ui/styles.js\");\n\n\n\nclass TextBox extends _common_entity__WEBPACK_IMPORTED_MODULE_0__[\"Entity\"] {\n    constructor(w) {\n        super();\n        \n        this.width = w;\n\n        this._text = '';\n        this.isDirty = false;\n        this.lines = [];\n    }\n\n    set text(t) {\n        this._text = t;\n        this.isDirty = true;\n    }\n\n    _updateText(ctx) {\n        const words = this._text.split(' ');\n        this.lines = [];\n        let currLine = words[0];\n\n        for (let i=1; i < words.length; i++ ) {\n            let metrics = ctx.measureText(currLine + ' ' + words[i]);\n            if (metrics.width > this.width) {\n                this.lines.push(currLine);\n                currLine = words[i];\n            } else {\n                currLine += ` ${words[i]}`;\n            }\n        }\n        this.lines.push(currLine);\n\n        this.isDirty = false;\n    }\n\n    render(ctx) {\n        const { textColor } = _ui_styles__WEBPACK_IMPORTED_MODULE_1__[\"Colors\"];\n\n        ctx.save();\n        ctx.fillStyle = textColor;\n        ctx.font = '20px Helvetica';\n\n        if (this.isDirty) {\n            this._updateText(ctx);\n        }\n\n        this.lines.forEach(l => {\n            ctx.fillText(l, 0, 0);\n            ctx.translate(0, 24);\n        });\n\n        ctx.restore();\n    }\n}\n\n//# sourceURL=webpack:///./src/js/ui/text_box.js?");

/***/ })

/******/ });