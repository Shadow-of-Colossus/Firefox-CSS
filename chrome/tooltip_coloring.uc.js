// ==UserScript==
// @name            Tooltip Coloring
// @author          xiaoxiaoflood
// ==/UserScript==

(function () {
    var css = `
	tooltip {
			-moz-appearance: none!important;
			background-color: #444 !important;
			color: #dddddd !important;
			border: 1px solid silver !important;
			padding: 1px !important;
		}
    `;

    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));

    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

})();