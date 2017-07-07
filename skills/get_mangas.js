/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

const xray = require('x-ray');
var x = new xray();
var Promise = require("promise");
module.exports = function(controller) {

    controller.hears(['^new manga','^new'], 'direct_message,direct_mention', function(bot, message) {
      var results = getListofNewMangas();
      
      results.then(function(data){
        var attachments = [];
        var fields = [];
        for (var i in data){
            fields.push({
            title: data[i].title,  
            value: data[i].date + " - <" +  data[i].link + "|" + data[i].subject + " " +  data[i].chapter +">",          
            short:false
          });
        }
        
        var attachment ={
          fields:fields,
          'text': 'Here is what I found for you',
           'color': '#3879cc',
          "footer": "MangaStream API",
          "footer_icon": "http://mangastream.com/favicon.ico"
          
        }
        attachments.push(attachment);
        var reply_with_attachments = {
          
          'attachments': attachments,
           
        }
     
         bot.reply (message, reply_with_attachments);
      });     
       
    });

      
  function getListofNewMangas() {
    return new Promise(function (resolve, reject) {
        x('https://mangastream.com', 'div.col-sm-8 ul.new-list li.active', [{
          title: 'a@html',
          link: 'a@href',
          date: 'span',
          subject: 'em',
          chapter: 'strong'
        }])(function(err, data) {
          if (err) reject(err);
                   var results;
          for (var i in data) {
            var newTitle = data[i].title.split('</i> ')[1].split(' <strong>')[0];
            data[i].title = newTitle;
          }
          resolve(data);
 
        })
    })
  }
};