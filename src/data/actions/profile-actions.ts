"use server";
import qs from "qs";
import { z } from "zod";

import { getUserMeLoader } from "../services/get-user-me-loader";
import { mutateData } from "../services/mutate-data";
import { flattenAttributes } from "@/lib/utils";

import { fileDeleteService, fileUploadService } from "../services/file-service";

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// VALIDATE IMAGE WITH ZOD
const imageSchema = z.object({
  image: z
    .any() // Accepts null/empty from formData.get("image")
    .refine((val) => val instanceof File, {
      message: "Please select an image to upload.", // Custom for null/empty
    })
    .refine((file: File) => file.size > 0 && file.name !== undefined, {
      message: "Please update or add a valid image file.",
    })
    .refine((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: ".jpeg, .jpg, .png and .webp files are accepted.",
    })
    .refine((file: File) => file.size <= MAX_FILE_SIZE, {
      message: `Max file size is 5MB.`,
    }),
});

export async function updateProfileAction(
  userId: string,
  prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData);

  const query = qs.stringify({
    populate: "*",
  });

  const payload = {
    firstName: rawFormData.firstName,
    lastName: rawFormData.lastName,
    bio: rawFormData.bio,
  };

  const responseData = await mutateData(
    "PUT",
    `/api/users/${userId}?${query}`,
    payload
  );

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,  // Consistent lowercase
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,  // Consistent lowercase
      message: "Failed to update profile.",  // Fixed: Context for update, not register
    };
  }

  const flattenedData = flattenAttributes(responseData);

  return {
    ...prevState,
    message: "Profile Updated",
    data: flattenedData,
    strapiErrors: null,
  };
}

export async function uploadProfileImageAction(
  imageId: string,
  prevState: any,
  formData: FormData
) {
  // GET THE LOGGED IN USER
  const user = await getUserMeLoader();
  if (!user.ok)
    throw new Error("You are not authorized to perform this action");

  const userId = user.data.id;

  // CONVERT FROM FORMDATA TO OBJECT
  const data = Object.fromEntries(formData);

  // VALIDATE THE IMAGE (schema handles empty/null)
  const validatedFields = imageSchema.safeParse({ image: data.image });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,  // Plural, consistent
      strapiErrors: null,  // Lowercase
      data: null,
      message: null,  // No msg on validation fail
    };
  }

  // DELETE PREVIOUS IMAGE IF EXISTS
  if (imageId) {
    try {
      await fileDeleteService(imageId);
    } catch (error) {
      return {
        ...prevState,
        zodErrors: null,
        strapiErrors: null,
        message: "Failed to Delete Previous Image",
      };
    }
  }

  // UPLOAD NEW IMAGE TO MEDIA LIBRARY
  const fileUploadResponse = await fileUploadService(data.image);

  if (!fileUploadResponse) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (fileUploadResponse.error) {
    return {
      ...prevState,
      strapiErrors: fileUploadResponse.error,
      zodErrors: null,
      message: "Failed to upload File.",
    };
  }

  const updatedImageId = fileUploadResponse[0].id;
  const payload = { image: updatedImageId };  // Fixed: 'imade' → 'image'

  // UPDATE USER PROFILE WITH NEW IMAGE
  const query = qs.stringify({ populate: "*" });  // Added: For populated response
  const updatedImageResponse = await mutateData(
    "PUT",
    `/api/users/${userId}?${query}`,
    payload
  );
  const flattenedData = flattenAttributes(updatedImageResponse);

  return {
    ...prevState,
    data: flattenedData,
    strapiErrors: null,
    zodErrors: null,
    message: "Image Uploaded.",
  };
}

// "use server";
// import qs from "qs";
// import { z } from "zod";

// import { getUserMeLoader } from "../services/get-user-me-loader";
// import { mutateData } from "../services/mutate-data";
// import { flattenAttributes } from "@/lib/utils";

// import { fileDeleteService, fileUploadService } from "../services/file-service";
// import { StrapiErrors } from "@/components/custom/StrapiErrors";

// export async function updateProfileAction(
//   userId: string,
//   prevState: any,
//   formData: FormData
// ) {
//   const rawFormData = Object.fromEntries(formData);

//   const query = qs.stringify({
//     populate: "*",
//   });

//   const payload = {
//     firstName: rawFormData.firstName,
//     lastName: rawFormData.lastName,
//     bio: rawFormData.bio,
//   };

//   const responseData = await mutateData(
//     "PUT",
//     `/api/users/${userId}?${query}`,
//     payload
//   );

//   if (!responseData) {
//     return {
//       ...prevState,
//       StrapiErrors: null,
//       message: "Ops! Something went wrong. Please try again.",
//     };
//   }

//   if (responseData.error) {
//     return {
//       ...prevState,
//       StrapiErrors: responseData.error,
//       message: "Failed to register.",
//     };
//   }

//   const flettenData = flattenAttributes(responseData);

//   return {
//     ...prevState,
//     message: "Profile Updated",
//     data: flettenData,
//     strapiErrors: null,
//   };
// }

// const MAX_FILE_SIZE = 5000000;

// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

// // VALIDATE IMAGE WITH ZOD
// const imageSchema = z.object({
//   image: z
//     .instanceof(File) // More precise than z.any() for files
//     .refine((file) => file.size > 0 && file.name !== undefined, {
//       // Combined check for non-empty
//       message: "Please update or add new image.",
//     })
//     .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
//       message: ".jpeg, .jpg, .png and .webp files are accepted.",
//     })
//     .refine((file) => file.size <= MAX_FILE_SIZE, {
//       message: `Max file size is 5MB.`,
//     }),
// });

// export async function uploadProfileImageAction(
//   imageId: string,
//   prevState: any,
//   formData: FormData,
// ) {
//   //GET THE LOGGED IN USER
//   const user = await getUserMeLoader();
//   if (!user.ok)
//     throw new Error("You are not authorized to perform this action");

//   const userId = user.data.id;

//   //CONVERT FROM DATA TO OBJECT
//   const data = Object.fromEntries(formData);

//   //VALIDATE THE IMAGE
//   const validatedFields = imageSchema.safeParse({ image: data.image });

//   if (!validatedFields.success) {
//     return {
//       ...prevState,
//       zodError: validatedFields.error.flatten().fieldErrors,
//       StrapiErrors: null,
//       data: null,
//       message: "Invalide Image",
//     };
//   }

//   //DELETE PREVIOUS IMAGE IF EXISTS
//   if (imageId) {
//     try {
//       await fileDeleteService(imageId);
//     } catch (error) {
//       return {
//         ...prevState,
//         zodError: null,
//         StrapiErrors: null,
//         message: "Failed to Delete Previous Image",
//       };
//     }
//   }

//   //UPLOAD NEW IMAGE TO MEDIA LIBRARY
//   const fileUploadReponse = await fileUploadService(data.image);

//   if (!fileUploadReponse) {
//     return {
//       ...prevState,
//       StrapiErrors: null,
//       zodError: null,
//       message: "Ops! Something went wrong, Please try again.",
//     };
//   }

//   if (fileUploadReponse.error) {
//     return {
//       ...prevState,
//       StrapiErrors: fileUploadReponse.error,
//       zodError: null,
//       message: "Failed to upload File.",
//     };
//   }

//   const updatedImageId = fileUploadReponse[0].id;
//   const payload = { imade: updatedImageId };

//   //UPDATED USER PROFILE WITH NEW IMAGE
//   const updatedImageResponse = await mutateData(
//     "PUT",
//     `/api/users/${userId}`,
//     payload
//   );
//   const flattenedData = flattenAttributes(updatedImageResponse);

//   return {
//     ...prevState,
//     data: flattenedData,
//     StrapiErrors: null,
//     zodError: null,
//     message: "Image Uploaded.",
//   };
// }
