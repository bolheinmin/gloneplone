
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
  if (received_message.text) {
    let user_message1 = received_message.text;
    response = {
      "text":user_message1
    }
  }
  else if (received_message.text === 'Lunch') {
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
              "type":"web_url",
              "url":"https://petersfancybrownhats.com",
              "title":"View Website"
            },{
              "type":"postback",
              "title":"Shop Now",
              "payload":"shop-now"
            }
            ]
          }
          ]
        }
      }
    }
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
  let response1 = {"text": "Hello! Welcome to GlonePlone"};
  let response2 = {"text": "To view Lunch, type 'Lunch'"};  
  let response3 = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":"Hi! I can help you find food packages.",
          "buttons":[
          {
            "type": "postback",
            "title": "CHAT WITH A PERSON",
            "payload": "chatWithPerson"
          },
          {
            "type": "postback",
            "title": "SEARCH A FOOD PACKAGE",
            "payload": "searchFoodPackage"
          },
          {
            "type": "postback",
            "title": "BUY",
            "payload": "buy"
          }
          ]
        }
      }
    };
    callSend(sender_psid, response1).then(()=>{
      return callSend(sender_psid, response2).then(()=>{
        return callSend(sender_psid, response3);
      });
    });
  }
  else if (payload === 'searchFoodPackage') {
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":'Searching by a category "Blah, Blah, Blah, etc..."will help you to find a food package that fits your expectations, you can also get the popular food packages or the food packages that will happen today.',
          "buttons":[
          {
            "type": "postback",
            "title": "TODAY FOOD PACKAGES",
            "payload": "todayFoodPack"
          },
          {
            "type": "postback",
            "title": "POPULAR FOOD PACKAGES",
            "payload": "popFoodPack"
          },
          {
            "type": "postback",
            "title": "SEARCH BY CATEGORY",
            "payload": "searchByCategory"
          }
          ]
        }
      }
    }
  } else if (payload === 'searchByCategory') {
    response = {
      "text":`Yo! You can type categories to make searching the food packages you want to roll. For example. Lunch, Dinner.`,
      "quick_replies":[
      {
        "content_type":"text",
        "title":"Lunch",
        "payload":"lunch"
      },{
        "content_type":"text",
        "title":"Dinner",
        "payload":"DotaSell"
      }
      ]
    }
  }
  else if (payload === 'shop-now') {
    response = {
      "text":'Choose a quantity:',
      "quick_replies":[
      {
        "content_type":"text",
        "title":"1",
        "payload":"no-1"
      },
      {
        "content_type":"text",
        "title":"2",
        "payload":"no-2"
      },
      {
        "content_type":"text",
        "title":"3",
        "payload":"no-3"
      }
      ]
    }
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
