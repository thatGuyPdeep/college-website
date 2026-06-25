export const OTP_SUBJECT = "Your Sign-in Code — RMVK College";

export function otpEmailHtml(otp: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <div style="background:#0D2660;padding:20px;border-radius:10px 10px 0 0;text-align:center;">
        <h2 style="color:#F5C200;margin:0;font-size:18px;">Ramakrishna Mission Vivekananda College</h2>
        <p style="color:#93c5fd;margin:4px 0 0;font-size:12px;">Narayanpur, Chhattisgarh</p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 10px 10px;">
        <p style="color:#374151;margin:0 0 16px;">Your sign-in code is:</p>
        <div style="background:#F0F4FF;border:2px solid #0D2660;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
          <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#0D2660;font-family:monospace;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:13px;margin:0;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:16px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}
