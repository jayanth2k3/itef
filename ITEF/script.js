// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Highlight the nav link for the section in view
const links = [...nav.querySelectorAll('a')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s));

document.getElementById('year').textContent = new Date().getFullYear();

// Enquiry form: sent directly to itefadmin@gmail.com via FormSubmit
const form = document.getElementById('enquiry-form');
const errorBox = document.getElementById('form-error');
const successBox = document.getElementById('form-success');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  successBox.hidden = true;
  const required = [...form.querySelectorAll('[required]')];
  let firstInvalid = null;
  required.forEach((field) => {
    const ok = field.value.trim() !== '' && field.checkValidity();
    field.classList.toggle('invalid', !ok);
    if (!ok && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    errorBox.textContent = 'Please complete the highlighted fields.';
    errorBox.hidden = false;
    firstInvalid.focus();
    return;
  }
  errorBox.hidden = true;

  const d = Object.fromEntries(new FormData(form));
  const payload = {
    'Full name': d.name,
    'Organisation': d.organisation || '-',
    'Country': d.country,
    'Email': d.email,
    'Mobile No.': d.mobile || '-',
    'Subject': d.subject,
    'Message': d.message,
    _subject: 'ITEF Enquiry: ' + d.subject,
    _replyto: d.email,
    _template: 'table',
    _captcha: 'false',
    _honey: d._honey,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  successBox.textContent = 'Sending your enquiry. This can take up to a minute, please keep this page open.';
  successBox.hidden = false;
  try {
    const res = await fetch('https://formsubmit.co/ajax/itefadmin@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'Send failed');
    form.reset();
    successBox.textContent = 'Thank you. Your enquiry has been sent to ITEF.';
    successBox.hidden = false;
  } catch (err) {
    successBox.hidden = true;
    errorBox.textContent = 'Sorry, your enquiry could not be sent. Please try again or email itefadmin@gmail.com.';
    errorBox.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send enquiry';
  }
});

// Helpline: pop-up seafarer support form, sent to itefadmin@gmail.com via FormSubmit
const helpline = document.getElementById('helpline');
const helplineForm = document.getElementById('helpline-form');
const helplineError = document.getElementById('helpline-error');
const helplineSuccess = document.getElementById('helpline-success');
const helplineBtn = helplineForm.querySelector('button[type="submit"]');

document.getElementById('help-fab').addEventListener('click', () => {
  helpline.showModal();
  helplineForm.querySelector('input[name="name"]').focus();
});
document.getElementById('helpline-close').addEventListener('click', () => helpline.close());
helpline.addEventListener('click', (e) => { if (e.target === helpline) helpline.close(); });

helplineForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  helplineSuccess.hidden = true;
  let firstInvalid = null;
  helplineForm.querySelectorAll('[required]').forEach((field) => {
    const ok = field.type === 'checkbox' ? field.checked : field.value.trim() !== '' && field.checkValidity();
    (field.type === 'checkbox' ? field.closest('label') : field).classList.toggle('invalid', !ok);
    if (!ok && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    helplineError.textContent = 'Please complete the highlighted fields and tick the declaration.';
    helplineError.hidden = false;
    firstInvalid.focus();
    return;
  }
  helplineError.hidden = true;

  const d = Object.fromEntries(new FormData(helplineForm));
  const payload = {
    'Full Name': d.name,
    'Rank': d.rank,
    'Nationality': d.nationality,
    'Phone Number': d.phone,
    'Email Address': d.email,
    'Ship Name': d.ship,
    'IMO Number': d.imo || '-',
    'Flag': d.flag || '-',
    'Present Port': d.present_port || '-',
    'Next Port': d.next_port || '-',
    'Problem': d.problem,
    'Declaration': 'Confirmed: information is true and accurate',
    _subject: `ITEF HELPLINE: ${d.name} (${d.ship})`,
    _replyto: d.email,
    _template: 'table',
    _captcha: 'false',
    _honey: d._honey,
  };

  helplineBtn.disabled = true;
  helplineBtn.textContent = 'Sending…';
  helplineSuccess.textContent = 'Sending your details. This can take up to a minute, please keep this page open.';
  helplineSuccess.hidden = false;
  try {
    const res = await fetch('https://formsubmit.co/ajax/itefadmin@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'Send failed');
    helplineForm.reset();
    helplineSuccess.textContent = 'Thank you. Your details have been sent to the ITEF helpline team.';
    helplineSuccess.hidden = false;
  } catch (err) {
    helplineSuccess.hidden = true;
    helplineError.textContent = 'Sorry, your form could not be sent. Please try again, call +91 86809 88333 or email itefadmin@gmail.com.';
    helplineError.hidden = false;
  } finally {
    helplineBtn.disabled = false;
    helplineBtn.textContent = 'Submit to Helpline';
  }
});
