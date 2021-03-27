// ==UserScript==
// @name           	Search Selection Shortcut (Ctrl+Shift+F)
// @homepage       https://github.com/aminomancer
// @author         	aminomancer
// ==/UserScript==

(() => {
    function frameScript() {
        const utils = {};
        const { Services: Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
        const { XPCOMUtils: XPCOMUtils } = ChromeUtils.import(
            "resource://gre/modules/XPCOMUtils.jsm"
        );
        XPCOMUtils.defineLazyModuleGetters(utils, {
            E10SUtils: "resource://gre/modules/E10SUtils.jsm",
            SelectionUtils: "resource://gre/modules/SelectionUtils.jsm",
        });
        let attachKeyListener = (d, n) => {
            if ("document-element-inserted" == n && content && d == content.document)
                try {
                    content.addEventListener("keydown", (e) => {
                        if ("KeyF" === e.code && e.ctrlKey && e.shiftKey && !e.repeat) {
                            try {
                                let s = utils.SelectionUtils.getSelectionDetails(content);
                                if (s.text && !s.docSelectionIsCollapsed) {
                                    let msg = {
                                        csp: utils.E10SUtils.serializeCSP(
                                            e.composedTarget.ownerDocument.csp
                                        ),
                                        text: s.text,
                                        linkURL: s.linkURL,
                                        locationURL: content.location.href,
                                    };
                                    try {
                                        sendAsyncMessage("ctrl-shift-f", msg);
                                    } catch (e) {}
                                }
                            } catch (e) {}
                            e.stopPropagation(), e.stopImmediatePropagation(), e.preventDefault();
                        }
                    });
                } catch (e) {}
        };
        Services.obs.addObserver(attachKeyListener, "document-element-inserted");
        attachKeyListener(content.document, "document-element-inserted");
    }

    function init() {
        try {
            window.messageManager.loadFrameScript(
                "data:application/javascript," +
                    encodeURIComponent(`(${frameScript.toString()})()`),
                true
            );
        } catch (e) {}
        window.messageManager.addMessageListener("ctrl-shift-f", (message) => {
            if (message.target === gBrowser.selectedBrowser) {
                try {
                    let csp = E10SUtils.deserializeCSP(message.data.csp);
                    let text = message.data.text;
                    let linkURL = message.data.linkURL;
                    let principal = Services.scriptSecurityManager.getSystemPrincipal();
                    let locationURL = message.data.locationURL;
                    let options = { inBackground: false, triggeringPrincipal: principal };
                    let where =
                        locationURL === AboutNewTab.newTabURL ||
                        locationURL === HomePage.get(window)
                            ? "current"
                            : "tab";

                    if (
                        text.startsWith("chrome://") ||
                        text.startsWith("file://") ||
                        text.startsWith("about:")
                    )
                        return openLinkIn(text, where, options);
                    if (linkURL) {
                        let fixup, fixable;
                        try {
                            fixup = Services.uriFixup.getFixupURIInfo(
                                text,
                                Services.uriFixup.FIXUP_FLAG_ALLOW_KEYWORD_LOOKUP
                            );
                            fixable = true;
                        } catch (e) {
                            fixable = false;
                        }
                        if (fixable && !fixup._keywordProviderName) {
                            linkURL =
                                fixup._fixedURI.scheme === "http"
                                    ? fixup._fixedURI.host
                                    : fixup._fixedURI.spec;
                            if (linkURL) return openLinkIn(linkURL, where, options);
                        }
                    }

                    window.BrowserSearch._loadSearch(
                        text,
                        where,
                        false,
                        "contextmenu",
                        principal,
                        csp,
                        false
                    );
                } catch (e) {}
            }
        });
    }

    if (gBrowserInit.delayedStartupFinished) {
        setTimeout(init, 1000);
    } else {
        let delayedStartupFinished = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(delayedStartupFinished, topic);
                setTimeout(init, 1000);
            }
        };
        Services.obs.addObserver(delayedStartupFinished, "browser-delayed-startup-finished");
    }
})();
