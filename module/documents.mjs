export class MySystemActor extends Actor {

  async rollCheck(attrKey, skillKey, label = "") {
    const attrVal = this.system.attributes[attrKey] ?? 0;
    const skillVal = this.system.skills[skillKey] ?? 0;

    const formula = `1d10 + ${attrVal} + ${skillVal}`;
    const roll = new Roll(formula);
    await roll.evaluate();

    const attrLabel = attrKey.charAt(0).toUpperCase() + attrKey.slice(1);
    const skillLabel = skillKey.charAt(0).toUpperCase() + skillKey.slice(1);
    const title = label || `${attrLabel} + ${skillLabel}`;

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>Tirada de ${title}</strong><br><em>(${attrLabel}: ${attrVal} | ${skillLabel}: ${skillVal})</em>`
    });

    return roll;
  }
}

export class MySystemItem extends Item {}
