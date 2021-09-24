/***
 *     @author Victor Chimenti, MSCS-SE '20
 *     @file v9-fulltext.js
 *     v9/fulltext
 *
 *     Document will write once when the page loads
 *
 *     @version 5.93
 */

// var beginningHTML = '<div class="newsArticleWrapper announcementFullText contentItem card border-0" id="id' + contentID + '" aria-label="' + articleTitle + '" data-position-default="ZoneA" data-position-selected="ZoneA"><div class="article standardContent">';
// var endingHTML = '</div></div>';






/***
 *      Import T4 Utilities
 */
importClass(com.terminalfour.media.IMediaManager);
importClass(com.terminalfour.spring.ApplicationContextProvider);
importClass(com.terminalfour.publish.utils.BrokerUtils);
importClass(com.terminalfour.media.utils.ImageInfo);




/***
 *      Extract values from T4 element tags
 *      and confirm valid existing content item field
 */
function getContentValues(tag) {
    try {
        return {
            isError: false,
            content: BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)
        }
    } catch (error) {
        return {
            isError: true,
            message: error.message
        }
    }
}




/***
 *      Returns a media object
 */
function getMediaInfo(mediaID) {

    var mediaManager = ApplicationContextProvider.getBean(IMediaManager);
    var media = mediaManager.get(mediaID, language);

    return media;
}




/***
 *      Returns a media stream object
 */
function readMedia(mediaID) {

    var mediaObj = getMediaInfo(mediaID);
    var oMediaStream = mediaObj.getMedia();

    return oMediaStream;
}




/***
 *      Write the document
 */
function writeDocument(array) {
    for (var i = 0; i < array.length; i++) {
        document.write(array[i]);
    }
}




/***
 *      Main
 */
try {


    /***
     *      Dictionary of content
     * */
    var contentDict = {
        contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" display_field="value" />'),
        articleSummary: getContentValues('<t4 type="content" name="Summary" output="normal" modifiers="striptags,htmlentities" />'),
        publishDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        articleAuthor: getContentValues('<t4 type="content" name="Author" output="normal" modifiers="striptags,htmlentities" />'),
        articleImage: getContentValues('<t4 type="content" name="Image" output="normal" formatter="path/*" />'),
        articleCaption: getContentValues('<t4 type="content" name="Caption" output="normal" modifiers="striptags,htmlentities" />'),
        articlePhotoCredit: getContentValues('<t4 type="content" name="Photography By" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" display_field="value" />'),
        audience: getContentValues('<t4 type="content" name="Audience" output="normal" display_field="value" />'),
        topics: getContentValues('<t4 type="content" name="Topic" output="normal" display_field="value" />'),
        priority: getContentValues('<t4 type="content" name="Priority" output="normal" display_field="value" />'),
        layoutFeed: getContentValues('<t4 type="content" name="Feed" output="normal" display_field="value" />'),
        sectionLink: getContentValues('<t4 type="content" name="Section Link 1" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText: getContentValues('<t4 type="content" name="Section Link" output="linktext" modifiers="nav_sections" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        anchorTag: getContentValues('<t4 type="meta" meta="html_anchor" />'),
        contentID: getContentValues('<t4 type="meta" meta="content_id" />')
    };

    //  var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />");



    /***
     *  default html initializations
     * 
     * */
    //  var beginningHTML = '<div class="newsArticleWrapper announcementFullText contentItem card border-0" id="id' + contentID + '" aria-label="' + articleTitle + '" data-position-default="ZoneA" data-position-selected="ZoneA"><div class="article standardContent">';

    var beginningHTML = '<div class="newsArticleWrapper announcementFullText contentItem card border-0" id="id' + contentDict.contentID.content + '" aria-label="' + contentDict.articleTitle.content + '" data-position-default="ZoneA" data-position-selected="ZoneA"><div class="article standardContent">';
    var endingHTML = '</div></div>';

    //  var endingHTML = '<hr class="articleBorderBottom"></div>';
    var openRow = '<div class="row summaryWrapper">';
    var closeRow = '</div>';
    var titleLink = '<div class="card-header border-0"><h1 id="pageTitle">' + contentDict.articleTitle.content + '</h1></div>';

    //  var titleLink = '<h3 class="card-title">' + contentDict.articleTitle.content + '</h3>';
    var openBodyWrapper = '<div class="articleSummary col-12 card-body">';
    var closeBodyWrapper = '</div>';
    var imageString = '<img class="hidden visually-hidden" />';
    var summaryString = '<p class="summary card-text">' + contentDict.articleSummary.content + '</p>';
    var dateString = '<p class="card-text"><em class="publishDate text-muted">' + contentDict.publishDate.content + '</em></p>';
    var linkString = '<span class="externalLink hidden">No Proper Link Provided</span>';
    var openSortFields = '<div class="sortFields hidden visually-hidden">';
    var closeSortFields = '</div>';
    var listOfTags = '<div class="newsroomArticle tags topics hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';
    var prioityString = '<span class="priority hidden visually-hidden">No Priority Entered</span>';
    var audienceList = '<div class="newsroomArticle tags audience hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';
    var openPanelLinks = '<ul class="panelLinks">';
    var closePanelLinks = '</ul>';




    /***
     *  check for fulltext content
     * 
     * */
    if (contentDict.articleFullBody.content != "") {
        titleLink = '<h3 class="card-title"><a href="' + contentDict.fullTextLink.content + '" class="card-link" title="Read the full post ' + contentDict.articleTitle.content + '">' + contentDict.articleTitle.content + '</a></h3>';
    }




    /***
     *  Parse for external link
     * 
     * */
    if (contentDict.sectionLink.content != "") {
        linkString = '<span class="externalLink"><a href="' + contentDict.sectionLink.content + '" class="card-link" title="For more information visit: ' + contentDict.sectionLinkText.content + '" target="_blank"><em>' + contentDict.sectionLinkText.content + '</em></a></span>';
    }




    /***
     *  Parse for Priority
     *  Currently a hidden sort field
     * 
     * */
    if (contentDict.priority.content != "") {
        prioityString = '<span class="priority">' + contentDict.priority.content + '</span>';
    }




    /***
     *  Parse for image
     * 
     * */
    if (contentDict.articleImage.content != "") {

        var imageID = content.get('Image').getID();
        var mediaInfo = getMediaInfo(imageID);
        var media = readMedia(imageID);
        var info = new ImageInfo;
        info.setInput(media);

        if (info.check()) {

            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage card-img-top" title="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />';

        } else {

            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage card-img-top" alt="' + contentDict.articleTitle.content + '" loading="auto" />';

        }

        openImageWrapper = '<span class="newsImage">';
    }




    /***
     *  parse the list of topics tags, add <li> tags
     * 
     * */
    if (contentDict.topics.content != "") {

        let listItems = '';
        let arrayOfTags = contentDict.topics.content.split(',');
        for (let i = 0; i < arrayOfTags.length; i++) {
            listItems += '<li class="tag">' + arrayOfTags[i].trim() + '</li>';
        }

        // Print any tags that were selected
        listOfTags = '<div class="newsroomArticle tags topics"><ul class="categories">' + listItems + '</ul></div><br>';
    }




    /***
     *  parse the list of audience tags, add <li> tags
     * 
     * */
    if (contentDict.audience.content != "") {

        let audienceItems = '';
        let audienceArray = contentDict.audience.content.split(',');
        for (let i = 0; i < audienceArray.length; i++) {
            audienceItems += '<li class="tag">' + audienceArray[i].trim() + '</li>';
        }

        // Print any tags that were selected
        audienceList = '<div class="newsroomArticle tags audience"><ul class="categories">' + audienceItems + '</ul></div>';
    }



    /***
     *  write document once
     * 
     * */
    writeDocument(
        [
            beginningHTML,
            contentDict.anchorTag.content,
            imageString,
            openRow,
            openBodyWrapper,
            titleLink,
            linkString,
            dateString,
            summaryString,
            listOfTags,
            audienceList,
            openSortFields,
            prioityString,
            closeSortFields,
            closeBodyWrapper,
            closeRow,
            endingHTML
        ]);




} catch (err) {
    document.write(err.message);
}






// try {

/***
 *  default declarations
 * 
 * */
//  var contentName = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='normal' modifiers='striptags,htmlentities' />");
//  var articleTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Title' output='normal' display_field='value' />");
//  var articleCaption = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Caption' output='normal' display_field='value' />");
//    var articleAuthor = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Author' output='normal' display_field='value' />");
//  var articlePhotoCredit = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Photography By' output='normal' display_field='value' />");
//  var publishDate = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Publish Date' output='normal' date_format='MMMM d, yyyy' />");
//  var articleImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Image' output='normal' formatter='path/*' />");
//    var articleImageAlt = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='media' name='Image' attribute='description' />");
//  var externalLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link' output='normal' modifiers='striptags,htmlentities' />");
//  var externalLinkText = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='External Link Text' output='normal' modifiers='striptags,htmlentities' />");
//  var articleFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Article Body' output='normal' display_field='value' />");
//  var contentID = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='content_id' />");
//  var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />");




/***
 *  default initializations
 * 
 * */
//  var beginningHTML = '<div class="newsArticleWrapper announcementFullText contentItem card border-0" id="id' + contentID + '" aria-label="' + articleTitle + '" data-position-default="ZoneA" data-position-selected="ZoneA"><div class="article standardContent">';
//  var endingHTML = '</div></div>';
//  var titleLink = '<div class="card-header border-0"><h1 id="pageTitle">' + articleTitle + '</h1></div>';
//  var openBodyWrapper = '<div class="articleBody card-body border-0">';
//  var closeBodyWrapper = '</div>';
//  var openImageWrapper = '<div class="imageWrapper hidden visually-hidden">';
//  var closeImageWrapper = '</div>';
//  var openPublishWrapper = '<div class="publishDetails">';
//  var closePublishWrapper = '</div>';
//  var articleCaptionString = '<h2 class="card-title hidden visually-hidden">No Caption Provided</h2>';
//  //    var articleAuthorString = '<p class="card-text articleAuthor credits hidden visually-hidden">No Author Provided</p>';
//  var articlePhotoCreditString = '<p class="card-text articlePhotoCredit credits hidden visually-hidden">No Photographer Provided</p>';
//  var imageString = '<img class="hidden visually-hidden" />';
//  var dateString = '<p class="publishDate card-text"><small>' + publishDate + '</small></p>';
//  var externalLinkString = '<p class="externalLink hidden">No Proper Link Provided</p>';




/***
 *  Parse for external link
 * 
 * */
//  if (externalLink != "" && externalLinkText != "") {
//      externalLinkString = '<p class="externalLink card-text"><a href="' + externalLink + '" title="' + externalLinkText + '" target="_blank" class="card-link"><em>' + externalLinkText + '</em></a></p>';
//  }


//  /***
//   *  Parse for image
//   * 
//   * */
//  if (articleImage != "") {
//      openImageWrapper = '<div class="imageWrapper">';
//      imageString = '<img src="' + articleImage + '" class="articleImage card-img" alt="' + contentName + '" />';
//  }




/***
 *  Parse for caption
 * 
 * */
//  if (articleCaption != "") {
//      articleCaptionString = '<h2 class="card-title articleCaption">' + articleCaption + '</h2>';
//  }




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
//  if (articlePhotoCredit != "") {
//      articlePhotoCreditString = '<p class="card-text articlePhotoCredit credits">Photography by ' + articlePhotoCredit + '</p>';
//  }




/***
 *  write document once
 * 
 * */
//  document.write(beginningHTML);
//  document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorTag));
//  document.write(titleLink);
//  document.write(openImageWrapper);
//  document.write(imageString);
//  document.write(closeImageWrapper);
//  document.write(openBodyWrapper);
//  document.write(articleCaptionString);
//  //    document.write(articleAuthorString);
//  document.write(articlePhotoCreditString);
//  document.write(openPublishWrapper);
//  document.write(externalLinkString);
//  document.write(dateString);
//  document.write(closePublishWrapper);
//  document.write(articleFullBody);
//  document.write(closeBodyWrapper);
//  document.write(endingHTML);




// } catch (err) {
//     document.write(err.message);
// }