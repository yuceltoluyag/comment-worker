const validateCaptcha = async (token, secretKey, remoteIp, shouldDebug = false) => {
  if (!token) {
    if (shouldDebug) console.log('No token providied');
    return false;
  }

  const captchaUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  const requestBody = {
    secret: secretKey,
    response: token,
    remoteip: remoteIp
  };
  const result = await fetch(captchaUrl, {
    body: JSON.stringify(requestBody),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const outcome = await result.json();

  if (!outcome.success) {
    if (shouldDebug) console.log('Invalid captcha response.' + requestBody);
    return false;
  }

  return true;
};

export { validateCaptcha };
