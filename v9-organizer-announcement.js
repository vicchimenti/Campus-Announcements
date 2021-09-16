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
   *     @version 6.6
   */



   
   try {


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
        articleSummary: getContentValues('<t4 type="content" name="Summary" output="normal" modifiers="striptags,htmlentities" />'),
        publishDate: getContentValues('<t4 type="content" name="Publish Date" output="normal" date_format="MMMM d, yyyy" />'),
        articleImage: getContentValues('<t4 type="content" name="Image" output="normal" formatter="path/*" />'),
        externalLink: getContentValues('<t4 type="content" name="External Link" output="normal" modifiers="striptags,htmlentities" />'),
        externalLinkText: getContentValues('<t4 type="content" name="External Link Text" output="normal" modifiers="striptags,htmlentities" />'),
        articleFullBody: getContentValues('<t4 type="content" name="Article Body" output="normal" display_field="value" />'),
        audience: getContentValues('<t4 type="content" name="Audience" output="normal" display_field="value" />'),
        topics: getContentValues('<t4 type="content" name="Topic" output="normal" display_field="value" />'),
        priority: getContentValues('<t4 type="content" name="Priority" output="normal" display_field="value" />'),
        layoutFeed: getContentValues('<t4 type="content" name="Feed" output="normal" display_field="value" />'),
        sectionLink1: getContentValues('<t4 type="content" name="Section Link 1" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText1: getContentValues('<t4 type="content" name="Section Link 1" output="linktext" modifiers="nav_sections" />'),
        sectionLink2: getContentValues('<t4 type="content" name="Section Link 2" output="linkurl" modifiers="nav_sections" />'),
        sectionLinkText2: getContentValues('<t4 type="content" name="Section Link 2" output="linktext" modifiers="nav_sections" />'),
        fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
        contentID: getContentValues('<t4 type="meta" meta="content_id" />')
    };


    

    /***
     *  default html initializations
     * 
     * */
    var beginningHTML = '<div class="newsItemWrapper announcement contentItem card" id="id' + contentDict.contentID.content + '" aria-label="' + contentDict.articleTitle.content + '"><div class="newsItem standardContent">';
    var endingHTML = '</div><hr class="articleBorderBottom"></div>';
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
    var openSortFields = '<div class="sortFields hidden visually-hidden">';
    var closeSortFields = '</div>';
    var prioityString = '<span class="priority hidden visually-hidden">No Priority Entered</span>';
    var audienceString = '<span class="audience hidden visually-hidden">No Audience Entered</span>';
    var buttonString1 = '<span class="sectionButton hidden visually-hidden">No link created</span>';
    var buttonString2 = '<span class="sectionButton hidden visually-hidden">No link created</span>';
    var openPanelLinks = '<ul class="panelLinks">';
    var closePanelLinks = '</ul>';




    /***
     *  check for fulltext content
     * 
     * */
    if (contentDict.articleFullBody.content != "") {
        titleLink = '<h3><a href="' + contentDict.fullTextLink.content + '" class="card-link" title="Read the full post ' + contentDict.articleTitle.content + '">' + contentDict.articleTitle.content + '</a></h3>';
    }




    /***
     *  Parse for external link
     * 
     * */
    if (contentDict.externalLink.content != "" && contentDict.externalLinkText.content != "") {
        externalLinkString = '<span class="externalLink"><a href="' + contentDict.externalLink.content + '" class="card-link" title="For more information visit: ' + contentDict.articleTitle.content + '" target="_blank"><em>' + contentDict.externalLinkText.content + '</em></a></span>';
    }




    /***
     *  Parse for Section Link 1
     * 
     * */
    if (contentDict.sectionLink1.content != "" && contentDict.sectionLinkText1.content != "") {
        buttonString1 = '<li><a href="' + contentDict.sectionLink1.content + '" class="btn card-link" target="_blank" type="button" data-bs-toggle="button" autocomplete="off">' + contentDict.sectionLinkText1.content + '</a></li>';
    }




    /***
     *  Parse for Section Link 2
     * 
     * */
    if (contentDict.sectionLink2.content != "" && contentDict.sectionLinkText2.content != "") {
        buttonString2 = '<li><a href="' + contentDict.sectionLink2.content + '" class="btn card-link" target="_blank" type="button" data-bs-toggle="button" autocomplete="off">' + contentDict.sectionLinkText2.content + '</a></li>';
    }
    

//     <ul class="panelLinks">
//     <t4 type="content" name="Button text" output="selective-output" modifiers="" process-format="true" format="<li><a href=&quot;<t4 type='content' name='Button link' output='linkurl' modifiers='nav_sections' format='$value' />&quot;>$value</a></li>"/>
//     <t4 type="content" name="Button 2 text" output="selective-output" modifiers="" process-format="true" format="<li><a href=&quot;<t4 type='content' name='Button 2 link' output='linkurl' modifiers='nav_sections' format='$value' />&quot;>$value</a></li>"/>
//   </ul>


    /***
     *  Parse for Priority
     *  Currently a hidden sort field
     * 
     * */
    if (contentDict.priority.content != "") {
        prioityString = '<span class="priority">' + contentDict.priority.content + '</span>';
    }




    /***
     *  Parse for Audience
     *  Currently a hidden sort field
     * 
     * */
    if (contentDict.audience.content != "") {
        audienceString = '<span class="audience">' + contentDict.audience.content + '</span>';
    }




    /***
     *  Parse for image
     * 
     * */
    if (contentDict.articleImage.content !="") {

        var imageID = content.get('Image').getID();
        var mediaInfo = getMediaInfo(imageID);
        var media = readMedia(imageID);
        var info = new ImageInfo;
        info.setInput(media);

        if (info.check()) {

            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage card-img" title="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />';

        } else {

            imageString = '<img src="' + contentDict.articleImage.content + '" class="articleImage card-img" alt="' + contentDict.articleTitle.content + '" loading="auto" />';

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
            openPanelLinks,
            buttonString1,
            buttonString2,
            closePanelLinks,
            closeSummaryWrapper,
            openSortFields,
            prioityString,
            audienceString,
            closeSortFields,
            closeBodyWrapper,
            closeRow,
            endingHTML
    ]);




} catch (err) {
    document.write(err.message);
}