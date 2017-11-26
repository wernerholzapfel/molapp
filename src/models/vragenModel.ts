export interface vragenModel {
  uid?: number,
  aflevering?: number,
  id?: number,
  vraag?: string,
  aantalOpenVragen?: number,
  antwoord?: antwoordModel[],
  molloot?: string
}

export interface antwoordModel {
  'id': number
  'antwoord': string
  'mollen': [string]
}

