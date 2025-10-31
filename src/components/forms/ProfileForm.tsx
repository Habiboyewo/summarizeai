"use client";
import React from "react";
import { cn } from "@/lib/utils";
// import { useFormState } from "react-dom";
import { useActionState } from "react";
import { updateProfileAction } from "@/data/actions/profile-actions";

import { SubmitButton } from "../custom/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "../custom/StrapiErrors";

const INITIAL_STATE = {
  data: null,
  StrapiErrors: null,
  message: null,
};

interface ProfileFormProps {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  credits: number;
}

const styles = {
  form: "space-y-4",
  container: "space-y-4 grid",
  topRow: "grid grid-cols-3 gap-4",
  nameRow: "grid grid-cols-2 gap-4",
  fieldGroup: "space-y-2",
  textarea: "resize-none border rounded-md w-full h-[224px] p-2",
  buttonContainer: "flex justify-end",
  countBox:
    "flex items-center justify-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none",
  creditText: "font-bold text-md mx-1",
};

export function ProfileForm({
  data,
  className,
}: {
  readonly data: ProfileFormProps;
  readonly className?: string;
}) {
  const updateUserWithID = updateProfileAction.bind(null, data.id);

  const [formState, formAction] = useActionState(
    updateUserWithID,
    INITIAL_STATE
  );
  console.log("profilrForm", formState);

  if (!data) {
    return (
      <div className={cn(styles.form, className)}>
        <p>Unable to load profile data</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn(styles.form, className)}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Input
            id="username"
            name="username"
            placeholder="Username"
            defaultValue={data.username || ""}
            disabled
          />
          <input type="hidden" name="id" value={data.id} />
          <Input
            id="email"
            name="email"
            placeholder="Email"
            defaultValue={data.email || ""}
            disabled
          />
          <CountBox text={data.credits || 0} />
        </div>

        <div className={styles.nameRow}>
          <div className={styles.fieldGroup}>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First Name"
              defaultValue={data.firstName || ""}
            />
          </div>
          <div className={styles.fieldGroup}>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              defaultValue={data.lastName || ""}
            />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Write your bio here..."
            className={styles.textarea}
            defaultValue={data.bio || ""}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <SubmitButton text="Update Profile" loadingText="Saving Profile" />
      </div>
      <StrapiErrors error={formState.strapiErrors}/>
    </form>
  );
}

function CountBox({ text }: { text: number }) {
  const color = text > 0 ? "text-primary" : "text-red-500";
  return (
    <div className={styles.countBox}>
      You have<span className={cn(styles.creditText, color)}>{text}</span>
      credit(s)
    </div>
  );
}

// function CountBox({text}: {readonly text: number}){
//     const style = "font-bold text-md mx-1"
//     const color = text > 0 ? "text-primary" : "text-red-500"
//     return(
//         <div className="flex items-center justify-center h-9 w-full rounded-md border">
//             you have <span>{text}</span>
//         </div>
//     )
// }
