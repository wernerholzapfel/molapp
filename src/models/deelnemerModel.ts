import {molvoorspellingModel, voorspelling} from './molvoorspelling';

export interface deelnemerModel {
  id: string;
  display_name: string;
  email: string;
  auth0Identifier: string;
  voorspellingen?: voorspelling[];


}
