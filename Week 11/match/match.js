/**
 * Custom element node to store the conditions of selected item
 */
class el {
	constructor(elIndex, elTagName = '', elId = '', elClass = '', elAncestorTagName = '') {
		this.elIndex = elIndex;
		this.elTagName = elTagName;
		this.elId = elId;
		this.elClass = elClass;
		this.elChildren = [];
		this.elAncestorTagName = elAncestorTagName;
	}

	addChild(child) {
		this.elChildren.push(child);
	}
}

/**
 * index of custom element node
 */
let indexSequence = 0;

/**
 * Init a root custom element node
 */
const selectorParsed = new el(indexSequence, 'root');

/**
 * Mark the current parsed element node
 */
let parsingEl = selectorParsed;

/**
 * Use finit state machine to parse the CSS selector
 * @param {string} selector CSS selector
 */
function parseSelector(selector) {
	let state = start;
	for (c of selector) {
		state = state(c);
	}
	parsingEl = null;
	return state = end;
}

function start(c) {
	if (c === 'd') {
		return foundD;
	} else {
		return start;
	}
}

function end(c) {
	return end;
}

function foundD(c) {
	if (c === 'i') {
		return foundI;
	} else {
		return start(c);
	}
}


function foundI(c) {
	if (c === 'v') {
		indexSequence += 1;
		let elDiv = new el(indexSequence, 'div', '', '', parsingEl.elTagName);
		parsingEl.addChild(elDiv);
		parsingEl = elDiv;
		return foundV;
	} else {
		return start(c);
	}
}

function foundV(c) {
	if (c === ' ') {
		indexSequence += 1;
		let childNode = new el(indexSequence, '', '', '', parsingEl.elTagName);
		parsingEl.addChild(childNode);
		parsingEl = childNode;
		return foundSP;
	} else {
		return start(c);
	}
}

function foundSP(c) {
	if (c === '#') {
		return foundIdSymbol;
	} else {
		return start(c);
	}
}

function foundIdSymbol(c) {
	console.log('c: ', c);
	if (c === 'i') {
		parsingEl.elId += c;
		console.log('parsingEl: ', parsingEl);
		return foundIdI;
	} else {
		return start(c);
	}
}

function foundIdI(c) {
	if (c === 'd') {
		parsingEl.elId += c;
		return foundIdD;
	} else {
		return start(c);
	}
}

function foundIdD(c) {
	if (c === '.') {
		return foundClassSymbol;
	} else {
		return start(c);
	}
}

function foundClassSymbol(c) {
	if (c === 'c') {
		parsingEl.elClass += c;
		return foundClassC;
	} else {
		return start(c);
	}
}

function foundClassC(c) {
	if (c === 'l') {
		parsingEl.elClass += c;
		return foundClassL;
	} else {
		return start(c);
	}
}

function foundClassL(c) {
	if (c === 'a') {
		parsingEl.elClass += c;
		return foundClassA;
	} else {
		return start(c);
	}
}

function foundClassA(c) {
	if (c === 's') {
		parsingEl.elClass += c;
		return foundClassS1;
	} else {
		return start(c);
	}
}

function foundClassS1(c) {
	if (c === 's') {
		parsingEl.elClass += c;
		return foundClassS2;
	} else {
		return start(c);
	}
}

function foundClassS2(c) {
	return end;
}

/**
 * Check whether the element matched the CSS selector
 * @param {string} selector CSS selector
 * @param {html element} element element to be checked
 */
function match(selector, element) {

	parseSelector(selector);

	const elementAttrs = {
		tagName: element.tagName,
		id: element.id,
		class: element.className,
	}

	let matchedElement = null;

	// First matched condition
	let currentCondition = selectorParsed;

	// Find the first matched condition from CSS selector
	while (!matchedElement && currentCondition) {
		if (
			currentCondition.elId && currentCondition.elId === elementAttrs.id
			&& currentCondition.elClass && currentCondition.elClass === elementAttrs.class
		) {
			matchedElement = element;
		} else {
			currentCondition = currentCondition.elChildren[0];
		}
	}

	if (!currentCondition.elAncestorTagName) {
		return true;
	}

	let currentElement = matchedElement.parentElement;

	// Check the element tag ancestor condition
	while (currentElement.tagName !== 'BODY') {
		console.log('currentElement.tagName: ', currentElement.tagName);
		if (currentElement.tagName === currentCondition.elAncestorTagName.toUpperCase()) return true;
		currentElement = currentElement.parentElement;
	}

	return false;
}

console.log(match("div #id.class", document.getElementById("id")));
