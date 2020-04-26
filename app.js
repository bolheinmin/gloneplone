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

let receipt = {
  qty: false,
}

let userEnteredMsg = {};

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;



  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);



      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
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
  } else if (received_message.text && receipt.qty == true) {
    userEnteredMsg.qty = received_message.text;
    response = {
      "text": `${userEnteredMsg}`
    }
  } else if (received_message.text === 'Lunch') {
    lunch(sender_psid);
  } else if (received_message.text === 'Chicken') {
    chicken(sender_psid);
  } else if (received_message.text === 'Shop Now') {
    shopNow(sender_psid);
  } else if (received_message.text === 'Test') {
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "receipt",
          "recipient_name": "Stephane Crozatier",
          "order_number": "12345678902",
          "currency": "USD",
          "payment_method": "Visa 2345",
          "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
          "timestamp": "1428444852",
          "address": {
            "street_1": "1 Hacker Way",
            "street_2": "",
            "city": "Menlo Park",
            "postal_code": "94025",
            "state": "CA",
            "country": "US"
          },
          "summary": {
            "subtotal": 75.00,
            "shipping_cost": 4.95,
            "total_tax": 6.19,
            "total_cost": 56.14
          },
          "adjustments": [{
              "name": "New Customer Discount",
              "amount": 20
            },
            {
              "name": "$10 Off Coupon",
              "amount": 10
            }
          ],
          "elements": [{
              "title": "Classic White T-Shirt",
              "subtitle": "100% Soft and Luxurious Cotton",
              "quantity": 2,
              "price": 50,
              "currency": "USD",
              "image_url": "http://petersapparel.parseapp.com/img/whiteshirt.png"
            },
            {
              "title": "Classic Gray T-Shirt",
              "subtitle": "100% Soft and Luxurious Cotton",
              "quantity": 1,
              "price": 25,
              "currency": "USD",
              "image_url": "http://petersapparel.parseapp.com/img/grayshirt.png"
            }
          ]
        }
      }
    }
  }
  // Send the response message
  callSend(sender_psid, response);
}

/*********************************************
Function to handle when user click button
**********************************************/
const handlePostback = (sender_psid, received_postback) => {
  let payload = received_postback.payload;

  switch (payload) {
    case "get_started":
      greetUser(sender_psid);
    case "food-package":
      foodPackage(sender_psid);
      break;
    case "ready-to-cook":
      readyToCook(sender_psid);
      break;
    case "chicken":
      chicken(sender_psid);
      break;
    case "cs-how-to-cook":
      csHowToCook(sender_psid);
      break;
    case "cs-view-ingre":
      csViewIngredients(sender_psid);
      break;
    default:
      defaultReply(sender_psid);
  }
}
/*
function handlePostback(sender_psid, received_postback) {
  console.log('ok')
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'get_started') {
    greetUser(sender_psid);
  } else if (payload === 'chat-with-admin') {
    mealDelivery(sender_psid);
  } else if (payload === 'food-package') {
    foodPackage(sender_psid);
  } else if (payload === 'ready-to-cook') {
    readyToCook(sender_psid);
  } else if (payload === 'chicken') {
    chicken(sender_psid);
  } else if (payload === 'cs-how-to-cook') {
    csHowToCook(sender_psid);
  } else if (payload === 'cs-view-ingre') {
    csViewIngredients(sender_psid);
  } else if (payload === 'pl-choose-vegetable') {
    chooseVegetables(sender_psid);
  } else if (payload === 'shop-now') {
    shopNow(sender_psid);
  }
  // Send the message to acknowledge the postback
  callSend(sender_psid, response);
}*/


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
            "payload": "food-package"
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

const foodPackage = (sender_psid) => {
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
            "title": "Ready to Cook",
            "payload": "ready-to-cook"
          },
          {
            "type": "postback",
            "title": "Ready to Eat",
            "payload": "ready-to-eat"
          }
        ]
      }
    }
    // "text": "Yo! You can make searching the food packages you want to roll. For example. Lunch, Dinner.",
    // "buttons": [{
    //     "type": "postback",
    //     "title": "Ready to Cook",
    //     /* အသင့်ချက်ပြုတ်ရန် အစားအစာများ */
    //     "payload": "ready-to-cook"
    //   },
    //   {
    //     "type": "postback",
    //     "title": "Ready to Eat",
    //     /* အသင့်စားသုံးရန် အစားအစာများ */
    //     "payload": "ready-to-eat"
    //   }
    // ]
  };
  callSend(sender_psid, response1).then(() => {
    return callSend(sender_psid, response2).then(() => {
      return callSend(sender_psid, response3);
    });
  });
}

/* Function to ReadyToCook */

const readyToCook = (sender_psid) => {
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
        "title": "Beef",
        "payload": "pl-beef"
      },
      {
        "content_type": "text",
        "title": "Fish",
        "payload": "pl-fish"
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
            "title": "Chicken Soup",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/new-hope-a1a0b.appspot.com/o/chicken%2Fchicken%20soup_1587378249871?alt=media&token=af1d6f12-536e-4d0d-9a1b-8b2074d975f3",
            "subtitle": "Chicken soup is a soup made from chicken, simmered in water, usually with various other ingredients.",
            "buttons": [{
                "type": "postback",
                "title": "How to cook?",
                "payload": "cs-how-to-cook"
              },
              {
                "type": "postback",
                "title": "View ingredients",
                "payload": "cs-view-ingre"
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

const csHowToCook = (sender_psid) => {
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
            "type": "postback",
            "title": "View Ingredients",
            "payload": "cs-view-ingre"
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

const csViewIngredients = (sender_psid) => {
  let response1 = {
    "text": "ဗမာကြက် = ၅ဝ ကျပ်သား \n\n ချဉ်စော်ခါးသီ = ၁ ခြမ်း \n\n ချင်းကြီးကြီး = ၁တက် \n\n ကြက်သွန်ဖြူ = ၅မွှာ \n\n ငရုတ်သီးစိမ်း = ၃တောင့် \n\n ကြွက်နားရွယ်မှို = အနည်းငယ် \n\n ရှမ်းနံနံ+ကြက်သွန်မြိတ် = အနည်းငယ်စီ"
  };
  let response2 = {
    "text": `You can choose what you want to eat.`,
    "quick_replies": [{
        "content_type": "text",
        "title": "1",
        "payload": "pl-ka-zoon"
      },
      {
        "content_type": "text",
        "title": "2",
        "payload": "pl-arr-luu"
      },
      {
        "content_type": "text",
        "title": "3",
        "payload": "pl-pae"
      }
    ]
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
                "title": "Meal Delivery",
                "type": "postback",
                "payload": "pl-meal-deli"
              },
              {
                "title": "Food Ingrediants",
                "type": "postback",
                "payload": "pl-food-ingre"
              }
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