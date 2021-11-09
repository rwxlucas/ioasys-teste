import { IMissingParameters, resType } from "./types";

export const makeResponse = (status: number, response?: { message?: string, data?: any }): resType => {
  return {
    status,
    response
  }
}

export const verifyEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const valuesToLowerCase = (values: any, ignoreValue?: string[]) => {
  if (Array.isArray(values)) return values.map(value => value.toLowerCase());
  if (typeof values === 'object') {
    let objectLower: any = {};
    for (const key in values) {
      if (typeof values[key] === 'string') {
        objectLower[key] = ignoreValue && ignoreValue.includes(key) ? values[key] : values[key].toLowerCase();
      }
    }
    return Object.keys(objectLower).length > 0 ? objectLower : values;
  }
  return values.toLowerCase();
}

export const verifyObjectRequest = (body: any, verify: string[]): IMissingParameters => {
  let parameters = Object.keys(body);
  if (!body) return { missing: true, variables: 'Missing all parameters' };
  let missingParameters: string[] = [];
  verify.forEach(key => {
    if (!parameters.includes(key)) missingParameters.push(key);
  });
  if (missingParameters.length > 0) return {
    missing: true,
    variables: `Missing ${missingParameters.join(', ')} parameters`
  }
  if (parameters.includes('email') && !verifyEmail(body.email)) return { missing: true, variables: 'Invalid email' };
  // Fazer verificação do date.
  return { missing: false, user: body }
}