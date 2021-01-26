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

