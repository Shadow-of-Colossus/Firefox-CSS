// ==UserScript==
// @name            Restart Firefox Button
// @author          xiaoxiaoflood
// ==/UserScript==
// Restart button script for Firefox 60+ by Aris
//
// left-click on restart button: normal restart
// right-click on restart button: restart + clear caches
// middle-click on restart button: no special function
//
// based on 'Quit' button code by 2002Andreas
// restart code from Classic Theme Restorer add-on
// invalidate caches from Session Saver add-on

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  var button_label = "Restart";
	
	try {
	  switch (document.getElementById("nav-bar").getAttribute("aria-label")) {
		case "Navigations-Symbolleiste": button_label = "Neustarten"; break;
		case "?????? ?????????": button_label = "?????????????"; break;
	  }
	} catch(e) {}
  
  CustomizableUI.createWidget({
	id: "uc-restart", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
	  
	  var cancelQuit   = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
	  var observerSvc  = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			
	  if(event.button=='2') { // right-click - clear caches
		Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
	  }
	  
	  if(event.button=='0' || event.button=='2') { // left/right-click - restart
		observerSvc.notifyObservers(cancelQuit, "quit-application-requested", "restart");
			
		if(cancelQuit.data) return false;
				
		Services.startup.quit(Services.startup.eRestart | Services.startup.eAttemptQuit);
	  }
	},
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #uc-restart .toolbarbutton-icon {\
		list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAB3RJTUUH5AINEBUzXehc+wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAARnQU1BAACxjwv8YQUAAANwSURBVHjaTVNvTBNnHH7uereO0k750xJ6oMy4MiCxxIRoakQgG6JpEBP9QAw654fpBz/MmBg/uA9+8E+yxERjFr/QLBiJWWJIcCHTIsQoU5kwLalCN1ppYVJKqS21wPXu9nvvwrJL3uTu977v83ue5/ccNE3D/9dqOm2b8Pm+ed7SMhjYsCH1j8WSHS8vnxttaxt4cP366UQ0WsHOzQwNNXXX149z7GP9SU5NuV6fOvVTkyS1oLERsNkAngcsFtpMAi9fYnRwcCLW1dVTd+PG6Q+xWMV/AHI2W/hk376B5tbW3XA4gMlJYGUFEASgqAh6rbISUFXg7l3gxAlkvN4VYb37n7dufddcWrobO3YAjx8b3WtqAJMJWFwE0mlgehooKQFOntRBZU3jdIB8Llcgd3d/C68X8dZWzLIarc9MJqX6wAETDh0ymMTjQDYLhEKAywWOzugAZEiz+uZNzUA4/HHV6Uwtr619ono8I9Vnz/44srBgT128+MP+o0fd2LYNiEQAjq6KIhSeV3WAuZERT6ikZLF+797fNCqmtm79y0VGVVRVReYjkaols3lVv+x0GtKYLHo35/MCJ+dyn4aHh5vSwWBtsd2+sMxxmrWhYdQuSbMgJg8OH/7F9OhRy6aCghyzWyDdvCDkGf1xqnH3JClWm8nYVNrQFMXEtNPo1Bj5kiQZjT09XYIoysvJZPFHamKlvXQ87ogXFS3V7tr1VPAmEqXi9LQZ8/OAogBWK2mag3LmzCvp6tVzmzZvficTk+TDh19bQ6EvTKrKz/T2diY7OvraOjt7BZmcFqNRw1mWCTbrQADvSJ9EBkbD4c+D1659nyWZNjqrUXgqqGmh2/2KkeWyFFWL32/RZ8wY5PNGcGRZD8xUf7/8QZZFgbxxksyyCxfgv3Pn7y/9/q/KKyujgspgNm4EtmzRqSORMEZFY8LBg3C1t4uYnWWAHDwewOdDiowtdjjiPPnBmwkZ798DN28amWdAbFSZDBAM6nL08EgSMDaG+5OTY+7jx30iGcvRXS7AcSpfVjb/4tixn+v6+joa2tursX27IWNtzZCytAQ8e4ZfA4Hn9suXz7tpOmaWDfZ019VN+G/fPiLLsjATDlf1Xbp0fnjPnuEXdnt8xmxe+aOwcHlo587f+69cORd6+7Y6R7lRFIVf//3/BVk8nNoUNxfIAAAAAElFTkSuQmCC); /* icon / path to icon */ \
		transform: scaleX(1); /* icon mirroring */\
		fill: red; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();





// ==UserScript==
// @name            Restart Entry in File Menu
// @author          xiaoxiaoflood
// ==/UserScript==
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @charset        UTF-8
// @include        main
// @compatibility  Firefox 69
// by			           Alice0775


var ToolRstart = {
  //SAVE_SESSION_RESTART_VERSION: "0.0.2",
  init: function() {
    if (document.getElementById("Restart_Firefox")) return;
    var optionsitem, menuitem, menupopup;
    var UI = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
      createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
    UI.charset = "UTF-8";

    var gPref = Components.classes["@mozilla.org/preferences-service;1"].
      getService(Components.interfaces.nsIPrefBranch);
try{
    if (!gPref.getBoolPref("browser.sessionstore.enabled")&&gPref.getBoolPref("extensions.tabmix.sessions.manager")){
      var button = document.getElementById("btn_sessionmanager");
      var label = "????????????";

      menuitem = document.createXULElement("menuitem");
      menuitem.setAttribute("id", "Restart_Firefox1");
      menuitem.setAttribute("label", label);
      menuitem.setAttribute("oncommand", "ToolRstart.SaveRestart(event);");
      optionsitem = document.getElementById("menu_FileQuitItem");
      optionsitem.parentNode.insertBefore(menuitem, optionsitem);
    }
}catch(e){}
    label = "Restart Firefox";
    //try {label =UI.ConvertToUnicode(label)} catch(e){}
    menuitem = document.createXULElement("menuitem");
    menuitem.setAttribute("label", label);
    menuitem.setAttribute("accesskey", "R");
    menuitem.setAttribute("oncommand", "ToolRstart.restartApp(true);");
    optionsitem = document.getElementById("menu_FileQuitItem");
    optionsitem.parentNode.insertBefore(menuitem, optionsitem);
    menuitem.setAttribute("id", "Restart_Firefox");
    optionsitem = document.getElementById("appmenu_quit") || document.getElementById("appmenu-quit");
    if (optionsitem) {
      menuitem = optionsitem.parentNode.insertBefore(menuitem.cloneNode(true), optionsitem);
      menuitem.setAttribute("id", "Restart_Firefox2");
    }
    dump("Initialized addRestartButtons");
  },

  SaveRestart: function(event) {
    event.stopPropagation();
    SessionManager.sessionUtil('save', 'allwindows');
    ToolRstart.restartApp(true);
  },

  //sessionsaver_.2-0.2.1.031-fx+mz.xpi??
  restartApp: function(clearCache) {
    if (typeof clearCache == 'undefined')
      clearCache = false;

    if ("BrowserUtils" in window && typeof BrowserUtils.restartApplication == "function") {
      if (clearCache) {
        let XRE = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime);
        XRE.invalidateCachesOnRestart();
      }
      BrowserUtils.restartApplication();
      return;
    }

    const appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"]
                      .getService(Components.interfaces.nsIAppStartup);

    // Notify all windows that an application quit has been requested.
    var os = Components.classes["@mozilla.org/observer-service;1"]
                       .getService(Components.interfaces.nsIObserverService);
    var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"]
                               .createInstance(Components.interfaces.nsISupportsPRBool);
    os.notifyObservers(cancelQuit, "quit-application-requested", null);

    // Something aborted the quit process.
    if (cancelQuit.data)
      return;

    // Notify all windows that an application quit has been granted.
    os.notifyObservers(null, "quit-application-granted", null);

    // Enumerate all windows and call shutdown handlers
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                       .getService(Components.interfaces.nsIWindowMediator);
    var windows = wm.getEnumerator(null);
    var win;
    while (windows.hasMoreElements()) {
      win = windows.getNext();
      if (("tryToClose" in win) && !win.tryToClose())
        return;
    }

    if (clearCache) {
      let XRE = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime);
      XRE.invalidateCachesOnRestart();
    }
    appStartup.quit(appStartup.eRestart | appStartup.eAttemptQuit);
  }

}

ToolRstart.init();

