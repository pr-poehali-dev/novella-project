import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Choice {
  text: string;
  next: string;
  affection?: number;
}

interface Scene {
  id: string;
  background: string;
  character: string;
  text: string;
  choices?: Choice[];
  isEnding?: boolean;
}

const scenes: Record<string, Scene> = {
  start: {
    id: 'start',
    background: 'bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900',
    character: 'Аффогато',
    text: 'Тронный зал погружён в полумрак. За высокими окнами бушует метель — в горах королевства вечная зима. Дарк Какао сидит на троне, его взгляд прикован к тебе. Вчера он снова сорвался на придворных... но с тобой он всегда спокоен. Слишком спокоен.',
    choices: [
      { text: 'Подойти ближе к трону', next: 'approach', affection: 2 },
      { text: 'Остаться на расстоянии, доложить о делах', next: 'distance', affection: -1 },
      { text: 'Предложить прогуляться в зимнем саду', next: 'garden_walk', affection: 1 }
    ]
  },
  approach: {
    id: 'approach',
    background: 'bg-gradient-to-b from-purple-950 via-red-950 to-black',
    character: 'Дарк Какао',
    text: '«Аффогато...» — его голос звучит мягко, почти нежно. Он протягивает руку, и ты видишь, как его пальцы слегка дрожат. «Ты единственный, кто понимает меня. Единственный, кто не боится.» Его глаза горят странным огнём.',
    choices: [
      { text: 'Взять его руку', next: 'take_hand', affection: 3 },
      { text: 'Отступить, сохраняя дистанцию', next: 'retreat', affection: -2 },
      { text: 'Предложить устроить ужин вдвоём', next: 'dinner_offer', affection: 2 }
    ]
  },
  distance: {
    id: 'distance',
    background: 'bg-gradient-to-b from-slate-900 via-red-900 to-black',
    character: 'Дарк Какао',
    text: 'Король хмурится. «Дела...» — повторяет он с холодной усмешкой. «Всё, что мне нужно — прямо передо мной.» Воздух становится тяжёлым. «Почему ты отдаляешься, Аффогато?»',
    choices: [
      { text: 'Извиниться и подойти', next: 'apologize', affection: 1 },
      { text: 'Настоять на важности государственных дел', next: 'insist', affection: -3 }
    ]
  },
  garden_walk: {
    id: 'garden_walk',
    background: 'bg-gradient-to-b from-slate-800 via-blue-950 to-purple-950',
    character: 'Дарк Какао',
    text: 'Зимний сад укрыт снегом. Ледяные скульптуры сверкают в лунном свете, замёрзшие фонтаны застыли как памятники. «Красиво, не правда ли?» — король берёт тебя за руку. Его прикосновение холодное. «Как и ты. Холодный, безупречный... мой.» За деревьями мелькает тень — кто-то из слуг.',
    choices: [
      { text: 'Окликнуть слугу для вопроса', next: 'call_servant', affection: -4 },
      { text: 'Игнорировать слугу, сосредоточиться на короле', next: 'focus_king', affection: 3 },
      { text: 'Предложить вернуться в тепло замка', next: 'return_castle', affection: 1 }
    ]
  },
  take_hand: {
    id: 'take_hand',
    background: 'bg-gradient-to-b from-red-950 via-purple-950 to-black',
    character: 'Дарк Какао',
    text: 'Его пальцы сжимают твою руку с неожиданной силой. «Никогда не отпущу,» — шепчет он. «Никто не заберёт тебя у меня. Никто.» В его глазах читается одержимость, граничащая с безумием. Ты понимаешь — ты в ловушке.',
    choices: [
      { text: 'Принять его одержимость', next: 'ending_obsession', affection: 5 },
      { text: 'Попытаться освободиться', next: 'try_escape', affection: -5 }
    ]
  },
  retreat: {
    id: 'retreat',
    background: 'bg-gradient-to-b from-red-900 via-black to-slate-900',
    character: 'Дарк Какао',
    text: 'Лицо короля искажается. «Отступаешь?» Температура в зале падает. «От МЕНЯ?» Его голос срывается на крик. Стражники врываются в зал, но Дарк Какао останавливает их жестом. «Выйдите. Аффогато останется.»',
    choices: [
      { text: 'Умолять о прощении', next: 'beg', affection: 0 },
      { text: 'Бежать к выходу', next: 'ending_escape_attempt', affection: -10 }
    ]
  },
  apologize: {
    id: 'apologize',
    background: 'bg-gradient-to-b from-purple-900 via-slate-900 to-black',
    character: 'Дарк Какао',
    text: '«Извинения...» — его лицо смягчается. «Я прощаю тебя. Всегда прощаю.» Он встаёт и обнимает тебя. «Потому что ты — моё всё.» Объятие становится всё крепче.',
    choices: [
      { text: 'Обнять в ответ', next: 'ending_acceptance', affection: 3 },
      { text: 'Остаться неподвижным', next: 'ending_resignation', affection: 0 }
    ]
  },
  insist: {
    id: 'insist',
    background: 'bg-gradient-to-b from-red-950 via-black to-red-900',
    character: 'Дарк Какао',
    text: 'Король медленно поднимается. Его аура становится удушающей. «Дела важнее меня?» — в его голосе слышна боль и ярость одновременно. «Тогда посмотрим, что для тебя важнее — когда всё остальное сгорит.»',
    choices: [
      { text: 'Сказать, что он важнее всего', next: 'ending_submission', affection: 2 }
    ]
  },
  smile: {
    id: 'smile',
    background: 'bg-gradient-to-b from-purple-950 via-red-950 to-black',
    character: 'Дарк Какао',
    text: '«Ты знаешь...» — он прижимает тебя к стене коридора. «Значит, ты понимаешь, что значишь для меня.» Его дыхание обжигает твоё лицо. «Мы созданы друг для друга. Навсегда.»',
    choices: [
      { text: 'Согласиться: «Навсегда»', next: 'ending_obsession', affection: 5 }
    ]
  },
  change_topic: {
    id: 'change_topic',
    background: 'bg-gradient-to-b from-slate-900 via-purple-900 to-red-900',
    character: 'Дарк Какао',
    text: '«Не меняй тему.» Его голос становится холодным. «Почему ты игнорируешь мои слова? Я открываю тебе душу, а ты...» Он замолкает, и тишина становится оглушительной.',
    choices: [
      { text: 'Признаться в своих чувствах', next: 'ending_confession', affection: 3 }
    ]
  },
  beg: {
    id: 'beg',
    background: 'bg-gradient-to-b from-black via-purple-950 to-slate-900',
    character: 'Дарк Какао',
    text: '«Прощения...» — он присаживается перед тобой. «Я не хочу твоих извинений. Я хочу твоего сердца.» Он поднимает твой подбородок. «И я его получу. Так или иначе.»',
    choices: [
      { text: 'Отдать своё сердце', next: 'ending_devotion', affection: 4 }
    ]
  },
  try_escape: {
    id: 'try_escape',
    background: 'bg-gradient-to-b from-red-950 via-black to-red-900',
    character: 'Дарк Какао',
    text: 'Ты пытаешься вырваться, но его хватка железная. «Куда ты?» — в его голосе смесь боли и гнева. «Думал, ты сможешь сбежать? От меня? Глупец.» Двери зала захлопываются.',
    choices: [
      { text: 'Перестать сопротивляться', next: 'ending_captivity', affection: -3 }
    ]
  },
  call_servant: {
    id: 'call_servant',
    background: 'bg-gradient-to-b from-red-950 via-black to-red-950',
    character: 'Дарк Какао',
    text: '«Стой!» — кричишь ты слуге. Рука короля сжимается на твоём запястье. Температура падает на десятки градусов. «Ты... окликаешь других? Когда я рядом с тобой?» Его голос ледяной. Слуга в ужасе убегает. «Похоже, ты забыл, кому принадлежишь.»',
    choices: [
      { text: 'Попытаться объяснить', next: 'explain_servant', affection: -2 },
      { text: 'Извиниться', next: 'apologize_jealousy', affection: 0 }
    ]
  },
  focus_king: {
    id: 'focus_king',
    background: 'bg-gradient-to-b from-purple-900 via-slate-800 to-blue-950',
    character: 'Дарк Какао',
    text: 'Ты игнорируешь слугу, сосредотачиваясь на короле. Его лицо смягчается. «Умница,» — шепчет он, притягивая тебя ближе. «Мне не нравится делить твоё внимание.» Снег тихо падает вокруг вас. «Пойдём в мои покои. Там теплее.»',
    choices: [
      { text: 'Согласиться пойти в покои', next: 'kings_chamber', affection: 3 },
      { text: 'Предложить вместо этого ужин', next: 'dinner_offer', affection: 1 }
    ]
  },
  return_castle: {
    id: 'return_castle',
    background: 'bg-gradient-to-b from-slate-900 via-purple-900 to-black',
    character: 'Дарк Какао',
    text: '«В замок?» — он улыбается. «Замёрз? Тогда позволь мне согреть тебя.» Он ведёт тебя обратно длинными коридорами. «Я распорядился приготовить ужин. Только для нас двоих.»',
    choices: [
      { text: 'Принять приглашение на ужин', next: 'private_dinner', affection: 2 }
    ]
  },
  dinner_offer: {
    id: 'dinner_offer',
    background: 'bg-gradient-to-b from-purple-950 via-slate-900 to-black',
    character: 'Дарк Какао',
    text: '«Ужин вдвоём?» — его глаза загораются. «Какая прекрасная идея.» Он отдаёт приказы слугам, не выпуская твою руку. «Я хочу, чтобы никто не мешал нам. Никаких слуг в зале. Только ты и я.»',
    choices: [
      { text: 'Согласиться на уединённый ужин', next: 'private_dinner', affection: 2 },
      { text: 'Предложить пригласить советников', next: 'suggest_advisors', affection: -5 }
    ]
  },
  private_dinner: {
    id: 'private_dinner',
    background: 'bg-gradient-to-b from-red-900 via-purple-950 to-black',
    character: 'Дарк Какао',
    text: 'Огонь в камине освещает столовую. Король сидит напротив, его взгляд не отрывается от тебя. «Ты прекрасен в свете пламени,» — говорит он тихо. «Знаешь, я мечтал об этом. Только мы, без всего мира.» Он наполняет твой бокал вином. «Выпей за нас.»',
    choices: [
      { text: 'Выпить вино', next: 'drink_wine', affection: 2 },
      { text: 'Отказаться от вина', next: 'refuse_wine', affection: -1 },
      { text: 'Спросить о его чувствах', next: 'ask_feelings', affection: 1 }
    ]
  },
  suggest_advisors: {
    id: 'suggest_advisors',
    background: 'bg-gradient-to-b from-red-950 via-black to-red-950',
    character: 'Дарк Какао',
    text: '«Советников?» — его голос падает до опасного шёпота. «Ты хочешь ДРУГИХ людей за нашим столом?» Бокал в его руке трескается. «Тебе недостаточно моей компании?» Воздух наполняется убийственной аурой.',
    choices: [
      { text: 'Быстро отказаться от идеи', next: 'backtrack_advisors', affection: -2 },
      { text: 'Настаивать на работе', next: 'ending_locked_room', affection: -10 }
    ]
  },
  explain_servant: {
    id: 'explain_servant',
    background: 'bg-gradient-to-b from-red-900 via-black to-slate-900',
    character: 'Дарк Какао',
    text: 'Ты пытаешься объяснить, но он не слушает. «Объяснения... всегда объяснения.» Его хватка болезненна. «Может, тебе нужно время подумать о том, кто действительно важен.» Он щёлкает пальцами. Стража появляется из теней.',
    choices: [
      { text: 'Молча следовать за стражей', next: 'ending_locked_room', affection: -5 }
    ]
  },
  apologize_jealousy: {
    id: 'apologize_jealousy',
    background: 'bg-gradient-to-b from-purple-950 via-slate-900 to-black',
    character: 'Дарк Какао',
    text: '«Прости меня,» — шепчешь ты. Он останавливается. Медленно его хватка ослабевает. «Я просто... не выношу, когда ты смотришь на других.» Он притягивает тебя в объятия. «Обещай, что будешь видеть только меня.»',
    choices: [
      { text: 'Обещать', next: 'promise_king', affection: 3 },
      { text: 'Промолчать', next: 'stay_silent', affection: -1 }
    ]
  },
  kings_chamber: {
    id: 'kings_chamber',
    background: 'bg-gradient-to-b from-purple-950 via-red-950 to-black',
    character: 'Дарк Какао',
    text: 'Королевские покои роскошны. Огромная кровать с тёмными шёлковыми простынями, камин с ревущим огнём. Король закрывает дверь на ключ. «Наконец-то ты здесь,» — он подходит, снимая корону. «В этих стенах я не король. Я просто мужчина, который безумно любит тебя.»',
    choices: [
      { text: 'Принять его признание', next: 'accept_chamber', affection: 4 },
      { text: 'Попросить открыть дверь', next: 'ask_unlock', affection: -3 }
    ]
  },
  drink_wine: {
    id: 'drink_wine',
    background: 'bg-gradient-to-b from-red-950 via-purple-900 to-black',
    character: 'Дарк Какао',
    text: 'Вино сладкое, с привкусом специй. Король улыбается. «Хорошо?» Он встаёт и обходит стол, садясь рядом. «Я так долго ждал момента, когда мы будем вот так... близко.» Его рука ложится на твою. «Останься со мной этой ночью. В моих покоях.»',
    choices: [
      { text: 'Согласиться остаться', next: 'kings_chamber', affection: 3 },
      { text: 'Сказать, что нужно вернуться', next: 'refuse_stay', affection: -3 }
    ]
  },
  refuse_wine: {
    id: 'refuse_wine',
    background: 'bg-gradient-to-b from-slate-900 via-red-900 to-black',
    character: 'Дарк Какао',
    text: 'Ты отказываешься от вина. Король хмурится. «Не доверяешь мне?» — в его голосе слышна обида. «Или ты просто не хочешь пить со мной?» Температура в зале падает. «Всё, что я делаю — для тебя.»',
    choices: [
      { text: 'Взять бокал и выпить', next: 'drink_wine', affection: 1 },
      { text: 'Объяснить, что не пьёшь вино', next: 'explain_wine', affection: 0 }
    ]
  },
  ask_feelings: {
    id: 'ask_feelings',
    background: 'bg-gradient-to-b from-purple-900 via-red-950 to-black',
    character: 'Дарк Какао',
    text: '«Мои чувства?» — он смотрит на тебя с интенсивностью. «Я люблю тебя. Безумно. Одержимо. Настолько, что готов уничтожить всё, что встанет между нами.» Он встаёт, подходя. «Это любовь или проклятие? Не знаю. Но ты — моя судьба.»',
    choices: [
      { text: 'Ответить взаимностью', next: 'ending_confession', affection: 5 },
      { text: 'Попросить времени подумать', next: 'ask_time', affection: -2 }
    ]
  },
  backtrack_advisors: {
    id: 'backtrack_advisors',
    background: 'bg-gradient-to-b from-purple-950 via-slate-900 to-black',
    character: 'Дарк Какао',
    text: '«Нет, нет, забудь,» — быстро говоришь ты. «Только мы вдвоём.» Его лицо постепенно расслабляется. «Вот и хорошо.» Он обнимает тебя сзади. «Не заставляй меня ревновать. Я не контролирую себя, когда ревную.»',
    choices: [
      { text: 'Согласиться с ним', next: 'private_dinner', affection: 1 }
    ]
  },
  promise_king: {
    id: 'promise_king',
    background: 'bg-gradient-to-b from-purple-900 via-red-950 to-black',
    character: 'Дарк Какао',
    text: '«Обещаю,» — говоришь ты. Он целует твою руку. «Моё сокровище.» Снег перестаёт падать, как будто сама природа реагирует на его настроение. «Пойдём в мои покои. Хочу быть с тобой наедине.»',
    choices: [
      { text: 'Пойти в покои короля', next: 'kings_chamber', affection: 3 }
    ]
  },
  stay_silent: {
    id: 'stay_silent',
    background: 'bg-gradient-to-b from-slate-900 via-purple-950 to-black',
    character: 'Дарк Какао',
    text: 'Ты молчишь. Король отстраняется. «Молчание... Значит, ты не можешь обещать.» Его глаза наполняются болью и яростью. «Тогда мне придётся убедиться, что ты не будешь видеть никого кроме меня. Насильно.»',
    choices: [
      { text: 'Дать обещание сейчас', next: 'promise_king', affection: 1 },
      { text: 'Продолжить молчать', next: 'ending_locked_room', affection: -8 }
    ]
  },
  accept_chamber: {
    id: 'accept_chamber',
    background: 'bg-gradient-to-b from-red-950 via-purple-950 to-black',
    character: 'Дарк Какао',
    text: 'Ты принимаешь его признание. Он прижимает тебя к себе с отчаянной нежностью. «Наконец-то,» — шепчет он в твои волосы. «Наконец-то ты мой.» За окном воет метель, но здесь, в его объятиях, тепло. Опасно тепло.',
    choices: [
      { text: 'Остаться в его объятиях', next: 'ending_devotion', affection: 5 }
    ]
  },
  ask_unlock: {
    id: 'ask_unlock',
    background: 'bg-gradient-to-b from-red-950 via-black to-red-900',
    character: 'Дарк Какао',
    text: '«Открыть дверь?» — он застывает. «Ты хочешь уйти? От меня?» Его лицо искажается. «Я привёл тебя сюда, открыл душу, а ты...» Ключ исчезает в его кармане. «Нет. Ты останешься. Пока не поймёшь, что мы созданы друг для друга.»',
    choices: [
      { text: 'Смириться с ситуацией', next: 'ending_locked_room', affection: -4 }
    ]
  },
  refuse_stay: {
    id: 'refuse_stay',
    background: 'bg-gradient-to-b from-red-900 via-black to-slate-900',
    character: 'Дарк Какао',
    text: '«Вернуться?» — его голос становится ледяным. «Куда? К кому?» Он встаёт резко, опрокидывая стул. «Я предлагаю тебе своё сердце, свои покои, себя — а ты отказываешь?» Двери захлопываются.',
    choices: [
      { text: 'Передумать и согласиться', next: 'kings_chamber', affection: 0 },
      { text: 'Настаивать на уходе', next: 'ending_locked_room', affection: -7 }
    ]
  },
  explain_wine: {
    id: 'explain_wine',
    background: 'bg-gradient-to-b from-purple-950 via-slate-900 to-black',
    character: 'Дарк Какао',
    text: 'Ты объясняешь, что просто не пьёшь. Король смотрит на тебя долгим взглядом, затем кивает. «Понимаю.» Он убирает бокал. «Прости за подозрения. Я просто... боюсь потерять тебя. Настолько боюсь, что вижу угрозу везде.»',
    choices: [
      { text: 'Успокоить его', next: 'comfort_king', affection: 2 },
      { text: 'Сказать, что это нездорово', next: 'call_out_obsession', affection: -3 }
    ]
  },
  ask_time: {
    id: 'ask_time',
    background: 'bg-gradient-to-b from-slate-900 via-red-950 to-black',
    character: 'Дарк Какао',
    text: '«Время?» — его голос дрожит. «Сколько времени ещё? Я ждал месяцы. Годы.» Он хватает тебя за плечи. «Каждый день наблюдал, как ты улыбаешься другим. Время закончилось, Аффогато.»',
    choices: [
      { text: 'Принять его чувства', next: 'ending_confession', affection: 2 },
      { text: 'Попытаться уйти', next: 'try_leave', affection: -6 }
    ]
  },
  comfort_king: {
    id: 'comfort_king',
    background: 'bg-gradient-to-b from-purple-900 via-red-900 to-black',
    character: 'Дарк Какао',
    text: 'Ты кладёшь руку на его. «Я здесь,» — говоришь ты тихо. Он сжимает твою руку. «Обещай, что всегда будешь здесь.» Его глаза полны отчаяния и надежды одновременно. «Я не переживу, если ты уйдёшь.»',
    choices: [
      { text: 'Обещать остаться', next: 'ending_acceptance', affection: 4 },
      { text: 'Обещать быть рядом, но не навсегда', next: 'conditional_promise', affection: -2 }
    ]
  },
  call_out_obsession: {
    id: 'call_out_obsession',
    background: 'bg-gradient-to-b from-red-950 via-black to-red-900',
    character: 'Дарк Какао',
    text: '«Нездорово?» — он смеётся без юмора. «Ты думаешь, я не знаю? Моя любовь — это болезнь. Яд. Но я не хочу лечиться.» Он встаёт. «И ты станешь частью этой болезни. По своей воле... или нет.»',
    choices: [
      { text: 'Попытаться убежать', next: 'try_leave', affection: -8 },
      { text: 'Принять его таким, какой он есть', next: 'ending_resignation', affection: 0 }
    ]
  },
  try_leave: {
    id: 'try_leave',
    background: 'bg-gradient-to-b from-red-900 via-black to-red-950',
    character: 'Дарк Какао',
    text: 'Ты направляешься к двери. «Стой.» Его голос — приказ. Дверь замерзает, покрываясь льдом. «Никто не уходит от меня. Особенно ты.» Стража блокирует выход.',
    choices: [
      { text: 'Сдаться', next: 'ending_locked_room', affection: -6 }
    ]
  },
  conditional_promise: {
    id: 'conditional_promise',
    background: 'bg-gradient-to-b from-slate-900 via-purple-950 to-black',
    character: 'Дарк Какао',
    text: '«Не навсегда?» — он отпускает твою руку. «Значит, ты уже планируешь уйти.» Его голос холоден. «Мне не нужны условные обещания. Мне нужна вечность. С тобой.»',
    choices: [
      { text: 'Дать безусловное обещание', next: 'ending_acceptance', affection: 2 },
      { text: 'Настаивать на своих условиях', next: 'ending_locked_room', affection: -5 }
    ]
  },
  ending_locked_room: {
    id: 'ending_locked_room',
    background: 'bg-gradient-to-b from-black via-slate-900 to-purple-950',
    character: 'Конец: Запертая комната',
    text: 'Дверь захлопывается за тобой. Роскошная комната становится твоей клеткой. «Ты останешься здесь, пока не поймёшь,» — говорит Дарк Какао через дверь. «Никаких слуг. Никаких советников. Только я буду навещать тебя.» Дни превращаются в недели. Ты видишь только его. Постепенно весь мир сужается до одного человека. Возможно, это и было его планом с самого начала.',
    isEnding: true
  },
  ending_obsession: {
    id: 'ending_obsession',
    background: 'bg-gradient-to-b from-purple-950 via-red-950 to-black',
    character: 'Конец: Одержимость',
    text: 'Ты принял его одержимость. Дарк Какао больше не скрывает своих чувств — он запирает тебя в королевских покоях, не позволяя никому приближаться. Ты стал его единственной причиной существования, его драгоценностью, которую он никогда не отпустит. Королевство медленно погружается во тьму, но королю всё равно — у него есть ты.',
    isEnding: true
  },
  ending_escape_attempt: {
    id: 'ending_escape_attempt',
    background: 'bg-gradient-to-b from-black via-red-950 to-black',
    character: 'Конец: Неудачный побег',
    text: 'Ты бежишь к выходу, но не успеваешь. Стража хватает тебя по приказу короля. «Ты хотел сбежать...» — Дарк Какао смотрит на тебя с болью и яростью. «Значит, мне придётся сделать так, чтобы ты больше никогда не смог уйти.» Двери темницы закрываются за тобой. Но это не наказание — это его извращённая форма любви. Он навещает тебя каждый день.',
    isEnding: true
  },
  ending_acceptance: {
    id: 'ending_acceptance',
    background: 'bg-gradient-to-b from-purple-900 via-slate-900 to-black',
    character: 'Конец: Принятие',
    text: 'Ты обнимаешь его в ответ. Дарк Какао целует твой лоб, и ты чувствуешь, как напряжение покидает его тело. «Наконец-то ты понял,» — шепчет он. «Мы неразделимы.» С этого дня ты становишься не просто советником, а королевским консортом. Его тёмная любовь окутывает тебя, как шёлковая клетка.',
    isEnding: true
  },
  ending_resignation: {
    id: 'ending_resignation',
    background: 'bg-gradient-to-b from-slate-900 via-purple-950 to-black',
    character: 'Конец: Смирение',
    text: 'Ты не отвечаешь на его объятие, но и не сопротивляешься. Дарк Какао понимает — ты смирился со своей судьбой. «Ничего,» — говорит он тихо. «Со временем ты полюбишь меня так же сильно.» Он прав. Месяцы проходят, и границы между манипуляцией и реальностью стираются. Ты больше не знаешь, где заканчивается игра и начинается истина.',
    isEnding: true
  },
  ending_submission: {
    id: 'ending_submission',
    background: 'bg-gradient-to-b from-red-950 via-purple-950 to-black',
    character: 'Конец: Подчинение',
    text: '«Ты важнее всего,» — говоришь ты, и это правда. Дарк Какао улыбается — впервые за долгое время искренне. «Я знал, что ты поймёшь.» С того дня королевство становится свидетелем вашей токсичной связи. Все боятся короля, но ещё больше боятся тебя — человека, способного управлять яндере.',
    isEnding: true
  },
  ending_confession: {
    id: 'ending_confession',
    background: 'bg-gradient-to-b from-purple-900 via-red-900 to-black',
    character: 'Конец: Признание',
    text: '«Я... я тоже чувствую это,» — признаёшься ты. Дарк Какао замирает, его глаза расширяются. «Правда?» Он притягивает тебя в страстный поцелуй. «Тогда никто никогда не разлучит нас.» Ваши отношения становятся легендой королевства — тёмной, опасной легендой о любви, которая сожрала двух людей целиком.',
    isEnding: true
  },
  ending_devotion: {
    id: 'ending_devotion',
    background: 'bg-gradient-to-b from-purple-950 via-black to-purple-900',
    character: 'Конец: Преданность',
    text: '«Моё сердце твоё,» — говоришь ты. Дарк Какао берёт твою руку и прижимает к своей груди. «И моё — твоё.» С этого момента вы становитесь единым целым. Две тёмные души, нашедшие друг друга в королевстве теней. Никто не смеет встать у вас на пути.',
    isEnding: true
  },
  ending_captivity: {
    id: 'ending_captivity',
    background: 'bg-gradient-to-b from-black via-purple-950 to-red-950',
    character: 'Конец: В плену',
    text: 'Ты перестаёшь сопротивляться. «Умница,» — Дарк Какао гладит твои волосы. «Так гораздо лучше.» Ты проводишь дни в его покоях, окружённый роскошью, но лишённый свободы. Он заботится о тебе, ухаживает, любит... но никогда не отпускает. Ты его прекрасная птица в золотой клетке.',
    isEnding: true
  }
};

const Index = () => {
  const [currentScene, setCurrentScene] = useState<string>('start');
  const [affectionLevel, setAffectionLevel] = useState<number>(0);
  const [visitedScenes, setVisitedScenes] = useState<string[]>(['start']);

  const scene = scenes[currentScene];

  const handleChoice = (choice: Choice) => {
    setCurrentScene(choice.next);
    setVisitedScenes([...visitedScenes, choice.next]);
    if (choice.affection) {
      setAffectionLevel(affectionLevel + choice.affection);
    }
  };

  const restartStory = () => {
    setCurrentScene('start');
    setAffectionLevel(0);
    setVisitedScenes(['start']);
  };

  return (
    <div className={`min-h-screen ${scene.background} transition-all duration-1000 flex items-center justify-center p-4`}>
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-200 mb-2 drop-shadow-lg">
            Королевство Тёмного Какао
          </h1>
          <p className="text-purple-300 text-lg italic">Любовь, что сжигает дотла</p>
        </div>

        <Card className="bg-black/60 backdrop-blur-sm border-purple-700/50 p-8 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-amber-200">
              <Icon name="Crown" size={20} />
              <span className="font-semibold text-lg">{scene.character}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Heart" size={20} className={`${affectionLevel > 5 ? 'text-red-500' : affectionLevel > 0 ? 'text-pink-400' : 'text-gray-400'}`} />
              <span className="text-purple-300 text-sm">
                {affectionLevel > 5 ? 'Одержим' : affectionLevel > 0 ? 'Заинтересован' : affectionLevel < -3 ? 'Разгневан' : 'Нейтрален'}
              </span>
            </div>
          </div>

          <Separator className="bg-purple-700/30 mb-6" />

          <div className="mb-8">
            <p className="text-gray-100 text-lg leading-relaxed animate-fade-in">
              {scene.text}
            </p>
          </div>

          {scene.isEnding ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-4 text-center">
                <Icon name="BookMarked" size={32} className="mx-auto mb-2 text-amber-300" />
                <p className="text-gray-300 text-sm">
                  Посещено сцен: {visitedScenes.length} • Уровень одержимости: {affectionLevel}
                </p>
              </div>
              <Button 
                onClick={restartStory}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white"
              >
                <Icon name="RotateCcw" size={18} className="mr-2" />
                Начать заново
              </Button>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              {scene.choices?.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full bg-purple-900/60 hover:bg-purple-800/80 text-gray-100 border border-purple-600/40 justify-start text-left h-auto py-4 px-6 transition-transform duration-200 hover:scale-[1.02]"
                  variant="outline"
                >
                  <Icon name="ChevronRight" size={18} className="mr-2 flex-shrink-0" />
                  <span>{choice.text}</span>
                </Button>
              ))}
            </div>
          )}
        </Card>

        <div className="text-center mt-6 text-purple-300/60 text-sm animate-fade-in">
          <Icon name="AlertTriangle" size={16} className="inline mr-2" />
          Внимание: содержит тёмные темы и нездоровые отношения
        </div>
      </div>
    </div>
  );
};

export default Index;