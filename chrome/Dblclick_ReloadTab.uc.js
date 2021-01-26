// ==UserScript==
// @name            Double Click Tab to Reload
// @author          xiaoxiaoflood
// ==/UserScript==
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    adds functions according to the double click position of the tab
// @include        main
// @by         Alice0775
// @version        2019/11/14 00:00 Fix 72+ Bug 1591145 Remove Document.GetAnonymousElementByAttribute

let tabDblclick = function(){
  function dclick(aEvent) {
   var  reloadFlags;
    if (aEvent.button != 0 || aEvent.detail != 2 ) return;
    if (aEvent.originalTarget.className == 'tab-close-button' ||
        aEvent.originalTarget.className == 'toolbarbutton-icon')
      return ;
    var tab = document.evaluate(
                'ancestor-or-self::*[local-name()="tab"]',
                aEvent.originalTarget,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
    if (!tab)
      return;

    aEvent.stopPropagation();
    //aEvent.preventDefault();

    var icon =  tab.iconImage;
console.log(icon.getClientRects())
    let rect = icon.getBoundingClientRect();
    var iconX = tab.screenX + rect.left;
    var iconW = rect.width;

    var x = aEvent.screenX;
    var y = aEvent.screenY;
    var tabx = tab.screenX;
    var taby = tab.screenY;
    var tabw = tab.clientWidth;
    var tabh = tab.clientHeight;

    if (x < tabx) {
      return;
    } else if (x < iconW + tabx && y < taby + 8) {
      if (typeof gBrowser.lockTab != 'undefined') {
        //Lock tab
        gBrowser.lockTab(tab);
      }else {
        return;
      }
    } else if (x < tabx + iconW && taby + 8 < y && y < taby + 16) {
      if (typeof gBrowser.protectTab != 'undefined') {
        //?????
        gBrowser.protectTab(tab);
      } else {
        return;
      }
    } else if (x < tabw * 0.3) {
      // favicon right end ~ 0.3 times the tab width 
	  // reload the tab
      if (aEvent.altKey) {
        // Bypass proxy and cache.
        tab.linkedBrowser.reloadWithFlags(nsIWebNavigation.LOAD_FLAGS_BYPASS_PROXY | nsIWebNavigation.LOAD_FLAGS_BYPASS_CACHE);
      } else {
          if (tab.hasAttribute("suspendtab-suspended") || tab.linkedBrowser.currentURI.spec == "about:blank")
            reload(tab)
          else
            gBrowser.reloadTab(tab);
      }
    } else if (x <= tabx + tabw - 8) {
      //0.3 times the tab width to 8px from the right end
       // reload tab
      if (aEvent.altKey) {
        // Bypass proxy and cache.
        tab.linkedBrowser.reloadWithFlags(nsIWebNavigation.LOAD_FLAGS_BYPASS_PROXY | nsIWebNavigation.LOAD_FLAGS_BYPASS_CACHE);
      } else {
        if (/^moz-neterror/.test(tab.linkedBrowser.currentURI.spec)) {
          tab.linkedBrowser.reloadWithFlags(nsIWebNavigation.LOAD_FLAGS_BYPASS_PROXY | nsIWebNavigation.LOAD_FLAGS_BYPASS_CACHE);
        } else {
          if (tab.hasAttribute("suspendtab-suspended") || tab.linkedBrowser.currentURI.spec == "about:blank")
            reload(tab)
          else
            gBrowser.reloadTab(tab);
        }
      }
    } else if (x > tabx + tabw - 8) {
      // range of 8px from right edge
       // reload all tabs
      if (aEvent.altKey) {
        // Bypass proxy and cache.
        var l = gBrowser.mPanelContainer.childNodes.length;
        for (var i = 0; i < l; i++) {
          if (gBrowser.mPanelContainer.childNodes[i].getAttribute("hidden"))
            continue;
          try {
            gBrowser.getBrowserAtIndex(i).reloadWithFlags(nsIWebNavigation.LOAD_FLAGS_BYPASS_PROXY | nsIWebNavigation.LOAD_FLAGS_BYPASS_CACHE);
          } catch (e) {
            // ignore failure to reload so others will be reloaded
          }
        }
      } else {
        gBrowser.reloadAllTabs();
      }
    }
  }
  gBrowser.tabContainer.addEventListener("dblclick", dclick, true);

  // xxx Tree Style Tab
  window.tabDblclickTimeWait = 800;
  window.tabDblclickmousedownTime = 0;
  window.addEventListener("mousedown", mousedown, true);
  function mousedown(aEvent) {
    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                       .getService(Components.interfaces.nsIWindowMediator);
    var mainWindow = wm.getMostRecentWindow("navigator:browser");
    mainWindow.tabDblclickmousedownTime = new Date().getTime();
  }

  window.tabDblclickisIcon = function isIcon(aEvent) {
    var tab = aEvent.originalTarget.ownerDocument.evaluate(
                'ancestor-or-self::*[local-name()="tab"]',
                aEvent.originalTarget,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
    if (!tab)
      return false;

    var icon = aEvent.originalTarget.querySelector(".tab-icon-image");
    var iconX = icon.boxObject.screenX;
    var iconW = icon.boxObject.width;
    var x = aEvent.screenX;
    return ( iconX < x && x < iconX + iconW);
  }
  if ("TreeStyleTabBrowser" in window) {
    var func = TreeStyleTabBrowser.prototype.onClick.toString();
    if(!/mainWindow\.tabDblclickisIcon/.test(func)) {

      func = func.replace(
        /{/,
        '{ \
          var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"] \
                         .getService(Components.interfaces.nsIWindowMediator); \
          var mainWindow = wm.getMostRecentWindow("navigator:browser"); \
          if(!mainWindow.tabDblclickisIcon(aEvent) || new Date().getTime() - mainWindow.tabDblclickmousedownTime > mainWindow.tabDblclickTimeWait){ \
          } else { \
            return; \
          }'
      );
      eval("TreeStyleTabBrowser.prototype.onClick = " + func);
    }
  }
  function reload(tab) {
    function iReload(tab) {
      if (c > 0) {
        if (tab.linkedBrowser.currentURI.spec == "about:blank")
          setTimeout(iReload, 500, tab);
        else
          gBrowser.reloadTab(tab);
      }
      c--;
    }
    var c = 10;
    iReload(tab);
  }
};


// We should only start the redirection if the browser window has finished
// starting up. Otherwise, we should wait until the startup is done.
if (gBrowserInit.delayedStartupFinished) {
  tabDblclick();
} else {
  let delayedStartupFinished = (subject, topic) => {
    if (topic == "browser-delayed-startup-finished" &&
        subject == window) {
      Services.obs.removeObserver(delayedStartupFinished, topic);
      tabDblclick();
    }
  };
  Services.obs.addObserver(delayedStartupFinished,
                           "browser-delayed-startup-finished");
}