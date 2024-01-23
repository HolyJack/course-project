import { CustomFieldTypes } from "@prisma/client";
import { z } from "zod";

const dataSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  topic: z.string(),
  customFields: z
    .array(
      z.object({ type: z.nativeEnum(CustomFieldTypes), value: z.string() }),
    )
    .optional(),
});

const MAX_FILE_SIZE = 45000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const imageFileSchema = z.object({
  image: z
    .custom<File>((v) => v instanceof File, {
      message: "Image is required",
    })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only .jpeg, .jpg and .png are supported`,
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 4.5MB.`)
    .optional(),
});

export const collectionFormSchema = dataSchema.merge(imageFileSchema);
export const collectionSchema = dataSchema.merge(
  z.object({ image: z.string() }),
);

export const itemFormSchema = z.object({
  name: z.string().min(2, "Item name should be atleast 2 characters."),
  tags: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  customFieldsValues: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal(CustomFieldTypes.INT),
        id: z.number(),
        name: z.string(),
        value: z.coerce.number(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.DATE),
        id: z.number(),
        name: z.string(),
        value: z.coerce.date(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.TEXT),
        id: z.number(),
        name: z.string(),
        value: z.string(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.STRING),
        id: z.number(),
        name: z.string(),
        value: z.string(),
      }),
      z.object({
        type: z.literal(CustomFieldTypes.BOOLEAN),
        id: z.number(),
        name: z.string(),
        value: z.coerce.boolean(),
      }),
    ]),
  ),
});

export enum SortField {
  ITEMS = "items",
  CREATED = "created",
}

export enum SortDirection {
  ASC = "asc",
  DES = "desc",
}

export const searchSchema = z.object({
  searchString: z.string(),
  tagFilter: z.string().optional(),
  take: z.number().optional(),
  sort: z
    .object({
      sortField: z.nativeEnum(SortField),
      sortDirection: z.nativeEnum(SortDirection),
    })
    .optional(),
});
