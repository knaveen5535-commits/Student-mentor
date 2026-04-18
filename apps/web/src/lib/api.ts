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

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const rawBody = await res.text().catch(() => '');
  let parsedBody: any = null;
  if (isJson && rawBody) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (err) {
      parsedBody = null;
    }
  }

  if (!res.ok) {
    console.error('API ERROR FULL:', {
      path,
      status: res.status,
      statusText: res.statusText,
      rawBody,
      parsedBody,
      headers: Object.fromEntries(res.headers.entries())
    });
    const message = parsedBody?.message || parsedBody?.error || rawBody || res.statusText || 'API failed';
    throw new Error(message);
  }

  if (isJson) {
    return (parsedBody ?? {}) as T;
  }
  return { text: rawBody } as T;
}
