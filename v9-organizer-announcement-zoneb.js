  /***
   *     @author Victor Chimenti, MSCS-SE '20
   *     @file v9-organizer-announcementZoneb.js
   *     v9/organizer/announcementZoneb
   *     id:5580
   *
   *     This content type will work in conjunction with the Organizer and each item
   *     will contain one announcement summary in zoneB.
   *
   *     Document will write once when the page loads
   *
   *     @version 7.0
   */




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
        publishDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy HH:mm:ss" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" display_field="value" />'),
        audience: getContentValues('<t4 type="content" name="Audience" output="normal" display_field="value" />'),
        topics: getContentValues('<t4 type="content" name="Topic" output="normal" display_field="value" />'),
        priority: getContentValues('<t4 type="content" name="Priority" output="normal" display_field="value" />'),
        layoutFeed: getContentValues('<t4 type="content" name="Feed" output="normal" display_field="value" />'),
        sectionLink: getContentValues('<t4 type="content" name="Section Link 1" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText: getContentValues('<t4 type="content" name="Section Link 1" output="linktext" modifiers="nav_sections" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        contentID: getContentValues('<t4 type="meta" meta="content_id" />')
    };




    /***
     *  default html initializations
     * 
     * */
    var beginningHTML = '<div class="newsItemWrapper announcement contentItem card" id="id' + contentDict.contentID.content + '" aria-label="Sidebar Content: ' + contentDict.articleTitle.content + '"><div class="newsItem standardContent">';
    var endingHTML = '</div><hr class="articleBorderBottom"></div>';
    var openRow = '<div class="row no-gutters">';
    var closeRow = '</div>';
    var titleLink = '<h3 class="card-title">' + contentDict.articleTitle.content + '</h3>';
    var openBodyWrapper = '<div class="col-md-9">';
    var closeBodyWrapper = '</div>';
    var openSummaryWrapper = '<div class="articleSummary card-body">';
    var closeSummaryWrapper = '</div>';
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
            titleLink,
            openRow,
            openBodyWrapper,
            openSummaryWrapper,
            linkString,
            dateString,
            summaryString,
            closeSummaryWrapper,
            openSortFields,
            listOfTags,
            audienceList,
            prioityString,
            closeSortFields,
            closeBodyWrapper,
            closeRow,
            endingHTML
        ]);




} catch (err) {
    document.write(err.message);
}