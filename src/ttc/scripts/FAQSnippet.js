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
            <div class="header">Need Help?</div>
            Check the FAQ
    </div>
    `);

    var content = $('<div></div>');

 snippet.append(content);
$('#tertiaryContent').append(snippet);

});

