// ─── Industry → Category mapping ───────────────────────────────
const INDUSTRY_CATS = {
  "Hospitality & Food":      ["Restaurant","Café","Bakery","Bar & Pub","Fast Food","Catering","Food Truck","Takeaway","Winery","Brewery","Meal Prep","Juice Bar"],
  "Home & Trade Services":   ["Electrician","Plumber","Builder","Carpenter","Painter","Tiler","Roofer","Landscaper","Cleaner","Pest Control","Handyman","Solar Installer","Pool & Spa","Locksmith","Concreter","Fencer","Glazier","Air Conditioning","Alarm & Security","Demolition"],
  "Health & Medical":        ["GP / Doctor","Dentist","Physiotherapist","Psychologist","Chiropractor","Pharmacist","Optometrist","Specialist","Naturopath","Allied Health","Aged Care","NDIS Provider","Maternal Health","Speech Therapist","Occupational Therapist"],
  "Legal & Migration":       ["Lawyer","Conveyancer","Notary Public","Migration Agent","Refugee Legal Aid","Community Legal Centre","Wills & Estates","Family Law","Criminal Law","Employment Law","Property Law"],
  "Real Estate & Property":  ["Real Estate Agent","Property Manager","Buyers Agent","Conveyancer","Valuer","Strata Manager","Building Inspector","Mortgage Broker"],
  "Education & Childcare":   ["Childcare Centre","Kindergarten","Tutor","Primary School","Secondary School","TAFE / College","Driving School","Language School","Music Teacher","Art Class","Special Needs Education"],
  "Career & Student Support":["Career Counsellor","Resume & Cover Letter","Interview Coaching","Scholarship Guidance","University Pathways","VET Pathways","Work Experience Placement","School-to-Work Transition","Graduate Programs","Youth Employment"],
  "Driving Schools":          ["Learner Driver Lessons","Licence Test Preparation","Automatic Lessons","Manual Lessons","Hazard Perception Test","Defensive Driving","Heavy Vehicle","Motorcycle","Seniors Refresher","Log Book Lessons","International Licence Conversion"],
  "Professional Services":   ["Accountant","Financial Advisor","Insurance Broker","IT Consultant","Marketing Agency","HR Consultant","Business Consultant","Recruitment Agency","Bookkeeper","Business Coach","PR & Communications"],
  "Retail & Shopping":       ["Grocery","Clothing","Electronics","Furniture","Hardware","Pharmacy","Pet Store","Sports & Outdoors","Books & Stationery","Gift Shop","Florist","Newsagent","Secondhand & Op Shop","Garden Nursery & Supplies","Fabric & Craft Supplies","Specialty Food"],
  "Beauty & Personal Care":  ["Hair Salon","Nail Salon","Beauty Therapist","Barber","Massage Therapist","Tattooist","Spa","Cosmetics"],
  "Automotive":              ["Mechanic","Car Dealer","Tyre Shop","Smash Repairs","Car Wash","Auto Parts","Roadside Assist","EV Specialist"],
  "Community & Culture":     ["Place of Worship","Cultural Organisation","Choir & Singing Group","Sports Club","Arts Group","Volunteer Group","Community Centre","Library","Museum","Language School","Dance Group","Theatre & Drama","Photography Club","Book Club","Multicultural Group"],
  "Migrant & Multicultural": ["Settlement Services","English Language Classes","NAATI Translation","Multicultural Community Group","Cultural Liaison","Overseas Credential Recognition","Migrant Employment Support","Family Reunion Support","Citizenship Classes"],
  "Technology & IT":         ["Web Developer","Software Company","IT Support","Cybersecurity","App Developer","Data & Analytics","Cloud Services","Smart Home"],
  "Finance & Insurance":     ["Bank","Credit Union","Financial Planner","Tax Agent","Mortgage Broker","Insurance","Superannuation","Microfinance"],
  "Fitness & Sport":         ["Gym","Yoga Studio","Personal Trainer","Pilates","Martial Arts","Swimming Pool","Sports Club","Cycling","Tennis Club","Running Club","Basketball Club","Football Club","Cricket Club"],
  "Events & Entertainment":  ["Wedding Planner","Photographer","Videographer","DJ","Band","Venue","Florist","Party Hire","Photo Booth"],
  "Home Business":           ["Online Retailer","Freelancer","Consultant","Creative Services","Coaching","Home Bakery","Home Care","Virtual Assistant"],
  "Emergency & Support":     ["Mental Health Helpline","Crisis Line","Domestic Violence Support","Emergency Shelter","Youth Support","LGBTQIA+ Support","Disability Support","Homeless Services","Drug & Alcohol Support","Financial Hardship","Gambling Help","Grief & Bereavement","On-call GP","After-Hours Medical","Poison Information","Community Legal Aid"],
  "Pet Services":            ["Dog Grooming","Dog Walking","Pet Sitting","Home Pet Sitting","Pet Boarding","Veterinarian","Pet Training","Pet Supplies","Cat Grooming","Mobile Pet Grooming","Aquatic & Exotic Pets","Pet Photography","Animal Rescue","Emergency Vet"],
  "NFP & Charities":         ["Food Bank","Food Relief","Clothing Donations","Shelter & Housing","Emergency Shelter","Refugee Support","Domestic Violence Support","Aged Care Volunteering","Children & Youth","Women's Support","Disability Advocacy","Animal Welfare","Environmental","Aboriginal & Torres Strait Islander","Religious Charity","Community Garden","Toy & Book Drive","Palliative Care Support"]
};

const STATE_SUBURBS = {
  VIC:["Point Cook","Werribee","Hoppers Crossing","Wyndham Vale","Laverton","Williams Landing","Altona Meadows","Truganina","Manor Lakes","Tarneit","Sunshine West","Derrimut","Footscray","Williamstown","Newport","Melbourne CBD","Richmond","Fitzroy","St Kilda","South Yarra","Toorak","Hawthorn","Box Hill","Doncaster","Ringwood","Dandenong","Frankston","Mornington","Geelong","Ballarat","Bendigo","Shepparton","Wodonga","Sunbury","Melton","Craigieburn","Epping","Whittlesea"],
  NSW:["Sydney CBD","Parramatta","Blacktown","Liverpool","Penrith","Campbelltown","Chatswood","Hornsby","Manly","Bondi","Newtown","Surry Hills","Strathfield","Auburn","Bankstown","Hurstville","Miranda","Cronulla","Newcastle","Wollongong","Central Coast","Coffs Harbour","Port Macquarie","Tamworth","Dubbo","Orange","Bathurst","Wagga Wagga","Albury"],
  QLD:["Brisbane CBD","South Brisbane","West End","Fortitude Valley","New Farm","Toowong","Indooroopilly","Carindale","Logan","Ipswich","Sunshine Coast","Noosa","Gold Coast","Surfers Paradise","Cairns","Townsville","Rockhampton","Mackay","Toowoomba","Bundaberg"],
  WA:["Perth CBD","Fremantle","Subiaco","Leederville","Northbridge","Midland","Armadale","Rockingham","Mandurah","Joondalup","Stirling","Wanneroo","Bunbury","Geraldton","Kalgoorlie","Albany"],
  SA:["Adelaide CBD","Glenelg","Norwood","Unley","Burnside","Tea Tree Gully","Marion","Mitcham","Onkaparinga","Port Adelaide","Mount Barker","Murray Bridge","Whyalla","Mount Gambier"],
  TAS:["Hobart CBD","Sandy Bay","Glenorchy","Clarence","Kingborough","Launceston","Devonport","Burnie"],
  ACT:["Canberra CBD","Belconnen","Gungahlin","Tuggeranong","Woden","Weston Creek","Molonglo Valley"],
  NT:["Darwin CBD","Palmerston","Nightcliff","Casuarina","Parap","Alice Springs","Katherine"]
};

const DB = [
  {id:23,name:"Point Cook CFA Fire Brigade",industry:"Emergency & Support",cat:"Crisis Line",suburb:"Point Cook",state:"VIC",desc:"Volunteer fire brigade protecting Point Cook, Cheetham Wetlands and coastal park. Responds to structure fires, grass fires, road accidents, storm damage and rescues. Runs community fire safety education programs and school visits. Actively recruiting volunteers — no experience required, all training provided free.",icon:"🚒",tags:["CFA","Volunteer","Fire & rescue"],web:"https://www.pointcookcfa.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-13",submittedAt:"2024-01-10",contact:"Unit Controller",status:"approved",featured:true,addedBy:"admin"},
  {id:42,name:"Lifeline Australia",industry:"Emergency & Support",cat:"Crisis Line",suburb:"Melbourne CBD",state:"VIC",desc:"24/7 crisis support and suicide prevention. Trained crisis supporters available by phone, text and online chat. Free and confidential.",icon:"💚",tags:["Crisis","Suicide prevention","24/7"],phone:"13 11 14",web:"https://www.lifeline.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Lifeline",status:"approved",featured:true},
  {id:43,name:"Beyond Blue",industry:"Emergency & Support",cat:"Mental Health Helpline",suburb:"Melbourne CBD",state:"VIC",desc:"Free mental health support for anxiety, depression and suicide. Phone, web chat and email 24/7. Online forums also available.",icon:"💙",tags:["Anxiety","Depression","Mental health"],phone:"1300 22 4636",web:"https://www.beyondblue.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Beyond Blue",status:"approved"},
  {id:44,name:"1800RESPECT",industry:"Emergency & Support",cat:"Domestic Violence Support",suburb:"Melbourne CBD",state:"VIC",desc:"National domestic, family and sexual violence counselling service. 24/7 phone and online chat. Free and confidential.",icon:"🧡",tags:["Domestic violence","24/7","Free"],phone:"1800 737 732",web:"https://www.1800respect.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"1800RESPECT",status:"approved"},
  {id:45,name:"Kids Helpline",industry:"Emergency & Support",cat:"Youth Support",suburb:"Brisbane CBD",state:"QLD",desc:"Free, private and confidential 24/7 counselling for young people aged 5–25. Phone and online chat. All issues supported.",icon:"💛",tags:["Youth","5–25 years","24/7"],phone:"1800 55 1800",web:"https://kidshelpline.com.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Kids Helpline",status:"approved"},
  {id:46,name:"MensLine Australia",industry:"Emergency & Support",cat:"Mental Health Helpline",suburb:"Melbourne CBD",state:"VIC",desc:"24/7 telephone and online support for men — relationship issues, mental health, family violence. Professional counsellors.",icon:"🔵",tags:["Men's health","Relationships","24/7"],phone:"1300 789 978",web:"https://mensline.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"MensLine",status:"approved"},
  {id:47,name:"QLife",industry:"Emergency & Support",cat:"LGBTQIA+ Support",suburb:"Melbourne CBD",state:"VIC",desc:"National LGBTQIA+ peer support and referral. Anonymous counselling by phone and webchat. Available 3pm–midnight daily.",icon:"🌈",tags:["LGBTQIA+","Peer support","Confidential"],phone:"1800 184 527",web:"https://qlife.org.au",hours:{Mon:"3pm–12am",Tue:"3pm–12am",Wed:"3pm–12am",Thu:"3pm–12am",Fri:"3pm–12am",Sat:"3pm–12am",Sun:"3pm–12am",PH:"3pm–12am"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"QLife",status:"approved"},
  {id:48,name:"Suicide Call Back Service",industry:"Emergency & Support",cat:"Crisis Line",suburb:"Melbourne CBD",state:"VIC",desc:"Free professional counselling for people affected by suicide. Available 24/7 nationwide by phone and online.",icon:"🤍",tags:["Suicide prevention","Free","24/7"],phone:"1300 659 467",web:"https://www.suicidecallbackservice.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"SCBS",status:"approved"},
  {id:49,name:"National Alcohol & Drug Hotline",industry:"Emergency & Support",cat:"Drug & Alcohol Support",suburb:"Melbourne CBD",state:"VIC",desc:"Free confidential advice and referral for alcohol and drug concerns. Trained counsellors available 24 hours a day.",icon:"🍃",tags:["Alcohol","Drugs","Counselling"],web:"https://www.health.gov.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"DrugInfo",status:"approved"},
  {id:50,name:"Gambling Help Online",industry:"Emergency & Support",cat:"Gambling Help",suburb:"Melbourne CBD",state:"VIC",desc:"Free confidential support for problem gambling — individuals and families. 24/7 phone, chat and counselling.",icon:"🃏",tags:["Gambling","Free","24/7"],phone:"1800 858 858",web:"https://www.gamblinghelponline.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Gambling Help",status:"approved"},
  {id:52,name:"Nurse-on-Call Victoria",industry:"Emergency & Support",cat:"After-Hours Medical",suburb:"Melbourne CBD",state:"VIC",desc:"Registered nurses available 24/7 by phone to give health advice and refer Victorians to the most appropriate medical care.",icon:"🩺",tags:["Health advice","24/7","Victoria"],phone:"1300 60 60 24",web:"https://www.health.vic.gov.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Nurse-on-Call",status:"approved"},
  {id:53,name:"Poisons Information Centre",industry:"Emergency & Support",cat:"Poison Information",suburb:"Sydney CBD",state:"NSW",desc:"National Poisons Information — 24/7 advice for poisoning emergencies including chemicals, medications, plants and animals.",icon:"⚠️",tags:["Poisons","Emergency","24/7"],phone:"13 11 26",web:"https://www.poisons.com.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Poisons Info",status:"approved"},
  {id:54,name:"National Debt Helpline",industry:"Emergency & Support",cat:"Financial Hardship",suburb:"Melbourne CBD",state:"VIC",desc:"Free financial counselling for people in financial difficulty. Professional counsellors help with debt, budgeting and hardship.",icon:"💰",tags:["Financial counselling","Debt","Free"],phone:"1800 007 007",web:"https://ndh.org.au",hours:{Mon:"9:30am–4:30pm",Tue:"9:30am–4:30pm",Wed:"9:30am–4:30pm",Thu:"9:30am–4:30pm",Fri:"9:30am–4:30pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"NDH",status:"approved"},
  {id:55,name:"Safe Steps Victoria",industry:"Emergency & Support",cat:"Domestic Violence Support",suburb:"Melbourne CBD",state:"VIC",desc:"Victoria's 24/7 family violence response — safety planning, crisis accommodation and specialist support for women and children.",icon:"🧡",tags:["Family violence","Women","Victoria"],phone:"1800 015 188",web:"https://www.safesteps.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Safe Steps",status:"approved"},
  {id:56,name:"SANE Australia",industry:"Emergency & Support",cat:"Mental Health Helpline",suburb:"Melbourne CBD",state:"VIC",desc:"Mental health support for people living with complex mental illness — online forums, counselling and specialist support. Mon–Fri 10am–10pm.",icon:"💚",tags:["Complex mental illness","Forums","Support"],phone:"1800 187 263",web:"https://www.sane.org",hours:{Mon:"10am–10pm",Tue:"10am–10pm",Wed:"10am–10pm",Thu:"10am–10pm",Fri:"10am–10pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"SANE",status:"approved"},
  {id:57,name:"Grief Line Victoria",industry:"Emergency & Support",cat:"Grief & Bereavement",suburb:"Melbourne CBD",state:"VIC",desc:"Telephone grief counselling for Victorians experiencing loss. Trained volunteers. Available evenings and weekends.",icon:"🕊️",tags:["Grief","Bereavement","Victoria"],phone:"1300 845 745",web:"https://grief.org.au",hours:{Mon:"Closed",Tue:"Closed",Wed:"Closed",Thu:"Closed",Fri:"Closed",Sat:"6pm–10pm",Sun:"6pm–10pm",PH:"6pm–10pm"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Grief Australia",status:"approved"},
  {id:69,name:"Foodbank Victoria",industry:"NFP & Charities",cat:"Food Bank",suburb:"Yarraville",state:"VIC",desc:"Australia's largest food relief charity. Distributes food and grocery staples to frontline charities and schools across Victoria. Accepts food and financial donations. Volunteer opportunities available.",icon:"🥫",tags:["Food relief","Donations","Volunteers"],web:"https://www.foodbank.org.au/vic",hours:{Mon:"8am–5pm",Tue:"8am–5pm",Wed:"8am–5pm",Thu:"8am–5pm",Fri:"8am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Foodbank Victoria",status:"approved",featured:true},
  {id:70,name:"St Vincent de Paul Society VIC",industry:"NFP & Charities",cat:"Clothing Donations",suburb:"Melbourne CBD",state:"VIC",desc:"Vinnies provides emergency relief — food, clothing, furniture and financial assistance to people in need. Accepts donations at all Vinnies stores. Home visits available for urgent need.",icon:"👕",tags:["Clothing","Food relief","Furniture"],phone:"13 18 12",web:"https://www.vinnies.org.au",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"9am–1pm",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Vinnies VIC",status:"approved"},
  {id:71,name:"Salvation Army — Western Suburbs",industry:"NFP & Charities",cat:"Food Relief",suburb:"Footscray",state:"VIC",desc:"The Salvos provide food hampers, emergency relief, clothing and household goods, crisis accommodation referrals and financial counselling across Melbourne's western suburbs.",icon:"🏮",tags:["Food hampers","Emergency relief","Clothing"],phone:"1300 371 288",web:"https://www.salvationarmy.org.au",hours:{Mon:"9am–4pm",Tue:"9am–4pm",Wed:"9am–4pm",Thu:"9am–4pm",Fri:"9am–4pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Salvation Army",status:"approved"},
  {id:72,name:"Launch Housing",industry:"NFP & Charities",cat:"Shelter & Housing",suburb:"Melbourne CBD",state:"VIC",desc:"Melbourne's largest homelessness organisation. Crisis accommodation, transitional housing, family violence refuges and long-term housing support for people experiencing homelessness.",icon:"🏠",tags:["Homelessness","Crisis accommodation","Housing"],phone:"1800 825 955",web:"https://www.launchhousing.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Launch Housing",status:"approved"},
  {id:73,name:"Asylum Seeker Resource Centre",industry:"NFP & Charities",cat:"Refugee Support",suburb:"Footscray",state:"VIC",desc:"Comprehensive support for asylum seekers and refugees — food relief, casework, health, legal, employment and social programs. Accepts food, clothing and financial donations.",icon:"🌍",tags:["Asylum seekers","Refugees","Food & clothing"],web:"https://asrc.org.au",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"ASRC",status:"approved",featured:true},
  {id:74,name:"OzHarvest Melbourne",industry:"NFP & Charities",cat:"Food Bank",suburb:"Port Melbourne",state:"VIC",desc:"Rescues surplus food from restaurants, supermarkets and events and delivers it free to charities. Accepts food donations and volunteers to help with food rescue and deliveries.",icon:"🌻",tags:["Food rescue","Surplus food","Volunteers"],web:"https://www.ozharvest.org",hours:{Mon:"8am–5pm",Tue:"8am–5pm",Wed:"8am–5pm",Thu:"8am–5pm",Fri:"8am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"OzHarvest VIC",status:"approved"},
  {id:75,name:"Berry Street — Western Region",industry:"NFP & Charities",cat:"Children & Youth",suburb:"Werribee",state:"VIC",desc:"Victoria's largest family services organisation. Supports children and young people who have experienced trauma — foster care, family support, therapeutic services and education programs.",icon:"🌱",tags:["Children","Foster care","Family services"],web:"https://berrystreet.org.au",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Berry Street",status:"approved"},
  {id:76,name:"Good Shepherd Australia",industry:"NFP & Charities",cat:"Women's Support",suburb:"Northcote",state:"VIC",desc:"Microfinance, counselling, family violence support and financial resilience programs for women and families experiencing disadvantage. No Interest Loans (NILS) available nationally.",icon:"💜",tags:["Women","NILS loans","Family violence"],web:"https://goodshep.org.au",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Good Shepherd",status:"approved"},
  {id:77,name:"Scope Australia",industry:"NFP & Charities",cat:"Disability Advocacy",suburb:"Hawthorn",state:"VIC",desc:"Supports people with disability and complex communication needs — NDIS services, employment, therapy, accommodation and community participation across Victoria.",icon:"♿",tags:["Disability","NDIS","Employment"],phone:"1300 472 673",web:"https://www.scopeaust.org.au",hours:{Mon:"8:30am–5pm",Tue:"8:30am–5pm",Wed:"8:30am–5pm",Thu:"8:30am–5pm",Fri:"8:30am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Scope Australia",status:"approved"},
  {id:78,name:"GIVIT — Victoria",industry:"NFP & Charities",cat:"Clothing Donations",suburb:"Melbourne CBD",state:"VIC",desc:"Online platform connecting people who want to donate goods with charities and people in need. Clothing, furniture, electronics, food and more. Volunteer and corporate partnership opportunities.",icon:"🎁",tags:["Donations","Online matching","All goods"],web:"https://www.givit.org.au",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"GIVIT",status:"approved"},
  {id:79,name:"Wyndham Community & Education Centre",industry:"NFP & Charities",cat:"Community Garden",suburb:"Werribee",state:"VIC",desc:"Community garden, food pantry, education programs and social activities for people in Wyndham. Accepts food and plant donations. Volunteer gardeners welcome — all skill levels.",icon:"🌿",tags:["Community garden","Food pantry","Volunteers"],web:"https://www.wyndhamcec.org.au",hours:{Mon:"9am–4pm",Tue:"9am–4pm",Wed:"9am–4pm",Thu:"9am–4pm",Fri:"9am–4pm",Sat:"9am–12pm",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-02-01",contact:"WCEC",status:"approved"},
  {id:80,name:"Second Bite",industry:"NFP & Charities",cat:"Food Relief",suburb:"Melbourne CBD",state:"VIC",desc:"Rescues fresh surplus food from the food industry and redistributes it to community food programs across Melbourne. Partners with supermarkets, restaurants, growers and markets.",icon:"🥦",tags:["Fresh food rescue","Surplus","Community"],web:"https://secondbite.org",hours:{Mon:"8am–5pm",Tue:"8am–5pm",Wed:"8am–5pm",Thu:"8am–5pm",Fri:"8am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"SecondBite",status:"approved"},
  {id:81,name:"Reconciliation Victoria",industry:"NFP & Charities",cat:"Aboriginal & Torres Strait Islander",suburb:"Melbourne CBD",state:"VIC",desc:"Promotes reconciliation through education, advocacy and community programs. Connects businesses and community organisations with First Nations peoples and culture.",icon:"🪃",tags:["Reconciliation","First Nations","Education"],web:"https://www.reconciliationvic.org.au",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Reconciliation Vic",status:"approved"},
  {id:82,name:"Animals Australia",industry:"NFP & Charities",cat:"Animal Welfare",suburb:"Melbourne CBD",state:"VIC",desc:"Australia's leading animal protection organisation. Education, investigation and advocacy for animals in agriculture, wildlife and companion animals. Accepts donations.",icon:"🐮",tags:["Animal welfare","Advocacy","Donations"],web:"https://animalsaustralia.org",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"Animals Australia",status:"approved"},
  {id:83,name:"Tiny Teddies Toy Drive — Wyndham",industry:"NFP & Charities",cat:"Toy & Book Drive",suburb:"Werribee",state:"VIC",desc:"Annual toy and book drive for children in hospital and crisis accommodation across western Melbourne. Collection points at local libraries, schools and businesses. Runs year-round.",icon:"🧸",tags:["Toys","Books","Children in need"],hours:{Mon:"By arrangement",Tue:"By arrangement",Wed:"By arrangement",Thu:"By arrangement",Fri:"By arrangement",Sat:"By arrangement",Sun:"By arrangement",PH:"By arrangement"},lastUpdated:"2026-06-01",submittedAt:"2026-02-15",contact:"Volunteer coordinator",status:"approved"}
];

// ─── Opportunities DB ───────────────────────────────────────────
const OPPORTUNITIES = [
  {id:101,title:"Plumbing Apprentice — Certificate III",type:"Apprenticeship",org:"Point Cook Plumbing Co.",bizId:4,suburb:"Point Cook",state:"VIC",industry:"Home & Trade Services",arrangement:"Full-time",salary:"Award wage",duration:"4 years",icon:"🔧",desc:"Join our small team in Point Cook and work alongside experienced licensed plumbers on residential and commercial projects across the western suburbs.\n\nReal on-the-job learning from day one — no two days are the same.",responsibilities:["Assist licensed plumbers on hot water, drainage and fit-out work","Learn to read plans and comply with AS/NZS plumbing standards","Complete Certificate III in Plumbing via registered training organisation","Attend TAFE block release — fully funded by the business"],requirements:["Year 10 minimum (Year 12 preferred)","Australian citizen or permanent resident","Reliable transport to Point Cook","Punctual, enthusiastic and safety-conscious"],contact:"James O'Brien",closingDate:"2026-08-31",postedAt:"2026-06-01",lastUpdated:"2026-06-01",status:"approved",featured:true,addedBy:"public"},
  {id:102,title:"Electrical Apprentice — Certificate III",type:"Apprenticeship",org:"Werribee Electrical Solutions",bizId:1,suburb:"Werribee",state:"VIC",industry:"Home & Trade Services",arrangement:"Full-time",salary:"Award wage",duration:"4 years",icon:"⚡",desc:"Start your electrical career with an established western suburbs electrician. You'll work on residential and commercial projects — solar, switchboards, new homes and general wiring.",responsibilities:["Assist licensed electricians on domestic and commercial sites","Learn wiring, switchboard work and solar installations","Complete Cert III Electrotechnology through TAFE (fully supported)","Follow WorkSafe requirements on site"],requirements:["Year 10 minimum","Physically fit, able to work at heights","Driver's licence (or willing to get one)","Keen interest in the electrical trade"],contact:"Mark Nguyen",closingDate:"2026-08-01",postedAt:"2026-06-10",lastUpdated:"2026-06-10",status:"approved",addedBy:"public"},
  {id:103,title:"Front-of-House Team Member",type:"Job",org:"Point Cook Indian Kitchen",bizId:17,suburb:"Point Cook",state:"VIC",industry:"Hospitality & Food",arrangement:"Casual",salary:"$25–$28/hr + super",duration:"Ongoing",icon:"🍛",desc:"We're a busy restaurant looking for a friendly front-of-house team member. Experience preferred — happy to train the right person.",responsibilities:["Welcome and seat guests","Take orders and process payments via POS","Maintain a clean dining room","Assist with setup and pack-down"],requirements:["RSA certificate (or willing to obtain)","Friendly, professional manner","Available weekends"],contact:"Sunita Patel",closingDate:"2026-07-15",postedAt:"2026-06-05",lastUpdated:"2026-06-05",status:"approved",addedBy:"public"},
  {id:104,title:"Volunteer Firefighter — Point Cook CFA",type:"Volunteering",org:"Point Cook CFA Fire Brigade",bizId:23,suburb:"Point Cook",state:"VIC",industry:"Community & Culture",arrangement:"Volunteer",salary:"Unpaid — all training and equipment free",duration:"Ongoing",icon:"🚒",desc:"Join your local CFA and make a real difference. No experience required — full training provided free including First Aid, road rescue and structural firefighting.",responsibilities:["Respond to fires, road accidents and storm damage","Attend weekly training nights (Tuesdays)","Assist with community fire safety education","Maintain equipment to CFA standards"],requirements:["16 years or older","Australian resident","Physically fit","Available for callouts day or evening","Committed to training"],contact:"Captain Williams",closingDate:null,postedAt:"2026-05-01",lastUpdated:"2026-06-12",status:"approved",featured:true,addedBy:"public"},
  {id:105,title:"Finance Intern — Mortgage Broking",type:"Internship",org:"Tarneit Mortgage Brokers",bizId:29,suburb:"Tarneit",state:"VIC",industry:"Finance & Insurance",arrangement:"Part-time",salary:"Paid $18–$22/hr",duration:"12 weeks",icon:"🏠",desc:"Excellent opportunity for a finance or business student. Assist with client research, lender comparisons and compliance administration.",responsibilities:["Assist with home loan research and lender comparisons","Help prepare client files","Learn the end-to-end loan process","Shadow senior broker at client appointments"],requirements:["Enrolled in Finance, Commerce or related degree","Strong Excel and Word skills","High attention to detail","Current driver's licence"],contact:"David Chen",closingDate:"2026-07-01",postedAt:"2026-06-08",lastUpdated:"2026-06-08",status:"approved",addedBy:"public"},
  {id:106,title:"Bharatanatyam Dance Teacher",type:"Job",org:"Kaladhara Arts & Culture",bizId:22,suburb:"Point Cook",state:"VIC",industry:"Community & Culture",arrangement:"Part-time",salary:"$35–$45/hr",duration:"Ongoing weekends",icon:"🎭",desc:"Kaladhara seeks an experienced Bharatanatyam teacher for weekend classes. Saturdays and Sundays, with scope to grow as enrolments increase.",responsibilities:["Deliver classes for beginner to intermediate students","Prepare students for Arangetram and performances","Communicate progress with parents","Assist with Kaladhara cultural events"],requirements:["Proficiency in Bharatanatyam","Experience teaching children","Working with Children Check","English required, Tamil advantageous"],contact:"Priya Suresh",closingDate:"2026-07-31",postedAt:"2026-06-01",lastUpdated:"2026-06-01",status:"approved",addedBy:"public"},
  {id:107,title:"Automotive Apprentice — Certificate III",type:"Apprenticeship",org:"Hoppers Auto Care",bizId:36,suburb:"Hoppers Crossing",state:"VIC",industry:"Automotive",arrangement:"Full-time",salary:"Award wage",duration:"3.5 years",icon:"🚗",desc:"Start your mechanical career with a friendly Hoppers Crossing workshop. We specialise in Hyundai, Kia and Toyota and have a loyal local customer base.",responsibilities:["Logbook services under supervision","Learn diagnostic and repair procedures","Assist with brakes, tyres, exhausts and suspension","Maintain a clean, safe workshop"],requirements:["Year 10 minimum","Manual licence (or willing to get one)","Strong mechanical interest","Reliable and safety-conscious"],contact:"Tony Carbone",closingDate:"2026-08-15",postedAt:"2026-06-10",lastUpdated:"2026-06-10",status:"approved",addedBy:"public"},
  {id:108,title:"Barista / Café Assistant",type:"Job",org:"Fremantle Coffee Roasters",bizId:19,suburb:"Fremantle",state:"WA",industry:"Hospitality & Food",arrangement:"Part-time",salary:"$24–$27/hr + super",duration:"Ongoing",icon:"☕",desc:"Join our specialty café team in Fremantle. Must have commercial espresso machine experience.",responsibilities:["Prepare espresso-based beverages to a consistent standard","Clean and maintain equipment","Welcome customers warmly","Assist with food prep and stock rotation"],requirements:["1 year barista experience on commercial machine","Food handling certificate","Available early mornings and weekends"],contact:"Jake Morris",closingDate:"2026-07-10",postedAt:"2026-06-06",lastUpdated:"2026-06-06",status:"approved",addedBy:"public"},
  {id:109,title:"Work Experience — Finance",type:"Work Experience",org:"Tarneit Mortgage Brokers",bizId:29,suburb:"Tarneit",state:"VIC",industry:"Finance & Insurance",arrangement:"On-site",salary:"Unpaid school placement",duration:"1–2 weeks",icon:"📊",desc:"Year 10–12 students get a genuine look at mortgage broking — client meetings, lender research and compliance.",responsibilities:["Shadow senior broker during client calls","Learn comparison software","Assist with research and documentation","Attend team meetings"],requirements:["Year 10–12 student","School-arranged placement","Interest in finance"],contact:"David Chen",closingDate:null,postedAt:"2026-05-20",lastUpdated:"2026-05-20",status:"approved",addedBy:"public"},
  {id:110,title:"Surf Instructor — Casual",type:"Job",org:"Gold Coast Surf School",bizId:33,suburb:"Surfers Paradise",state:"QLD",industry:"Fitness & Sport",arrangement:"Casual",salary:"$28–$35/hr",duration:"Year-round",icon:"🏄",desc:"Energetic, safety-conscious surf instructors for group and private lessons. We fund your Surfing Australia cert if needed.",responsibilities:["Deliver surf lessons per Surfing Australia guidelines","Safety briefings and water condition assessments","Manage equipment","Encourage and support students"],requirements:["Surfing Australia Instructor Level 1 (or we fund it)","Bronze Medallion or equivalent","First Aid and CPR","Excellent people skills"],contact:"Damo Wilson",closingDate:"2026-07-31",postedAt:"2026-06-04",lastUpdated:"2026-06-04",status:"approved"}
];

// ─── Mentors DB ──────────────────────────────────────────────────
// whitelistPhone: true = phone shown publicly; false = contact via email only
// available: "Open to new mentees" | "Limited availability" | "Currently full"

const MENTORS = [
  {id:201,name:"Priya Suresh",avatar:"P",specialty:"Arts, Culture & Tamil Heritage",bio:"Classical dance director, community arts leader and founder of Kaladhara. Guides aspiring artists on building cultural organisations and community programs across Australia.",areas:["Community arts","Cultural leadership","Tamil heritage","Performing arts","Organisation building"],suburb:"Point Cook",state:"VIC",email:"",phone:"",whitelistPhone:false,wa:"",mode:["In-person","Video call"],experience:"15+ years",available:"Open to new mentees",tags:["Arts","Culture","Tamil","Leadership"],lastUpdated:"2026-06-10",submittedAt:"2026-05-01",status:"approved",featured:true},
  {id:202,name:"David Chen",avatar:"D",specialty:"Finance, Mortgage & Property Investment",bio:"Senior mortgage broker with 12 years experience. Mentors first-home buyers, investors and young finance professionals on property strategy, financial planning and building a broking career.",areas:["Mortgage broking","Property investment","First home buying","Financial planning","Finance career"],suburb:"Tarneit",state:"VIC",email:"",phone:"",whitelistPhone:false,wa:"",mode:["In-person","Video call","Phone"],experience:"12 years",available:"Limited availability",tags:["Finance","Property","Mortgage","Investment"],lastUpdated:"2026-06-08",submittedAt:"2026-05-15",status:"approved",featured:true},
  {id:203,name:"Anika Sharma",avatar:"A",specialty:"Education & Academic Excellence",bio:"Educator and selective school preparation specialist. Helps students and parents navigate VIC and NSW selective school processes, academic strategy and study habits.",areas:["Selective school prep","Study skills","Academic strategy","Parent guidance","VIC/NSW curriculum"],suburb:"Point Cook",state:"VIC",email:"",phone:"",whitelistPhone:false,mode:["In-person","Video call"],experience:"8 years",available:"Open to new mentees",tags:["Education","Selective schools","Academic","Students"],lastUpdated:"2026-06-05",submittedAt:"2026-04-20",status:"approved",featured:true},
  {id:204,name:"James O'Brien",avatar:"J",specialty:"Trades, Apprenticeships & Business",bio:"Licensed plumber and small business owner. Mentors young tradies starting apprenticeships, people transitioning into the trades, and small business owners in the construction sector.",areas:["Trade careers","Apprenticeships","Small business","Plumbing industry","Business ownership"],suburb:"Point Cook",state:"VIC",email:"",phone:"",whitelistPhone:false,wa:"",mode:["In-person","Phone"],experience:"20 years",available:"Open to new mentees",tags:["Trades","Small business","Apprenticeships","Plumbing"],lastUpdated:"2026-06-01",submittedAt:"2026-04-10",status:"approved"},
  {id:205,name:"Sarah Johnson",avatar:"S",specialty:"Banking, Finance & Career Development",bio:"MFAA-accredited mortgage broker and former bank branch manager. Guides professionals entering the finance sector, career changers and women building confidence in financial services.",areas:["Finance careers","Banking","Career transition","Women in finance","Professional development"],suburb:"Blacktown",state:"NSW",email:"",phone:"",whitelistPhone:false,mode:["Video call","Phone"],experience:"10 years",available:"Open to new mentees",tags:["Finance","Banking","Career","Women in finance"],lastUpdated:"2026-06-02",submittedAt:"2026-04-25",status:"approved"},
  {id:206,name:"Damo Wilson",avatar:"D",specialty:"Sports, Wellbeing & Youth Coaching",bio:"Professional surf coach and youth programme facilitator. Mentors young people on confidence-building through sport, healthy lifestyles and transitioning sport skills into life skills and careers.",areas:["Youth coaching","Sport psychology","Confidence","Healthy lifestyles","Ocean safety"],suburb:"Surfers Paradise",state:"QLD",email:"",phone:"",whitelistPhone:false,wa:"",mode:["In-person","Video call"],experience:"12 years",available:"Limited availability",tags:["Sport","Youth","Wellbeing","Coaching"],lastUpdated:"2026-06-04",submittedAt:"2026-05-01",status:"approved"},
  {id:207,name:"Ravi Kumar",avatar:"R",specialty:"Accounting, Tax & Small Business",bio:"CPA-qualified accountant mentoring small business owners, sole traders and migrants on Australian tax obligations, business registration and financial compliance.",areas:["Small business","Tax strategy","BAS","SMSF","Business setup in Australia"],suburb:"Truganina",state:"VIC",email:"",phone:"",whitelistPhone:false,mode:["In-person","Video call"],experience:"15 years",available:"Open to new mentees",tags:["Accounting","Tax","Small business","SMSF"],lastUpdated:"2026-05-28",submittedAt:"2026-04-15",status:"approved"},
  {id:208,name:"Chloe Barnes",avatar:"C",specialty:"Wellness, Yoga & Mindful Living",bio:"Qualified yoga and pilates instructor with a background in psychology. Mentors people building wellness careers, managing burnout, and finding balance between work and self-care.",areas:["Wellness careers","Mindfulness","Burnout recovery","Yoga teaching","Work-life balance"],suburb:"Altona Meadows",state:"VIC",email:"",phone:"",whitelistPhone:false,mode:["In-person","Video call"],experience:"9 years",available:"Limited availability",tags:["Wellness","Yoga","Mindfulness","Career"],lastUpdated:"2026-06-02",submittedAt:"2026-05-10",status:"approved"},
  {id:210,name:"Karthick Thanigaimani",avatar:"K",specialty:"Music, Arts, Technology & Community Leadership",bio:"Karthick is a multi-talented community figure based in Point Cook with a rare combination of skills spanning Indian classical and contemporary music, visual arts, technology, children's education, community service and driving instruction. A deeply community-oriented individual, Karthick has been involved in organising cultural programs, supporting youth development initiatives and mentoring aspiring musicians and artists across Melbourne's western suburbs. With a background in IT and a passion for making technology accessible, he helps families and young people navigate digital tools, online learning and creative tech projects. As a certified driving instructor, he also guides learner drivers — particularly international licence holders and nervous drivers — through the Australian road system with patience and clarity.",areas:["Indian classical music","Carnatic music","Visual arts","Children's education & tutoring","Community service & event organising","Technology & digital literacy","Driving instruction & learner support","International licence conversion","Tamil language & culture"],suburb:"Point Cook",state:"VIC",email:"",phone:"",whitelistPhone:false,wa:"",mode:["In-person","Video call","Phone"],experience:"15+ years",available:"Open to new mentees",tags:["Music","Arts","Technology","Community","Driving","Education","Tamil"],lastUpdated:"2026-06-13",submittedAt:"2026-06-13",status:"approved",featured:true},
  // Pending
  {id:209,name:"Mark Nguyen",avatar:"M",specialty:"Electrical Trades & Solar Energy",bio:"Licensed master electrician and VEU-accredited solar installer. Guides apprentices and career changers into the electrical and renewable energy sector.",areas:["Electrical trade","Solar industry","VEU accreditation","Career change","Apprenticeships"],suburb:"Werribee",state:"VIC",email:"",phone:"",whitelistPhone:false,wa:"",mode:["In-person","Phone"],experience:"18 years",available:"Open to new mentees",tags:["Electrical","Solar","Trades","Renewable energy"],lastUpdated:"2026-06-12",submittedAt:"2026-06-12",status:"pending"}
];

// ─── Additional listings — new categories ──────────────────────

// LEGAL & MIGRATION
DB.push();

// MIGRANT & MULTICULTURAL
DB.push(
  {id:87,name:"Wyndham Settlement Services",industry:"Migrant & Multicultural",cat:"Settlement Services",suburb:"Hoppers Crossing",state:"VIC",desc:"Free settlement support for new arrivals and humanitarian entrants — navigating Centrelink, Medicare, schools, housing, transport and community connection.",icon:"🤝",tags:["Settlement","New arrivals","Free"],hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–4pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-01",submittedAt:"2026-01-20",contact:"Coordinator",status:"approved",featured:true,addedBy:"admin"},
  {id:88,name:"AMES Australia — Werribee",industry:"Migrant & Multicultural",cat:"English Language Classes",suburb:"Werribee",state:"VIC",desc:"English language classes for adult migrants and refugees. AMEP and IELTS preparation courses, digital literacy and employment readiness programs.",icon:"📖",tags:["English classes","AMEP","IELTS"],phone:"1300 263 777",web:"https://www.ames.net.au",hours:{Mon:"8:30am–5pm",Tue:"8:30am–5pm",Wed:"8:30am–5pm",Thu:"8:30am–5pm",Fri:"8:30am–4pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-01",submittedAt:"2026-01-01",contact:"AMES Australia",status:"approved",addedBy:"admin"},
  {id:89,name:"Wyndham Multicultural Hub",industry:"Migrant & Multicultural",cat:"Multicultural Community Group",suburb:"Tarneit",state:"VIC",desc:"Celebrating over 30 cultural communities in Wyndham. Cultural events, language groups, youth activities and community leadership programs.",icon:"🌏",tags:["Multicultural","Events","Languages"],hours:{Mon:"10am–4pm",Tue:"10am–4pm",Wed:"10am–4pm",Thu:"10am–4pm",Fri:"10am–4pm",Sat:"By arrangement",Sun:"By arrangement",PH:"Closed"},lastUpdated:"2026-05-20",submittedAt:"2026-03-01",contact:"Coordinator",status:"approved",addedBy:"admin"}
);

// CAREER & STUDENT SUPPORT
DB.push();

// COMMUNITY & CULTURE — choir, arts, sports clubs
DB.push();

// Emergency / NFP extras
DB.push(
  {id:98,name:"Western Homelessness Network",industry:"NFP & Charities",cat:"Emergency Shelter",suburb:"Sunshine West",state:"VIC",desc:"Emergency accommodation, crisis support and homelessness prevention for people in Melbourne's western suburbs. 24-hour phone line for referrals.",icon:"🏚️",tags:["Emergency shelter","Homelessness","24/7 referral"],web:"https://whn.org.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"WHN",status:"approved",addedBy:"admin"},
  {id:99,name:"DV Connect — Domestic Violence Emergency",industry:"NFP & Charities",cat:"Domestic Violence Support",suburb:"Melbourne CBD",state:"VIC",desc:"24/7 crisis support, safety planning and emergency refuge referral for people experiencing domestic and family violence. Specialised support for men and LGBTQIA+ individuals also available.",icon:"🧡",tags:["DV emergency","Safety planning","24/7"],phone:"1800 811 811",web:"https://www.dvconnect.org",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-12",submittedAt:"2026-01-01",contact:"DV Connect",status:"approved",addedBy:"admin"}
);

// ─── Additional opportunities — career, student, community ─────
OPPORTUNITIES.push(
  // Career & student
  {id:111,title:"Year 10 Work Experience — Legal",type:"Work Experience",org:"Wyndham Community Legal Centre",bizId:84,suburb:"Werribee",state:"VIC",industry:"Legal & Migration",arrangement:"On-site",salary:"Unpaid school placement",duration:"1–2 weeks",icon:"⚖️",desc:"Get a real insight into community legal work. Sit in on free advice clinics, watch lawyers at VCAT hearings and help with client intake. Excellent for students considering law, social work or human rights.",responsibilities:["Assist with client intake and reception","Observe free legal advice clinics","Help with research and file organisation","Attend team meetings"],requirements:["Year 10–12 student","School-arranged placement","Professional dress code","Interest in law or community work"],contact:"Principal Lawyer",closingDate:null,postedAt:"2026-06-01",lastUpdated:"2026-06-01",status:"approved",addedBy:"admin"},

  {id:112,title:"Career Explorer — Hospitality & Barista",type:"Work Experience",org:"Fremantle Coffee Roasters",bizId:19,suburb:"Fremantle",state:"WA",industry:"Hospitality & Food",arrangement:"On-site",salary:"Unpaid school placement",duration:"1 week",icon:"☕",desc:"Ideal for students exploring a career in hospitality. Learn about specialty coffee, kitchen operations, customer service and café management. Hands-on experience from day one.",responsibilities:["Observe barista workflow and espresso technique","Assist with café setup and service","Learn about food safety and hygiene standards","Shadow manager during busy service periods"],requirements:["Year 10–12 student","School-arranged placement","Interest in food and hospitality"],contact:"Jake Morris",closingDate:null,postedAt:"2026-06-06",lastUpdated:"2026-06-06",status:"approved",addedBy:"admin"},

  {id:113,title:"Traineeship — Community Services Cert III",type:"Traineeship",org:"Wyndham Settlement Services",bizId:87,suburb:"Hoppers Crossing",state:"VIC",industry:"Migrant & Multicultural",arrangement:"Full-time",salary:"Award wage",duration:"12 months",icon:"🤝",desc:"Complete your Certificate III in Community Services while working alongside experienced settlement officers. Help new arrivals navigate Australian life — from Centrelink to school enrolments. Excellent entry into social work or community development careers.",responsibilities:["Assist clients with settlement tasks and referrals","Support caseworkers in client interviews","Help run community information sessions","Maintain client records accurately"],requirements:["Year 12 or equivalent","Interest in community and social services","Excellent communication skills","Driver's licence preferred"],contact:"Coordinator",closingDate:"2026-09-30",postedAt:"2026-06-12",lastUpdated:"2026-06-12",status:"approved",addedBy:"admin"},

  {id:114,title:"Junior Graphic Designer — Internship",type:"Internship",org:"Perth IT Support Co.",bizId:41,suburb:"Perth CBD",state:"WA",industry:"Technology & IT",arrangement:"Part-time",salary:"Paid $20–$25/hr",duration:"8 weeks",icon:"💻",desc:"Creative internship for design or IT students. Work on real client projects — website redesigns, social media graphics, UI mockups and digital marketing assets.",responsibilities:["Create graphics for web and social media","Assist with website updates and UX improvements","Participate in client briefings","Build a portfolio of real-world work"],requirements:["Studying design, IT or communications","Proficiency in Canva, Figma or Adobe Suite","Strong eye for layout and colour","Available 20hrs/week"],contact:"Chris Lee",closingDate:"2026-08-01",postedAt:"2026-06-12",lastUpdated:"2026-06-12",status:"approved",addedBy:"admin"},

  {id:115,title:"Choir Volunteer — Pianist / Accompanist",type:"Volunteering",org:"Wyndham Community Choir",bizId:93,suburb:"Werribee",state:"VIC",industry:"Community & Culture",arrangement:"Volunteer",salary:"Unpaid — rewarding community role",duration:"Ongoing",icon:"🎵",desc:"We're looking for a pianist to accompany our community choir at Tuesday evening rehearsals. Repertoire spans pop, gospel and classical. Great opportunity to keep your skills sharp while giving back.",responsibilities:["Accompany choir at weekly Tuesday rehearsals","Learn a rotating repertoire","Support conductor during warm-ups and run-throughs","Attend two annual performances"],requirements:["Grade 6+ piano (AMEB or equivalent)","Ability to read music and chord charts","Reliable and punctual","All ages welcome"],contact:"Conductor",closingDate:null,postedAt:"2026-06-01",lastUpdated:"2026-06-01",status:"approved",addedBy:"admin"},

  {id:116,title:"Football Coach — Junior Girls",type:"Volunteering",org:"Wyndham FC",bizId:95,suburb:"Tarneit",state:"VIC",industry:"Community & Culture",arrangement:"Volunteer",salary:"Unpaid — club registration waived",duration:"Season (March–September)",icon:"⚽",desc:"Volunteer coach needed for our Under 12 and Under 14 girls football teams. Full coaching accreditation supported — Football Victoria will fund your Level 1 coaching licence if you don't already have one.",responsibilities:["Run weekly training sessions (Tuesday evenings)","Coach and motivate players on match days (Saturday)","Communicate with parents regarding players' progress","Maintain a safe and inclusive training environment"],requirements:["Passion for football and youth development","Working with Children Check","Football Victoria Level 1 coaching (or we fund it)","Reliable and enthusiastic"],contact:"Club secretary",closingDate:"2026-02-28",postedAt:"2026-06-12",lastUpdated:"2026-06-12",status:"approved",addedBy:"admin"},

  {id:117,title:"Dog Walker — Casual",type:"Job",org:"Walkies Dog Walking Services",bizId:62,suburb:"Tarneit",state:"VIC",industry:"Pet Services",arrangement:"Casual",salary:"$22–$26/hr",duration:"Ongoing",icon:"🦮",desc:"Join our team as a casual dog walker in Tarneit and surrounds. GPS-tracked walks, small groups, and post-walk photo report. Car essential. We provide full training.",responsibilities:["Walk small groups of dogs (2–4 dogs max)","Send post-walk GPS report and photo to owners","Handle dogs safely and calmly","Report any concerns to senior walkers"],requirements:["Own a reliable car","Love of dogs — all breeds","Police check and insurance (we assist with this)","Available mornings Monday–Friday"],contact:"Jake Turner",closingDate:"2026-07-31",postedAt:"2026-06-12",lastUpdated:"2026-06-12",status:"approved",addedBy:"admin"},

  // Deliberately expired opportunity for testing
  {id:118,title:"Summer Reading Volunteer — Library",type:"Volunteering",org:"Wyndham City Libraries",bizId:null,suburb:"Werribee",state:"VIC",industry:"Community & Culture",arrangement:"Volunteer",salary:"Unpaid",duration:"6 weeks (school holidays)",icon:"📚",desc:"Help children discover the joy of reading during Wyndham's Summer Reading Program. Read stories, run craft activities and assist the library team during school holiday sessions.",responsibilities:["Read aloud to groups of children","Assist with craft and activity sessions","Help with program setup and pack-down"],requirements:["Working with Children Check","Friendly and enthusiastic","Available weekday mornings over summer holidays"],contact:"Library Programs Team",closingDate:"2026-01-31",postedAt:"2025-11-15",lastUpdated:"2025-11-15",status:"approved",addedBy:"admin"}
);

// ─── Expiry runtime check ───────────────────────────────────────
// Run on page load — auto-moves expired opportunities to status:"expired"
// They remain in the array for historical reference in admin.
(function applyExpiryCheck() {
  const today = new Date();
  today.setHours(0,0,0,0);
  OPPORTUNITIES.forEach(o => {
    if (o.status === 'approved' && o.closingDate) {
      const expiry = new Date(o.closingDate + 'T00:00:00');
      if (expiry < today) {
        o.status = 'expired';
        o.expiredAt = o.closingDate;
      }
    }
  });
})();

// DRIVING SCHOOLS
DB.push();

// POINT COOK COMMUNITY ORGANISATIONS
DB.push(
  {
    id: 119,
    name: "Point Cook Action Group (PCAG)",
    industry: "Community & Culture",
    cat: "Volunteer Group",
    suburb: "Point Cook",
    state: "VIC",
    desc: "PCAG is the voice of Point Cook residents — a grassroots advocacy group championing quality facilities and infrastructure for the fastest-growing suburb in Victoria. Key wins include the Sneydes Road interchange, Palmers Road Sound Wall, Point Cook Pop Up Park and the WYNBUS on-demand public transport trial. Current president: Karthick Thanigaimani. Open to all Point Cook residents — individual, student and corporate memberships available via the website.",
    icon: "📣",
    tags: ["Advocacy", "Resident group", "Transport & roads"],
    web: "https://www.pointcookactiongroup.org.au",
    hours: {
      Mon: "By arrangement",
      Tue: "By arrangement",
      Wed: "By arrangement",
      Thu: "By arrangement",
      Fri: "By arrangement",
      Sat: "By arrangement",
      Sun: "By arrangement",
      PH: "By arrangement"
    },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "Karthick Thanigaimani (President)",
    status: "approved",
    featured: true,
    addedBy: "admin"
  },
  {
    id: 120,
    name: "Point Cook Library of Things (PCLoT)",
    industry: "Community & Culture",
    cat: "Volunteer Group",
    suburb: "Point Cook",
    state: "VIC",
    desc: "Borrow useful household items instead of buying them — a not-for-profit community initiative promoting sustainability and reducing waste. Items include gardening tools, wheelchairs, walkers, heaters, party supplies, kitchen appliances, accessibility equipment and more. Based at the Jamieson Way Community Centre, 59 Jamieson Way Point Cook. Founded by Benish Chaudhry as a project of PCAG. Membership: $50/year · $30/six months · $20 one-off borrow. Point Cook residents only.",
    icon: "🔧",
    tags: ["Borrow tools", "Sustainability", "Community sharing"],
    web: "https://pointcooklibraryofthings.org.au",
    hours: {
      Mon: "Closed",
      Tue: "Closed",
      Wed: "By appointment",
      Thu: "By appointment",
      Fri: "Closed",
      Sat: "10am–12pm",
      Sun: "Closed",
      PH: "Closed"
    },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "Benish Chaudhry (Founder)",
    status: "approved",
    featured: true,
    addedBy: "admin",
    address: "Jamieson Way Community Centre, 59 Jamieson Way, Point Cook VIC 3030"
  }
);

// ─── Additional verified Point Cook / Wyndham community organisations ──────
DB.push(
  {
    id: 121,
    name: "Helping Hampers Point Cook Inc.",
    industry: "NFP & Charities",
    cat: "Food Relief",
    suburb: "Point Cook",
    state: "VIC",
    desc: "Helping Hampers Point Cook is a registered not-for-profit dedicated to putting food on the table for Point Cook families who are struggling. They provide food hampers and also help connect families with relevant local support groups and services for ongoing wellbeing. Accepts food and financial donations from individuals and local businesses. Volunteer opportunities available.",
    icon: "🧺",
    tags: ["Food hampers", "Donations accepted", "Volunteers welcome"],
    web: "https://www.facebook.com/Helping-Hampers-Point-Cook-277644156099907",
    hours: {
      Mon: "By arrangement",
      Tue: "By arrangement",
      Wed: "By arrangement",
      Thu: "By arrangement",
      Fri: "By arrangement",
      Sat: "By arrangement",
      Sun: "By arrangement",
      PH: "By arrangement"
    },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "Helping Hampers PC",
    status: "approved",
    featured: true,
    addedBy: "admin"
  },
  {
    id: 122,
    name: "Christmas at the Lakes",
    industry: "Community & Culture",
    cat: "Cultural Organisation",
    suburb: "Point Cook",
    state: "VIC",
    desc: "One of Point Cook's most beloved community events — an annual Christmas celebration at Breezewater Reserve, Sanctuary Lakes running for over 18 years. Features live carols, local performers, children's rides and amusements, market and food stalls, a visit from Santa and a fireworks finale. Surplus profits are donated each year to community organisations including Point Cook CFA, Lions Club, Rotary and Whitelion. 2026 event: Friday 12 December, 4pm–10.30pm. Volunteers welcome.",
    icon: "🎄",
    tags: ["Christmas", "Annual event", "Fireworks"],
    web: "https://www.christmasatthelakes.org.au",
    hours: {
      Mon: "Annual event only",
      Tue: "Annual event only",
      Wed: "Annual event only",
      Thu: "Annual event only",
      Fri: "Annual event only",
      Sat: "Annual event only",
      Sun: "Annual event only",
      PH: "Annual event only"
    },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "Bruce Cahoon (Chair)",
    address: "Breezewater Reserve, 25 The Breezewater, Sanctuary Lakes, Point Cook VIC 3030",
    status: "approved",
    featured: true,
    addedBy: "admin"
  }
);


// ─── SES and other emergency organisations ────────────────────
DB.push(
  {
    id: 123,
    name: "VICSES Point Cook Unit",
    industry: "Emergency & Support",
    cat: "Crisis Line",
    suburb: "Point Cook",
    state: "VIC",
    desc: "Victoria's newest SES unit — opened December 2024. One of the state's most culturally and linguistically diverse volunteer units, with many members who moved to Australia in the last decade. Responds to floods, storms, road crash rescues, storm damage, tree falls and assists Police and Ambulance. State-of-the-art facility with 6 drive-through bays, training room and modern equipment. Actively recruiting volunteers — no prior experience required, all training provided free of charge.",
    icon: "🟠",
    tags: ["SES", "Flood & storm", "Volunteers welcome"],
    phone: "132 500",
    web: "https://www.ses.vic.gov.au/join-us",
    hours: { Mon:"24/7", Tue:"24/7", Wed:"24/7", Thu:"24/7", Fri:"24/7", Sat:"24/7", Sun:"24/7", PH:"24/7" },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "Laurie Russell (Unit Controller)",
    status: "approved",
    featured: true,
    addedBy: "admin"
  },
  {
    id: 124,
    name: "VICSES Western Region — Wyndham",
    industry: "Emergency & Support",
    cat: "Crisis Line",
    suburb: "Sunshine West",
    state: "VIC",
    desc: "VICSES is Victoria's lead agency for flood, storm, tsunami, earthquake and landslide emergencies. Also operates the largest road crash rescue network in Australia. To request emergency assistance call 132 500 (24/7). For life-threatening emergencies always call 000 first. Volunteer with your local SES unit — visit ses.vic.gov.au to join.",
    icon: "🟠",
    tags: ["Flood & storm", "Road rescue", "24/7"],
    phone: "132 500",
    web: "https://www.ses.vic.gov.au",
    hours: { Mon:"24/7", Tue:"24/7", Wed:"24/7", Thu:"24/7", Fri:"24/7", Sat:"24/7", Sun:"24/7", PH:"24/7" },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "VICSES Western Region",
    status: "approved",
    addedBy: "admin"
  },
  {
    id: 125,
    name: "Ambulance Victoria — Western Region",
    industry: "Emergency & Support",
    cat: "After-Hours Medical",
    suburb: "Sunshine West",
    state: "VIC",
    desc: "Ambulance Victoria provides emergency medical response, non-emergency patient transport and first responder services across Victoria. For a medical emergency call 000. For non-emergency bookings call 1300 366 966. Paramedics also support community education programs including CPR training.",
    icon: "🚑",
    tags: ["Ambulance", "Medical emergency", "CPR"],
    phone: "000",
    web: "https://www.ambulance.vic.gov.au",
    hours: { Mon:"24/7", Tue:"24/7", Wed:"24/7", Thu:"24/7", Fri:"24/7", Sat:"24/7", Sun:"24/7", PH:"24/7" },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "Ambulance Victoria",
    status: "approved",
    addedBy: "admin"
  },
  {
    id: 126,
    name: "Point Cook Lions Club",
    industry: "Community & Culture",
    cat: "Volunteer Group",
    suburb: "Point Cook",
    state: "VIC",
    desc: "Part of Lions International — 1.4 million members worldwide. Point Cook Lions runs sausage sizzles, fundraising events, Christmas at the Lakes support, free vision screening in schools, mobile skin cancer screening and Type 1 diabetes youth camps. Meets third Monday of every month at Featherbrook Community Centre, 6.30pm for a 7pm start. New members always welcome.",
    icon: "🦁",
    tags: ["Lions", "Fundraising", "Volunteer"],
    web: "https://lionsclubs.org.au",
    hours: { Mon:"3rd Monday 7pm", Tue:"Closed", Wed:"Closed", Thu:"Closed", Fri:"Closed", Sat:"Events", Sun:"Events", PH:"Closed" },
    lastUpdated: "2026-06-13",
    submittedAt: "2026-06-13",
    contact: "President",
    status: "approved",
    addedBy: "admin"
  }
);

// SES volunteer opportunity
OPPORTUNITIES.push({
  id: 119,
  title: "Volunteer Emergency Responder — VICSES Point Cook",
  type: "Volunteering",
  org: "VICSES Point Cook Unit",
  bizId: 123,
  suburb: "Point Cook",
  state: "VIC",
  industry: "Emergency & Support",
  arrangement: "Volunteer",
  salary: "Unpaid — all training, equipment and uniform provided free",
  duration: "Ongoing",
  icon: "🟠",
  desc: "Join Point Cook's newest SES unit and make a real difference in your community. No experience required — VICSES provides all training free of charge, including flood rescue, road crash rescue, storm damage response and navigation. Point Cook Unit is one of the state's most diverse units and welcomed its first volunteers just 12 months before receiving their brand new facility in December 2024.",
  responsibilities: [
    "Respond to flood, storm, road crash and tree fall incidents",
    "Attend weekly training nights",
    "Assist Victoria Police, Ambulance and CFA when requested",
    "Participate in community safety education programs"
  ],
  requirements: [
    "18 years or older",
    "Australian resident",
    "Physically fit",
    "Available for callouts during day and/or evening",
    "Commitment to regular training"
  ],
  contact: "Laurie Russell (Unit Controller)",
  
  phone: "132 500",
  closingDate: null,
  postedAt: "2026-06-13",
  lastUpdated: "2026-06-13",
  status: "approved",
  featured: true,
  addedBy: "admin"
});

// ═══════════════════════════════════════════════════════════════
// EXPANDED LISTINGS — conveyancers, garden/landscaping, trades,
// niche suppliers, and state coverage: SA, TAS, ACT, QLD, NSW
// ═══════════════════════════════════════════════════════════════

DB.push();

// ═══════════════════════════════════════════════════════════════
// VERIFIED REAL LOCAL ORGANISATIONS — added Jun 2026
// All contact details sourced from official websites and public listings
// ═══════════════════════════════════════════════════════════════

DB.push(

  // Wyndham Library Service — verified via wyndham.vic.gov.au/libraries (main library)
  {id:402,name:"Wyndham Library Service",industry:"Community & Culture",cat:"Library",suburb:"Werribee",state:"VIC",desc:"Free public libraries across Wyndham. Book lending, e-books, audiobooks, kids' storytime, school holiday programs, study spaces and free Wi-Fi. Branches at Werribee, Point Cook, Manor Lakes, Tarneit and Hoppers Crossing.",icon:"📚",tags:["Library","Free","Family programs"],phone:"1300 023 411",web:"https://www.wyndham.vic.gov.au/services/libraries",hours:{Mon:"Branch hours vary",Tue:"Branch hours vary",Wed:"Branch hours vary",Thu:"Branch hours vary",Fri:"Branch hours vary",Sat:"Most branches open",Sun:"Most branches open",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"Library Services",status:"approved",addedBy:"admin"},

  // RSPCA Victoria — verified via rspcavic.org (Werribee/main number)
  {id:403,name:"RSPCA Victoria",industry:"NFP & Charities",cat:"Animal Welfare",suburb:"Burwood East",state:"VIC",desc:"Victoria's largest animal welfare organisation. Animal adoption, cruelty investigations, lost & found, veterinary services and education. Adopt a pet from Werribee, Burwood East or Peninsula shelter. Report cruelty 24/7.",icon:"🐾",tags:["Animal welfare","Adoption","Cruelty hotline"],phone:"03 9224 2222",web:"https://www.rspcavic.org",address:"3 Burwood Hwy, Burwood East VIC 3151",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"10am–4pm",Sun:"10am–4pm",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"RSPCA Victoria",status:"approved",addedBy:"admin"},

  // headspace Werribee — verified national service
  {id:404,name:"headspace Werribee",industry:"Emergency & Support",cat:"Youth Support",suburb:"Werribee",state:"VIC",desc:"Free youth mental health service for ages 12–25. Confidential support for mental health, physical health, work/study help, and alcohol/drug issues. Bulk-billed or no cost. Walk-ins welcome — no referral needed.",icon:"💚",tags:["Youth mental health","Free","12–25 years"],phone:"03 9731 6500",web:"https://headspace.org.au/headspace-centres/werribee",address:"57-59 Watton Street, Werribee VIC 3030",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–7pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"headspace team",status:"approved",addedBy:"admin"},

  // headspace national line  
  {id:405,name:"headspace National (eheadspace)",industry:"Emergency & Support",cat:"Youth Support",suburb:"National",state:"VIC",desc:"Online and phone counselling for young people aged 12–25 anywhere in Australia. Free and confidential. Web chat available 7 days a week, 9am–1am AEST. Operated by headspace, Australia's national youth mental health foundation.",icon:"💚",tags:["Youth","Online support","Free"],phone:"1800 650 890",web:"https://headspace.org.au/eheadspace/",hours:{Mon:"9am–1am",Tue:"9am–1am",Wed:"9am–1am",Thu:"9am–1am",Fri:"9am–1am",Sat:"9am–1am",Sun:"9am–1am",PH:"9am–1am"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"eheadspace",status:"approved",addedBy:"admin"},

  // Centrelink general — Services Australia
  {id:406,name:"Centrelink (Services Australia)",industry:"Emergency & Support",cat:"Financial Hardship",suburb:"National",state:"VIC",desc:"Australian Government social security and welfare payments — JobSeeker, Youth Allowance, Age Pension, Family Tax Benefit, Carer Payment, Disability Support Pension. Service centres in Werribee, Hoppers Crossing and most major suburbs.",icon:"🏛️",tags:["Centrelink","Government","Payments"],phone:"132 850",web:"https://www.servicesaustralia.gov.au",hours:{Mon:"7am–10pm",Tue:"7am–10pm",Wed:"7am–10pm",Thu:"7am–10pm",Fri:"7am–10pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"Services Australia",status:"approved",addedBy:"admin"},

  // Medicare general line
  {id:407,name:"Medicare (Services Australia)",industry:"Health & Medical",cat:"Specialist",suburb:"National",state:"VIC",desc:"Australian Government health insurance scheme. Medicare card enquiries, claiming refunds, registering newborns, MyGov linking. Service centres co-located with Centrelink across Wyndham and Greater Melbourne.",icon:"💊",tags:["Medicare","Government","Health card"],phone:"132 011",web:"https://www.servicesaustralia.gov.au/medicare",hours:{Mon:"7am–10pm",Tue:"7am–10pm",Wed:"7am–10pm",Thu:"7am–10pm",Fri:"7am–10pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"Services Australia",status:"approved",addedBy:"admin"},

  // PTV Victoria — Public Transport
  {id:408,name:"Public Transport Victoria",industry:"Community & Culture",cat:"Community Centre",suburb:"Melbourne",state:"VIC",desc:"Victorian public transport information service. Train, tram and bus timetables, myki card support, fare information, journey planning, accessibility info and disruption updates. Werribee and Wyndham Vale lines info available.",icon:"🚆",tags:["Trains","myki","Buses"],phone:"1800 800 007",web:"https://www.ptv.vic.gov.au",hours:{Mon:"6am–midnight",Tue:"6am–midnight",Wed:"6am–midnight",Thu:"6am–midnight",Fri:"6am–midnight",Sat:"6am–midnight",Sun:"6am–midnight",PH:"6am–midnight"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"PTV",status:"approved",addedBy:"admin"},

  // VicRoads
  {id:409,name:"VicRoads",industry:"Community & Culture",cat:"Community Centre",suburb:"Melbourne",state:"VIC",desc:"Victorian licensing and vehicle registration. Driver licence tests, vehicle registration, learner permits, custom plates, change of address. Werribee Customer Service Centre at 80 Princes Highway. Most services now online via myVicRoads.",icon:"🚗",tags:["Driver licence","Vehicle rego","Government"],phone:"13 11 71",web:"https://www.vicroads.vic.gov.au",hours:{Mon:"8am–5pm",Tue:"8am–5pm",Wed:"8am–5pm",Thu:"8am–5pm",Fri:"8am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"VicRoads",status:"approved",addedBy:"admin"},

  // ATO general
  {id:410,name:"Australian Taxation Office (ATO)",industry:"Finance & Insurance",cat:"Tax Agent",suburb:"National",state:"VIC",desc:"Australian Government tax administration. Tax returns, TFN applications, BAS, GST registration, superannuation, business registrations (ABN). Income tax help line for individuals and small businesses.",icon:"💼",tags:["Tax","TFN","ABN"],phone:"13 28 61",web:"https://www.ato.gov.au",hours:{Mon:"8am–6pm",Tue:"8am–6pm",Wed:"8am–6pm",Thu:"8am–6pm",Fri:"8am–6pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"ATO",status:"approved",addedBy:"admin"},

  // Consumer Affairs Victoria
  {id:411,name:"Consumer Affairs Victoria",industry:"Legal & Migration",cat:"Community Legal Centre",suburb:"Melbourne",state:"VIC",desc:"State government consumer protection. Help with rental disputes (tenants and landlords), retail purchase issues, building contracts, dodgy traders and motor car traders. Free dispute resolution service.",icon:"⚖️",tags:["Consumer rights","Tenancy","Disputes"],phone:"1300 558 181",web:"https://www.consumer.vic.gov.au",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"CAV",status:"approved",addedBy:"admin"},

  // Victoria Legal Aid
  {id:412,name:"Victoria Legal Aid",industry:"Legal & Migration",cat:"Community Legal Centre",suburb:"Melbourne",state:"VIC",desc:"Free legal help for Victorians on low incomes. Family law, criminal law, immigration, infringement notices, child protection, mental health. Werribee office available. Free Legal Help phone line covers all of Victoria.",icon:"⚖️",tags:["Legal aid","Free","Family law"],phone:"1300 792 387",web:"https://www.legalaid.vic.gov.au",hours:{Mon:"8am–6pm",Tue:"8am–6pm",Wed:"8am–6pm",Thu:"8am–6pm",Fri:"8am–6pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"VLA",status:"approved",addedBy:"admin"},

  // Translating and Interpreting Service
  {id:413,name:"Translating and Interpreting Service (TIS National)",industry:"Migrant & Multicultural",cat:"NAATI Translation",suburb:"National",state:"VIC",desc:"Free 24/7 interpreting service for people who don't speak English well. Offered by the Department of Home Affairs to permanent residents, people on a humanitarian visa, and select services. 100+ languages including Tamil, Vietnamese, Mandarin, Hindi, Arabic.",icon:"🌐",tags:["Interpreting","Free","24/7"],phone:"131 450",web:"https://www.tisnational.gov.au",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-14",submittedAt:"2026-06-14",contact:"TIS National",status:"approved",addedBy:"admin"}

);

// ═══════════════════════════════════════════════════════════════
// VERIFIED REAL COMMUNITY ORGANISATIONS — Wyndham LGA
// Sources: Wyndham City Council directory, Network West, official websites
// All contact details verified from public Google-listed sources
// ═══════════════════════════════════════════════════════════════

DB.push(

  // ── Community Learning Centres (Wyndham City) ──────────────
  {id:300,name:"Point Cook Community Learning Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Point Cook",state:"VIC",desc:"Wyndham City Council-run community centre offering programs, courses, room hire and family services. Hosts maternal and child health services, playgroups, courses and community events. Cashless payments only.",icon:"🏛️",tags:["Community centre","Council","Programs"],phone:"03 9395 6399",email:"pointcookclc@wyndham.vic.gov.au",web:"https://www.wyndham.vic.gov.au",address:"1-21 Cheetham Street, Point Cook VIC 3030",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Wyndham City Council",status:"approved",featured:true,addedBy:"admin"},

  {id:301,name:"Jamieson Way Community Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Point Cook",state:"VIC",desc:"Not-for-profit community centre at the heart of Point Cook. Hosts the Point Cook Library of Things, playgroups, fitness classes, craft and language groups. Available for community room hire.",icon:"🏠",tags:["Community centre","Room hire","Playgroups"],phone:"03 9395 3777",email:"admin@jamiesonwaycc.org.au",web:"https://www.jamiesonwaycc.org.au",address:"59 Jamieson Way, Point Cook VIC 3030",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Centre Manager",status:"approved",featured:true,addedBy:"admin"},

  {id:302,name:"Manor Lakes Community Learning Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Manor Lakes",state:"VIC",desc:"Wyndham City Council community learning centre offering classes, programs and family services for the Manor Lakes and Wyndham Vale community.",icon:"🏛️",tags:["Community centre","Council","Learning"],phone:"03 9742 0777",email:"wyndhamvaleclc@wyndham.vic.gov.au",web:"https://www.wyndham.vic.gov.au",address:"86 Manor Lakes Boulevard, Manor Lakes VIC 3024",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Wyndham City Council",status:"approved",addedBy:"admin"},

  {id:303,name:"Tarneit Community Learning Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Tarneit",state:"VIC",desc:"Council-run community centre offering classes, programs, room hire and family services for the Tarneit community. Cashless payments only.",icon:"🏛️",tags:["Community centre","Council","Tarneit"],phone:"03 8734 4500",email:"tarneitclc@wyndham.vic.gov.au",web:"https://www.wyndham.vic.gov.au",address:"150 Sunset Views Boulevard, Tarneit VIC 3029",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Wyndham City Council",status:"approved",addedBy:"admin"},

  {id:304,name:"Iramoo Community Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Wyndham Vale",state:"VIC",desc:"Not-for-profit community centre serving Wyndham Vale. Offers occasional care, playgroups, English classes, citizenship courses, exercise groups and room hire. Established for over 30 years.",icon:"🏠",tags:["Community centre","Playgroups","English classes"],phone:"03 8742 3688",email:"admin@iramoocc.com.au",web:"https://www.iramoocc.org.au",address:"84 Honour Avenue, Wyndham Vale VIC 3024",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Centre Manager",status:"approved",addedBy:"admin"},

  {id:305,name:"Quantin Binnah Community Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Werribee",state:"VIC",desc:"Werribee's hub for community programs — occasional care, playgroups, seniors groups, exercise classes, art and craft, English language and room hire. Not-for-profit organisation.",icon:"🏠",tags:["Community centre","Werribee","All ages"],phone:"03 9742 5040",email:"qb@qbcc.org.au",web:"https://www.qbcc.org.au",address:"61 Thames Boulevard, Werribee VIC 3030",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Centre Manager",status:"approved",addedBy:"admin"},

  {id:306,name:"The Grange Community Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Hoppers Crossing",state:"VIC",desc:"Large community centre with childcare, kindergarten, before/after school care, vacation programs, community courses and room hire. Serves Hoppers Crossing and surrounds.",icon:"🏠",tags:["Community centre","Childcare","Courses"],phone:"03 8742 8000",email:"enquiries@grangecommunity.org.au",web:"https://www.grangecommunity.org.au",address:"260-280 Hogans Road, Hoppers Crossing VIC 3029",hours:{Mon:"7am–6:30pm",Tue:"7am–6:30pm",Wed:"7am–6:30pm",Thu:"7am–6:30pm",Fri:"7am–6:30pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Centre Manager",status:"approved",addedBy:"admin"},

  {id:307,name:"Penrose Promenade Community Centre",industry:"Community & Culture",cat:"Community Centre",suburb:"Tarneit",state:"VIC",desc:"Wyndham City community centre in Tarneit offering programs, classes and room hire for the local community. Maternal and child health services on-site.",icon:"🏛️",tags:["Community centre","Council","MCH"],phone:"03 8734 4500",email:"Penrosepromenadecc@wyndham.vic.gov.au",web:"https://www.wyndham.vic.gov.au",address:"83 Penrose Promenade, Tarneit VIC 3029",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Wyndham City Council",status:"approved",addedBy:"admin"},

  // ── Wyndham Council main contact ──────────────────────────
  {id:308,name:"Wyndham City Council",industry:"Community & Culture",cat:"Community Centre",suburb:"Werribee",state:"VIC",desc:"Wyndham City Council services — rates, planning, animal management, parking, rubbish collection, libraries, community grants and events. Contact centre open Mon–Fri 8am–5pm. After-hours emergency service available.",icon:"🏛️",tags:["Council","Local government","Services"],phone:"1300 023 411",email:"mail@wyndham.vic.gov.au",web:"https://www.wyndham.vic.gov.au",address:"45 Princes Highway, Werribee VIC 3030",hours:{Mon:"8:30am–5pm",Tue:"8:30am–5pm",Wed:"8:30am–5pm",Thu:"8:30am–5pm",Fri:"8:30am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Wyndham City Council",status:"approved",featured:true,addedBy:"admin"},

  // ── Wyndham Vale YMCA Early Learning ──────────────────────
  {id:309,name:"Wyndham Vale YMCA Early Learning Centre",industry:"Education & Childcare",cat:"Childcare Centre",suburb:"Wyndham Vale",state:"VIC",desc:"YMCA not-for-profit early learning centre offering long day childcare and free funded kindergarten programs (3yo and 4yo) for children 6 weeks to 5 years. Bachelor-qualified early childhood teachers. Located in Wynbrook Estate near Wyndham Vale Station.",icon:"🧸",tags:["Childcare","Free kinder","YMCA"],phone:"03 8320 2620",email:"wyndhamvale@ymca.org.au",web:"https://childrensprograms.ymca.org.au/early-learning/wyndham-vale",address:"1 Paramount Boulevard, Wyndham Vale VIC 3024",hours:{Mon:"7am–6pm",Tue:"7am–6pm",Wed:"7am–6pm",Thu:"7am–6pm",Fri:"7am–6pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"YMCA Victoria",status:"approved",addedBy:"admin"}

);


DB.push(
  // WEstjustice — free community legal centre serving Melbourne's West
  {id:310,name:"WEstjustice — Western Community Legal Centre",industry:"Legal & Migration",cat:"Community Legal Centre",suburb:"Werribee",state:"VIC",desc:"Free community legal centre serving Melbourne's west (Wyndham, Maribyrnong, Hobsons Bay, Melton, Brimbank). Help with consumer disputes, credit and debt, family law and family violence, fines, motor vehicle accidents, tenancy, youth criminal law. Specialist programs for women, young people, workers. Advice by appointment — please call.",icon:"⚖️",tags:["Free legal help","Community legal","Family violence"],phone:"03 9749 7720",email:"admin@westjustice.org.au",web:"https://www.westjustice.org.au",address:"Level 1 / 8 Watton Street, Werribee VIC 3030",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"WEstjustice",status:"approved",featured:true,addedBy:"admin"}
);

DB.push(
  {id:311,name:"Werribee Mercy Hospital",industry:"Health & Medical",cat:"Specialist",suburb:"Werribee",state:"VIC",desc:"General hospital serving the south-western region of Melbourne. Provides emergency, surgical, medical, sub-acute, mental health, palliative, maternity and newborn care, plus renal dialysis. Run by Mercy Health. Located opposite Hoppers Crossing railway station. Mental health intake: 03 8754 3560.",icon:"🏥",tags:["Hospital","Emergency","Maternity"],phone:"03 8754 3000",email:"werribee@mercy.com.au",web:"https://health-services.mercyhealth.com.au/our-health-services/werribee-mercy-hospital",address:"300 Princes Highway, Werribee VIC 3030",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Mercy Health",status:"approved",featured:true,addedBy:"admin"}
);

// ═══════════════════════════════════════════════════════════════
// Community-recommended local service providers — Point Cook
// Submitted by community members. Contact details as supplied.
// Edit/update via Suggest an edit on each listing.
// ═══════════════════════════════════════════════════════════════
DB.push(
  {id:500,name:"Sai Aircon Systems",industry:"Home & Trade Services",cat:"Air Conditioning",suburb:"Point Cook",state:"VIC",desc:"Air conditioning and evaporative cooling installation, service and repairs. Community-recommended by Maddy.",icon:"❄️",tags:["Aircon","Evaporative","Local recommended"],mobile:"0430 283 034",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Maddy",status:"approved",addedBy:"community"},
  {id:501,name:"Bhavesh Mehta — Car Mechanic",industry:"Automotive",cat:"Mechanic",suburb:"Point Cook",state:"VIC",desc:"Car mechanical service and repairs. Community-recommended local provider.",icon:"🔧",tags:["Mechanic","Local","Car repairs"],mobile:"0430 788 548",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Bhavesh Mehta",status:"approved",addedBy:"community"},
  {id:502,name:"Katie — Cleaning Services",industry:"Home & Trade Services",cat:"Cleaner",suburb:"Point Cook",state:"VIC",desc:"Home and end-of-lease cleaning services. Community-recommended local cleaner.",icon:"🧹",tags:["Cleaning","Home cleaning","Local"],mobile:"0407 540 997",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Katie",status:"approved",addedBy:"community"},
  {id:503,name:"Gauri — Cleaning Services",industry:"Home & Trade Services",cat:"Cleaner",suburb:"Point Cook",state:"VIC",desc:"Home cleaning services. Community-recommended local cleaner.",icon:"🧹",tags:["Cleaning","Home cleaning","Local"],mobile:"0450 715 454",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Gauri",status:"approved",addedBy:"community"},
  {id:504,name:"Cinch Loans (formerly Exceller8 Financial) — Suvidh Arora",industry:"Finance & Insurance",cat:"Mortgage Broker",suburb:"Point Cook",state:"VIC",desc:"Mortgage broking — home loans, refinancing, investment lending, SMSF and trust structures. Suvidh Arora is a former investment banker. Highly rated on Trustpilot.",icon:"🏡",tags:["Mortgage broker","Home loans","Refinance"],mobile:"0458 872 992",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Suvidh Arora",status:"approved",addedBy:"community"},
  {id:505,name:"Affluence Financials — Sridhar Tummalapalli",industry:"Finance & Insurance",cat:"Mortgage Broker",suburb:"Point Cook",state:"VIC",desc:"Mortgage broker — home loans, refinancing, investment lending. Community-recommended.",icon:"🏡",tags:["Mortgage broker","Home loans","Investment"],mobile:"0402 184 166",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Sridhar Tummalapalli",status:"approved",addedBy:"community"},
  {id:506,name:"Stockdale and Leggo — Suneet",industry:"Real Estate & Property",cat:"Real Estate Agent",suburb:"Point Cook",state:"VIC",desc:"Real estate sales and property management. Community-recommended agent.",icon:"🔑",tags:["Real estate","Property","Sales"],mobile:"0433 002 485",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"9am–4pm",Sun:"By appointment",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Suneet",status:"approved",addedBy:"community"},
  {id:507,name:"Ray White — Mark",industry:"Real Estate & Property",cat:"Real Estate Agent",suburb:"Point Cook",state:"VIC",desc:"Real estate sales and property management with Ray White. Community-recommended agent.",icon:"🔑",tags:["Real estate","Ray White","Sales"],mobile:"0425 400 600",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"9am–4pm",Sun:"By appointment",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Mark",status:"approved",addedBy:"community"},
  {id:508,name:"First National Real Estate — Bobby Lakra",industry:"Real Estate & Property",cat:"Real Estate Agent",suburb:"Point Cook",state:"VIC",desc:"Real estate sales and property management. Community-recommended agent.",icon:"🔑",tags:["Real estate","First National","Sales"],mobile:"0417 519 316",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"9am–4pm",Sun:"By appointment",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Bobby Lakra",status:"approved",addedBy:"community"},
  {id:509,name:"Reliance Real Estate — JD Patel",industry:"Real Estate & Property",cat:"Real Estate Agent",suburb:"Point Cook",state:"VIC",desc:"Real estate sales and property management. Community-recommended agent.",icon:"🔑",tags:["Real estate","Reliance","Sales"],mobile:"0423 664 786",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"9am–4pm",Sun:"By appointment",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"JD Patel",status:"approved",addedBy:"community"},
  {id:510,name:"Learn & Grow Outside School Care — Krupa Vachchani",industry:"Education & Childcare",cat:"Childcare Centre",suburb:"Point Cook",state:"VIC",desc:"Outside school hours care for children. Community-recommended local provider.",icon:"🧸",tags:["OSHC","Childcare","After school"],mobile:"0411 955 843",hours:{Mon:"7am–9am, 3pm–6:30pm",Tue:"7am–9am, 3pm–6:30pm",Wed:"7am–9am, 3pm–6:30pm",Thu:"7am–9am, 3pm–6:30pm",Fri:"7am–9am, 3pm–6:30pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Krupa Vachchani",status:"approved",addedBy:"community"},
  {id:511,name:"Vinita's Day Care",industry:"Education & Childcare",cat:"Childcare Centre",suburb:"Point Cook",state:"VIC",desc:"Family day care for young children. Community-recommended local provider.",icon:"🧸",tags:["Day care","Family day care","Children"],mobile:"0415 932 236",hours:{Mon:"7am–6pm",Tue:"7am–6pm",Wed:"7am–6pm",Thu:"7am–6pm",Fri:"7am–6pm",Sat:"Closed",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Vinita",status:"approved",addedBy:"community"},
  {id:512,name:"Pointax — Manu Samriti",industry:"Professional Services",cat:"Accountant",suburb:"Point Cook",state:"VIC",desc:"Accounting and tax services. Community-recommended local accountant.",icon:"📊",tags:["Accountant","Tax","Bookkeeping"],phone:"03 8386 7410",hours:{Mon:"9am–5pm",Tue:"9am–5pm",Wed:"9am–5pm",Thu:"9am–5pm",Fri:"9am–5pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Manu Samriti",status:"approved",addedBy:"community"},
  {id:513,name:"Daniel Plumbing",industry:"Home & Trade Services",cat:"Plumber",suburb:"Point Cook",state:"VIC",desc:"Plumbing services. Note from community: extremely expensive — do not use unless very urgent.",icon:"🔧",tags:["Plumber","Emergency","Local"],mobile:"0401 496 570",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"Emergency only",Sun:"Emergency only",PH:"Emergency only"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Daniel",status:"approved",notes:"Community advisory: pricey — emergency use only",addedBy:"community"},
  {id:514,name:"NLK Plumbing — Nathan",industry:"Home & Trade Services",cat:"Plumber",suburb:"Point Cook",state:"VIC",desc:"Local plumber with 30+ years experience in Point Cook. 24/7 emergency service. Handles burst pipes, blocked drains, hot water, gas, roof plumbing. Servicing Point Cook, Werribee, Hoppers Crossing, Tarneit and surrounds.",icon:"🔧",tags:["Plumber","Local","Recommended"],mobile:"0404 803 333",hours:{Mon:"24/7",Tue:"24/7",Wed:"24/7",Thu:"24/7",Fri:"24/7",Sat:"24/7",Sun:"24/7",PH:"24/7"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Nathan",status:"approved",addedBy:"community"},
  {id:515,name:"Dominic — Electrician",industry:"Home & Trade Services",cat:"Electrician",suburb:"Point Cook",state:"VIC",desc:"Electrical services. Community-recommended local electrician.",icon:"⚡",tags:["Electrician","Local","Recommended"],mobile:"0449 638 165",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Dominic",status:"approved",addedBy:"community"},
  {id:516,name:"Rhys — Electrician",industry:"Home & Trade Services",cat:"Electrician",suburb:"Point Cook",state:"VIC",desc:"Electrical services. Community-recommended local electrician.",icon:"⚡",tags:["Electrician","Local","Recommended"],mobile:"0412 958 994",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Rhys",status:"approved",addedBy:"community"},
  {id:517,name:"Armax Home Systems — Arek",industry:"Home & Trade Services",cat:"Carpenter",suburb:"Point Cook",state:"VIC",desc:"Cabinet making and carpentry. Community-recommended local provider.",icon:"🪵",tags:["Carpenter","Cabinets","Local"],mobile:"0413 578 687",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Arek",status:"approved",addedBy:"community"},
  {id:518,name:"Sunil — Cabinet Maker / Carpenter",industry:"Home & Trade Services",cat:"Carpenter",suburb:"Point Cook",state:"VIC",desc:"Cabinet making and carpentry. Community-recommended local provider.",icon:"🪵",tags:["Carpenter","Cabinets","Local"],mobile:"0468 444 591",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Sunil",status:"approved",addedBy:"community"},
  {id:519,name:"Omar — Cabinet Maker / Carpenter",industry:"Home & Trade Services",cat:"Carpenter",suburb:"Point Cook",state:"VIC",desc:"Cabinet making and carpentry. Community-recommended local provider.",icon:"🪵",tags:["Carpenter","Cabinets","Local"],mobile:"0413 195 365",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Omar",status:"approved",addedBy:"community"},
  {id:520,name:"Gerard — Removalist (FB Marketplace Mover)",industry:"Home & Trade Services",cat:"Cleaner",suburb:"Point Cook",state:"VIC",desc:"Removalist services — ideal for Facebook Marketplace purchases and small moves. Community-recommended.",icon:"📦",tags:["Removalist","Marketplace","Local"],mobile:"0405 405 095",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"By appointment",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Gerard",status:"approved",addedBy:"community"},
  {id:521,name:"Tip Top Services — Umesh",industry:"Home & Trade Services",cat:"Roofer",suburb:"Point Cook",state:"VIC",desc:"Gutter cleaning and roofing services. Community-recommended local provider.",icon:"🏠",tags:["Gutters","Roofing","Local"],mobile:"0425 006 900",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Umesh",status:"approved",addedBy:"community"},
  {id:522,name:"High Quality Roofing Restoration and Repairs — Lisandro",industry:"Home & Trade Services",cat:"Roofer",suburb:"Point Cook",state:"VIC",desc:"Roofing restoration and repairs. Community-recommended with positive reviews.",icon:"🏠",tags:["Roofing","Restoration","Repairs"],mobile:"0425 797 779",web:"https://www.highqualityroofingrestoration.com.au",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Lisandro",status:"approved",addedBy:"community"},
  {id:523,name:"OzNova — AI, Automation & IT Services",industry:"Technology & IT",cat:"IT Support",suburb:"Point Cook",state:"VIC",desc:"AI, automation, data, mobile apps and IT services. Community-recommended local provider.",icon:"💻",tags:["IT","AI","Mobile apps"],mobile:"0489 059 797",web:"https://oznova.com.au",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"OzNova",status:"approved",addedBy:"community"},
  {id:524,name:"Tenant to Owner (T2O) — Saptha",industry:"Real Estate & Property",cat:"Buyers Agent",suburb:"Point Cook",state:"VIC",desc:"Buyer's and renter's agency plus property management. Community-recommended.",icon:"🔑",tags:["Buyers agent","Property management","Renters"],mobile:"0421 433 136",web:"https://tenanttoowner.au",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Saptha",status:"approved",addedBy:"community"},
  {id:525,name:"National Finance Pty Ltd — Arut Jothi",industry:"Finance & Insurance",cat:"Mortgage Broker",suburb:"Point Cook",state:"VIC",desc:"Refinance, home loans, credit cards, car loans and personal loans. Community-recommended mortgage broker.",icon:"🏡",tags:["Mortgage","Home loans","Personal loans"],mobile:"0422 293 246",address:"42 Victorking Drive, Point Cook VIC 3030",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Arut Jothi",status:"approved",addedBy:"community"},
  {id:526,name:"Satheesh Kumar — Mortgage Broker",industry:"Finance & Insurance",cat:"Mortgage Broker",suburb:"Point Cook",state:"VIC",desc:"Mortgage broking services. Community-recommended local broker.",icon:"🏡",tags:["Mortgage broker","Home loans","Local"],mobile:"0451 743 249",hours:{Mon:"9am–6pm",Tue:"9am–6pm",Wed:"9am–6pm",Thu:"9am–6pm",Fri:"9am–6pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Satheesh Kumar",status:"approved",addedBy:"community"},
  {id:527,name:"PipeSafe Plumbing — Shaun",industry:"Home & Trade Services",cat:"Plumber",suburb:"Point Cook",state:"VIC",desc:"Plumbing services with very good after-service support. Community-recommended.",icon:"🔧",tags:["Plumber","Excellent service","Recommended"],mobile:"0450 944 566",web:"https://www.pipesafe.com.au",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"Emergency only",Sun:"Emergency only",PH:"Emergency only"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Shaun",status:"approved",notes:"Very good service and after-service support.",addedBy:"community"},
  {id:528,name:"Door Services Victoria — Andrew",industry:"Home & Trade Services",cat:"Handyman",suburb:"Melbourne CBD",state:"VIC",desc:"Garage door installation, service and repairs. Community-recommended with positive reviews.",icon:"🚪",tags:["Garage doors","Service","Repairs"],mobile:"0417 385 483",web:"https://www.doorservicesvic.com.au",address:"2/110 Elizabeth St, Melbourne VIC 3000",hours:{Mon:"7am–5pm",Tue:"7am–5pm",Wed:"7am–5pm",Thu:"7am–5pm",Fri:"7am–5pm",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Andrew",status:"approved",addedBy:"community"},
  {id:529,name:"Zipscreen — John",industry:"Home & Trade Services",cat:"Handyman",suburb:"Point Cook",state:"VIC",desc:"Outdoor screen installation and garage door service. Community-recommended.",icon:"🚪",tags:["Zipscreen","Outdoor screens","Doors"],mobile:"0407 516 598",web:"https://www.zipscreen.com.au",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"John",status:"approved",addedBy:"community"},
  {id:530,name:"Lee — Handyman Services",industry:"Home & Trade Services",cat:"Handyman",suburb:"Point Cook",state:"VIC",desc:"General handyman services. Community-recommended.",icon:"🛠️",tags:["Handyman","Local","Recommended"],mobile:"0416 564 111",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"Closed",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Lee",status:"approved",addedBy:"community"},
  {id:531,name:"Pradpix Studios — Pradeep Manoharan",industry:"Events & Entertainment",cat:"Photographer",suburb:"Point Cook",state:"VIC",desc:"Photography and videography services for events. Community-recommended.",icon:"📸",tags:["Photography","Videography","Events"],mobile:"0430 130 682",web:"https://pradpixstudios.com.au",hours:{Mon:"By appointment",Tue:"By appointment",Wed:"By appointment",Thu:"By appointment",Fri:"By appointment",Sat:"By appointment",Sun:"By appointment",PH:"Closed"},lastUpdated:"2026-06-13",submittedAt:"2026-06-13",contact:"Pradeep Manoharan",status:"approved",addedBy:"community"}
);
