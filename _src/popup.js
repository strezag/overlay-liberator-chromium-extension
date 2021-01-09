function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == "string", "tab.url should be a string");

    callback(url);
  });
}

function unlockPage(url) {
  console.log("processing:" + url);
  var script = "";

  // Generic removal of overflow style
  script += 'document.body.style="overflow: inherit !important;";';
  script +=
    'document.getElementsByTagName("html")[0].style="overflow:inherit !important;";';

  // Overlays
  // Business Insider
  if (url.indexOf("https://www.businessinsider.com") > -1) {
    script += 'document.querySelector(".tp-modal").remove();';
    script += 'document.querySelector(".tp-backdrop").remove();';
  }

  // NYT
  if (url.indexOf("https://www.nytimes.com") > -1) {
    script += 'document.querySelector("#gateway-content").remove();';
    script += 'document.querySelector(".css-1bd8bfl").remove();';
    script += `document.querySelector('div[class^="css"]').style="position:inherit;";`;
  }

  // WaPo
  if (url.indexOf("https://www.washingtonpost.com") > -1) {
    script += 'document.querySelector(".paywall-overlay").remove();';
  }

  // USA Today
  if (url.indexOf("https://www.usatoday.com") > -1) {
    script += `document.querySelector('div[class^="sp_message"]').remove();`;
    script += `document.querySelector('div[class^="sp_veil"]').remove();`;
  }

  chrome.tabs.executeScript({
    code: script,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getCurrentTabUrl((url) => {
    unlockPage(url);
  });
});
