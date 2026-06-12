// ─── Industry → Category mapping ───────────────────────────────
const INDUSTRY_CATS = {
  "Hospitality & Food":["Restaurant","Café","Bakery","Bar & Pub","Fast Food","Catering","Food Truck","Winery","Brewery","Meal Prep"],
  "Home & Trade Services":["Plumber","Electrician","Builder","Carpenter","Painter","Tiler","Roofer","Landscaper","Cleaner","Pest Control","Handyman","Solar Installer","Pool & Spa","Locksmith","Concreter","Fencer"],
  "Health & Medical":["GP / Doctor","Dentist","Physiotherapist","Psychologist","Chiropractor","Pharmacist","Optometrist","Specialist","Naturopath","Allied Health","Aged Care","NDIS Provider"],
  "Real Estate & Property":["Real Estate Agent","Property Manager","Buyers Agent","Conveyancer","Valuer","Strata Manager","Building Inspector","Mortgage Broker"],
  "Education & Childcare":["Childcare Centre","Tutor","Primary School","Secondary School","TAFE / College","Driving School","Language School","Music Teacher","Art Class"],
  "Professional Services":["Accountant","Lawyer","Financial Advisor","Insurance Broker","IT Consultant","Marketing Agency","HR Consultant","Business Consultant","Recruitment Agency"],
  "Retail & Shopping":["Grocery","Clothing","Electronics","Furniture","Hardware","Pharmacy","Pet Store","Sports & Outdoors","Books & Stationery","Gift Shop"],
  "Beauty & Personal Care":["Hair Salon","Nail Salon","Beauty Therapist","Barber","Massage Therapist","Tattooist","Spa","Cosmetics"],
  "Automotive":["Mechanic","Car Dealer","Tyre Shop","Smash Repairs","Car Wash","Auto Parts"],
  "Community & Culture":["Place of Worship","Cultural Organisation","Volunteer Group","Community Centre","Library","Museum","Sports Club","Arts & Crafts"],
  "Technology & IT":["Web Developer","Software Company","IT Support","Cybersecurity","App Developer","Data & Analytics","Cloud Services"],
  "Finance & Insurance":["Bank","Credit Union","Financial Planner","Tax Agent","Mortgage Broker","Insurance"],
  "Fitness & Sport":["Gym","Yoga Studio","Personal Trainer","Pilates","Martial Arts","Swimming Pool","Sports Club","Cycling"],
  "Events & Entertainment":["Wedding Planner","Photographer","Videographer","DJ","Band","Venue","Florist","Party Hire"],
  "Home Business":["Online Retailer","Freelancer","Consultant","Creative Services","Coaching","Home Bakery","Home Care","Virtual Assistant"]
};

// ─── Suburbs by state ───────────────────────────────────────────
const STATE_SUBURBS = {
  VIC:["Point Cook","Werribee","Hoppers Crossing","Wyndham Vale","Laverton","Williams Landing","Altona Meadows","Truganina","Manor Lakes","Tarneit","Sunshine West","Derrimut","Footscray","Williamstown","Newport","Melbourne CBD","Richmond","Fitzroy","St Kilda","South Yarra","Toorak","Hawthorn","Box Hill","Doncaster","Ringwood","Dandenong","Frankston","Mornington","Geelong","Ballarat","Bendigo"],
  NSW:["Sydney CBD","Parramatta","Blacktown","Liverpool","Penrith","Campbelltown","Chatswood","Hornsby","Manly","Bondi","Newtown","Surry Hills","Strathfield","Auburn","Bankstown","Hurstville","Miranda","Cronulla","Newcastle","Wollongong","Central Coast","Coffs Harbour","Port Macquarie","Tamworth","Dubbo"],
  QLD:["Brisbane CBD","South Brisbane","West End","Fortitude Valley","New Farm","Toowong","Indooroopilly","Carindale","Logan","Ipswich","Sunshine Coast","Noosa","Gold Coast","Surfers Paradise","Cairns","Townsville","Rockhampton","Mackay","Toowoomba"],
  WA:["Perth CBD","Fremantle","Subiaco","Leederville","Northbridge","Midland","Armadale","Rockingham","Mandurah","Joondalup","Stirling","Wanneroo","Bunbury","Geraldton","Kalgoorlie","Albany"],
  SA:["Adelaide CBD","Glenelg","Norwood","Unley","Burnside","Tea Tree Gully","Marion","Mitcham","Onkaparinga","Port Adelaide","Mount Barker","Murray Bridge","Whyalla","Mount Gambier"],
  TAS:["Hobart CBD","Sandy Bay","Glenorchy","Clarence","Kingborough","Launceston","Devonport","Burnie"],
  ACT:["Canberra CBD","Belconnen","Gungahlin","Tuggeranong","Woden","Weston Creek","Molonglo Valley"],
  NT:["Darwin CBD","Palmerston","Nightcliff","Casuarina","Parap","Alice Springs","Katherine"]
};

// ─── Business DB ────────────────────────────────────────────────
const DB = [
  {id:1,name:"Point Cook Plumbing Co.",industry:"Home & Trade Services",cat:"Plumber",suburb:"Point Cook",state:"VIC",desc:"Licensed plumbers for hot water systems, leaks, drainage and full renovations. Same-day emergency callouts available.",icon:"🔧",tags:["Plumbing","Hot water","Emergency"],mobile:"0411 222 333",email:"info@pointcookplumbing.com.au",wa:"0411 222 333",hours:{Mon:"7am–5pm",Tue:"7am–5pm",Wed:"7am–5pm",Thu:"7am–5pm",Fri:"7am–5pm",Sat:"8am–12pm",Sun:"Closed",PH:"Emergency only"},lastUpdated:"2026-05-18",submittedAt:"2025-11-02",contact:"James O'Brien",status:"approved",featured:true},
  {id:2,name:"Kaladhara Arts & Culture",industry:"Community & Culture",cat:"Cultural Organisation",suburb:"Point Cook",state:"VIC",desc:"Tamil classical dance, music and cultural events. Classes for all ages in Bharatanatyam and Carnatic music.",icon:"🎭",tags:["Dance","Tamil","Music"],mobile:"0412 555 666",email:"kaladhara@gmail.com",wa:"0412 555 666",hours:{Mon:"Closed",Tue:"Closed",Wed:"Closed",Thu:"Closed",Fri:"6pm–8pm",Sat:"9am–1pm",Sun:"10am–12pm",PH:"Closed"},lastUpdated:"2026-06-01",submittedAt:"2025-09-20",contact:"Priya Suresh",status:"approved",featured:true},
  {id:3,name:"StudySpark Tutoring",industry:"Education & Childcare",cat:"Tutor",suburb:"Point Cook",state:"VIC",desc:"Selective school exam prep for Grades 3–10. VIC and NSW curricula — Maths, English and Reasoning.",icon:"📚",tags:["Selective prep","Maths","English"],mobile:"0433 999 111",email:"studyspark@gmail.com",wa:"0433 999 111",hours:{Mon:"Closed",Tue:"4pm–7pm",Wed:"4pm–7pm",Thu:"4pm–7pm",Fri:"4pm–7pm",Sat:"9am–5pm",Sun:"10am–4pm",PH:"Closed"},lastUpdated:"2026-05-28",submittedAt:"2025-08-10",contact:"Anika Sharma",status:"approved"},
  {id:4,name:"Werribee Electrical Solutions",industry:"Home & Trade Services",cat:"Electrician",suburb:"Werribee",state:"VIC",desc:"Safety switches, solar installations, switchboard upgrades and new builds. Fully licensed electrician.",icon:"⚡",tags:["Electrical","Solar","Switchboards"],mobile:"0422 111 444",email:"werribee.elec@gmail.com",hours:{Mon:"8am–5pm",Tue:"8am–5pm",Wed:"8am–5pm",Thu:"8am–5pm",Fri:"8am–5pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-04-30",submittedAt:"2025-10-15",contact:"Mark Nguyen",status:"approved",featured:true},
  {id:5,name:"Hoppers Auto Care",industry:"Automotive",cat:"Mechanic",suburb:"Hoppers Crossing",state:"VIC",desc:"Logbook servicing, brakes, tyres and RWC certificates. Hyundai, Kia and Toyota specialists.",icon:"🚗",tags:["Servicing","RWC","Tyres"],phone:"03 9748 1234",email:"hoppers.auto@gmail.com",hours:{Mon:"8am–5:30pm",Tue:"8am–5:30pm",Wed:"8am–5:30pm",Thu:"8am–5:30pm",Fri:"8am–5:30pm",Sat:"9am–1pm",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-03-14",submittedAt:"2025-07-22",contact:"Tony Carbone",status:"approved"},
  {id:6,name:"Wyndham Wellbeing Clinic",industry:"Health & Medical",cat:"GP / Doctor",suburb:"Wyndham Vale",state:"VIC",desc:"GP bulk billing, physiotherapy, dietitian and podiatry under one roof. Online bookings available.",icon:"🏥",tags:["GP","Physio","Bulk billing"],phone:"03 9971 4567",email:"admin@wyndhamwellbeing.com.au",hours:{Mon:"8am–7pm",Tue:"8am–7pm",Wed:"8am–7pm",Thu:"8am–7pm",Fri:"8am–6pm",Sat:"9am–1pm",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-05",submittedAt:"2025-06-01",contact:"Dr. Lisa Park",status:"approved"},
  {id:7,name:"Tarneit Mortgage Brokers",industry:"Finance & Insurance",cat:"Mortgage Broker",suburb:"Tarneit",state:"VIC",desc:"Home loans, refinancing and investment loans. 40+ lenders. First-home buyer specialists.",icon:"🏠",tags:["Home loans","Refinance","First home"],mobile:"0412 876 543",email:"tarneit.mortgage@gmail.com",wa:"0412 876 543",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"9am–2pm",Sun:"By appointment",PH:"Closed"},lastUpdated:"2026-05-05",submittedAt:"2024-10-20",contact:"David Chen",status:"approved",featured:true},
  {id:8,name:"Point Cook CFA Fire Brigade",industry:"Community & Culture",cat:"Volunteer Group",suburb:"Point Cook",state:"VIC",desc:"Volunteer fire brigade serving Point Cook and Cheetham Wetlands coastal park. Community fire safety programs.",icon:"🚒",tags:["Emergency","Volunteer","Safety"],phone:"03 9395 0000",email:"pointcook.cfa@cfa.vic.gov.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2024-01-10",contact:"Captain Williams",status:"approved"},
  {id:9,name:"Altona Meadows Yoga & Pilates",industry:"Fitness & Sport",cat:"Yoga Studio",suburb:"Altona Meadows",state:"VIC",desc:"Reformer pilates, hot yoga, pregnancy yoga and kids yoga. Small class sizes.",icon:"🧘",tags:["Yoga","Pilates","Pregnancy"],mobile:"0466 444 555",email:"altona.yoga@gmail.com",hours:{Mon:"6am–7:30pm",Tue:"6am–7:30pm",Wed:"6am–7:30pm",Thu:"6am–7:30pm",Fri:"6am–6pm",Sat:"7am–12pm",Sun:"8am–11am",PH:"Closed"},lastUpdated:"2026-06-02",submittedAt:"2024-02-18",contact:"Chloe Barnes",status:"approved"},
  {id:10,name:"Blacktown Mortgage Specialists",industry:"Finance & Insurance",cat:"Mortgage Broker",suburb:"Blacktown",state:"NSW",desc:"First home buyers, refinancing and investment loans. Free consultation. MFAA accredited.",icon:"🏦",tags:["Home loans","First home","MFAA"],mobile:"0422 456 789",email:"info@blacktownmortgage.com.au",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–5pm",Sat:"9am–1pm",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-04-18",submittedAt:"2025-03-22",contact:"Sarah Johnson",status:"approved",featured:true},
  {id:11,name:"Gold Coast Surf School",industry:"Fitness & Sport",cat:"Sports Club",suburb:"Surfers Paradise",state:"QLD",desc:"Learn to surf with qualified instructors. Group and private lessons for all ages. Equipment provided.",icon:"🏄",tags:["Surfing","Lessons","Beach"],mobile:"0412 777 888",email:"gcsurf@gmail.com",hours:{Mon:"7am–5pm",Tue:"7am–5pm",Wed:"7am–5pm",Thu:"7am–5pm",Fri:"7am–5pm",Sat:"7am–4pm",Sun:"8am–3pm",PH:"By appointment"},lastUpdated:"2026-05-01",submittedAt:"2025-01-10",contact:"Damo Wilson",status:"approved",featured:true},
  {id:12,name:"Fremantle Coffee Roasters",industry:"Hospitality & Food",cat:"Café",suburb:"Fremantle",state:"WA",desc:"Specialty single-origin coffee, cold brew on tap and housemade pastries. Dog-friendly courtyard.",icon:"☕",tags:["Coffee","Specialty","Dog-friendly"],mobile:"0412 111 222",hours:{Mon:"7am–4pm",Tue:"7am–4pm",Wed:"7am–4pm",Thu:"7am–4pm",Fri:"7am–5pm",Sat:"7am–5pm",Sun:"8am–3pm",PH:"8am–2pm"},lastUpdated:"2026-06-03",submittedAt:"2025-04-08",contact:"Jake Morris",status:"approved"},
  // Pending
  {id:13,name:"Williams Landing Barber",industry:"Beauty & Personal Care",cat:"Barber",suburb:"Williams Landing",state:"VIC",desc:"Men's cuts, fades, beard trims and hot towel shaves. Walk-ins and bookings welcome.",icon:"💈",tags:["Barber","Fades","Beard"],mobile:"0411 777 888",email:"wlbarber@gmail.com",hours:{Mon:"Closed",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–7pm",Sat:"8am–5pm",Sun:"10am–3pm",PH:"Closed"},lastUpdated:"2026-06-10",submittedAt:"2026-06-10",contact:"Raj Patel",status:"pending"},
  {id:14,name:"Truganina Playgroup",industry:"Community & Culture",cat:"Community Centre",suburb:"Truganina",state:"VIC",desc:"Free weekly playgroup for children 0–5. Morning tea provided. All families welcome.",icon:"👶",tags:["Playgroup","Kids","Free"],mobile:"0499 123 456",email:"truganina.pg@gmail.com",hours:{Mon:"Closed",Tue:"Closed",Wed:"9:30am–11:30am",Thu:"Closed",Fri:"Closed",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-11",submittedAt:"2026-06-11",contact:"Sarah Chen",status:"pending"},
  {id:15,name:"Manor Lakes Handyman",industry:"Home & Trade Services",cat:"Handyman",suburb:"Manor Lakes",state:"VIC",desc:"Flat-pack assembly, minor repairs, painting and picture hanging. Pensioner discounts.",icon:"🔨",tags:["Handyman","Repairs","Assembly"],mobile:"0422 999 555",email:"mlhandyman@gmail.com",wa:"0422 999 555",hours:{Mon:"8am–5pm",Tue:"8am–5pm",Wed:"8am–5pm",Thu:"8am–5pm",Fri:"8am–5pm",Sat:"8am–2pm",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-06-12",contact:"Tom Nguyen",status:"pending"}
];

// ─── Opportunities DB ───────────────────────────────────────────
// type: Job | Apprenticeship | Traineeship | Internship | Volunteering | Work Experience
const OPPORTUNITIES = [
  {id:101,title:"Plumbing Apprentice — Certificate III",type:"Apprenticeship",org:"Point Cook Plumbing Co.",bizId:1,suburb:"Point Cook",state:"VIC",industry:"Home & Trade Services",arrangement:"Full-time",salary:"Award wage (plumbing apprentice rates)",duration:"4 years",icon:"🔧",
   desc:"We are looking for an enthusiastic plumbing apprentice to join our small team in Point Cook. You will work alongside experienced licensed plumbers on residential and commercial projects across the western suburbs.\n\nThis is a genuine trade opportunity with real on-the-job learning from day one.",
   responsibilities:["Assist licensed plumbers on-site with hot water, drainage and fit-out work","Learn how to read plans and comply with AS/NZS plumbing standards","Complete Certificate III in Plumbing through a registered training organisation","Attend TAFE block release (fully supported by the business)"],
   requirements:["Year 10 minimum (Year 12 preferred)","Australian citizen or permanent resident","Reliable transport to Point Cook","Enthusiasm, punctuality and a can-do attitude"],
   contact:"James O'Brien",email:"info@pointcookplumbing.com.au",phone:"0411 222 333",
   closingDate:"2026-07-31",postedAt:"2026-06-01",lastUpdated:"2026-06-01",status:"approved",featured:true},

  {id:102,title:"Front-of-House Team Member",type:"Job",org:"Point Cook Indian Kitchen",bizId:5,suburb:"Point Cook",state:"VIC",industry:"Hospitality & Food",arrangement:"Casual",salary:"$25–$28/hr + super",duration:"Ongoing",icon:"🍛",
   desc:"We are a busy Indian restaurant in Point Cook looking for a friendly, reliable front-of-house team member to join us on casual shifts. Experience in hospitality is preferred but we are happy to train the right person.",
   responsibilities:["Welcome and seat guests","Take orders and process payments via POS system","Maintain a clean and presentable dining room","Assist with setup and pack-down"],
   requirements:["RSA certificate (or willingness to obtain)","Friendly and professional manner","Available weekends","Experience in hospitality preferred"],
   contact:"Sunita Patel",email:"jobs@pointcookindian.com.au",
   closingDate:"2026-07-15",postedAt:"2026-06-05",lastUpdated:"2026-06-05",status:"approved"},

  {id:103,title:"Volunteer Firefighter",type:"Volunteering",org:"Point Cook CFA Fire Brigade",bizId:8,suburb:"Point Cook",state:"VIC",industry:"Community & Culture",arrangement:"Volunteer",salary:"Unpaid — all training and equipment provided",duration:"Ongoing",icon:"🚒",
   desc:"Join your local CFA brigade and make a real difference in the community. No previous experience required — we provide full training including First Aid, road rescue and structural firefighting at no cost to you.\n\nPoint Cook Brigade serves a rapidly growing community including residential areas and the Cheetham Wetlands coastal park.",
   responsibilities:["Respond to emergency incidents including fires, road accidents and storm damage","Participate in regular weekly training nights (Tuesday evenings)","Assist with community education and fire prevention programs","Maintain equipment and appliances to CFA standards"],
   requirements:["Must be 16 years or older","Australian resident","Physically fit","Available for call-outs during the day or evening (as able)","Commitment to training"],
   contact:"Captain Williams",email:"pointcook.cfa@cfa.vic.gov.au",phone:"03 9395 0000",
   closingDate:null,postedAt:"2026-05-01",lastUpdated:"2026-06-12",status:"approved",featured:true},

  {id:104,title:"Yoga Instructor — Casual Cover",type:"Job",org:"Altona Meadows Yoga & Pilates",bizId:9,suburb:"Altona Meadows",state:"VIC",industry:"Fitness & Sport",arrangement:"Casual",salary:"$45–$55/hr",duration:"Casual ongoing",icon:"🧘",
   desc:"We are looking for a qualified yoga instructor to provide casual cover for our timetabled classes. Styles we offer include Hatha, Vinyasa, Yin, Pregnancy Yoga and Kids Yoga. Must hold current Yoga Alliance registration.",
   responsibilities:["Deliver safe, engaging yoga classes to various skill levels","Adapt classes for pregnancy and children where needed","Maintain accurate class records and attendance","Communicate professionally with studio management"],
   requirements:["Yoga Alliance RYT 200 minimum","Current First Aid and CPR","Working with Children Check","At least 1 year of teaching experience preferred"],
   contact:"Chloe Barnes",email:"altona.yoga@gmail.com",phone:"0466 444 555",
   closingDate:"2026-07-20",postedAt:"2026-06-03",lastUpdated:"2026-06-03",status:"approved"},

  {id:105,title:"Finance Intern — Mortgage Broking",type:"Internship",org:"Tarneit Mortgage Brokers",bizId:7,suburb:"Tarneit",state:"VIC",industry:"Finance & Insurance",arrangement:"Part-time",salary:"Paid — $18–$22/hr",duration:"12 weeks",icon:"🏠",
   desc:"An excellent opportunity for a finance or business student to gain hands-on experience in the mortgage broking industry. You'll assist our senior broker with client research, comparison reports and compliance administration.\n\nSuitable for penultimate or final-year students in Finance, Commerce, Accounting or related fields.",
   responsibilities:["Assist with home loan research and lender comparison","Help prepare client files and loan applications","Learn the end-to-end home loan process","Shadow broker at client appointments (with consent)"],
   requirements:["Currently enrolled in Finance, Commerce or related degree","Strong Excel and Word skills","High attention to detail","Current Victorian driver's licence"],
   contact:"David Chen",email:"tarneit.mortgage@gmail.com",phone:"0412 876 543",
   closingDate:"2026-07-01",postedAt:"2026-06-08",lastUpdated:"2026-06-08",status:"approved"},

  {id:106,title:"Cultural Dance Teacher — Tamil Bharatanatyam",type:"Job",org:"Kaladhara Arts & Culture",bizId:2,suburb:"Point Cook",state:"VIC",industry:"Community & Culture",arrangement:"Part-time",salary:"$35–$45/hr",duration:"Ongoing — weekend classes",icon:"🎭",
   desc:"Kaladhara is seeking an experienced Bharatanatyam teacher to run weekend classes for children and adults in Point Cook. Classes are held Saturday and Sunday mornings. This is a part-time role with scope to grow as enrolments increase.",
   responsibilities:["Plan and deliver Bharatanatyam classes for beginner to intermediate students","Prepare students for annual Arangetram and community performances","Liaise with parents and manage student progress","Assist with Kaladhara cultural events throughout the year"],
   requirements:["Proficiency in Bharatanatyam (Kalakshetra or equivalent school)","Experience teaching children","Working with Children Check","Excellent communication skills in English (Tamil advantageous)"],
   contact:"Priya Suresh",email:"kaladhara@gmail.com",phone:"0412 555 666",
   closingDate:"2026-07-31",postedAt:"2026-06-01",lastUpdated:"2026-06-01",status:"approved"},

  {id:107,title:"Automotive Apprentice — Certificate III",type:"Apprenticeship",org:"Hoppers Auto Care",bizId:5,suburb:"Hoppers Crossing",state:"VIC",industry:"Automotive",arrangement:"Full-time",salary:"Award wage (automotive apprentice rates)",duration:"3.5 years",icon:"🚗",
   desc:"Hoppers Auto Care is seeking a motivated school leaver or career changer to start a light vehicle mechanical apprenticeship. We specialise in Hyundai, Kia and Toyota vehicles and service a loyal local customer base.",
   responsibilities:["Perform logbook services under supervision","Learn diagnostic and repair procedures","Assist with brakes, tyres, exhausts and suspension","Maintain clean and organised workshop"],
   requirements:["Year 10 minimum","Manual driver's licence (or willing to obtain)","Strong mechanical interest","Reliable, punctual and safety-conscious"],
   contact:"Tony Carbone",email:"hoppers.auto@gmail.com",phone:"03 9748 1234",
   closingDate:"2026-08-15",postedAt:"2026-06-10",lastUpdated:"2026-06-10",status:"approved",featured:true},

  {id:108,title:"Barista / Café Assistant",type:"Job",org:"Fremantle Coffee Roasters",bizId:12,suburb:"Fremantle",state:"WA",industry:"Hospitality & Food",arrangement:"Part-time",salary:"$24–$27/hr + super",duration:"Ongoing",icon:"☕",
   desc:"We're looking for a barista to join our specialty coffee café in Fremantle. Must have experience on a commercial espresso machine. You'll be part of a small, passionate team obsessed with quality coffee and friendly service.",
   responsibilities:["Prepare espresso-based beverages to a consistent standard","Operate and clean espresso machine and grinders","Welcome customers and maintain a positive café environment","Assist with food preparation and stock rotation"],
   requirements:["Minimum 1 year barista experience on commercial machine","Food handling certificate","RSA preferred","Available early mornings and weekends"],
   contact:"Jake Morris",email:"jobs@fremantleroasters.com.au",phone:"0412 111 222",
   closingDate:"2026-07-10",postedAt:"2026-06-06",lastUpdated:"2026-06-06",status:"approved"},

  {id:109,title:"High School Work Experience — Finance",type:"Work Experience",org:"Tarneit Mortgage Brokers",bizId:7,suburb:"Tarneit",state:"VIC",industry:"Finance & Insurance",arrangement:"On-site",salary:"Unpaid (school work experience)",duration:"1–2 weeks",icon:"📊",
   desc:"We welcome Year 10–12 students for work experience placements. Get a genuine look at how mortgage broking works — from client meetings and research to lender comparisons and compliance paperwork. A great insight into a financial services career.",
   responsibilities:["Shadow senior broker during client calls and meetings","Learn how to use mortgage comparison software","Assist with basic research and documentation","Attend team meetings and daily operations"],
   requirements:["Year 10–12 student","School-arranged work experience placement","Professional dress code","Keen interest in finance or business"],
   contact:"David Chen",email:"tarneit.mortgage@gmail.com",
   closingDate:null,postedAt:"2026-05-20",lastUpdated:"2026-05-20",status:"approved"},

  {id:110,title:"Mortgage Broking Traineeship — Certificate IV",type:"Traineeship",org:"Blacktown Mortgage Specialists",bizId:10,suburb:"Blacktown",state:"NSW",industry:"Finance & Insurance",arrangement:"Full-time",salary:"Award wage + super",duration:"18 months",icon:"🏦",
   desc:"Earn while you learn — join our award-winning mortgage broking firm in Blacktown as a trainee. Complete your Certificate IV in Finance and Mortgage Broking while gaining real client experience. Potential for a full-time role upon completion.",
   responsibilities:["Assist with client enquiries and loan applications","Process documentation and liaise with lenders","Build product knowledge across 40+ lenders","Shadow senior brokers and develop your client management skills"],
   requirements:["Year 12 or equivalent","Strong communication and organisational skills","Interest in finance and property","No previous experience required — full training provided"],
   contact:"Sarah Johnson",email:"careers@blacktownmortgage.com.au",phone:"0422 456 789",
   closingDate:"2026-07-25",postedAt:"2026-06-09",lastUpdated:"2026-06-09",status:"approved"},

  {id:111,title:"Surf Instructor — Junior",type:"Job",org:"Gold Coast Surf School",bizId:11,suburb:"Surfers Paradise",state:"QLD",industry:"Fitness & Sport",arrangement:"Casual",salary:"$28–$35/hr",duration:"Summer season + year-round",icon:"🏄",
   desc:"Gold Coast Surf School is expanding its instructor team for the upcoming season. We're looking for energetic, safety-conscious surf instructors to deliver group and private lessons to students of all ages and skill levels.",
   responsibilities:["Deliver safe surf lessons in line with Surfing Australia guidelines","Conduct safety briefings and assess water conditions","Manage equipment (boards, wetsuits, leashes)","Provide positive encouragement to students"],
   requirements:["Surfing Australia Surf Instructor Level 1 (or willing to obtain — we will fund)","Bronze Medallion or equivalent water safety award","Current First Aid and CPR","Excellent people skills"],
   contact:"Damo Wilson",email:"jobs@gcsurf.com.au",phone:"0412 777 888",
   closingDate:"2026-07-31",postedAt:"2026-06-04",lastUpdated:"2026-06-04",status:"approved"},

  {id:112,title:"Tamil Language Tutor — Weekend",type:"Job",org:"Kaladhara Arts & Culture",bizId:2,suburb:"Point Cook",state:"VIC",industry:"Community & Culture",arrangement:"Part-time",salary:"$30–$40/hr",duration:"Ongoing — Saturdays",icon:"📖",
   desc:"We are looking for an experienced Tamil language tutor to deliver weekend classes for children (5–16 years) in Point Cook. Classes run Saturday mornings as part of our community language program.",
   responsibilities:["Plan and deliver age-appropriate Tamil literacy and oral language lessons","Track student progress and communicate with parents","Prepare students for community language examinations","Participate in Kaladhara cultural programs"],
   requirements:["Native or near-native Tamil proficiency","Teaching experience (formal or informal)","Working with Children Check","Patient, enthusiastic approach to teaching"],
   contact:"Priya Suresh",email:"kaladhara@gmail.com",phone:"0412 555 666",
   closingDate:"2026-07-15",postedAt:"2026-06-02",lastUpdated:"2026-06-02",status:"approved"},

  // Pending opportunities
  {id:113,title:"Electrical Apprentice Wanted",type:"Apprenticeship",org:"Werribee Electrical Solutions",bizId:4,suburb:"Werribee",state:"VIC",industry:"Home & Trade Services",arrangement:"Full-time",salary:"Award wage",duration:"4 years",icon:"⚡",
   desc:"Seeking a motivated school leaver to start a Certificate III in Electrotechnology with us. Work on residential solar, switchboard upgrades and general electrical work across the western suburbs.",
   responsibilities:["Assist licensed electricians on residential and commercial sites","Learn wiring, switchboard work and solar installations","Complete Cert III Electrotechnology through TAFE","Follow all safety procedures on site"],
   requirements:["Year 10 minimum","Physically fit and able to work at heights","Clean driving record","Keen interest in electrical trade"],
   contact:"Mark Nguyen",email:"werribee.elec@gmail.com",phone:"0422 111 444",
   closingDate:"2026-08-01",postedAt:"2026-06-12",lastUpdated:"2026-06-12",status:"pending"}
];
