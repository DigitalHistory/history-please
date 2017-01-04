const menubar = require("menubar");
const {ipcMain} = require("electron");
const getRandomRecipe = require("./lib/get-recipe");
const mb = menubar({showDockIcon: true});

mb.on("ready", () => {
  console.log("ready!");
});

// mb.on("after-create-window", () => {
//   mb.window.openDevTools();
// });

ipcMain.on("get-recipe", (event, arg) => {
  getRandomRecipe()
    .then(text => event.sender.send("recipe", text))
    .catch(err => {
      console.log(err);
      event.sender.send("recipe", `Oops, there was an error: ${err}`);
    });
});
