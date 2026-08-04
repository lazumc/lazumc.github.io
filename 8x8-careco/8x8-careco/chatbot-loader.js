/**
 * Chatbot Loader
 * Reads the widget snippet from localStorage (set via config.html).
 * Falls back to the default snippet if nothing is stored.
 */
(function () {
    var STORAGE_KEY = 'chatbot_snippet';

    var DEFAULT_DIV_ID = '__8x8-chat-button-container-script_509933349691224ed0535a3.19243387';

    var DEFAULT_SCRIPT = `(function(c, f, ef){
    var typeofC = Object.prototype.toString.call(c);
    var props = (typeofC === '[object Object]' && c) || {};
    var cb = f || (typeofC === '[object Function]' && c);
    var config = {
        scriptUuid: "script_509933349691224ed0535a3.19243387",
        tenant: "Y2FyZWNvMDE",
        channelName: "BOT_CHANNEL",
        channelUuid: "BNlxPsdKR66S31AJph-QTA",
        domain: "https://vcc-eu7.8x8.com",
        buttonContainerId: "__8x8-chat-button-container-script_509933349691224ed0535a3.19243387",
        align: "right",
    };
    var url = new URL("https://cloud8-cc-geo.8x8.com/vcc-chat-channels/public/webchat/discovery");
    var params = { domain: config.domain, tenant: config.tenant, channelUuid: config.channelUuid };
    url.search = new URLSearchParams(params).toString();
    fetch(url)
        .then(response => response.json())
        .then(data => config.domain = !data.domain ? config.domain : data.domain)
        .catch(error => console.warn('Failed to retrieve override domain, will continue using ', config.domain, error))
        .finally(() => loadChat());
    function loadChat() {
        var se = document.createElement("script");
        se.type = "text/javascript";
        se.async = true;
        se.src = props.loaderURL || (config.domain + "/CHAT/common/js/chatv3.js");
        Object.keys(config).forEach(function (k) { se.dataset[k] = config[k]; });
        Object.keys(props).forEach(function (k) { se.dataset[k] = props[k]; });
        function handleInitEvent(e) {
            var initFn = e.detail.init;
            initFn(config, cb);
            se.removeEventListener('init', handleInitEvent);
        }
        function handleErrorEvent(e) {
            ef && ef(e);
            se.removeEventListener('customerror', handleErrorEvent);
        }
        se.addEventListener('init', handleInitEvent);
        se.addEventListener('customerror', handleErrorEvent);
        var os = document.getElementsByTagName("script")[0];
        os.parentNode.insertBefore(se, os);
    }
})();`;

    function injectWidget(divId, scriptContent) {
        var btn = document.createElement('div');
        btn.id = divId;
        document.body.appendChild(btn);

        var sc = document.createElement('script');
        sc.type = 'text/javascript';
        sc.textContent = scriptContent;
        document.body.appendChild(sc);
    }

    // Try loading from localStorage (set via config.html)
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}

    if (stored) {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(stored, 'text/html');
            var divEl    = doc.querySelector('div[id^="__8x8"]');
            var scriptEl = doc.querySelector('script');

            if (divEl && scriptEl) {
                injectWidget(divEl.id, scriptEl.textContent);
                return;
            }
        } catch (e) {
            console.warn('[chatbot-loader] Failed to parse stored snippet, falling back to default.', e);
        }
    }

    // Fallback: default snippet
    injectWidget(DEFAULT_DIV_ID, DEFAULT_SCRIPT);
})();
