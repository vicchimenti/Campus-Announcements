  /***
   *     @author Victor Chimenti, MSCS
   *     @file v9-organizer-announcementZoneb.js
   *     v9/organizer/announcementZoneb
   *     id:5580
   *
   *     This content type will work in conjunction with the Organizer and each item
   *     will contain one announcement summary in zoneB.
   *
   *     Document will write once when the page loads
   *
   *     @version 7.15
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
        var _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)
        return {
            isError: false,
            content: _tag == '' ? null : _tag
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
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" display_field="value" />'),
        audience: getContentValues('<t4 type="content" name="Audience" output="normal" display_field="value" />'),
        topics: getContentValues('<t4 type="content" name="Topic" output="normal" display_field="value" />'),
        priority: getContentValues('<t4 type="content" name="Priority" output="normal" display_field="value" />'),
        sectionLink: getContentValues('<t4 type="content" name="Section Link" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText: getContentValues('<t4 type="content" name="Section Link 1" output="linktext" modifiers="nav_sections" />'),
        lastModified: getContentValues('<t4 type="meta" meta="last_modified" format="MM/dd/yyyy HH:mm:ss z" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        contentID: getContentValues('<t4 type="meta" meta="content_id" />')
    };



    
    /***
     *  default html initializations
     * 
     * */
    var lastModifiedString = '<p class="card-text lastModified"><em class="text-muted">Updated: ' + contentDict.lastModified.content + '</em></p>';
    var titleLink = '<h4 class="card-title">' + contentDict.articleTitle.content + '</h4>';
    var summaryString = '<p class="summary card-text">' + contentDict.articleSummary.content + '</p>';
    var beginningHTML = '<article class="suTodayWrapper newsItemWrapper announcementZoneb contentItem card border-0" id="sutoday' + contentDict.contentID.content + 'zoneb" aria-label="Recent Updates: ' + contentDict.articleTitle.content + '">';
    var endingHTML = '<hr class="articleBorderBottom"></article>';
    var openRow = '<div class="row summaryWrapper">';
    var closeRow = '</div>';
    var openBodyWrapper = '<div class="articleSummary col-12 card-body border-0">';
    var closeBodyWrapper = '</div>';
    // var dateString = '<p class="card-text"><em class="publishDate text-muted">' + contentDict.publishDate.content + '</em></p>';
    var linkString = '<span class="externalLink hidden">No Proper Link Provided</span>';
    // var openSortFields = '<div class="sortFields hidden visually-hidden">';
    // var closeSortFields = '</div>';
    // var listOfTags = '<div class="newsroomArticle tags topics hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';
    // var prioityString = '<span class="priority hidden visually-hidden">No Priority Entered</span>';
    // var audienceList = '<div class="newsroomArticle tags audience hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';

    // openSortFields,
    // summaryString,
    // listOfTags,
    // audienceList,
    // prioityString,
    // closeSortFields,


    /***
     *  check for fulltext content
     * 
     * */
    if (contentDict.articleFullBody.content) {
        titleLink = '<h4 class="card-title"><a href="' + contentDict.fullTextLink.content + '" class="card-link" title="Read the full post ' + contentDict.articleTitle.content + '">' + contentDict.articleTitle.content + '</a></h4>';
    }




    /***
     *  Parse for external link
     * 
     * */
    if (contentDict.sectionLink.content) {
        linkString = '<span class="externalLink"><a href="' + contentDict.sectionLink.content + '" class="card-link" title="For more information visit: ' + contentDict.sectionLinkText.content + '" target="_blank"><em>' + contentDict.sectionLinkText.content + '</em></a></span>';
    }




    /***
     *  Parse for Priority
     *  Currently a hidden sort field
     * 
     * */
    // if (contentDict.priority.content != "") {
    //     prioityString = '<span class="priority">' + contentDict.priority.content + '</span>';
    // }




    /***
     *  parse the list of topics tags, add <li> tags
     * 
     * */
    // if (contentDict.topics.content != "") {

    //     let listItems = '';
    //     let arrayOfTags = contentDict.topics.content.split(',');
    //     for (let i = 0; i < arrayOfTags.length; i++) {
    //         listItems += '<li class="tag">' + arrayOfTags[i].trim() + '</li>';
    //     }

    //     listOfTags = '<div class="newsroomArticle tags topics"><ul class="categories">' + listItems + '</ul></div><br>';
    // }




    /***
     *  parse the list of audience tags, add <li> tags
     * 
     * */
    // if (contentDict.audience.content != "") {

    //     let audienceItems = '';
    //     let audienceArray = contentDict.audience.content.split(',');
    //     for (let i = 0; i < audienceArray.length; i++) {
    //         audienceItems += '<li class="tag">' + audienceArray[i].trim() + '</li>';
    //     }

    //     audienceList = '<div class="newsroomArticle tags audience"><ul class="categories">' + audienceItems + '</ul></div>';
    // }



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
            linkString,
            lastModifiedString,
            closeBodyWrapper,
            closeRow,
            endingHTML
        ]
    );




} catch (err) {
    document.write(err.message);
}