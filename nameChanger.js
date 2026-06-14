// Shelter Plugin structure
export function onLoad() {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function clickButtons() {
        console.log("Macro kicked off, gang! Scanning sidebar rows...");
        
        // 1. Your exact username setup
        const myUsername = "lostonblue"; 
        const allMembers = document.querySelectorAll("[class*='member_']");
        
        // 2. Loop through and click each row
        for (let member of allMembers) {
            member.click(); // Open the profile
            await wait(1500); // Give the popup a moment to load
            
            // Target the username span
            const openedUsernameSpan = document.querySelector("div[class*='usernameAndPronounsRow_'] span");
            const openedUsername = openedUsernameSpan ? openedUsernameSpan.textContent.trim().toLowerCase() : "";

            // Check if the username matches yours
            if (openedUsername.includes(myUsername.toLowerCase())) {
                break; // Found you! Stop the loop right here.
            }

            // IF IT ISN'T YOURS: Click the member row AGAIN to close the popup
            member.click(); 
            await wait(1000); 
        }
        
        await wait(1500); 

        // Check your current nickname before doing anything else
        const currentNicknameSpan = document.querySelector("div[class*='displayNameRow_'] span");
        const currentNickname = currentNicknameSpan ? currentNicknameSpan.textContent.trim() : "";

        if (currentNickname === "bluey") {
            console.log("Nickname is already bluey, gang! Stopping the script.");
            return; 
        }
        
        // 3. Select and click the edit button
        const edit = document.querySelector("[class*='footer_'] button");
        if (edit) edit.click();

        // 4. Wait 2 seconds
        await wait(2000);
        
        // 5. Select and click the edit per-server profile button
        const perServer = document.querySelector("#edit-profile-popout-edit-server-profile");
        if (perServer) perServer.click();

        // 6. Wait 3 seconds
        await wait(3000);

        // 7. Click and edit the nickname
        const nickname = document.querySelector("input[maxlength='32']");
        if (nickname) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(nickname, ""); // Put your text here
            
            // Tell Discord's layout to wake up and process the new text
            nickname.dispatchEvent(new Event('input', { bubbles: true })); 
        }

        // 8. Wait 2 seconds
        await wait(2000);

        // 9. Save changes and close
        const save = document.querySelector("button[class*='colorGreen']");
        if (save) save.click();
        
        // Wait 1.5 seconds
        await wait(1500);

        // Close menu
        const close = document.querySelector("[class*='contentHeader_'] button");
        if (close) close.click();
        console.log("Macro execution complete!");
    }

    // Assign listener to window so we can safely clear it later
    window._handleNicknameMacroKeybind = (event) => {
        if (event.key === 'F4') { 
            event.preventDefault(); 
            clickButtons();
        }
    };

    window.addEventListener('keydown', window._handleNicknameMacroKeybind);
    console.log("Nickname Macro Plugin loaded! Press F4 to fire.");
}

// Clean up when plugin is disabled/unloaded
export function onUnload() {
    if (window._handleNicknameMacroKeybind) {
        window.removeEventListener('keydown', window._handleNicknameMacroKeybind);
        delete window._handleNicknameMacroKeybind;
        console.log("Nickname Macro Plugin unloaded cleanly.");
    }
}
