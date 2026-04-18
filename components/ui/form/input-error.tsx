"use client";
export type ErrorProps = {
    errorMessage?: string | null;
  };
  
  export const InputError = ({ errorMessage }: ErrorProps) => {
    if (!errorMessage) return null;
  
    return (
      <div
        role="alert"
        aria-label={errorMessage}
        className="text-sm ltr:text-left rtl:text-right w-full  my-0.5 text-destructive"
      >
        {errorMessage}
      </div>
    );
  };