// 1. Destructure the built-in GUI and notification tools natively from shelter
const { 
  ui: { showToast, openModal, Text }, 
  plugin: { store } 
} = shelter;

// Global tracking pointer for our active keybind hook
let unpatchKeybind = null;

export function onLoad() {
    // Show a visual GUI notification at the bottom right corner when it boots up successfully
    showToast({
        title: "Auto Nickname Macro",
        content: "Plugin loaded! Press F4 to fire.",
        duration: 3000
    });

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function clickButtons() {
        showToast({ title: "Macro Status", content: "Scanning sidebar rows, gang...", duration: 2000 });
        
        const myUsername = "lostonblue"; 
        const allMembers = document.querySelectorAll("[class*='member_']");
        
        for (let member of allMembers) {
            member.click(); 
            await wait(1500); 
            
            const openedUsernameSpan = document.querySelector("div[class*='usernameAndPronounsRow_'] span");
            const openedUsername = openedUsernameSpan ? openedUsernameSpan.textContent.trim().toLowerCase() : "";

            if (openedUsername.includes(myUsername.toLowerCase())) {
                break; 
            }

            member.click(); 
            await wait(1000); 
        }
        
        await wait(1500); 

        const currentNicknameSpan = document.querySelector("div[class*='displayNameRow_'] span");
        const currentNickname = currentNicknameSpan ? currentNicknameSpan.textContent.trim() : "";

        if (currentNickname === "bluey") {
            showToast({ title: "Macro Aborted", content: "Nickname is already bluey, gang!", duration: 4000 });
            return; 
        }
        
        const edit = document.querySelector("[class*='footer_'] button");
        if (edit) edit.click();

        await wait(2000);
        
        const perServer = document.querySelector("#edit-profile-popout-edit-server-profile");
        if (perServer) perServer.click();

        await wait(3000);

        const nickname = document.querySelector("input[maxlength='32']");
        if (nickname) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(nickname, "bluey"); 
            nickname.dispatchEvent(new Event('input', { bubbles: true })); 
        }

        await wait(2000);

        const save = document.querySelector("button[class*='colorGreen']");
        if (save) save.click();
        
        await wait(1500);

        const close = document.querySelector("[class*='contentHeader_'] button");
        if (close) close.click();
        
        // Final success visual alert popup
        showToast({ title: "Success", content: "Nickname updated to bluey! 🚀", duration: 3000 });
    }

    // Set up the listener function
    const handleMacroKeybind = (event) => {
        if (event.key === 'F4') { 
            event.preventDefault(); 
            clickButtons();
        }
    };

    // Store reference to clean it up later
    window.addEventListener('keydown', handleMacroKeybind);
    unpatchKeybind = () => window.removeEventListener('keydown', handleMacroKeybind);
}

// 2. VISUALITY: Create a custom Settings UI panel that renders inside the client plugins menu
export function settingsView() {
    // Returns a responsive text info block inside the settings window
    return shelter.ui.injectHtml(`
        <div style="padding: 10px; color: #fff;">
            <h3 style="margin-bottom: 8px; font-weight: bold;">Auto Nickname Macro Config</h3>
            <p style="font-size: 14px; opacity: 0.8; margin-bottom: 12px;">
                Press <b style="color: #5865F2; background: #2f3136; padding: 2px 6px; border-radius: 4px;">F4</b> anywhere in a server window to initiate the automatic layout scan.
            </p>
            <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px;">
                Target Account: lostonblue<br>
                Target Identity: bluey
            </div>
        </div>
    `);
}

// 3. CLEANUP: Fully unloads everything when the user toggles the switch off
export function onUnload() {
    if (unpatchKeybind) {
        unpatchKeybind();
        unpatchKeybind = null;
    }
    showToast({
        title: "Auto Nickname Macro",
        content: "Plugin toggled off cleanly.",
        duration: 2000
    });
}
