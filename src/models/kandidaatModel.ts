export interface kandidaatModel {
  id: string;
  display_name: string;
  winner?: boolean;
  mol?: boolean;
  finalist?: boolean;
  aflevering?: number;
  afgevallen?: boolean;
}
