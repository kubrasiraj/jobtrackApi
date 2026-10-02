// Turns any failed request into a safe, user-friendly shape.
export function normalizeError(error) {
  const status = error?.response?.status ?? null;
  const detail = error?.response?.data?.detail;
  let message;
  let fieldErrors = {};

  if (!error?.response) {
    message = error?.code === 'ECONNABORTED'
      ? 'The request took too long. Please try again.'
      : "Can't reach the server. Check your connection and make sure the API is running.";
  } else if (status === 422 && Array.isArray(detail)) {
    fieldErrors = detail.reduce((acc, item) => {
      const field = item?.loc?.[item.loc.length - 1];
      if (typeof field === 'string' && !acc[field]) acc[field] = item.msg;
      return acc;
    }, {});
    message = 'Please check the highlighted fields and try again.';
  } else if (status === 400) {
    message = typeof detail === 'string' ? detail : 'The request could not be processed.';
  } else if (status === 401) {
    message = typeof detail === 'string' ? detail : 'Your session has expired. Please sign in again.';
  } else if (status === 403) {
    message = "You don't have permission to do that.";
  } else if (status === 404) {
    message = typeof detail === 'string' ? detail : 'We could not find what you were looking for.';
  } else if (status >= 500) {
    message = 'Something went wrong on our side. Please try again in a moment.';
  } else {
    message = 'Something went wrong. Please try again.';
  }

  return { status, message, fieldErrors };
}

export function getErrorMessage(error) {
  return error?.normalized?.message ?? normalizeError(error).message;
}

export function getFieldErrors(error) {
  return error?.normalized?.fieldErrors ?? normalizeError(error).fieldErrors;
}

export function getStatus(error) {
  return error?.normalized?.status ?? error?.response?.status ?? null;
}
