/* =========================================================
   CYBERWISE - data.js
   All the DATA used by the site (arrays and objects).
   Loaded first on every page.
   ========================================================= */
'use strict';

const CYBER_TIPS = [
  'Turn on two-factor authentication (2FA) for your email first. It protects all your other accounts.',
  'A long passphrase of random words is stronger and easier to remember than a short complex password.',
  'Never share your OTP or verification code with anyone, even if they say they are from support.',
  'Hover over a link before you click it to see where it really goes.',
  'Free Wi-Fi is convenient but risky. Avoid banking or logging in to important accounts on it.',
  'Update your phone and apps. Updates fix security holes that attackers use.',
  'If a message creates panic or urgency, slow down. Scammers rely on rushing you.'
];

// Threat data. Each threat has a category: scam, malware or account
const THREATS = [
  { cat: 'scam', emoji: '🎣', name: 'Phishing', short: 'Fake emails and messages that steal logins',
    what: 'Attackers pretend to be a trusted company, school or friend to trick you into entering your password or personal data on a fake page.',
    signs: ['Urgent or scary wording ("Your account will be closed!")', 'Sender address or link looks slightly wrong (like paypa1.com)', 'Generic greeting and spelling mistakes', 'Asks you to log in through a link'],
    safe: ['Do not click. Open the official site or app yourself.', 'Check the real sender address and hover over links.', 'Report and delete the message.'] },
  { cat: 'scam', emoji: '📱', name: 'Smishing and Vishing', short: 'Scams by text message and phone call',
    what: 'Smishing is phishing through SMS. Vishing is phishing through voice calls. They claim to be a bank, delivery service, prize promo or government office.',
    signs: ['Unknown number with a link to "claim" or "track" something', 'Caller asks for OTP, PIN or card details', 'Pressure to act right now'],
    safe: ['Never give OTP, PIN or passwords by text or call.', 'Hang up and call the official number yourself.', 'Block and report the number.'] },
  { cat: 'scam', emoji: '🧠', name: 'Social Engineering', short: 'Tricking people instead of hacking computers',
    what: 'Attackers manipulate emotions such as fear, trust or curiosity to make you give information or access. This includes fake job offers, fake scholarships and friends asking for load or money.',
    signs: ['Too good to be true offers', 'Someone you just met online asks for personal details', 'A friend suddenly asks for money or a code'],
    safe: ['Verify through another channel, like calling the friend.', 'Share personal details only when you are sure who is asking.', 'Take your time before you act.'] },
  { cat: 'malware', emoji: '🦠', name: 'Malware (Viruses, Trojans, Spyware)', short: 'Harmful software that damages or spies',
    what: 'Malware is software made to harm your device or steal data. A trojan pretends to be useful, such as a cracked game, free movie player or fake app. Spyware secretly watches what you do.',
    signs: ['Device suddenly slow or full of pop-ups', 'Apps you did not install', 'Free "cracked" software or random download buttons'],
    safe: ['Install apps only from official stores.', 'Use antivirus and keep it updated.', 'Do not plug in unknown USB drives.'] },
  { cat: 'malware', emoji: '🔒', name: 'Ransomware', short: 'Locks your files and demands payment',
    what: 'Ransomware encrypts your files and asks for money to unlock them. It often arrives by a malicious email attachment or download.',
    signs: ['Files cannot be opened and have strange extensions', 'A message demands payment', 'Started after opening an attachment'],
    safe: ['Keep regular backups, including one offline copy.', 'Do not open unexpected attachments.', 'Disconnect from the internet and ask for help.'] },
  { cat: 'account', emoji: '🔁', name: 'Weak and Reused Passwords', short: 'The easiest door for attackers',
    what: 'If you reuse one password, a leak from one website lets attackers try it on your other accounts. This is called credential stuffing. Short and common passwords are guessed quickly.',
    signs: ['Same password on many sites', 'Password based on name or birthday', 'Passwords like 123456 or qwerty'],
    safe: ['Use a unique long passphrase for each important account.', 'Use a password manager.', 'Turn on 2FA.'] },
  { cat: 'account', emoji: '📶', name: 'Unsafe Public Wi-Fi', short: 'Fake or unprotected hotspots',
    what: 'Attackers can set up a fake hotspot with a name like a real one (an "evil twin") or watch traffic on unprotected networks to capture what you type.',
    signs: ['Open Wi-Fi with no password', 'Two networks with almost the same name', 'Pop-up page asking for personal details to connect'],
    safe: ['Use mobile data for sensitive tasks.', 'Use a trusted VPN if you must use public Wi-Fi.', 'Look for HTTPS and avoid logging in to important accounts.'] },
  { cat: 'account', emoji: '🪪', name: 'Identity Theft and Account Takeover', short: 'Someone pretends to be you',
    what: 'When attackers get enough of your personal information, they can open accounts, scam your contacts or take over your social media while pretending to be you.',
    signs: ['Login alerts from places you have not been', 'Friends receive strange messages from your account', 'You are logged out and the password stops working'],
    safe: ['Change your password right away and enable 2FA.', 'Log out of other devices.', 'Tell your friends and report to the platform.'] }
];

// Online privacy checklist
const PRIVACY_TIPS = [
  { id: 'p1', title: 'Set social media accounts to private', note: 'Limit who can see your posts, photos and friend list.' },
  { id: 'p2', title: 'Turn on 2FA for your email and social accounts', note: 'Use an authenticator app or SMS code as a second step.' },
  { id: 'p3', title: 'Do not post your address, phone number or school ID', note: 'Strangers can use these details to find or impersonate you.' },
  { id: 'p4', title: 'Turn off location tagging on photos', note: 'Photos can reveal where you live, study or hang out.' },
  { id: 'p5', title: 'Review app permissions', note: 'A flashlight app does not need your contacts or microphone.' },
  { id: 'p6', title: 'Log out of shared and public computers', note: 'Also clear saved passwords and close the browser.' },
  { id: 'p7', title: 'Use a screen lock on your phone', note: 'Use a PIN or fingerprint so a lost phone stays protected.' },
  { id: 'p8', title: 'Think before you post or share', note: 'Anything online can be copied or screenshotted and may stay forever.' },
  { id: 'p9', title: 'Check your logged-in devices and sessions', note: 'Remove devices you do not recognise.' },
  { id: 'p10', title: 'Unsubscribe and delete accounts you no longer use', note: 'Fewer accounts means fewer places for data to leak.' }
];

// Quiz questions. IMPORTANT: options[0] is ALWAYS the correct answer.
// The game shuffles the options before showing them.
const QUESTIONS = [
  { cat: 'PASSWORDS', q: 'Which password is the strongest?',
    options: ['blue-tiger-lamp-ocean-92', 'Password123!', 'Sunshine2024', 'qwerty'],
    why: 'Length matters most. A long passphrase of random words is hard to guess. The others are common patterns.' },
  { cat: 'PHISHING', q: 'An email says: "Your account will be closed in 24 hours. Click here to verify." What is it most likely?',
    options: ['A phishing attempt', 'A normal reminder', 'A prize notice', 'A software update'],
    why: 'Urgent threats and "click here" links are classic phishing signs. Go to the official site yourself instead.' },
  { cat: 'ACCOUNTS', q: 'What does two-factor authentication (2FA) add?',
    options: ['A second proof of identity besides your password', 'Faster login', 'More storage space', 'A free antivirus'],
    why: '2FA asks for something more, like a code, so a stolen password alone is not enough.' },
  { cat: 'NETWORK', q: 'You are at a cafe using free Wi-Fi. What is the safest choice?',
    options: ['Use mobile data for banking or important logins', 'Log in to your bank on the free Wi-Fi', 'Share your password with the cafe staff', 'Turn off your screen lock'],
    why: 'Public Wi-Fi can be fake or watched. Mobile data or a trusted VPN is safer for sensitive tasks.' },
  { cat: 'WEB', q: 'What does the padlock (HTTPS) in the browser mean?',
    options: ['The connection to the site is encrypted', 'The website is 100% safe', 'The site is owned by the government', 'The site has no ads'],
    why: 'HTTPS protects the connection. Scam sites can also use HTTPS, so still check the address.' },
  { cat: 'MALWARE', q: 'What is ransomware?',
    options: ['Malware that locks your files and demands payment', 'A free file-sharing tool', 'A type of firewall', 'A password manager'],
    why: 'Ransomware encrypts your files. Regular offline backups are the best defence.' },
  { cat: 'SOCIAL', q: 'A friend\'s account sends: "Is this you in this video?" with a link. What should you do?',
    options: ['Do not click and ask your friend through another channel', 'Click it to see', 'Forward it to others', 'Reply with your password'],
    why: 'Hacked accounts spread links to contacts. Confirm with your friend another way, like a call.' },
  { cat: 'PASSWORDS', q: 'What is the best way to handle many different passwords?',
    options: ['Use a password manager', 'Reuse one strong password', 'Save them in a public note', 'Use your birthday for all'],
    why: 'A password manager creates and stores unique passwords so you only remember one master passphrase.' },
  { cat: 'PHISHING', q: 'What is "smishing"?',
    options: ['Phishing through SMS text messages', 'Phishing through voice calls only', 'A kind of antivirus', 'A fast Wi-Fi mode'],
    why: 'Smishing = SMS + phishing. Do not tap links in unexpected texts.' },
  { cat: 'UPDATES', q: 'Why should you install software updates?',
    options: ['They fix security holes', 'They always make the phone faster', 'They delete your data', 'They are only for new features'],
    why: 'Attackers use known weaknesses. Updates patch them.' },
  { cat: 'SOCIAL', q: 'What is social engineering?',
    options: ['Tricking people into giving information or access', 'Building social media apps', 'A way to speed up the internet', 'Cleaning a computer'],
    why: 'It targets human emotions such as fear, trust and curiosity rather than computers.' },
  { cat: 'MALWARE', q: 'You find a USB flash drive in the school parking lot. What should you do?',
    options: ['Do not plug it in and hand it to IT or the school office', 'Plug it in to find the owner', 'Format it and use it', 'Share the files with classmates'],
    why: 'Unknown USB drives can carry malware that runs automatically.' },
  { cat: 'PRIVACY', q: 'Which of these is generally OK to post publicly?',
    options: ['Your favorite movie genre', 'Your home address', 'A photo of your school ID', 'Your OTP code'],
    why: 'Personal identifiers can be used for scams and identity theft. General interests are low risk.' },
  { cat: 'ACCOUNTS', q: 'Someone calls and asks for the OTP you just received. What do you do?',
    options: ['Never share it and end the call', 'Share it if they sound polite', 'Share only half of it', 'Post it to prove who you are'],
    why: 'An OTP is a secret key to your account. Real companies never ask for it.' },
  { cat: 'PASSWORDS', q: 'Why is reusing the same password on many sites dangerous?',
    options: ['One data leak can expose all your accounts', 'It makes sites slower', 'It uses more storage', 'It is not dangerous'],
    why: 'Attackers try leaked passwords on other sites. This is called credential stuffing.' },
  { cat: 'PHISHING', q: 'Which sender address is most suspicious?',
    options: ['support@paypa1-security.com', 'support@paypal.com', 'noreply@paypal.com', 'service@paypal.com'],
    why: 'Look-alike domains swap letters for numbers, such as "l" to "1".' },
  { cat: 'MALWARE', q: 'Malware that pretends to be a useful program is called a...',
    options: ['Trojan', 'Firewall', 'Router', 'Browser'],
    why: 'Like the Trojan horse, it looks helpful but hides harmful code.' },
  { cat: 'ACCOUNTS', q: 'You think your account was hacked. What is the best FIRST step?',
    options: ['Change the password from a safe device and enable 2FA', 'Ignore it', 'Create a new account and say nothing', 'Delete your phone contacts'],
    why: 'Secure the account quickly, log out other sessions and warn your contacts.' },
  { cat: 'PHISHING', q: 'How can you check where a link goes before clicking?',
    options: ['Hover over it to preview the real address', 'Click it quickly', 'Look at the link color', 'Check how many emojis it has'],
    why: 'The text of a link can lie. The preview shows the real destination.' },
  { cat: 'PRIVACY', q: 'What is a good privacy setting for your social media profile?',
    options: ['Limit posts to friends and review who can see them', 'Make everything public', 'Accept every friend request', 'Share your location in every post'],
    why: 'Limiting your audience reduces the information strangers can collect.' },
  { cat: 'PHISHING', q: 'Which is a red flag of a scam message?',
    options: ['All of these: urgency, a generic greeting and a strange link', 'Urgent threats only', 'A generic greeting only', 'A strange link only'],
    why: 'Scam messages often combine several warning signs. Any one of them is reason to slow down.' },
  { cat: 'MALWARE', q: 'A site offers a free new movie, but asks you to install a "special player". What should you do?',
    options: ['Leave the site. It is likely malware', 'Install it quickly', 'Disable antivirus first', 'Share the link'],
    why: 'Fake players and cracked software are a common way to spread malware.' },
  { cat: 'PRIVACY', q: 'What is shoulder surfing?',
    options: ['Someone watching your screen or keypad to steal information', 'A type of virus', 'A Wi-Fi speed test', 'A browser extension'],
    why: 'Cover your PIN, and be careful typing passwords in crowded places.' },
  { cat: 'BACKUP', q: 'Why are regular backups important for security?',
    options: ['You can recover files after ransomware or loss', 'They make the internet faster', 'They stop all hackers', 'They are needed for 2FA'],
    why: 'Backups let you restore your files without paying criminals.' }
];

const QUIZ_LENGTH = 10;     // questions per game
const QUESTION_TIME = 15;   // seconds per question

/* ---------- localStorage keys ---------- */
const KEY_SCORES  = 'cyberwise_scores';
const KEY_PLAYER  = 'cyberwise_player';
const KEY_STATS   = 'cyberwise_stats';
const KEY_PRIVACY = 'cyberwise_privacy';
const KEY_SOUND   = 'cyberwise_sound';
