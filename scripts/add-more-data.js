const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

const newTricks = [
  // US tricks
  {
    id: Date.now().toString() + 'us1',
    title: 'Microwave Sponge Sanitizer',
    description: 'Sanitize kitchen sponges in 60 seconds using microwave',
    steps: ['Wet sponge thoroughly', 'Microwave for 60 seconds on high', 'Let cool before handling'],
    country: 'US',
    countryCode: 'US',
    difficulty: 'easy',
    tags: ['cleaning', 'kitchen', 'sanitize'],
    authorName: 'jennifer.clean@example.com',
    authorEmail: 'jennifer.clean@example.com',
    kudos: 15,
    views: 89,
    comments: 3,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 16).toISOString()
  },
  {
    id: Date.now().toString() + 'us2',
    title: 'Dryer Sheet Shoe Freshener',
    description: 'Keep shoes fresh overnight with dryer sheets',
    steps: ['Place dryer sheet in each shoe', 'Leave overnight', 'Remove in morning for fresh scent'],
    country: 'US',
    countryCode: 'US',
    difficulty: 'easy',
    tags: ['shoes', 'freshener', 'laundry'],
    authorName: 'mike.fresh@example.com',
    authorEmail: 'mike.fresh@example.com',
    kudos: 22,
    views: 134,
    comments: 5,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 17).toISOString()
  },
  // Japan tricks
  {
    id: Date.now().toString() + 'jp1',
    title: '冷蔵庫の野菜保存法',
    description: '野菜を長持ちさせる日本の伝統的な保存方法',
    steps: ['野菜を新聞紙で包む', '冷蔵庫の野菜室に立てて保存', '湿度を適度に保つ'],
    country: 'JP',
    countryCode: 'JP',
    difficulty: 'easy',
    tags: ['野菜', '保存', '冷蔵庫'],
    authorName: 'tanaka.yasai@example.com',
    authorEmail: 'tanaka.yasai@example.com',
    kudos: 18,
    views: 95,
    comments: 4,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString()
  },
  // Germany tricks
  {
    id: Date.now().toString() + 'de1',
    title: 'Kalkflecken entfernen',
    description: 'Deutsche Methode zur Entfernung von Kalkflecken',
    steps: ['Essig mit Wasser mischen (1:1)', 'Auf Kalkflecken auftragen', '10 Minuten einwirken lassen, abwischen'],
    country: 'DE',
    countryCode: 'DE',
    difficulty: 'easy',
    tags: ['reinigung', 'kalk', 'badezimmer'],
    authorName: 'mueller.sauber@example.com',
    authorEmail: 'mueller.sauber@example.com',
    kudos: 26,
    views: 156,
    comments: 7,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 19).toISOString()
  },
  // France tricks
  {
    id: Date.now().toString() + 'fr1',
    title: 'Détachant naturel au citron',
    description: 'Méthode française pour enlever les taches naturellement',
    steps: ['Frotter avec du citron et du sel', 'Laisser agir 15 minutes', 'Rincer à l\'eau froide'],
    country: 'FR',
    countryCode: 'FR',
    difficulty: 'easy',
    tags: ['détachant', 'citron', 'naturel'],
    authorName: 'marie.propre@example.com',
    authorEmail: 'marie.propre@example.com',
    kudos: 31,
    views: 187,
    comments: 8,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  // UK tricks
  {
    id: Date.now().toString() + 'gb1',
    title: 'Proper Scone Making',
    description: 'British secret for fluffy scones every time',
    steps: ['Keep ingredients cold', 'Don\'t overwork the dough', 'Brush tops with milk before baking'],
    country: 'GB',
    countryCode: 'GB',
    difficulty: 'medium',
    tags: ['baking', 'scones', 'british'],
    authorName: 'elizabeth.baker@example.com',
    authorEmail: 'elizabeth.baker@example.com',
    kudos: 42,
    views: 234,
    comments: 12,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 21).toISOString()
  },
  // Italy tricks
  {
    id: Date.now().toString() + 'it1',
    title: 'Conservare il Parmigiano',
    description: 'Come conservare il Parmigiano-Reggiano fresco più a lungo',
    steps: ['Avvolgere in carta pergamena', 'Poi in pellicola trasparente', 'Conservare in frigorifero'],
    country: 'IT',
    countryCode: 'IT',
    difficulty: 'easy',
    tags: ['formaggio', 'conservazione', 'parmigiano'],
    authorName: 'giuseppe.formaggio@example.com',
    authorEmail: 'giuseppe.formaggio@example.com',
    kudos: 35,
    views: 198,
    comments: 9,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString()
  },
  // Spain tricks
  {
    id: Date.now().toString() + 'es1',
    title: 'Gazpacho Perfecto',
    description: 'Secreto andaluz para el gazpacho más refrescante',
    steps: ['Usar tomates muy maduros', 'Añadir hielo al batir', 'Reposar en nevera 2 horas mínimo'],
    country: 'ES',
    countryCode: 'ES',
    difficulty: 'medium',
    tags: ['gazpacho', 'verano', 'andaluz'],
    authorName: 'carmen.sevilla@example.com',
    authorEmail: 'carmen.sevilla@example.com',
    kudos: 28,
    views: 167,
    comments: 6,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 23).toISOString()
  },
  // Canada tricks
  {
    id: Date.now().toString() + 'ca1',
    title: 'Maple Syrup Storage',
    description: 'Canadian way to keep maple syrup fresh',
    steps: ['Store opened syrup in refrigerator', 'Transfer to glass container', 'Can freeze for long-term storage'],
    country: 'CA',
    countryCode: 'CA',
    difficulty: 'easy',
    tags: ['maple-syrup', 'storage', 'canadian'],
    authorName: 'sarah.maple@example.com',
    authorEmail: 'sarah.maple@example.com',
    kudos: 19,
    views: 112,
    comments: 4,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 24).toISOString()
  },
  // Australia tricks
  {
    id: Date.now().toString() + 'au1',
    title: 'Vegemite Toast Perfection',
    description: 'Aussie technique for the perfect Vegemite toast',
    steps: ['Toast bread until golden', 'Butter while hot', 'Spread Vegemite very thinly'],
    country: 'AU',
    countryCode: 'AU',
    difficulty: 'easy',
    tags: ['vegemite', 'toast', 'aussie'],
    authorName: 'steve.aussie@example.com',
    authorEmail: 'steve.aussie@example.com',
    kudos: 33,
    views: 189,
    comments: 8,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  // Brazil tricks
  {
    id: Date.now().toString() + 'br1',
    title: 'Açaí Bowl Perfeito',
    description: 'Receita brasileira para tigela de açaí cremosa',
    steps: ['Açaí congelado + banana congelada', 'Bater com pouco líquido', 'Servir imediatamente com granola'],
    country: 'BR',
    countryCode: 'BR',
    difficulty: 'easy',
    tags: ['açaí', 'bowl', 'brasileiro'],
    authorName: 'ana.acai@example.com',
    authorEmail: 'ana.acai@example.com',
    kudos: 41,
    views: 223,
    comments: 11,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 26).toISOString()
  },
  // India tricks
  {
    id: Date.now().toString() + 'in1',
    title: 'चावल का पानी फेस पैक',
    description: 'चावल के पानी से प्राकृतिक फेस पैक बनाने की विधि',
    steps: ['चावल का पानी इकट्ठा करें', 'रात भर रखें किण्वन के लिए', 'चेहरे पर लगाएं, 15 मिनट बाद धोएं'],
    country: 'IN',
    countryCode: 'IN',
    difficulty: 'easy',
    tags: ['चावल', 'फेसपैक', 'प्राकृतिक'],
    authorName: 'priya.beauty@example.com',
    authorEmail: 'priya.beauty@example.com',
    kudos: 37,
    views: 201,
    comments: 9,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 27).toISOString()
  },
  // China tricks
  {
    id: Date.now().toString() + 'cn1',
    title: '绿豆汤清热解毒',
    description: '夏季清热解毒的绿豆汤制作方法',
    steps: ['绿豆提前浸泡2小时', '大火煮开后转小火', '煮至绿豆开花即可'],
    country: 'CN',
    countryCode: 'CN',
    difficulty: 'easy',
    tags: ['绿豆汤', '清热', '夏季'],
    authorName: 'wang.health@example.com',
    authorEmail: 'wang.health@example.com',
    kudos: 24,
    views: 145,
    comments: 5,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString()
  },
  // South Korea tricks
  {
    id: Date.now().toString() + 'kr1',
    title: '김치 보관법',
    description: '김치를 오래 신선하게 보관하는 한국 전통 방법',
    steps: ['김치를 눌러서 공기 제거', '국물이 김치 위로 올라오게', '밀폐용기에 냉장보관'],
    country: 'KR',
    countryCode: 'KR',
    difficulty: 'easy',
    tags: ['김치', '보관', '발효'],
    authorName: 'kim.kimchi@example.com',
    authorEmail: 'kim.kimchi@example.com',
    kudos: 29,
    views: 172,
    comments: 7,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 29).toISOString()
  },
  // Mexico tricks
  {
    id: Date.now().toString() + 'mx1',
    title: 'Guacamole Perfecto',
    description: 'Secreto mexicano para guacamole que no se oxida',
    steps: ['Dejar el hueso del aguacate en el guacamole', 'Cubrir con film transparente tocando la superficie', 'Agregar limón generosamente'],
    country: 'MX',
    countryCode: 'MX',
    difficulty: 'easy',
    tags: ['guacamole', 'aguacate', 'mexicano'],
    authorName: 'carlos.guac@example.com',
    authorEmail: 'carlos.guac@example.com',
    kudos: 46,
    views: 267,
    comments: 13,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  // Netherlands tricks
  {
    id: Date.now().toString() + 'nl1',
    title: 'Stroopwafel Warming',
    description: 'Dutch method to perfectly warm stroopwafels',
    steps: ['Place stroopwafel on top of hot coffee cup', 'Wait 2-3 minutes for caramel to soften', 'Enjoy while warm and gooey'],
    country: 'NL',
    countryCode: 'NL',
    difficulty: 'easy',
    tags: ['stroopwafel', 'coffee', 'dutch'],
    authorName: 'jan.stroopwafel@example.com',
    authorEmail: 'jan.stroopwafel@example.com',
    kudos: 21,
    views: 128,
    comments: 4,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 31).toISOString()
  },
  // Sweden tricks
  {
    id: Date.now().toString() + 'se1',
    title: 'Fika Tradition',
    description: 'Swedish coffee break ritual for better work-life balance',
    steps: ['Take break at 10am and 3pm daily', 'Enjoy coffee with pastry', 'Focus on social connection, not work'],
    country: 'SE',
    countryCode: 'SE',
    difficulty: 'easy',
    tags: ['fika', 'coffee', 'tradition'],
    authorName: 'erik.fika@example.com',
    authorEmail: 'erik.fika@example.com',
    kudos: 38,
    views: 215,
    comments: 10,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 32).toISOString()
  },
  // Norway tricks
  {
    id: Date.now().toString() + 'no1',
    title: 'Lefse Making Technique',
    description: 'Norwegian method for thin, perfect lefse',
    steps: ['Keep dough and tools cold', 'Roll very thin with grooved rolling pin', 'Cook on dry griddle until spotted'],
    country: 'NO',
    countryCode: 'NO',
    difficulty: 'hard',
    tags: ['lefse', 'norwegian', 'baking'],
    authorName: 'astrid.lefse@example.com',
    authorEmail: 'astrid.lefse@example.com',
    kudos: 17,
    views: 94,
    comments: 3,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 33).toISOString()
  },
  // Denmark tricks
  {
    id: Date.now().toString() + 'dk1',
    title: 'Smørrebrød Assembly',
    description: 'Danish open sandwich layering technique',
    steps: ['Start with dense rye bread', 'Spread butter to edges', 'Layer ingredients from large to small'],
    country: 'DK',
    countryCode: 'DK',
    difficulty: 'medium',
    tags: ['smørrebrød', 'sandwich', 'danish'],
    authorName: 'mads.sandwich@example.com',
    authorEmail: 'mads.sandwich@example.com',
    kudos: 25,
    views: 149,
    comments: 6,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 34).toISOString()
  },
  // Finland tricks
  {
    id: Date.now().toString() + 'fi1',
    title: 'Sisu Mindset Practice',
    description: 'Finnish mental resilience technique for tough times',
    steps: ['Accept the challenge without complaint', 'Focus on what you can control', 'Take one small action forward'],
    country: 'FI',
    countryCode: 'FI',
    difficulty: 'medium',
    tags: ['sisu', 'mindset', 'resilience'],
    authorName: 'aino.sisu@example.com',
    authorEmail: 'aino.sisu@example.com',
    kudos: 44,
    views: 256,
    comments: 14,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString()
  },
  // Switzerland tricks
  {
    id: Date.now().toString() + 'ch1',
    title: 'Fondue Etiquette',
    description: 'Swiss rules for proper fondue enjoyment',
    steps: ['Stir in figure-8 pattern', 'Never double-dip', 'If you drop bread, buy next round of drinks'],
    country: 'CH',
    countryCode: 'CH',
    difficulty: 'easy',
    tags: ['fondue', 'etiquette', 'swiss'],
    authorName: 'hans.fondue@example.com',
    authorEmail: 'hans.fondue@example.com',
    kudos: 32,
    views: 184,
    comments: 8,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 36).toISOString()
  }
];

const newUsers = [
  { email: 'jennifer.clean@example.com', score: 45, tricksSubmitted: 4, kudosReceived: 8 },
  { email: 'mike.fresh@example.com', score: 55, tricksSubmitted: 5, kudosReceived: 10 },
  { email: 'tanaka.yasai@example.com', score: 50, tricksSubmitted: 5, kudosReceived: 9 },
  { email: 'mueller.sauber@example.com', score: 65, tricksSubmitted: 6, kudosReceived: 12 },
  { email: 'marie.propre@example.com', score: 70, tricksSubmitted: 7, kudosReceived: 13 },
  { email: 'elizabeth.baker@example.com', score: 85, tricksSubmitted: 8, kudosReceived: 16 },
  { email: 'giuseppe.formaggio@example.com', score: 75, tricksSubmitted: 7, kudosReceived: 14 },
  { email: 'carmen.sevilla@example.com', score: 60, tricksSubmitted: 6, kudosReceived: 11 },
  { email: 'sarah.maple@example.com', score: 50, tricksSubmitted: 5, kudosReceived: 9 },
  { email: 'steve.aussie@example.com', score: 70, tricksSubmitted: 7, kudosReceived: 13 },
  { email: 'ana.acai@example.com', score: 85, tricksSubmitted: 8, kudosReceived: 16 },
  { email: 'priya.beauty@example.com', score: 80, tricksSubmitted: 8, kudosReceived: 15 },
  { email: 'wang.health@example.com', score: 55, tricksSubmitted: 5, kudosReceived: 10 },
  { email: 'kim.kimchi@example.com', score: 65, tricksSubmitted: 6, kudosReceived: 12 },
  { email: 'carlos.guac@example.com', score: 95, tricksSubmitted: 9, kudosReceived: 18 },
  { email: 'jan.stroopwafel@example.com', score: 50, tricksSubmitted: 5, kudosReceived: 9 },
  { email: 'erik.fika@example.com', score: 80, tricksSubmitted: 8, kudosReceived: 15 },
  { email: 'astrid.lefse@example.com', score: 45, tricksSubmitted: 4, kudosReceived: 8 },
  { email: 'mads.sandwich@example.com', score: 60, tricksSubmitted: 6, kudosReceived: 11 },
  { email: 'aino.sisu@example.com', score: 90, tricksSubmitted: 9, kudosReceived: 17 },
  { email: 'hans.fondue@example.com', score: 70, tricksSubmitted: 7, kudosReceived: 13 }
];

async function addUsers() {
  console.log('Adding new users...');
  
  for (const user of newUsers) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Users',
        Item: {
          ...user,
          createdAt: new Date().toISOString()
        }
      }));
      console.log(`✅ Added user: ${user.email}`);
    } catch (error) {
      console.log(`❌ Failed to add user ${user.email}:`, error.message);
    }
  }
}

async function addTricks() {
  console.log('Adding new tricks...');
  
  for (const trick of newTricks) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'TrickShare-Tricks',
        Item: trick
      }));
      console.log(`✅ Added trick: ${trick.title}`);
    } catch (error) {
      console.log(`❌ Failed to add trick ${trick.title}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Adding more data to all countries...\n');
  
  await addUsers();
  console.log('');
  await addTricks();
  
  console.log('\n🎉 Database expansion completed!');
  console.log('Added:');
  console.log(`- ${newUsers.length} new users`);
  console.log(`- ${newTricks.length} new tricks across all countries`);
  console.log('- Every country now has multiple tricks!');
}

main().catch(console.error);
