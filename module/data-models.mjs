export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    const statField = (initialValue = 0) => new fields.NumberField({
      required: true, nullable: false, initial: initialValue, integer: true, min: -5, max: 30
    });
    
    const basicInt = (initialValue = 0) => new fields.NumberField({
      required: true, nullable: false, initial: initialValue, integer: true, min: 0
    });

    return {
      attributes: new fields.SchemaField({
        fortaleza: statField(0), destreza: statField(0),
        intelecto: statField(0), carisma: statField(0),
        afinidad: statField(0), voluntad: statField(0)
      }),
      bonos: new fields.SchemaField({
        estamina: statField(0), compostura: statField(0), poder: statField(0)
      }),
      skills: new fields.SchemaField({
        pelea: statField(0), disparo: statField(0), atletismo: statField(0), acrobacia: statField(0), proeza: statField(0), resistencia: statField(0), sigilo: statField(0), latrocinio: statField(0), conducir: statField(0),
        percepcion: statField(0), influencia: statField(0), resilencia: statField(0), subterfugio: statField(0), elaborar: statField(0), investigacion: statField(0), ciencia: statField(0), medicina: statField(0), cultura: statField(0),
        ocultismo: statField(0), espiritualidad: statField(0), canalizar: statField(0), naturaleza: statField(0), presencia: statField(0), arte: statField(0), actuacion: statField(0), ataraxia: statField(0), instinto: statField(0)
      }),
      recursos: new fields.SchemaField({
        destino: new fields.SchemaField({ value: basicInt(0), max: basicInt(0) }),
        albedrio: new fields.SchemaField({ value: basicInt(0), max: basicInt(0) }),
        explosiones: basicInt(0)
      }),
      combate: new fields.SchemaField({
        aguante: basicInt(10),
        recibido: basicInt(0),
        absorcion: basicInt(0),
        heridas: basicInt(0),
        defensa: new fields.SchemaField({
          base1: statField(0), base2: statField(0), bono: statField(0)
        }),
        movimiento: basicInt(5),
        turno: new fields.SchemaField({
          tipo: new fields.StringField({ initial: "Rapido" }),
          bono: statField(0),
          dados: new fields.SchemaField({
            d4: basicInt(0), d6: basicInt(0), d8: basicInt(0), d10: basicInt(0), d12: basicInt(0), d20: basicInt(0)
          }),
          puntos: new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0, max: 4 })
        })
      })
    };
  }

  prepareDerivedData() {
    const attr = this.attributes;
    const bonos = this.bonos;
    const def = this.combate.defensa;
    
    this.derived = {
      estamina: { max: attr.fortaleza + attr.destreza + bonos.estamina },
      compostura: { max: attr.intelecto + attr.carisma + bonos.compostura },
      poder: { max: attr.afinidad + attr.voluntad + bonos.poder },
      defensa: { pasiva: def.base1 + def.base2 + def.bono }
    };
  }
}
