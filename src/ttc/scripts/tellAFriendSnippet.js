// Tell A Friend snippet
// Enables users to tell a friend about Tank Trouble via email
whenContentInitialized().then(() => {

    var snippet = $(`
    <div id="tellAFriendSnippet" class="snippet">
    <a href="https://mail.google.com/" target="_blank" style="text-decoration: none;">
            <div class="header">Tell A Friend</div>
            <div class="content">
            <img src="https://raw.githubusercontent.com/kamarov-therussiantank/TTC/main/src/assets/images/snippets/tellAFriend.png" style="position: relative; top: 5px; left: 15px; pointer-events: none;">
            </div>
    </div>
    `);

    var content = $('<div></div>');

 snippet.append(content);
$('#tertiaryContent').append(snippet);

});

