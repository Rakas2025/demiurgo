import { CharacterData } from "./module/data-models.mjs";
import { CharacterSheet } from "./module/sheets/character-sheet.mjs";

Hooks.once("init", async function() {
  console.log("MySystem | Initializing System");

  CONFIG.Actor.dataModels.character = CharacterData;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("mysystem", CharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Ficha de personaje"
  });
});
