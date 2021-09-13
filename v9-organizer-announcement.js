  /***
   *     @author Victor Chimenti, MSCS-SE '20
   *     @file v9-organizer-announcement.js
   *     v9/organizer/announcement
   *
   *     This content type will work in conjunction with the Organizer and each item
   *     will contain one announcement.
   *
   *     Document will write once when the page loads
   *
   *     @version 5.20
   */



   
   try {


    /***
     *      Import T4 Utilities
     */
    importClass(com.terminalfour.publish.utils.BrokerUtils);
    importClass(com.terminalfour.media.utils.ImageInfo);
    importClass(com.terminalfour.media.MediaManager);




    /***
     *      Extract values from T4 element tags
     *      and confirm valid existing content item field
     */
    function getContentValues (tag) {
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
     *      Returns a media stream object
     */
    function readMedia(mediaID) {

        var oMM = com.terminalfour.media.MediaManager.getManager();
        var oMedia = oMM.get(dbStatement, mediaID, language);

        // Convert to InputStream
        var oMediaStream = oMedia.getMedia();

        return oMediaStream;
    }



    
    /***
     *      Returns a media object
     */
    function getMediaInfo(mediaID) {

        var oMM = MediaManager.getManager();
        var oMedia = oMM.get(dbStatement, mediaID, language);

        return oMedia;
    }




    /***
     *      Write the document
     */
    function writeDocument(array) {
        for(var i = 0; i < array.length; i++) {
            document.write(array[i]);
        }
    }

    


    /***
     *      Dictionary of content
     * */
    var contentDict = {
        contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
        articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" display_field="value" />'),
        articleSummary: getContentValues('<t4 type="Scontent" name="Summary" output="normal" display_field="value" />'),
        publishDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        articleImage: getContentValues('<t4 type="content" name="Image" output="normal" formatter="path/*" />'),
        externalLink: getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        externalLinkText: getContentValues('<t4 type="content" name="External Link Text" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" display_field="value" />'),
        audience: getContentValues('<t4 type="content" name="Audience" output="normal" display_field="value" />'),
        topics: getContentValues('<t4 type="content" name="Topic" output="normal" display_field="value" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        contentID: getContentValues('<t4 type="meta" meta="content_id" />')
    };


    

    /***
     *  default html initializations
     * 
     * */
    var beginningHTML = '<div class="newsItemWrapper announcement contentItem card" id="id' + contentDict.contentID.content + '" aria-label="' + contentDict.articleTitle.content + '"><div class="newsItem standardContent">';
    var endingHTML = '</div></div>';
    var openRow = '<div class="row no-gutters">';
    var closeRow = '</div>';
    var titleLink = '<h3 class="card-title">' + contentDict.articleTitle.content + '</h3>';
    var openBodyWrapper = '<div class="col-md-8">';
    var closeBodyWrapper = '</div>';
    var openSummaryWrapper = '<div class="articleSummary card-body">';
    var closeSummaryWrapper = '</div>';
    var openImageWrapper = '<div class="newsImage col-md-4 hidden visually-hidden">';
    var closeImageWrapper = '</div>';
    var imageString = '<img class="hidden visually-hidden" />';
    var summaryString = '<p class="card-text">' + contentDict.articleSummary.content + '</p>';
    var dateString = '<p class="card-text"><em class="publishDate text-muted">' + contentDict.publishDate.content + '</em></p>';
    var externalLinkString = '<span class="externalLink hidden">No Proper Link Provided</span>';
//     <button type="button" class="btn btn-primary" data-bs-toggle="button" autocomplete="off">Toggle button</button>
// <button type="button" class="btn btn-primary" disabled data-bs-toggle="button" autocomplete="off">Disabled toggle button</button>




    /***
     *  check for fulltext content
     * 
     * */
    if (contentDict.articleFullBody.content != "") {
        titleLink = '<h3><a href="' + contentDict.fullTextLink.content + '" title="Read the full post ' + contentDict.articleTitle.content + '">' + contentDict.articleTitle.content + '</a></h3>';
    }




    /***
     *  Parse for external link
     * 
     * */
    if (contentDict.externalLink.content != "" && contentDict.externalLinkText.content != "") {
        externalLinkString = '<span class="externalLink"><a href="' + contentDict.externalLink.content + '" title="' + contentDict.externalLinkText.content + '" target="_blank"><em>' + contentDict.externalLinkText.content + '</em></a></span>';
    }




    /***
     *  Parse for image
     * 
     * */
    if (contentDict.articleImage.content !="") {

        var imageID = content.get('Image').getID();
        var media = readMedia(imageID);
        var info = new ImageInfo;
        info.setInput(media);
        var mediaInfo = getMediaInfo(imageID);

        if (info.check()) {
            var imageHeight = info.getHeight();
            var imageWidth = info.getWidth();
            var imageName = mediaInfo.getName();
            var imageDescription = mediaInfo.getDescription();
            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage card-img" title="' + imageName + '" alt="' + imageDescription + '" width="' + imageWidth + '" height="' + imageHeight + '" loading="auto" />';

        } else {
            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage card-img" title="' + contentDict.contentName.content + '" alt="' + contentDict.contentName.content + '" loading="auto" />';
        }

        openImageWrapper = '<div class="col-md-4">';
    }




    /***
     *  write document once
     * 
     * */
    writeDocument (
        [
            beginningHTML,
            titleLink,
            openRow,
            openImageWrapper,
            imageString,
            closeImageWrapper,
            openBodyWrapper,
            openSummaryWrapper,
            externalLinkString,
            summaryString,
            dateString,
            closeSummaryWrapper,
            closeBodyWrapper,
            closeRow,
            endingHTML
    ]);




} catch (err) {
    document.write(err.message);
}