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
    const errorData = {
      path,
      status: res.status,
      statusText: res.statusText,
      rawBody,
      parsedBody,
      headers: Object.fromEntries(res.headers.entries())
    };
    
    // Stringify the error object so it prints fully in the Next.js console interceptor
    console.error('API ERROR FULL:\n' + JSON.stringify(errorData, null, 2));

    // Extract message intelligently
    let message = 'API failed';
    if (parsedBody) {
      if (typeof parsedBody.message === 'string') {
        message = parsedBody.message;
      } else if (parsedBody.error) {
        if (typeof parsedBody.error === 'string') {
          message = parsedBody.error;
        } else if (typeof parsedBody.error.message === 'string') {
          message = parsedBody.error.message;
        } else {
          message = JSON.stringify(parsedBody.error);
        }
      }
    } else if (rawBody) {
      message = rawBody;
    } else if (res.statusText) {
      message = res.statusText;
    }

    throw new Error(message);
  }

  if (isJson) {
    return (parsedBody ?? {}) as T;
  }
  return { text: rawBody } as T;
}
