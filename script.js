/ Przełączanie zakładek
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

// Baza odpowiedzi bota
var responses = [
  {
    match: ['kontakt', 'telefon', 'adres', 'email', 'e-mail', 'skontaktować'],
    reply: 'Dane kontaktowe urzędu: tel. <strong>800-000-000</strong> (pon.–pt. 8:00–16:00), e-mail: urzad@gov.pl. Szczegółowe informacje znajdziesz w zakładce <em>Informacje</em>.'
  },
  {
    match: ['godzin', 'otwart', 'czas', 'kiedy'],
    reply: 'Urząd jest czynny od <strong>poniedziałku do piątku, 8:00–16:00</strong>. W środy przyjmujemy do 18:00. Soboty i niedziele – nieczynne.'
  },
  {
    match: ['wniosek', 'dokument', 'złożyć', 'sprawa', 'złóż'],
    reply: 'Wnioski i dokumenty można składać: osobiście w urzędzie, przez platformę <strong>ePUAP</strong> lub system <strong>Obywatel.gov.pl</strong>. Wymagany profil zaufany.'
  },
  {
    match: ['opłat', 'koszt', 'cena', 'ile'],
    reply: 'Wysokość opłat zależy od rodzaju sprawy. Większość zaświadczeń kosztuje <strong>17 zł</strong> (opłata skarbowa). Szczegóły znajdziesz w cenniku usług.'
  },
  {
    match: ['pesel', 'dowód', 'paszport', 'rejestr'],
    reply: 'Sprawy związane z dokumentami tożsamości obsługuje Wydział Ewidencji Ludności (pok. 101). Wymagany wcześniejszy <strong>termin wizyty</strong>.'
  }
];

// Pobranie aktualnego czasu
function getTime() {
  return new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

// Dodanie wiadomości do czatu
function addMessage(text, isUser) {
  var messages = document.getElementById('messages');
  var typing = document.getElementById('typing');

  var div = document.createElement('div');
  div.className = 'msg ' + (isUser ? 'user' : 'bot');

  var avatarHTML = isUser
    ? '<div class="msg-avatar user-av">Ty</div>'
    : '<div class="msg-avatar bot-av"><i class="ti ti-robot"></i></div>';

  div.innerHTML = avatarHTML
    + '<div>'
    + '<div class="msg-bubble">' + text + '</div>'
    + '<div class="msg-time">' + getTime() + '</div>'
    + '</div>';

  messages.insertBefore(div, typing);
  messages.scrollTop = messages.scrollHeight;
}

// Wysłanie wiadomości
function sendMessage() {
  var input = document.getElementById('userInput');
  var text = input.value.trim();

  if (text === '') {
    alert('Wpisz pytanie.');
    return;
  }

  addMessage(text, true);
  input.value = '';

  var typing = document.getElementById('typing');
  typing.classList.add('show');
  document.getElementById('messages').scrollTop = 99999;

  setTimeout(function() {
    typing.classList.remove('show');

    var lower = text.toLowerCase();
    var reply = 'Nie mogę potwierdzić tej informacji w bazie wiedzy. Proszę skontaktować się bezpośrednio z operatorem lub odwiedź zakładkę <em>Informacje</em>.';

    for (var i = 0; i < responses.length; i++) {
      var found = responses[i].match.some(function(keyword) {
        return lower.includes(keyword);
      });
      if (found) {
        reply = responses[i].reply;
        break;
      }
    }

    addMessage(reply, false);
  }, 900 + Math.random() * 400);
}

// Wstawianie gotowego pytania
function insertQuestion(question) {
  document.getElementById('userInput').value = question;
  sendMessage();
}

// Rozwijanie/zwijanie FAQ
function toggleFaq(el) {
  var item = el.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) {
    i.classList.remove('open');
  });
  if (!wasOpen) {
    item.classList.add('open');
  }
}

// Obsługa klawisza Enter w polu tekstowym
document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
