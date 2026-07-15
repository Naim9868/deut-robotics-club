import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import About from '@/lib/models/About';

const SEED_DATA = {
  _singleton: 'main',

  hero: {
    isEnabled: true,
    displayOrder: 1,
    bannerImage: { url: '', alt: 'DUET Robotics Club Banner', publicId: '' },
    title: 'DUET Robotics Club',
    subtitle: 'Innovating the future through robotics, one build at a time. Join Bangladesh\'s most passionate student robotics community.',
    ctaButton: { text: 'Explore Our Journey', link: '#about' },
  },

  introduction: {
    isEnabled: (true as boolean),
    displayOrder: 2,
    shortIntro: 'DUET Robotics Club (DRC) is the official robotics community of Dhaka University of Engineering & Technology, founded with a vision to empower students through hands-on experience in robotics, automation, and AI.',
    longDescription: '<p>Since our inception, DRC has been at the forefront of engineering innovation at DUET. We provide a collaborative platform where students from diverse engineering backgrounds come together to design, build, and program robots.</p><p>Our members have participated in numerous national and international robotics competitions, bringing home awards and recognition. We believe in learning by doing — every semester, our members work on real-world projects that push the boundaries of what student teams can achieve.</p><p>From line followers to autonomous rovers, from AI-powered drones to industrial automation prototypes — DRC is where engineering theory meets practical application.</p>',
  },

  story: {
    isEnabled: true,
    displayOrder: 3,
    content: '<p>DUET Robotics Club was born in the halls of Dhaka University of Engineering & Technology, when a group of passionate engineering students decided that theoretical knowledge wasn\'t enough — they needed to build things.</p><p>What started as a small group of friends tinkering with Arduino boards in a dorm room has grown into one of the most recognized student organizations at DUET. Our journey has been one of persistence, late nights in the workshop, and the thrill of seeing a robot move for the very first time.</p><p>Over the years, DRC has evolved from a hobby club into a structured organization with dedicated teams for hardware, software, AI/ML, and business development. We\'ve organized workshops, bootcamps, and inter-university competitions that have inspired hundreds of students to explore the world of robotics.</p><p>Today, DRC stands as a testament to what student passion and dedication can achieve. Our alumni have gone on to work at leading tech companies, pursue advanced research, and even launch their own robotics startups.</p>',
    image: { url: '', alt: 'DRC Founding Story', publicId: '' },
  },

  mission: {
    isEnabled: true,
    displayOrder: 4,
    content: '<p>Our mission is to foster a culture of innovation and hands-on engineering among DUET students by providing the resources, mentorship, and collaborative environment needed to transform ideas into functional robotic systems.</p><p>We aim to bridge the gap between academic curriculum and industry requirements by exposing members to real-world engineering challenges. Through our projects and competitions, we develop not just technical skills but also teamwork, leadership, and problem-solving abilities.</p>',
    image: { url: '', alt: 'Our Mission', publicId: '' },
  },

  vision: {
    isEnabled: true,
    displayOrder: 5,
    content: '<p>To be the leading student robotics organization in Bangladesh, recognized for producing innovative engineers and cutting-edge robotic solutions that address real-world challenges.</p><p>We envision a future where every engineering student at DUET has the opportunity to explore robotics, regardless of their background or experience level. We want to create an ecosystem where innovation thrives and ideas become reality.</p>',
    image: { url: '', alt: 'Our Vision', publicId: '' },
  },

  coreValues: {
    isEnabled: true,
    displayOrder: 6,
    items: [
      { title: 'Innovation', description: 'We constantly push boundaries and explore new technologies to solve problems in creative ways.', icon: '💡', image: { url: '', alt: '', publicId: '' }, isPublished: true, displayOrder: 1 },
      { title: 'Collaboration', description: 'Engineering is a team sport. We believe in the power of diverse minds working together toward a common goal.', icon: '🤝', image: { url: '', alt: '', publicId: '' }, isPublished: true, displayOrder: 2 },
      { title: 'Excellence', description: 'We strive for the highest quality in everything we build, from code to circuits to mechanical design.', icon: '⭐', image: { url: '', alt: '', publicId: '' }, isPublished: true, displayOrder: 3 },
      { title: 'Hands-on Learning', description: 'Theory is important, but building is believing. We learn by doing, failing, and building again.', icon: '🔧', image: { url: '', alt: '', publicId: '' }, isPublished: true, displayOrder: 4 },
    ],
  },

  objectives: {
    isEnabled: true,
    displayOrder: 7,
    items: [
      { title: 'Build Competition-Ready Robots', description: 'Design and construct robots capable of competing in national and international robotics competitions.', icon: '🤖', isPublished: true, displayOrder: 1 },
      { title: 'Conduct Technical Workshops', description: 'Organize regular workshops on Arduino, ROS, PCB design, 3D printing, and AI for robotics.', icon: '📚', isPublished: true, displayOrder: 2 },
      { title: 'Foster Industry Connections', description: 'Build partnerships with tech companies and research institutions for internships and project funding.', icon: '🔗', isPublished: true, displayOrder: 3 },
      { title: 'Develop Problem-Solving Skills', description: 'Train members to approach engineering challenges systematically and develop effective solutions.', icon: '🧠', isPublished: true, displayOrder: 4 },
    ],
  },

  journeyTimeline: {
    isEnabled: true,
    displayOrder: 8,
    items: [
      { year: '2018', title: 'Club Founded', description: 'A group of passionate DUET students officially established the DUET Robotics Club with 12 founding members.', image: { url: '', alt: 'Club Founded', publicId: '' }, isPublished: true, displayOrder: 1 },
      { year: '2019', title: 'First Competition', description: 'DRC participated in its first inter-university robotics competition and won the "Best Rookie Team" award.', image: { url: '', alt: 'First Competition', publicId: '' }, isPublished: true, displayOrder: 2 },
      { year: '2020', title: 'Workshop Series Launch', description: 'Launched the "Robo 101" workshop series, training over 100 students in Arduino and basic electronics.', image: { url: '', alt: 'Workshop Launch', publicId: '' }, isPublished: true, displayOrder: 3 },
      { year: '2021', title: 'National Championship', description: 'Won 1st place at the National Robotics Championship in the Autonomous Navigation category.', image: { url: '', alt: 'Championship Win', publicId: '' }, isPublished: true, displayOrder: 4 },
      { year: '2022', title: 'AI & ML Integration', description: 'Established the AI/ML division, working on computer vision and deep learning for robotic systems.', image: { url: '', alt: 'AI Division', publicId: '' }, isPublished: true, displayOrder: 5 },
      { year: '2023', title: 'International Debut', description: 'Represented Bangladesh at the Asia-Pacific Robotics Competition in Singapore.', image: { url: '', alt: 'International Competition', publicId: '' }, isPublished: true, displayOrder: 6 },
      { year: '2024', title: 'New Workshop Facility', description: 'Opened a dedicated 2000 sq ft workshop with 3D printers, CNC machines, and electronics lab.', image: { url: '', alt: 'New Facility', publicId: '' }, isPublished: true, displayOrder: 7 },
      { year: '2025', title: '50+ Active Members', description: 'Grew to over 50 active members across hardware, software, AI, and business teams.', image: { url: '', alt: 'Team Growth', publicId: '' }, isPublished: true, displayOrder: 8 },
    ],
  },

  achievements: {
    isEnabled: true,
    displayOrder: 9,
    items: [
      { title: 'National Robotics Champions', description: 'Won 1st place at the Bangladesh National Robotics Championship in Autonomous Navigation.', year: '2021', image: { url: '', alt: 'Championship Trophy', publicId: '' }, isPublished: true, displayOrder: 1 },
      { title: 'Best Innovation Award', description: 'Received the Best Innovation Award at DUET Tech Fest for our AI-powered agricultural drone.', year: '2022', image: { url: '', alt: 'Innovation Award', publicId: '' }, isPublished: true, displayOrder: 2 },
      { title: 'Asia-Pacific Finalist', description: 'Made it to the finals at the Asia-Pacific Robotics Competition in Singapore.', year: '2023', image: { url: '', alt: 'APAC Competition', publicId: '' }, isPublished: true, displayOrder: 3 },
      { title: '50+ Projects Completed', description: 'Successfully completed over 50 robotics projects ranging from line followers to autonomous rovers.', year: '2024', image: { url: '', alt: 'Project Milestone', publicId: '' }, isPublished: true, displayOrder: 4 },
      { title: 'Best Workshop Organizer', description: 'Recognized by DUET Central Students Union as the Best Workshop Organizer for 2023.', year: '2023', image: { url: '', alt: 'Workshop Award', publicId: '' }, isPublished: true, displayOrder: 5 },
    ],
  },

  statistics: {
    isEnabled: true,
    displayOrder: 10,
    items: [
      { label: 'Active Members', value: '55+', icon: '👥', isPublished: true, displayOrder: 1 },
      { label: 'Projects Completed', value: '50+', icon: '🤖', isPublished: true, displayOrder: 2 },
      { label: 'Competitions Won', value: '12', icon: '🏆', isPublished: true, displayOrder: 3 },
      { label: 'Workshops Conducted', value: '30+', icon: '📚', isPublished: true, displayOrder: 4 },
      { label: 'Years Active', value: '7', icon: '📅', isPublished: true, displayOrder: 5 },
      { label: 'Alumni Network', value: '200+', icon: '🎓', isPublished: true, displayOrder: 6 },
    ],
  },

  whyJoin: {
    isEnabled: true,
    displayOrder: 11,
    items: [
      { title: 'Hands-On Experience', description: 'Work with real hardware — Arduino, Raspberry Pi, 3D printers, PCB fabrication, and more.', icon: '🔧', isPublished: true, displayOrder: 1 },
      { title: 'Learn From Peers', description: 'Collaborate with experienced seniors and learn cutting-edge technologies in a supportive environment.', icon: '👨‍🏫', isPublished: true, displayOrder: 2 },
      { title: 'Compete Nationally', description: 'Represent DUET in national and international robotics competitions and bring home awards.', icon: '🏆', isPublished: true, displayOrder: 3 },
      { title: 'Build Your Portfolio', description: 'Complete real projects that showcase your skills to future employers and graduate programs.', icon: '💼', isPublished: true, displayOrder: 4 },
      { title: 'Network & Community', description: 'Join a community of like-minded engineers. Many of our alumni are now at top tech companies.', icon: '🌐', isPublished: true, displayOrder: 5 },
      { title: 'Free Training', description: 'Access free workshops, training sessions, and learning resources on robotics and AI.', icon: '🎓', isPublished: true, displayOrder: 6 },
    ],
  },

  facultyAdvisors: {
    isEnabled: true,
    displayOrder: 12,
    items: [
      {
        name: 'Dr. Md. Rafiqul Islam',
        designation: 'Professor & Head',
        department: 'Department of EEE, DUET',
        image: { url: '', alt: 'Dr. Rafiqul Islam', publicId: '' },
        message: 'Robotics is the future of engineering education. I am proud to advise DRC and watch these students push the boundaries of innovation.',
        socialLinks: { facebook: '', linkedin: '', github: '', website: '' },
        isPublished: true,
        displayOrder: 1,
      },
      {
        name: 'Dr. Fatema Khatun',
        designation: 'Associate Professor',
        department: 'Department of CSE, DUET',
        image: { url: '', alt: 'Dr. Fatema Khatun', publicId: '' },
        message: 'The combination of software and hardware in robotics provides the perfect learning environment for engineering students.',
        socialLinks: { facebook: '', linkedin: '', github: '', website: '' },
        isPublished: true,
        displayOrder: 2,
      },
    ],
  },

  facilities: {
    isEnabled: true,
    displayOrder: 13,
    items: [
      { name: 'Central Workshop', description: 'A fully equipped 2000 sq ft workshop with workbenches, soldering stations, and power tools for prototyping.', image: { url: '', alt: 'Central Workshop', publicId: '' }, isPublished: true, displayOrder: 1 },
      { name: 'Electronics Lab', description: 'Dedicated electronics lab with oscilloscopes, multimeters, function generators, and component storage.', image: { url: '', alt: 'Electronics Lab', publicId: '' }, isPublished: true, displayOrder: 2 },
      { name: 'Meeting Room', description: 'Air-conditioned meeting room with projector and whiteboard for team discussions and presentations.', image: { url: '', alt: 'Meeting Room', publicId: '' }, isPublished: true, displayOrder: 3 },
    ],
  },

  laboratories: {
    isEnabled: true,
    displayOrder: 14,
    items: [
      {
        name: 'Robotics Prototyping Lab',
        description: 'Primary lab for building and testing robot prototypes with dedicated test tracks.',
        image: { url: '', alt: 'Robotics Lab', publicId: '' },
        equipment: ['3D Printers (x3)', 'CNC Machine', 'Laser Cutter', 'Arduino Mega kits', 'Raspberry Pi kits', 'Motor drivers & actuators'],
        isPublished: true,
        displayOrder: 1,
      },
      {
        name: 'AI & Computer Vision Lab',
        description: 'GPU-equipped workstations for training ML models and real-time computer vision experiments.',
        image: { url: '', alt: 'AI Lab', publicId: '' },
        equipment: ['NVIDIA RTX 3060 Workstations (x4)', 'Jetson Nano boards', 'Intel RealSense cameras', 'LiDAR sensors', 'Webcam clusters'],
        isPublished: true,
        displayOrder: 2,
      },
      {
        name: 'PCB Fabrication Lab',
        description: 'In-house PCB design and fabrication facility for custom circuit boards.',
        image: { url: '', alt: 'PCB Lab', publicId: '' },
        equipment: ['PCB Etching Tank', 'Reflow Soldering Station', 'Hot Air Rework Station', 'Pick and Place Simulator', 'Multimeters & Oscilloscopes'],
        isPublished: true,
        displayOrder: 3,
      },
    ],
  },

  sponsorsPartners: {
    isEnabled: true,
    displayOrder: 15,
    items: [
      { name: 'DUET Authority', image: { url: '', alt: 'DUET Logo', publicId: '' }, website: 'https://duet.ac.bd', tier: 'platinum', isPublished: true, displayOrder: 1 },
      { name: 'RoboTech Bangladesh', image: { url: '', alt: 'RoboTech Logo', publicId: '' }, website: 'https://robotechbd.com', tier: 'gold', isPublished: true, displayOrder: 2 },
      { name: 'InnovateTech Solutions', image: { url: '', alt: 'InnovateTech Logo', publicId: '' }, website: '', tier: 'silver', isPublished: true, displayOrder: 3 },
    ],
  },

  gallery: {
    isEnabled: true,
    displayOrder: 16,
    items: [
      { url: '', alt: 'Team building robot', caption: 'Team working on autonomous rover', type: 'image', isPublished: true, displayOrder: 1 },
      { url: '', alt: 'Competition day', caption: 'DRC at National Robotics Championship 2023', type: 'image', isPublished: true, displayOrder: 2 },
      { url: '', alt: 'Workshop session', caption: 'Arduino Basics workshop with 50+ participants', type: 'image', isPublished: true, displayOrder: 3 },
      { url: '', alt: 'New facility', caption: 'Our state-of-the-art robotics workshop', type: 'image', isPublished: true, displayOrder: 4 },
    ],
  },

  promotionalVideo: {
    isEnabled: true,
    displayOrder: 17,
    title: 'See DRC in Action',
    description: 'Watch our team build, code, and compete. This is what engineering passion looks like.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '',
  },

  faqs: {
    isEnabled: true,
    displayOrder: 18,
    items: [
      { question: 'Who can join DRC?', answer: 'Any currently enrolled DUET student, regardless of department or year, can join DRC. We welcome students from all engineering backgrounds.', isPublished: true, displayOrder: 1 },
      { question: 'Do I need prior robotics experience?', answer: 'No! We accept members at all skill levels. Our workshop series will teach you everything from basic electronics to advanced programming.', isPublished: true, displayOrder: 2 },
      { question: 'How much time does DRC require?', answer: 'We recommend around 8-10 hours per week, but it varies based on project deadlines and competition schedules. Attendance at weekly meetings is expected.', isPublished: true, displayOrder: 3 },
      { question: 'Is there a membership fee?', answer: 'There is no membership fee. All project materials and workshop resources are provided by the club, funded through sponsorships and DUET authority support.', isPublished: true, displayOrder: 4 },
      { question: 'What tools and equipment are available?', answer: 'We have 3D printers, CNC machines, soldering stations, Arduino/Raspberry Pi kits, oscilloscopes, and a dedicated workspace open daily from 10 AM to 10 PM.', isPublished: true, displayOrder: 5 },
      { question: 'How do I apply?', answer: 'Fill out the registration form on our website during intake periods (typically at the start of each semester). Selected candidates will be called for an orientation session.', isPublished: true, displayOrder: 6 },
    ],
  },

  callToAction: {
    isEnabled: true,
    displayOrder: 19,
    title: 'Ready to Build the Future?',
    description: 'Join DUET Robotics Club and turn your engineering dreams into reality. No experience needed — just passion and curiosity.',
    buttonText: 'Join DRC Now',
    buttonLink: '/register',
    image: { url: '', alt: 'Join DRC', publicId: '' },
  },
};

export async function POST() {
  try {
    await connectDB();

    const result = await About.findOneAndUpdate(
      { _singleton: 'main' },
      { $set: SEED_DATA },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: 'About CMS seeded with test data',
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Seed failed';
    console.error('[About Seed] Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
