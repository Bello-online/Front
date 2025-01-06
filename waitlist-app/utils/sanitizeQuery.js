export const sanitizeQuery = (query) => {
  if (typeof query !== 'string') return '';
  
  // Remove special characters and SQL injection attempts
  return query
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .replace(/(\b(select|insert|update|delete|drop|union|exec|eval)\b)/gi, '') // Remove SQL keywords
    .trim();
};

export const sanitizeSearchParams = (searchParams) => {
  const sanitized = {};
  
  Object.keys(searchParams).forEach(key => {
    sanitized[key] = sanitizeQuery(searchParams[key]);
  });
  
  return sanitized;
}; 