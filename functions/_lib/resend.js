export async function sendEmail(apiKey, { to, subject, html }) {
  if (!apiKey) return { success: false, reason: 'not-configured' };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Multiport Games <noreply@multiportllc.com>',
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { success: false, reason: `resend-${res.status}: ${body.slice(0, 200)}` };
    }
    return { success: true };
  } catch (e) {
    return { success: false, reason: 'network-error' };
  }
}
