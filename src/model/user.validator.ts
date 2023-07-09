import Ajv, { JSONSchemaType } from "ajv";
import { IUserCreate, IUserUpdate } from "./IUser";

const UserCreateSchema: JSONSchemaType<IUserCreate> = {
  type: "object",
  properties: {
    familyName: { type: 'string', nullable: true },
    givenName: { type: 'string', nullable: true },
    email: { type: 'string' },
    profileId: { type: 'number', nullable: true }, // Update profileId property with nullable option
  },
  required: ["email"],
  additionalProperties: false,
};

const UserUpdateSchema: JSONSchemaType<IUserUpdate> = {
  type: "object",
  properties: {
    familyName: { type: 'string', nullable: true },
    givenName: { type: 'string', nullable: true },
    email: { type: 'string', nullable: true },
    profileId: { type: 'number', nullable: true }, // Add profileId property with nullable option
  },
  additionalProperties: false,
};

const ajv = new Ajv();
export const UserCreateValidator = ajv.compile(UserCreateSchema);
export const UserUpdateValidator = ajv.compile(UserUpdateSchema);
