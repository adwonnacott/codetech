/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class InsightsController {
    global Boolean hasAccess {
        get;
        set;
    }
    global String param {
        get;
        set;
    }
    global String uuid {
        get;
        set;
    }
    global InsightsController() {

    }
    @RemoteAction
    global static String DeleteNote(String noteId) {
        return null;
    }
    @RemoteAction
    global static String EditNote(String updateNotesReq) {
        return null;
    }
    @RemoteAction
    global static Boolean canShareRecording(String uuid) {
        return null;
    }
    @RemoteAction
    global static String createNewNote(String notesReq) {
        return null;
    }
    @RemoteAction
    global static List<nbavs.InsightsController.eventTypeResp> getEventTypes() {
        return null;
    }
    @RemoteAction
    global static String getNamespace() {
        return null;
    }
    @RemoteAction
    global static List<nbavs.InsightsController.notesJsonRequest> getNotes(String uuid) {
        return null;
    }
    @RemoteAction
    global static nbavs.InsightsController.url getOrgUrl() {
        return null;
    }
    @RemoteAction
    global static List<nbavs.InsightsController.participantResp> getParticipantInfo(List<nbavs.InsightsController.participantReq> partRequestList) {
        return null;
    }
    @RemoteAction
    global static List<String> getPolarityValues() {
        return null;
    }
    @RemoteAction
    global static nbavs.InsightsController.rating getRatingDetails(String channelUuid) {
        return null;
    }
    @RemoteAction
    global static List<nbavs.InsightsController.sharedTo> getSharedToWho(String uuid) {
        return null;
    }
    @RemoteAction
    global static String getUserName(Decimal userId) {
        return null;
    }
    @RemoteAction
    global static nbavs.InsightsController.rating saveRating(String ratingVar) {
        return null;
    }
global class eventTypeResp {
    global eventTypeResp() {

    }
}
global class notesJsonRequest {
    global notesJsonRequest() {

    }
}
global class participantReq {
    global participantReq() {

    }
}
global class participantResp {
    global participantResp() {

    }
}
global class rating {
    global rating() {

    }
}
global class ratingData {
    global ratingData() {

    }
}
global class sharedTo {
    global sharedTo() {

    }
}
global class url {
    global url() {

    }
}
}
