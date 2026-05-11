function insertElement(tagName, attributes, innerHTML, parentId, insertBeforeId) {

    const element = document.createElement(tagName);

    for (const [attribute, value] of Object.entries(attributes)) {
        element.setAttribute(attribute, value);
    }

    element.innerHTML = innerHTML;

    const parentElement = document.getElementById(parentId);

    if (!parentElement) return;

    // Insert before an existing element
    if (insertBeforeId) {

        const referenceElement = document.getElementById(insertBeforeId);

        if (referenceElement) {
            parentElement.insertBefore(element, referenceElement);
        } else {
            parentElement.appendChild(element);
        }

    } else {
        parentElement.appendChild(element);
    }
}
function loadShopElements() {
    if (document.getElementById('theLabIntroduction')) return;
    insertElement('div', {
        id: 'theLabIntroduction',
    }, `
        <style>
            #theLabIntroduction {
                text-decoration: none !important;
            }
        </style>
        <table style="width: 500px; margin: 0 auto;">
        <div style="font-size: 20px; text-align: center; font-family: 'TankTrouble';">The Lab</div>
            <tbody>
                <tr>
                    <td>
                        <img src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/refs/heads/main/src/assets/lab/testTube.png" alt="Test Tube">
                    </td>
                    <td>
                        <br>
                        <br>
                        The Lab is where unstable prototypes and brave tank drivers rule, where you become a guinea pig and where we keep the odd stuff.<br>
                    </td>
                </tr>
            </tbody>
        </table>
    `, 'mainContent', 'shopItemsWrapper');
    insertElement('div', {
        id: 'theLabReports',
    }, `
        <style>
            #theLabReports {
                text-decoration: none !important;
            }
        </style>
        <table style="width: 500px; margin: 0 auto;">
        <div style="font-size: 20px; text-align: center; font-family: 'TankTrouble';">The Lab Reports</div>
            <tbody>
                <tr>
                    <td>
                        <br>                  
	                    This, independent newspaper reports all things TankTrouble - news, subterranean leaks, reviews, latest insights and rumours, tips and tricks, puzzles, competitions and more.
                        <br>
                        <br>
	                    The Underground Laboratory and scientists are not in any way affiliated with The Lab Report or its reporters. The Laboratory takes no responsibility for the validity of the contents.
                        <br>
                        <br>
                        You can view the archive here: 
                        <a href="https://turtlesteak.github.io/TLR/Archive.html" target="_blank" style="margin-right: 30px;">The Lab Report Archive</a>
                        </td>
                </tr>
            </tbody>
        </table>
    `, 'mainContent', 'shopItemsWrapper');
    insertElement('div', {
        id: 'tradingCards',
    }, `
        <style>
            #tradingCards {
                text-decoration: none !important;
            }
        </style>
        <div style="margin-top: 30px; clear: both;">
            <img style="float: left; margin-right: 15px; margin-bottom: 30px; margin-left: 60px; width: 200px;" src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/refs/heads/main/src/assets/lab/TTTradingCardsSeriesISpread.png">
            <span style="font-size: 18px; font-family: 'TankTrouble';">TankTrouble Trading Cards</span><br>
            The classic trump card game with notorious tanks. Print them for your own deck of portable destruction. Special thanks goes for TLR Team for development.<br><br>
            <a href="https://drive.google.com/file/d/1RsTjGg2ZCMWzKTXmWt02PldxvJvfplM-/view" target="_blank">Right click here to download series I</a><br>
            <a href="https://drive.google.com/file/d/1jbOKhs6BXFougHo5iXT3KHu7-lr-PtJy/view" target="_blank">Right click here to download series II</a><br>
            <a href="https://drive.google.com/file/d/1pue7F1QCeEeL6OlhC2hf8M-FssDN9C3p/view" target="_blank">Right click here to download series III</a><br>
            <a href="https://drive.google.com/file/d/1yKroGO_YiCwaMaWtcyfvH1MKVjLbcH8_/view" target="_blank">Right click here to download series IV</a><br>
            <a href="https://drive.google.com/file/d/1oOnM-dj-v5kHrhwUpjtG7DR3fzFBLf9I/view" target="_blank">Right click here to download series V</a><br>
            <a href="https://drive.google.com/file/d/1TwztT7ZRR8dlkSC4VyI94zjvWcuUMGNy/view" target="_blank">Right click here to download series VI</a><br>
        </div>
    `, 'mainContent', 'shopItemsWrapper');
    insertElement('div', {
        id: 'latecomersShop',
    }, `
        <style>
            #latecomersShop {
                text-decoration: none !important;
            }
        </style>
        <div style="margin-top: 30px; clear: both;">
	<img style="float: left; margin-right: 15px; margin-bottom: 30px; margin-left: 60px; width: 200px;" src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/refs/heads/main/src/assets/lab/ttessentials.png">
	<span style="font-size: 18px; font-family: 'TankTrouble';">Kickstarter Latecomer's Shop & Dimitri's Emporium Extras</span><br>
	If you missed the initial Kickstarter campaign, you can still get your hands on some exclusive items! The Latecomer's Shop offers a variety of unique products.<br>
    But what about those cool things beside the Backer Box? You may want to click here:<br><br>
	<a href="https://tanktrouble.myspreadshop.com/" target="_blank">https://tanktrouble.myspreadshop.com/</a><br><br>
	All purchases contribute to the ongoing development of TankTrouble. Thanks for your support!</div>
    `, 'mainContent', 'shopItemsWrapper');
}
function waitForShopPage() {
    const observer = new MutationObserver(() => {
        if (
            window.location.pathname.includes('/shop') &&
            document.getElementById('mainContent')
        ) {
            loadShopElements();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
waitForShopPage();