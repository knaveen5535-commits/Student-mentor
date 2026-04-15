type ApiOptions = {
  method?: string;
  body?: any;
  userEmail?: string;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {};
  if (!isForm) {
    headers['content-type'] = 'application/json';
  }
  if (options.userEmail) {
    headers['x-user-email'] = options.userEmail;
  }

  const res = await fetch(`/api${path}`, {
    method: options.method || 'GET',
    headers,
    body:
      isForm
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}
