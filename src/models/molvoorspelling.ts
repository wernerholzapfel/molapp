export interface molvoorspellingModel {
  'mol': string,
  'winnaar': string,
  'afvaller': string,
  'aflevering': number,
}

export interface deelnemer {
  id: string,
  display_name: string,
  voorspellingen?: voorspelling[],

}

export interface voorspelling {
  id: string,
  aflevering: number,
  mol: kandidaat,
  afvaller: kandidaat,
  winnaar: kandidaat
}

export interface kandidaat {
  id: string,
  display_name: string,
  image_url: string,
  winner: boolean,
  mol: boolean,
  finalist: boolean,
  aflevering: number
}
