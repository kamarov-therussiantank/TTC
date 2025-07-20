//Visits Snippet
function whenContentInitialized() {
    return new Promise(resolve => {
        const check = () => {
            const container = document.querySelector('#tertiaryContent');
            if (container && typeof TankTrouble !== "undefined") {
                resolve();
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}


whenContentInitialized().then(() => {

    var snippet = $(`
    <div id="feedbackSnippet" class="snippet">
            <div class="header">Got Feedback?</div>
            <div class="content">
            Got ideas? Found bugs? Urge to praise us to the skies? Then give us your feedback
            <img src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/main/src/assets/images/snippets/envelope.png" style="height: auto; margin-top: 10px; position: relative; left: 26px; bottom: 3px;">
            </div>
    </div>
    `);

    var content = $('<div></div>');

 snippet.append(content);
$('#tertiaryContent').append(snippet);

$("#feedbackSnippet").mousedown(function(event) {
        if (Users.hasAdminRole(UIConstants.ADMIN_ROLE_WRITE_MESSAGES)) {
            OverlayManager.pushOverlay(
                TankTrouble.AdminMessagesOverlay,
                {adminId: Users.getAdminUserForRole(UIConstants.ADMIN_ROLE_WRITE_MESSAGES)}
            );
        } else {
            OverlayManager.pushOverlay(
                TankTrouble.MessagesOverlay,
                {}
            );
        }
        event.stopPropagation();
    });

});

