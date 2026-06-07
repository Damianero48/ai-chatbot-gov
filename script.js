function showPage(name, tab) {
  document.querySelectorAll('.gov-page').forEach(function(p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.gov-tab').forEach(function(t) {
    t.classList.remove('active');
  });
  document.getElementById('page-' + name).classList.add('active');
  tab.classList.add('active');
}

var responses = [
  { match: ['kontakt', 'telefon', 'adres', 'email', 'skontaktowac'], reply: 'Dane kontaktowe: tel. <strong>800-000-000</strong>, e-mail: urzad@gov.pl' },
  { match: ['godzin', 'otwart', 'czas', 'kiedy'], reply: 'Urzad czynny <strong>pon.-pt. 8:00-16:00</strong>, sroda do 18:00.' },
  { match: ['wniosek', 'dokument', 'zlozyc', 'sprawa'], reply: 'Wnioski mozna skladac przez <strong>ePUAP</strong> lub <strong>Obywatel.gov.pl</strong>.' },
  { match: ['oplat', 'koszt', 'cena', 'ile'], reply: 'Wiekszosc zaswiadczen kosztuje <strong>17 zl</strong> (oplata skarbowa).' },
  { match: ['pesel', 'dowod', 'paszport', 'rejestr'], reply: 'Sprawy dokumentow: Wydzial Ewidencji Ludnosci, pok. 101.' }
];

function getTime() {
  return new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, isUser) {
  var messages = document.getElementById('messages');
  var typing = document.getElementById('typing');
  var div = document.createElement('div');
  div.className = 'msg ' + (isUser ? 'user' : 'bot');
  var avatarHTML = isUser
    ? '<div class="msg-avatar user-av">Ty</div>'
    : '<div class="msg-avatar bot-av"><i class="ti ti-robot"></i></div>';
  div.innerHTML = avatarHTML + '<div><div class="msg-bubble">' + text + '</div><div class="msg-time">' + getTime() + '</div></div>';
  messages.insertBefore(div, typing);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  var input = document.getElementById('userInput');
  var text = input.value.trim();
  if (text === '') { alert('Wpisz pytanie.'); return; }
  addMessage(text, true);
  input.value = '';
  var typing = document.getElementById('typing');
  typing.classList.add('show');
  document.getElementById('messages').scrollTop = 99999;
  setTimeout(function() {
    typing.classList.remove('show');
    var lower = text.toLowerCase();
    var reply = 'Nie moge potwierdzic tej informacji. Prosze skontaktowac sie z operatorem.';
    for (var i = 0; i < responses.length; i++) {
      if (responses[i].match.some(function(k) { return lower.includes(k); })) {
        reply = responses[i].reply;
        break;
      }
    }
    addMessage(reply, false);
  }, 900 + Math.random() * 400);
}

function insertQuestion(q) {
  document.getElementById('userInput').value = q;
  sendMessage();
}

function toggleFaq(el) {
  var item = el.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
}

document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendMessage();
});
