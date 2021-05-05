import fs from "fs";
import chalk from "chalk";
import tmi from "tmi.js";
import {
  SETTINGS_PATH,
  THEME_REWARD_ID,
  FONT_REWARD_ID,
  IDENTIFIER,
  THEMES,
  FONTS,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  ACCOUNT,
  DEFAULT_THEME,
  THEME_RESET_TIMER,
  DEFAULT_FONT,
  FONT_RESET_TIMER,
  DEFAULT_FONT_SIZE,
  FONT_SIZE_RESET_TIMER,
} from "./configs.js";

// Create a client with our options
const client = new tmi.client(ACCOUNT);

let THEME_TIMER;
let FONT_TIMER;
let FONT_SIZE_TIMER;

function modifySettings(type, option, resetLater = true) {
  if (typeof type === "string") type = type.toLowerCase();

  try {
    // read file from disk
    const unparsedOldSettings = fs.readFileSync(SETTINGS_PATH, "utf8");

    // parse it
    const parsedOldSettings = JSON.parse(unparsedOldSettings);

    // this will be our new settings
    const newSettings = { ...parsedOldSettings };

    if (type === "theme") {
      let oldTheme = parsedOldSettings["workbench.colorTheme"] || DEFAULT_THEME;
      let themes = resetLater ? [...THEMES].filter((t) => t !== oldTheme) : [...THEMES];

      const randomTheme = themes[~~(Math.random() * themes.length)] || oldTheme;
      if (typeof option === "undefined") option = randomTheme;

      let theme = themes.find((t) => t.toLowerCase() === option.toLowerCase());
      if (typeof theme === "undefined") theme = randomTheme;

      newSettings["workbench.colorTheme"] = theme;
      option = theme;

      if (resetLater && THEME_RESET_TIMER !== 0) {
        clearTimeout(THEME_TIMER);
        THEME_TIMER = setTimeout(() => {
          modifySettings("theme", DEFAULT_THEME, false);
        }, THEME_RESET_TIMER * 1000);
        console.log(`* set "${type}" timer to ${THEME_RESET_TIMER}s`);
      }
    } else if (type === "font") {
      let oldFont = parsedOldSettings["editor.fontFamily"] || DEFAULT_FONT;
      let fonts = resetLater ? [...FONTS].filter((t) => t !== oldFont) : [...FONTS];

      const randomFont = fonts[~~(Math.random() * fonts.length)] || oldFont;
      if (typeof option === "undefined") option = randomFont;

      let font = FONTS.find((t) => t.toLowerCase() === option.toLowerCase());
      if (typeof font === "undefined") font = randomFont;

      newSettings["editor.fontFamily"] = font;
      option = font;

      if (resetLater && FONT_RESET_TIMER !== 0) {
        clearTimeout(FONT_TIMER);
        FONT_TIMER = setTimeout(() => {
          modifySettings("font", DEFAULT_FONT, false);
        }, FONT_RESET_TIMER * 1000);
        console.log(`* set "${type}" timer to ${FONT_RESET_TIMER}s`);
      }
    } else if (type === "fontsize") {
      let fontSize = parsedOldSettings["editor.fontSize"] || DEFAULT_FONT_SIZE;

      const randomFontSize = ["increase", "decrease"][~~(Math.random() * 2)];
      if (typeof option === "undefined") option = randomFontSize;

      if (!resetLater) fontSize = DEFAULT_FONT_SIZE;
      else if (option.toLowerCase().startsWith("inc")) fontSize++;
      else if (option.toLowerCase().startsWith("dec")) fontSize--;
      else fontSize = fontSize + [-1, +1][~~(Math.random() * 2)];

      if (fontSize < MIN_FONT_SIZE) throw `Font size can't be lower than ${MIN_FONT_SIZE}`;
      if (fontSize > MAX_FONT_SIZE) throw `Font size can't be higher than ${MAX_FONT_SIZE}`;

      newSettings["editor.fontSize"] = fontSize;
      option = fontSize;

      if (resetLater && FONT_SIZE_RESET_TIMER !== 0) {
        clearTimeout(FONT_SIZE_TIMER);
        FONT_SIZE_TIMER = setTimeout(() => {
          modifySettings("fontsize", null, false);
        }, FONT_SIZE_RESET_TIMER * 1000);
        console.log(`* set "${type}" timer to ${FONT_SIZE_RESET_TIMER}s`);
      }
    } else {
      throw `"${type}" is not an available type...`;
    }

    const stringifiedNewSettings = JSON.stringify(newSettings, null, 4);

    // write file to disk
    fs.writeFileSync(SETTINGS_PATH, stringifiedNewSettings, "utf8");

    console.log(`* "${type}" changed to "${option}" successfully!`);
    return `${type[0].toUpperCase() + type.slice(1).toLowerCase()} changed to ${option} successfully!`;
  } catch (err) {
    // something went wrong
    console.log(`* error: ${err}`);
    return `${err}`;
  }
}

function onMessage(channel, tags, message, self) {
  // ignore message if it is is the bot's message
  if (self) return;

  let reply = "Nothing happened";

  if (tags["custom-reward-id"] === THEME_REWARD_ID) {
    // claimed the theme reward id
    reply = modifySettings("theme", message || undefined, true);
  } else if (tags["custom-reward-id"] === FONT_REWARD_ID) {
    // claimed the font reward id
    reply = modifySettings("font", message || undefined, true);
  } else if ((message || "").startsWith(IDENTIFIER)) {
    message = message.slice(1);
    let words = message.match(/\S+/g) || [];
    let command = (words[0] || "").toLowerCase();
    let args = (words.slice(1) || []).map((w) => (w || "").toLowerCase());
    if (command == "fontsize") {
      if ((args[0] || "").startsWith("inc")) {
        reply = modifySettings("fontsize", "inc", true);
      } else if ((args[0] || "").startsWith("dec")) {
        reply = modifySettings("fontsize", "dec", true);
      } else {
        return;
      }
    } else {
      return;
    }
  } else {
    return;
  }

  // uncomment the next line get the custom reward IDs (and put them in the config file)
  // if (typeof tags["custom-reward-id"] !== "undefined") console.log(chalk.redBright(`Reward's ID: "${tags["custom-reward-id"]}"\nMessage: ${command}`));

  client.say(channel, reply);
  console.log(chalk.yellowBright(`* replied with "${reply}"`));
}

// Register our event handlers
client.on("connected", (address, port) => {
  console.log(chalk.blueBright(`* connected to: address - ${address}, port - ${port}`));
});

client.on("message", onMessage);

// Connect to Twitch:
client.connect();
