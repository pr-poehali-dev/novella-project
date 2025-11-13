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
    text: 'Тронный зал погружён в полумрак. Дарк Какао сидит на троне, его взгляд прикован к тебе. Вчера он снова сорвался на придворных... но с тобой он всегда спокоен. Слишком спокоен.',
    choices: [
      { text: 'Подойти ближе к трону', next: 'approach', affection: 2 },
      { text: 'Остаться на расстоянии, доложить о делах', next: 'distance', affection: -1 },
      { text: 'Предложить прогуляться по замку', next: 'walk', affection: 1 }
    ]
  },
  approach: {
    id: 'approach',
    background: 'bg-gradient-to-b from-purple-950 via-red-950 to-black',
    character: 'Дарк Какао',
    text: '«Аффогато...» — его голос звучит мягко, почти нежно. Он протягивает руку, и ты видишь, как его пальцы слегка дрожат. «Ты единственный, кто понимает меня. Единственный, кто не боится.» Его глаза горят странным огнём.',
    choices: [
      { text: 'Взять его руку', next: 'take_hand', affection: 3 },
      { text: 'Отступить, сохраняя дистанцию', next: 'retreat', affection: -2 }
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
  walk: {
    id: 'walk',
    background: 'bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900',
    character: 'Дарк Какао',
    text: '«Прогулка?» — король медленно встаёт. «Отличная идея. Только мы вдвоём.» Он делает знак стражникам покинуть зал. Ты остаёшься наедине с ним в пустом коридоре. «Знаешь, я бы сжёг это королевство дотла, если бы ты попросил.»',
    choices: [
      { text: 'Улыбнуться: «Я знаю»', next: 'smile', affection: 2 },
      { text: 'Попытаться сменить тему', next: 'change_topic', affection: -1 }
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