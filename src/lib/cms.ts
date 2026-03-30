export function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  if (typeof value !== "string") {
    throw new Error(`Missing form field: ${fieldName}`);
  }

  return value;
}

export function redirectToCms(status: string, error?: string) {
  const searchParams = new URLSearchParams({ status });

  if (error) {
    searchParams.set("error", error);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: `/cms?${searchParams.toString()}`,
    },
  });
}
