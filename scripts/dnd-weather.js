console.log("D&D WEATHER MODULE LOADED!!", "font-weight: bold; color: red; font-size: 16px");
console.log("version 1.0.6: added prevailing wind function");
/*
SimpleCalendar.api.getCurrentYear();
SimpleCalendar.api.getCurrentMonth();
SimpleCalendar.api.getCurrentSeason();
SimpleCalendar.api.getCurrentWeekday();
SimpleCalendar.api.getNotesForDay(2022, 11, 24);
SimpleCalendar.api.getTimeConfiguration();
//To set the date to December 25th 1999 with the time 00:00:00
SimpleCalendar.api.setDate({year: 1999, month: 11, day: 24, hour: 0, minute: 0, seconds: 0});

//To set the date to December 31st 1999 and the time to 11:59:59pm
SimpleCalendar.api.setDate({year: 1999, month: 11, day: 30, hour: 23, minute: 59, seconds: 59});
SimpleCalendar.api.pauseClock();
*/
Hooks.once('ready', async function() {
    console.log("D&D Weather module is loaded and ready!");
    // Initialization code here
});

var GlobalWeatherConfig = {
    year: 568,
    month: "Coldeven",
    day: "",
    latitude: 32,	// City of Greyhawk is at 35 deg. latitude
	latitudeTempAdj: 0,
    terrain: "Mountains",
    altitude: 6000,
	altitudeTempAdj: 0,
    baseDailyTemp: 0,
    dailyHighTemp: 0,
    dailyLowTemp: 0,
    temperature: { high: 0, low: 0, effective: 0 }, // Initialize effective temperature
	//temperature: { high: 0, low: 0 },
	recordTemperatureType: "none",
    tempRecordLow: false,
    tempRecordHigh: false,
    tempRecordDuration: 0,
    skyCondition: "clear",
    precipType: "none",
    precipBase: 0,
    precipAdj: 0,
	precipAmount: 0,
    windSpeedInitial: 0,
	windSpeed: 0,
	windSpeedAdjustment: 0,
	windDirection: 2,
	prevailingWindDirection: 10,
	humidity: 0,  // Add humidity here
    humidityRealistic: 0,
    humidityEffects: "",
    tempWindChillAdj: 0,
	specialWeather: false,  // Indicates whether a special weather event is possible
	specialWeatherEvent: "none", // Stores the type of special weather event
	specialWeatherEventDuration: 0,
	initialWeatherEvent: "none",
	initialWeatherEventDuration: 0,
	continuingWeatherEvent: "none",
	continuingWeatherEventDuration: 0,
	sunrise: 0,
	sunrset: 0,
	adjustedSunrise: 0,
	adjustedSunset: 0,
	displayMode: "full",
	rainbowType: "single",
	weekDays: ["Starday", "Sunday", "Moonday", "Godsday", "Waterday", "Earthday", "Freeday"],
    calendarLabels: {
        Needfest: "Needfest (Midwinter Festival)",
        Fireseek: "Fireseek (Winter)",
        Readying: "Readying (Spring)",
        Coldeven: "Coldeven (Spring)",
        Growfest: "Growfest (Spring Festival)",
        Planting: "Planting (Low Summer)",
        Flocktime: "Flocktime (Low Summer)",
        Wealsun: "Wealsun (Low Summer)",
        Richfest: "Richfest (Midsummer Festival)",
        Reaping: "Reaping (High Summer)",
        Goodmonth: "Goodmonth (High Summer)",
        Harvester: "Harvester (High Summer)",
        Brewfest: "Brewfest (Autumn Festival)",
        Patchwall: "Patchwall (Autumn)",
        "Ready'reat": "Ready'reat (Autumn)",  // Properly using quotes for properties that contain special characters or reserved words
        Sunsebb: "Sunsebb (Winter)"
    },
flags: {
        isSimpleCalendarAvailable: false,  // Initialize the config if not already done
        precipContinues: false,
        useSimpleCalendar: false,
		useHighWindTable: false,
		useWindChill: false,
        specialWeather: false,
		rainbow: false,
        onLand: false,
        atSea: false,
        inAir: false,
        inBattle: false,
        showSunriseSunset: true,
        showMoonPhases: true,
        showWindSpeed: true,
        showWindChill: true,
        showWindDirection: true,
        timeFormat: "24h",  // Alternatives could be "12h"
        temperatureUnit: "Fahrenheit",  // Alternative could be "Celsius"
        windSpeedUnit: "mph"  // Alternatives could be "km/h" or "None"
 
    },

specialWeatherTable: [
    {
        phenomenon: "Sand storm or Dust storm",
        precipitation: "",
        duration: "1d8 hours",
        areaEffect: "Normal",
        movementRate: "No",
        effectOnVision: "No",
        effectOnIRVision: "No",
        effectOnTracking: "No",
        chanceOfGettingLost: "80%",
        speed: "5d10 mph",
		notes: "50% chance of d4 damage every 3 turns, no saving throw, until shelter is found."
    },
    {
        phenomenon: "Wind storm",
        precipitation: "",
        duration: "1d10 hours",
        areaEffect: "Normal",
        movementRate: "1/2 (all)",
        effectOnVision: "x1/2",
        effectOnIRVision: "x3/4",
        effectOnTracking: "No",
        chanceOfGettingLost: "+30%",
        speed: "8d10 mph",
		notes: "50% chance of 2d6 of rock damage every 3 turns. Characters must roll dexterity or " +
				"less on d20 to save for 1/2 damage; monsters must save vs. pertrifaction."
    },
    {
        phenomenon: "Earthquake",
        precipitation: "",
        duration: "1d10 hours",
        areaEffect: "Normal",
        movementRate: "Foot: x1/4 H: x1/4 C: no (may be overturned)",
        effectOnVision: "No",
        effectOnIRVision: "No",
        effectOnTracking: "-50%",
        chanceOfGettingLost: "+10% (+30% on horse)",
        speed: "d20 mph",
		notes: "Center is 1-100 miles away from party, with shock waves extending 1-1000 miles. " +
				"The first shock wave of the earthquake will be preceded by 1-4 mild tremors, " +
				"which do no damage but cause untrained horses, cattle, and other animals to " +
				"bolt in fear and run for open ground. After a delay of 1-6	rounds, the first " +
				"shock wave reaches the party, and there are 1-6 shock waves in an earthquake. " +
				"Roll d20 to determine the number of rounds between	each of the shock waves. " +
				"Each shock wave causes damage as the 7th level cleric spell Earthquake."
    },
    {
        phenomenon: "Avalanche (rock or snow)",
        precipitation: "5d10 inches",
        duration: "1-10 minutes",
        areaEffect: "Normal",
        movementRate: "may be blocked",
        effectOnVision: "No",
        effectOnIRVision: "No",
        effectOnTracking: "-60%",
        chanceOfGettingLost: "30% on horse",
        speed: "d20 mph",
		notes: "Damage is 2d2O pts., with save (vs. dexterity or petrification) for 1/2 damage. " +
				"Victims taking more than 20 points of damage are buried and will suffocate in 6 rounds unless rescued."
    },
    {
        phenomenon: "Volcano",
        precipitation: "d8 inches of ash per day",
        duration: "1-10 days",
        areaEffect: "Normal",
        movementRate: "x1/2 (all)",
        effectOnVision: "x3/4 (x1/2 if undersea)",
        effectOnIRVision: "x1/2",
        effectOnTracking: "-50%",
        chanceOfGettingLost: "+20% (+40% if on horse)",
        speed: "d20 mph",
		notes: "Ash burns: d4 damage every 3 turns, no save. Location: 0-7 (d8-l) miles from party. " +
				"Lava flows at dlO mph, does damage as a salamander's tail (2d6). For every day a volcano " +
				"continues to erupt, the base temperature will rise 1 degree in a 60-mile-diameter " +
				"area. This overheating will lapse after 7-12 months, as particles of ash in the air " +
				"bring the temperature backdown, but the chance of clear skies in the area will be " +
				"cut by 50% for anadditonal 1-6	months thereafter."
    },
    {
        phenomenon: "Tsunami",
        precipitation: "Wave ht. has 10d20 feet",
        duration: "1-2 hours",
        areaEffect: "Normal",
        movementRate: "Normal",
        effectOnVision: "No",
        effectOnIRVision: "No",
        effectOnTracking: "No",
        chanceOfGettingLost: "Normal",
        speed: "5d10+10 mph",
		notes: "Save vs. dexterity/petrification or drown. If save is made, victim takes d20 damage."
    },
    {
        phenomenon: "Quicksand",
        precipitation: "",
        duration: "Normal",
        areaEffect: "covers radius of d20 inches",
        movementRate: "Normal (until entered)",
        effectOnVision: "No",
        effectOnIRVision: "No",
        effectOnTracking: "No",
        chanceOfGettingLost: "+20 if skirted",
        speed: "d20 mph",
		notes: "An individual wearing no armor, leather armor, studded armor, elven chain, or magical armor " +
				"will only sink up to the neck if he remains motionless, keeps his arms above the surface, " +
				"and discards all heavy items. Other characters will be dragged under at the rate of 1 foot " +
				"per round if motionless or 2 feet per round if attempting to escape. Drowning occurs 3 rounds " +
				"after the head is submerged. If a victim is rescued after his head has been submerged, assess " +
				"damage of d6 per round of submersion once character is resuscitated."
    },
    {
        phenomenon: "Flash flood",
        precipitation: "3",
        duration: "d6+2 hours",
        areaEffect: "Normal",
        movementRate: "Normal",
        effectOnVision: "Normal",
        effectOnIRVision: "No",
        effectOnTracking: "-5% per turn",
        chanceOfGettingLost: "+10%",
        speed: "d20 mph",
		notes: "A flash flood will begin with what appears to be a heavy rainstorm, with appropriate effects, " +
				"during which 3 inches of rain will fall each hours. The rain will stop when 50% of the flood's " +
				"duration is over, at which point all low areas will be covered with running water to a depth " +
				"which is triple the amount of rainfall. This water will remain for 6-10 turns, and then " +
				"disappear at a rate of 3 inches per hour. The current will vary from 5-50 mph, increasing when " +
				"water flows in narrow gullies."
    },
    {
        phenomenon: "Rain forest downpour",
        precipitation: "1 inch per hour",
        duration: "3d4 hours",
        areaEffect: "Normal",
        movementRate: "Foot: x1/2, H: x1/2, C: no",
        effectOnVision: "x3/4",
        effectOnIRVision: "x3/4",
        effectOnTracking: "-5% per turn",
        chanceOfGettingLost: "+20%",
        speed: "d6-1 mph",
		notes: "The ground will absorb up to 6 inches of water; then mud will form, converting the area to a " +
				"swamp for travel purposes."
    },
    {
        phenomenon: "Sun shower",
        precipitation: "x1/2",
        duration: "6-60 minutes",
        areaEffect: "Normal",
        movementRate: "Normal",
        effectOnVision: "No",
        effectOnIRVision: "No",
        effectOnTracking: "No",
        chanceOfGettingLost: "Normal",
        speed: "d20 mph",
		notes: "95% chance of a rainbow; see note under Precipitation Occurrence Table."
    },
    {
        phenomenon: "Tornado or cyclone",
        precipitation: "1 inch per hour",
        duration: "5-50 hours",
        areaEffect: "Normal",
        movementRate: "normal",
        effectOnVision: "x3/4",
        effectOnIRVision: "x3/4",
        effectOnTracking: "No",
        chanceOfGettingLost: "+40%",
        speed: "300 mph",
		notes: "10% chance party will be transported to the Ethereal Plane. Otherwise, treat " +
				"as a triple-strength hurricane for damage."
    },
    {
        phenomenon: "Oasis or mirage oasis",
        precipitation: "",
        duration: "Normal",
        areaEffect: "3-6 inch radius",
        movementRate: "Normal",
        effectOnVision: "No",
        effectOnIRVision: "No",
        effectOnTracking: "No",
        chanceOfGettingLost: "normal",
        speed: "d20 mph",
		notes: "If the oasis is real, roll d20. A result of 1 or 2 inches indicates that the " +
				"oasis is currently populated (determine population type via the Wilderness " +
				"Encounter Charts in the DMG), while a 20 indicates that the last visitor has " +
				"poisoned all the wells. If the oasis is a mirage, anyone who drinks must " +
				"save vs. spell or take d6 damage from swallowed sand."
    }
],
	
standardWeatherTable: [
    {
        name: "Blizzard, heavy",
        precipDice: "2d10+10",
        duration: "3d8",
        durationUnit: "hours",
        movement: "Foot: x1/8, Horse: x1/4, Cart: not allowed",
        NormVisionRng: "2 ft. radius",
		IRvisionRng: "No, can't see",
        tracking: "No",
        lostChance: "+50%",
        windSpeed: "6d8+40",
        minTemp: null,
        maxTemp: 10,
        notes: "Snowdrifts of up to 10 ft per hour may accumulate against buildings, walls, etc."
    },
    {
        name: "Blizzard",
        precipDice: "2d8+8",
        duration: "3d10",
        durationUnit: "hours",
        movement: "x1/4 (foot, horse, cart)",
        NormVisionRng: "10 ft radius",
		IRvisionRng: "x1/2",
        tracking: "Not allowed",
        lostChance: "+35%",
        windSpeed: "3d8+36",
        minTemp: null,
        maxTemp: 20,
        notes: "Snowdrifts of up to 5 ft per hour may accumulate against buildings, walls, etc."
    },
    {
        name: "Snowstorm, heavy",
        precipDice: "2d8+2",
        duration: "4d6",
        durationUnit: "hours",
        movement: "x1/4 (foot, horse, cart)",
        NormVisionRng: "x3/4",
		IRvisionRng: "x1/2",
        tracking: "-40%",
        lostChance: "+20%",
        windSpeed: "3d10",
        minTemp: null,
        maxTemp: 25,
        notes: "Drifts of 1 foot per hour if wind speed > 20 mph."
    },
    {
        name: "Snowstorm, light",
        precipDice: "1d8",
        duration: "2d6",
        durationUnit: "hours",
        movement: "x3/4 (foot, horse, cart)",
        NormVisionRng: "x3/4",
		IRvisionRng: "x3/4",
        tracking: "-25%",
        lostChance: "+10%",
        windSpeed: "4d6",
        minTemp: null,
        maxTemp: 35,
        notes: "Drifts of 1 foot per hour if wind speed > 20 mph."
    },
    {
        name: "Sleetstorm",
        precipDice: "1d2",
        duration: "1d6",
        durationUnit: "hours",
        movement: "x3/4 (foot, horse, cart)",
        NormVisionRng: "Normal",
		IRvisionRng: "3/4",
        tracking: "-10%",
        lostChance: "+5%",
        windSpeed: "3d10",
        minTemp: 20,
        maxTemp: 35
    },
    {
        name: "Hailstorm",
        precipDice: "1d2",
        duration: "1d4",
        durationUnit: "hours",
        movement: "Foot: x3/4, Horse: normal, Cart: normal",
        NormVisionRng: "2 ft. radius",
		IRvisionRng: "Normal",
        tracking: "-10%",
        lostChance: "+10%",
        windSpeed: "4d10",
        minTemp: 30,
        maxTemp: 65,
        notes: "Average hailstone diameter is 1/2 d4 inches. If stones are more than 1 inch in diameter, " +
               "assess 1 point of damage per 1/2 inch of diameter every turn for those AC6 or worse. Rings, " +
			   "bracers, etc., give no protection from this damage, but magic armor does."
    },
    {
        name: "Heavy Fog",
        precipDice: "None",
        duration: "1d12",
        durationUnit: "hours",
        movement: "Foot: x1/4, Horse: x1/4",
        NormVisionRng: "2 ft. radius",
		IRvisionRng: "x1/2",
        tracking: "-60%",
        lostChance: "+50%",
        windSpeed: "1d20",
        minTemp: 30,
        maxTemp: 60
    },
    {
        name: "Light Fog",
        precipDice: "None",
        duration: "2d4",
        durationUnit: "hours",
        movement: "Normal",
        NormVisionRng: "x1/4",
		IRvisionRng: "x3/4",
        tracking: "-30%",
        lostChance: "+30%",
        windSpeed: "1d10",
        minTemp: 25,
        maxTemp: 70
    },
    {
        name: "Mist",
        precipDice: "None",
        duration: "2d6",
        durationUnit: "hours",
        movement: "Normal",
        NormVisionRng: "Normal",
		IRvisionRng: "Normal",
        tracking: "-5%",
        lostChance: "Normal",
        windSpeed: "1d10"
    },
    {
        name: "Drizzle",
        precipDice: "1/4d4",
        duration: "1d10",
        durationUnit: "hours",
        movement: "Normal",
        NormVisionRng: "Normal",
		IRvisionRng: "Normal",
        tracking: "-1%/turn cumulative",
        lostChance: "Normal",
        windSpeed: "1d20"
    },
    {
        name: "Rainstorm, light",
        precipDice: "1d3",
        duration: "1d12",
        durationUnit: "hours",
        movement: "Normal",
        NormVisionRng: "Normal",
		IRvisionRng: "Normal",
        tracking: "-10%/hour* this differs from the PHB rules",
        lostChance: "+10% cumulative",
        windSpeed: "1d20",
        notes: "A drop in temperature to 30\u{B0}F or below after a storm may result in icy conditions, " +
				"affecting travel and dexterity."
    },
    {
        name: "Rainstorm, heavy",
        precipDice: "1d4+3",
        duration: "1d12",
        durationUnit: "hours",
        movement: "x3/4 (foot, horse, cart)",
        NormVisionRng: "x3/4",
		IRvisionRng: "x3/4",
        tracking: "-10%/turn* this differs from the PHB rules",
        lostChance: "+10% cumulative",
        windSpeed: "2d12+10",
        notes: "A drop in temperature to 30\u{B0}F or below after a storm may result in icy conditions, " +
				"affecting travel and dexterity."
    },
    {
        name: "Thunderstorm",
        precipDice: "1d8",
        duration: "1d4",
        durationUnit: "hours",
        movement: "x1/2 (foot, horse, cart)",
        NormVisionRng: "x3/4",
		IRvisionRng: "x3/4",
        tracking: "-10% per Turn",
        lostChance: "+10% (+30% if horsed)",
        windSpeed: "4d10",
        notes: "Lightning strikes occur once every 10 minutes with a 1% chance of hitting the party, increased " +
		"to 10% if sheltering under trees. Damage is 6d6, with a saving throw allowed for half damage. A drop in " +
		"temperature to 30\u{B0}F or below after a storm may result in icy conditions, affecting travel and dexterity."
    },
    {
        name: "Tropical Storm",
        precipDice: "1d6",
        duration: "1d3",
        durationUnit: "days",
        movement: "Foot: x1/4, Horse: x1/4, Cart:not allowed",
        NormVisionRng: "x1/2",
		IRvisionRng: "x1/2",
        tracking: "Not allowed",
        lostChance: "+30%",
        windSpeed: "3d12",
        notes: "Every 3 turns, there's a 10% chance of gust damage if wind speed exceeds 40 mph. Damage is 1d6 " +
				"for every 10 mph over 40 mph."
    },
    {
        name: "Monsoon",
        precipDice: "1d8",
        duration: "d6+6",
        durationUnit: "days",
        movement: "Foot: x1/4, Horse: x1/4, Cart: not allowed",
        NormVisionRng: "x1/4",
		IRvisionRng: "x1/4",
        tracking: "Not allowed",
        lostChance: "+30%",
        windSpeed: "6d10",
        notes: "Every 3 turns, there's a 10% chance of gust damage if wind speed exceeds 40 mph. Damage is 1d6 " +
				"for every 10 mph over 40 mph."
    },
    {
        name: "Gale",
        precipDice: "1d8",
        duration: "1d3",
        durationUnit: "days",
        movement: "Foot: x1/4, Horse: x1/4, Cart: not allowed",
        NormVisionRng: "x1/4",
		IRvisionRng: "x1/4",
        tracking: "Not allowed",
        lostChance: "+20%",
        windSpeed: "6d8+40",
        notes: "Every 3 turns, there's a 10% chance of gust damage if wind speed exceeds 40 mph. Damage is 1d6 " +
				"for every 10 mph over 40 mph."
    },
    {
        name: "Hurricane or typhoon",
        precipDice: "1d10",
        duration: "1d4",
        durationUnit: "days",
        movement: "Foot: x1/4, Horse: x1/4, Cart: not allowed",
        NormVisionRng: "x1/4",
		IRvisionRng: "x1/4",
        tracking: "Not allowed",
        lostChance: "+30%",
        windSpeed: "7d10+70",
        notes: "Unprotected creatures suffer 1d6 wind damage every 3 turns, and buildings take 1d4 " +
				"structural damage each turn."
    }
],

highWindsTable: [
    {
        minSpeed: 0,
        maxSpeed: 29,
        effects: {
            onLand: "No effect",
            atSea: "No effect",
            inAir: "No effect",
            inBattle: "No effect"
        }
    },
    {
        minSpeed: 30,
        maxSpeed: 44,
        effects: {
            onLand: "All travel slowed by 25%; torches will be blown out",
            atSea: "Sailing difficult; rowing impossible",
            inAir: "Creatures eagle-size and below can't fly",
            inBattle: "Missiles at 1/2 range and -1 to hit"
        }
    },
    {
        minSpeed: 45,
        maxSpeed: 59,
        effects: {
            onLand: "All travel slowed by 50%; torches and small fires will be blown out",
            atSea: "Minor ship damage (d4 structural points) may occur; wave height 3d6 ft.",
            inAir: "Man-sized creatures cannot fly",
            inBattle: "Missiles at 1/4 range and -3 to hit"
        }
    },
    {
        minSpeed: 60,
        maxSpeed: 74,
        effects: {
            onLand: "Small trees are uprooted; all travel slowed by 75%; roofs may be torn off; torches and medium-sized fires will be blown out.",
            atSea: "Ships are endangered (d10 structural damage) and blown off course; wave height d10+20 ft.",
            inAir: "No creatures can fly, except those from the Elemental Plane of Air",
            inBattle: "No missile fire permitted; all non-magical weapon attacks are -1 to hit; dexterity bonuses to AC cancelled"
        }
    },
    {
        minSpeed: 75,
        maxSpeed: 200,
        effects: {
            onLand: "Only strong stone buildings will be undamaged; travel is impossible; up to large trees are damaged or uprooted; roofs will be torn off; torches and large fires will be blown out.",
            atSea: "Ships are capsized and sunk; wave height d20+20 ft. or more",
            inAir: "No creatures can fly, except those from the Elemental Plane of Air",
            inBattle: "No missile fire permitted; all non-magical weapon attacks at -3 to hit; 20% chance per attack that any weapon will be torn from the wielder's grip by the wind; dexterity bonuses to AC cancelled"
        }
    }
],


baselineData: {
    "Needfest": { baseDailyTemp: 30, dailyHighAdj: "d10", dailyLowAdj: "-d20", chanceOfPrecip: 46, skyConditions: { clear: [1, 23], partlyCloudy: [24, 50], cloudy: [51, 100] }, sunrise: "7:10", sunset: "4:35" },
    "Fireseek": { baseDailyTemp: 32, dailyHighAdj: "d10", dailyLowAdj: "-d20", chanceOfPrecip: 46, skyConditions: { clear: [1, 23], partlyCloudy: [24, 50], cloudy: [51, 100] }, sunrise: "7:21", sunset: "5:01" },
    "Readying": { baseDailyTemp: 34, dailyHighAdj: "d6+4", dailyLowAdj: "-(d10+4)", chanceOfPrecip: 40, skyConditions: { clear: [1, 25], partlyCloudy: [26, 50], cloudy: [51, 100] }, sunrise: "6:55", sunset: "5:36" },
    "Growfest": { baseDailyTemp: 43, dailyHighAdj: "d8+4", dailyLowAdj: "-(d10+4)", chanceOfPrecip: 44, skyConditions: { clear: [1, 27], partlyCloudy: [28, 54], cloudy: [55, 100] }, sunrise: "5:50", sunset: "6:05" },
    "Coldeven": { baseDailyTemp: 42, dailyHighAdj: "d8+4", dailyLowAdj: "-(d10+4)", chanceOfPrecip: 44, skyConditions: { clear: [1, 27], partlyCloudy: [28, 54], cloudy: [55, 100] }, sunrise: "6:12", sunset: "6:09" },
    "Planting": { baseDailyTemp: 52, dailyHighAdj: "d10+6", dailyLowAdj: "-(d8+4)", chanceOfPrecip: 42, skyConditions: { clear: [1, 20], partlyCloudy: [21, 55], cloudy: [56, 100] }, sunrise: "5:24", sunset: "6:39" },
    "Flocktime": { baseDailyTemp: 63, dailyHighAdj: "d10+6", dailyLowAdj: "-(d10+6)", chanceOfPrecip: 42, skyConditions: { clear: [1, 20], partlyCloudy: [21, 53], cloudy: [54, 100] }, sunrise: "4:45", sunset: "7:10" },
    "Wealsun": { baseDailyTemp: 71, dailyHighAdj: "d8+8", dailyLowAdj: "-(d6+4)", chanceOfPrecip: 36, skyConditions: { clear: [1, 20], partlyCloudy: [21, 60], cloudy: [61, 100] }, sunrise: "4:32", sunset: "7:32" },
    "Richfest": { baseDailyTemp: 71, dailyHighAdj: "d8+8", dailyLowAdj: "-(d6+4)", chanceOfPrecip: 36, skyConditions: { clear: [1, 20], partlyCloudy: [21, 60], cloudy: [61, 100] }, sunrise: "4:20", sunset: "7:20" },
    "Reaping": { baseDailyTemp: 77, dailyHighAdj: "d6+4", dailyLowAdj: "-(d6+6)", chanceOfPrecip: 33, skyConditions: { clear: [1, 22], partlyCloudy: [23, 62], cloudy: [63, 100] }, sunrise: "4:45", sunset: "7:29" },
    "Goodmonth": { baseDailyTemp: 75, dailyHighAdj: "d4+6", dailyLowAdj: "-(d6+6)", chanceOfPrecip: 33, skyConditions: { clear: [1, 25], partlyCloudy: [26, 60], cloudy: [61, 100] }, sunrise: "5:13", sunset: "6:57" },
    "Harvester": { baseDailyTemp: 68, dailyHighAdj: "d8+6", dailyLowAdj: "-(d8+6)", chanceOfPrecip: 33, skyConditions: { clear: [1, 33], partlyCloudy: [34, 54], cloudy: [55, 100] }, sunrise: "5:42", sunset: "6:10" },
    "Brewfest": { baseDailyTemp: 68, dailyHighAdj: "d8+6", dailyLowAdj: "-(d8+6)", chanceOfPrecip: 33, skyConditions: { clear: [1, 33], partlyCloudy: [34, 54], cloudy: [55, 100] }, sunrise: "5:40", sunset: "5:49" },
    "Patchwall": { baseDailyTemp: 57, dailyHighAdj: "d10+5", dailyLowAdj: "-(d10+5)", chanceOfPrecip: 36, skyConditions: { clear: [1, 35], partlyCloudy: [36, 60], cloudy: [61, 100] }, sunrise: "6:12", sunset: "5:21" },
    "Ready'reat": { baseDailyTemp: 46, dailyHighAdj: "d10+6", dailyLowAdj: "-(d10+4)", chanceOfPrecip: 40, skyConditions: { clear: [1, 20], partlyCloudy: [21, 50], cloudy: [51, 100] }, sunrise: "6:46", sunset: "4:45" },
    "Sunsebb": { baseDailyTemp: 33, dailyHighAdj: "d8+5", dailyLowAdj: "-d20", chanceOfPrecip: 43, skyConditions: { clear: [1, 25], partlyCloudy: [26, 50], cloudy: [51, 100] }, sunrise: "7:19", sunset: "4:36" }
	},

precipitationTable: [
    { rollMin: 1, rollMax: 2, type: "Blizzard, heavy", tempMin: null, tempMax: 10, contChance: 5, rainbowChance: null, notAllowedIn: ["Desert"] },
    { rollMin: 3, rollMax: 5, type: "Blizzard", tempMin: null, tempMax: 20, contChance: 10, rainbowChance: null, notAllowedIn: ["Desert"] },
    { rollMin: 6, rollMax: 10, type: "Snowstorm, heavy", tempMin: null, tempMax: 25, contChance: 20, rainbowChance: null, notAllowedIn: [] },
    { rollMin: 11, rollMax: 20, type: "Snowstorm, light", tempMin: null, tempMax: 35, contChance: 25, rainbowChance: 1, notAllowedIn: [] },
    { rollMin: 21, rollMax: 25, type: "Sleetstorm", tempMin: null, tempMax: 35, contChance: 20, rainbowChance: null, notAllowedIn: [] },
    { rollMin: 26, rollMax: 27, type: "Hailstorm", tempMin: null, tempMax: 65, contChance: 10, rainbowChance: null, notAllowedIn: ["Desert", "Dust"] },
    { rollMin: 28, rollMax: 30, type: "Heavy Fog", tempMin: 32, tempMax: 60, contChance: 25, rainbowChance: 1, notAllowedIn: ["Desert", "Dust"] },
    { rollMin: 31, rollMax: 38, type: "Light Fog", tempMin: 32, tempMax: 70, contChance: 30, rainbowChance: 3, notAllowedIn: ["Desert"] },
    { rollMin: 39, rollMax: 40, type: "Mist", tempMin: 32, tempMax: null, contChance: 15, rainbowChance: 10, notAllowedIn: [] },
    { rollMin: 41, rollMax: 45, type: "Drizzle", tempMin: 32, tempMax: null, contChance: 20, rainbowChance: 5, notAllowedIn: [] },
    { rollMin: 46, rollMax: 60, type: "Rainstorm, light", tempMin: 32, tempMax: null, contChance: 45, rainbowChance: 15, notAllowedIn: [] },
    { rollMin: 61, rollMax: 70, type: "Rainstorm, heavy", tempMin: 32, tempMax: null, contChance: 30, rainbowChance: 20, notAllowedIn: [] },
    { rollMin: 71, rollMax: 84, type: "Thunderstorm", tempMin: 32, tempMax: null, contChance: 15, rainbowChance: 20, notAllowedIn: [] },
    { rollMin: 85, rollMax: 89, type: "Tropical Storm", tempMin: 75, tempMax: null, contChance: 20, rainbowChance: 10, notAllowedIn: ["Desert", "Plains"] },
    { rollMin: 90, rollMax: 94, type: "Monsoon", tempMin: 80, tempMax: null, contChance: 30, rainbowChance: 5, notAllowedIn: ["Desert", "Dust", "Plains"] },
    { rollMin: 95, rollMax: 97, type: "Gale", tempMin: 40, tempMax: null, contChance: 15, rainbowChance: 10, notAllowedIn: ["Desert"] },
    { rollMin: 98, rollMax: 99, type: "Hurricane or typhoon", tempMin: 80, tempMax: null, contChance: 20, rainbowChance: 5, notAllowedIn: ["Desert", "Dust"] },
    { rollMin: 100, rollMax: 100, type: "Special", tempMin: null, tempMax: null, contChance: 1, rainbowChance: null, notAllowedIn: [] }
	],
	
terrainEffects: {
    "Rough terrain or Hills": { precipAdj: 0, temperatureAdjustment: { day: 0, night: 0 }, windSpeedAdjustment: [5, -5], specialWeather: "01-80: Windstorm, 81-00: Earthquake", notes: "" },
    "Forest": { precipAdj: 0, temperatureAdjustment: { day: -5, night: -5 }, windSpeedAdjustment: -5, specialWeather: "01-80: Quicksand, 81-00: Earthquake", notes: "" },
    "Jungle": { precipAdj: 10, temperatureAdjustment: { day: 5, night: 5 }, windSpeedAdjustment: -10, specialWeather: "01-05: Volcano, 06-60: Rain forest downpour, 61-80: Quicksand, 81-00: Earthquake", notes: "" },
    "Swamp or marsh": { precipAdj: 5, temperatureAdjustment: { day: 5, night: 5 }, windSpeedAdjustment: -5, specialWeather: "01-25: Quicksand, 26-80: Sun shower, 81-00: Earthquake", notes: "In Cold Marshes, temperature adjustment is -5" },
    "Dust": { precipAdj: -25, temperatureAdjustment: { day: 10, night: -10 }, windSpeedAdjustment: 0, specialWeather: "01-40: Flash flood, 41-70: Dust storm, 71-85: Tornado, 86-00: Earthquake", notes: "No fog, gale, or hurricane permitted." },
    "Plains": { precipAdj: 0, temperatureAdjustment: { day: 0, night: 0 }, windSpeedAdjustment: 5, specialWeather: "01-50: Tornado, 51-00: Earthquake", notes: " No monsoon or tropical storm permitted" },
    "Desert": { precipAdj: -30, temperatureAdjustment: { day: 10, night: -10 }, windSpeedAdjustment: 5, specialWeather: "01-25: Flash flood, 26-50: Sandstorm, 51-65: Oasis, 66-85: Mirage oasis, 86-00: Earthquake", notes: "No fog, mist, " +
			"blizzard, monsoon, tropical storm, gale, or hurricane permitted." },
    "Mountains": { precipAdj: 0, temperatureAdjustment: { day: 0, night: 0 }, windSpeedAdjustment: 0, specialWeather: "01-20: Wind storm, 21-50: Rock avalanche, 51-75: Snow avalanche, 76-80: Volcano, 81-00: Earthquake", notes: "" },
    "Seacoast": { precipAdj: 5, temperatureAdjustment: { coldCurrent: -5, warmCurrent: 5 }, windSpeedAdjustment: 5, specialWeather: "01-80: Earthquake, 81-94: Tsunami, 95-00: Undersea volcano", notes: "Duration of fog and mist doubled." },
    "At sea": { precipAdj: 15, temperatureAdjustment: { coldCurrent: -10, warmCurrent: 5 }, windSpeedAdjustment: 10, specialWeather: "01-20: Tsunami, 21-40: Undersea volcano, 41-00: Undersea earthquake", notes: "Duration of fog and mist doubled." }
	},
	
windChillTable: {
    5: {35: 33, 30: 27, 25: 21, 20: 16, 15: 12, 10: 7, 5: 1, 0: "-6", "-5": "-11", "-10": "-15", "-15": "-20", "-20": "-22"},
    10: {35: 21, 30: 16, 25: 9, 20: 2, 15: "-2", 10: "-9", 5: "-15", 0: "-22", "-5": "-27", "-10": "-31", "-15": "-37", "-20": "-43"},
    15: {35: 16, 30: 11, 25: 1, 20: "-6", 15: "-11", 10: "-18", 5: "-25", 0: "-33", "-5": "-40", "-10": "-45", "-15": "-51", "-20": "-58"},
    20: {35: 12, 30: 3, 25: "-4", 20: "-9", 15: "-17", 10: "-24", 5: "-32", 0: "-40", "-5": "-46", "-10": "-52", "-15": "-58", "-20": "-64"},
    25: {35: 7, 30: 0, 25: "-7", 20: "-15", 15: "-22", 10: "-29", 5: "-37", 0: "-45", "-5": "-52", "-10": "-58", "-15": "-65", "-20": "-72"},
    30: {35: 5, 30: "-2", 25: "-11", 20: "-18", 15: "-26", 10: "-33", 5: "-41", 0: "-49", "-5": "-56", "-10": "-63", "-15": "-70", "-20": "-78"},
    35: {35: 3, 30: "-4", 25: "-13", 20: "-20", 15: "-27", 10: "-35", 5: "-43", 0: "-52", "-5": "-60", "-10": "-67", "-15": "-75", "-20": "-82"},
    40: {35: 1, 30: "-4", 25: "-15", 20: "-22", 15: "-29", 10: "-36", 5: "-45", 0: "-54", "-5": "-62", "-10": "-69", "-15": "-76", "-20": "-83"},
    45: {35: 1, 30: "-6", 25: "-17", 20: "-24", 15: "-31", 10: "-38", 5: "-46", 0: "-55", "-5": "-63", "-10": "-70", "-15": "-77", "-20": "-84"},
    50: {35: 0, 30: "-7", 25: "-17", 20: "-24", 15: "-31", 10: "-38", 5: "-47", 0: "-56", "-5": "-64", "-10": "-71", "-15": "-78", "-20": "-85"},
    55: {35: "-1", 30: "-8", 25: "-19", 20: "-25", 15: "-33", 10: "-39", 5: "-48", 0: "-57", "-5": "-65", "-10": "-72", "-15": "-79", "-20": "-86"},
    60: {35: "-3", 30: "-10", 25: "-21", 20: "-27", 15: "-34", 10: "-40", 5: "-49", 0: "-58", "-5": "-66", "-10": "-73", "-15": "-80", "-20": "-87"}
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS

// event.shiftKey
// event.altKey
// event.ctrlKey

document.addEventListener('keydown', function(event) {
    // Shift+G for 'G'enerate weather
    if (event.shiftKey && event.key === 'G') {
        console.log("Shift+G was pressed");
        //requestWeatherSettings();  // Call weather input function
        generateWeather();
    }

/*     // Example: Alt+G
    if (event.altKey && event.key === 'G') {
        console.log("Alt+G was pressed");
        anotherFunction();  // Another function to call
    }
 */
});

// Function to call when the weather button is clicked
Hooks.once('ready', function() {
    // Is Simple Calendar loaded?
    if (window.SimpleCalendar) {
        console.log("ver 1.0.6");
        console.error('Simple Calendar is available: adding side button for weather.');
        addSidebarButton();
    } else {
        console.error('Simple Calendar is not available.');
    }
});

function addSidebarButton() {
    SimpleCalendar.api.addSidebarButton(
        "Generate Weather",
        "fa-cloud-sun",
        "generate-weather-button",
        false,
        generateWeatherOnClick
    );
}

function generateWeatherOnClick(event) {
    console.error('Weather generation triggered.');
    // weather generation function here
    //generateWeather();
    //requestWeatherSettings();
    generateWeather();
    
}

function getAllUserIDs() {
    const userIds = game.users.contents.map(user => user.id);
    console.log("User IDs:", userIds);
    return userIds;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HOOKS INIT
Hooks.once('init', () => {
    game.settings.register('my-weather-module', 'useSimpleCalendar', {
        name: "Use Simple Calendar for Dates",
        hint: "Check this box to use Simple Calendar for date management instead of manual month selection.",
        scope: 'world',  // This setting is stored on a per-world basis.
        config: true,  // This setting provides a configuration UI.
        type: Boolean,
        default: false,
    });

    game.settings.register('adnd-greyhawk-weather', 'defaultMonth', {
        name: "Default Month",
        hint: "Set the default month if Simple Calendar is not used.",
        scope: 'world',
        config: true,
        type: String,
        choices: {
            "needfest": "Needfest",
            "fireseek": "Fireseek",
            "readying": "Readying",
            "coldeven": "Coldeven",
            "growfest": "Growfest",
            "planting": "Planting",
            "flocktime": "Flocktime",
            "wealsun":  "Wealsun",
            "richfest": "Richfest",
            "reaping":  "Reaping",
            "goodmonth": "Goodmonth",
            "harvester": "Harvester",
            "brewfest": "Brewfest",
            "patchwall": "Patchwall",
            "readyreat": "Readyreat",
            "sunsebb":  "Sunsebb"
            // Add other months as needed
        },
        default: "needfest",
    });

    game.settings.register('adnd-greyhawk-weather', 'defaultTerrain', {
        name: "Default Terrain",
        hint: "Select the default terrain type for weather conditions.",
        scope: 'world',
        config: true,
        type: String,
        choices: {
            "rough terrain or hills": "Rough terrain or hills",
            "forest": "Forest",
            "jungle": "Jungle",
            "swamp or march": "Swamp or marsh",
            "dust": "Dust",
            "plains": "Plains",
            "desert": "Desert",
            "mountains": "Mountains",
            "seacoast": "Seacoast",
            "at sea": "At sea",
            // Add other terrain types as needed
        },
        default: "plains",
    });
});

function applyWeatherSettings() {
    const useSimpleCalendar = game.settings.get('adnd-greyhawk-weather', 'useSimpleCalendar');
    const defaultMonth = game.settings.get('adnd-greyhawk-weather', 'defaultMonth');
    const defaultTerrain = game.settings.get('adnd-greyhawk-weather', 'defaultTerrain');

    console.log(`Using Simple Calendar: ${useSimpleCalendar}`);
    console.log(`Default Month: ${defaultMonth}`);
    console.log(`Default Terrain: ${defaultTerrain}`);
    // Use these settings to modify how weather is calculated or displayed
}

Hooks.on('renderSettingsConfig', (app, html, data) => {
    // You can use this to react to settings changes and update your module's behavior accordingly.
    if (game.settings.get('adnd-greyhawk-weather', 'useSimpleCalendar')) {
        // Hide or show elements based on this setting
        html.find('[name="defaultMonth"]').closest('.form-group').hide();
    } else {
        html.find('[name="defaultMonth"]').closest('.form-group').show();
    }
});

// Function to handle dice rolls
function rollDice(formula) {
    new Roll(formula).roll({async: false}).toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        flavor: "Rolling " + formula
    });
}

function calculateRelativeHumidity(tempFahrenheit) {
    // Helper function to convert Fahrenheit to Celsius
    function fahrenheitToCelsius(f) {
        return (f - 32) * 5 / 9;
    }

    // Convert temperature from Fahrenheit to Celsius
    let tempCelsius = fahrenheitToCelsius(tempFahrenheit);
    console.log(`Converted Temperature: ${tempCelsius}\u{B0}C from ${tempFahrenheit}\u{B0}F`);

    // Estimate dew point using a typical average relative humidity for simplicity
    let dewPointCelsius = tempCelsius - 10;
    console.log(`Estimated Dew Point: ${dewPointCelsius}\u{B0}C based on average conditions`);

    // Calculate the relative humidity using the Lawrence formula
    let relativeHumidity = 100 - 5 * (tempCelsius - dewPointCelsius);
    console.log(`Calculated Raw Relative Humidity: ${relativeHumidity}% before adjustment`);

    // Ensure humidity does not exceed 100% or fall below 0%
    relativeHumidity = Math.max(0, Math.min(100, relativeHumidity));
    console.log(`Adjusted Relative Humidity: ${relativeHumidity}% for display`);

    return relativeHumidity;
}

function updateWeatherDisplay() {
    let currentTempFahrenheit = GlobalWeatherConfig.dailyHighTemp;  // Use the module's temperature variable
    let humidityRealistic = calculateRelativeHumidity(currentTempFahrenheit);
    console.log(`Updated Weather Display with Current Temperature: ${currentTempFahrenheit}\u{B0}F and Calculated Humidity: ${humidityRealistic.toFixed(2)}%`);

    // Optionally update module's humidity display or store it in the config based on a flag
    GlobalWeatherConfig.humidityRealistic = humidityRealistic; // Save realistic humidity in global config
    if (document.getElementById('humidityDisplay')) { // Ensure element exists
        document.getElementById('humidityDisplay').textContent = `Humidity: ${humidityRealistic.toFixed(2)}%`;
        console.log(`Displayed Humidity on UI: ${humidityRealistic.toFixed(2)}%`);
    } else {
        console.log("Humidity display element not found, cannot update UI.");
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STEP 1: DETERMINE TEMPERATURE FUNCTIONS
/* function calculateInitialDailyTemperatures() {
    const monthData = GlobalWeatherConfig.baselineData[GlobalWeatherConfig.month];
    console.log(`Base temperature for month ${GlobalWeatherConfig.month}: ${monthData.baseDailyTemp}\u{B0}F`, "color: green; font-weight: bold");
	
	// set global temp variable
	GlobalWeatherConfig.baseDailyTemp = monthData.baseDailyTemp;

    let dailyHigh = monthData.baseDailyTemp + evalDice(monthData.dailyHighAdj);
    let dailyLow = monthData.baseDailyTemp + evalDice(monthData.dailyLowAdj);
    console.log(`%cInitial high w/daily adjustment: ${dailyHigh}\u{B0}F, initial low w/daily adjustment: ${dailyLow}\u{B0}F`, "color: blue");

    // Store initial temperatures
    GlobalWeatherConfig.dailyHighTemp = dailyHigh;
    GlobalWeatherConfig.dailyLowTemp = dailyLow;
	
	// Latitude adjustment
    const latitudeAdjustment = (40 - GlobalWeatherConfig.latitude) * 2;
    console.log(`pplying latitude adjustment: ${latitudeAdjustment}\u{B0}F`, "color: purple; font-weight: bold");
    GlobalWeatherConfig.dailyHighTemp += latitudeAdjustment;
    GlobalWeatherConfig.dailyLowTemp += latitudeAdjustment;
    console.log(`%cTemperatures after latitude adjustment - High: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F, Low: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: purple");
	GlobalWeatherConfig.latitudeTempAdj = latitudeAdjustment;

    // Altitude adjustment
    const altitudeAdjustment = -Math.floor(GlobalWeatherConfig.altitude / 1000) * 3;
    console.log(`pplying altitude adjustment: ${altitudeAdjustment}\u{B0}F`, "color: green");
    GlobalWeatherConfig.dailyHighTemp += altitudeAdjustment;
    GlobalWeatherConfig.dailyLowTemp += altitudeAdjustment;
    console.log(`%cTemperatures after altitude adjustment - High: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F, Low: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: green");

    console.log(`inal temperatures after all adjustments - High: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F, Low: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: orange; font-weight: bold");
	
	GlobalWeatherConfig.altitudeTempAdj = altitudeAdjustment;

    // Apply extremes after calculating the initial values
    //applyTemperatureExtremes();
} */
// new version
function calculateInitialDailyTemperatures(month, latitude, altitude, terrain) {
    const monthData = GlobalWeatherConfig.baselineData[month];
    console.log(`Base temperature for month ${month}: ${monthData.baseDailyTemp}\u{B0}F`, "color: green; font-weight: bold");

    // Calculate terrain adjustments
    const terrainAdjustment = GlobalWeatherConfig.terrainEffects[terrain]?.temperatureAdjustment || {day: 0, night: 0};

    // Calculate initial temperatures with terrain adjustment
    let dailyHigh = monthData.baseDailyTemp + evalDice(monthData.dailyHighAdj) + terrainAdjustment.day;
    let dailyLow = monthData.baseDailyTemp + evalDice(monthData.dailyLowAdj) + terrainAdjustment.night;
    console.log(`Initial high w/daily adjustment: ${dailyHigh}\u{B0}F, initial low w/daily adjustment: ${dailyLow}\u{B0}F`, "color: blue");

    // Apply latitude adjustment
    const latitudeAdjustment = (40 - latitude) * 2;
    console.log(`Applying latitude adjustment: ${latitudeAdjustment}\u{B0}F`, "color: purple; font-weight: bold");
    dailyHigh += latitudeAdjustment;
    dailyLow += latitudeAdjustment;

    // Apply altitude adjustment
    const altitudeAdjustment = -Math.floor(altitude / 1000) * 3;
    console.log(`Applying altitude adjustment: ${altitudeAdjustment}\u{B0}F`, "color: green");
    dailyHigh += altitudeAdjustment;
    dailyLow += altitudeAdjustment;

    console.log(`Final temperatures after all adjustments - High: ${dailyHigh}\u{B0}F, Low: ${dailyLow}\u{B0}F`, "color: orange; font-weight: bold");

    return { highTemp: dailyHigh, lowTemp: dailyLow };
}


/* function applyTemperatureExtremes() {
    const monthData = GlobalWeatherConfig.baselineData[GlobalWeatherConfig.month];
    console.log(`pplying extremes for ${GlobalWeatherConfig.month}`, "color: green; font-weight: bold");

    const maxHighAdjustment = evalDice(monthData.dailyHighAdj, true);
    const maxLowAdjustment = evalDice(monthData.dailyLowAdj, true);
    const roll = Math.floor(Math.random() * 100) + 1;

    console.log(`%cTemperature extremes roll: ${roll}`, "color: red; font-weight: bold");
    console.log(`Max high adjustment: ${maxHighAdjustment}, Max low adjustment: ${maxLowAdjustment}`);

    let adjustmentFactor = 0;
    let recordType = 'none';

    if (roll === 1) {
        adjustmentFactor = -3 * maxLowAdjustment;
        recordType = 'extreme low';
		//console.log(`%cRecord low - extreme! Adjustment is -3x dailyTempAdj: ${adjustmentFactor}\u{B0}F`, "color: blue; font-weight: bold");
		console.log(`%cRecord low - Extreme! Daily temp adjustment is -x3 = : ${adjustmentFactor}\u{B0}F`, "color: blue; font-weight: bold");
    } else if (roll === 2) {
        adjustmentFactor = -2 * maxLowAdjustment;
        recordType = 'severe low';
		//console.log(`%cRecord low - severe! Adjustment is -2x dailyTempAdj: ${adjustmentFactor}\u{B0}F`, "color: blue; font-weight: bold");
		console.log(`%cRecord low - Severe! Daily temp adjustment is -x2 = : ${adjustmentFactor}\u{B0}F`, "color: blue; font-weight: bold");
    } else if (roll <= 4) {
        adjustmentFactor = -maxLowAdjustment;
        recordType = 'low';
		//console.log(`%cRecord low! Adjustment is -1x dailyTempAdj: ${adjustmentFactor}\u{B0}F`, "color: blue; font-weight: bold");
		console.log(`%cRecord low! Daily temp adjustment is x1 = : ${adjustmentFactor}\u{B0}F`, "color: blue; font-weight: bold");
    } else if (roll <= 96) {
        // Normal temperatures, no adjustment
		console.log("%cNormal temperatures, no adjustment needed.", "color: grey");
    } else if (roll <= 98) {
        adjustmentFactor = maxHighAdjustment;
        recordType = 'high';
		//console.log(`%cRecord high! Adjustment is +1x dailyTempAdj: ${adjustmentFactor}\u{B0}F`, "color: red; font-weight: bold");
		console.log(`%cRecord high! Daily temp adjustment is x1 = : ${adjustmentFactor}\u{B0}F`, "color: red; font-weight: bold");
    } else if (roll === 99) {
        adjustmentFactor = 2 * maxHighAdjustment;
        recordType = 'severe high';
		//console.log(`%cRecord high - severe! Adjustment is +2x dailyTempAdj: ${adjustmentFactor}\u{B0}F`, "color: red; font-weight: bold");
		console.log(`%cRecord high - Severe! Daily temp adjustment is x2 = : ${adjustmentFactor}\u{B0}F`, "color: red; font-weight: bold");
    } else {
        adjustmentFactor = 3 * maxHighAdjustment;
        recordType = 'extreme high';
		//console.log(`%cRecord high - extreme! Adjustment is +3x dailyTempAdj: ${adjustmentFactor}\u{B0}F`, "color: red; font-weight: bold");
		console.log(`%cRecord high - Extreme! Daily temp adjustment is x3 = : ${adjustmentFactor}\u{B0}F`, "color: red; font-weight: bold");
    }
	
	console.log(`%cRecord Type: ${recordType}, Adjustment Factor: ${adjustmentFactor}`, "color: blue; font-weight: bold");
	
    // Apply adjustments to the base daily temperatures
    if (recordType.includes("low")) {
        GlobalWeatherConfig.dailyLowTemp = monthData.baseDailyTemp + adjustmentFactor;
    } else if (recordType.includes("high")) {
        GlobalWeatherConfig.dailyHighTemp = monthData.baseDailyTemp + adjustmentFactor;
    }

    console.log(`Adjusted temperatures - High: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F, Low: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`);

    finalizeTemperatureAdjustments(recordType, adjustmentFactor);
	
	// Set global flags and record duration
    GlobalWeatherConfig.recordTemperatureType = recordType;
    GlobalWeatherConfig.tempRecordDuration = determineTemperatureDuration();
} */

/* function determineTemperatureDuration() {
    const roll = Math.floor(Math.random() * 20) + 1; // Roll d20
    let duration; // Initialize variable to hold the duration based on the roll

    if (roll === 1) duration = 1;
    else if (roll <= 3) duration = 2;
    else if (roll <= 10) duration = 3;
    else if (roll <= 14) duration = 4;
    else if (roll <= 17) duration = 5;
    else if (roll <= 19) duration = 6;
    else duration = 7; // roll === 20

    console.log(`Duration roll for extreme temperature: ${roll}, resulting in ${duration} days`);
    GlobalWeatherConfig.tempRecordDuration = duration; // Store the duration in global config
    return duration;
} */

/* function finalizeTemperatureAdjustments(recordType, adjustmentFactor) {
    console.log(`pplying record temperature adjustment: Type=${recordType}, Factor=${adjustmentFactor}\u{B0}F`, "color: blue; font-weight: bold");

    if (recordType.includes("low")) {
        // For low records, the adjustment should decrease the temperature
        console.log(`efore low temp adjustment: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: grey");
        // Since adjustmentFactor is positive for a 'low' (e.g., 14 when it should be -14), we need to subtract it
        GlobalWeatherConfig.dailyLowTemp -= Math.abs(adjustmentFactor);
        console.log(`fter low temp adjustment: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: grey");
    } else if (recordType.includes("high")) {
        // For high records, the adjustment should increase the temperature
        console.log(`efore high temp adjustment: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F`, "color: grey");
        GlobalWeatherConfig.dailyHighTemp += adjustmentFactor;
        console.log(`fter high temp adjustment: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F`, "color: grey");
    }
    // Latitude adjustment
    const latitudeAdjustment = (40 - GlobalWeatherConfig.latitude) * 2;
    console.log(`pplying latitude adjustment: ${latitudeAdjustment}\u{B0}F`, "color: purple; font-weight: bold");
    GlobalWeatherConfig.dailyHighTemp += latitudeAdjustment;
    GlobalWeatherConfig.dailyLowTemp += latitudeAdjustment;
    console.log(`%cTemperatures after latitude adjustment - High: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F, Low: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: purple");
	GlobalWeatherConfig.latitudeTempAdj = latitudeAdjustment;

    // Altitude adjustment
    const altitudeAdjustment = -Math.floor(GlobalWeatherConfig.altitude / 1000) * 3;
    console.log(`pplying altitude adjustment: ${altitudeAdjustment}\u{B0}F`, "color: green");
    GlobalWeatherConfig.dailyHighTemp += altitudeAdjustment;
    GlobalWeatherConfig.dailyLowTemp += altitudeAdjustment;
    console.log(`%cTemperatures after altitude adjustment - High: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F, Low: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: green");

    console.log(`inal temperatures after all adjustments - High: ${GlobalWeatherConfig.dailyHighTemp}\u{B0}F, Low: ${GlobalWeatherConfig.dailyLowTemp}\u{B0}F`, "color: orange; font-weight: bold");
	
	GlobalWeatherConfig.altitudeTempAdj = altitudeAdjustment;
}
 */
 
function evalDice(diceExpression, returnMax = false) {
    if (!diceExpression || diceExpression.trim() === "None") {
        console.log("No dice expression provided or expression is 'None'.");
        return 0; // Handle cases where no dice roll is required or input is "None"
    }

    let result = 0;
    let negative = diceExpression.startsWith('-'); // Check for a negative sign at the beginning
    if (negative) {
        diceExpression = diceExpression.substring(1); // Remove the negative sign for easier parsing
    }

    // Attempt to parse fractional dice rolls first, e.g., "1/2d6"
    const fractionRegex = /(\d+)\/(\d+)d(\d+)/i;
    const fractionParts = diceExpression.match(fractionRegex);
    if (fractionParts) {
        const numerator = parseInt(fractionParts[1], 10);
        const denominator = parseInt(fractionParts[2], 10);
        const diceSides = parseInt(fractionParts[3], 10);
        if (returnMax) {
            // Return the adjusted maximum roll for fractional dice if returnMax is true
            result = Math.floor((numerator / denominator) * diceSides);
            console.log(`Maximum fractional result for ${numerator}/${denominator}d${diceSides} = ${result}`);
        } else {
            const diceRoll = Math.floor(Math.random() * diceSides) + 1;
            result = Math.floor((numerator / denominator) * diceRoll);
            console.log(`Rolling fractional dice ${numerator}/${denominator}d${diceSides}, single roll = ${diceRoll}, adjusted result = ${result}`);
        }
    } else {
        // Regular expression to parse standard dice notation, e.g., "1d6+2" or "d20"
        const regex = /(\d+)?d(\d+)([+-]?\d+)?/i;
        const parts = diceExpression.match(regex);
        if (parts) {
            const count = parseInt(parts[1] || 1, 10); // Default to 1 if no multiplier, e.g., "d20" is equivalent to "1d20"
            const sides = parseInt(parts[2], 10);
            const modifier = parseInt(parts[3] || 0, 10);

            if (returnMax) {
                // Calculate the maximum roll possible if returnMax is true
                result = count * sides + modifier;
                console.log(`Maximum result for ${count}d${sides} + ${modifier} = ${result}`);
            } else {
                // Roll each die and sum the results if returnMax is false
                for (let i = 0; i < count; i++) {
                    result += Math.floor(Math.random() * sides) + 1;
                }
                result += modifier;
                console.log(`Rolling ${count}d${sides} + ${modifier}, result = ${result}`);
            }
        } else {
            // Directly parse numbers or expressions not matching dice patterns
            result = parseInt(diceExpression, 10) || 0;
            console.log(`Expression is a direct number or unsupported format: ${diceExpression}, parsed result = ${result}`);
        }
    }

    if (negative) {
        result = -result; // Reapply negative if originally negative
        console.log(`Applying negative modifier, final result = ${result}`);
    }
    return result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STEP 2: DETERMINE SKY CONDITIONS
function determineSkyConditions(month) {
    const roll = Math.floor(Math.random() * 100) + 1;
    const d20roll = Math.floor(Math.random() * 20);
    const monthData = GlobalWeatherConfig.baselineData[month];
    const { clear, partlyCloudy, cloudy } = monthData.skyConditions;

    let skyCondition;
    if (roll <= clear[1]) skyCondition = "Clear";
    else if (roll <= partlyCloudy[1]) skyCondition = "Partly cloudy";
    else skyCondition = "Cloudy";

    //console.log(`Sky condition for ${month}: ${skyCondition}`);
    //console.log(`Initial wind speed set to: ${d20roll} mph`);

    return { skyCondition };
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* // STEP 3: DETERMINE PRECIPITATION FUNCTIONS
function checkForPrecipitation() {
    const monthData = GlobalWeatherConfig.baselineData[GlobalWeatherConfig.month];
    const terrainEffect = GlobalWeatherConfig.terrainEffects[GlobalWeatherConfig.terrain];
    const rollForPrecip = Math.floor(Math.random() * 100) + 1;
    const precipChance = monthData.chanceOfPrecip + (terrainEffect.precipAdj || 0);

    console.log("Precipitation roll: ", rollForPrecip, "vs. precip chance: ", precipChance);

    if (rollForPrecip <= precipChance) {
        return true;
    } else {
        GlobalWeatherConfig.precipType = "None";
        console.log("No precipitation today. Using initial wind speed:", GlobalWeatherConfig.windSpeed);
        return false;
    }
}
 */
// new version
// STEP 3: DETERMINE PRECIPITATION FUNCTIONS
function checkForPrecipitation(month, terrain) {
    const monthData = GlobalWeatherConfig.baselineData[month];
    const terrainEffect = GlobalWeatherConfig.terrainEffects[terrain];
    const rollForPrecip = Math.floor(Math.random() * 100) + 1;
    const precipChance = monthData.chanceOfPrecip + (terrainEffect.precipAdj || 0);

    console.log("Precipitation roll: ", rollForPrecip, "vs. precip chance: ", precipChance);

    if (rollForPrecip <= precipChance) {
        return true;
    } else {
        GlobalWeatherConfig.precipType = "None";
        console.log("No precipitation today. Using initial wind speed:", GlobalWeatherConfig.windSpeed);
        return false;
    }
}


// New function to reroll and adjust wind speed based on terrain
function rerollAndAdjustWindSpeed() {
    const windSpeedRoll = evalDice("d20"); // Assume d20 is a placeholder for your wind speed dice roll
    const terrainAdjustment = GlobalWeatherConfig.terrainEffects[GlobalWeatherConfig.terrain].windSpeedAdjustment || 0;
    GlobalWeatherConfig.windSpeed = Math.max(0, windSpeedRoll + terrainAdjustment); // Prevent negative wind speeds
    //console.log(`Wind speed after reroll and adjustment: ${GlobalWeatherConfig.windSpeed} mph`);
	console.log(`rerollAndAdjustWindSpeed(): Wind speed after reroll and adjustment: ${GlobalWeatherConfig.windSpeed} mph`);
}


function calculateWindSpeed() {
    // Roll for base wind speed (typically a d20 roll)
    const windBaseSpeed = Math.floor(Math.random() * 20) + 1;
    console.log(`Initial wind speed roll (d20), windBaseSpeed set to: ${windBaseSpeed} mph`);

    // Retrieve the wind speed adjustment from the terrain configuration
    const terrainAdjustment = GlobalWeatherConfig.terrainEffects[GlobalWeatherConfig.terrain].windSpeedAdjustment || 0;
    const altitudeAdjustment = calculateAltitudeAdjustment(GlobalWeatherConfig.altitude, GlobalWeatherConfig.terrain);

    // Check if the terrain adjustment is an array and randomly pick one if so
    let finalAdjustment = terrainAdjustment;
    if (Array.isArray(terrainAdjustment)) {
        finalAdjustment = terrainAdjustment[Math.floor(Math.random() * terrainAdjustment.length)];
    }

    console.log(`Wind speed adjustment due to terrain (${GlobalWeatherConfig.terrain}): ${finalAdjustment}`);
    console.log(`Additional altitude-based adjustment for wind speed: ${altitudeAdjustment} mph`);

    // Apply the chosen terrain adjustment and the altitude-based adjustment to the base wind speed
    GlobalWeatherConfig.windSpeedInitial = windBaseSpeed;
    GlobalWeatherConfig.windSpeed = windBaseSpeed + finalAdjustment + altitudeAdjustment;
    const windSpeedAdjByTerrain = GlobalWeatherConfig.windSpeed;
    console.error(`calculateWindSpeed() is setting Total wind speed after adjustment: ${GlobalWeatherConfig.windSpeed} mph`);
    return windSpeedAdjByTerrain;
}

function calculateAltitudeAdjustment(altitude, terrain) {
    // Check if the terrain is 'Mountains' and adjust the wind speed based on altitude
    if (terrain === "Mountains") {
        const elevationFactor = Math.floor(altitude / 1000); // Divide altitude by 1000 and floor it to get increments of 1000 feet
        return 5 * elevationFactor; // Return additional wind speed of +5 mph per 1000 feet
    }
    return 0; // No adjustment if not in the Mountains
}

function adjustTemperatureForWindChill() {
    // Implement wind chill calculation here, modify temperatures based on wind speed and current temperature
}


/* function determinePrecipitationType(attempt = 1) {
    const roll = Math.floor(Math.random() * 100) + 1;
    console.log('%c%s%c: Rolled for precipitation type: %d', 'color: orange; font-weight: bold;', 'determinePrecipitationType', 'color: initial;', roll);

    let exclusionReasons = [];

    if (roll === 100) {
        console.log("Rolled 100, special weather effects will be applied.");
        applySpecialWeatherEffects();  // Handle special weather that might also affect wind speed
        return GlobalWeatherConfig.specialWeatherType; // Assuming this sets a type in GlobalWeatherConfig
    }

    let matchedType = null;
    for (const type of GlobalWeatherConfig.precipitationTable) {
        if (roll >= type.rollMin && roll <= type.rollMax) {
            if (type.notAllowedIn.includes(GlobalWeatherConfig.terrain)) {
                const reason = `Excluding type ${type.type} due to terrain restrictions (${GlobalWeatherConfig.terrain}).`;
                console.log(reason);
                exclusionReasons.push(reason);
                continue;
            }
            if ((type.tempMin !== null && GlobalWeatherConfig.dailyHighTemp < type.tempMin) ||
                (type.tempMax !== null && GlobalWeatherConfig.dailyHighTemp > type.tempMax)) {
                const reason = `Excluding type ${type.type} due to temperature constraints (current: ${GlobalWeatherConfig.dailyHighTemp}°F, required: ${type.tempMin || "null"} - ${type.tempMax || "null"} °F).`;
                console.log(reason);
                exclusionReasons.push(reason);
                continue;
            }
            matchedType = type;
            break;
        }
    }

    if (matchedType) {
        console.log(`Precipitation type determined: ${matchedType.type}`);
        GlobalWeatherConfig.precipType = matchedType;  // Set the entire object to precipType
        applyWeatherEffects(matchedType);  // Call to apply effects now that we have a matched type
        //adjustWindSpeedForPrecipitationType(matchedType); // Adjust wind speed according to the matched type
        return matchedType;  // Return the entire matched object
    } else {
        console.log("No precipitation type matches the conditions on attempt", attempt, ".");
        if (attempt < 2) { // Allow only one re-roll to avoid infinite loops
            console.log("Re-rolling for precipitation type due to exclusions.");
            return determinePrecipitationType(attempt + 1);
        } else {
            console.log("Final attempt also did not find a valid precipitation type. No precipitation today.");
            //GlobalWeatherConfig.precipType = null;  // Use null for clarity when no type is found
            GlobalWeatherConfig.precipType = "none";  // Use none for clarity when no type is found
            //return null;
            return "none";
        }
    }
} */

// new version
function determinePrecipitationType(terrain, currentHighTemp) {
    const roll = Math.floor(Math.random() * 100) + 1;
    console.log(`Rolled for precipitation type: ${roll}`);

    let attempts = 0;
    let matchedType = null;

    while (attempts < 2) {
        for (const type of GlobalWeatherConfig.precipitationTable) {
            if (roll >= type.rollMin && roll <= type.rollMax) {
                if (type.notAllowedIn.includes(terrain)) {
                    console.log(`Excluding type ${type.type} due to terrain restrictions (${terrain}).`);
                    continue;
                }
                if ((type.tempMin !== null && currentHighTemp < type.tempMin) ||
                    (type.tempMax !== null && currentHighTemp > type.tempMax)) {
                    console.log(`Excluding type ${type.type} due to temperature constraints (current: ${currentHighTemp}°F, required: ${type.tempMin || "null"} to ${type.tempMax || "null"}°F).`);
                    continue;
                }
                matchedType = type;
                break;
            }
        }

        if (matchedType) {
            console.log(`Precipitation type determined: ${matchedType.type}`);
            return matchedType;  // Return the matched type object
        } else {
            console.log("No valid precipitation type found, rechecking...");
            attempts++;
        }
    }

    console.log("No valid precipitation type found after retries. No precipitation today.");
    return { type: "none" };  // Return a consistent object type
}

// Usage of this function
//let precipType = determinePrecipitationType(settings.terrain, weatherData.temperature.high);
//if (precipType.type !== "none") {
//    applyWeatherEffects(precipType);
//    GlobalWeatherConfig.precipType = precipType;  // Set the global state outside the function
//}


function adjustWindSpeedForPrecipitationType(precipType) {
    const weatherEntry = GlobalWeatherConfig.standardWeatherTable.find(item => item.name === precipType.type);
    if (weatherEntry && weatherEntry.windSpeed) {
        console.log(`Adjusting wind speed for weather type: ${precipType.type}, formula: ${weatherEntry.windSpeed}`);
        // Use the evalDice function to calculate wind speed adjustment based on the formula
        const windSpeedAdjustment = evalDice(weatherEntry.windSpeed);
        calculateWindSpeed(windSpeedAdjustment);
    } else {
        console.log(`No wind speed adjustment formula found for ${precipType.type}. Using default wind speed settings.`);
        calculateWindSpeed(0); // Call with default or no adjustment
    }
}

// High Winds Table
function getEffectsByWindSpeed(windSpeed) {
    for (let effect of windEffects) {
        let range = effect.windSpeedRange.split(" ")[0].split("-");
        let minSpeed = parseInt(range[0]);
        let maxSpeed = parseInt(range[1] || range[0]); // Handles open-ended ranges like "75+"

        if (windSpeed >= minSpeed && windSpeed <= maxSpeed) {
            console.log(`Effects for ${windSpeed} mph:`, effect.effects);
            return effect.effects;
        }
    }
    return "No specific effects for this wind speed.";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STEP 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function determineSpecialWeather() {
    const specialWeatherRoll = Math.floor(Math.random() * 100) + 1; // Determine which special weather phenomenon occurs
    const specialWeathers = GlobalWeatherConfig.terrainEffects[GlobalWeatherConfig.terrain].specialWeather.split(', ').map(sw => sw.split(': '));
    const foundWeather = specialWeathers.find(sw => parseInt(sw[0].split('-')[0]) <= specialWeatherRoll && specialWeatherRoll <= parseInt(sw[0].split('-')[1]));
    if (foundWeather) {
        GlobalWeatherConfig.specialWeatherEvent = foundWeather[1];
        console.log(`Special Weather Event: ${foundWeather[1]}`);
        applyWeatherEffects(foundWeather[1]);  // Apply effects from special weather
    } else {
        console.log("No special weather event triggered.");
    }
}

/* function applyWeatherEffects(weatherType) {
    const weatherTypeName = weatherType.type;
    console.log(`Applying weather effects for type: ${weatherTypeName}`);

    if (!weatherTypeName) {
        console.log("No specific weather effect found. Default effects will be applied.");
        GlobalWeatherConfig.windSpeed = Math.max(GlobalWeatherConfig.windSpeedInitial, 0);
        console.log(`Default effects applied. Preserving initial wind speed: ${GlobalWeatherConfig.windSpeed} mph`);
        return;
    }

    GlobalWeatherConfig.initialWeatherEvent = weatherTypeName;
    console.log(`GlobalWeatherConfig.initialWeatherEvent set to: ${weatherTypeName}`);

    // Find the matching weather details from the standardWeatherTable using the type
    const standardWeatherDetails = GlobalWeatherConfig.standardWeatherTable.find(item => item.name === weatherTypeName);
    if (standardWeatherDetails && standardWeatherDetails.windSpeed) {
        const adjustedWindSpeed = evalDice(standardWeatherDetails.windSpeed);
        const terrainAdjustment = GlobalWeatherConfig.terrainEffects[GlobalWeatherConfig.terrain].windSpeedAdjustment || 0;
        const altitudeAdjustment = calculateAltitudeAdjustment(GlobalWeatherConfig.altitude, GlobalWeatherConfig.terrain); // Apply altitude adjustment if in mountains
        const totalAdjustment = adjustedWindSpeed + terrainAdjustment + altitudeAdjustment;

        GlobalWeatherConfig.windSpeed = Math.max(totalAdjustment, 0);
        console.log(`Wind speed changed due to weather: ${weatherTypeName}, new wind speed: ${GlobalWeatherConfig.windSpeed} mph`);
    } else {
        console.log("No specific wind speed formula found. Using initial settings.");
        GlobalWeatherConfig.windSpeed = Math.max(GlobalWeatherConfig.windSpeedInitial, 0);
    }

    // Determine duration and precipitation if available in the weatherType object
    if (weatherType.duration && weatherType.precipDice) {
        const duration = evalDice(weatherType.duration);
        const durationUnit = weatherType.durationUnit || "hours";
        let totalPrecipitation = evalDice(weatherType.precipDice);

        if (durationUnit === "days") {
            totalPrecipitation *= duration; // Total precipitation for all days
        }

        GlobalWeatherConfig.precipAmount = totalPrecipitation;
        GlobalWeatherConfig.initialWeatherEventDuration = `${duration} ${durationUnit}`;
        console.log(`Total Inches of Precipitation: ${totalPrecipitation} over ${duration} ${durationUnit}`);
        console.log(`Effects: ${weatherTypeName}, Duration: ${duration} ${durationUnit}`);
    } else {
        console.log("Duration and precipitation details are missing for the current weather type.");
    }
} */
// new version
function applyWeatherEffects(weatherType, standardWeatherTable, terrainEffects) {
    const weatherTypeName = weatherType.type;
    console.log(`Applying weather effects for type: ${weatherTypeName}`);

    if (!weatherTypeName) {
        console.log("No specific weather effect found. Default effects will be applied.");
        return {
            windSpeed: 0, // Default wind speed if undefined
            precipitationAmount: 0,
            precipitationDuration: "0 hours"
        };
    }

    // Find the matching weather details from the standardWeatherTable using the type
    const weatherDetails = standardWeatherTable.find(item => item.name === weatherTypeName) || {};
    console.log("Weather details found:", weatherDetails);

    // Calculate wind speed including terrain adjustments
    const adjustedWindSpeed = evalDice(weatherDetails.windSpeed || "0");
    const terrainAdjustment = (terrainEffects[weatherType.terrain] && terrainEffects[weatherType.terrain].windSpeedAdjustment) || 0;

    const totalWindSpeed = Math.max(adjustedWindSpeed + terrainAdjustment, 0);
    console.log(`Wind speed adjusted for ${weatherTypeName}: ${totalWindSpeed} mph`);

    // Determine duration and precipitation if available
    let precipitationAmount = 0;
    let precipitationDuration = "0 hours";
    if (weatherDetails.precipDice) {
        precipitationAmount = evalDice(weatherDetails.precipDice);
        precipitationDuration = evalDice(weatherDetails.duration) + " " + (weatherDetails.durationUnit || "hours");
        console.log(`Precipitation for ${weatherTypeName}: ${precipitationAmount} over ${precipitationDuration}`);
    }

    return {
        windSpeed: totalWindSpeed,
        precipitationAmount: precipitationAmount,
        precipitationDuration: precipitationDuration
    };
}



function precipChanceOfContinuing(weatherEffect) {
    // More detailed logging to debug the issue
    console.log("precipChanceOfContinuing received weatherEffect, defined as: ", weatherEffect);
    if (!weatherEffect) {
        console.log("No weather effect provided to check continuation.");
        return;
    }

    if (typeof weatherEffect.contChance !== "number") {
        console.log(`Continuation chance is not properly defined for the weather type: ${weatherEffect.type}. Expected a number, got ${typeof weatherEffect.contChance}`);
        return;
    }

    // Roll percentile to see if weather continues
    const continuationRoll = Math.floor(Math.random() * 100) + 1;
    console.log("d100 roll for precip continuing = ", continuationRoll, " vs. weather chance of ", weatherEffect.contChance);

    if (continuationRoll <= weatherEffect.contChance) {
        // Weather continues, set global flag to TRUE and now determine if the type changes
        GlobalWeatherConfig.flags.precipContinues = true;
        console.log("precip continues flag set to: ", GlobalWeatherConfig.flags.precipContinues);
        console.log(`%cPrecipitation continues!`, "font-weight: bold");
        const changeTypeRoll = Math.floor(Math.random() * 10) + 1; // Roll d10 for type change
        console.log(`Change type roll d10 = ${changeTypeRoll}`, "font-weight: bold");

        if (changeTypeRoll === 1) {
            // Move up one line in Precipitation Occurrence Table
            console.log(`Weather continues with weather type 1 line up on Precip Occurrence Table: ${weatherEffect.type}`, "font-weight: bold");
            weatherEffect = adjustPrecipType(-1, weatherEffect);
        } else if (changeTypeRoll === 10) {
            // Move down one line in Precipitation Occurrence Table
            console.log(`Weather continues with weather type 1 line down on Precip Occurrence Table: ${weatherEffect.type}`, "font-weight: bold");
            weatherEffect = adjustPrecipType(1, weatherEffect);
        } else {
            // No change to weather type, schedule a continuation note for the next day in Simple Calendar
            console.log(`Weather continues with the same type: ${weatherEffect.type}`);
            scheduleContinuationNote(weatherEffect);
        }
        // Optionally, roll again for the new duration here or handle it in applyWeatherEffects
    } else {
        // Weather event ends, set global flag to false
        GlobalWeatherConfig.flags.precipContinues = false;
        console.log(`Weather event ends after its initial duration of ${weatherEffect.duration}.`);
        // Optionally clear the current weather settings or set to a default weather
    }
    return weatherEffect;
}

function adjustPrecipType(change, weatherEffect) {
    // Find the current index of the weather type in the precipitation table
    let index = GlobalWeatherConfig.precipitationTable.findIndex(pt => pt.type === weatherEffect.type);
    console.log(`Current precipitation type index: ${index}, requested change: ${change}`);
    
    // Check if the new index is within the bounds of the precipitation table
    if (index !== -1 && (index + change >= 0) && (index + change < GlobalWeatherConfig.precipitationTable.length)) {
        // Update the precipitation type based on the calculated index change
        weatherEffect.type = GlobalWeatherConfig.precipitationTable[index + change].type;
        console.log(`Precipitation type adjusted to: ${weatherEffect.type}`);
        
        // Apply the new weather effects based on the updated type
        //applyWeatherEffects(weatherEffect.type);
    } else {
        console.log("Adjustment out of bounds or index not found. No change to precipitation type.");
    }
    return weatherEffect;  // Return the updated weather effect for chaining or further use
}

function formatFractions(text) {
    // Check if the text is undefined or not a string
    if (typeof text !== 'string') {
        console.log(`formatFractions was given a non-string input: ${text}`);
        return "No specific notes for this weather condition.";  // Default message or could return an empty string
    }
    // Replace fractions with their corresponding unicode characters
    return text.replace(/1\/2/g, '½').replace(/1\/4/g, '¼').replace(/3\/4/g, '¾');
}

async function displayWeatherConditions(weatherData, season, settings, onlyConsole = false) {
    const { latitude, altitude, terrain } = settings;
    const {
        skyCondition = 'Not available', sunrise = 'Not available', sunset = 'Not available',
        highTemp = 'N/A', lowTemp = 'N/A', windChill = 'N/A', humidity = 'N/A',
        recordTempHigh = 'N/A', recordTempLow = 'N/A',
        precipitationType = 'None', precipitationAmount = 'None', precipitationDuration = 'None',
        continues = 'No', rainbow = 'None', windSpeed = 0, windDirection = 'Not available',
        windEffects = 'None', specialWeatherEvent = 'None', notes = 'No additional notes'
    } = weatherData;

    const windLabel = getWindSpeedLabel(windSpeed);  // Assume this function correctly labels the wind speed

    let dateDisplay = "Date not set";
    if (GlobalWeatherConfig.useSimpleCalendar && SimpleCalendar.api.currentDateTime) {
        const currentDate = SimpleCalendar.api.currentDateTime();
        dateDisplay = `${currentDate.weekday}, ${currentDate.month} ${currentDate.day}, ${currentDate.year} CY`;
    }

    let message = `
        <strong>Greyhawk Weather Report for ${dateDisplay}</strong><br>
        Season: ${season}<br>
        Latitude: ${latitude}<br>
        Terrain: ${terrain}<br>
        Altitude: ${altitude} feet<br>
        Sky Condition: ${skyCondition.skyCondition}<br>
        Sunrise: ${sunrise}<br>
        Sunset: ${sunset}<br>
        High Temperature: ${highTemp}\u{B0}F<br>
        Low Temperature: ${lowTemp}\u{B0}F<br>
        Wind Chill: ${windChill}<br>
        Humidity: ${humidity}<br>
        Record High Temperature: ${recordTempHigh}\u{B0}F<br>
        Record Low Temperature: ${recordTempLow}\u{B0}F<br>
        Precipitation Type: ${precipitationType}<br>
        Precipitation Amount: ${precipitationAmount}<br>
        Precipitation Duration: ${precipitationDuration}<br>
        Precipitation Continues?: ${continues}<br>
        Rainbow: ${rainbow}<br>
        Wind Speed: ${windLabel} (${windSpeed} mph)<br>
        Wind Direction: ${windDirection}<br>
        Wind Effects: ${windEffects}<br>
        Special Weather Event: ${specialWeatherEvent}<br>
        ${notes}
    `;

    console.log(message.replace(/<br>/g, "\n").replace(/<strong>|<\/strong>/g, "").replace(/\s+\n/g, "\n"));
    if (!onlyConsole && typeof ChatMessage === "function") {
        ChatMessage.create({ content: message, speaker: ChatMessage.getSpeaker({ alias: "Weather System" }) });
    } else {
        console.error("ChatMessage function not available. Ensure you are running this in the Foundry VTT environment.");
    }
}

async function generateWeather() {
    console.error("Starting weather generation for today.");

    try {
        const settings = await requestWeatherSettings();
        const season = determineSeason(settings.month);
        console.log(`Season determined as: ${season}`);

        let weatherData = {
            season: season,
            terrain: settings.terrain,
            latitude: settings.latitude,
            altitude: settings.altitude,
            highTemp: null,
            lowTemp: null,
            skyCondition: null,
            precipitationType: null,
            precipitationAmount: null,
            precipitationDuration: null,
            precipitationFlag: false,
            windSpeed: null,
            windDirection: null,
            sunrise: null,
            sunset: null,
            windChill: null,
            humidity: null,
            recordHigh: null,
            recordLow: null,
            rainbow: null,
            notes: null
        };

        console.log("Settings received:", settings);
        console.log("Initial weather data:", weatherData);

        // Step 1: Determine Temperature Extremes and Adjustments
        console.error(`%cSTEP 1: DETERMINE TEMPERATURES`, "font-weight: bold");
        const temperatures = await calculateInitialDailyTemperatures(settings.month, settings.latitude, settings.altitude, settings.terrain);
        weatherData.highTemp = temperatures.highTemp;
        weatherData.lowTemp = temperatures.lowTemp;
        console.log("Temperatures determined:", weatherData.highTemp, weatherData.lowTemp);

        // Step 2: Determine Sky Conditions
        console.error(`%cSTEP 2: DETERMINE SKY CONDITIONS`, "font-weight: bold");
        weatherData.skyCondition = await determineSkyConditions(settings.month);
        console.log("Sky conditions determined:", weatherData.skyCondition);

        // Step 3a: Check for Precipitation
        console.error(`%cSTEP 3a: DETERMINE IF PRECIP OCCURS`, "font-weight: bold");
        weatherData.precipitationFlag = await checkForPrecipitation(settings.month, settings.terrain);
        console.log("Precipitation check:", weatherData.precipitationFlag);

        // Step 3b: Determine Precipitation Type
        console.error(`%cSTEP 3b: DETERMINE PRECIP TYPE`, "font-weight: bold");
        if (weatherData.precipitationFlag) {
            weatherData.precipitationType = await determinePrecipitationType(settings.terrain, weatherData.highTemp);
            console.log("Precipitation type determined:", weatherData.precipitationType);
            
            // Step 3C: Determine precip amount, duration, and wind speed
            console.error(`%cSTEP 3C: DETERMINE PRECIP AMT, DURATION & WIND SPEED`, "font-weight: bold");
            const weatherEffects = applyWeatherEffects(weatherData.precipitationType, GlobalWeatherConfig.standardWeatherTable, GlobalWeatherConfig.terrainEffects);
            // Extracting the values from the returned object
            weatherData.precipitationAmount = weatherEffects.precipitationAmount;
            weatherData.precipitationDuration = weatherEffects.precipitationDuration;
            weatherData.windSpeed = weatherEffects.windSpeed;
            console.log("Weather effects determined:", weatherData.precipitationAmount, weatherData.precipitationDuration, weatherData.windSpeed);

        } else {
            // Step 3d: If no precipitation, calculate wind speed as per the rules
            weatherData.precipitationType = "No precip today.";
            console.error(`%cSTEP 3d: No precip found, rolld d20-1 for wind speed and adjust for terrain`, "font-weight: bold");
            const baseWindSpeed = Math.floor(Math.random() * 20); // Roll d20 for base wind speed
            const terrainAdjustment = GlobalWeatherConfig.terrainEffects[settings.terrain]?.windSpeedAdjustment || 0;
            console.log("Wind speed terrain adjustment = ", terrainAdjustment);
            weatherData.windSpeed = baseWindSpeed + terrainAdjustment; // Adjust wind speed for terrain
            console.log("No precipitation today. Wind speed set to:", weatherData.windSpeed);
        }

        // Step 4: Update Heat and Humidity Effects
        console.error(`%cSTEP 4: CHECK FOR HUMIDITY`, "font-weight: bold");
        if (weatherData.highTemp) {
            const { humidity, effectsDescription } = await updateHumidityAndEffects(weatherData.highTemp);
            weatherData.humidity = humidity;
            weatherData.humidityEffects = effectsDescription;
            console.log("Humidity and effects updated:", humidity, effectsDescription);
        } else {
            console.log("High temperature not set. Unable to update humidity and its effects.");
        }

        // Step 5: Wind Chill Calculation
        console.error(`%cSTEP 5: CALCULATE WIND CHILL`, "font-weight: bold");
        weatherData.windChill = await applyWindChill(weatherData.lowTemp, weatherData.windSpeed, GlobalWeatherConfig.windChillTable);
        console.log("Wind chill calculated:", weatherData.windChill);

        // Step 6: Rainbows Check
        console.error(`%cSTEP 6: RAINBOW CHECK`, "font-weight: bold");
        weatherData.rainbow = await checkForRainbows(weatherData.precipitationType, GlobalWeatherConfig.precipitationTable);
        console.log("Rainbow check:", weatherData.rainbow);

        // Step 7: Wind Direction
        console.error(`%cSTEP 7: CHECK FOR WIND DIRECTION`, "font-weight: bold");
        weatherData.windDirection = await setPrevailingWindDirection(season);
        console.log("Wind direction determined:", weatherData.windDirection);

        // Step 8: Sunrise and Sunset Times
        console.error(`%cSTEP 8: DETERMINE SUNRISE/SUNSET`, "font-weight: bold");
        const sunTimes = adjustSunTimesForLatitude(settings.latitude, settings.month);
        weatherData.sunrise = sunTimes.sunrise;
        weatherData.sunset = sunTimes.sunset;
        console.log("Sunrise and sunset times:", sunTimes);

        // Step 9: Display Weather Report
        console.error(`%cSTEP 9: COMPLETE WEATHER REPORT`, "font-weight: bold");
        await displayWeatherConditions(weatherData, season, settings);
        console.log("Weather data object: ", weatherData);

        // Step 10: Reset Data
        console.log(`%cSTEP 10: RESET DATA`, "font-weight: bold");
        resetWeatherData(GlobalWeatherConfig);
        console.log("Weather data reset.");

    } catch (error) {
        console.error("An error occurred during weather generation:", error.message);
    }
}

function applySpecialWeatherEffects() {
    const terrain = GlobalWeatherConfig.terrain;
    const effects = GlobalWeatherConfig.terrainEffects[terrain];
    const roll = Math.floor(Math.random() * 100) + 1; // Roll from 1 to 100

    console.log(`Rolled for special weather: ${roll}`);
    
    // Determine the special weather event based on the roll and the defined probabilities
    const specialWeatherRanges = effects.specialWeather.split(',').map(range => {
        const parts = range.split(':');
        const bounds = parts[0].split('-');
        return {
            lowerBound: parseInt(bounds[0]),
            upperBound: parseInt(bounds[1] || bounds[0]),
            event: parts[1].trim()
        };
    });

    const foundEvent = specialWeatherRanges.find(range => roll >= range.lowerBound && roll <= range.upperBound);
    if (foundEvent) {
        console.log(`Special weather event triggered: ${foundEvent.event}`);
        triggerSpecialWeatherEvent(foundEvent.event);
    } else {
        console.log("No special weather event triggered.");
    }
}

function triggerSpecialWeatherEvent(event) {
    const specialEventDetails = GlobalWeatherConfig.specialWeatherTable.find(e => e.phenomenon === event);
    if (specialEventDetails) {
        console.log(`Applying special weather event: ${event}`);
        // You could expand this function to actually implement changes based on the event details.
        GlobalWeatherConfig.specialWeatherEvent = event;
        // More detailed application could be done here based on the event's properties.
    }
}

// new version
function applyWindChill(lowTemp, windSpeed, windChillTable) {
    let adjustedTemp = 'N/A';  // Default no wind chill adjustment
    if (lowTemp < 35) {
        const validWindSpeed = findClosestWindSpeed(windSpeed, windChillTable);  // Adjusted to pass windChillTable
        const windChillSubTable = windChillTable[validWindSpeed];  // Now directly using the passed table
        const validTemp = findClosestTemperature(lowTemp, windChillSubTable);  // Uses sub-table to find closest temp

        adjustedTemp = windChillSubTable[validTemp];
        console.log(`Wind chill adjusted temperature: ${adjustedTemp}\u{B0}F for low temp ${lowTemp}\u{B0}F with wind speed ${windSpeed} mph.`);
    } else {
        console.log("Temperature above 35\u{B0}F, no wind chill adjustment applied.");
    }
    return adjustedTemp;  // Return the adjusted temperature or 'N/A'
}

function findClosestWindSpeed(windSpeed) {
    const keys = Object.keys(GlobalWeatherConfig.windChillTable);
    console.log("Keys of windChillTable:", keys);  // Debugging: Check the keys being processed

    const windSpeeds = keys.map(Number).filter(num => !isNaN(num));  // Convert keys to numbers and filter out any NaN values
    console.log("Numerical wind speeds:", windSpeeds);  // Debugging: Check the converted numbers

    if (windSpeeds.length === 0) {
        console.error("No wind speeds available in the windChillTable.");
        return undefined; // or handle it another way, perhaps setting a default value
    }

    const closestSpeed = windSpeeds.reduce((prev, curr) => 
        Math.abs(curr - windSpeed) < Math.abs(prev - windSpeed) ? curr : prev
    );

    console.log(`Closest wind speed found for ${windSpeed} mph is ${closestSpeed} mph.`);
    return closestSpeed;
}

function findClosestTemperature(temp, subTable) {
    if (!subTable || Object.keys(subTable).length === 0) {
        console.error("findClosestTemperature was provided an empty or undefined subTable.");
        return undefined; // Handle error case or set a default value
    }

    const temperatures = Object.keys(subTable).map(Number).filter(num => !isNaN(num));
    if (temperatures.length === 0) {
        console.error("No valid temperature entries found in subTable.");
        return undefined; // Handle error case or set a default value
    }

    const closestTemp = temperatures.reduce((prev, curr) => 
        Math.abs(curr - temp) < Math.abs(prev - temp) ? curr : prev
    );

    console.log(`Closest temperature found for ${temp}°F is ${closestTemp}°F.`);
    return closestTemp;
}

// new version
function checkForRainbows(weatherEffect, precipitationTable) {
    if (!weatherEffect || !precipitationTable) {
        console.log("Invalid input provided to checkForRainbows function.");
        return { hasRainbow: false, rainbowType: null };
    }

    const precipitationDetails = precipitationTable.find(p => p.type === weatherEffect);
    console.log("Weather details for rainbow check:", precipitationDetails);

    let rainbowResult = {
        hasRainbow: false,
        rainbowType: null
    };

    if (precipitationDetails && precipitationDetails.rainbowChance) {
        const roll = Math.floor(Math.random() * 100) + 1; // Random roll between 1 and 100
        console.log(`Rainbow chance roll: ${roll} vs required chance: ${precipitationDetails.rainbowChance}`);
        if (roll < precipitationDetails.rainbowChance) {
            const rainbowTypeRoll = Math.floor(Math.random() * 100) + 1; // Determining type of rainbow
            if (rainbowTypeRoll <= 89) {
                rainbowResult.rainbowType = "Single rainbow";
            } else if (rainbowTypeRoll <= 95) {
                rainbowResult.rainbowType = "Double rainbow (may be an omen)";
            } else if (rainbowTypeRoll <= 98) {
                rainbowResult.rainbowType = "Triple rainbow (almost certainly an omen)";
            } else if (rainbowTypeRoll == 99) {
                rainbowResult.rainbowType = "Bifrost bridge or clouds in the shape of rain deity";
            } else {
                rainbowResult.rainbowType = "Rain deity or servant in sky";
            }
            rainbowResult.hasRainbow = true;
            console.log(`Rainbow formed: ${rainbowResult.rainbowType}`);
        } else {
            console.log("No rainbow formed.");
            return rainbowResult.rainbowType = "No rainbow formed.";
        }
    } else {
        console.log("This weather type does not support rainbow formation or rainbow details missing.");
        return rainbowResult.rainbowType = "Rainbow formation not possible.";
    }

    return rainbowResult;
}

function setWindDirection() {
    const direction = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];
    const index = Math.floor(Math.random() * direction.length);
    GlobalWeatherConfig.windDirection = direction[index];

    console.log(`Wind direction: ${GlobalWeatherConfig.windDirection}`);
}

// new version
function setPrevailingWindDirection(season, roll = Math.floor(Math.random() * 20) + 1) {
    console.log("season is: ", season);
    const windChart = {
        "Fall": [1, 2, 3, 5, 10, 17, 19, 20],
        "Winter": [1, 2, 3, 6, 15, 18, 19, 20],
        "Spring": [2, 3, 4, 5, 7, 10, 17, 20],
        "Summer": [2, 3, 4, 5, 7, 10, 17, 20]
    };
    const directions = ["South", "Southwest", "West", "Northwest", "North", "Northeast", "East", "Southeast"];

    // Validate season or default to Fall
    if (!windChart[season]) {
        console.error(`Season '${season}' is not valid. Defaulting to 'Fall'.`);
        season = "Fall";
    }
    
    console.log(`Rolled a ${roll} for prevailing wind direction in ${season}.`);
    
    // Find the matching direction index
    let directionIndex = windChart[season].findIndex(rangeEnd => roll <= rangeEnd);
    directionIndex = directionIndex !== -1 ? directionIndex : directions.length - 1;

    const prevailingDirection = directions[directionIndex];
    console.log(`Prevailing wind direction for ${season}: ${prevailingDirection}`);

    return prevailingDirection;  // Return the direction instead of setting it globally
}

function calculateLatitude(type, value) {
    const baseLatitude = 35; // Greyhawk's latitude
    console.log(`Initial settings: Type=${type}, Value=${value}, Base latitude=${baseLatitude}`);

    let adjustedLatitude = baseLatitude; // Start with the base latitude of Greyhawk

    if (type === "milesNorth") {
        adjustedLatitude += Math.floor(value / 70); // For every 70 miles north, add 1 degree
        console.log(`Adjusted ${value} miles north, resulting in latitude: ${adjustedLatitude}`);
    } else if (type === "milesSouth") {
        adjustedLatitude -= Math.floor(value / 70); // For every 70 miles south, subtract 1 degree
        console.log(`Adjusted ${value} miles south, resulting in latitude: ${adjustedLatitude}`);
    } else {
        adjustedLatitude = parseInt(value, 10); // Assume direct latitude entry if not north or south
        console.log(`Direct latitude entry used, resulting in latitude: ${adjustedLatitude}`);
    }

    return adjustedLatitude;
}

async function requestWeatherSettings() {
    return new Promise((resolve, reject) => {
        const formHtml = `
            <form>
                <div>
                    <label for="useSimpleCalendar">Generate Simple Calendar Note:</label>
                    <input type="checkbox" id="useSimpleCalendar" name="useSimpleCalendar" ${GlobalWeatherConfig.useSimpleCalendar ? 'checked' : ''}>
                </div>
                <div>
                    <label for="month">Month/Festival:</label>
                    <select id="month" name="month">
                        ${Object.keys(GlobalWeatherConfig.calendarLabels).map(month => `<option value="${month}" ${GlobalWeatherConfig.month === month ? 'selected' : ''}>${GlobalWeatherConfig.calendarLabels[month]}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="terrain">Terrain:</label>
                    <select id="terrain" name="terrain">
                        ${Object.keys(GlobalWeatherConfig.terrainEffects).map(terrain => `<option value="${terrain}" ${GlobalWeatherConfig.terrain === terrain ? 'selected' : ''}>${terrain}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="altitude">Altitude (in thousands of feet):</label>
                    <input type="number" id="altitude" name="altitude" step="0.1" value="${GlobalWeatherConfig.altitude / 1000}" min="0" max="30">
                </div>
                <div>
                    <label for="latitudeType">Latitude Input Type:</label>
                    <select id="latitudeType" name="latitudeType">
                        <option value="latitude" selected>Choose Latitude</option>
                        <option value="milesNorth">Miles North of the city of Greyhawk</option>
                        <option value="milesSouth">Miles South of the city of Greyhawk</option>
                    </select>
                </div>
                <div>
                    <label for="latitude">Latitude or Distance:</label>
                    <input type="text" id="latitude" name="latitude" value="${GlobalWeatherConfig.latitude}">
                </div>
            </form>
        `;

        let dialog = new Dialog({
            title: "Enter Weather Settings",
            content: formHtml,
            buttons: {
                submit: {
                    label: "Submit",
                    callback: (html) => {
                        const settings = {
                            useSimpleCalendar: html.find('#useSimpleCalendar').is(':checked'),
                            month: html.find('#month').val(),
                            terrain: html.find('#terrain').val(),
                            altitude: parseFloat(html.find('#altitude').val()) * 1000,
                            latitude: calculateLatitude(html.find('#latitudeType').val(), parseInt(html.find('#latitude').val().trim(), 10))
                        };
                        resolve(settings);
                    }
                },
                cancel: {
                    label: "Cancel",
                    callback: () => {
                        console.log("Weather settings update canceled.");
                        reject(new Error("Weather setting update was canceled by the user."));
                    }
                }
            },
            default: "submit"
        });
        dialog.render(true);
    });
}

function updateGlobalWeatherConfig(month, terrain, altitude, latitude) {
    //GlobalWeatherConfig.year = year;
    GlobalWeatherConfig.month = month;
    //GlobalWeatherConfig.day = day;
    GlobalWeatherConfig.terrain = terrain;
    GlobalWeatherConfig.altitude = altitude;
    GlobalWeatherConfig.latitude = latitude;

    // Update terrain flags based on selected terrain
    updateTerrainFlags(terrain);

    // Add any additional logic to handle changes in configuration
    console.log("Global Weather Configuration Updated:", GlobalWeatherConfig);
}

function updateTerrainFlags(terrain) {
    switch (terrain) {
        case 'Rough terrain or hills':
        case 'Forest':
        case 'Jungle':
        case 'Swamp or marsh':
        case 'Dust':
        case 'Plains':
        case 'Desert':
        case 'Mountains':
        case 'Seacoast':
            GlobalWeatherConfig.flags.onLand = true;
            console.log("Terrain is land-based:", terrain, "Setting onLand flag to true.");
            break;
        case 'At sea':
            GlobalWeatherConfig.flags.atSea = true;
            console.log("Terrain is sea-based:", terrain, "Setting atSea flag to true.");
            break;
        default:
            console.log("Terrain does not match any predefined categories:", terrain);
            break;
    }

    console.log(`Terrain flags updated: onLand=${GlobalWeatherConfig.flags.onLand}, atSea=${GlobalWeatherConfig.flags.atSea}`);
}
// #1
/* function updateHumidityAndEffects() {
    let currentTemperature = GlobalWeatherConfig.dailyHighTemp; // Using high temp for the day.
    let effectsDescription = "No significant heat and humidity effects."; // Default message

    if (currentTemperature > 75) {
        // Generate a realistic humidity value between 50% and 90%
        //let humidity = 50 + Math.floor(Math.random() * 41); // 50 to 90%
        // by the rules, roll d100 for humidity
        let humidity = evalDice("d100"); // roll d100
        console.log("rolling d100 for humidity percent = ", humidity);

        let tempHumiditySum = currentTemperature + humidity;
        console.log(`Current Temperature: ${currentTemperature}\u{B0}F, Humidity: ${humidity}%, Humidity Sum: ${tempHumiditySum}\u{B0}F`);

        // Determine the effects based on the sum of temperature and humidity
        if (tempHumiditySum >= 140 && tempHumiditySum <= 160) {
            effectsDescription = "Move Normal, AC 0, To hit 0, Dexterity -1, Vision Normal, Rest per hour: 2 turns, Spell failure chance: 5%";
        } else if (tempHumiditySum > 160 && tempHumiditySum <= 180) {
            effectsDescription = "Move x3/4, AC 0, To hit -1, Dexterity -1, Vision x3/4, Rest per hour: 3 turns, Spell failure chance: 10%";
        } else if (tempHumiditySum > 180 && tempHumiditySum <= 200) {
            effectsDescription = "Move x1/2, AC -1, To hit -2, Dexterity -2, Vision x1/2, Rest per hour: 4 turns, Spell failure chance: 15%";
        } else if (tempHumiditySum > 200) {
            effectsDescription = "Move x1/4, AC -2, To hit -3, Dexterity -3, Vision x1/4, Rest per hour: 5 turns, Spell failure chance: 20%";
        }
    } else {
        console.log("Temperature is not high enough for heat and humidity effects.");
    }

    // Store the effects description in the GlobalWeatherConfig for access elsewhere
    GlobalWeatherConfig.humidityEffects = effectsDescription;
    console.log(effectsDescription);
    return effectsDescription; // Return the effects for potential immediate use
} */
function updateHumidityAndEffects(highTemp) {
    let effectsDescription = "No significant heat and humidity effects."; // Default message
    let humidity = 0; // Default humidity value

    if (highTemp > 75) {
        humidity = evalDice("d100"); // Roll d100 for humidity percentage
        console.log("Rolling d100 for humidity percent =", humidity);

        let tempHumiditySum = highTemp + humidity;
        console.log(`Current Temperature: ${highTemp}\u{B0}F, Humidity: ${humidity}%, Humidity Sum: ${tempHumiditySum}`);

        // Determine the effects based on the sum of temperature and humidity
        if (tempHumiditySum >= 140 && tempHumiditySum <= 160) {
            effectsDescription = "Move Normal, AC 0, To hit 0, Dexterity -1, Vision Normal, Rest per hour: 2 turns, Spell failure chance: 5%";
        } else if (tempHumiditySum > 160 && tempHumiditySum <= 180) {
            effectsDescription = "Move x3/4, AC 0, To hit -1, Dexterity -1, Vision x3/4, Rest per hour: 3 turns, Spell failure chance: 10%";
        } else if (tempHumiditySum > 180 && tempHumiditySum <= 200) {
            effectsDescription = "Move x1/2, AC -1, To hit -2, Dexterity -2, Vision x1/2, Rest per hour: 4 turns, Spell failure chance: 15%";
        } else if (tempHumiditySum > 200) {
            effectsDescription = "Move x1/4, AC -2, To hit -3, Dexterity -3, Vision x1/4, Rest per hour: 5 turns, Spell failure chance: 20%";
        }
    } else {
        console.log("Temperature is not high enough for heat and humidity effects.");
    }

    console.log(effectsDescription);
    return { humidity, effectsDescription }; // Return both humidity and its effects
}

// new version
function adjustSunTimesForLatitude(latitude, month) {
    const monthData = GlobalWeatherConfig.baselineData[month];
    const baselineSunrise = monthData.sunrise;
    const baselineSunset = monthData.sunset;
    console.log("Baseline sunrise: ", baselineSunrise, " & sunset: ", baselineSunset);

    const latitudeDifference = latitude - 40;  // 40 degrees is presumably the baseline latitude
    const timeAdjustment = latitudeDifference * 2;  // 2 minutes per degree

    const sunriseDate = convertTimeToDate(baselineSunrise);
    const sunsetDate = convertTimeToDate(baselineSunset);

    sunriseDate.setMinutes(sunriseDate.getMinutes() + timeAdjustment);
    sunsetDate.setMinutes(sunsetDate.getMinutes() + timeAdjustment);

    const adjustedSunrise = `${sunriseDate.getHours().toString().padStart(2, '0')}:${sunriseDate.getMinutes().toString().padStart(2, '0')}`;
    const adjustedSunset = `${sunsetDate.getHours().toString().padStart(2, '0')}:${sunsetDate.getMinutes().toString().padStart(2, '0')}`;

    console.log(`Adjusted Sunrise Time: ${adjustedSunrise}, Adjusted Sunset Time: ${adjustedSunset}`);

    return { sunrise: adjustedSunrise, sunset: adjustedSunset };
}

function convertTimeToDate(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
}

// Helper function to convert time string to Date object
function convertTimeToDate(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
}

function getWindSpeedLabel(mph) {
    if (mph >= 0 && mph <= 1) {
        return "Calm";
    } else if (mph >= 2 && mph <= 7) {
        return "Light Breeze";
    } else if (mph >= 8 && mph <= 18) {
        return "Moderate Breeze";
    } else if (mph >= 19 && mph <= 31) {
        return "Strong Breeze";
    } else if (mph >= 32 && mph <= 54) {
        return "Strong Gale";
    } else if (mph >= 55 && mph <= 72) {
        return "Storm Winds";
    } else if (mph >= 73 && mph <= 136) {
        return "Hurricane Winds";
    } else {
        return "Unusually Strong Winds";
    }
}

function getWindEffects(windSpeed, terrain, altitude) {
    console.log("Checking wind effects for speed:", windSpeed, "at terrain:", terrain, "and altitude:", altitude);
    const highWindsTable = GlobalWeatherConfig.highWindsTable;

    for (const entry of highWindsTable) {
        if (terrain === entry.terrain && altitude >= entry.altitudeMin && altitude <= entry.altitudeMax) {
            if (windSpeed >= entry.minSpeed && windSpeed <= entry.maxSpeed) {
                return formatWindEffects(entry.effects, { onLand: GlobalWeatherConfig.flags.onLand, atSea: GlobalWeatherConfig.flags.atSea, inAir: GlobalWeatherConfig.flags.inAir, inBattle: GlobalWeatherConfig.flags.inBattle });
            }
        }
    }
    return "No significant wind effects.";
}

function formatWindEffects(effects, flags) {
    let effectsString = "";
    effectsString += flags.onLand ? `Land: ${effects.onLand}<br>` : "";
    effectsString += flags.atSea ? `Sea: ${effects.atSea}<br>` : "";
    effectsString += flags.inAir ? `Air: ${effects.inAir}<br>` : "";
    effectsString += flags.inBattle ? `Battle: ${effects.inBattle}<br>` : "";
    return effectsString || "No significant effects under current conditions.";
}

function getDayOfWeek(dayOfMonth) {
    const weekDays = ["Starday", "Sunday", "Moonday", "Godsday", "Waterday", "Earthday", "Freeday"];
    // Calculate zero-based index: (dayOfMonth - 1) % 7 ensures we wrap around every 7 days, starting from Starday.
    return weekDays[(dayOfMonth - 1) % 7];
}

async function fetchCalendarData() {
    const currentDate = SimpleCalendar.api.currentDateTime();
    const currentWeekday = SimpleCalendar.api.getCurrentWeekday().name;
    const currentSeason = SimpleCalendar.api.getCurrentSeason().name;
    const currentMonth = SimpleCalendar.api.getCurrentMonth().name;
    // Return a structured object with the necessary data
    return {
        year: currentDate.year,
        month: currentMonth,
        day: currentDate.day,
        weekday: currentWeekday,
        season: currentSeason
    };
}

async function addWeatherReportToSimpleCalendar() {
    // Get current date from Simple Calendar
    const currentDate = SimpleCalendar.api.currentDateTime();
    const weatherEffect = findWeatherEffect(GlobalWeatherConfig.initialWeatherEvent);
    const specialWeatherEffect = findSpecialWeatherEffect(GlobalWeatherConfig.specialWeatherEvent);
    const windLabel = getWindSpeedLabel(GlobalWeatherConfig.windSpeed);
    const currentMonth = SimpleCalendar.api.getCurrentMonth().name;
    const currentDay = SimpleCalendar.api.getCurrentDay().name;
    const currentSeason = SimpleCalendar.api.getCurrentSeason().name;
    const currentWeekday = SimpleCalendar.api.getCurrentWeekday().name;

    let rainbowDisplay = "No";
    if (GlobalWeatherConfig.flags.rainbow && GlobalWeatherConfig.flags.rainbowType) {
        rainbowDisplay = GlobalWeatherConfig.flags.rainbowType;
    }
    
    let highWindNotes = getWindEffects(GlobalWeatherConfig.windSpeed);

    // Create a summary of the weather conditions
    const weatherSummary = `
        Month: ${currentMonth}, Terrain: ${GlobalWeatherConfig.terrain}, Altitude: ${GlobalWeatherConfig.altitude} ft., Latitude: ${GlobalWeatherConfig.latitude}N°<br>
        Sunrise: ${GlobalWeatherConfig.adjustedSunrise}, Sunset: ${GlobalWeatherConfig.adjustedSunset}<br>
        High: ${GlobalWeatherConfig.dailyHighTemp}°F, Low: ${GlobalWeatherConfig.dailyLowTemp}°F, Wind Chill: ${GlobalWeatherConfig.temperature.effective}°F<br>
        Sky Condition: ${GlobalWeatherConfig.skyCondition}; ${windLabel} (${GlobalWeatherConfig.windSpeed} mph from ${GlobalWeatherConfig.windDirection})<br>
        Precipitation: ${GlobalWeatherConfig.precipType || "None"} for ${GlobalWeatherConfig.initialWeatherEventDuration}, Amount: ${GlobalWeatherConfig.precipAmount || "0"}<br> 
        Wind Notes: ${highWindNotes}<br> 
        Rainbow: ${rainbowDisplay}<br>`;

    // Generate formatted notes
    const standardNotes = weatherEffect ? "Standard Notes: " + formatFractions(weatherEffect.notes) : "";
    const specialNotes = specialWeatherEffect ? "Special Notes: " + formatFractions(specialWeatherEffect.notes) : "";
    const humidityNotes = GlobalWeatherConfig.humidityEffects;
        
    // Fetch the current date and time from Simple Calendar
    const currentDateTime = SimpleCalendar.api.currentDateTimeDisplay();
    const noteDate = `${currentDateTime.monthName} ${currentDateTime.day}${currentDateTime.daySuffix}, ${currentDateTime.year}`; // "Coldeven 11th, 568"


    // Date for note: Start and end on the same day, marked as all-day
    const startDate = {
        year: currentDate.year,
        month: currentDate.month, // Assumes zero-based indexing if necessary
        day: currentDate.day,
        hour: 0,
        minute: 0,
        seconds: 0
    };
    const endDate = {
        year: currentDate.year,
        month: currentDate.month,
        day: currentDate.day,
        hour: 23,
        minute: 59,
        seconds: 59
    };

    // Create note content incorporating weather details and notes
    //const noteContent = `Weather Report for ${noteDate}:\n${weatherSummary}\n${standardNotes}\n${specialNotes}`;
    const noteContent = `${weatherSummary}\n${standardNotes}\n${specialNotes}\n${humidityNotes}`;

    // Fetch all user IDs
    const usersToRemind = getAllUserIDs();  // Fetch all user IDs from the game

    // Ensure to add the condition check before trying to execute the addNote function
    if (GlobalWeatherConfig.useSimpleCalendar) {
        try {
            const newJournal = await SimpleCalendar.api.addNote(
                "Daily Weather Report",
                noteContent.trim(),
                startDate,
                endDate,
                true,  // allDay
                SimpleCalendar.api.NoteRepeat.Never, // does not repeat
                ['Weather'],  // categories
                "active",  // calendarId: use the active calendar
                null,  // no macro associated
                ['default'],  // visible to all users
                usersToRemind  // users to remind
            );
            if (newJournal) {
                console.log("Weather report added to Simple Calendar:", newJournal);
            } else {
                console.error("Failed to add weather report to Simple Calendar.");
            }
        } catch (error) {
            console.error("Error adding weather report to Simple Calendar:", error);
        }
    }
}

async function scheduleContinuationNote(weatherEffect) {
    // Check if Simple Calendar integration is enabled
    if (!GlobalWeatherConfig.useSimpleCalendar) {
        console.log("Simple Calendar integration is disabled. Skipping scheduleContinuationNote.");
        return; // Exit the function if Simple Calendar is not being used
    }
    const currentDate = SimpleCalendar.api.currentDateTime();
    const tomorrow = new Date(currentDate.year, currentDate.month - 1, currentDate.day + 1); // Adjust month for zero-based index
    const noteDate = {
        year: tomorrow.getFullYear(),
        month: tomorrow.getMonth() + 1, // Convert back to one-based index for Simple Calendar
        day: tomorrow.getDate(),
        hour: 0,
        minute: 0,
        seconds: 0
    };
    const endDate = { ...noteDate, hour: 23, minute: 59, seconds: 59 };

    const noteContent = `Weather continuation: Please roll for weather type "${weatherEffect.type}" for today.`;
    try {
        const newJournal = await SimpleCalendar.api.addNote(
            "Weather Continuation",
            noteContent,
            noteDate,
            endDate,
            true, // allDay
            SimpleCalendar.api.NoteRepeat.Never,
            ['Weather Continuation'], // Category
            "active", // calendarId: use the active calendar
            null, // no macro associated
            ['default'], // visible to all users
            getAllUserIDs() // users to remind
        );
        console.log(newJournal ? "Continuation weather report added to Simple Calendar." : "Failed to add continuation weather report.");
    } catch (error) {
        console.error("Error adding continuation weather report to Simple Calendar:", error);
    }
}

// new version
function resetWeatherData(weatherConfig) {
    console.log("resetWeatherEvents called");
    
    // Reset terrain flags
    const flags = weatherConfig.flags;
    flags.onLand = false;
    flags.atSea = false;
    flags.inAir = false;
    flags.inBattle = false;
    console.log("reset onLand flag = ", flags.onLand)
    console.log("reset atSea flag = ", flags.atSea)
    
    // Resetting event-specific details
    weatherConfig.initialWeatherEvent = "none";
    weatherConfig.initialWeatherEventDuration = 0;
    weatherConfig.continuingWeatherEvent = "none";
    weatherConfig.continuingWeatherEventDuration = 0;
	
	// Reset special weather event
	weatherConfig.specialWeather = false;
	weatherConfig.specialWeatherEvent = "none";
	weatherConfig.specialWeatherEventDuration = 0;

    // Resetting precipitation details
    weatherConfig.precipType = "none";
    weatherConfig.precipAmount = 0;

    // Resetting temperature specifics
    weatherConfig.dailyHighTemp = 0;
    weatherConfig.dailyLowTemp = 0;
    weatherConfig.temperature.effective = undefined;  // Reset effective temperature if used

    // Resetting wind details
    weatherConfig.windSpeed = 0;
    weatherConfig.windSpeedInitial = 0; // Ensure the initial wind speed is reset as well

    // Reset humidity and sky condition to default states
    weatherConfig.humidity = 0; // Reset humidity to a default or recalculated value
    weatherConfig.skyCondition = "clear"; // Reset sky condition to a default state

    // Log the reset to ensure it's traceable
    console.log("Weather event details and related configurations have been reset.");
}

function getPrecipitationDetails(weatherEffect) {
    // Handle cases where there is explicitly no precipitation or weather effect is undefined
    if (!weatherEffect || weatherEffect.type === "none" || weatherEffect.type === null) {
        console.log("No precipitation or weather effect is undefined.");
        return { precipitation: "No precipitation", duration: "No duration" };
    }

    // Attempt to find the weather effect in the standard or special weather tables
    let tableEntry = GlobalWeatherConfig.standardWeatherTable.find(entry => entry.name === weatherEffect.type);
    if (!tableEntry) {
        tableEntry = GlobalWeatherConfig.specialWeatherTable.find(entry => entry.phenomenon === weatherEffect.type);
    }

    // If no matching table entry is found, assume no precipitation
    if (!tableEntry) {
        console.log("No table entry found for weather type:", weatherEffect.type);
        return { precipitation: "No precipitation", duration: "No duration" };
    }

    // Calculate the precipitation amount and duration using evalDice
    const precipitation = tableEntry.precipDice 
        ? evalDice(tableEntry.precipDice) + " inches"  // Use precipDice if available, assume standard weather
        : evalDice(tableEntry.precipitation) + " inches";  // Use direct precipitation amount for special weather

    const duration = evalDice(tableEntry.duration) + " " + (tableEntry.durationUnit || "hours");

    return {
        precipitation: precipitation,
        duration: duration
    };
}

/* function compileWeatherNotes(weatherTypeEntry) {
    // Extract the type of weather from the precipitationTable entry
    const weatherTypeName = weatherTypeEntry.type;

    // Access tables from GlobalWeatherConfig
    const standardWeatherTable = GlobalWeatherConfig.standardWeatherTable;
    const specialWeatherTable = GlobalWeatherConfig.specialWeatherTable;

    // Access current terrain effects based on the current terrain setting
    const currentTerrain = GlobalWeatherConfig.terrain;
    const terrainEffect = GlobalWeatherConfig.terrainEffects[currentTerrain];

    // Filter the standard weather table for the given weather type
    const standardWeatherNotes = standardWeatherTable
        .filter(condition => condition.name && condition.name.includes(weatherTypeName))
        .map(condition => condition.notes)
        .filter(note => note)
        .join("<br>");

    // Filter the special weather table for the given weather type
    const specialWeatherNotes = specialWeatherTable
        .filter(effect => effect.phenomenon && effect.phenomenon.includes(weatherTypeName))
        .map(effect => effect.notes)
        .filter(note => note)
        .join("<br>");

    // Compile the terrain note
    const terrainNote = terrainEffect && terrainEffect.notes ? terrainEffect.notes : "";

    // Compile the notes into a single formatted string for HTML, only including sections with content
    let compiledNotes = "";
    if (standardWeatherNotes) {
        compiledNotes += `<div><em><strong>Standard Weather Notes:</strong></em></div><div>${standardWeatherNotes}</div>`;
    }
    if (specialWeatherNotes) {
        compiledNotes += `<div><br><em><strong>Special Weather Notes:</strong></em></div><div>${specialWeatherNotes}</div>`;
    }
    if (terrainNote) {
        compiledNotes += `<div><br><em><strong>Terrain Notes:</strong></em></div><div>${terrainNote}</div>`;
    }

    return compiledNotes;
} */
// new version
function compileWeatherNotes(weatherData) {
    const weatherTypeEntry = weatherData.precipitation;  // Assuming this holds the precipitation type details
    const weatherTypeName = weatherTypeEntry ? weatherTypeEntry.type : "";

    // Assuming these tables are accessible via GlobalWeatherConfig or similar
    const standardWeatherTable = GlobalWeatherConfig.standardWeatherTable;
    const specialWeatherTable = GlobalWeatherConfig.specialWeatherTable;
    const terrain = weatherData.terrain;  // Make sure terrain is passed in or accessible

    const standardWeatherNotes = standardWeatherTable
        .filter(condition => condition.name && condition.name.includes(weatherTypeName))
        .map(condition => condition.notes)
        .join("<br>");

    const specialWeatherNotes = specialWeatherTable
        .filter(effect => effect.phenomenon && effect.phenomenon.includes(weatherTypeName))
        .map(effect => effect.notes)
        .join("<br>");

    const terrainEffect = GlobalWeatherConfig.terrainEffects[terrain] || {};
    const terrainNote = terrainEffect.notes || "";

    let compiledNotes = "";
    if (standardWeatherNotes) compiledNotes += `<div><em><strong>Standard Weather Notes:</strong></em></div><div>${standardWeatherNotes}</div>`;
    if (specialWeatherNotes) compiledNotes += `<div><br><em><strong>Special Weather Notes:</strong></em></div><div>${specialWeatherNotes}</div>`;
    if (terrainNote) compiledNotes += `<div><br><em><strong>Terrain Notes:</strong></em></div><div>${terrainNote}</div>`;

    return compiledNotes;
}


function determineSeason(month) {
    const seasons = {
        "Needfest": "Winter",
        "Fireseek": "Winter",
        "Readying": "Spring",
        "Coldeven": "Spring",
        "Growfest": "Spring",
        "Planting": "Low Summer",
        "Flocktime": "Low Summer",
        "Wealsun": "Low Summer",
        "Richfest": "High Summer",
        "Reaping": "High Summer",
        "Goodmonth": "High Summer",
        "Harvester": "High Summer",
        "Brewfest": "Autumn",
        "Patchwall": "Autumn",
        "Ready'reat": "Autumn",
        "Sunsebb": "Winter"
    };
    
    // Validate month and return the corresponding season, default to 'Unknown' if the month is not valid
    return seasons[month] || "Unknown";
}
