export const chapters = [
  { name: 'The earth', title: 'Everything starts here.', description: 'Green hills, morning light, and time. Long before the first sip, the earth begins the story.', video: '/video/estate.mp4', poster: '/images/estate-poster.jpg', alt: 'Aerial footage travelling across the rows of a green tea plantation', caption: 'THE ORIGIN / GROWN WITH PATIENCE' },
  { name: 'The hands', title: 'Care you can feel.', description: 'Tender tea leaves. Ripe coffee cherries. Chosen with attention, one small handful at a time.', poster: '/images/hands.jpg', alt: 'A tea picker gently plucking fresh leaves by hand', caption: 'THE HARVEST / A HUMAN TOUCH' },
  { name: 'The craft', title: 'A little time. A lot of care.', description: 'In the tea factory, fresh leaves are withered, rolled, and dried. Care at every stage shapes the flavour in your cup.', video: '/video/factory.mp4', poster: '/images/factory-poster.jpg', alt: 'Real footage of tea leaves drying inside a processing facility', caption: 'THE FACTORY / WHERE FLAVOUR TAKES SHAPE' },
  { name: 'The roast', title: 'Let the aroma lead.', description: 'Coffee develops its depth in the roast, then is ground for brewing. For chai, tea meets freshly crushed spices.', video: '/video/beans.mp4', poster: '/images/beans-poster.jpg', alt: 'Close-up film of roasted coffee beans with rising steam', caption: 'THE AROMA / RICH, WARM, UNMISTAKABLE' },
  { name: 'The pour', title: 'A ritual worth slowing for.', description: 'Water meets the brew. A steady pour, a rising aroma. Simple things, given the attention they deserve.', video: '/video/pour.mp4', poster: '/images/pour-poster.jpg', alt: 'Fresh coffee pouring into a ceramic cup, filmed in close-up', caption: 'THE BREW / ONE BEAUTIFUL POUR' },
  { name: 'Your moment', title: 'And finally, you.', description: 'Wrap your hands around the warmth. Take that first sip. Some moments don’t need anything more.', video: '/video/sip.mp4', poster: '/images/sip-poster.jpg', alt: 'A person taking a steaming cup of tea in their hand', caption: 'THE FIRST SIP / MAKE YOURSELF AT HOME' },
];
const tea = [
  ['Masala Chai', 'Slow-simmered Assam tea with milk and our favourite warming spices.', 85, 'THE EVERYDAY FAVOURITE', 'BOLD · SPICED · COMFORTING', '/images/masala-chai.webp', 'Steaming spiced chai in a glass cup'],
  ['Adrak Chai', 'Fresh ginger, strong tea, and the kind of warmth that stays with you.', 85, 'A LITTLE EXTRA WARMTH', 'GINGERY · ROBUST · WARM', '/images/tea.jpg', 'A fresh cup of tea'],
  ['Elaichi Chai', 'Fragrant cardamom and creamy milk, brought together over a gentle flame.', 95, 'AROMATIC & FAMILIAR', 'CARDAMOM · CREAMY · SOFT', '/images/chai.jpg', 'Creamy chai ready to drink'],
  ['Sulaimani', 'A clear, golden brew with a bright squeeze of lemon and a whisper of spice.', 90, 'LIGHTEN THE MOMENT', 'CITRUS · LIGHT · BRIGHT', '/images/black-tea.jpg', 'Golden tea served in glass'],
  ['Kashmiri Kahwa', 'Green tea infused with saffron, cardamom, and almonds.', 140, 'SOMETHING SPECIAL', 'FLORAL · NUTTY · DELICATE', '/images/kahwa.webp', 'Clear green tea in glass cups'],
  ['Matcha Latte', 'Finely whisked matcha softened with silky steamed milk.', 190, 'THE GREEN RITUAL', 'EARTHY · SMOOTH · MELLOW', '/images/matcha.jpg', 'Green matcha latte'],
  ['Darjeeling Tea', 'Whole leaves, a gentle steep, and a beautifully delicate aroma.', 140, 'TAKE IT SLOW', 'FLORAL · CLEAN · DELICATE', '/images/black-tea.jpg', 'A golden whole-leaf tea'],
  ['Hibiscus Iced Tea', 'A vibrant floral infusion, citrus, and plenty of ice.', 150, 'A COOL LITTLE PAUSE', 'TART · FLORAL · REFRESHING', '/images/iced-tea.jpg', 'A chilled glass of tea'],
];
const coffee = [
  ['Filter Kaapi', 'Rich coffee decoction and hot milk, frothed for a familiar finish.', 110, 'THE SOUTH IN A CUP', 'RICH · FROTHY · NOSTALGIC', '/images/dabara-kaapi.webp', 'Frothy South Indian filter coffee in traditional metal tumblers'],
  ['Cappuccino', 'A bold espresso heart beneath a soft cloud of textured milk.', 160, 'YOUR MORNING COMPANION', 'BALANCED · CREAMY · CLASSIC', '/images/coffee.jpg', 'Cappuccino with milk foam'],
  ['Café Latte', 'Fresh espresso meets silky milk for an easy, lingering cup.', 170, 'SOFTEN THE DAY', 'SILKY · MILD · ROUNDED', '/images/latte.jpg', 'Latte with delicate milk art'],
  ['Cold Brew', 'Slow-steeped coffee, served over ice. Mellow from the very first sip.', 180, 'KEEP YOUR COOL', 'SMOOTH · COOL · BOLD', '/images/cold-brew.jpg', 'Iced coffee in a glass'],
  ['Espresso', 'A small, concentrated cup with a big, beautiful character.', 100, 'SMALL & MIGHTY', 'INTENSE · DEEP · BOLD', '/images/espresso.webp', 'Espresso with a golden crema in a small glass'],
  ['Flat White', 'A double espresso wrapped in finely textured milk.', 180, 'QUIETLY CONFIDENT', 'VELVETY · STRONG · BALANCED', '/images/latte.jpg', 'Coffee with textured milk'],
  ['Americano', 'Espresso and hot water. Room for the coffee to speak for itself.', 130, 'BEAUTIFULLY SIMPLE', 'CLEAN · RICH · SMOOTH', '/images/filter-coffee.jpg', 'Freshly brewed black coffee'],
  ['Mocha', 'Espresso, chocolate, and warm milk for an indulgent little break.', 200, 'A SWEETER MOMENT', 'CHOCOLATE · CREAMY · RICH', '/images/coffee.jpg', 'Coffee with a creamy finish'],
];
export const drinks = [...[0, 3, 5, 7, 1, 2, 4, 6].map(index => [...tea[index], 'tea']), ...coffee.map(item => [...item, 'coffee'])].map(([name, description, price, tag, notes, image, alt, category]) => ({ name, description, price, tag, notes, image, alt, category, position: name === 'Masala Chai' ? '72% center' : 'center' }));
