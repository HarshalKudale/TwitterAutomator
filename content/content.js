chrome.runtime.sendMessage({ contentScriptLoaded: true },function(response){
  // window.open(respose.vid_src)
  console.log("recieved " + response);
  if(response.action === "Follow"){
    const followAriaLabel = `Follow @${response.username}`;
    const followingAriaLabel = `Following @${response.username}`;
    //   const followButton = findFollowbutton(ariaLabel)
    // console.log(followButton)
    // followButton.click()
    waitForElm(`[aria-label="${followAriaLabel}" i][role="button"]`,true).then((button)=>{
      console.log(response.timeout)
      button.click()
      setTimeout(()=>{chrome.runtime.sendMessage({ followed: true })},response.timeout)
    })
    waitForElm(`[aria-label="${followingAriaLabel}" i][role="button"]`,true).then((element)=>{
      //alreay following
      console.log()
      setTimeout(()=>{chrome.runtime.sendMessage({ followed: true })},response.timeout)
    })
  }
  else if(response.action == "retweet"){
    waitForElm(`/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/section/div/div/div[1]/div/div/article/div/div/div[3]/div[5]/div/div/div[2]/div`,false).then((div)=>{
      //alreay following
      div.click();
      waitForElm(`/html/body/div[1]/div/div/div[1]/div[2]/div/div/div/div[2]/div/div[3]/div/div/div/div`,false).then((button)=>{
        console.log(button)
        const spanElement = button.querySelector("div:nth-child(2) div span");
        if(spanElement.textContent === "Repost"){
          console.log("tweeting")
          setTimeout(()=>{button.click()},response.timeout)
          setTimeout(()=>{chrome.runtime.sendMessage({ retweeted: true });},response.timeout)
        } else if (spanElement.textContent === "Undo repost") {
          console.log("aleady tweeted")
          //already retweeted
          var randomLocation = document.elementFromPoint(2, 2);
          randomLocation.click();
          setTimeout(()=>{chrome.runtime.sendMessage({ retweeted: true });},response.timeout)
        }
      })
    })
  }
});

function docSelector(selector,query){
return query?document.querySelector(selector):document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

function waitForElm(selector,query) {
  return new Promise(resolve => {
      if (docSelector(selector,query)) {
          return resolve(docSelector(selector,query));
      }

      const observer = new MutationObserver(mutations => {
          if (docSelector(selector,query)) {
              observer.disconnect();
              resolve(docSelector(selector,query));
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}

