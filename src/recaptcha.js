const validateCaptcha = async (
  token,
  secretKey,
  remoteIp,
  shouldDebug = false,
) => {
  // Debug için tüm bilgileri yazdır
  if (shouldDebug) {
    console.log("Token:", token ? "Mevcut" : "Eksik");
    console.log("Secret Key:", secretKey ? "Mevcut" : "Eksik");
    console.log("RemoteIP:", remoteIp || "null");
  }

  // remoteIp değeri boş olduğunda localhost'da çalışıyor kabul et ve doğrulamayı geç
  if (!remoteIp) {
    if (shouldDebug)
      console.log(
        "remoteIp null, localhost olarak kabul edildi, doğrulama atlanıyor",
      );
    return true;
  }

  if (!token) {
    if (shouldDebug) console.log("No token providied");
    return false;
  }

  const captchaUrl =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const requestBody = {
    secret: secretKey,
    response: token,
    // remoteIp sorun çıkardığı için kaldırıldı
  };

  if (shouldDebug)
    console.log("Turnstile request:", JSON.stringify(requestBody));

  const result = await fetch(captchaUrl, {
    body: JSON.stringify(requestBody),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const outcome = await result.json();

  if (shouldDebug) console.log("Turnstile response:", JSON.stringify(outcome));

  if (!outcome.success) {
    if (shouldDebug)
      console.log("Invalid captcha response:", JSON.stringify(outcome));
    return false;
  }

  return true;
};

export { validateCaptcha };
