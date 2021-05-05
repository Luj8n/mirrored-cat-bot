import os from "os";
const HOME_DIR = os.homedir();

// uncomment one of these lines, depending on the operating system. NOTE: it may not work
// export const SETTINGS_PATH = `${HOME_DIR}/.config/Code/User/settings.json`; // for LINUX
// export const SETTINGS_PATH = `${HOME_DIR}\\AppData\\Roaming\\Code\\User\\settings.json`; // for WINDOWS
// export const SETTINGS_PATH = `${HOME_DIR}/Library/Application Support/Code/User/settings.json`; // for MAC

// twitch reward id, here is an example: "92ca1e83-f024-68df-a626-u7695asc27"
// to get them: uncomment the 157th line in "main.js", run the bot and claim the rewards. It should show the reward id
// NOTE: only rewards with the text option work!
export const THEME_REWARD_ID = "";
export const FONT_REWARD_ID = "";

export const IDENTIFIER = "~";

// to get possible themes press "Ctrl + K" then "Ctrl + T". NOTE: they are case sensitive
// NOTE: some built-in vscode themes may not work
// some examples 
export const THEMES = [
  "One Dark Pro",
  "GitHub Dark",
  "One Monokai",
  "Palenight Theme",
  "Monokai",
  "Abyss",
  "Solarized Dark",
  "Tomorrow Night Blue",
];

// only monospace fonts work (by default)
// some examples 
export const FONTS = ["Consolas", "Fira Code", "Source Code Pro", "Input Mono Narrow", "Noto Sans Mono"];

export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 20;

// set the "*_RESET_TIME" to 0, in order to make it not reset
export const DEFAULT_THEME = "One Monokai";
export const THEME_RESET_TIMER = 60; // in seconds

export const DEFAULT_FONT = "Input Mono Narrow";
export const FONT_RESET_TIMER = 60; // in seconds

export const DEFAULT_FONT_SIZE = 16;
export const FONT_SIZE_RESET_TIMER = 0; // in seconds

export const ACCOUNT = {
  connection: { reconnect: true },
  identity: {
    username: "doesnt really matter, but maybe still change it",
    password: "oauth:somethinghere",
  },
  channels: ["some_channel"],
};
