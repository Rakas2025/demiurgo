export class CharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["demiurgo", "sheet", "actor"],
      template: "systems/demiurgo/templates/actor/character-sheet.hbs",
      width: 1000,
      height: 750,
      title: game.i18n.localize("DEMIURGO.SheetTitle"),
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "principal" }]
    });
  }

  getData() {
    const context = super.getData();
    const sys = context.actor.system;
    
    context.system = sys;
    context.flags = context.actor.flags;

    const combate = sys.combate || {};
    const aguante = Math.max(combate.aguante || 10, 1); 
    const recibido = combate.recibido || 0;
    const heridas = combate.heridas || 0;
    
    context.barras = {
      danoPct: Math.min((recibido / aguante) * 100, 100),
      heridasPct: Math.min((heridas / aguante) * 100, 100),
      saludPct: Math.max(0, 100 - ((recibido + heridas) / aguante) * 100) 
    };

    context.opcionesTurno = { "Rapido": "Rápido", "Lento": "Lento", "Defensivo": "Defensivo" };

    const turno = combate.turno || {};
    const puntosTurno = turno.puntos || 0;
    
    context.circulosTurno = [];
    for (let i = 1; i <= 4; i++) {
      if (puntosTurno >= i) context.circulosTurno.push("full");
      else if (puntosTurno >= i - 0.5) context.circulosTurno.push("half");
      else context.circulosTurno.push("empty");
    }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find('.adj-btn').click(async (event) => {
      event.preventDefault();
      const target = event.currentTarget.dataset.target;
      const dir = parseFloat(event.currentTarget.dataset.dir);
      const step = parseFloat(event.currentTarget.dataset.step) || 1; 
      const max = parseFloat(event.currentTarget.dataset.max) || Infinity;
      
      const currentVal = foundry.utils.getProperty(this.actor, target) || 0;
      
      const newVal = Math.max(0, Math.min(currentVal + (dir * step), max));
      
      if (newVal !== currentVal) {
        await this.actor.update({ [target]: newVal });
      }
    });

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
            callback: async (htmlDialog) => {
              const chosenAttr = htmlDialog.find('#attr-select').val();
              if(this.actor.rollCheck) {
                  await this.actor.rollCheck(chosenAttr, skillKey);
              } else {
                  ui.notifications.warn("rollCheck method missing on Actor.");
              }
            }
          }
        },
        default: "roll"
      }).render(true);
    });

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
