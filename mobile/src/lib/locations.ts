export const countries = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "India", code: "IN" },
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "South Korea", code: "KR" },
  { name: "Netherlands", code: "NL" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Singapore", code: "SG" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "South Africa", code: "ZA" },
  { name: "Nigeria", code: "NG" },
  { name: "Kenya", code: "KE" },
  { name: "Egypt", code: "EG" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Poland", code: "PL" },
  { name: "Ukraine", code: "UA" },
  { name: "Russia", code: "RU" },
  { name: "Turkey", code: "TR" },
  { name: "Indonesia", code: "ID" },
  { name: "Vietnam", code: "VN" },
  { name: "Thailand", code: "TH" },
  { name: "Malaysia", code: "MY" },
  { name: "Philippines", code: "PH" },
  { name: "New Zealand", code: "NZ" },
  { name: "Ireland", code: "IE" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
  { name: "Finland", code: "FI" },
  { name: "Belgium", code: "BE" },
  { name: "Austria", code: "AT" },
  { name: "Portugal", code: "PT" },
  { name: "Greece", code: "GR" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Hungary", code: "HU" },
  { name: "Romania", code: "RO" },
  { name: "Argentina", code: "AR" },
  { name: "Chile", code: "CL" },
  { name: "Colombia", code: "CO" },
  { name: "Peru", code: "PE" },
  { name: "Pakistan", code: "PK" },
  { name: "Bangladesh", code: "BD" },
  { name: "Israel", code: "IL" },
];

export const citiesByCountry: Record<string, string[]> = {
  "United States": [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA",
    "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA", "Austin, TX", "Jacksonville, FL",
    "Fort Worth, TX", "Columbus, OH", "San Francisco, CA", "Charlotte, NC", "Indianapolis, IN", "Seattle, WA",
    "Denver, CO", "Washington, DC", "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
    "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI",
    "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA", "Kansas City, MO", "Mesa, AZ",
    "Atlanta, GA", "Omaha, NE", "Colorado Springs, CO", "Raleigh, NC", "Miami, FL", "Long Beach, CA",
    "Virginia Beach, VA", "Oakland, CA", "Minneapolis, MN", "Tulsa, OK", "Tampa, FL", "Arlington, TX"
  ],
  "United Kingdom": [
    "London", "Birmingham", "Leeds", "Glasgow", "Sheffield", "Bradford", "Manchester", "Edinburgh",
    "Liverpool", "Bristol", "Cardiff", "Belfast", "Leicester", "Wakefield", "Coventry", "Nottingham",
    "Newcastle upon Tyne", "Sunderland", "Brighton & Hove", "Kingston upon Hull", "Plymouth", "Stoke-on-Trent"
  ],
  "Canada": [
    "Toronto, ON", "Montreal, QC", "Vancouver, BC", "Calgary, AB", "Edmonton, AB", "Ottawa, ON",
    "Winnipeg, MB", "Quebec City, QC", "Hamilton, ON", "Brampton, ON", "Surrey, BC", "Kitchener, ON",
    "Laval, QC", "Halifax, NS", "London, ON", "Victoria, BC", "Markham, ON", "Windsor, ON", "Gatineau, QC"
  ],
  "Australia": [
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra",
    "Sunshine Coast", "Wollongong", "Geelong", "Hobart", "Townsville", "Cairns", "Toowoomba", "Darwin"
  ],
  "Germany": [
    "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig",
    "Dortmund", "Essen", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal"
  ],
  "France": [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux",
    "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes"
  ],
  "India": [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune",
    "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
    "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot"
  ],
  "Other": [
    "Remote (Worldwide)", "Remote (Timezone Specific)"
  ]
};

export const getCities = (countryName?: string) => {
  if (countryName && citiesByCountry[countryName]) {
    return citiesByCountry[countryName];
  }
  return [
    ...citiesByCountry["United States"],
    ...citiesByCountry["United Kingdom"],
    ...citiesByCountry["Canada"],
    ...citiesByCountry["Australia"],
    ...citiesByCountry["Germany"],
    ...citiesByCountry["France"],
    ...citiesByCountry["India"],
  ].sort();
};
