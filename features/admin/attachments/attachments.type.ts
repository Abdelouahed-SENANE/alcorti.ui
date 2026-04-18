
export enum Category {
  CIN_FRONT = "cin_front",
  CIN_BACK = "cin_back",
  DRIVER_LICENSE = "driver_license",
  REGISTRATION_DOCUMENT = "registration_document",
}

export type Attachment = {
  id: string;
  file_name: string;
  path: string;
  category: Category;
};

