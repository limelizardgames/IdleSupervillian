import type { GameState } from './state';

export type Speaker = 'villain' | 'mom' | 'kevin' | 'hero' | 'snivel' | 'narrator';

export interface Line {
  who: Speaker;
  text: string;
}

export interface StoryBeat {
  id: string;
  title: string;
  lines: Line[];
  /** When true for an unseen beat, it plays. Beats without a trigger are played explicitly. */
  trigger?: (s: GameState) => boolean;
}

export const SPEAKERS: Record<Speaker, { name: string; color: string }> = {
  villain: { name: 'You', color: '#b04dff' },
  mom: { name: 'Mom', color: '#ff7eb6' },
  kevin: { name: 'Kevin the Henchman', color: '#ffb02e' },
  hero: { name: 'Captain Righteous', color: '#2e8bff' },
  snivel: { name: 'Professor Snivel', color: '#3ddc84' },
  narrator: { name: '', color: '#cfc6e8' },
};

export const STORY: StoryBeat[] = [
  {
    id: 'intro',
    title: 'Chapter 1: Humble Beginnings',
    lines: [
      { who: 'narrator', text: 'Somewhere in the suburbs, beneath a house with a very nice lawn...' },
      { who: 'villain', text: 'At last! My EVIL LAIR is complete! Mwahahaha!' },
      { who: 'mom', text: "Sweetie, it's a basement. And you still haven't folded your laundry." },
      { who: 'villain', text: "MOTHER! It's {name} now! I have a cape and everything!" },
      { who: 'kevin', text: "Hi boss! I'm Kevin. I saw your flyer at the laundromat. Is there a dental plan?" },
      { who: 'villain', text: 'Kevin, together we shall CONQUER THE WORLD! ...Starting with the neighbors.' },
      { who: 'narrator', text: 'Tap yourself to cackle evilly and commit petty crimes. Then hire more henchmen to do the crimes for you!' },
    ],
  },
  {
    id: 'hench_10',
    title: 'Crowded Basement',
    trigger: (s) => s.gens[0] >= 10,
    lines: [
      { who: 'mom', text: 'Honey, why are there ten men in masks eating all my Pop-Tarts?' },
      { who: 'villain', text: 'They are my LOYAL MINIONS, Mother.' },
      { who: 'kevin', text: "These are great Pop-Tarts, Mrs. Boss's Mom." },
      { who: 'mom', text: "Well, at least you're making friends. Wipe your feet!" },
    ],
  },
  {
    id: 'pigeons',
    title: 'Winged Crime',
    trigger: (s) => s.gens[1] >= 1,
    lines: [
      { who: 'villain', text: 'Pigeons: nature\'s pickpockets. Nobody suspects a pigeon.' },
      { who: 'kevin', text: 'Boss, one of them just stole my wallet.' },
      { who: 'villain', text: "Excellent. It's working." },
    ],
  },
  {
    id: 'lair_1',
    title: 'Chapter 2: Moving Out',
    lines: [
      { who: 'villain', text: 'Pack the lava lamp, Kevin. We\'re moving to a WAREHOUSE!' },
      { who: 'mom', text: "Call me every Sunday! And wear your cape, it's chilly out there!" },
      { who: 'kevin', text: 'It smells like fish and broken dreams in here, boss. I love it.' },
      { who: 'villain', text: 'Room enough for CLONE VATS and a CALL CENTER. The warranty scam begins!' },
    ],
  },
  {
    id: 'hero_intro',
    title: 'A Challenger Appears!',
    lines: [
      { who: 'hero', text: 'HALT, evildoer! I am CAPTAIN RIGHTEOUS! Your jaywalking days are OVER!' },
      { who: 'villain', text: 'Curses! A do-gooder! Kevin, get the net!' },
      { who: 'kevin', text: 'We have a net?' },
      { who: 'narrator', text: 'Tap Captain Righteous when he flies by to foil his plans and swipe his lunch money!' },
    ],
  },
  {
    id: 'first_device',
    title: 'Science!',
    trigger: (s) => s.stats.devicesBuilt >= 1,
    lines: [
      { who: 'kevin', text: 'Boss! The Freeze Ray works!' },
      { who: 'villain', text: 'EXCELLENT! Freeze the city!' },
      { who: 'kevin', text: '...It only works on ice cream.' },
      { who: 'villain', text: 'Then we shall hold the world\'s ICE CREAM hostage! Build more devices. BIGGER ones.' },
    ],
  },
  {
    id: 'lair_2',
    title: 'Chapter 3: Hot Property',
    lines: [
      { who: 'villain', text: 'A VOLCANO LAIR! Finally, proper supervillain real estate!' },
      { who: 'snivel', text: 'Professor Snivel, at your service. Fired from three universities for "ethics violations." Ethics. Pah!' },
      { who: 'villain', text: 'You\'re hired. Build me LABORATORIES. And ROBOTS. With LASERS.' },
      { who: 'kevin', text: 'Boss, is the floor supposed to be this hot?' },
    ],
  },
  {
    id: 'prestige_ready',
    title: 'The Hero Closes In',
    trigger: (s) => s.runEarned >= 1e11 && s.prestiges === 0,
    lines: [
      { who: 'hero', text: "I've tracked you to your lair, {name}! Your reign of mild inconvenience ends TODAY!" },
      { who: 'villain', text: 'Never! ...Well, maybe. Getting defeated WOULD make a great comeback story.' },
      { who: 'narrator', text: 'You can now Get Defeated by the Hero (Hero tab). You\'ll lose this empire but gain Infamy: permanent income bonuses forever!' },
    ],
  },
  {
    id: 'lair_3',
    title: 'Chapter 4: Deep Trouble',
    lines: [
      { who: 'villain', text: 'Under the sea! Where NO hero can ever find us!' },
      { who: 'hero', text: '(over the radio) Just so you know, I have a submarine.' },
      { who: 'villain', text: '...Of course he does.' },
      { who: 'kevin', text: 'Boss, the sharks have lasers! On their HEADS!' },
      { who: 'snivel', text: 'You\'re welcome.' },
    ],
  },
  {
    id: 'lair_4',
    title: 'Chapter 5: Over the Moon',
    lines: [
      { who: 'villain', text: 'THE MOON! From here I can hold the ENTIRE WORLD hostage!' },
      { who: 'mom', text: '(video call) Sweetie! Did you pack clean underwear?' },
      { who: 'villain', text: 'MOM! I\'m in the middle of a MONOLOGUE!' },
      { who: 'hero', text: 'No base is too far for JUSTICE! ...Hey, does anyone have a rocket I can borrow?' },
    ],
  },
  {
    id: 'mondays',
    title: 'The Ultimate Doomsday Device',
    trigger: (s) => !!s.devices['mondays'],
    lines: [
      { who: 'snivel', text: 'It is done. The Mondays Forever Device is armed.' },
      { who: 'villain', text: 'Every day... MONDAY! Humanity will BEG for Tuesday! Mwahahaha!' },
      { who: 'hero', text: 'You MONSTER! Even I have limits!' },
      { who: 'mom', text: 'Oh honey, that\'s just mean. I\'m so proud of you.' },
    ],
  },
  {
    id: 'defeat_1',
    title: 'Defeated... For Now',
    lines: [
      { who: 'hero', text: 'Justice prevails! Off to Villain Jail with you!' },
      { who: 'narrator', text: '{name} spent a grueling 20 minutes in Villain Jail before being released due to a paperwork error.' },
      { who: 'villain', text: "You haven't seen the last of me, Captain Righteous! I shall return... WITH INTEREST!" },
      { who: 'mom', text: "Welcome home, sweetie. I kept your room just the way you left it." },
      { who: 'kevin', text: 'I waited for you, boss! Also I ate your leftovers.' },
      { who: 'narrator', text: 'Your Infamy grows! Every defeat makes your next evil empire stronger. Spend Grudges on Legacy perks in the Hero tab.' },
    ],
  },
];

export const STORY_BY_ID: Record<string, StoryBeat> = Object.fromEntries(STORY.map((b) => [b.id, b]));

/** Quips shown after later defeats (random). */
export const DEFEAT_QUIPS: Line[][] = [
  [
    { who: 'hero', text: 'Again?! Do you ever learn?' },
    { who: 'villain', text: 'I learn EVERY time. That\'s the scary part.' },
  ],
  [
    { who: 'mom', text: 'Back so soon, sweetie? I just finished redecorating your lair... I mean, room.' },
    { who: 'villain', text: 'Mother, this is a STRATEGIC RETREAT.' },
  ],
  [
    { who: 'kevin', text: 'Boss! I kept the henchman seat warm!' },
    { who: 'villain', text: 'Good. Now go cool it down. It\'s weird.' },
  ],
  [
    { who: 'hero', text: 'My arch-nemesis... we meet yet again!' },
    { who: 'villain', text: 'Same time next week?' },
    { who: 'hero', text: '...Yeah, Tuesday works.' },
  ],
];

/** Short random flavor toasts that pop up while playing. */
export const FLAVOR: Line[] = [
  { who: 'mom', text: "Your little friends are tracking mud in!" },
  { who: 'mom', text: "Don't forget to take the trash out, Doctor Evil-pants." },
  { who: 'mom', text: 'I made meatloaf! Tell the henchmen to wash their hands.' },
  { who: 'kevin', text: 'Boss, is "Mwahaha" one word or three?' },
  { who: 'kevin', text: 'I put the "hench" in henchman, boss.' },
  { who: 'kevin', text: 'Can we get a vending machine in the lair?' },
  { who: 'snivel', text: 'The robots have unionized. Again.' },
  { who: 'snivel', text: 'I have created life! ...It is a very angry sandwich.' },
  { who: 'hero', text: 'Evil never pays! ...Wait, how much DOES it pay?' },
  { who: 'villain', text: 'Note to self: install a trap door. Several trap doors.' },
  { who: 'kevin', text: 'The pigeons stole the office coffee maker.' },
  { who: 'mom', text: 'Honey, your cape is in the dryer. It shrank a little.' },
];

export function fillName(text: string, s: GameState): string {
  return text.replace(/\{name\}/g, s.villainName || 'Doctor Doom-ish');
}

export function pendingTriggeredBeat(s: GameState): StoryBeat | null {
  for (const b of STORY) {
    if (b.trigger && !s.story[b.id] && b.trigger(s)) return b;
  }
  return null;
}
