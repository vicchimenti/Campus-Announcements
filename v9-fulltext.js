/***
 *     @author Victor Chimenti, MSCS
 *     @file v9-fulltext.js
 *     @see v9/fulltext Campus Announcement
 *              ID: 5580
 *
 *     Document will write client side once when the page loads
 *
 *     @version 6.40
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
 *      Returns an array of list items
 */
 function assignList(arrayOfValues) {

    let listValues = '';

    for (let i = 0; i < arrayOfValues.length; i++) {

        listValues += '<li class="tag">' + arrayOfValues[i].trim() + '</li>';
    }

    return listValues;
}




/***
 *      Write the document
 */
function writeDocument(array) {

    for (let i = 0; i < array.length; i++) {

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
        publishDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        articleAuthor: getContentValues('<t4 type="content" name="Author" output="normal" modifiers="striptags,htmlentities" />'),
        articleImage: getContentValues('<t4 type="content" name="Image" output="normal" formatter="path/*" />'),
        articleCaption: getContentValues('<t4 type="content" name="Caption" output="normal" modifiers="striptags,htmlentities" />'),
        articlePhotoCredit: getContentValues('<t4 type="content" name="Photography By" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" display_field="value" />'),
        audience: getContentValues('<t4 type="content" name="Audience" output="normal" display_field="value" />'),
        topics: getContentValues('<t4 type="content" name="Topic" output="normal" display_field="value" />'),
        priority: getContentValues('<t4 type="content" name="Priority" output="normal" display_field="value" />'),
        sectionLink: getContentValues('<t4 type="content" name="Section Link 1" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText: getContentValues('<t4 type="content" name="Section Link" output="linktext" modifiers="nav_sections" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        anchorTag: getContentValues('<t4 type="meta" meta="html_anchor" />'),
        contentID: getContentValues('<t4 type="meta" meta="content_id" />')
    };




    /***
     *  default html initializations
     *  including required content fields for fulltext
     * 
     * */
    var bodyString = '<div class="fullTextBody">' + contentDict.articleFullBody.content + '</div>';
    var dateString = '<p class="card-text publishDate"><em class="text-muted">Posted: ' + contentDict.publishDate.content + '</em></p>';
    var titleHeader = '<div class="card-header border-0"><h1 id="pageTitle">' + contentDict.articleTitle.content + '</h1></div>';
    var beginningHTML = '<div class="suTodayWrapper newsArticleWrapper announcementFullText contentItem card border-0" id="sutoday' + contentDict.contentID.content + 'fulltext" aria-labelledby="pageTitle" data-position-default="ZoneA" data-position-selected="ZoneA"><div class="article standardContent">';
    var endingHTML = '</div></div>';
    var bodyBorder = '<hr class="articleBorderBottom">';
    var openRow = '<div class="row summaryWrapper">';
    var closeRow = '</div>';
    var openBodyWrapper = '<div class="articleSummary col-12 card-body border-0">';
    var closeBodyWrapper = '</div>';
    var imageString = '<img class="hidden visually-hidden" />';
    var openSortFields = '<div class="sortFields hidden visually-hidden">';
    var closeSortFields = '</div>';
    var topicList = '<div class="newsroomArticle tags topics hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';
    var audienceList = '<div class="newsroomArticle tags audience hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';
    var openImageWrapper = '<figure class="figure hidden visually-hidden">';
    var closeImageWrapper = '</figure>';
    var openPublishDetails = '<div class="publishDetails">';
    var closePublishDetails = '</div>';
    var openFooter = '<div class="card-footer border-0 bg-transparent">';
    var closeFooter = '</div>';







    /***
     *  Parse for external link
     * 
     * */
    var linkString =    (contentDict.sectionLink.content)
                        ? '<p class="card-text externalLink"><a href="' + contentDict.sectionLink.content + '" class="card-link" title="For more information visit: ' + contentDict.sectionLinkText.content + '" target="_blank"><em>' + contentDict.sectionLinkText.content + '</em></a></p>'
                        : '<p class="card-text externalLink hidden visually-hidden">No Proper Link Provided</p>';




    /***
     *  Parse for author
     * 
     * */
    var byLine =        (contentDict.articleAuthor.content)
                        ? '<p class="card-text author"><strong>By: ' + contentDict.articleAuthor.content + '</strong></p>'
                        : '<p class="card-text hidden visually-hidden"><strong class="author">No Author entered</strong></p>';
    



    /***
     *  Parse for Priority
     * 
     * */
    var prioityString = (contentDict.priority.content)
                        ? '<span class="priority hidden visually-hidden">' + contentDict.priority.content + '</span>'
                        : '<span class="priority hidden visually-hidden">No Priority Entered</span>';




    /***
     *  Parse for image
     * 
     * */
    if (contentDict.articleImage.content) {

        openImageWrapper = '<figure class="figure">';
        var imageID = content.get('Image').getID();
        var mediaInfo = getMediaInfo(imageID);
        var media = readMedia(imageID);
        var info = new ImageInfo;
        info.setInput(media);

        imageString =               (info.check())
                                    ? '<img src="' + contentDict.articleImage.content + '" class="articleImage figure-img card-img-top" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />'
                                    : '<img src="' + contentDict.articleImage.content + '" class="articleImage figure-img card-img-top" alt="' + contentDict.articleTitle.content + '" loading="auto" />';

        
        var captionString =         (contentDict.articleCaption.content)
                                    ? '<figcaption class="figure-caption">' + contentDict.articleCaption.content + '</figcaption>'
                                    : '<figcaption class="figure-caption hidden visually-hidden">No Caption Provided</figcaption>';

        
        var photoCreditWrapper =    (contentDict.articlePhotoCredit.content)
                                    ? '<span class="imageCredit"><em> - Image Credit: ' + contentDict.articlePhotoCredit.content + '</em></span>'
                                    : '<span class="imageCredit hidden visually-hidden">No Photo Credit</span>';
    }
    



    /***
     *  parse the list of topics tags, add <li> tags
     * 
     * */
    if (contentDict.topics.content) {

        let arrayOfTags = contentDict.topics.content.split(',');
        let listItems = assignList(arrayOfTags);

        // Print any tags that were selected
        topicList = '<div class="newsroomArticle tags topics"><ul class="categories">' + listItems + '</ul></div><br>';
    }




    /***
     *  parse the list of audience tags, add <li> tags
     * 
     * */
    if (contentDict.audience.content) {

        let audienceArray = contentDict.audience.content.split(',');
        let audienceItems = assignList(audienceArray);

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
            titleHeader,
            openImageWrapper,
            imageString,
            captionString,
            photoCreditWrapper,
            closeImageWrapper,
            openRow,
            openBodyWrapper,
            openPublishDetails,
            linkString,
            dateString,
            byLine,
            closePublishDetails,
            bodyBorder,
            bodyString,
            openSortFields,
            prioityString,
            closeSortFields,
            closeBodyWrapper,
            openFooter,
            topicList,
            audienceList,
            closeFooter,
            bodyBorder,
            closeRow,
            endingHTML
        ]);




} catch (err) {
    document.write(err.message);
}