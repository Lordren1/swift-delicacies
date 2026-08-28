const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('meals.db');

const dummyMeals = [
   {
      title: 'Jollof Rice',
      slug: 'jollof-rice',
      image: '/images/jollof-rice.jpg',
      summary:
         'Smoky, tomato-rich party rice cooked to perfection with peppers and spices — a Nigerian classic.',
      instructions: `
      1. Blend the base:
         Blend tomatoes, red bell peppers, scotch bonnet, and onions into a smooth puree.

      2. Fry the base:
         Heat vegetable oil, fry sliced onions, then add the tomato-pepper puree. Fry until the oil separates and the raw taste is gone.

      3. Season:
         Stir in curry powder, thyme, bay leaves, stock cubes, and salt to taste.

      4. Add rice and stock:
         Add parboiled rice and enough chicken or beef stock to just cover the rice. Cover and cook on low heat.

      5. Serve:
         Fluff the rice once tender and serve hot with fried plantain and grilled chicken.
    `,
      creator: 'Amaka Okafor',
      creator_email: 'amakaokafor@example.com',
   },
   {
      title: 'Egusi Soup',
      slug: 'egusi-soup',
      image: '/images/egusi-soup.jpg',
      summary:
         'A hearty melon seed soup loaded with assorted meat, fish, and leafy greens.',
      instructions: `
      1. Prepare the egusi:
         Blend ground melon seeds with a little water to form a paste.

      2. Fry the base:
         Heat palm oil and fry chopped onions, then stir in blended pepper and tomatoes.

      3. Cook the egusi:
         Add the egusi paste in spoonfuls and fry until it forms lumps, then add stock.

      4. Add protein and greens:
         Add assorted meat, stockfish, and dried fish, then simmer. Stir in ugu (fluted pumpkin) leaves and cook a few more minutes.

      5. Serve:
         Serve hot with pounded yam, eba, or fufu.
    `,
      creator: 'Chidi Nwosu',
      creator_email: 'chidinwosu@example.com',
   },
   {
      title: 'Suya',
      slug: 'suya',
      image: '/images/suya.jpg',
      summary:
         'Spicy grilled skewered beef coated in a peanut-based suya spice blend, a beloved Nigerian street food.',
      instructions: `
      1. Prepare the suya spice:
         Mix roasted ground peanuts, ground ginger, cayenne pepper, paprika, garlic powder, and stock cubes.

      2. Season the beef:
         Slice beef thinly, coat lightly with oil, then rub generously with the suya spice mix.

      3. Skewer the meat:
         Thread the beef strips onto skewers.

      4. Grill:
         Grill over open flame or in the oven, turning occasionally, until cooked through and slightly charred.

      5. Serve:
         Serve hot with sliced onions, tomatoes, and extra suya spice on the side.
    `,
      creator: 'Musa Ibrahim',
      creator_email: 'musaibrahim@example.com',
   },
   {
      title: 'Moi Moi',
      slug: 'moi-moi',
      image: '/images/moi-moi.jpg',
      summary:
         'Steamed savory bean pudding made from blended black-eyed peas, peppers, and spices.',
      instructions: `
      1. Prepare the beans:
         Soak and peel black-eyed peas, then blend with peppers, onions, and a little water into a smooth batter.

      2. Season the batter:
         Stir in palm oil, ground crayfish, stock cubes, and salt.

      3. Add fillings:
         Fold in chopped boiled eggs, fish, or corned beef if desired.

      4. Steam:
         Pour the batter into wrapped leaves or ramekins and steam for about 45 minutes until firm.

      5. Serve:
         Serve warm on its own or alongside jollof rice.
    `,
      creator: 'Ngozi Eze',
      creator_email: 'ngozieze@example.com',
   },
   {
      title: 'Puff-Puff',
      slug: 'puff-puff',
      image: '/images/puff-puff.jpg',
      summary:
         'Sweet, fluffy deep-fried dough balls, golden on the outside and soft inside.',
      instructions: `
      1. Make the batter:
         Mix flour, sugar, yeast, nutmeg, and salt, then whisk in warm water until smooth.

      2. Let it rise:
         Cover and leave the batter in a warm place for about an hour until bubbly.

      3. Fry:
         Scoop spoonfuls of batter into hot oil and fry until golden brown on all sides.

      4. Drain:
         Remove and drain on paper towels.

      5. Serve:
         Serve warm as a snack, plain or dusted with sugar.
    `,
      creator: 'Funke Adebayo',
      creator_email: 'funkeadebayo@example.com',
   },
   {
      title: 'Akara',
      slug: 'akara',
      image: '/images/akara.jpg',
      summary:
         'Crispy deep-fried bean cakes made from blended black-eyed peas, a popular breakfast favorite.',
      instructions: `
      1. Prepare the beans:
         Soak and peel black-eyed peas, then blend with onions and pepper into a thick, fluffy batter.

      2. Whip the batter:
         Whisk the batter vigorously to add air, which makes the akara light and fluffy.

      3. Fry:
         Scoop spoonfuls into hot oil and fry until golden brown and cooked through.

      4. Drain:
         Remove and drain excess oil on paper towels.

      5. Serve:
         Serve hot with pap (akamu) or bread.
    `,
      creator: 'Tunde Bakare',
      creator_email: 'tundebakare@example.com',
   },
   {
      title: 'Pepper Soup',
      slug: 'pepper-soup',
      image: '/images/pepper-soup.jpg',
      summary:
         'A light, fiery, aromatic soup made with catfish or goat meat and traditional pepper soup spice.',
      instructions: `
      1. Season the meat:
         Season goat meat or catfish with salt, onions, and stock cubes, then boil until tender.

      2. Add spice mix:
         Stir in ground pepper soup spice (uziza, calabash nutmeg, and chili) along with sliced scotch bonnet.

      3. Simmer:
         Let the soup simmer gently so the spices infuse fully.

      4. Add herbs:
         Stir in scent leaves or uziza leaves just before removing from heat.

      5. Serve:
         Serve hot in a bowl as a starter or light meal.
    `,
      creator: 'Blessing Okon',
      creator_email: 'blessingokon@example.com',
   },
];

db.exec(`
   CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   username TEXT NOT NULL UNIQUE,
   first_name TEXT,
   last_name TEXT,
   email TEXT NOT NULL UNIQUE,
   password_hash TEXT,
   profile_image TEXT
   )
   `);

db.exec(`
   CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      summary TEXT NOT NULL,
      instructions TEXT NOT NULL,
      creator TEXT NOT NULL,
      creator_email TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
   )
`);



db.exec(`
   CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   )   
`);

db.exec(`
   CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER,
      meal_id INTEGER,
      PRIMARY KEY (user_id, meal_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
   )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS views (
   user_id INTEGER,
   meal_id INTEGER,
   viewed_at TEXT DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (user_id, meal_id),
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
  )    
`);


db.exec(`
   CREATE TABLE IF NOT EXISTS sessions (
   id TEXT PRIMARY KEY,
   user_id INTEGER NOT NULL,
   expires_at INTEGER NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   )
`);

function initUsers() {
   const stmt = db.prepare('SELECT COUNT(*) AS count FROM users');

   if (stmt.get().count === 0) {
      const insertUser = db.prepare(`
         INSERT INTO users (username, first_name, last_name, email)
         VALUES (@username, @first_name, @last_name, @email)
      `);

      const dummyUsers = [
         { username: 'johndoe', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
         { username: 'maxschwarz', first_name: 'Max', last_name: 'Schwarz', email: 'max@example.com' },
      ];

      for (const user of dummyUsers) {
         insertUser.run(user);
      }
   }
}

initUsers();



function initData() {
   const stmt = db.prepare('SELECT COUNT(*) AS count FROM meals');

   if (stmt.get().count === 0) {
      const insertMeal = db.prepare(
         `INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
       VALUES (@slug, @title, @image, @summary, @instructions, @creator, @creator_email)`,
         { allowBareNamedParameters: true }
      );

      for (const meal of dummyMeals) {
         insertMeal.run(meal);
      }
   }
}

initData();


