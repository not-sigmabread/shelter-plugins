// 1. Destructure built-in UI utilities directly from the shelter global environment
const { 
  ui: { showToast } 
} = shelter;

// Global listener tracking pointer kept safe from garbage collection
let removeKeybindListener: (() => void) | null = null;
let activeLoaderOverlay: HTMLDivElement | null = null;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Generates a fully responsive center-screen layout overlay GUI
const displayLoaderOverlay = (statusMessage: string) => {
    if (!activeLoaderOverlay) {
        activeLoaderOverlay = document.createElement("div");
        activeLoaderOverlay.id = "macro-loader-overlay";
        
        Object.assign(activeLoaderOverlay.style, {
            position: "fixed",
            top: "0", left: "0", width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: "999999",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            color: "#ffffff", fontFamily: "sans-serif", fontSize: "20px", fontWeight: "bold",
            pointerEvents: "all"
        });

        const spinner = document.createElement("div");
        Object.assign(spinner.style, {
            width: "50px", height: "50px",
            border: "5px solid #f3f3f3", borderTop: "5px solid #5865F2",
            borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "20px"
        });

        if (!document.getElementById("macro-loader-styles")) {
            const styleElement = document.createElement("style");
            styleElement.id = "macro-loader-styles";
            styleElement.textContent = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
            document.head.appendChild(styleElement);
        }

        const textTrackLabel = document.createElement("div");
        textTrackLabel.id = "macro-loader-text";
        textTrackLabel.innerText = statusMessage;

        activeLoaderOverlay.appendChild(spinner);
        activeLoaderOverlay.appendChild(textTrackLabel);
        document.body.appendChild(activeLoaderOverlay);
    } else {
        const existingLabel = document.getElementById("macro-loader-text");
        if (existingLabel) existingLabel.innerText = statusMessage;
    }
};

// Helper: Safely strips the GUI screen layer from active browser frame tree
const clearLoaderOverlay = () => {
    if (activeLoaderOverlay) {
        activeLoaderOverlay.remove();
        activeLoaderOverlay = null;
    }
};

// Your exact click, validation, and layout manipulation macro sequential logic
const executeNicknameMacro = async () => {
    try {
        displayLoaderOverlay("Scanning server layout grid, gang...");
        
        const myUsername = "lostonblue"; 
        const allMembers = document.querySelectorAll("[class*='member_']");
        
        // Loop down through every single active element row array sequentially
        for (let member of allMembers) {
            (member as HTMLElement).click(); 
            await wait(1500); 
            
            const openedUsernameSpan = document.querySelector("div[class*='usernameAndPronounsRow_'] span");
            const openedUsername = openedUsernameSpan ? openedUsernameSpan.textContent.trim().toLowerCase() : "";

            if (openedUsername.includes(myUsername.toLowerCase())) {
                break; // Target identified, immediately sever row looping iteration!
            }

            (member as HTMLElement).click(); 
            await wait(1000); 
        }
        
        await wait(1500); 

        const currentNicknameSpan = document.querySelector("div[class*='displayNameRow_'] span");
        const currentNickname = currentNicknameSpan ? currentNicknameSpan.textContent.trim() : "";

        // Check if our state meets termination parameters
        if (currentNickname === "bluey") {
            clearLoaderOverlay();
            showToast({ title: "Macro Aborted", content: "Nickname is already bluey, gang!", duration: 4000 });
            return; 
        }
        
        const edit = document.querySelector("[class*='footer_'] button") as HTMLElement;
        if (edit) edit.click();

        await wait(2000);
        
        const perServer = document.querySelector("#edit-profile-popout-edit-server-profile") as HTMLElement;
        if (perServer) perServer.click();

        await wait(3000);

        displayLoaderOverlay("Bypassing React state tracking cache...");
        const nickname = document.querySelector("input[maxlength='32']") as HTMLInputElement;
        if (nickname) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set;
            nativeInputValueSetter.call(nickname, "bluey"); 
            nickname.dispatchEvent(new Event('input', { bubbles: true })); 
        }

        await wait(2000);

        displayLoaderOverlay("Committing structural changes...");
        const save = document.querySelector("button[class*='colorGreen']") as HTMLElement;
        if (save) save.click();
        
        await wait(1500);

        const close = document.querySelector("[class*='contentHeader_'] button") as HTMLElement;
        if (close) close.click();
        
        clearLoaderOverlay();
        showToast({ title: "Success", content: "Nickname updated to bluey! 🚀", duration: 3000 });
    } catch (error) {
        console.error("Macro hit a runtime failure:", error);
        clearLoaderOverlay();
        showToast({ title: "Macro Crash", content: "Layout structure changed or call timed out.", duration: 3000 });
    }
};

// 2. EXPORT LIFECYCLE HOOKS: Clean, structured constants following your exact reference file
export const onLoad = () => {
    const handleKeydownTrigger = (event: KeyboardEvent) => {
        if (event.key === 'F4') { 
            event.preventDefault(); 
            executeNicknameMacro();
        }
    };

    window.addEventListener('keydown', handleKeydownTrigger);
    removeKeybindListener = () => window.removeEventListener('keydown', handleKeydownTrigger);

    showToast({
        title: "Auto Nickname Macro",
        content: "Plugin toggled ON! Press F4 to fire.",
        duration: 3000
    });
};

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

export const onUnload = () => {
    if (removeKeybindListener) {
        removeKeybindListener();
        removeKeybindListener = null;
    }
    
    clearLoaderOverlay();
    const activeStyles = document.getElementById("macro-loader-styles");
    if (activeStyles) activeStyles.remove();

    showToast({
        title: "Auto Nickname Macro",
        content: "Plugin toggled off cleanly, gang.",
        duration: 2000
    });
};
