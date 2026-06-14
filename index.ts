// 1. Destructure the built-in GUI and notification tools natively from shelter
const { 
  ui: { showToast } 
} = shelter;

// Global tracking variables matching your example's pattern
let unpatchKeybind = null;
let loaderOverlayElement = null;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to build the loader overlay UI natively
const createLoaderOverlay = (text: string) => {
    if (!loaderOverlayElement) {
        loaderOverlayElement = document.createElement("div");
        loaderOverlayElement.id = "macro-loader-overlay";
        Object.assign(loaderOverlayElement.style, {
            position: "fixed",
            top: "0", left: "0", width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: "999999",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            color: "#ffffff", fontFamily: "sans-serif", fontSize: "20px", fontWeight: "bold"
        });

        const spinner = document.createElement("div");
        Object.assign(spinner.style, {
            width: "50px", height: "50px",
            border: "5px solid #f3f3f3", borderTop: "5px solid #5865F2",
            borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "20px"
        });

        if (!document.getElementById("macro-loader-styles")) {
            const styleTrack = document.createElement("style");
            styleTrack.id = "macro-loader-styles";
            styleTrack.textContent = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
            document.head.appendChild(styleTrack);
        }

        const textLabel = document.createElement("div");
        textLabel.id = "macro-loader-text";
        textLabel.innerText = text;

        loaderOverlayElement.appendChild(spinner);
        loaderOverlayElement.appendChild(textLabel);
        document.body.appendChild(loaderOverlayElement);
    } else {
        const label = document.getElementById("macro-loader-text");
        if (label) label.innerText = text;
    }
};

const removeLoaderOverlay = () => {
    if (loaderOverlayElement) {
        loaderOverlayElement.remove();
        loaderOverlayElement = null;
    }
};

// Your exact sequential click/edit macro logic completely untouched
const clickButtons = async () => {
    createLoaderOverlay("Scanning sidebar rows, gang...");
    
    const myUsername = "lostonblue"; 
    const allMembers = document.querySelectorAll("[class*='member_']");
    
    for (let member of allMembers) {
        (member as HTMLElement).click(); 
        await wait(1500); 
        
        const openedUsernameSpan = document.querySelector("div[class*='usernameAndPronounsRow_'] span");
        const openedUsername = openedUsernameSpan ? openedUsernameSpan.textContent.trim().toLowerCase() : "";

        if (openedUsername.includes(myUsername.toLowerCase())) {
            break; 
        }

        (member as HTMLElement).click(); 
        await wait(1000); 
    }
    
    await wait(1500); 

    const currentNicknameSpan = document.querySelector("div[class*='displayNameRow_'] span");
    const currentNickname = currentNicknameSpan ? currentNicknameSpan.textContent.trim() : "";

    if (currentNickname === "bluey") {
        removeLoaderOverlay();
        showToast({ title: "Macro Aborted", content: "Nickname is already bluey, gang!", duration: 4000 });
        return; 
    }
    
    const edit = document.querySelector("[class*='footer_'] button") as HTMLElement;
    if (edit) edit.click();

    await wait(2000);
    
    const perServer = document.querySelector("#edit-profile-popout-edit-server-profile") as HTMLElement;
    if (perServer) perServer.click();

    await wait(3000);

    const nickname = document.querySelector("input[maxlength='32']") as HTMLInputElement;
    if (nickname) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(nickname, "bluey"); 
        nickname.dispatchEvent(new Event('input', { bubbles: true })); 
    }

    await wait(2000);

    const save = document.querySelector("button[class*='colorGreen']") as HTMLElement;
    if (save) save.click();
    
    await wait(1500);

    const close = document.querySelector("[class*='contentHeader_'] button") as HTMLElement;
    if (close) close.click();
    
    removeLoaderOverlay();
    showToast({ title: "Success", content: "Nickname updated to bluey! 🚀", duration: 3000 });
};

// Set up the listener function matching the format
const handleMacroKeybind = (event: KeyboardEvent) => {
    if (event.key === 'F4') { 
        event.preventDefault(); 
        clickButtons();
    }
};

// Setup initialization on script evaluation
window.addEventListener('keydown', handleMacroKeybind);
unpatchKeybind = () => window.removeEventListener('keydown', handleMacroKeybind);

showToast({
    title: "Auto Nickname Macro",
    content: "Plugin loaded! Press F4 to fire.",
    duration: 3000
});

// 2. VISUALITY: Your clean, custom Settings UI panel
export const settingsView = () => {
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
};

// 3. CLEANUP: Export onUnload exactly like your helper example file
export const onUnload = () => {
    if (unpatchKeybind) {
        unpatchKeybind();
        unpatchKeybind = null;
    }
    removeLoaderOverlay();
    const cleanStyles = document.getElementById("macro-loader-styles");
    if (cleanStyles) cleanStyles.remove();

    showToast({
        title: "Auto Nickname Macro",
        content: "Plugin toggled off cleanly.",
        duration: 2000
    });
};
