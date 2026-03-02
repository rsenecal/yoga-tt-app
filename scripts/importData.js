// importData.js
// Place this file in: scripts/importData.js
// Run with: node scripts/importData.js

// First install: npm install firebase-admin --save-dev

const admin = require('firebase-admin');

// Initialize Firebase Admin
// Download your service account key from Firebase Console:
// Project Settings -> Service Accounts -> Generate New Private Key
// Save it as serviceAccountKey.json in your project root
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample Data
const anatomyTopics = [
  {
    title: "Spine & Vertebral Column",
    description: "Understanding the structure and movement of the spine in yoga practice",
    imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=300&fit=crop",
    detailedContent: "The spine consists of 33 vertebrae divided into five regions: cervical (7), thoracic (12), lumbar (5), sacral (5 fused), and coccygeal (4 fused). Each region has specific movement capabilities and restrictions. In yoga, we work with spinal flexion, extension, lateral flexion, and rotation. Understanding these movements helps prevent injury and maximize the benefits of each asana."
  },
  {
    title: "Hip Joint & Pelvis",
    description: "Exploring hip anatomy for safe and effective practice",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    detailedContent: "The hip is a ball-and-socket joint allowing flexion, extension, abduction, adduction, internal and external rotation. The pelvis serves as the foundation for spinal movement. Understanding hip anatomy is crucial for poses like Warrior, Pigeon, and seated forward folds. Individual hip anatomy varies greatly, affecting range of motion in hip openers."
  },
  {
    title: "Shoulder Girdle",
    description: "The complex structure supporting arm movements and weight-bearing",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    detailedContent: "The shoulder girdle includes the clavicle, scapula, and humerus, creating one of the most mobile joints in the body. In yoga, we frequently bear weight through the shoulders (Downward Dog, Plank, Handstand). Understanding scapular movement - elevation, depression, protraction, retraction, upward/downward rotation - is essential for shoulder health and preventing injury."
  },
  {
    title: "Core & Abdominal Muscles",
    description: "The powerhouse of stability and movement in yoga",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    detailedContent: "The core includes rectus abdominis, external and internal obliques, transverse abdominis, and deeper muscles like psoas and quadratus lumborum. These muscles stabilize the spine, transfer force between upper and lower body, and protect the lower back. Engaging the core properly is fundamental to safe practice across all asanas."
  },
  {
    title: "Knee Joint Mechanics",
    description: "Protecting the knees through proper alignment",
    imageUrl: "https://images.unsplash.com/photo-1594737625785-8e8800b6c371?w=400&h=300&fit=crop",
    detailedContent: "The knee is a hinge joint designed primarily for flexion and extension, with minimal rotation when flexed. The menisci, cruciate ligaments, and collateral ligaments provide stability. In yoga, we must protect the knees by maintaining proper alignment - knee tracking over the middle toe, avoiding hyperextension, and being mindful in poses requiring rotation."
  },
  {
    title: "Respiratory System",
    description: "Anatomy of breath and pranayama practice",
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
    detailedContent: "The respiratory system includes the diaphragm, intercostal muscles, lungs, and airways. The diaphragm is the primary muscle of respiration. Understanding three-part yogic breath (diaphragmatic, thoracic, clavicular) and how pranayama affects the nervous system is fundamental to yoga practice and teaching."
  },
  {
    title: "Hamstrings & Hip Flexors",
    description: "Balancing flexibility and strength in the legs",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    detailedContent: "The hamstrings (biceps femoris, semitendinosus, semimembranosus) extend the hip and flex the knee. The hip flexors (iliopsoas, rectus femoris) flex the hip. These opposing muscle groups are commonly tight in modern lifestyles. Yoga offers both stretching and strengthening, but requires patience and proper technique to avoid injury."
  },
  {
    title: "Wrists & Hands",
    description: "Small joints that bear big loads in yoga practice",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
    detailedContent: "The wrist is a complex of eight carpal bones allowing flexion, extension, and limited rotation. In weight-bearing poses, proper hand placement and weight distribution prevent wrist strain. Spreading fingers wide, pressing through all knuckles, and maintaining neutral wrist alignment are key teaching points."
  }
];

const philosophyTopics = [
  {
    title: "The Eight Limbs of Yoga",
    description: "Patanjali's roadmap for living a meaningful and purposeful life",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    detailedContent: "The Eight Limbs (Ashtanga) are: Yama (ethical restraints), Niyama (personal observances), Asana (physical postures), Pranayama (breath control), Pratyahara (withdrawal of senses), Dharana (concentration), Dhyana (meditation), and Samadhi (blissful absorption). These limbs work together as a holistic system for spiritual growth and self-realization, reminding us that yoga is far more than physical practice."
  },
  {
    title: "The Yoga Sutras",
    description: "Ancient wisdom compiled by sage Patanjali",
    imageUrl: "https://images.unsplash.com/photo-1532798442725-41036acc7489?w=400&h=300&fit=crop",
    detailedContent: "The Yoga Sutras consist of 196 aphorisms organized into four chapters (padas): Samadhi Pada (contemplation), Sadhana Pada (practice), Vibhuti Pada (accomplishments), and Kaivalya Pada (liberation). The famous second sutra defines yoga as 'chitta vritti nirodha' - the cessation of the fluctuations of the mind. This text remains the foundational philosophical text of yoga practice."
  },
  {
    title: "Yamas - Ethical Guidelines",
    description: "Five moral restraints for harmonious living",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
    detailedContent: "The five Yamas are Ahimsa (non-violence), Satya (truthfulness), Asteya (non-stealing), Brahmacharya (right use of energy), and Aparigraha (non-possessiveness). These principles guide our relationships with others and the world around us. Ahimsa, considered the most important, extends beyond physical harm to include our thoughts, words, and actions toward ourselves and others."
  },
  {
    title: "Niyamas - Personal Observances",
    description: "Five practices for self-discipline and spiritual growth",
    imageUrl: "https://images.unsplash.com/photo-1599447292023-3c0f8d4294f8?w=400&h=300&fit=crop",
    detailedContent: "The five Niyamas are Saucha (purity), Santosha (contentment), Tapas (discipline), Svadhyaya (self-study), and Ishvara Pranidhana (surrender to a higher power). These internal practices complement the external ethics of the Yamas. Together, they create a foundation for spiritual growth and help us cultivate inner peace and self-awareness."
  },
  {
    title: "The Bhagavad Gita",
    description: "Sacred dialogue on duty, devotion, and the path to liberation",
    imageUrl: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=400&h=300&fit=crop",
    detailedContent: "The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata. It presents a conversation between prince Arjuna and Lord Krishna on the battlefield, exploring three main paths of yoga: Karma Yoga (path of action), Bhakti Yoga (path of devotion), and Jnana Yoga (path of knowledge). The text addresses the nature of reality, duty, and the soul."
  },
  {
    title: "Pranayama Philosophy",
    description: "Understanding the life force and breath control",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    detailedContent: "Prana means life force or vital energy, and ayama means extension or expansion. Pranayama techniques control and direct this energy through breath. The philosophy teaches that breath is the bridge between body and mind, and by controlling breath, we can influence our mental and emotional states. Regular pranayama practice prepares the body and mind for meditation."
  },
  {
    title: "Chakras & Energy Bodies",
    description: "The subtle anatomy of consciousness",
    imageUrl: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop",
    detailedContent: "The chakra system describes seven major energy centers along the spine, from the root (Muladhara) to the crown (Sahasrara). Each chakra corresponds to specific physical, emotional, and spiritual aspects of being. Understanding this subtle anatomy helps us work with energy in our practice and recognize how physical postures affect our energetic and emotional states."
  },
  {
    title: "Karma & Dharma",
    description: "Understanding action, consequence, and life purpose",
    imageUrl: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&h=300&fit=crop",
    detailedContent: "Karma means action and its consequences - the law of cause and effect that shapes our experiences. Dharma refers to our righteous duty or life purpose. Yoga philosophy teaches that by performing our dharma without attachment to results (as taught in the Gita), we purify karma and move toward liberation. Understanding these concepts helps us live with greater intention and acceptance."
  }
];

const postures = [
  {
    english_name: "Mountain Pose",
    sanskrit_name: "Tadasana",
    category: "Standing",
    description: "Foundation standing pose that improves posture and body awareness",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    alignment: [
      "Feet hip-width apart, weight evenly distributed",
      "Engage quadriceps, lift kneecaps",
      "Lengthen tailbone down, draw navel in",
      "Shoulders back and down, arms by sides",
      "Crown of head reaching up"
    ],
    dialogue: "Stand tall like a mountain. Feel your feet rooting into the earth. As you inhale, grow taller through the crown of your head. This is your foundation pose.",
    benefits: "Improves posture, strengthens thighs, increases body awareness, establishes proper alignment",
    key_muscles: "Quadriceps, gluteus maximus, core stabilizers, erector spinae"
  },
  {
    english_name: "Downward-Facing Dog",
    sanskrit_name: "Adho Mukha Svanasana",
    category: "Inversion",
    description: "Foundational inversion that strengthens and stretches the entire body",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    alignment: [
      "Hands shoulder-width, fingers spread wide",
      "Feet hip-width apart",
      "Press firmly through palms and knuckles",
      "Lift hips up and back, creating an inverted V",
      "Lengthen spine, head relaxed between arms",
      "Heels reaching toward floor"
    ],
    dialogue: "From your hands and knees, tuck your toes and lift your hips. Push the floor away as you lengthen your spine. Pedal your feet gently if your hamstrings are tight.",
    benefits: "Strengthens arms and legs, stretches hamstrings and calves, energizes body, relieves stress and mild depression",
    key_muscles: "Deltoids, triceps, latissimus dorsi, hamstrings, gastrocnemius, core"
  },
  {
    english_name: "Warrior I",
    sanskrit_name: "Virabhadrasana I",
    category: "Standing",
    description: "Powerful standing pose that builds strength and focus",
    imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop",
    alignment: [
      "Front knee bent to 90 degrees over ankle",
      "Back leg straight and strong",
      "Hips square to front of mat",
      "Arms reach overhead, shoulders relaxed",
      "Gaze forward or up at thumbs"
    ],
    dialogue: "Step your feet wide. Turn your right foot forward. Bend your right knee deeply as you reach your arms up. Feel the strength and stability of a peaceful warrior.",
    benefits: "Strengthens legs, opens chest and lungs, builds focus and stamina, stretches hip flexors",
    key_muscles: "Quadriceps, gluteus maximus, hip flexors, deltoids, core stabilizers"
  },
  {
    english_name: "Child's Pose",
    sanskrit_name: "Balasana",
    category: "Resting",
    description: "Gentle resting pose that calms the mind and releases tension",
    imageUrl: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop",
    alignment: [
      "Knees wide or together, depending on comfort",
      "Big toes touching",
      "Sit hips back toward heels",
      "Forehead rests on mat",
      "Arms extended forward or alongside body"
    ],
    dialogue: "Come to your knees and rest back. Let your forehead touch the earth. This is your resting pose - come here whenever you need to pause and breathe.",
    benefits: "Calms mind, releases tension in back, gentle hip opener, relieves stress and fatigue",
    key_muscles: "Latissimus dorsi, hip rotators, ankle flexors (gentle stretch)"
  },
  {
    english_name: "Warrior II",
    sanskrit_name: "Virabhadrasana II",
    category: "Standing",
    description: "Strong standing pose that builds endurance and concentration",
    imageUrl: "https://images.unsplash.com/photo-1599447292023-3c0f8d4294f8?w=400&h=300&fit=crop",
    alignment: [
      "Front knee bent to 90 degrees",
      "Back leg straight, foot parallel to back edge",
      "Hips open to the side",
      "Arms extended parallel to floor",
      "Gaze over front fingertips"
    ],
    dialogue: "Open your hips to the side as you bend your front knee. Reach through your fingertips in opposite directions. Find your warrior strength here.",
    benefits: "Strengthens legs and ankles, opens hips and chest, improves concentration and stamina",
    key_muscles: "Quadriceps, adductors, gluteus medius, deltoids, obliques"
  },
  {
    english_name: "Tree Pose",
    sanskrit_name: "Vrksasana",
    category: "Standing",
    description: "Classic balancing pose that improves focus and stability",
    imageUrl: "https://images.unsplash.com/photo-1603988363607-e1e10b4ad5ab?w=400&h=300&fit=crop",
    alignment: [
      "Standing leg firmly rooted",
      "Lifted foot on inner thigh, calf, or ankle (not knee)",
      "Hips level and facing forward",
      "Hands in prayer or extended overhead",
      "Steady gaze point (drishti)"
    ],
    dialogue: "Root down through your standing leg. Place your foot anywhere but the knee. Find your balance, like a tree swaying gently in the breeze.",
    benefits: "Improves balance and focus, strengthens legs and core, opens hips",
    key_muscles: "Quadriceps, gluteus medius, core stabilizers, hip rotators"
  },
  {
    english_name: "Cobra Pose",
    sanskrit_name: "Bhujangasana",
    category: "Backbend",
    description: "Gentle backbend that opens the chest and strengthens the spine",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop",
    alignment: [
      "Legs extended, tops of feet pressing down",
      "Hands under shoulders",
      "Lift chest using back muscles primarily",
      "Elbows slightly bent, close to body",
      "Shoulders back and down"
    ],
    dialogue: "Press your palms gently and lift your chest. Use your back muscles more than your arms. Breathe space into your heart.",
    benefits: "Strengthens spine, opens chest and lungs, energizes the body, relieves mild depression",
    key_muscles: "Erector spinae, trapezius, deltoids, gluteus maximus"
  },
  {
    english_name: "Seated Forward Fold",
    sanskrit_name: "Paschimottanasana",
    category: "Forward Fold",
    description: "Calming forward fold that stretches the entire back body",
    imageUrl: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop",
    alignment: [
      "Sit with legs extended forward",
      "Flex feet, engage thighs",
      "Hinge from hips, not waist",
      "Lengthen spine before folding",
      "Reach for feet, shins, or use a strap"
    ],
    dialogue: "Sit tall first, then fold forward from your hips. Let your breath guide you deeper. There's no need to force or rush.",
    benefits: "Stretches hamstrings and spine, calms mind, relieves stress, stimulates digestion",
    key_muscles: "Hamstrings, erector spinae, gastrocnemius (stretch)"
  }
];

const teamMembers = [
  {
    name: "Sarah Mitchell",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    description: "Lead instructor with over 15 years of experience in Vinyasa and Yin yoga. Sarah completed her training in India and has taught over 10,000 hours of classes worldwide. She specializes in alignment-based instruction and mindful movement, helping students develop a sustainable and safe practice."
  },
  {
    name: "Michael Chen",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    description: "Anatomy specialist and physical therapist with a passion for functional movement. Michael brings a scientific approach to yoga, focusing on biomechanics and injury prevention. He holds certifications in both yoga and therapeutic exercise, bridging Eastern and Western movement practices."
  },
  {
    name: "Priya Sharma",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    description: "Philosophy teacher and meditation guide. Priya studied in the Himalayan tradition and brings authentic yogic wisdom to modern practitioners. She teaches the Eight Limbs of Yoga, pranayama techniques, and Sanskrit chanting, connecting students to yoga's rich spiritual heritage."
  },
  {
    name: "David Rodriguez",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Teaching methodology expert and mentor. David has trained hundreds of yoga teachers and specializes in helping new instructors find their authentic voice. His background in education and communication makes him invaluable in developing confident, effective teachers."
  }
];

// Import function
async function importData() {
  try {
    console.log('Starting data import...\n');

    // Import Anatomy Topics
    console.log('Importing anatomy topics...');
    for (const topic of anatomyTopics) {
      await db.collection('anatomy_topics').add(topic);
    }
    console.log(`✓ Imported ${anatomyTopics.length} anatomy topics\n`);

    // Import Philosophy Topics
    console.log('Importing philosophy topics...');
    for (const topic of philosophyTopics) {
      await db.collection('philosophy_topics').add(topic);
    }
    console.log(`✓ Imported ${philosophyTopics.length} philosophy topics\n`);

    // Import Postures
    console.log('Importing postures...');
    for (const posture of postures) {
      await db.collection('postures').add(posture);
    }
    console.log(`✓ Imported ${postures.length} postures\n`);

    // Import Team Members
    console.log('Importing team members...');
    for (const member of teamMembers) {
      await db.collection('team_members').add(member);
    }
    console.log(`✓ Imported ${teamMembers.length} team members\n`);

    console.log('✨ All data imported successfully!\n');
    console.log('You can now view your data in Firebase Console:');
    console.log('https://console.firebase.google.com/\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

// Run the import
importData();