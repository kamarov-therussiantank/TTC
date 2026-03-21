// Chat Message Translation Script
whenContentInitialized().then(() => {
    const targetLanguage = "en";
    const translationCache = new Map();
    let translationEnabled = localStorage.getItem("tt_translationEnabled");
    translationEnabled = translationEnabled === null ? true : translationEnabled === "true";
    async function translateText(text, target = targetLanguage) {
        if (!translationEnabled) return text;
        if (!text || text.length < 2) return text;
        if (/^[.\sw]+$/.test(text)) return text;

        if (translationCache.has(text)) {
            return translationCache.get(text);
        }
        try {
            const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await res.json();
            if (!data || !data[0]) return text;
            const detectedLang = data[2];
            if (detectedLang === 'en') {
                translationCache.set(text, text);
                return text;
            }
            const translated = data[0].map(x => x[0]).join("");
            translationCache.set(text, translated);
            return translated;
        } catch (e) {
            console.warn("Translation failed:", e);
            return text;
        }
    }
    const originalRender = TankTrouble.ChatBox._renderChatMessage;
    TankTrouble.ChatBox._renderChatMessage = async function(
        from, to, usernameMap, addRecipients,
        textColor, strokeColor, message, chatMessageId,
        reported, animateHeight, animateFadeIn
    ) {
        if (message.trim().toLowerCase() === "/translate") {
            translationEnabled = !translationEnabled;
            localStorage.setItem("tt_translationEnabled", translationEnabled);
            const statusMsg = translationEnabled
                ? "Chat translation enabled"
                : "Chat translation disabled";
            TankTrouble.ChatBox.addSystemMessage(0, statusMsg);
            return;
        }
        const translatedMessage = await translateText(message, targetLanguage);
        originalRender.call(
            this,
            from, to, usernameMap, addRecipients,
            textColor, strokeColor, translatedMessage,
            chatMessageId, reported, animateHeight, animateFadeIn
        );
    };
});