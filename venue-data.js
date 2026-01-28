// Venue data extracted from scraped content
const venuesDB = {
    bell: {
        id: 'bell',
        name: 'The Bell in Ticehurst',
        tagline: 'Quirky 16th Century Coaching Inn with Character & Charm',
        location: {
            address: 'High Street, Ticehurst, East Sussex',
            city: 'Ticehurst',
            postcode: 'TN5 7AS',
            distanceFromLondon: '1 hour',
            coordinates: { lat: 51.0533, lng: 0.4167 }
        },
        capacity: {
            maxGuests: 32,
            bedrooms: 16,
            bathrooms: 16,
            description: '7 hotel rooms, 5 garden houses, 4 lodges'
        },
        quickFacts: [
            { icon: '<img src="Retreat Images/Icons/icon_capacity.png" alt="Capacity">', label: 'Capacity', value: 'Up to 32 guests' },
            { icon: '<img src="Retreat Images/Icons/icon_accommodation.png" alt="Accommodation">', label: 'Accommodation', value: '16 unique rooms' },
            { icon: '<img src="Retreat Images/Icons/icon_meeting.png" alt="Event Space">', label: 'Event Space', value: 'Seats 90 for dinner' },
            { icon: '<img src="Retreat Images/Icons/icon_dining.png" alt="Dining">', label: 'Dining', value: '2 AA Rosettes' },
            { icon: '<img src="Retreat Images/Icons/icon_rating.png" alt="Rating">', label: 'Rating', value: '5-Star AA Inn' },
            { icon: '<img src="Retreat Images/Icons/icon_activities.png" alt="Activities">', label: 'Activities', value: 'Analogue Adventures' }
        ],
        about: {
            description: 'In the quintessentially English village of Ticehurst in East Sussex, just an hour from London, you will discover the storybook charm of The Bell. Full of character and hidden gems, this former 16th Century Coaching Inn has been transformed into a creative paradise, visual treat and dream-like escape from reality.',
            highlights: [
                'Seamlessly blending old and new with quirky, eccentric design',
                '5-Star AA Inn with 2 AA Rosettes for culinary excellence',
                'Winner of Community Spaces at The Pineapples Awards',
                'Exclusive use available for corporate retreats',
                'Just 1 hour from London in the heart of East Sussex'
            ]
        },
        accommodation: {
            overview: {
                totalBedrooms: 16,
                totalBathrooms: 16,
                maxCapacity: 32,
                description: 'Choose from seven rooms over the pub, five fantastical garden houses, and four garden lodges—each with its own unique character and charm.'
            },
            categories: [
                {
                    name: 'Hotel Bedrooms',
                    count: 7,
                    sleeps: 14,
                    description: 'Curiously eccentric rooms over the pub, each with its own silver birch tree',
                    features: [
                        'Handmade Somnus mattresses',
                        'Deep copper baths in select rooms',
                        'King-size beds',
                        'Bespoke toiletries and cookies',
                        'Unique artwork and quirky details'
                    ],
                    rooms: [
                        { name: 'Stranger than Truth', type: 'Cosy Double' },
                        { name: 'Benefit of Doubt', type: 'Classic Double' },
                        { name: 'Anything is Possible', type: 'Classic Double' },
                        { name: 'The Moon Wild', type: 'Deluxe Double' },
                        { name: 'Hush of Trees', type: 'Deluxe Double' },
                        { name: 'Smiles of Memories', type: 'Deluxe Double' },
                        { name: 'Then and Now', type: 'Suite' }
                    ]
                },
                {
                    name: 'Garden Houses',
                    count: 5,
                    sleeps: 10,
                    description: 'Brand new outdoor garden houses with large comfy beds and en-suite walk-in showers',
                    features: [
                        'Private outdoor space',
                        'Designed with curiosity windows',
                        'Quirky decor throughout',
                        'En-suite with walk-in showers',
                        'Serene retreat atmosphere'
                    ],
                    rooms: [
                        { name: 'The Bird House' },
                        { name: 'The Art House' },
                        { name: 'The House of Yew and Eye' },
                        { name: 'The Old Bakehouse' },
                        { name: 'The House of Madness' }
                    ]
                },
                {
                    name: 'Garden Lodges',
                    count: 4,
                    sleeps: 8,
                    description: 'Fantastical garden lodges set around a fabulous fire pit',
                    features: [
                        'Private outdoor space and patios',
                        'Wood burners for cozy evenings',
                        'Record players and games',
                        'Outdoor baths with power jets (Spa Lodge)',
                        'Roof terraces with vineyard views (Love Nest)'
                    ],
                    rooms: [
                        { name: 'Between The Lines', type: 'Lodge' },
                        { name: 'Pretty Vacant', type: 'Lodge' },
                        { name: 'Pour L\'Amour', type: 'Spa Lodge', highlight: 'Outdoor bath with jets' },
                        { name: 'The Love Nest', type: 'Luxury Lodge', highlight: 'Roof terrace' }
                    ]
                }
            ]
        },
        corporateFacilities: {
            meetingSpaces: [
                {
                    name: 'The Big Room',
                    capacity: { seated: 90, standing: 120 },
                    description: 'Our main event space for fancy dos, perfect for corporate dinners and celebrations',
                    equipment: ['Flexible seating layouts', 'Bar service', 'Full catering available'],
                    availability: 'Available for exclusive hire'
                }
            ],
            catering: {
                description: 'Award-winning dining with 2 AA Rosettes',
                options: [
                    'Full breakfast service',
                    'Three-course dinners',
                    'Private dining experiences',
                    'Wine, gin, and cocktail masterclasses',
                    'Bespoke menus for dietary requirements'
                ],
                chefAvailable: true
            },
            workAmenities: [
                'WiFi throughout',
                'Quiet workspaces available',
                'Breakout areas in gardens',
                'Attentive service team'
            ]
        },
        activities: [
            {
                name: 'Analogue Adventures',
                category: 'Team Building',
                description: 'Real-world, sensory-rich experiences designed for teams who want time away from screens. Combining adventure, wellbeing and creativity.',
                duration: 'Half-day or full-day',
                onSite: true
            },
            {
                name: 'Creative Workshops',
                category: 'Team Building',
                description: 'Hands-on creative sessions that open ideas and encourage fresh conversation',
                onSite: true
            },
            {
                name: 'Wine Masterclass',
                category: 'Culinary',
                description: 'Expert-led wine tasting and education sessions',
                onSite: true
            },
            {
                name: 'Gin Tasting',
                category: 'Culinary',
                description: 'Discover craft gins with guided tasting',
                onSite: true
            },
            {
                name: 'Cocktail Making',
                category: 'Culinary',
                description: 'Learn to craft signature cocktails with our mixologists',
                onSite: true
            }
        ],
        facilities: {
            leisure: [
                'Garden fire pit',
                'Outdoor terraces',
                'Bar and lounge areas',
                'Reading nooks'
            ],
            outdoor: [
                'Village location with walking routes',
                'Garden spaces',
                'Outdoor seating areas',
                'Fire pit gathering space'
            ],
            practical: [
                'On-site parking',
                'Accessible ground floor rooms available',
                'Heating throughout',
                'Full kitchen facilities for events',
                'Laundry service available'
            ]
        },
        images: {
            hero: [
                'https://www.thebellinticehurst.com/wp-content/uploads/2022/01/The-Bell-Rooms-Banner-Image-02-scaled.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2024/02/The-Bell-Events-Banner-Image-02-scaled.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2023/08/The-Bell-May-23-67_websize.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2023/08/The-Bell-April-23-95_websize.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2023/08/The-Stables-July-23-2_websize-1.jpg'
            ],
            accommodation: [
                'https://www.thebellinticehurst.com/wp-content/uploads/2020/11/The-Bell-Benefit-of-Doubt2.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2023/08/The-Bell-The-Moon-Wild3-scaled.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2020/11/The-Bell-Smile-of-Memories-scaled.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2024/05/Bath-running-Website.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2023/08/The-Stables-July-23-8_websize-1.jpg'
            ],
            facilities: [
                'https://www.thebellinticehurst.com/wp-content/uploads/2024/02/The-Bell-Jan-23-41_websize.jpg',
                'https://www.thebellinticehurst.com/wp-content/uploads/2026/01/Francesca-Dan-198-1400x788.jpg'
            ]
        },
        pricing: {
            from: 150,
            currency: 'GBP',
            unit: 'per room per night',
            notes: 'Exclusive use packages available on request'
        },
        policies: {
            checkIn: '3:00 PM',
            checkOut: '11:00 AM',
            minimumStay: '2 nights for exclusive use',
            cancellation: 'Flexible cancellation up to 7 days before arrival',
            deposit: 'Required at booking',
            pets: 'Not permitted',
            smoking: 'Non-smoking property'
        },
        recognition: [
            '5-Star AA Inn',
            '2 AA Rosettes for Culinary Excellence',
            'Pineapples Award Winner - Community Spaces',
            'Featured in national press'
        ],
        contact: {
            phone: '+44 1580 200234',
            email: 'hello@thebellinticehurst.com',
            website: 'https://www.thebellinticehurst.com'
        }
    },

    oastbrook: {
        id: 'oastbrook',
        name: 'Oastbrook Estate Vineyard',
        tagline: 'Working Vineyard Estate with Award-Winning Wines',
        location: {
            address: 'Junction Road, Bodiam, Robertsbridge',
            city: 'Bodiam',
            postcode: 'TN32 5XA',
            distanceFromLondon: '90 minutes',
            coordinates: { lat: 50.9833, lng: 0.5500 }
        },
        capacity: {
            maxGuests: 20,
            bedrooms: 10,
            bathrooms: 10,
            description: 'Vineyard Hollow (4 guests), Avalon Lodge (4 guests), 8 Glamping Tents (2 each)'
        },
        quickFacts: [
            { icon: '<img src="Retreat Images/Icons/icon_capacity.png" alt="Capacity">', label: 'Capacity', value: 'Up to 20 guests' },
            { icon: '<img src="Retreat Images/Icons/icon_accommodation.png" alt="Accommodation">', label: 'Accommodation', value: '2 lodges + 8 tents' },
            { icon: '<img src="Retreat Images/Icons/icon_meeting.png" alt="Event Space">', label: 'Event Space', value: 'Tasting Room with AV' },
            { icon: '<img src="Retreat Images/Icons/icon_dining.png" alt="Dining">', label: 'Experience', value: 'Award-winning vineyard' },
            { icon: '<img src="Retreat Images/Icons/icon_rating.png" alt="Recognition">', label: 'Recognition', value: 'National Geographic featured' },
            { icon: '<img src="Retreat Images/Icons/icon_activities.png" alt="Activities">', label: 'Activities', value: 'Archery, falconry, tours' }
        ],
        about: {
            description: 'Set in the heart of the Rother Valley, Oastbrook Estate offers a unique vineyard setting for corporate retreats. This working vineyard combines rustic charm with modern luxury, featuring Scandinavian-style lodges, a professional tasting room, and award-winning wines—all just 90 minutes from London.',
            highlights: [
                'Working vineyard in the stunning Rother Valley',
                'National Geographic: One of 10 best UK glamping sites for foodies',
                'Award-winning English sparkling wines',
                'Professional tasting room with full AV capabilities',
                'Just 90 minutes from London, near major airports'
            ]
        },
        accommodation: {
            overview: {
                totalBedrooms: 10,
                totalBathrooms: 10,
                maxCapacity: 20,
                description: 'Choose from our earth-sheltered Vineyard Hollow, waterside Avalon Lodge, or luxury glamping tents nestled in the vineyard.'
            },
            categories: [
                {
                    name: 'Vineyard Hollow',
                    count: 1,
                    sleeps: 4,
                    description: 'Nestled into a hillside with breathtaking valley views, built by local craftsmen using indigenous materials',
                    features: [
                        '2 king-size bedrooms with en-suite bathrooms',
                        'Fully equipped kitchen',
                        'Indoor wood fire stove',
                        'Private outdoor hot tub',
                        'Reading nook with fireplace',
                        'Ground source heat pump and biodigester'
                    ],
                    highlight: 'UK\'s quirkiest place to stay'
                },
                {
                    name: 'Avalon Waterside Lodge',
                    count: 1,
                    sleeps: 4,
                    description: 'Stunning Scandinavian A-frame lodge with elevated decking overlooking the pond and vineyard',
                    features: [
                        'Master bedroom with king-size bed and en-suite',
                        'Mezzanine bedroom with flexible sleeping (2 singles or double)',
                        'Sofa bed in living area',
                        'Fully equipped modern kitchen',
                        'Wood fire stove',
                        'Private hot tub on waterside deck',
                        'Panoramic vineyard views'
                    ],
                    highlight: 'Waterfront location with hot tub'
                },
                {
                    name: 'Luxury Glamping Tents',
                    count: 8,
                    sleeps: 16,
                    description: '5-star bell tents with king-size beds, nestled in the vineyard',
                    features: [
                        'King-size beds with luxury linens',
                        'Soft lighting and luxury throws',
                        'Individual fire pits',
                        'Shared campfire area',
                        'Private luxury washrooms with heated showers',
                        'Weber BBQ at each tent',
                        'Wine coolers'
                    ],
                    highlight: 'National Geographic featured'
                }
            ]
        },
        corporateFacilities: {
            meetingSpaces: [
                {
                    name: 'Tasting Room',
                    capacity: { seated: 40, standing: 60 },
                    description: 'Scandinavian long house design with full AV capability, perfect for presentations and dinners',
                    equipment: [
                        '3-meter screen',
                        'Surround sound system',
                        'Full commercial kitchen',
                        'Terrace with elevated vineyard views'
                    ],
                    availability: 'Friday - Sunday'
                },
                {
                    name: 'Pool Patio',
                    capacity: { standing: 50 },
                    description: 'Tropical-feel open space with kitchen and BBQ area, perfect for al fresco dining',
                    equipment: [
                        'BBQ area',
                        'Kitchen facilities',
                        'Nearby gazebo for exclusive dining'
                    ],
                    availability: 'Friday - Sunday'
                }
            ],
            catering: {
                description: 'Extensive menus provided by local chefs',
                options: [
                    'Full breakfast service',
                    'Three-course dinners',
                    'BBQ experiences',
                    'Wine pairing dinners',
                    'Bespoke menus available'
                ],
                chefAvailable: true
            },
            workAmenities: [
                'WiFi throughout estate',
                'Quiet workspaces in lodges',
                'Outdoor breakout areas',
                'Professional AV equipment'
            ]
        },
        activities: [
            {
                name: 'Vineyard Tour & Tasting',
                category: 'Wine Experience',
                description: 'Exclusive tour with owner America Brewer, exploring the vineyard and tasting award-winning wines with cheese platters',
                duration: '2 hours',
                onSite: true,
                highlight: true
            },
            {
                name: 'Archery',
                category: 'Team Building',
                description: 'Test your precision and focus in the English countryside',
                onSite: true
            },
            {
                name: 'Axe Throwing',
                category: 'Team Building',
                description: 'Ancient skill bringing primal thrill and historical connection',
                onSite: true
            },
            {
                name: 'Falconry',
                category: 'Unique Experience',
                description: 'Interact with majestic birds of prey and learn about their fascinating lives',
                onSite: true
            },
            {
                name: 'Laser Clay Pigeon Shooting',
                category: 'Team Building',
                description: 'Environmentally friendly shooting experience in pastoral landscape',
                onSite: true
            }
        ],
        facilities: {
            leisure: [
                'Private hot tubs at lodges',
                'Fire pits at glamping tents',
                'Shared campfire area',
                'Vineyard walking trails',
                'Wine tasting room'
            ],
            outdoor: [
                'Working vineyard',
                'Pond and waterside areas',
                '32-acre estate',
                'BBQ areas',
                'Outdoor terraces'
            ],
            practical: [
                'Car park by winery',
                'Wheelchair accessible (some limitations)',
                'Ground source heat pump',
                'Biodigester',
                'Self-catering facilities',
                'Luxury shower facilities for glamping'
            ]
        },
        images: {
            hero: [
                'https://oastbrook.com/wp-content/uploads/2023/09/1546572-SX93820-20Exterior-1024x683.jpg',
                'https://oastbrook.com/wp-content/uploads/2023/09/Outside-1024x856.jpg',
                'https://oastbrook.com/wp-content/uploads/elementor/thumbs/Oastbrook_090821_54-rgi99soj9yrz996b83vrfm8962ycz8lesyfvs7kke8.jpg',
                'https://oastbrook.com/wp-content/uploads/2022/04/Oastbrook_140621_43-1-1024x683.jpg'
            ],
            accommodation: [
                'https://oastbrook.com/wp-content/uploads/2023/09/1561851-SX93820-20Dining20Area20-20View202-1024x678.jpg',
                'https://oastbrook.com/wp-content/uploads/2023/09/Kitchen-1024x853.jpg',
                'https://oastbrook.com/wp-content/uploads/2023/09/Hot-Tub-1024x659.jpg',
                'https://oastbrook.com/wp-content/uploads/2023/09/Master-Bedroom-1-1024x659.jpg',
                'https://oastbrook.com/wp-content/uploads/elementor/thumbs/Oastbrook_HighRes_240321_5-1-rgi99uk7nmujwh3kx4p0klr6cup3emsvh7quqrhs1s.jpg'
            ],
            facilities: [
                'https://oastbrook.com/wp-content/uploads/2023/09/Patio-Outdoor-Furniture-1024x659.jpg',
                'https://oastbrook.com/wp-content/uploads/2023/09/Peaceful-River-View-1024x659.jpg'
            ]
        },
        pricing: {
            from: 200,
            currency: 'GBP',
            unit: 'per accommodation per night',
            notes: 'Discounts available: 15% for 2+ nights, 30% for 5+ nights'
        },
        policies: {
            checkIn: '4:00 PM - 6:00 PM',
            checkOut: '10:00 AM',
            minimumStay: '2 nights recommended',
            cancellation: 'Contact for cancellation policy',
            deposit: '£200 security deposit (refundable)',
            pets: 'Not permitted',
            smoking: 'Outdoor only',
            accessibility: 'Wheelchair accessible with some limitations'
        },
        recognition: [
            'National Geographic: One of 10 best UK glamping sites for foodies (2021)',
            'Award-winning English wines',
            'Featured in national press'
        ],
        contact: {
            phone: '07808 890428',
            email: 'info@oastbrook.com',
            website: 'https://oastbrook.com'
        }
    },

    eastwood: {
        id: 'eastwood',
        name: 'Eastwood Observatory',
        tagline: 'Grand Estate with Exclusive Use for Corporate Retreats',
        location: {
            address: 'Herstmonceux, East Sussex',
            city: 'Herstmonceux',
            postcode: 'BN27 1RN',
            distanceFromLondon: '90 minutes',
            coordinates: { lat: 50.8833, lng: 0.3167 }
        },
        capacity: {
            maxGuests: 24,
            bedrooms: 13,
            bathrooms: 13,
            description: '12 double bedrooms + 1 bunk room, all exclusive use'
        },
        quickFacts: [
            { icon: '<img src="Retreat Images/Icons/icon_capacity.png" alt="Capacity">', label: 'Capacity', value: 'Up to 24+ guests' },
            { icon: '<img src="Retreat Images/Icons/icon_accommodation.png" alt="Bedrooms">', label: 'Bedrooms', value: '13 rooms (12 double + bunk)' },
            { icon: '<img src="Retreat Images/Icons/icon_meeting.png" alt="Estate">', label: 'Estate', value: '32-acre exclusive use' },
            { icon: '<img src="Retreat Images/Icons/icon_dining.png" alt="Catering">', label: 'Catering', value: 'Personal chef available' },
            { icon: '<img src="Retreat Images/Icons/icon_rating.png" alt="Service">', label: 'Service', value: 'Boutique hotel standard' },
            { icon: '<img src="Retreat Images/Icons/icon_activities.png" alt="Activities">', label: 'Activities', value: 'Clay shooting, climbing, more' }
        ],
        about: {
            description: 'Eastwood Observatory is the ideal venue for corporate retreats. The idyllic rural setting and unparalleled beauty provide exceptional escapism from the outside world. All bookings are for exclusive use, meaning groups are free to use the 32-acre estate as suits them best.',
            highlights: [
                'Exclusive use of entire 32-acre estate',
                'Grand informality with boutique hotel service',
                'Personal chef and full housekeeping available',
                'Extensive on-site team building activities',
                'Meeting rooms with presentation facilities',
                'Just 90 minutes from London'
            ]
        },
        accommodation: {
            overview: {
                totalBedrooms: 13,
                totalBathrooms: 13,
                maxCapacity: 24,
                description: 'Perfectly set up for large groups with 12 fabulous double bedrooms, 1 bunk room, plus ground floor disabled access room. All rooms have en-suite or immediately adjacent private bathrooms.'
            },
            categories: [
                {
                    name: 'First Floor Rooms',
                    count: 6,
                    sleeps: 12,
                    description: 'Fantastic Georgian proportions with views over walled garden and estate',
                    features: [
                        'En-suite bathrooms with showers',
                        'Some with freestanding baths',
                        'Views of walled garden and tennis court',
                        'Spacious Georgian rooms'
                    ],
                    rooms: [
                        { name: 'Bedroom 3', features: 'En-suite shower, walled garden views' },
                        { name: 'Bedroom 4', features: 'En-suite shower, walled garden views' },
                        { name: 'Bedroom 5', features: 'En-suite with freestanding bath, tennis court views' },
                        { name: 'Bedroom 6', features: 'En-suite with freestanding bath, tennis court views' }
                    ]
                },
                {
                    name: 'Turret Rooms',
                    count: 3,
                    sleeps: 6,
                    description: 'Unique turret rooms with stunning views',
                    features: [
                        'En-suite bathrooms',
                        'Bath and separate shower in some',
                        'Wonderful garden views',
                        'Swimming pool views'
                    ],
                    highlight: 'Unique architectural features'
                },
                {
                    name: 'Second Floor Rooms',
                    count: 4,
                    sleeps: 8,
                    description: 'Top floor rooms with wonderful views of the estate and grounds',
                    features: [
                        'En-suite bathrooms',
                        'Freestanding stone baths in select rooms',
                        'Glorious views over garden and tennis court',
                        'Day beds in spacious rooms',
                        'Room for additional guest beds'
                    ]
                },
                {
                    name: 'Bunk Room',
                    count: 1,
                    sleeps: 2,
                    description: 'Second floor bunk room perfect for additional guests',
                    features: [
                        'En-suite bathroom with shower',
                        'Space for extra guest bed'
                    ]
                }
            ]
        },
        corporateFacilities: {
            meetingSpaces: [
                {
                    name: 'Main Meeting Room',
                    capacity: { seated: 24 },
                    description: 'Professional meeting facilities with full AV equipment',
                    equipment: [
                        'Presentation facilities',
                        'Audio-visual equipment for hire',
                        'Flexible seating arrangements',
                        'Natural daylight'
                    ],
                    availability: 'Available throughout stay'
                }
            ],
            catering: {
                description: 'Full housekeeping service with personal chef',
                options: [
                    'Breakfast and coffee service',
                    'Three-course dinners tailored to requirements',
                    'BBQ experiences (£15-20 per head)',
                    'Pre-dinner cocktails',
                    'Dietary requirements accommodated'
                ],
                chefAvailable: true,
                housekeeping: true
            },
            workAmenities: [
                'WiFi throughout property',
                'Multiple breakout spaces',
                'Quiet work areas',
                'Professional service team',
                'Printing facilities available'
            ]
        },
        activities: [
            {
                name: 'Clay Pigeon Shooting',
                category: 'Team Building',
                description: 'Organized in Eastwood\'s own grounds with friendly, fully licensed instructors. Various traps suit all ages and experience levels.',
                onSite: true,
                highlight: true
            },
            {
                name: 'Mobile Climbing Wall',
                category: 'Team Building',
                description: 'Full-height mobile climbing wall brings you face-to-face with Eastwood\'s famous lion! Four separate routes with harnesses and belays.',
                onSite: true,
                highlight: true
            },
            {
                name: 'Cooking Courses',
                category: 'Culinary',
                description: 'Fully immersive cooking courses with in-house chef, culminating in fabulous dinner served to the group',
                onSite: true
            },
            {
                name: 'Stargazing',
                category: 'Unique Experience',
                description: 'Director of Herstmonceux Observatory planetarium offers tailored courses with telescopes. See Saturn\'s rings and Neptune\'s moons!',
                onSite: true,
                highlight: true
            },
            {
                name: 'Wine Tasting',
                category: 'Culinary',
                description: 'Expert tutor offers exclusive tastings of local East Sussex wines or international selections',
                onSite: true
            },
            {
                name: 'Tennis Lessons',
                category: 'Wellness',
                description: 'Resident tennis coach available for guests of any age and level',
                onSite: true
            },
            {
                name: 'Yoga & Personal Training',
                category: 'Wellness',
                description: 'Find your zen in the wooden den, or opt for personal training sessions',
                onSite: true
            },
            {
                name: 'Pamper Party',
                category: 'Wellness',
                description: 'Facials, massages, manicure, pedicure and gel polish available individually or for groups',
                onSite: true
            }
        ],
        facilities: {
            leisure: [
                'Swimming pool (heated April-September)',
                'Hot tub (year-round)',
                'Tennis court',
                'Games room',
                'Cinema room',
                'Playhouse for children'
            ],
            outdoor: [
                '32-acre estate',
                'Walled garden',
                'Lakes',
                'Rolling pastures',
                'Outdoor games areas',
                'Courtyard'
            ],
            practical: [
                'Ample parking',
                'Ground floor disabled access room',
                'Full heating throughout',
                'Commercial kitchen',
                'Laundry facilities',
                'Nanny services available'
            ]
        },
        images: {
            hero: [
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-117-580x420.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2023/06/shooting-at-eastwood-scaled.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-043-1.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-178-e1656086731230.jpg'
            ],
            accommodation: [
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-170-e1656086748141.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-10-Eastwood-House-Ed-Ovenden-014-e1656087036743.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-140-e1656086801286.jpg'
            ],
            facilities: [
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-169-e1655984624976.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2023/06/climbing-at-eastwood2-scaled.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-177-e1656087343757.jpg',
                'https://www.eastwoodobservatory.co.uk/wp-content/uploads/2022/06/2022-06-11-Eastwood-House-Ed-Ovenden-109-e1656086816524.jpg'
            ]
        },
        pricing: {
            from: 3500,
            currency: 'GBP',
            unit: 'per night (exclusive use)',
            notes: 'Exclusive use only, includes full estate access'
        },
        policies: {
            checkIn: '4:00 PM',
            checkOut: '10:00 AM',
            minimumStay: '2 nights',
            cancellation: 'Contact for cancellation policy',
            deposit: 'Required at booking',
            pets: 'By arrangement',
            smoking: 'Non-smoking property',
            exclusiveUse: 'All bookings are for exclusive use'
        },
        recognition: [
            'Boutique hotel standard service',
            'Featured in wedding and events publications',
            'Historic estate property'
        ],
        contact: {
            phone: '+44 1323 833816',
            email: 'info@eastwoodobservatory.co.uk',
            website: 'https://www.eastwoodobservatory.co.uk'
        }
    }
};
