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

/****************************************************
Function to Handle when user send quick reply message
*****************************************************/

function handleQuickReply(sender_psid, received_message) {

  switch (received_message) {
    case "chicken":
      chicken(sender_psid);
      break;
    case "pork":
      pork(sender_psid);
      break;
    case "fish":
      fish(sender_psid);
      break;
    case "beef":
      beef(sender_psid);
      break;
    case "sea-food":
      seafood(sender_psid);
      break;
      // chicken
    case "ch-one-for-three":
      chOneForThree(sender_psid);
      break;
    case "ch-two-for-three":
      chTwoForThree(sender_psid);
      break;
    case "ch-three-for-three":
      chThreeForThree(sender_psid);
      break;
      // pork
    case "pork-one-for-three":
      porkOneForThree(sender_psid);
      break;
    case "pork-two-for-three":
      porkTwoForThree(sender_psid);
      break;
    case "pork-three-for-three":
      porkThreeForThree(sender_psid);
      break;
      // fish
    case "fish-one-for-three":
      fishOneForThree(sender_psid);
      break;
    case "fish-two-for-three":
      fishTwoForThree(sender_psid);
      break;
      // seafood
    case "sf-one-for-three":
      sfOneForThree(sender_psid);
      break;
    case "sf-two-for-three":
      sfTwoForThree(sender_psid);
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
      // chicken
    case "ch-one-ingre":
      chOneIngre(sender_psid);
      break;
    case "ch-two-ingre":
      chTwoIngre(sender_psid);
      break;
    case "ch-three-ingre":
      chThreeIngre(sender_psid);
      break;
    case "ch-one-check":
      chOneCheck(sender_psid);
      break;
    case "ch-two-check":
      chTwoCheck(sender_psid);
      break;
    case "ch-three-check":
      chThreeCheck(sender_psid);
      break;
    case "ch-one-how-to":
      chOneHowTo(sender_psid);
      break;
    case "ch-two-how-to":
      chTwoHowTo(sender_psid);
      break;
    case "ch-three-how-to":
      chThreeHowTo(sender_psid);
      break;
      // pork
    case "pork-one-ingre":
      porkOneIngre(sender_psid);
      break;
    case "pork-two-ingre":
      porkTwoIngre(sender_psid);
      break;
    case "pork-three-ingre":
      porkThreeIngre(sender_psid);
      break;
    case "pork-one-check":
      porkOneCheck(sender_psid);
      break;
    case "pork-two-check":
      porkTwoCheck(sender_psid);
      break;
    case "pork-three-check":
      porkThreeCheck(sender_psid);
      break;
    case "pork-one-how-to":
      porkOneHowTo(sender_psid);
      break;
    case "pork-two-how-to":
      porkTwoHowTo(sender_psid);
      break;
    case "pork-three-how-to":
      porkThreeHowTo(sender_psid);
      break;
      // fish
    case "fish-one-ingre":
      fishOneIngre(sender_psid);
      break;
    case "fish-two-ingre":
      fishTwoIngre(sender_psid);
      break;
    case "fish-one-check":
      fishOneCheck(sender_psid);
      break;
    case "fish-two-check":
      fishTwoCheck(sender_psid);
      break;
    case "fish-one-how-to":
      fishOneHowTo(sender_psid);
      break;
    case "fish-two-how-to":
      fishTwoHowTo(sender_psid);
      break;
      // seafood
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

/* FUNCTION TO GETUSERPROFILE */
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

/* FUNCTION TO SEARCH MEALS */
const searchMeals = (sender_psid) => {
  let response;
  response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "“ကြက်သား ဝက်သား ငါး,…” စသည့်အကြောင်းအရာများအားဖြင့် ရှာဖွေနိုင်ပါတယ်။ \n\n ယနေ့အတွက် ဟင်းပွဲတွေအကြောင်းနှင့် လတ်တလော လူစိတ်ဝင်စားမှုများသောဟင်းပွဲများအကြောင်းသိချင်ပါသလား။ \n\n အောက်က Button လေးတွေကို နှိပ်ပြီး ရှာဖွေနိုင်ပါတယ်နော်။",
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
  callSend(sender_psid, response);
}

/* FUNCTION TO SEARCH BY CATEGORY */
const searchByCategory = (sender_psid) => {
  let response;
  response = {
    "text": "Categories တခုချင်းစီကို နှိပ်ပြီး ရှာလို့ရပါတယ်။",
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
        "title": "Fish",
        "payload": "fish"
      },
      {
        "content_type": "text",
        "title": "Beef",
        "payload": "beef"
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

/* FUNCTION TO CHICKEN */
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
            "title": "ကြက်ဥကြော်နှပ်",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "ဘယ်သူမဆိုဒီလိုပူအိုက်တဲ့ရာသီမှာအနှစ်ပါတဲ့ဟင်းတွေ၊ဆီပါတဲ့ဟင်းတွေကိုစားချင်ကြမှာမဟုတ်ဘူး။ဒီဟင်းပွဲလေးကတော့ ထမင်းဖြူလေးနဲ့နယ်ဖတ်စားရင်တောင်အရသာရှိမှာအမှန်ပါပဲ။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "ch-two-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "ch-two-how-to"
              },

              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "ကြက်သားပင်စိမ်းအစပ်ကြော်",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "ဆောင်းရာသီနဲ့လိုက်ဖက်တဲ့ဟင်းလေးတစ်ခွက်ချက်စားကြရအောင်။ ထိုင်းလိုတော့ ဖတ်ကဖောင်ခေါ်ပါတယ်။ မိမိကြိုက်နှစ်သက်ရာအသားများနှင့်ကြော်နိူင်ပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "ch-three-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "ch-three-how-to"
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

/************************
Functions for Chicken one
*************************/
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
        "payload": "ch-one-for-three"
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

const chOneForThree = (sender_psid) => {
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

/************************
Functions for Chicken two
*************************/
const chTwoIngre = (sender_psid) => {
  let response1 = {
    "text": "ကြက်ဥ = ၃လုံး \n\n ကြက်သွန်နီ = ၂လုံး \n\n ကြက်သွန်ဖြူ = ၅တက် \n\n ငရုတ်သီးကြမ်းဖတ် = ၂ဇွန်း \n\n ငါးငံပြာရည် = ၁ဇွန်း \n\n အရသာမှုန့် = ၁ဇွန်း"
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

const chTwoCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "ch-two-for-three"
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

const chTwoForThree = (sender_psid) => {
  let response1 = {
    "text": "ကြက်ဥ = ၃လုံး \n\n ကြက်သွန်နီ = ၂လုံး \n\n ကြက်သွန်ဖြူ = ၅တက် \n\n ငရုတ်သီးကြမ်းဖတ် = ၂ဇွန်း \n\n ငါးငံပြာရည် = ၁ဇွန်း \n\n အရသာမှုန့် = ၁ဇွန်း"
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

const chTwoHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ကြက်ဥကို ကျက်အောင်ပြုတ်ပြီး ရေအေးစိမ်၊ အခွံခွာကာထက်ခြမ်း ခြမ်းပါ။ \n\n ၂။ ကြက်သွန်နီ ၊ ကြက်သွန်ဖြူ တို့ကိုပါးပါးလှီးပါ။ \n\n ၃။ ဒယ်အိုးတစ်လုံးမှာဆီကိုအပူပေးပြီးခြမ်းထားတဲ့ကြက်ဥကိုရွှေရောင်လေးရအောင်ကြော်ပါ။ \n\n ၄။ မျက်နှာပြင်လှဖို့အတွက်ဇွန်းလေးနဲ့ဆီပူကိုကော်ပြီးပက်ပေးပါ။ မှောက်ကြော်လိုက်တဲ့အခါအနှစ်တွေထွက်သွားတတ်ပါသည်။ \n\n ၅။ လက်ကျန်ဆီထဲသို့ကြက်သွန်နီကိုဦးစွာကြော်ပါ။ နနွင်းမှုန့်လေးဇွန်းဖျားခန့်ထည့်ပါ။ \n\n ၆။ ကြက်သွန်နီတစ်ဝက်ကျက်လောက်ပြီဆိုမှကြက်သွန်ဖြူထည့်ပါ။ \n\n ၇။ အနည်းငယ်ကြွပ်လာပြီဆိုမှ ငရုတ်သီးခွဲ ကြမ်းဖတ်တွေထည့်ပါ။ \n\n ၈။ ငါးငံပြာရည် ၊ အရသာမှုန့်တို့ဖြင့်ဖြည့်စွက်ပါ။ \n\n ၉။ ၎င်းကြက်သွန်နှင့်ငရုတ်သီးအရောကြော်လေးကိုဇွန်းနှင့်ခပ်ပြီးကြော်ယူဆီစစ်ထားတဲ့ကြက်ဥကြော်ပေါ်ကို လောင်းချပေးပါ။"
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

/**************************
Functions for Chicken three
***************************/
const chThreeIngre = (sender_psid) => {
  let response1 = {
    "text": "အရိုးထုတ်ပြီးကြက်ရင်ပုံသား  = ၁ခြမ်း \n\n ငရုတ်သီးစိမ်းနီ = ၁၀တောင့် \n\n ကြက်သွန်ဖြူ = ၇တက် \n\n ကြက်သွန်နီ = ၁ခြမ်း \n\n ပဲတောင့်ရှည် = ၁စည်း \n\n ကဖောင်ပင်စိမ်း = ၅ခက် \n\n ABC ပဲငံပြာရည်အပျစ် = ၁ဇွန်း \n\n ငါးငံပြာရည် = ၁ဇွန်း \n\n သကြား၊ အရသာမှုန့် = ၁ဇွန်း"
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
            "payload": "ch-three-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "ch-three-how-to"
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

const chThreeCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "ch-three-for-three"
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

const chThreeForThree = (sender_psid) => {
  let response1 = {
    "text": "အရိုးထုတ်ပြီးကြက်ရင်ပုံသား  = ၁ခြမ်း \n\n ငရုတ်သီးစိမ်းနီ = ၁၀တောင့် \n\n ကြက်သွန်ဖြူ = ၇တက် \n\n ကြက်သွန်နီ = ၁ခြမ်း \n\n ပဲတောင့်ရှည် = ၁စည်း \n\n ကဖောင်ပင်စိမ်း = ၅ခက် \n\n ABC ပဲငံပြာရည်အပျစ် = ၁ဇွန်း \n\n ငါးငံပြာရည် = ၁ဇွန်း \n\n သကြား၊ အရသာမှုန့် = ၁ဇွန်း"
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
            "payload": "ch-three-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "ch-three-how-to"
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

const chThreeHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ကြက်သားကို ခပ်​ကြမ်းကြမ်းလေးနုတ်နုတ်စဥ်းကာအရသာနယ်နှပ်ထားပါ။ \n\n ၂။ ကြက်သွန်ဖြူ ၊ ငရုတ်သီးစိမ်းတောင့်နီကိုရောပြီး ခပ်ကြမ်းကြမ်းလေးထောင်းပါ။ \n\n ၃။ ပင်စိမ်းရွက်လေးတွေကိုအရွက်ခြွေထားပါ။ \n\n ၄။ ဒယ်အိုးမှာ ဆီအနည်းငယ်ကိုအပူပေးပြီးကြက်သွန်နီကိုဆီသပ်ပါ။ \n\n ၅။ နွမ်းပြီးမွှေးလာလျှင်ရောထောင်းထားတဲ့ကြက်သွန်ဖြူ ၊ ငရုတ်သီးအရောကိုဆီသပ်ပါ။\n\n ၆။ မွှေးပြီး မွှန်လာလျှင်အရသာနယ်ထားတဲ့ကြက်သားတွေထည့်ပါ။ \n\n ၇။ ငါးငံပြာရည် ၊ ခရုဆီ ၊ABC ပဲငံပြာရည် အပျစ်၊ သကြား၊ အရသာမှုန့် တို့ဖြင့်အရသာဖြည့်ပါ။ \n\n ၈။ စိမ့်ထွက်ခါတဲ့အရည်တွေကုန်လာပြီဆို ဆီပြန်လာပါလိမ့်မယ်(အထက်ပါအဆင့်မှာမီးရှိန်ပြင်းဖို့လိုပါမယ်) \n\n ၉။ ဆီပြန်လာပြီဆို ခပ်စောင်းလှီးထားတဲ့ပဲတောင့်ရှည်ပင်စိမ်းရွက်အုပ် ၊ ငရုတ်ကောင်းလေးဖြူးပြီး တည်ခင်းမယ့်ပန်းကန်ထဲပြောင်းထည့်ပါ။ \n\n ၁၀။ ချို ၊စပ် မွှေးပြီးအရသာရှိတဲ့ကြက်သားပင်စိမ်းကြော်လေးရပါပြီ။"
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
            "title": "ကဗျာလွတ်ကုန်းဘောင်ကြော်",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "ဒီဟင်းပွဲအတွက်မည်သည့်အသားကိုမဆိုအသုံးပြုနိူင်ပါတယ်။ ကြက်၊ ဝက်၊ အမဲ၊ဆိတ်။ ကျွန်တော်က ဝက်လိုင်းသားလေးအသုံးပြုထားပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "pork-two-ingre"
              }, {
                "type": "postback",
                "title": "How to cook?",
                "payload": "pork-two-how-to"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "ဝက်သားချဥ်စပ်",
            "image_url": "https://petersfancybrownhats.com/company_image.png",
            "subtitle": "ဝက်သား၊ ကြက်သား မိမိနှစ်သက်ရာအသားကိုအသုံးပြုနိူင်ပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "pork-three-ingre"
              }, {
                "type": "postback",
                "title": "How to cook?",
                "payload": "pork-three-how-to"
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

/*********************
Functions for Pork one
**********************/
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

/*********************
Functions for Pork two
**********************/
const porkTwoIngre = (sender_psid) => {
  let response1 = {
    "text": "ဝက်လိုင်းသား = ၂၀ကျပ်သား \n\n ကြက်သွန်နီ = ၂လုံး \n\n ခရမ်းချဉ်သီး = ၂လုံး \n\n ချင်းသေးသေး = ၁တက် \n\n ရွှေပဲသီး = ၁၀တောင့်ခန့် \n\n ငရုတ်ပွခြောက်ရှည် = ၅တောင့် \n\n ကြက်သွန်မြိတ် = ၃ပင် \n\n ABC ပဲငံပြာရည်အပျစ် \n\n ABC ပဲငံပြာရည်အကျဲ"
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
            "payload": "pork-two-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "pork-two-how-to"
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

const porkTwoCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "pork-two-for-three"
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

const porkTwoForThree = (sender_psid) => {
  let response1 = {
    "text": "ဝက်လိုင်းသား = ၆၀ကျပ်သား \n\n ကြက်သွန်နီ = ၆လုံး \n\n ခရမ်းချဉ်သီး = ၆လုံး \n\n ချင်းသေးသေး = ၃တက် \n\n ရွှေပဲသီး = ၃၀တောင့်ခန့် \n\n ငရုတ်ပွခြောက်ရှည် = ၁၅တောင့် \n\n ကြက်သွန်မြိတ် = ၉ပင် \n\n ABC ပဲငံပြာရည်အပျစ် \n\n ABC ပဲငံပြာရည်အကျဲ"
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
            "payload": "pork-two-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "pork-two-how-to"
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

const porkTwoHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ပထမဆုံးအသားကိုမိမိစိတ်ကြိုက်အတုံးငယ်(သို့)ခပ်ပါးပါးလှီးကာ အရသာမှုန့်၊ ABC ပဲငံပြာရည်အပျစ်၊ အကျဲတို့ဖြင့်အရသာနယ်ကာ (၅)မိနစ်ခန့်နှပ်ထားပါ။ \n\n ၂။ ကြက်သွန်နီကိုလေးစိတ်ခွဲပြီးအလွှာလေးတွေခွာထားပါ။ခရမ်းချဥ်သီးကိုလေးစိတ်ခွဲလှီးကာအူတိုင်နှင့်အစေ့တွေထုတ်ပါ။ \n\n ၃။ ချင်းကိုအမျှင်လှီးပြီး ရွှေပဲသီးကိုထက်ပိုင်းဖြတ်ပါ။ ကြက်သွန်မြိတ်ကိုလက်တဆစ်ခန့်လှီးပါ။ \n\n ၄။ ဒယ်အိုးတစ်လုံးမှာဆီအနည်းငယ်ကိုအပူပေးပြီး အညှာခြွေထားတဲ့ငရုတ်ပွခြောက်အရှည်ကိုမွှေးပြီးကျွမ်းအောင်ကြော်ကာ ဆီစစ်ထားပါ။ \n\n ၅။ ကြက်သွန်နီ၊ ရွှေပဲ ၊ ခရမ်းချဥ်သီးတွေကိုလည်းတစ်ခုချင်းစီထည့်ကြော်ပြီးဆီစစ်ထားပါ။ \n\n ၆။ လက်ကျန်ဆီမှာချင်းကိုဆီသပ်ပြီးမွှေးလာပြီဆိုအရသာနယ်ထားတဲ့အသားတွေထည့်ကြော်ပါ။ \n\n ၇။ အရသာမှုန့် ၊ခရုဆီ၊ သကြား၊ ABC ပဲငံပြာရည်အပျစ်၊ အကျဲတို့ဖြင့်အရသာဖြည့်စွက်ပါ။ \n\n ၈။ ကြော်ယူဆီစစ်ထားတဲ့ ကြက်သွန်၊ ခရမ်းချဉ်သီး ၊ ရွှေပဲ ၊ငရုတ်ခြောက်တောင့်ရှည်တွေထည့်ပြီး မွှေပေးပါ။ \n\n ၉။ နောက်ဆုံးမှာ ကြက်သွန်မြိတ်၊ ငရုတ်ကောင်းလေးဖြူးပေးပါ။ \n\n မှတ်ချက်။ ဒီဟင်းပွဲဟာမီးရှိန်ပြင်းပြင်းဖြင့်အမြန်ချက်ပြုတ်ကာပူပူနွေးနွေးသုံးဆောင်ရတဲ့ဟင်းပွဲဖြစ်ပါတယ်။"
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

/***********************
Functions for Pork three
************************/
const porkThreeIngre = (sender_psid) => {
  let response1 = {
    "text": "ဝက်လိုင်းသား = ၂၀ကျပ်သား \n\n ကြက်သွန်နီ = ၂လုံး \n\n ခရမ်းချဉ်သီး = ၂လုံး \n\n ချင်းသေးသေး = ၁တက် \n\n ငရုတ်သီးခွဲကြမ်း = ၁ဇွန်း \n\n ဗီနီဂါ = ၁ဇွန်း \n\n ငရုတ်ဆော့စ်အပျစ် = ၂ဇွန်း \n\n သံပုရာသီး = ၁စိတ် \n\n ကြက်သွန်မြိတ် = ၃ပင် \n\n ABC ပဲငံပြာရည်အပျစ် \n\n ABC ပဲငံပြာရည်အကျဲ"
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
            "payload": "pork-three-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "pork-three-how-to"
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

const porkThreeCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "pork-three-for-three"
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

const porkThreeForThree = (sender_psid) => {
  let response1 = {
    "text": "ဝက်လိုင်းသား = ၆၀ကျပ်သား \n\n ကြက်သွန်နီ = ၆လုံး \n\n ခရမ်းချဉ်သီး = ၆လုံး \n\n ချင်းသေးသေး = ၃တက် \n\n ငရုတ်သီးခွဲကြမ်း = ၃ဇွန်း \n\n ဗီနီဂါ = ၃ဇွန်း \n\n ငရုတ်ဆော့စ်အပျစ် = ၆ဇွန်း \n\n သံပုရာသီး = ၃စိတ် \n\n ကြက်သွန်မြိတ် = ၉ပင် \n\n ABC ပဲငံပြာရည်အပျစ် \n\n ABC ပဲငံပြာရည်အကျဲ"
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
            "payload": "pork-three-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "pork-three-how-to"
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

const porkThreeHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ပထမဆုံးအသားကိုမိမိစိတ်ကြိုက်အတုံးငယ်(သို့)ခပ်ပါးပါးလှီးကာ အရသာမှုန့်၊ ABC ပဲငံပြာရည်အပျစ်၊ အကျဲတို့ဖြင့်အရသာနယ်ကာ (၅)မိနစ်ခန့်နှပ်ထားပါ။ \n\n ၂။ ကြက်သွန်နီကိုလေးစိတ်ခွဲပြီးအလွှာလေးတွေခွာထားပါ။ခရမ်းချဥ်သီးကိုလေးစိတ်ခွဲလှီးကာအူတိုင်နှင့်အစေ့တွေထုတ်ပါ။ \n\n ၃။ ချင်းကိုအမျှင်လှီးပြီး ငရုတ်ခွဲကြမ်းမှုန့် တစ်ဇွန်းပြင်ဆင်ထားပါ။ \n\n ၄။ ကြက်သွန်မြိတ်ကိုလက်တဆစ်ခန့်လှီးပါ။ \n\n ၅။ ဒယ်အိုးတစ်လုံးမှာဆီအနည်းငယ်ကိုအပူပေးပြီး ကြက်သွန်နီ၊  ခရမ်းချဥ်သီးတွေကိုတစ်ခုချင်းစီထည့်ကြော်ပြီးဆီစစ်ထားပါ။ \n\n ၆။ လက်ကျန်ဆီမှာချင်းကိုဆီသပ်ပြီးမွှေးလာပြီဆိုအရသာနယ်ထားတဲ့အသားတွေထည့်ကြော်ပါ။ \n\n ၇။ ငရုတ်ခွဲကြမ်းမှုန့်၊ ဗီနီဂါ ၊ ငရုတ်ဆော့စ် အရသာမှုန့် ၊ခရုဆီ၊ သကြား၊ ABC ပဲငံပြာရည်အပျစ်၊ အကျဲတို့ဖြင့်အရသာဖြည့်စွက်ပါ။ \n\n ၈။ ကြော်ယူဆီစစ်ထားတဲ့ ကြက်သွန်နီ၊ ခရမ်းချဉ်သီး ၊ တွေထည့်ပြီး မွှေပေးပါ။ \n\n ၉။ နောက်ဆုံးမှာ ကြက်သွန်မြိတ်၊ ငရုတ်ကောင်းလေးဖြူးပေးပါ။ \n\n မှတ်ချက်။ ဒီဟင်းပွဲဟာမီးရှိန်ပြင်းပြင်းဖြင့်အမြန်ချက်ပြုတ်ကာပူပူနွေးနွေးသုံးဆောင်ရတဲ့ဟင်းပွဲဖြစ်ပါတယ်။"
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

/* FUNCTION TO FISH */
const fish = (sender_psid) => {
  let response;
  response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
            "title": "ငါးကြင်းမြီးစတူး",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/new-hope-a1a0b.appspot.com/o/chicken%2Fchicken%20soup_1587378249871?alt=media&token=af1d6f12-536e-4d0d-9a1b-8b2074d975f3",
            "subtitle": "ဒီတစ်ခါ နွေရာသီပူပူမှာခံတွင်းလိုက်စေမယ့်ဟင်းလေးတစ်မယ်ဖော်ပြပေးလိုက်ပါတယ်။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "fish-one-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "fish-one-how-to"
              },
              {
                "type": "web_url",
                "url": "https://new-hope-a1a0b.web.app/products?meal=XpPBwQM4xrR8bu3mY5V6",
                "title": "Shop Now"
              }
            ]
          },
          {
            "title": "လျှာဒလက်လည်ငါးပိထောင်း",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/new-hope-a1a0b.appspot.com/o/chicken%2Fchicken%20soup_1587378249871?alt=media&token=af1d6f12-536e-4d0d-9a1b-8b2074d975f3",
            "subtitle": "ငါးပိထောင်းက နူးညံ့အိစက်နေတဲ့အတွက်သရက်သီးစိမ်းလေးနဲ့တို့မလား၊ သခွားသီးလေးနဲ့ကော်ပြီးတို့မလား၊ ထမင်းနဲ့ ဇွိကနဲနယ်စားမလား၊ စားချင်ရာနဲ့သာစားပါ။",
            "buttons": [{
                "type": "postback",
                "title": "View ingredients",
                "payload": "fish-two-ingre"
              },
              {
                "type": "postback",
                "title": "How to cook?",
                "payload": "fish-two-how-to"
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

/*********************
Functions for Fish one
**********************/
const fishOneIngre = (sender_psid) => {
  let response1 = {
    "text": "ငါးကြင်းမြီး = ၂ခု \n\n ချင်းကြီးကြီး = ၁တက် \n\n ကြက်သွန်ဖြူ = ၇မွှာ \n\n ကြက်သွန်မြိတ် = ၅ပင် \n\n ABCပဲငံပြာရည်အကြည် = ၅ဇွန်း \n\n ABCပဲငံပြာရည်အပျစ် = ၁ဇွန်း \n\n ခရုဆီ = ၃ဇွန်း \n\n သကြား = ၂ဇွန်း \n\n ဆီမွှေး = ဇွန်း ၁ ဝက်ခန့် \n\n ဆား၊ အရသာမှုန့် = အနည်းငယ်စီ"
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
            "payload": "fish-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "fish-one-how-to"
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

const fishOneCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "fish-one-for-three"
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

const fishOneForThree = (sender_psid) => {
  let response1 = {
    "text": "ငါးကြင်းမြီး = ၆ခု \n\n ချင်းကြီးကြီး = ၃တက် \n\n ကြက်သွန်ဖြူ = ၂၁မွှာ \n\n ကြက်သွန်မြိတ် = ၁၅ပင် \n\n ABCပဲငံပြာရည်အကြည် = ၁၅ဇွန်း \n\n ABCပဲငံပြာရည်အပျစ် = ၃ဇွန်း \n\n ခရုဆီ = ၉ဇွန်း \n\n သကြား = ၆ဇွန်း \n\n ဆီမွှေး = ၃ဇွန်း \n\n ဆား၊ အရသာမှုန့် = အနည်းငယ်စီ"
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
            "payload": "fish-one-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "fish-one-how-to"
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

const fishOneHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ငါးကြင်းမြီးကို ရေဆေးသန့်စင်ပြီးအရိုးပေါ်အသားများကိုသုံးမြှောင်းခွဲကာ၊ ဆား ၊အရသာမှုန့်နယ်ပြီး(၅)မိနစ်ခန့်နှပ်ထားပါ။ \n\n ၂။ ချင်းကိုအမျှင်လှီးပြီးကြက်သွန်ဖြူကိုအမြှောင်းလိုက်ပါးပါးလှီးပါ။ကြက်သွန်မြိတ်ကိုလက်တဆစ်ခန့်လှီးထားပါ။ \n\n ၃။ ဆီကိုအပူပေးပြီး အရသာနယ်ထားတဲ့ငါးကြင်းမြီးကိုထည့်ကြော်ပါ။အရမ်းကြွပ်စရာမလိုပဲ အသားကျက်ရုံသာကြော်ပါ။ \n\n ၄။ ငါးကျက်လျှင်ဆယ်ယူစစ်ထားပြီးဆီသပ်ရန်မှတပါးပိုသောဆီတွေကိုဖယ်ထုတ်ပါ။ \n\n ၅။ လက်ကျန်ဆီမှာ ချင်း၊ကြက်သွန်ဖြူ ကိုဆီသပ်ပါ။မွှေးလာလျှင်သကြားထည့်ပါ။ \n\n ၆။ သကြားပျော်ပြီးညိုလာလျှင်ABC ပဲငံပြာရည်အပျစ်၊ပဲငံပြာရည်အကြည်၊ ခရုဆီထည့်ပါ။ \n\n ၇။ ဆီမွှေး ၊ ဆား ၊ အရသာမှုန့်အနည်းငယ်စီထည့်ပါ။ ရေကြက်သီးနွေးလေးအနည်းငယ်ထည့်ပါ။ \n\n ၈။ ကြော်ထားတဲ့ငါးကြင်းမြီးထည့်ပြီးမီးရှိန်လျှော့ကာတဖျင်းဖျင်းနှပ်ပေးပါ။ \n\n ၉။ ငါးကြင်းကိုမကြော်ပဲအစိမ်းထည့်နှပ်နိူင်ပေမယ့်ညှီနံံ့ကြောက်သူတွေအတွက်ဒီနည်းလမ်းကအကောင်းဆုံးပါ။ \n\n ၁၀။ ငါးကြင်းမြီးထဲအရသာဝင်ပြီဆိုလျှင်ကြက်သွန်မြိတ်လေးဖြူးပြီးဖိုပေါ်မှချပါ။ \n\n ငါးကြင်းဗိုက်သားအချပ်လိုက်ကိုလဲယခုပုံစံအတိုင်းစတူးနှပ်ချက် ချက်နိူင်ပါတယ်။"
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

/*********************
Functions for Fish two
**********************/
const fishTwoIngre = (sender_psid) => {
  let response1 = {
    "text": "ပုစွန်ငါးပိကောင်းကောင်း = ၃ဇွန်း \n\n ပုစွန်ခြောက် = ၁ဇွန်း \n\n ငရုတ်သီးစိမ်း = ၂၀တောင့် \n\n အာဝါးသီး(ကုလားအော်သီး) = ၃တောင့် \n\n သံပုရာသီးကြီးကြီး = ၁လုံး"
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
            "payload": "fish-two-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "fish-two-how-to"
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

const fishTwoCheck = (sender_psid) => {
  let response;
  response = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "3",
        "payload": "fish-two-for-three"
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

const fishTwoForThree = (sender_psid) => {
  let response1 = {
    "text": "ပုစွန်ငါးပိကောင်းကောင်း = ၉ဇွန်း \n\n ပုစွန်ခြောက် = ၃ဇွန်း \n\n ငရုတ်သီးစိမ်း = ၂၀တောင့် \n\n အာဝါးသီး(ကုလားအော်သီး) = ၉တောင့် \n\n သံပုရာသီးကြီးကြီး = ၃လုံး"
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
            "payload": "fish-two-check"
          },
          {
            "type": "postback",
            "title": "How to cook",
            "payload": "fish-two-how-to"
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

const fishTwoHowTo = (sender_psid) => {
  let response1 = {
    "text": "၁။ ပထမဆုံးပုစွန်ခြောက်ကို မီးအေးအေးလေးနဲ့လှော်ပါ။ \n\n ၂။ စတီးပန်ကန်ပြားလေးကိုဆီအနည်းငယ်သုတ်ပြီးငါးပိတွေကို ပြန့်နေအောင်ဖြန့်ပြီးပေါင်းပါ။ \n\n ၃။ ငရုတ်သီးတွေကိုအညှာခြွေပြီးပြုတ်ပါ။ \n\n ၄။ ကျွန်တော်က ဒယ်အိုးနီနဲ့ ပုစွန်ခြောက်လှော်ပြီးငရုတ်သီးပြုတ်ပါတယ်။ ဝါးတူလေး ၄ချောင်းကိုကြက်ခြေခတ်လုပ်ပြီး ငါးပိပန်းကန်ပြားတင်ပြီးပေါင်းပါ။ \n\n ၅။ ငါးပိပေါင်းတဲ့အခါဘအပေါ်ကိုဖောင်းတက်လာပြီး ကွဲထွက်သွားပြီဆို ဖယ်ထုတ်အအေးခံထားပါ။ \n\n ၆။ ငရုတ်သီးကိုတော့ နူးအိနေအောင်ပြုတ်ပါ ။ ရေမကျန်စေရ။အအေးခံထားပါ။ \n\n ၇။ ပုစွန်ခြောက်ကို ဆုံထဲထည့်ပြီး မွှနေအောင်ထောင်းပါ။ \n\n ၈။ အအေးခံထားတဲ့ ငရုတ်သီးစိမ်းပြုတ်တွေထည့်ပြီး ညှက်စေးနေအောင်ထောင်းပါ။ \n\n ၉။ ငါးပိတွေကို ထည့်ပြီး ဇွန်းနဲ့ ကျည်ပွေ့ သုံးပြီးမွှေပေးပါ။ ငါးပိက မွှနေအောင်ပေါင်းထားတဲ့အတွက် ကျည်ပွေ့နဲ့ ဖိထောင်းစရာမလိုပါ။ \n\n ၁၀။ ထိုကဲ့သို့ မွှေနေချိန်အတွင်းဟင်းခတ်မှုန့်နှင့်သံပုရာရည် ညှစ်ထည့်ပြီး နှံ့သွားအောင်မွှေပေးပါ။"
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

/* FUNCTION TO BEEF */
const beef = (sender_psid) => {
  let response1 = {
    "text": "ဝမ်းနည်းပါတယ်ခင်ဗျ။ လူကြီးမင်းရှာသော Category Beef အတွက် Meal ရှာဖွေလို့မရပါ။"
  };
  let response2 = {
    "text": "တခြား Categories တွေနဲ့ ရှာကြည့်ပါလား။",
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
        "title": "Fish",
        "payload": "fish"
      },
      {
        "content_type": "text",
        "title": "Sea Food",
        "payload": "sea-food"
      }
    ]
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

/************************
Functions for Seafood one
*************************/
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

/************************
Functions for Seafood two
*************************/
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
                "payload": "search-meals"
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