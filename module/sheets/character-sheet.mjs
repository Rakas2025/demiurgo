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

    // Listener para tiradas de skills ( 1d10 + Stat + Skill)
    html.find('.rollable-skill').click(async (event) => {
      event.preventDefault();
      const skillKey = event.currentTarget.dataset.skill;
      const skillName = skillKey.charAt(0).toUpperCase() + skillKey.slice(1);

      new Dialog({
        title: `Tirada de ${skillName}`,
        content: `
          <form>
            <div class="form-group">
              <label>Selecciona un Atributo:</label>
              <select id="attr-select" style="width: 100%;">
                <option value="fortaleza">Fortaleza</option>
                <option value="destreza">Destreza</option>
                <option value="intelecto">Intelecto</option>
                <option value="carisma">Carisma</option>
                <option value="afinidad">Afinidad</option>
                <option value="voluntad">Voluntad</option>
              </select>
            </div>
          </form>
        `,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice"></i>',
            label: "Tirar",
            callback: (htmlDialog) => {
              const chosenAttr = htmlDialog.find('#attr-select').val();
              this.actor.rollCheck(chosenAttr, skillKey);
            }
          }
        },
        default: "roll"
      }).render(true);
    });

    // Listener para tiradas directas de stats (1d10 + Stat)
    html.find('.rollable-stat').click(async (event) => {
      event.preventDefault();
      const statKey = event.currentTarget.dataset.stat;
      const statName = statKey.charAt(0).toUpperCase() + statKey.slice(1);
      const statVal = this.actor.system.attributes[statKey] ?? 0;

      const roll = new Roll(`1d10 + ${statVal}`);
      await roll.evaluate();

      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `<strong>Tirada de ${statName}</strong>`
      });
    });
  }
}
