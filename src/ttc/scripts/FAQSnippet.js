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
    <div id="FAQSnippet" class="snippet">
    <a href="https://tinyurl.com/ttfaqdoc" target="_blank" style="text-decoration: none;">
            <div class="header" style="font-size: 16px;">Need Help?</div>
            <div style="font-size: 9px;">Check the FAQ</div>
    </a>
    `);

    var content = $('<div></div>');

 snippet.append(content);
$('#tertiaryContent').append(snippet);

});

