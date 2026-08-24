export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    // Funcion que nos deja poner de -5 a 30 las stats y tal
    const statField = (initialValue = 0) => new fields.NumberField({
      required: true,
      nullable: false,
      initial: initialValue,
      integer: true,
      min: -5,
      max: 30
    });

    return {
      attributes: new fields.SchemaField({
        fortaleza: statField(0),
        destreza: statField(0),
        intelecto: statField(0),
        carisma: statField(0),
        afinidad: statField(0),
        voluntad: statField(0)
      }),
      skills: new fields.SchemaField({
        // Grupo 1: Estamina
        melee: statField(0),
        disparo: statField(0),
        atletismo: statField(0),
        acrobacia: statField(0),
        proeza: statField(0),
        resistencia: statField(0),
        sigilo: statField(0),
        latrocinio: statField(0),
        conducir: statField(0),

        // Grupo 2: Compostura
        percepcion: statField(0),
        persuasion: statField(0),
        resilencia: statField(0),
        subterfugio: statField(0),
        elaborar: statField(0),
        investigacion: statField(0),
        ciencia: statField(0),
        medicina: statField(0),
        cultura: statField(0),

        // Grupo 3: Poder
        ocultismo: statField(0),
        espiritualidad: statField(0),
        canalizar: statField(0),
        naturaleza: statField(0),
        presencia: statField(0),
        arte: statField(0),
        actuacion: statField(0),
        ataraxia: statField(0),
        instinto: statField(0)
      })
    };
  }

  prepareDerivedData() {
    const attr = this.attributes;
    
    this.derived = {
      estamina: attr.fortaleza + attr.destreza,
      compostura: attr.intelecto + attr.carisma,
      poder: attr.afinidad + attr.voluntad
    };
  }
}
