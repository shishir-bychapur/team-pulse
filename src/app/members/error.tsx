"use client";

import Alert from "@/src/components/alert/alert";

export default function Error() {
  return (
    <Alert
      title="Error!"
      message="An unexpected error occurred. Please try again later."
    />
  );
}
