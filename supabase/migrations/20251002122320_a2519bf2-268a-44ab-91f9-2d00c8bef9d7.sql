-- Add sample lessons for each subject
-- Mathematics lessons
INSERT INTO public.lessons (subject_id, title, description, content, order_index, created_by) VALUES
(
  (SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1),
  'Introduction to Addition',
  'Learn how to add numbers step by step',
  'Addition is one of the basic operations in mathematics. It means putting things together.

**What is Addition?**
When we add, we combine two or more numbers to get a total.

**Example 1:**
If you have 2 apples and your friend gives you 3 more apples, how many apples do you have now?
2 + 3 = 5 apples! 🍎

**Example 2:**
5 + 4 = 9
3 + 7 = 10

**Tips for Adding:**
✨ Start with the smaller number and count up
✨ Use your fingers to help count
✨ Practice every day!

**Practice Questions:**
1. 6 + 3 = ?
2. 8 + 2 = ?
3. 4 + 5 = ?',
  1,
  (SELECT id FROM auth.users WHERE email = 'admin@learnhub.com' LIMIT 1)
),
(
  (SELECT id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1),
  'Subtraction Basics',
  'Understanding how to subtract numbers',
  'Subtraction means taking away from a group.

**What is Subtraction?**
When we subtract, we remove some items from a total.

**Example 1:**
You have 10 candies. You eat 3 candies. How many candies are left?
10 - 3 = 7 candies! 🍬

**Example 2:**
8 - 2 = 6
9 - 4 = 5

**Remember:**
🎯 The bigger number comes first
🎯 We always subtract the smaller from the bigger
🎯 Practice makes perfect!

**Try These:**
1. 10 - 5 = ?
2. 7 - 3 = ?
3. 6 - 2 = ?',
  2,
  (SELECT id FROM auth.users WHERE email = 'admin@learnhub.com' LIMIT 1)
);

-- Science lessons
INSERT INTO public.lessons (subject_id, title, description, content, order_index, created_by) VALUES
(
  (SELECT id FROM public.subjects WHERE name = 'Science' LIMIT 1),
  'Water Cycle',
  'How water moves around Earth',
  'The water cycle is the journey water takes as it moves from the land to the sky and back again!

**Steps of the Water Cycle:**

**1. Evaporation** ☀️
The sun heats up water in rivers, lakes, and oceans. The water turns into water vapor and rises into the air.

**2. Condensation** ☁️
When water vapor cools down in the sky, it turns back into tiny water droplets. These droplets form clouds!

**3. Precipitation** 🌧️
When clouds get heavy with water droplets, the water falls back to Earth as rain, snow, or hail.

**4. Collection** 💧
The water collects in rivers, lakes, and oceans. Then the cycle starts again!

**Fun Fact:**
The water you drink today might be the same water dinosaurs drank millions of years ago! 🦕

**Activity:**
Draw the water cycle and label each step!',
  1,
  (SELECT id FROM auth.users WHERE email = 'admin@learnhub.com' LIMIT 1)
),
(
  (SELECT id FROM public.subjects WHERE name = 'Science' LIMIT 1),
  'Parts of a Plant',
  'Learn about different parts of plants',
  'Plants have different parts, and each part has a special job!

**Main Parts of a Plant:**

**1. Roots** 🌱
- Grow underground
- Take water and nutrients from soil
- Hold the plant in place

**2. Stem** 🎋
- Holds up the plant
- Carries water from roots to leaves
- Supports leaves and flowers

**3. Leaves** 🍃
- Make food for the plant
- Use sunlight, water, and air
- This is called photosynthesis!

**4. Flowers** 🌸
- Make seeds
- Look beautiful and smell nice
- Attract bees and butterflies

**5. Fruits** 🍎
- Protect seeds
- Help spread seeds to new places

**Remember:**
All parts work together to help the plant grow strong and healthy!

**Try This:**
Go outside and find a plant. Can you identify all its parts?',
  2,
  (SELECT id FROM auth.users WHERE email = 'admin@learnhub.com' LIMIT 1)
);

-- English lessons
INSERT INTO public.lessons (subject_id, title, description, content, order_index, created_by) VALUES
(
  (SELECT id FROM public.subjects WHERE name = 'English' LIMIT 1),
  'Nouns - Naming Words',
  'Learn about words that name people, places, and things',
  'A noun is a word that names a person, place, animal, or thing!

**Types of Nouns:**

**1. Person** 👤
- teacher, student, doctor, mother
- Example: The **teacher** is very kind.

**2. Place** 🏫
- school, park, home, city
- Example: We play at the **park**.

**3. Animal** 🐕
- dog, cat, elephant, bird
- Example: My **dog** is very friendly.

**4. Thing** ⚽
- ball, book, chair, toy
- Example: I read a **book** every day.

**Special Nouns (Proper Nouns):**
These start with capital letters!
- Names: Sara, John, Mr. Silva
- Places: Colombo, Sri Lanka, India
- Days: Monday, Tuesday

**Practice:**
Circle the nouns in these sentences:
1. The cat sat on the mat.
2. John plays with his ball.
3. We went to school yesterday.

Remember: Nouns are everywhere! 📚',
  1,
  (SELECT id FROM auth.users WHERE email = 'admin@learnhub.com' LIMIT 1)
),
(
  (SELECT id FROM public.subjects WHERE name = 'English' LIMIT 1),
  'Verbs - Action Words',
  'Words that show actions',
  'Verbs are action words! They tell us what someone or something is doing.

**Common Verbs:**

**Movement Verbs** 🏃
- run, jump, walk, swim, fly
- Example: Birds **fly** in the sky.

**Doing Verbs** ✍️
- write, read, eat, drink, play
- Example: I **write** in my notebook.

**Thinking Verbs** 🤔
- think, know, understand, remember
- Example: I **know** the answer!

**Being Verbs** 🌟
- am, is, are, was, were
- Example: I **am** happy today.

**Fun Activity:**
Act out these verbs:
- Jump like a kangaroo! 🦘
- Swim like a fish! 🐠
- Fly like a bird! 🦅

**Practice:**
Fill in the verb:
1. The dog _____ (bark) loudly.
2. We _____ (play) cricket.
3. She _____ (dance) beautifully.

Keep moving and learning! 🎯',
  2,
  (SELECT id FROM auth.users WHERE email = 'admin@learnhub.com' LIMIT 1)
);