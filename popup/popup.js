// popup.js
var index = 0
var tweetIndex = 0
var username
var tweetUrl
var userNameList
var activetab
var action
document.getElementById('followButton').addEventListener('click', function() {
  console.log("hi ")
  const timeout = document.getElementById("timeout");  
  console.log(timeout.value*1000)
  const input = document.getElementById('twitterUsername').value;
  const usernames = input.replace(/\s/g, '');
  if(followRadio.checked){
    console.log("following")

    action = "Follow"
    userNameList = usernames.split(',');
    userNameList = extractUsernamesFromList(userNameList)
    username = userNameList[index];
    const twitterURL = `https://twitter.com/${username}`;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      activeTab = tabs[0];
      chrome.tabs.update(activeTab.id, { url: twitterURL });
    })
  } else if (retweetRadio.checked){
    console.log("retweeting")
    action = "retweet"
    userNameList = usernames.split(',');
    username = userNameList[index];
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      activeTab = tabs[0];
      chrome.tabs.update(activeTab.id, { url: username });
    })
  }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.contentScriptLoaded && username) {
        console.log("Content script has loaded.");
        sendResponse({action:action,username:username,tweetlink:tweetUrl,like:(action === "tweet"),timeout:(timeout.value*1000)})
    }
});
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.followed) {
      index = index + 1;
      if(index < userNameList.length)
      {
              username = userNameList[index];
      twitterURL = `https://twitter.com/${username}`;
      chrome.tabs.update(activeTab.id, { url: twitterURL });
      }
    }
    else if(request.retweeted){
      tweetIndex = tweetIndex + 1;
      if(tweetIndex < userNameList.length)
      {
        username = userNameList[tweetIndex];
      // twitterURL = `https://twitter.com/${username}`;
      chrome.tabs.update(activeTab.id, { url: username });
      }
    }
});

const followRadio = document.getElementById("followRadio");
const retweetRadio = document.getElementById("retweetRadio");
const twitterUsername = document.getElementById("twitterUsername");
const followButton = document.getElementById("followButton");
const actionIcon = document.getElementById("actionIcon");

followRadio.addEventListener("change", function () {
  if (followRadio.checked) {
    twitterUsername.placeholder = "Twitter Username";
    followButton.textContent = "Follow";
    actionIcon.innerHTML = '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />'
  }
});

retweetRadio.addEventListener("change", function () {
  if (retweetRadio.checked) {
    twitterUsername.placeholder = "Tweet Link";
    followButton.textContent = "Retweet";
    actionIcon.innerHTML = '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />'
  }
});

function extractUsernamesFromList(userList) {
  const updatedList = userList.map((input) => {
      // Remove 'https', 'www', 'twitter', 'x', and 'com' parts
      let cleanedInput = input.replace(/\/status\/.*/, '');
      let username = cleanedInput.replace(/https:\/\//, '').replace(/www\./, '').replace(/twitter\.com|x\.com|www\.x\.com|mobile\.x\.com/, '').replace(/com/, '');
      // Remove all dots and slashes
      username = username.replace(/[./]/g, '');
      return username;
  });

  return updatedList;
}