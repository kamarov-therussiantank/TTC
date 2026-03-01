// Forum Additions
whenContentInitialized().then(() => {
    const coCreators = (thread, threadElement) => {
        threadElement.find('.reply-row').remove();

        const creators = {
            creator: thread.creator,
            ...(thread.coCreator1 && { coCreator1: thread.coCreator1 }),
            ...(thread.coCreator2 && { coCreator2: thread.coCreator2 })
        };

        const container = threadElement.find('.container');
        const row = $('<div/>')
            .addClass('reply-row')
            .insertBefore(container);
        const tanks = $('<div/>')
            .addClass(`tanks tankCount${Object.keys(creators).length}`)
            .appendTo(row);
        row.append(container);
        for (const [creatorType, playerId] of Object.entries(creators)) {
            const tank = $('<div/>')
                .addClass(`tank ${creatorType}`)
                .appendTo(tanks);
            const canvas = document.createElement('canvas');
            canvas.width = UIConstants.TANK_ICON_WIDTH_SMALL;
            canvas.height = UIConstants.TANK_ICON_HEIGHT_SMALL;
            canvas.style.width =
                `${UIConstants.TANK_ICON_RESOLUTIONS[UIConstants.TANK_ICON_SIZES.SMALL]}px`;
            canvas.style.height =
                `${UIConstants.TANK_ICON_RESOLUTIONS[UIConstants.TANK_ICON_SIZES.SMALL] * 0.6}px`;
            canvas.addEventListener('mouseup', () => {
                const rect = canvas.getBoundingClientRect();
                const win = canvas.ownerDocument.defaultView;
                TankTrouble.TankInfoBox.show(
                    rect.left + win.scrollX + canvas.clientWidth / 2,
                    rect.top + win.scrollY + canvas.clientHeight / 2,
                    playerId,
                    canvas.clientWidth / 2,
                    canvas.clientHeight / 4
                );
            });
            UITankIcon.loadPlayerTankIcon(
                canvas,
                UIConstants.TANK_ICON_SIZES.SMALL,
                playerId
            );

            tank.append(canvas);
        }
        Backend.getInstance().getPlayerDetails(result => {
            const username =
                typeof result === 'object'
                    ? Utils.maskUnapprovedUsername(result)
                    : 'Scrapped';
            $('<div/>')
                .addClass('playerUsername')
                .text(username)
                .appendTo(tanks.find('.tank.creator'));
        }, () => {}, () => {}, creators.creator, Caches.getPlayerDetailsCache());
    };
    const hyperlinks = (_threadOrReply, threadOrReplyElement) => {
		const threadOrReplyContent = threadOrReplyElement.find('.bubble .content');
		if (threadOrReplyContent.length) {
			const urlRegex = /(?<_>https?:\/\/[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?)/gu;
			const links = threadOrReplyContent.html().replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
			threadOrReplyContent.html(links);
		}
	};
    const handleItems = item => {
        if (!item || !item.html) return;
        const [key] = Object.keys(item.html);
        const html = item.html[key];
        if (typeof html === 'string') {
            const el = $($.parseHTML(html));
            coCreators(item, el);
            hyperlinks(item, el);
            item.html[key] = el;
            item.html.backup = html;
        } else if (html instanceof $ && item.html.backup) {
            const el = $($.parseHTML(item.html.backup));
            coCreators(item, el);
            item.html[key] = el;
        }
    };
    const tlc = ForumView.getMethod('threadListChanged');
    ForumView.method('threadListChanged', function (...args) {
        const list = args.shift();
        list.forEach(handleItems);
        return tlc.apply(this, [list, ...args]);
    });
    const rlc = ForumView.getMethod('replyListChanged');
    ForumView.method('replyListChanged', function (...args) {
        const list = args.shift();
        list.forEach(handleItems);
        return rlc.apply(this, [list, ...args]);
    });
    const gst = ForumModel.getMethod('getSelectedThread');
    ForumModel.method('getSelectedThread', function (...args) {
        const result = gst.apply(this, args);
        handleItems(result);
        return result;
    });
});
