export interface User {
  id?: string;
  email: string;
  gender?: Gender | null;
  name?: string;
  pictureId?: number;
  role?: string;
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}
