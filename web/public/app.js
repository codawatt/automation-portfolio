const MAX_LENGTH = 500;
const TIMEOUT_MS = 15000;

const form = document.querySelector('#lead-form');
const messageInput = document.querySelector('#message');
const counter = document.querySelector('#counter');
const submitButton = document.querySelector('#submit');
const resendButton = document.querySelector('#resend');
const result = document.querySelector('#result');
const leadsBody = document.querySelector('#leads-body');

let lastRequest = null;

function updateCounter() {
  counter.textContent = `${messageInput.value.length}/${MAX_LENGTH}`;
}

function showResult(type, text) {
  result.hidden = false;
  result.className = `result ${type}`;
  result.textContent = text;
}

function setBusy(busy) {
  submitButton.disabled = busy;
  submitButton.textContent = busy ? 'Se trimite…' : 'Trimite';
  resendButton.disabled = busy || lastRequest === null;
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function handleResponse(status, data) {
  if (status === 201) {
    const notify = data.notifyStatus === 'SENT'
      ? 'Echipa a fost notificată.'
      : 'Cererea e salvată, dar notificarea nu a putut fi trimisă.';
    showResult('success', `Cererea #${data.leadId} a fost înregistrată (${data.category}). ${notify}`);
  } else if (status === 200 && data?.duplicate) {
    showResult('info', `Cererea #${data.leadId} era deja înregistrată. Nu s-a creat un duplicat.`);
  } else if (status === 400) {
    const details = data?.details?.join('; ') ?? 'date invalide';
    showResult('error', `Cererea nu e validă: ${details}`);
  } else {
    showResult('error', 'Serviciul nu e disponibil momentan. Încearcă din nou peste puțin timp.');
  }
}

async function send(payload) {
  setBusy(true);
  try {
    const response = await fetch('/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = await readJson(response);
    handleResponse(response.status, data);

    if (response.status === 201) {
      form.reset();
      updateCounter();
    }
    await loadLeads();
  } catch (err) {
    const text = err.name === 'TimeoutError'
      ? 'Serverul nu a răspuns la timp. Poți folosi „Retrimite”: nu se va crea un duplicat.'
      : 'Nu m-am putut conecta la server.';
    showResult('error', text);
  } finally {
    setBusy(false);
  }
}

function renderLeads(leads) {
  const rows = leads.map((lead) => {
    const row = document.createElement('tr');
    const values = [
      lead.leadId,
      lead.category,
      lead.message,
      lead.notifyStatus,
      new Date(lead.createdAt).toLocaleString('ro-RO'),
    ];
    for (const value of values) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    return row;
  });
  leadsBody.replaceChildren(...rows);
}

async function loadLeads() {
  try {
    const response = await fetch('/api/leads?limit=10', { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderLeads(await response.json());
  } catch (err) {
    console.error('Could not load leads:', err.message);
  }
}

messageInput.addEventListener('input', updateCounter);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) {
    showResult('error', 'Scrie un mesaj înainte de trimitere.');
    return;
  }
  lastRequest = {
    requestId: crypto.randomUUID(),
    correlationId: `web-${crypto.randomUUID()}`,
    message,
  };
  send(lastRequest);
});

resendButton.addEventListener('click', () => send(lastRequest));

loadLeads();
