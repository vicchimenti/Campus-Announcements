/***
*     @author Victor Chimenti, MSCS-SE '20
*     @file v9-fulltext.js
*     v9/fulltext
*
*     Document will write once when the page loads
*
*     @version 5.92
*/




try {

   /***
    *  default declarations
    * 
    * */
   var contentName = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='normal' modifiers='striptags,htmlentities' />");
   var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
   var articleCaption = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Caption' output='normal' display_field='value' />");
//    var articleAuthor = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Author' output='normal' display_field='value' />");
   var articlePhotoCredit = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Photography By' output='normal' display_field='value' />");
   var publishDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
   var articleImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Image' output='normal' formatter='path/*' />");
//    var articleImageAlt = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='media' name='Image' attribute='description' />");
   var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' modifiers='striptags,htmlentities' />");
   var externalLinkText = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link Text' output='normal' modifiers='striptags,htmlentities' />");
   var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
   var contentID = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='content_id' />");
   var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />");




   /***
    *  default initializations
    * 
    * */
   var beginningHTML = '<div class="newsArticleWrapper contentItem card border-0" id="id' + contentID + '" aria-label="' + articleTitle + '" data-position-default="ZoneA" data-position-selected="ZoneA"><div class="article standardContent">';
   var endingHTML = '</div></div>';
   var titleLink = '<div class="card-header border-0"><h1 id="pageTitle">' + articleTitle + '</h1></div>';
   var openBodyWrapper = '<div class="articleBody card-body border-0">';
   var closeBodyWrapper = '</div>';
   var openImageWrapper = '<div class="imageWrapper hidden visually-hidden">';
   var closeImageWrapper = '</div>';
   var openPublishWrapper = '<div class="publishDetails">';
   var closePublishWrapper = '</div>';
   var articleCaptionString = '<h2 class="card-title hidden visually-hidden">No Caption Provided</h2>';
//    var articleAuthorString = '<p class="card-text articleAuthor credits hidden visually-hidden">No Author Provided</p>';
   var articlePhotoCreditString = '<p class="card-text articlePhotoCredit credits hidden visually-hidden">No Photographer Provided</p>';
   var imageString = '<img class="hidden visually-hidden" />';
   var dateString = '<p class="publishDate card-text"><small>' + publishDate + '</small></p>';
   var externalLinkString = '<p class="externalLink hidden">No Proper Link Provided</p>';




   /***
    *  Parse for external link
    * 
    * */
   if (externalLink != "" && externalLinkText != "") {
       externalLinkString = '<p class="externalLink card-text"><a href="' + externalLink + '" title="' + externalLinkText + '" target="_blank" class="card-link"><em>' + externalLinkText + '</em></a></p>';
   }


   /***
    *  Parse for image
    * 
    * */
   if (articleImage != "") {
       openImageWrapper = '<div class="imageWrapper">';
       imageString = '<img src="' + articleImage + '" class="articleImage card-img" alt="' + contentName + '" />';
   }




   /***
    *  Parse for caption
    * 
    * */
   if (articleCaption != "") {
       articleCaptionString = '<h2 class="card-title articleCaption">' + articleCaption + '</h2>';
   }




   /***
    *  Parse for author
    * 
    * */
//    if (articleAuthor != "") {
//        articleAuthorString = '<p class="card-text articleAuthor credits">By ' + articleAuthor + '</p>';
//    }




   /***
    *  Parse for photo credit
    * 
    * */
   if (articlePhotoCredit != "") {
       articlePhotoCreditString = '<p class="card-text articlePhotoCredit credits">Photography by ' + articlePhotoCredit + '</p>';
   }




   /***
    *  write document once
    * 
    * */
   document.write(beginningHTML);
   document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));
   document.write(titleLink);
   document.write(openImageWrapper);
   document.write(imageString);
   document.write(closeImageWrapper);
   document.write(openBodyWrapper);
   document.write(articleCaptionString);
//    document.write(articleAuthorString);
   document.write(articlePhotoCreditString);
   document.write(openPublishWrapper);
   document.write(externalLinkString);
   document.write(dateString);
   document.write(closePublishWrapper);
   document.write(articleFullBody);
   document.write(closeBodyWrapper);
   document.write(endingHTML);




} catch (err) {
   document.write(err.message);
}