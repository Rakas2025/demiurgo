import { CharacterData } from "./module/data-models.mjs";
import { MySystemActor } from "./module/documents.mjs";
import { CharacterSheet } from "./module/sheets/character-sheet.mjs";

Hooks.once("init", async function() {
  console.log("Demiurgo | Initializing System");

  CONFIG.Actor.documentClass = MySystemActor;

  CONFIG.Actor.dataModels.character = CharacterData;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("demiurgo", CharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Ficha de personaje"
  });
});
