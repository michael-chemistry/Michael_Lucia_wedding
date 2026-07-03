/* =========================================================================
   Michael & Lucia — Save the Date
   Client-side validation + submission to a Google Apps Script Web App,
   which appends each response as a row (one column per field) in Google
   Sheets. See SETUP.md for how to create the endpoint.
   ========================================================================= */

/* -------------------------------------------------------------------------
   1) PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW.
      It looks like: https://script.google.com/macros/s/AKfy..../exec
      Until this is set, the form will show a friendly "not configured" note.
   ------------------------------------------------------------------------- */
const FORM_ENDPOINT = "";

/* ------------------------------------------------------------------------- */

const form = document.getElementById("rsvp-form");
const statusEl = document.getElementById("form-status");
const confirmationEl = document.getElementById("confirmation");
const submitBtn = form.querySelector(".submit-btn");

// name -> friendly label used in validation messages
const FIELDS = {
  fullName:    { label: "your full name",   required: true },
  partnerName: { label: "partner name",     required: false },
  street:      { label: "street address",   required: true },
  city:        { label: "city",             required: true },
  state:       { label: "state / province", required: true },
  zip:         { label: "ZIP / postal code",required: true },
  country:     { label: "country",          required: true },
  email:       { label: "email address",    required: true, email: true },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldError(name, value) {
  const spec = FIELDS[name];
  const v = value.trim();
  if (spec.required && !v) return "Please add " + spec.label + ".";
  if (spec.email && v && !EMAIL_RE.test(v)) return "Please enter a valid email address.";
  return "";
}

function setError(name, message) {
  const input = form.elements[name];
  const slot = form.querySelector('.error[data-for="' + name + '"]');
  if (slot) slot.textContent = message;
  if (input) input.classList.toggle("invalid", Boolean(message));
}

// Live validation: clear an error as soon as the field becomes valid.
Object.keys(FIELDS).forEach((name) => {
  const input = form.elements[name];
  if (!input) return;
  input.addEventListener("blur", () => setError(name, fieldError(name, input.value)));
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) {
      setError(name, fieldError(name, input.value));
    }
  });
});

function validateAll() {
  let firstInvalid = null;
  Object.keys(FIELDS).forEach((name) => {
    const input = form.elements[name];
    const msg = fieldError(name, input.value);
    setError(name, msg);
    if (msg && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return !firstInvalid;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("loading", isLoading);
}

function showConfirmation() {
  form.hidden = true;
  // Hide the form's heading/intro so only the thank-you remains.
  const heading = document.getElementById("form-title");
  const intro = document.querySelector(".form-intro");
  if (heading) heading.hidden = true;
  if (intro) intro.hidden = true;
  confirmationEl.hidden = false;
  confirmationEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "";

  if (!validateAll()) {
    statusEl.textContent = "Please complete the highlighted fields.";
    return;
  }

  if (!FORM_ENDPOINT) {
    statusEl.textContent =
      "This form isn't connected yet — see SETUP.md to link it to Google Sheets.";
    return;
  }

  const payload = {};
  Object.keys(FIELDS).forEach((name) => {
    payload[name] = form.elements[name].value.trim();
  });
  payload.submittedAt = new Date().toISOString();

  setLoading(true);
  try {
    // Apps Script Web Apps don't return CORS headers, so we send a
    // "simple" request (no preflight) and treat a resolved fetch as success.
    await fetch(FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(payload).toString(),
    });
    showConfirmation();
  } catch (err) {
    statusEl.textContent =
      "Sorry — something went wrong sending your details. Please try again.";
  } finally {
    setLoading(false);
  }
});
