module.exports=[39315,a=>{"use strict";let b=process.env.RESEND_FROM_EMAIL?.trim()||"Ramakrishna Mission College <onboarding@resend.dev>";a.s(["RESEND_FROM",0,b,"usesResendTestSender",0,function(){return b.includes("@resend.dev")}])},957636,a=>{"use strict";var b=a.i(39315);let c="Ramakrishna Mission College, Narayanpur",d="http://localhost:3000";async function e(e){var f,g;if(!process.env.RESEND_API_KEY)return void console.log("[recruitment-email]",e.status,"→",e.to);let{subject:h,html:i}=(f=`${({submitted:"Application Received",shortlisted:"Application Shortlisted",interview:"Interview Stage",rejected:"Application Update"})[e.status]} — ${e.vacancyTitle}`,g=`<p>Dear <strong>${e.applicantName}</strong>,</p>${function(a,b){let c=`${d}/careers/dashboard`;switch(a){case"shortlisted":return`<p>Your application for <strong>${b}</strong> has been <strong style="color:#4CAF50">shortlisted</strong>.</p>
        <p>Our HR team will contact you with next steps. You may also track status at your careers dashboard.</p>
        <p><a href="${c}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Dashboard</a></p>`;case"interview":return`<p>Your application for <strong>${b}</strong> has progressed to the <strong style="color:#7c3aed">interview</strong> stage.</p>
        <p>Please watch your email and phone for schedule details from the HR office.</p>
        <p><a href="${c}" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Dashboard</a></p>`;case"rejected":return`<p>Thank you for applying for <strong>${b}</strong>.</p>
        <p>After careful review, we are unable to proceed with your application at this time. We encourage you to apply for future vacancies listed on our careers page.</p>
        <p><a href="${d}/careers" style="background:#0D2660;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View Open Vacancies</a></p>`;default:return`<p>Your application status for <strong>${b}</strong> is now: <strong>${a}</strong>.</p>
        <p><a href="${c}">Track at careers dashboard</a></p>`}}(e.status,e.vacancyTitle)}`,{subject:f,html:`
<!DOCTYPE html>
<html><head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;color:#1a1a1a;background:#f4f6fb;margin:0;padding:0;">
<table width="100%" cellpadding="0"><tr><td align="center" style="padding:32px 16px;">
<table width="600" style="background:#fff;border-radius:10px;overflow:hidden;">
<tr><td style="background:#0D2660;padding:20px 32px;text-align:center;">
<div style="font-size:18px;font-weight:bold;color:#F5C200;">${c}</div>
<div style="font-size:11px;color:#93c5fd;">Faculty Recruitment</div>
</td></tr>
<tr><td style="padding:32px;">${g}</td></tr>
<tr><td style="background:#F0F4FF;padding:16px;text-align:center;font-size:11px;color:#6b7280;">
${c} \xb7 rkm.narainpur@gmail.com \xb7 07781-252251
</td></tr>
</table></td></tr></table>
</body></html>`});try{let{Resend:c}=await a.A(386473),d=new c(process.env.RESEND_API_KEY);await d.emails.send({from:b.RESEND_FROM,to:e.to,subject:h,html:i})}catch(a){console.error("[recruitment-email]",a)}}a.s(["sendRecruitmentStatusEmail",0,e])},386473,a=>{a.v(b=>Promise.all(["server/chunks/ssr/node_modules_1cotxav._.js"].map(b=>a.l(b))).then(()=>b(745069)))}];

//# sourceMappingURL=_0zfffrk._.js.map