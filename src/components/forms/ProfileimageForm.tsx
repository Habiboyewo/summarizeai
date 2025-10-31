"use client";
import React from "react";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { uploadProfileImageAction } from "@/data/actions/profile-actions";
import { SubmitButton } from "../custom/SubmitButton";
import ImagePicker from "../custom/ImagePicker";
import { ZodErrors } from "../custom/ZodErrors";
import { StrapiErrors } from "../custom/StrapiErrors";

interface ProfileImageFormProps {
  id: string;
  url: string;
  alternativeText: string;
}

const initialState = {
  message: null,
  data: null,
  strapiErrors: null,
  zodErrors: null,
};

export function ProfileImageForm({
  data,
  className,
}: {
  data: Readonly<ProfileImageFormProps>;
  className?: string;
}) {
  const uploadProfileImageWithIdAction = uploadProfileImageAction.bind(
    null,
    data?.id
  );
  const [formState, formAction, isPending] = useActionState(
    uploadProfileImageWithIdAction,
    initialState
  );

  return (
    <form action={formAction} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <ImagePicker
          id="image"
          name="image"
          label="Profile Image"
          defaultValue={data?.url || ""}
        />
        <ZodErrors error={formState?.zodErrors?.image} />
        <StrapiErrors error={formState?.strapiErrors} />
      </div>
      {/* {formState.message && (
        <div className="text-green-500 text-xs italic mt-1 py-2">
          {formState.message}
        </div>
      )} */}
      <div className="flex justify-end">
        <SubmitButton 
          text="Update Image" 
          loadingText="Saving Image" 
        />
      </div>
    </form>
  );
}
// "use client";
// import React from "react";
// import { useActionState } from "react";
// import { cn } from "@/lib/utils";
// import { uploadProfileImageAction } from "@/data/actions/profile-actions";
// import { SubmitButton } from "../custom/SubmitButton";
// import ImagePicker from "../custom/ImagePicker";
// import { ZodErrors } from "../custom/ZodErrors";
// import { StrapiErrors } from "../custom/StrapiErrors";

// interface ProfileImageFormProps {
//   id: string;
//   url: string;
//   alternativeText: string;
// }

// const initialState = {
//   message: null,
//   data: null,
//   strapiErrors: null,
//   zodErrors: null,
// };

// export function ProfileImageForm({
//   data,
//   className,
// }: {
//   data: Readonly<ProfileImageFormProps>;
//   className?: string;
// }) {
//   const uploadProfileImageWithIdAction = uploadProfileImageAction.bind(
//     null,
//     data?.id
//   );
//   const [formState, formAction] = useActionState(
//     uploadProfileImageWithIdAction,
//     initialState
//   );

//   return (
//     <form action={formAction} className={cn("space-y-4", className)}>
//       <div className="space-y-2">
//         <input hidden id="id" name="id" defaultValue={data?.url || ""} />
//         <ImagePicker
//           id="image"
//           name="image"
//           label="Profile Image"
//           defaultValue={data?.url || ""}
//         />
//         <ZodErrors error={formState?.zodErrors?.image} />
//         <StrapiErrors error={formState?.strapiErrors} />
//       </div>
//       <div className="flex justify-end">
//         <SubmitButton text="Update Image" loadingText="Saving Image" />
//       </div>
//     </form>
//   );
// }
