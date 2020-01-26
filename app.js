
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
      var senderID = webhook_event.sender.id;
      console.log('senderID', senderID);
      if(webhook_event.postback){
      var userPostBack = webhook_event.postback.payload;
      console.log('reply', userPostBack);
    }
    if(webhook_event.message){if(webhook_event.message.text){
        var userInput = webhook_event.message.text;
        console.log('userText', userInput);
      }
      if(webhook_event.message.attachments){
        var userPictureInput = webhook_event.message.attachments;
        console.log('userImage', userPictureInput);
    }}
    if(userInput == 'Video'){
      console.log('in video message')
      request.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
            {
            "recipient":{
            "id":senderID
            },
            "message":{
              "attachment": {
                "type": "template",
                "payload": {
                   "template_type": "media",
                   "elements": [
                      {
                         "media_type": "video",
                         "url": "https://www.facebook.com/XzitThamer/videos/436032573767875/"
                      }
                   ]
                }
              }
            }
        }).then(success => {console.log('success')}).catch(err => {console.log(err)})
      }
    if(userPostBack == 'Hi' || userInput == 'Hi'){
            request.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
            {
            "recipient":{
            "id":senderID
            },
            "message":{
            "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Hi! Please press the button below to link your steam account and start using our service 👇",
              "buttons":[{
                        "type": "web_url",
                        "title": "Link Account",
                    }]
              }
            }
          }
        });
    }
      if(userPostBack == 'Market' || userInput == 'Market' || userInput == 'Marketplace'){
        request.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
            {
            "recipient":{
            "id":senderID
            },
            "message":{
            "text":'Please choose a game',
            "quick_replies":[
            {
              "content_type":"text",
              "title":"Dota 2",
              "payload":"Dota",
              "image_url":"https://seeklogo.com/images/D/dota-2-logo-A8CAC9B4C9-seeklogo.com.png"
            },{
              "content_type":"text",
              "title":"CS:GO",
              "payload":"Csgo",
              "image_url":"https://i.redd.it/1s0j5e4fhws01.png"
            }
            ]
            }
            })
      }

      if(userPostBack == 'Dota' || userInput == 'Dota' || userInput == 'Dota 2'){
        request.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
            {
            "recipient":{
            "id":senderID
            },
            "message":{
            "text":`What would you like to do?`,
            "quick_replies":[
            {
              "content_type":"text",
              "title":"Purchase Items",
              "payload":"DotaBuy",
              "image_url":"https://i.imgur.com/HELIS0G.png"
            },{
              "content_type":"text",
              "title":"Sell Items",
              "payload":"DotaSell",
              "image_url":"https://i.imgur.com/BFehPAC.png"
            }
            ]
            }
            })
      }

      if(userPostBack == 'Csgo' || userInput == 'Csgo' || userInput == 'CS:GO'){
        request.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
            {
            "recipient":{
            "id":senderID
            },
            "message":{
            "text":`What would you like to do?`,
            "quick_replies":[
            {
              "content_type":"text",
              "title":"Purchase Items",
              "payload":"CSBuy",
              "image_url":"https://i.imgur.com/HELIS0G.png"
            },{
              "content_type":"text",
              "title":"Sell Items",
              "payload":"CSSell",
              "image_url":"https://i.imgur.com/BFehPAC.png"
            }
            ]
            }
            })
      }

      if(userInput == 'Sell Items'){
        var a = webhook_event.quick_reply.payload
        if(a == 'CSSell'){
          request.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
            {
            "recipient":{
            "id":senderID
            },
            "message":{
            "text":`Please choose sales type`,
            "quick_replies":[
            {
              "content_type":"text",
              "title":"Urgent Sale",
              "payload":"CSUrgent",
              "image_url":"https://images.squarespace-cdn.com/content/55da2fd1e4b081e9ffda76cb/1544814719111-VCKVRF9HEDZYKVUED8ZG/icon-run4one-running-man.png?format=1500w&content-type=image%2Fpng"
            },{
              "content_type":"text",
              "title":"Normal Sale",
              "payload":"CSNormal",
              "image_url":"https://www.pngwiki.com/images/5/51/1496184257Hugging-Emoji-png-transparent-Icon.png"
            }
            ]
            }
            })
        }
        if(a == 'DotaSell'){
          request.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
            {
            "recipient":{
            "id":senderID
            },
            "message":{
            "text":`Please choose sales type`,
            "quick_replies":[
            {
              "content_type":"text",
              "title":"Urgent Sale",
              "payload":"DotaUrgent",
              "image_url":"https://images.squarespace-cdn.com/content/55da2fd1e4b081e9ffda76cb/1544814719111-VCKVRF9HEDZYKVUED8ZG/icon-run4one-running-man.png?format=1500w&content-type=image%2Fpng"
            },{
              "content_type":"text",
              "title":"Normal Sale",
              "payload":"DotaNormal",
              "image_url":"https://www.pngwiki.com/images/5/51/1496184257Hugging-Emoji-png-transparent-Icon.png"
            }
            ]
            }
            })
        }
      }
  });


  // Returns a '200 OK' response to all requests
  res.status(200).send('EVENT_RECEIVED');
  } else {
  // Returns a '404 Not Found' if event is not from a page subscription
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

function setupGetStartedButton(res){
        var messageData = {
                "get_started":{"payload":"USER_DEFINED_PAYLOAD"}
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
                   "persistent_menu",
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
