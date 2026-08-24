export class CharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mysystem", "sheet", "actor"],
      template: "systems/mysystem/templates/actor/character-sheet.hbs",
      width: 700,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  getData() {
    const context = super.getData();
    context.system = context.actor.system;
    context.flags = context.actor.flags;
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
  }
}
