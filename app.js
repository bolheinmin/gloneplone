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

request.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN,
    {"get_started": {"payload": "Hi"},

    "greeting": [
    {
      "locale":"default",
      "text":"Hello {{user_first_name}} \nWelcome to GlonePlone"
    }
    ]
    }).then(function(success){
        console.log('persistent_menu success');
    }).fail(function(error){
        console.log('PM Error:', error);
    })


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
    if(userPostBack == 'Market' || userInput == 'Market' || userInput == 'Marketplace'){
        requestify.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
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
        requestify.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
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
        requestify.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
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
          requestify.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
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
          requestify.post('https://graph.facebook.com/v4.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
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
