/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 *
 */

'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;



  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    body.entry.forEach(function (entry) {

      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;

      if (webhook_event.message) {
        if (webhook_event.message.quick_reply) {
          handleQuickReply(sender_psid, webhook_event.message.quick_reply.payload);
        } else {
          handleMessage(sender_psid, webhook_event.message);
        }
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


app.get('/setgsbutton', function (req, res) {
  setupGetStartedButton(res);
});

app.get('/setpersistentmenu', function (req, res) {
  setupPersistentMenu(res);
});

app.get('/clear', function (req, res) {
  removePersistentMenu(res);
});

//whitelist domains
//eg https://newhope-grocery-store.herokuapp.com/whitelists
app.get('/whitelists', function (req, res) {
  whitelistDomains(res);
});


// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {

  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];



  // Check if a token and mode were sent
  if (mode && token) {


    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

function handleMessage(sender_psid, received_message) {
  let response;
  // Checks if the message contains text
  if (received_message.text === 'Hi') {
    greetUser(sender_psid);
  } else if (received_message.text === 'Lunch') {
    lunch(sender_psid);
  } else if (received_message.text === 'Chicken') {
    chicken(sender_psid);
  } else if (received_message.text === 'Shop Now') {
    shopNow(sender_psid);
  }
  // Send the response message
  callSend(sender_psid, response);
}

/**********************************************
Function to Handle when user send quick reply message
***********************************************/

function handleQuickReply(sender_psid, received_message) {

  switch (received_message) {
    case "chicken":
      chicken(sender_psid);
      break;
    case "pork":
      pork(sender_psid);
      break;
    case "sea-food":
      seafood(sender_psid);
      break;
    case "cs-ingre-for-three":
      csIngreForThree(sender_psid);
      break;
    case "pork-one-ingre-for-three":
      porkOneIngreForThree(sender_psid);
      break;
    case "off":
      showQuickReplyOff(sender_psid);
      break;
    default:
      defaultReply(sender_psid);
  }

}

/*********************************************
Function to handle when user click button
**********************************************/
const handlePostback = (sender_psid, received_postback) => {
  let payload = received_postback.payload;

  switch (payload) {
    case "get_started":
      greetUser(sender_psid);
      break;
    case "search-meals":
      searchMeals(sender_psid);
      break;
    case "search-by-category":
      searchByCategory(sender_psid);
      break;
    case "chicken":
      chicken(sender_psid);
      break;
    case "pork":
      pork(sender_psid);
      break;
    case "sea-food":
      seafood(sender_psid);
      break;
    case "ch-one-ingre":
      chOneIngre(sender_psid);
      break;
    case "ch-one-check":
      chOneCheck(sender_psid);
      break;
    case "ch-one-how-to":
      chOneHowTo(sender_psid);
      break;
    case "pork-one-ingre":
      porkOneIngre(sender_psid);
      break;
    case "pork-one-check":
      porkOneCheck(sender_psid);
      break;
    case "pork-one-for-three":
      porkOneForThree(sender_psid);
      break;
    case "pork-one-how-to":
      porkOneHowTo(sender_psid);
      break;
    case "sf-one-ingre":
      sfOneIngre(sender_psid);
      break;
    case "sf-two-ingre":
      sfTwoIngre(sender_psid);
      break;
    case "sf-one-check":
      sfOneCheck(sender_psid);
      break;
    case "sf-two-check":
      sfTwoCheck(sender_psid);
      break;
    case "sf-one-for-three":
      sfOneForThree(sender_psid);
      break;
    case "sf-two-for-three":
      sfTwoForThree(sender_psid);
      break;
    case "sf-one-how-to":
      sfOneHowTo(sender_psid);
      break;
    case "sf-two-how-to":
      sfTwoHowTo(sender_psid);
      break;
    default:
      defaultReply(sender_psid);
  }
}

const callSendAPI = (sender_psid, response) => {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  return new Promise(resolve => {
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": {
        "access_token": PAGE_ACCESS_TOKEN
      },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        resolve('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    });
  });
}

async function callSend(sender_psid, response) {
  let send = await callSendAPI(sender_psid, response);
  return 1;
}

const getUserProfile = (sender_psid) => {
  return new Promise(resolve => {
    request({
      "uri": "https://graph.facebook.com/" + sender_psid + "?fields=first_name,last_name,profile_pic&access_token=EAAC0Amc4MRgBAGR5JMXzFDQBBZCbHRjOkVPeKg3UokgQzZAYlIAZBQoPnwsKo6FZBmSOd5kPm16TUJEFdveL9iZA4IAG2EN1IozqH17jKueHNU2rPObJYjxkL6Kq3WttHxYhaj83SGYNK9ZBEtYXkJTOiXVV9key1xS8WZCpWXoQy3bluiMysR5IYlm1Q9QfVQZD",
      "method": "GET"
    }, (err, res, body) => {
      if (!err) {
        let data = JSON.parse(body);
        resolve(data);
      } else {
        console.error("Error:" + err);
      }
    });
  });
}

/*FUNCTION TO GREET USER*/

async function greetUser(sender_psid) {
  let user = await getUserProfile(sender_psid);
  let response1 = {
    "text": "မင်္ဂလာပါ " + user.first_name + " " + user.last_name + ". New Hope Grocery မှ ကြိုဆိုပါတယ်ခင်ဗျ 🙂"
  };
  let response2 = {
    "text": "မင်္ဂလာပါခင်ဗျ၊"
  }
  let response3 = {
    "text": "Hello"
  };
  let response4 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Admin နဲ့ Chat မယ်",
            "payload": "chat-with-admin"
          },
          {
            "type": "postback",
            "title": "Search Meals",
            "payload": "search-meals"
          },
          {
            "type": "postback",
            "title": "Buy Now",
            "payload": "buy-now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2).then(() => {
      return callSend(sender_psid, response3).then(() => {
        return callSend(sender_psid, response4);
      });
    });
  });
}

/* FUNCTION TO MEAL DELIVERY */

const searchMeals = (sender_psid) => {
  let response1 = {
    "text": "Thanks for your interest in GlonePlone's Meal Delivery service!"
  };
  let response2 = {
    "text": "We deliver to Naypyitaw Pyinmana, Lwe"
  };
  let response3 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Today Meals",
            "payload": "today-meals"
          },
          {
            "type": "postback",
            "title": "Popular Meals",
            "payload": "pop-meals"
          },
          {
            "type": "postback",
            "title": "Search by category",
            "payload": "search-by-category"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2).then(() => {
      return callSend(sender_psid, response3);
    });
  });
}

/* Function to ReadyToCook */

const searchByCategory = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "Chicken",
        "payload": "chicken"
      },
      {
        "content_type": "text",
        "title": "Pork",
        "payload": "pork"
      },
      {
        "content_type": "text",
        "title": "Beef",
        "payload": "pl-beef"
      },
      {
        "content_type": "text",
        "title": "Fish",
        "payload": "pl-fish"
      },
      {
        "content_type": "text",
        "title": "Sea Food",
        "payload": "sea-food"
      }
    ]
  };
  callSend(sender_psid, response);
}

/* Function to Chicken */

const chicken = (sender_psid) => {
  let response;
  response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
            "title": "ကြက်သားချဥ်စော်ခါးသီးသောက်ဆမ်း",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/new-hope-a1a0b.appspot.com/o/chicken%2Fchicken%20soup_1587378249871?alt=media&token=af1d6f12-536e-4d0d-9a1b-8b2074d975f3",
            "subtitle": "ဒီတစ်ခါ နွေရာသီပူပူမှာခံတွင်းလိုက်စေမယ့်ဟင်းလေးတစ်မယ်ဖော်ပြပေးလိုက်ပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "ch-one-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "ch-one-how-to"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "Welcome!",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "We have the right hat for everyone.",
            "buttons": [{
                "type": "postback",
                "title": "How to cook?",
                "payload": "how-to-cook"
              },
              {
                "type": "postback",
                "title": "View ingredients",
                "payload": "view-ingre"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "Welcome!",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "We have the right hat for everyone.",
            "buttons": [{
                "type": "postback",
                "title": "How to cook?",
                "payload": "how-to-cook"
              },
              {
                "type": "postback",
                "title": "View ingredients",
                "payload": "view-ingre"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          }
        ]
      }
    }
  }
  callSend(sender_psid, response);
}

const chOneIngre = (sender_psid) => {
  let response1 = {
    "text": "ဗမာကြက် = ၅ဝ ကျပ်သား \n\n ချဉ်စော်ခါးသီ = ၁ ခြမ်း \n\n ချင်းကြီးကြီး = ၁တက် \n\n ကြက်သွန်ဖြူ = ၅မွှာ \n\n ငရုတ်သီးစိမ်း = ၃တောင့် \n\n ကြွက်နားရွယ်မှို = အနည်းငယ် \n\n ရှမ်းနံနံ+ကြက်သွန်မြိတ် = အနည်းငယ်စီ"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "ch-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "ch-one-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

const chOneCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "cs-ingre-for-three"
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": "pl-arr-luu"
      },
      {
        "content_type": "text",
        "title": "5",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "6",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "7",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "8",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "9",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "10",
        "payload": "pl-pae"
      }
    ]
  }
  callSend(sender_psid, response);
}

const csIngreForThree = (sender_psid) => {
  let response1 = {
    "text": "ဗမာကြက် = ၁၅ဝ ကျပ်သား \n\n ချဉ်စော်ခါးသီ = ၃ ခြမ်း \n\n ချင်းကြီးကြီး = ၃တက် \n\n ကြက်သွန်ဖြူ = ၁၅မွှာ \n\n ငရုတ်သီးစိမ်း = ၉တောင့် \n\n ကြွက်နားရွယ်မှို = အနည်းငယ် \n\n ရှမ်းနံနံ+ကြက်သွန်မြိတ် = အနည်းငယ်စီ"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "ch-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "ch-one-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

const chOneHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ကြက်သားကိုရေဆေးသန့်စင်ပြီး ဆား၊ ABC ပဲငံပြာရည်အကြည်၊ အရသာမှုန့်အနည်းငယ်ဖြင့်အရသာနှပ်ထားပါ။ \n\n ၂။ ချဥ်စော်ခါးသီးကို အခွံခွာအစေ့ထုတ်ပြီးလေးစိတ်ခြမ်းကာ ဆားရည်မှာစိမ်ထားပါ။ \n\n ၃။ ကြွက်နားရွက်မှိုကိုရေစိမ်သန့်စင်ပြီး ခပ်ပါးပါးလှီးဖြတ်ပါ။ \n\n ၄။ ငရုတ်သီးစိမ်း ၊ ကြက်သွန်ဖြူ ကိုခပ်ကြမ်းကြမ်းဓားပြားရိုက်ထားပါ။ \n\n ၅။ ရှမ်းနံနံနှင့်ကြက်သွန်မြိတ်ကို လက်တဆစ်ခန့်လှီးဖြတ်ထားပါ။ \n\n ၆။ အိုးတစ်လုံးမှာအရသာနယ်ထားတဲ့ကဿ်သားတွေထည့်ပြီး ချင်းတစ်ဝက်ကိုဓားပြားရိုက်ထည့်ပါ။ရေမြှုပ်ရုံလေးထည့်ပြီး ပြုတ်ပါ။ \n\n ၇။ ထွက်လာတဲ့အမြှုပ်နှင့်အညစ်အကြေးတွေကိုစစ်ထုတ်ပါ(ဟင်းရည်ကြည်စေရန်အတွက်)တပွက်ဆူလာလျှင် ရေအနည်းငယ်ထပ်ဖြည့်ပြီး နောက်တစ်ကြိမ်ဆူလျှင်ဖိုခွင်မှခေတ္တချထားပါ။ \n\n ၈။ ဒယ်အိုးတစ်လုံးမှာ ဆီအနည်းငယ်ကိုအပူပေးပြီးလက်ကျန်ချင်းကိုပါးပါးလှီးဆီသပ်ပါ။ ဓားပြားရိုက်ထားတဲ့ကြက်သွန်ဖြူ ၊ငရုတ်သီးစိမ်းထည့်ပါ။ ချဥ်စော်ခါးသီးနဲ့ကြွက်နားရွက်မှိုတွေထည့်ဆီသပ်ပါ။ \n\n ၉။ မွှေးလာလျှင် ပြုတ်ထားတဲ့ကြက်သားအိုးထည့်သို့လောင်းထည့်ပြီး မီးရှိန်လျှော့ချကာတပွက်ဆူအနေအထားဖြင့်ချက်ပါ။ \n\n ၁၀။ လိုအပ်ပါက ABC ပဲငံပြာရည်အကြည်နှင့်အရသာမှုန့်ထပ်မံဖြည့်စွက်ပါ။"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
          "type": "web_url",
          "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
          "title": "Shop Now"
        }]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

/* FUNCTION TO PORK */
const pork = (sender_psid) => {
  let response;
  response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
            "title": "သုံးထပ်သားအချိုချက်",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/new-hope-a1a0b.appspot.com/o/chicken%2Fchicken%20soup_1587378249871?alt=media&token=af1d6f12-536e-4d0d-9a1b-8b2074d975f3",
            "subtitle": "ဒီတစ်ခါ နွေရာသီပူပူမှာခံတွင်းလိုက်စေမယ့်ဟင်းလေးတစ်မယ်ဖော်ပြပေးလိုက်ပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "pork-one-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "pork-one-how-to"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "Welcome!",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "We have the right hat for everyone.",
            "buttons": [{
                "type": "postback",
                "title": "How to cook?",
                "payload": "how-to-cook"
              },
              {
                "type": "postback",
                "title": "View ingredients",
                "payload": "view-ingre"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "Welcome!",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "We have the right hat for everyone.",
            "buttons": [{
                "type": "postback",
                "title": "How to cook?",
                "payload": "how-to-cook"
              },
              {
                "type": "postback",
                "title": "View ingredients",
                "payload": "view-ingre"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          }
        ]
      }
    }
  }
  callSend(sender_psid, response);
}

/* FUNCTION TO PORK ONE VIEW INGREDIENTS */
const porkOneIngre = (sender_psid) => {
  let response1 = {
    "text": "သုံးထပ်သား = ၃၀ကျပ်သား \n\n ချင်း = ၂တက် \n\n ကြက်သွန်နီဥကြီး = ၁လုံး \n\n ကြက်သွန်နီဥသေး = ၁၀လုံး \n\n ကြက်သွန်ဖြူ = ၅တက် \n\n နာနတ်ပွင့် = ၂ပွင့် \n\n ဟင်းချက်ဝိုင် = ၂ဇွန်း \n\n သကြား = ၁ ဇွန်း \n\n ABCပဲငံပြာရည်အကျဲ = ၂ဇွန်း \n\n ABCပဲငံပြာရည်အပျစ် = ၁ဇွန်း"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "pork-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "pork-one-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

/* FUNCTION TO PORK ONE CHECK */
const porkOneCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "pork-one-for-three"
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": "pl-arr-luu"
      },
      {
        "content_type": "text",
        "title": "5",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "6",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "7",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "8",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "9",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "10",
        "payload": "pl-pae"
      }
    ]
  }
  callSend(sender_psid, response);
}

/* FUNCTION TO PORK ONE INGRE FOR THREE */
const porkOneForThree = (sender_psid) => {
  let response1 = {
    "text": "သုံးထပ်သား = ၉၀ကျပ်သား \n\n ချင်း = ၆တက် \n\n ကြက်သွန်နီဥကြီး = ၃လုံး \n\n ကြက်သွန်နီဥသေး = ၃၀လုံး \n\n ကြက်သွန်ဖြူ = ၁၅တက် \n\n နာနတ်ပွင့် = ၆ပွင့် \n\n ဟင်းချက်ဝိုင် = ၆ဇွန်း \n\n သကြား = ၃ ဇွန်း \n\n ABCပဲငံပြာရည်အကျဲ = ၆ဇွန်း \n\n ABCပဲငံပြာရည်အပျစ် = ၃ဇွန်း \n\n"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "ch-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "ch-one-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

/* FUNCTION TO PORK ONE HOW TO COOK */
const porkOneHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ သုံးထပ်သားတွေကိုမိမိနှစ်သက်တဲ့အရွယ်တုံးပြီးရေစစ်ထားပါ။ \n\n ၂။ နာနတ်ပွင့် ကိုမီးကင်ပြီးဓားပြားရိုက်ထားပါ။ \n\n ၃။ ချင်းနှင့်ကြက်သွန်ဖြူ ကိုညှက်နေအောင်ထောင်းပြီးသုံးထပ်သားထဲညှစ်ထည့်ပြီးသကြား၊ABCပဲငံပြာရည်အပျစ်၊ ABCပဲငံပြာရည် အကျဲ၊ဟင်းခတ်မှုန့်၊ဟင်းချက်ဝိုင်တို့နှင့်နယ်ပြီး(၁၅)မိနစ်ခန့်နှပ်ထားပါ။ \n\n ၄။ အသားနယ်ထားချိန်ပြည့်ပြီဆိုပါကဒယ်အိုးတစ်လုံးမှာဆီအနည်းငယ်ကိုအပူပေးပြီးပါးပါးလှီးထားတဲ့ကြက်သွန်နီဥကြီးကိုဆီသတ်ပါ။ \n\n ၅။ အနည်းငယ်မွှေးပြီးနွမ်းလာလျှင်နယ်ပြီးနှပ်ထားတဲ့သုံးထပ်သားတွေထည့်မွှေပါ။ \n\n ၆။ အနှစ်ကျသွားပြီဆိုရင် pressure အိုးထဲပြောင်းထည့်ပြီး (၁၅)မိနစ်ခန့်နှပ်ချက်ချက်ပါ။ \n\n ၇။ အဖုံးဖွင့်ပြီးကြက်သွန်နီဥသေးလေးတွေကိုအလုံးလိုက်ထည့်ပါ။  \n\n နောက်ထပ်(၅)မိနစ်ခန့်နှပ်ပေးပြီးအိုးထဲမှဆယ်ထုတ်ပါ။"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
          "type": "web_url",
          "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
          "title": "Shop Now"
        }]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

/* FUNCTION TO SEAFOOD */
const seafood = (sender_psid) => {
  let response;
  response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
            "title": "ကင်းမွန်အချိုချက်",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/new-hope-a1a0b.appspot.com/o/chicken%2Fchicken%20soup_1587378249871?alt=media&token=af1d6f12-536e-4d0d-9a1b-8b2074d975f3",
            "subtitle": "ဒီတစ်ခါ နွေရာသီပူပူမှာခံတွင်းလိုက်စေမယ့်ဟင်းလေးတစ်မယ်ဖော်ပြပေးလိုက်ပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "sf-one-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "sf-one-how-to"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "ပဲကြာဇံနှင့်ပုစွန်ကြော်",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "ဒီဟင်းပွဲလေးက လူကြီးမင်းတို့ ဆိုင်တွေမှာ မှာစားလေးရှိတဲ့ ပုစွန်ပဲကြာဇံမြေအိုး ဆိုတဲ့ဟင်းပွဲလေးနဲ့ ခပ်ဆင်ဆင်တူပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "sf-two-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "sf-two-how-to"
              },

              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "Welcome!",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "We have the right hat for everyone.",
            "buttons": [{
                "type": "postback",
                "title": "How to cook?",
                "payload": "how-to-cook"
              },
              {
                "type": "postback",
                "title": "View ingredients",
                "payload": "view-ingre"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          }
        ]
      }
    }
  }
  callSend(sender_psid, response);
}

const sfOneIngre = (sender_psid) => {
  let response1 = {
    "text": "ကင်းမွန်ငါး = ၂၀ ကျပ်သား \n\n ကြက်သွန်နီ = ၁လုံး\n\nခရမ်းချဥ်သီး = ၂လုံး \n\n ကောက်ရိုးမှို = ၁၀ကျပ်သား \n\n ငရုတ်သီးစိမ်း = ၅တောင့် \n\n ပင်စိမ်း = ၅ခက် \n\n ချင်း ၊ ကြက်သွန်ဖြူ = အနည်းငယ်စီ"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "sf-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "sf-one-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

const sfOneCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "sf-one-for-three"
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": "pl-arr-luu"
      },
      {
        "content_type": "text",
        "title": "5",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "6",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "7",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "8",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "9",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "10",
        "payload": "pl-pae"
      }
    ]
  }
  callSend(sender_psid, response);
}

const sfOneForThree = (sender_psid) => {
  let response1 = {
    "text": "သုံးထပ်သား = ၉၀ကျပ်သား \n\n ချင်း = ၆တက် \n\n ကြက်သွန်နီဥကြီး = ၃လုံး \n\n ကြက်သွန်နီဥသေး = ၃၀လုံး \n\n ကြက်သွန်ဖြူ = ၁၅တက် \n\n နာနတ်ပွင့် = ၆ပွင့် \n\n ဟင်းချက်ဝိုင် = ၆ဇွန်း \n\n သကြား = ၃ ဇွန်း \n\n ABCပဲငံပြာရည်အကျဲ = ၆ဇွန်း \n\n ABCပဲငံပြာရည်အပျစ် = ၃ဇွန်း \n\n"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "ch-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "ch-one-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

const sfOneHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ပထမဆုံး ကင်းမွန်ကိုသန့်စင်ပြီးအကွင်းငယ်လေးတွေလှီးကရေနွေးဖျောအအေးခံထားပါ။\n\n ၂။ ကြက်သွန်နီနှင့်ခရမ်းချဥ်သီးကို ၈စိတ်ခွဲလှီးပါ။မှိုကိုတော့ ထက်ခြမ်းခွဲလှီးပါ။\n\n ၃။ ချင်းကိုအမျှင်လှီးပြီး ကြက်သွန်ဖြူကိုခပ်ပါးပါးလှီးပါ။\n\n ၄။ ငရုတ်သီးစိမ်းတောင့်ကိုခပ်စောင်းစောင်းလှီးပြီးပင်စိမ်းရွက်တွေကိုခြွေထားပါ။\n\n ၅။ ဒယ်အိုးတစ်လုံးမှာဆီအနည်းငယ်ကိုအပူပေးပြီး ၈ စိတ်ခွဲထားသော ကြက်သွန်နီနှင့်ခရမ်းချဥ်သီးကိုကြော်ယူဆီစစ်ထားပါ။\n\n ၆။ လက်ကျန်ဆီမှာ ချင်း ၊ ကြက်သွန်ဖြူကိုဆီသပ်ပြီး ကောက်ရိုးမှိုတွေထည့်ပြီးလှိမ့်ပေးပါ။ \n\n ၇။ အနည်းငယ်နွမ်းသွားလျှင်ကင်းမွန်ငါးတွေထည့်ပါ။\n\n ၈။ သကြား၊ အရသာမှုန့်၊ ခရုဆီ၊ ABC ပဲငံပြာရည်အကြည်၊ ABC ပဲငံပြာရည်အပျစ်တို့ဖြင့်အရသာဖြည့်စွက်ပါ။\n\n ၉။ ဆီစစ်ထားတဲ့ကြက်သွန်နီ၊ ခရမ်းချဥ်သီးပြန်ထည့်ပြီး ငရုတ်သီးစိမ်း၊ ပင်စိမ်းရွက်လေးအုပ်ပြီး ဖိုပေါ်မှချပါ။"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
          "type": "web_url",
          "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
          "title": "Shop Now"
        }]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

const sfTwoIngre = (sender_psid) => {
  let response1 = {
    "text": "ပဲကြာဇံ = ၁၀ကျပ်သား \n\n ပုစွန်လတ် = ၇ကောင်ခန့် \n\n ကြက်သွန်နီ = ၁လုံး \n\n ကြက်သွန်ဖြူ = ၃တက် \n\n ဘဲဥ (သို့) ကြက် ဥ \n\n ပန်းပွင့်စိမ်း((သို့)ပန်းဂေါ်ဖီဥနီ \n\n ဂေါ်ဖီ (သို့) မုန်ညှင်းဖြူ \n\n ကြက်သွန်မြိတ် \n\n ABC ပဲငံပြာရည်အကြည် \n\n ABC ပဲငံပြာရည်အပျစ် \n\n ခရုဆီ"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "sf-two-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "sf-two-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

const sfTwoCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "sf-two-for-three"
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": "pl-arr-luu"
      },
      {
        "content_type": "text",
        "title": "5",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "6",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "7",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "8",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "9",
        "payload": "pl-pae"
      },
      {
        "content_type": "text",
        "title": "10",
        "payload": "pl-pae"
      }
    ]
  }
  callSend(sender_psid, response);
}

const sfTwoForThree = (sender_psid) => {
  let response1 = {
    "text": "သုံးထပ်သား = ၉၀ကျပ်သား \n\n ချင်း = ၆တက် \n\n ကြက်သွန်နီဥကြီး = ၃လုံး \n\n ကြက်သွန်နီဥသေး = ၃၀လုံး \n\n ကြက်သွန်ဖြူ = ၁၅တက် \n\n နာနတ်ပွင့် = ၆ပွင့် \n\n ဟင်းချက်ဝိုင် = ၆ဇွန်း \n\n သကြား = ၃ ဇွန်း \n\n ABCပဲငံပြာရည်အကျဲ = ၆ဇွန်း \n\n ABCပဲငံပြာရည်အပျစ် = ၃ဇွန်း \n\n"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Check!",
            "payload": "ch-two-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "ch-two-how-to"
          },
          {
            "type": "web_url",
            "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
            "title": "Shop Now"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}

const sfTwoHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ပထမဆုံး ပဲကြာဇံ ကို (၁)နာရီခန့်ရေကြိုစိမ်ထားပါ။ \n\n ၂။ ပုစွန်တွေကို အခွံခွာသန့်စင်ပြီးအရသာနယ်ထားပါ။ \n\n ၃။ အသီးအရွက်တွေကိုမိမိစိတ်ကြိုက်လှီးဖြတ်ထားပါ။ \n\n ၄။ ဒယ်အိုးတစ်လုံးကိုအပူပေးပြီးဆီအနည်းငယ်မှာ ပုစွန်တွေကိုဦးစွာအိုးကင်းပူပေးပြီးဆီစစ်ထားပါ။ \n\n ၅။ ထိုအိုးထဲမှာပဲ ဆီအနည်းငယ်ဖြင့် ကြက်ဥကိုမွှေကြော်ပါ။ \n\n ၆။ ခပ်ကြမ်းကြမ်းလှီးထားသောကြက်သွန်နီနှင့်ဓားပြားရိုက်ထားသော ကြက်သွန်ဖြူကိုဆီသပ်ပါ။ \n\n ၇။ မွှေးလာလျှင် ကြက်သွန်မြိတ်မှလွဲပြီးတခြားအသီးအရွက်တွေထည့်ကြော်ပါ။ \n\n ၈။ ABCပဲငံပြာရည်အပျစ်၊ ABCပဲငံပြာရည်အကျဲ၊ ခရုဆီ ၊သကြား၊ အရသာမှုန့်တို့ဖြင့်အရသာဖြည့်စွက်ပါ။ \n\n ၉။ အရိုးပြုတ်ရည်(သို့)ရေနွေးလေးအနည်းငယ်ထည့်ပြီး ရေစိမ်ထားတဲ့ပဲကြာဇံတွေထည့်ပြီးအဖုံးအုပ်ထားပါ။ \n\n ၁၀။ ရေခမ်းလာလျှင် ပဲကြာဇံနှင့်အသီးအရွက်တွေသမသွားအောင်မွှေပေးပြီးပုစွန်တွေပြန်ထည့်ပါ။ \n\n ၁၁။ ကြာဇံတွေအိသွားပြီဆိုလျှင်ငရုတ်ကောင်းမှုန့်ဖြူးပြီး လက်တဆစ်ခန့်လှီးထားသောကြက်သွန်မြိတ်တွေထည့်မွှေကာဖိုပေါ်မှချပါ။ \n\n မှတ်ချက်။ ပဲကြာဇံကိုအရမ်းအိပြဲသွားအောင်မကြော်ရပါ။ ကြာဇံကိုရေပြည့်ဝစွာစိမ်ထားလျှင်ကြော်ချိန်(၅)မိနစ်ခန့်မျှသာကြာပါမည်။"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
          "type": "web_url",
          "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
          "title": "Shop Now"
        }]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}
/* FUNCTION TO LUNCH */

function lunch(sender_psid) {
  let response1 = {
    "text": "Pick the item that you want"
  };
  let response2 = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to eat?",
        "buttons": [{
            "type": "postback",
            "title": "Choose Meat",
            "payload": "pl-choose-meat"
          },
          {
            "type": "postback",
            "title": "Choose Vegetable",
            "payload": "pl-choose-vegetable"
          }
        ]
      }
    }
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2);
  });
}


/* FUNCTION TO CHOOSEN CHICKEN */

async function choosenChicken(sender_psid) {
  let response;
  response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "What do you want to do next?",
        "buttons": [{
          "type": "postback",
          "title": "Choose Vegetable",
          "payload": "pl-choose-vegetable"
        }]
      }
    }
  };
  callSend(sender_psid, response);
}

/* FUNCTION TO CHOOSE VEGETABLES */

async function chooseVegetables(sender_psid) {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "Ka Zoon",
        "payload": "pl-ka-zoon"
      },
      {
        "content_type": "text",
        "title": "Arr luu",
        "payload": "pl-arr-luu"
      },
      {
        "content_type": "text",
        "title": "Pae",
        "payload": "pl-pae"
      }
    ]
  }
  callSend(sender_psid, response);
}

/* FUNCTION TO FOOD INGREDIENTS */

async function foodIngredients(sender_psid) {
  response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Welcome!",
          "image_url": "https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          "subtitle": "We have the right hat for everyone.",
          "default_action": {
            "type": "web_url",
            "url": "https://petersfancybrownhats.com/view?item=103",
            "webview_height_ratio": "tall",
          },
          "buttons": [{
              "type": "postback",
              "title": "Breakfast",
              "payload": "pl-breakfast"
            },
            {
              "type": "postback",
              "title": "Lunch",
              "payload": "pl-lunch"
            },
            {
              "type": "postback",
              "title": "Dinner",
              "payload": "pl-dinner"
            }
          ]
        }]
      }
    }
  };
  callSend(sender_psid, response);
}

function setupGetStartedButton(res) {
  var messageData = {
    "get_started": {
      "payload": "get_started"
    }
  };
  // Start the request
  request({
      url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + PAGE_ACCESS_TOKEN,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: messageData
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        res.send(body);
      } else {
        // TODO: Handle errors
        res.send(body);
      }
    });
}

function setupPersistentMenu(res) {
  var messageData = {
    "persistent_menu": [{
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [{
            "title": "Menu",
            "type": "nested",
            "call_to_actions": [{
                "title": "My orders",
                "type": "postback",
                "payload": "my-orders"
              },
              {
                "title": "Search a meal",
                "type": "postback",
                "payload": "search-by-category"
              },
              {
                "title": "Myanmar (Zawgyi)",
                "type": "postback",
                "payload": "mm-zawgyi"
              },
              {
                "title": "Myanmar (Unicode)",
                "type": "postback",
                "payload": "mm-unicode"
              },
              {
                "title": "English",
                "type": "postback",
                "payload": "eng"
              },
            ]
          },
          {
            "type": "web_url",
            "title": "Visit website",
            "url": "http://www.google.com",
            "webview_height_ratio": "full"
          }
        ]
      },
      {
        "locale": "zh_CN",
        "composer_input_disabled": false
      }
    ]
  };
  // Start the request
  request({
      url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + PAGE_ACCESS_TOKEN,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: messageData
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        res.send(body);

      } else {
        // TODO: Handle errors
        res.send(body);
      }
    });
}



function removePersistentMenu(res) {
  var messageData = {
    "fields": [
      "persistent_menu",
      "get_started"
    ]
  };
  // Start the request
  request({
      url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + PAGE_ACCESS_TOKEN,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      form: messageData
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        res.send(body);

      } else {
        // TODO: Handle errors
        res.send(body);
      }
    });
}

/***********************************
FUNCTION TO ADD WHITELIST DOMAIN
************************************/

const whitelistDomains = (res) => {
  var messageData = {
    "whitelisted_domains": [
      "https://newhope-grocery-store.herokuapp.com",
      "https://herokuapp.com"
    ]
  };
  request({
      url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + PAGE_ACCESS_TOKEN,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: messageData
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      } else {
        res.send(body);
      }
    });
}