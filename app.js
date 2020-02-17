
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

    body.entry.forEach(function(entry) {

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


app.get('/setgsbutton',function(req,res){
    setupGetStartedButton(res);    
});

app.get('/setpersistentmenu',function(req,res){
    setupPersistentMenu(res);    
});

app.get('/clear',function(req,res){    
    removePersistentMenu(res);
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
  }
  // Send the response message
  callSend(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'get_started') {
    greetUser (sender_psid);
  } else if (payload === 'pl-meal-deli') {
    mealDelivery (sender_psid);
  } else if (payload === 'pl-food-ingre') {
    foodIngredients (sender_psid);    
  } else if (payload === 'pl-choose-meat') {
    chooseMeat (sender_psid);
  } else if (payload === 'pl-choosen-chicken') {
    choosenChicken (sender_psid);
  } else if (payload === 'pl-choose-vegetable') {
    chooseVegetables (sender_psid);
  }
  // Send the message to acknowledge the postback
  callSend(sender_psid, response);
}


function callSendAPI(sender_psid, response) {  
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  
  return new Promise(resolve => {
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
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

async function callSend(sender_psid, response){
  let send = await callSendAPI(sender_psid, response);
  return 1;
}

function getUserProfile(sender_psid) {
  return new Promise(resolve => {
    request({
      "uri": "https://graph.facebook.com/"+sender_psid+"?fields=first_name,last_name,profile_pic&access_token=EAAC0Amc4MRgBAGR5JMXzFDQBBZCbHRjOkVPeKg3UokgQzZAYlIAZBQoPnwsKo6FZBmSOd5kPm16TUJEFdveL9iZA4IAG2EN1IozqH17jKueHNU2rPObJYjxkL6Kq3WttHxYhaj83SGYNK9ZBEtYXkJTOiXVV9key1xS8WZCpWXoQy3bluiMysR5IYlm1Q9QfVQZD",
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

async function greetUser(sender_psid){  
  let user = await getUserProfile(sender_psid);
  let response1 = {"text": "Hello. "+user.first_name+" "+user.last_name+". It's so nice to meet you."};
  let response2 = {"text": "Welcome to GlonePlone. Order and eat Great food."}
  let response3 = {"text": "......"};  
  let response4 = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
          {
            "title":"Welcome!",
            "image_url":"https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "subtitle":"We have the right hat for everyone.",
            "default_action":
            {
              "type": "web_url",
              "url": "https://petersfancybrownhats.com/view?item=103",
              "webview_height_ratio": "tall",
            },
            "buttons":[
            {
              "type":"postback",
              "title":"Meal Delivery",
              "payload":"pl-meal-deli"
            }
            ]
          },
          {
            "title":"Welcome!",
            "image_url":"https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "subtitle":"We have the right hat for everyone.",
            "default_action":
            {
              "type": "web_url",
              "url": "https://petersfancybrownhats.com/view?item=103",
              "webview_height_ratio": "tall",
            },
            "buttons":[
            {
              "type":"postback",
              "title":"Food Ingrediants",
              "payload":"pl-food-ingre" 
            }
            ]
          }
          ]
        }
      }
    };
    callSend(sender_psid, response1).then(()=>{
      return callSend(sender_psid, response2).then(()=>{
        return callSend(sender_psid, response3).then(()=>{
          return callSend(sender_psid, response4);
        });
      });
    });
  }

/* FUNCTION TO MEAL DELIVERY */

async function mealDelivery(sender_psid){
    let response1 = {"text":"Thanks for your interest in GlonePlone's Meal Delivery service!"};
    let response2 = {"text":"We deliver to Naypyitaw Pyinmana, Lwe"};
    let response3 = {
      "text":`Yo! You can make searching the food packages you want to roll. For example. Lunch, Dinner.`,
      "quick_replies":[
      {
        "content_type":"text",
        "title":"Lunch",
        "payload":"lunch"
      },
      {
        "content_type":"text",
        "title":"Dinner",
        "payload":"DotaSell"
      }
      ]
    };
  callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2).then(()=>{
      return callSend(sender_psid, response3);
    });
  });
}

/* FUNCTION TO LUNCH */

async function lunch (sender_psid) {
  let response1 = {"text": "Pick the item that you want"};
  let response2 = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to eat?",
        "buttons":[
          {
            "type":"postback",
            "title":"Choose Meat",
            "payload":"pl-choose-meat"
          },
          {
            "type":"postback",
            "title":"Choose Vegetable",
            "payload":"pl-choose-vegetable"
          }
        ]
      }
    }
    };
    callSend(sender_psid, response1).then(()=>{
      return callSend(sender_psid, response2);
    });
  }

/* FUNCTION TO CHOOSE MEAT */

async function chooseMeat (sender_psid) {
  let response;
  response = {
    "text":`You can choose what you want to eat.`,
    "quick_replies":[
    {
      "content_type":"text",
      "title":"Chicken",
      "payload":"pl-chicken"
    },
    {
      "content_type":"text",
      "title":"Beef",
      "payload":"pl-beef"
    },
    {
      "content_type":"text",
      "title":"Fish",
      "payload":"pl-fish"
    }
    ]
  }
}

/* FUNCTION TO CHOOSEN CHICKEN */

async function choosenChicken (sender_psid) {
  let response;
  response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[
        {
          "type":"postback",
          "title":"Choose Vegetable",
          "payload":"pl-choose-vegetable"
        }
        ]
      }
    }
  }
}

/* FUNCTION TO CHOOSE VEGETABLES */

async function chooseVegetables (sender_psid) {
  let response;
  response = {
    "text":`You can choose what you want to eat.`,
    "quick_replies":[
    {
      "content_type":"text",
      "title":"Ka Zoon",
      "payload":"pl-ka-zoon"
    },
    {
      "content_type":"text",
      "title":"Arr luu",
      "payload":"pl-arr-luu"
    },
    {
      "content_type":"text",
      "title":"Pae",
      "payload":"pl-pae"
    }
    ]
  }
}

/* FUNCTION TO FOOD INGREDIENTS */

async function foodIngredients (sender_psid) {
  response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
          {
            "title":"Welcome!",
            "image_url":"https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            "subtitle":"We have the right hat for everyone.",
            "default_action":
            {
              "type": "web_url",
              "url": "https://petersfancybrownhats.com/view?item=103",
              "webview_height_ratio": "tall",
            },
            "buttons":[
            {
              "type":"postback",
              "title":"Breakfast",
              "payload":"pl-breakfast"
            },
            {
              "type":"postback",
              "title":"Lunch",
              "payload":"pl-lunch"
            },
            {
              "type":"postback",
              "title":"Dinner",
              "payload":"pl-dinner"
            }
            ]
          }
          ]
        }
      }
    }
  }

/* FUNCTION TO CHICKEN */

async function chicken(sender_psid){  
  let response;
  response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Welcome!",
            "image_url":"https://petersfancybrownhats.com/company_image.png",
            "subtitle":"We have the right hat for everyone.",
            "buttons":[
            {
              "type":"postback",
              "title":"Choose",
              "payload":"pl-choosen-chicken"
            }
            ]
          },
          {
            "title":"Welcome!",
            "image_url":"https://petersfancybrownhats.com/company_image.png",
            "subtitle":"We have the right hat for everyone.",
            "buttons":[
            {
              "type":"postback",
              "title":"Choose",
              "payload":"pl-choosen-chicken"
            }
            ]
          },
          {
            "title":"Welcome!",
            "image_url":"https://petersfancybrownhats.com/company_image.png",
            "subtitle":"We have the right hat for everyone.",
            "buttons":[
            {
             "type":"postback",
             "title":"Choose",
             "payload":"pl-choosen-chicken"
            }
            ]
          }
          ]
        }
      }
    }
  callSendAPI(sender_psid, response);
}

function setupGetStartedButton(res){
  var messageData = {
    "get_started":{"payload":"get_started"}
  };
  // Start the request
  request({
    url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
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

function setupPersistentMenu(res){
        var messageData = { 
            "persistent_menu":[
                {
                  "locale":"default",
                  "composer_input_disabled":false,
                  "call_to_actions":[
                      {
                        "title":"Info",
                        "type":"nested",
                        "call_to_actions":[
                            {
                              "title":"Help",
                              "type":"postback",
                              "payload":"HELP_PAYLOAD"
                            },
                            {
                              "title":"Contact Me",
                              "type":"postback",
                              "payload":"CONTACT_INFO_PAYLOAD"
                            }
                        ]
                      },
                      {
                        "type":"web_url",
                        "title":"Visit website ",
                        "url":"http://www.google.com",
                        "webview_height_ratio":"full"
                    }
                ]
            },
            {
              "locale":"zh_CN",
              "composer_input_disabled":false
            }
          ]          
        };
        // Start the request
        request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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



function removePersistentMenu(res){
        var messageData = {
                "fields": [
                   "persistent_menu" ,
                   "get_started"                 
                ]               
        };
        // Start the request
        request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
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
