// ==UserScript==
// @name           Search Bar Engine Icon
// @author          xiaoxiaoflood
// ==/UserScript==


var tries = 30;
var init = function() {
  // Sometimes search interface is not being created in time. Retry (up to 30 times) until it does.
  try {
	document.getElementById("searchbar").currentEngine;
  } catch(e) {
	if (--tries > 0) {
	  setTimeout(init, 1000);
	}
  }

  try {
	var searchbar = document.getElementById("searchbar");

	updateStyleSheet();

	// Override updateDisplay() from browsers internal 'searchbar.js' file to also update the icon
	var oldUpdateDisplay = searchbar.updateDisplay;
	searchbar.updateDisplay = function() {
	  oldUpdateDisplay.call(this);
	  updateStyleSheet();
	};

	// main style sheet
	function updateStyleSheet() {
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		.searchbar-search-button .searchbar-search-icon { \
		  list-style-image: url('+document.getElementById("searchbar").currentEngine.iconURI.spec+') !important; \
		} \
		\
	  '), null, null);

	  // remove old style sheet
	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) { sss.unregisterSheet(uri,sss.AGENT_SHEET); }
	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	};

  } catch(e) {}
}
setTimeout(init, 1000);
