/***
 *     @author Victor Chimenti, MSCS
 *     @file v9-fulltext.js
 *     v9/fulltext
 *
 *     Document will write once when the page loads
 *
 *     @version 6.9
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
            content:    BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)
                ?       BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag)
                :       null
        }

    } catch (error) {
        return {
            isError: true,
            message: error.message
        }
    }
}

// function validateContent(itemKeys) {

//     itemKeys.forEach(function(key) {
//         console.log(key, dictionary[key]);
//     });
// }

// var keys = Object.keys(dictionary);
// keys.forEach(function(key){
//     console.log(key, dictionary[key]);
// });

// for (let [key, value] of Object.entries(item)) {

// }

// for (const [key, value] of Object.entries(object)) {
//     console.log(key, value);
//   }

// for (const [key, value] of myMap.entries()) {
//     console.log(key, value);
//   }

// Object.keys(obj).forEach(function(key) {
//     console.log(key + " " + obj[key]);
//  });

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

    var keys = Object.keys(contentDict);



    /***
     *  default html initializations
     * 
     * */
    var beginningHTML = '<div class="newsArticleWrapper announcementFullText contentItem card border-0" id="id' + contentDict.contentID.content + '" aria-label="' + contentDict.articleTitle.content + '" data-position-default="ZoneA" data-position-selected="ZoneA"><div class="article standardContent">';
    var endingHTML = '</div></div>';
    var bodyBorder = '<hr class="articleBorderBottom"></div>';
    var openRow = '<div class="row summaryWrapper">';
    var closeRow = '</div>';
    var titleLink = '<div class="card-header border-0"><h1 id="pageTitle">' + contentDict.articleTitle.content + '</h1></div>';
    var openBodyWrapper = '<div class="articleSummary col-12 card-body">';
    var closeBodyWrapper = '</div>';
    var imageString = '<img class="hidden visually-hidden" />';
    var dateString = '<p class="card-text"><em class="publishDate text-muted">' + contentDict.publishDate.content + '</em></p>';
    var linkString = '<span class="externalLink hidden">No Proper Link Provided</span>';
    var openSortFields = '<div class="sortFields hidden visually-hidden">';
    var closeSortFields = '</div>';
    var listOfTags = '<div class="newsroomArticle tags topics hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';
    var prioityString = '<span class="priority hidden visually-hidden">No Priority Entered</span>';
    var audienceList = '<div class="newsroomArticle tags audience hidden visually-hidden"><ul class="categories"><li class="tag">No Topic Provided</li></ul></div>';
    var openPanelLinks = '<ul class="panelLinks">';
    var closePanelLinks = '</ul>';
    var openImageWrapper = '<figure class="figure hidden visually-hidden">';
    var closeImageWrapper = '</figure>';
    var captionString = '<figcaption class="figure-caption hidden visually-hidden">No Caption Provided</figcaption>';
    var photoCreditWrapper = '<span class="imageCredit hidden visually-hidden">No Photo Credit</span>';




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
    if (contentDict.priority.content) {
        prioityString = '<span class="priority">' + contentDict.priority.content + '</span>';
    }




    /***
     *  Parse for image
     * 
     * */
    if (contentDict.articleImage.content) {

        var imageID = content.get('Image').getID();
        var mediaInfo = getMediaInfo(imageID);
        var media = readMedia(imageID);
        var info = new ImageInfo;
        info.setInput(media);

        if (info.check()) {

            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage figure-img card-img-top" title="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />';

        } else {

            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage figure-img card-img-top" alt="' + contentDict.articleTitle.content + '" loading="auto" />';

        }

        if (contentDict.articleCaption.content) {

            captionString = '<figcaption class="figure-caption">' + contentDict.articleCaption.content + '</figcaption>';
        }

        if (contentDict.articlePhotoCredit) {

            photoCreditWrapper = '<span class="imageCredit"><em> - Image Credit: ' + contentDict.articlePhotoCredit.content + '</em></span>';
        }



        openImageWrapper = '<figure class="figure">';
    }




    /***
     *  parse the list of topics tags, add <li> tags
     * 
     * */
    if (contentDict.topics.content) {

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
    if (contentDict.audience.content) {

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
            titleLink,
            openImageWrapper,
            imageString,
            captionString,
            photoCreditWrapper,
            closeImageWrapper,
            openRow,
            openBodyWrapper,
            linkString,
            dateString,
            listOfTags,
            audienceList,
            bodyBorder,
            contentDict.articleFullBody.content,
            bodyBorder,
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