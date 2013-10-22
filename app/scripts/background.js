'use strict';

function getUsage(callback) {
  var videotronUserId = localStorage["videotron_user_id"];
  if (videotronUserId) {
    $.get("https://www.videotron.com/client/residentiel/secur/CIUser.do?standardFlow=true&vl=" + videotronUserId, function() {
      $.get("https://www.videotron.com/client/residentiel/secur/CIUserSecuriseVL.do", function(data, textStatus, xmlHttpRequest) {
        var doc
          , periodElt, period
          , usageElt, usage
          , matches;

        doc = $("<doc>").html(data);
        
        periodElt = $("#titre_consommation h3", doc);
        if(periodElt.length == 1) {
          period = periodElt.text().trim();
          
          usageElt = $("dd.total_label", doc);
          if(usageElt.length == 1) {
            usage = usageElt.text().replace(/[^0-9.]/g, '');
          }
          else {
            // If the user is logged in the customer center, the page template is different.
            usageElt = $("dl.progress_bar_container .quantities", doc);
            if(usageElt.length == 1) {
              matches = usageElt.text().match(/[0-9.]+/);
              if(Array.isArray(matches) && matches.length > 0) {
                usage = matches[0];
              }
            }
          }

          if(usage) {
            callback({
              period: period,
              usage: usage
            });
            return;
          }
        }

        callback({
          error: "Error: please check your User ID."
        });

      });
    });
  }
  else {
    callback({
      error: "Error: please set your User ID in the config page."
    });
  }
}

function updateBadge() {
  chrome.browserAction.setBadgeText({text: "Updt"});
  chrome.browserAction.setTitle({title: "Updating"});
  getUsage(function(result) {
    if(result && result.error) {
      chrome.browserAction.setBadgeText({text: "Err"});
      chrome.browserAction.setTitle({title: result.error});
    }
    else {
      chrome.browserAction.setBadgeText({text: result.usage});
      chrome.browserAction.setTitle({title: result.period});
    }
  });
}

chrome.alarms.create("getUsage", {periodInMinutes: 60});
chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm.name != "getUsage") return;
  updateBadge();
});

chrome.browserAction.onClicked.addListener(function () {
  updateBadge();
});

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

updateBadge();