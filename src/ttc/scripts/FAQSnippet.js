// FAQ Snippet
whenContentInitialized().then(() => {
    var snippet = $(`
    <div id="FAQSnippet" class="snippet">
    <a style="text-decoration: none;">
            <div class="header" style="font-size: 16px;">Need Help?</div>
            <div style="font-size: 9px;">Check the F.A.Q</div>
    </a>
    `);
    var content = $('<div></div>');
 snippet.append(content);
$('#tertiaryContent').append(snippet);
$("#FAQSnippet").mousedown(function(event) {
        if (Users.hasAdminRole(UIConstants.ADMIN_ROLE_WRITE_MESSAGES)) {
            OverlayManager.pushOverlay(
                TankTrouble.faqOverlay,
                {adminId: Users.getAdminUserForRole(UIConstants.ADMIN_ROLE_WRITE_MESSAGES)}
            );
        } else {
            OverlayManager.pushOverlay(
                TankTrouble.faqOverlay,
                {}
            );
        }
        event.stopPropagation();
    });
});
var TankTrouble = TankTrouble || {};
TankTrouble.faqOverlay = {
    wrapper: null,
    initialized: false,

    _initialize: function () {
        if (this.initialized) {
            return;
        }
        this.wrapper = $("<div class='faq centre'/>");
        this.wrapper.append("<div id='faq-header'>F.A.Q</div>");
        var content = $("<div id='faq-content'/>").append(
            "<div class='question'>What happened to the Classic TankTrouble?</div>",
            $("<div class='answer'/>").append(
                "TankTrouble Classic, unfortunately, shut down in December 2020 as a result of the Adobe Flash End of Life.  " +
                "The classic site remains, however, though in a more stripped-down version. Find it at ",
                $("<a/>", {
                    href: "https://classic.tanktrouble.com",
                    target: "_blank",
                    text: "classic.tanktrouble.com"
                })
            ),
            "<br>",
            "<div class='question'>Where can I see enforced rules for TankTrouble?</div>",
            $("<div class='answer'/>").append(
                "Enforced rules can be found in the official ",
                $("<a/>", {
                    href: "https://docs.google.com/document/d/1xu7XeKKbfo1XLyIAYHs04GkqCZBLOeldp8raFX6Uy1Q/edit?fbclid=IwAR3TaDIgTncLmpMa_XKwawbuXDXCxmPnOwiVhx9ZFS42F3KuAgyITswvRdw&tab=t.0",
                    target: "_blank",
                    text: "TankTrouble Documentation"
                })
            ),
            "<br>",
            "<div class='question'>TankTrouble is blocked at my school!</div>",
            $("<div class='answer'/>").append(
                "Unfortunately, not all webmasters share our deep passion for online destruction and decide to block the game instead. Sadly there really isn't much we can do about that. " +
                "We suggest you start a riot, take some prisoners and demand TankTrouble unleashed! While waiting for that to pay off, you could google the web for other sites that host TankTrouble."
                
            ),
            "<br>",
            "<div class='question'>Why am I lagging?!</div>",
            $("<div class='answer'/>").append(
                "Lagging can be caused by a variety of factors, including your internet connection, server performance, and your device's capabilities. " +
                "We recommend checking your connection speed, closing any unnecessary applications, and ensuring your device meets the game's requirements." +
                "Or you are simply being controlled by Red Penguin. That could be it too, we are not joking!" +
                "<br>",
                "<br>",
                "Dr. Dimitri has prepared an useful guide to laggy situations, which you can find ",
                $("<a/>", {
                    href: "https://tanktrouble.com/news?postId=3",
                    target: "_blank",
                    text: "here"
                }), "!",
                "<br>",
                "<br>",
                "But if you are being controlled by Red Penguin, there is nothing we can do about it. Sorry!"
            ),
            "<br>",
            "<div class='question'>Where do I get the cool swag for my tank?</div>",
            $("<div class='answer'/>").append(
                "There are many ways to get dope accessories and paints!<br>" +
                "Here are some ways!<br>" +
                "1. Open Dimitrium’s Emporium and go on a shopping spree!<br>" +
                "2. Grind and earn achievements. You’ll get either a new accessory or currency to spend in the emporium.<br>" +
                "3. Log-in on special events. Halloween and Christmas offer exclusive paints and accessories. Do mind that some come with a price. <br>" +
                "‎ ‎ ‎ ‎ You can also purchase limited-edition swag on other holidays or festivities.<br>" +
                "4. Play/participate in sponsored events.<br>" +
                "5. Purchase boxes for real currency in the SHOP tab."
            ),
            "<br>",
            "<div class='question'>What is a crisis? What does it do, and when does it happen?</div>",
            $("<div class='answer'/>").append(
                "A crisis is an event that happens when something goes wrong in our laboratory, which happens very rarely, and only for a short amount of time. We have a team to handle these situations. " +
                "Whenever a crisis is in present, hazmat suits will be handed out to all tankers, just to make sure that everyone is safe until our team handles the situation."
            ),
            "<br>",
            "<div class='question'>What’s the scrapyard?</div>",
            $("<div class='answer'/>").append(
                "The scrapyard is a count of all tanks destroyed globally since the beginning of TankTrouble. It updates instantly when a tank is destroyed."
            ),
            "<br>",
            "<div class='question'>Who are Moderators, what is their functionality and how can I become one?</div>",
            $("<div class='answer'/>").append(
                "Moderators are the unpaid interns players who enforce the rules. " +
                "They have the task of moderating the forums, reported chat messages, usernames and much more. " +
                "Be active on the forums, follow the rules and be kind! Also, don’t ask to become a moderator; if we decide we need more moderators and believe you to be the best candidate, we will ask you!<br>"
            ),
            "<br>",
            "<div class='question'>Who are Kickstarters? How can I become one?</div>",
            $("<div class='answer'/>").append(
                "At the start, Kickstarters were players who supported the game financially during its development phase. " +
                "They helped us improve the game by providing feedback and suggestions. " +
                "In return, they received exclusive rewards and recognition within the game community. " +
                "<br>",
                "<br>",
                "To become a Kickstarter now, simply support the game development, buy a Kickstarter Box and enjoy your new tank swag and title! You will be also mentioned on our Wall of Fame."
            ),
            "<br>",
            "<div class='question'>Who are Beta Testers?</div>",
            $("<div class='answer'/>").append(
                "Beta Testers were players who have bought the beta access. And some of them have been given as a reward for their support. " +
                "They helped us improve the game by providing feedback and suggestions."
            ),
            "<br>",
            "<div class='question'>Who are Real Mad Scientists?</div>",
            $("<div class='answer'/>").append(
                "The real mad scientists are two researchers who have gone too far with their experience. They conduct bizarre experiments and are known for their unpredictable behavior. That's why we see strange things."
            ),
            "<br>",
            "<div class='question'>Who is the Red Penguin?</div>",
            $("<div class='answer'/>").append(
                "The Red Penguin is a mysterious figure on TankTrouble. They intend to destroy the laboratory and have schemed a nefarious scheme to mind-control everyone that follows their breadcrumbs."
            ),
            "<br>",
            "<div class='question'>Who is Laika?</div>",
            $("<div class='answer'/>").append(
                "Laika is a ferocious USSR space lady! She’s out of our control and out to destroy you!"
            ),
        );
        this.wrapper.append(content);

        this.initialized = true;
    },
    show: function (params) {
        this._initialize();
    },
    hide: function () {
        this._initialize();
    },
    getContents: function () {
        this._initialize();
        return this.wrapper;
    },
    shouldHide: function () {
        return true;
    },
    canBeCancelled: function () {
        return true;
    }
};

