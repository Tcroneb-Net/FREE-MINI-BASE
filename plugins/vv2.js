const { cmd } = require("../inconnuboy");

cmd({
    pattern: "vv2",
    alias: ["wah", "ohh", "oho", "🙂", "nice", "ok", "vv"],
    desc: "Owner Only - Retrieve quoted view-once message",
    category: "owner",
    filename: __filename
}, async (client, message, match, { from, isCreator }) => {
    try {
        // 1. Strict Owner Check
        if (!isCreator) {
            return; // Silent fail for non-owners
        }

        // 2. Check if quoted message exists
        if (!match.quoted) {
            return await client.sendMessage(from, {
                text: "*🍁 Please reply to a view-once message!*"
            }, { quoted: message });
        }

        // 3. Check if quoted message has media
        // Some libraries store media in 'message' object differently
        const quotedMsg = match.quoted;
        
        // Determine media type
        const mtype = quotedMsg.mtype; // e.g., 'imageMessage', 'videoMessage', 'audioMessage'
        
        if (!["imageMessage", "videoMessage", "audioMessage"].includes(mtype)) {
             return await client.sendMessage(from, {
                text: "❌ The replied message does not contain valid media (Image/Video/Audio)."
            }, { quoted: message });
        }

        // 4. Download Media
        const buffer = await quotedMsg.download();
        
        if (!buffer || buffer.length === 0) {
            throw new Error("Failed to download media buffer.");
        }

        const options = { 
            quoted: message,
            // IMPORTANT: Ensure the resent message is NOT view-once
            viewOnce: false 
        };

        let messageContent = {};

        switch (mtype) {
            case "imageMessage":
                messageContent = {
                    image: buffer,
                    caption: quotedMsg.text || '', // Preserve original caption if any
                    mimetype: quotedMsg.mimetype || "image/jpeg",
                    viewOnce: false // Explicitly disable view once
                };
                break;
            case "videoMessage":
                messageContent = {
                    video: buffer,
                    caption: quotedMsg.text || '',
                    mimetype: quotedMsg.mimetype || "video/mp4",
                    viewOnce: false // Explicitly disable view once
                };
                break;
            case "audioMessage":
                messageContent = {
                    audio: buffer,
                    mimetype: quotedMsg.mimetype || "audio/mp4",
                    ptt: quotedMsg.ptt || false, // Preserve voice note status
                    viewOnce: false // Explicitly disable view once
                };
                break;
        }

        // 5. Send to Owner's DM (message.sender is the owner here since isCreator is true)
        await client.sendMessage(message.sender, messageContent, options);
        
        // Optional: Confirm success in the group chat (silent or visible)
        // await client.sendMessage(from, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error("VV2 Error:", error);
        // Only send error message if it's a genuine error, not just a silent fail
        await client.sendMessage(from, {
            text: "❌ Error fetching message:\n" + error.message
        }, { quoted: message });
    }
});
