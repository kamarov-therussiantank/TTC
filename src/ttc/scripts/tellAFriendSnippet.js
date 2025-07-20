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
    <div id="tellAFriendSnippet" class="snippet">
    <a href="https://mail.google.com/" target="_blank" style="text-decoration: none;">
            <div class="header">Tell A Friend</div>
            <div class="content">
            <img src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/main/src/assets/images/snippets/tellAFriend.png" style="position: relative; top: 6px; left: 20px; pointer-events: none;">
            </div>
    </div>
    `);

    var content = $('<div></div>');

 snippet.append(content);
$('#tertiaryContent').append(snippet);

});

