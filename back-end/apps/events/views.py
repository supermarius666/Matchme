from django.shortcuts import render

# Create your views here.
def events_view(request):
    context = {}
    return render(request, "events/events.html", context)


class Place:
    def __init__(self, name):
        self.name = name
    
    @property
    def formatted_name(self):
        return self.name.replace('-', ' ').title()

PLACE_DATA = {
    "villa-borghese": {
        "image": "img/places/villa_borghese.jpg",
        "lat": 41.9138822,
        "lon": 12.4828069,
        "short_description": [
            "Villa Borghese is Rome's third-largest public park, a magnificent expanse of greenery offering a perfect blend of nature, art, and recreation. Spanning over 80 hectares, this sprawling urban oasis is meticulously landscaped with picturesque gardens, shaded walking paths, and classical statues. Visitors can enjoy leisurely strolls, bike rides, or even rent a rowboat on the tranquil lake, a favorite spot for tourists and locals alike. The park's diverse flora, including ancient trees and vibrant flowerbeds, creates a beautiful and serene environment, making it an ideal escape from the city's hustle and bustle.",
            "For couples, Villa Borghese is an exceptionally romantic destination. Its vastness provides countless secluded spots for intimate moments, from quiet benches nestled among trees to charming corners of the Secret Gardens. Couples can rent bicycles or tandem bikes to explore the park together, enjoy a romantic picnic with views of the city, or take a peaceful rowboat ride on the lake, creating lasting memories. The enchanting atmosphere, coupled with stunning views of Rome from various viewpoints, makes Villa Borghese a popular choice for romantic outings and a perfect setting for shared experiences.",
            "Villa Borghese is steeped in history, primarily as the former estate of the influential Borghese family. Developed in the early 17th century by Cardinal Scipione Borghese, it was designed as a 'villa of delights' to house his vast art collection and serve as a grand pleasure garden. The park's most significant historical feature is the Borghese Gallery and Museum, which still houses an unparalleled collection of masterpieces by artists like Bernini, Caravaggio, and Canova. The various architectural elements, including temples, fountains, and sculptures scattered throughout the park, are remnants of its aristocratic past. Acquired by the Italian state in the early 20th century and opened to the public, Villa Borghese allows visitors to immerse themselves in centuries of Roman aristocratic life and appreciate its enduring artistic and cultural legacy.",
            "The events held at Villa Borghese are consistently captivating, enhancing its already magnificent allure. From elegant art exhibitions within the Borghese Gallery to open-air theatrical performances and classical music concerts staged in various picturesque spots, the park provides an unrivaled cultural backdrop. The Piazza di Siena, its iconic horse riding arena, frequently hosts prestigious equestrian events and large-scale public gatherings. These diverse events leverage the park's artistic heritage and natural beauty, offering visitors unique opportunities to engage with art, culture, and sports in one of Rome's most beloved green spaces."
        ],
        "links": [
            {"title": "Sito Ufficiale", "url": "https://www.sovraintendenzaroma.it/i_luoghi/ville_e_parchi_storici/ville_dei_nobili/villa_borghese"},
            {"title": "Wikipedia", "url": "https://it.wikipedia.org/wiki/Villa_Borghese"},
            {"title": "Google Maps", "url": "https://www.google.it/maps/search/Villa+Borghese+Rome"}
        ],
    },
    "giardino-degli-aranci": {
        "image": "img/places/giardino_degli_aranci.webp",
        "lat": 41.885400873921846,
        "lon": 12.480289453328528,
        "short_description": [
            "The Giardino degli Aranci, or Orange Garden, is a truly captivating spot on Rome's Aventine Hill. While not as expansive as Villa Borghese or Villa Ada, its beauty lies in its intimate charm and, most famously, its breathtaking panoramic views of the city. The garden is filled with fragrant orange trees (hence the name) that provide a lovely, verdant setting. It's a peaceful retreat where visitors can unwind, enjoy the sweet scent of citrus blossoms, and take in one of the most iconic vistas in Rome, encompassing the Tiber River, Trastevere, St. Peter's Basilica, and beyond.",
            "For couples, the Giardino degli Aranci is an incredibly romantic and popular destination. Its elevated position and stunning sunset views make it an ideal spot for a memorable moment. Couples often come here to watch the sun dip below the Roman skyline, sharing quiet conversations on the benches that line the terrace. The intimate atmosphere, coupled with the fragrant orange trees and the magic of the city stretching out before them, creates a truly enchanting setting for hand-in-hand strolls and romantic gestures, making it a quintessential Roman experience for two.",
            "The Giardino degli Aranci holds a subtle but significant historical presence. Located on the ancient Aventine Hill, it occupies the site of the former Savello family fortress, built in the 13th century. While most of the fortress is gone, remnants of its walls can still be seen, hinting at the area's medieval past. The garden itself was established in 1932 by architect Raffaele De Vico, who designed it as a public park. Its historical importance is also linked to the nearby Santa Sabina Basilica, one of Rome's most beautiful early Christian churches. The garden's strategic location on one of Rome's seven hills means it has witnessed centuries of the city's development, offering a unique historical perspective alongside its scenic beauty.",
            "While not known for large-scale festivals, the Giardino degli Aranci is a favored location for more intimate and charming events that highlight its romantic ambiance. It's a popular choice for private gatherings, small musical performances, and photography sessions, especially around sunset. The panoramic views provide a stunning natural stage for impromptu romantic gestures, like marriage proposals, and its serene atmosphere is perfect for meditative and reflective events. The simple beauty of the orange trees and the breathtaking cityscape make any event held here feel exceptionally special and memorable."
        ],
        "links": [
            {"title": "Wikipedia", "url": "https://it.wikipedia.org/wiki/Giardino_degli_Aranci"},
            {"title": "Google Maps", "url": "https://www.google.it/maps/search/Giardino+degli+Aranci+Roma"}
        ],
    },
    "trastevere-square": {
        "image": "img/places/trastevere_square.webp",
        "lat": 41.8894,
        "lon": 12.4708,
        "short_description": [
            "Piazza di Santa Maria in Trastevere is the vibrant heart of Rome's charming Trastevere neighborhood, a true gem that encapsulates the authentic Roman spirit. At its center stands one of Rome's oldest fountains, creating a soothing backdrop of flowing water. The piazza is dominated by the stunning Basilica di Santa Maria in Trastevere, whose glittering golden mosaics on the facade capture the sunlight and illuminate the square. Surrounded by historic buildings, lively cafes, and traditional trattorias, the piazza exudes a captivating atmosphere day and night, making it a beautiful and quintessential Roman experience.",
            "For couples, Piazza di Santa Maria in Trastevere offers an incredibly romantic and lively setting. It's a beloved spot for an evening stroll, where the soft glow of the basilica's mosaics and the gentle sound of the fountain create a magical ambiance. Couples can find a spot on the fountain's steps to people-watch, enjoy street performers, or simply soak in the energy of the square. The surrounding narrow streets of Trastevere, filled with cozy restaurants and bars, offer perfect opportunities for a romantic dinner or a late-night drink, making the piazza the ideal starting point for a romantic evening in Rome.",
            "The Piazza di Santa Maria in Trastevere is steeped in history, primarily due to the magnificent Basilica of Santa Maria in Trastevere, which has stood on this site for centuries. Thought to be one of Rome's oldest churches, with foundations possibly dating back to the 3rd century, it holds immense religious and architectural significance. The central fountain is believed to be the oldest in Rome, with origins potentially from the 8th century, though it has been reconstructed over time. The piazza has long been a central gathering place for the Trastevere community, witnessing countless historical events and daily life unfold. Its medieval charm, combined with the ancient church and fountain, offers a tangible connection to Rome's rich past, making it a living testament to the city's enduring heritage.",
            "Piazza di Santa Maria in Trastevere truly shines during its many events, embodying the lively spirit of the neighborhood. It's a popular spot for local festivals and religious celebrations, where the piazza fills with music, traditional food stalls, and a joyful atmosphere. The steps of the fountain often become a stage for street musicians and performers, drawing appreciative crowds. In the evenings, especially during summer, the piazza transforms into a vibrant hub for impromptu gatherings and casual meet-ups, where the basilica's illuminated facade adds a magical glow, making any event here feel authentically Roman and full of life."
        ],
        "links": [
            {"title": "Wikipedia", "url": "https://it.wikipedia.org/wiki/Piazza_di_Santa_Maria_in_Trastevere"},
            {"title": "Google Maps", "url": "https://www.google.it/maps/search/Piazza+di+Santa+Maria+in+Trastevere"}
        ],
    },
    "testaccio-market": {
        "image": "img/places/testaccio_market.jpg",
        "lat": 41.877826417225435,
        "lon": 12.473822834124029,
        "short_description": [
            "The Mercato di Testaccio is a vibrant and modern market in Rome, a true gastronomic paradise that beautifully blends tradition with contemporary flair. Housed in a striking, purpose-built structure, it offers a sensory feast of sights, sounds, and smells. Here, you'll find an incredible array of fresh produce, high-quality meats, cheeses, and baked goods from local vendors. What truly sets it apart are the numerous food stalls and small eateries, where you can savor authentic Roman street food, gourmet sandwiches, and international flavors, making it a fantastic spot for both shopping and a delicious meal.",
            "For couples, Mercato di Testaccio offers a unique and delicious experience. It's a great spot for a casual and fun date, where you can explore the various food stalls together and share different dishes. Couples can wander through the aisles, tasting local specialties, and enjoying the lively atmosphere. It's an excellent opportunity to discover new flavors and bond over a shared love for food. Whether grabbing a quick bite or piecing together a varied lunch, the market provides a relaxed and engaging setting for couples to enjoy authentic Roman culinary delights.",
            "The Mercato di Testaccio is historically significant as it stands on the site of Rome's former slaughterhouse (Mattatoio) and is located in the Testaccio neighborhood, which itself is built upon Monte Testaccio, an artificial hill made of ancient Roman amphora fragments. This area has long been a working-class district with deep roots in Rome's culinary and industrial history. The modern market, inaugurated in 2012, was designed to preserve the spirit of the traditional Roman market while providing a clean and organized space. It represents a contemporary evolution of a centuries-old tradition of trade and food culture in this historically important part of the city, offering a tangible link to Rome's practical and gastronomic past.",
            "The Mercato di Testaccio often hosts lively and delicious events that celebrate Roman culinary culture. Beyond the daily market buzz, you'll find food festivals, cooking demonstrations, and themed culinary evenings that draw food lovers from all over. These events often feature local chefs showcasing traditional Roman recipes, artisanal producers offering tastings, and live music creating a festive atmosphere. The market's modern yet authentic setting makes it a fantastic venue for experiencing Rome's vibrant food scene, turning a simple visit into an engaging and tasty cultural event."
        ],
        "links": [
            {"title": "Wikipedia", "url": "https://it.wikipedia.org/wiki/Testaccio"},
            {"title": "Google Maps", "url": "https://www.google.it/maps/search/Mercato+di+Testaccio"}
        ],
    },
    "villa-ada": {
        "image": "img/places/villa_ada.jpg",
        "lat": 41.9338192644564,
        "lon": 12.502230665600289,
        "short_description": ["Villa Ada stands as one of Rome's most enchanting green spaces, offering a captivating blend of natural beauty, serene landscapes, and a rich historical tapestry. As the city's second-largest public park, its sprawling 180 hectares are a verdant escape from the urban hustle. Visitors are greeted by a diverse array of ancient trees, including majestic stone pines and holm oaks, alongside picturesque walking paths that wind through lush greenery. The park's artificial lake, where you can rent canoes, adds to its tranquil allure, reflecting the surrounding foliage and providing a peaceful spot for relaxation or a leisurely stroll. The sheer expanse and variety of landscapes make Villa Ada a truly beautiful and rejuvenating destination.","For couples seeking a romantic retreat, Villa Ada offers an idyllic setting. Its vastness allows for intimate moments amidst nature, far from crowded city streets. Couples can wander hand-in-hand along secluded trails, enjoy picnics on sprawling lawns, or simply find a quiet bench by the lake to soak in the peaceful atmosphere. The natural beauty and tranquil ambiance create a perfect backdrop for shared experiences, whether it's a leisurely bike ride, a paddleboat excursion on the lake, or simply enjoying the company of one another surrounded by Rome's natural splendor. The feeling of being 'away from it all' while still within the city limits makes it a popular choice for romantic outings.", "Beyond its natural charm, Villa Ada boasts a fascinating history, primarily as a former royal residence. In the latter half of the 19th century, it was owned by the Italian royal House of Savoy, serving as their private estate and residence. King Vittorio Emanuele II and later King Vittorio Emanuele III made significant contributions to the property, shaping its layout and adding various architectural elements. The park even briefly passed into the hands of Swiss Count Tellfner, who named it 'Villa Ada' in honor of his wife. Today, while a portion remains private and houses the Egyptian Embassy, the majority of the park is publicly accessible. This historical lineage adds a layer of depth to the park, allowing visitors to walk the same grounds once enjoyed by royalty and to explore remnants of its grand past, including the Villa Reale and the historic bunker, which are now open for tours. Villa Ada truly represents a living piece of Roman history.", "Villa Ada truly comes alive with the various events it hosts throughout the year, especially during the warmer months. Its sprawling natural amphitheater becomes a spectacular stage for concerts and music festivals, drawing crowds to enjoy performances under the stars. The vast lawns are perfect for open-air cinema screenings and cultural gatherings, where families and friends can relax amidst the ancient trees. These events, set against the backdrop of the park's natural beauty and historical grandeur, transform Villa Ada into a vibrant hub of community and entertainment, offering unforgettable experiences in a truly enchanting setting."],
        "links": [
            {"title": "Wikipedia", "url": "https://it.wikipedia.org/wiki/Villa_Ada"},
            {"title": "Google Maps", "url": "https://www.google.it/maps/search/Villa+Ada+Roma"}
        ],
    },
    "coppede-quarter": {
        "image": "img/places/coppede.png",
        "lat": 41.91899875205747,
        "lon": 12.50231393858818848,
        "short_description": [
            "The Coppedè Quarter is a truly unique and whimsical architectural complex in Rome, unlike anything else in the city. Designed by architect Gino Coppedè in the early 20th century, it's not a traditional piazza but a collection of fairy-tale-like buildings, fountains, and archways that blend Art Nouveau, Baroque, and even medieval styles. Dominated by the Fountain of the Frogs and the grand archway connecting Via Tagliamento to Via Brenta, the quarter is a delightful visual spectacle. Every corner reveals intricate details: mythological figures, gargoyles, frescoes, and mosaic work, making it a hidden gem for those seeking something magically different from classical Rome.",
            "For couples, the Coppedè Quarter offers a wonderfully whimsical and romantic escape. It's a fantastic place for a unique stroll, where you can feel transported to another world. The fantastical architecture provides an enchanting backdrop for photos and intimate conversations. Couples can marvel at the intricate details of the buildings, sit by the charming Fountain of the Frogs, or simply get lost in the storybook atmosphere. It's a perfect spot for those who appreciate art, history, and a touch of the extraordinary, offering a memorable and less crowded romantic experience.",
            "The Coppedè Quarter holds significant historical and architectural importance as a prime example of early 20th-century Italian eclectic architecture. Created between 1913 and 1927 by Gino Coppedè, it represents a distinct departure from Rome's more common classical and Baroque styles. Its historical significance lies in its bold artistic vision, blending diverse influences to create a coherent yet fantastical urban space. The quarter's buildings were primarily residential, intended for the upper-middle class, reflecting the era's taste for elaborate design. Today, it stands as a testament to Coppedè's genius and a well-preserved example of a unique architectural movement, offering a glimpse into a less-explored chapter of Rome's urban development.",
            "The Coppedè Quarter, with its fantastical architecture, serves as an extraordinary backdrop for more niche and visually oriented events. It's a prime location for architectural tours and photography workshops, where the intricate details of its buildings are the main focus. Occasionally, it hosts small-scale artistic performances, fashion shoots, or themed cultural walks that leverage its unique, storybook ambiance. The inherent beauty and whimsical nature of the quarter make any event held within its bounds feel like stepping into a magical realm, offering a truly distinctive experience for visitors."
        ],
        "links": [
            {"title": "Wikipedia", "url": "https://it.wikipedia.org/wiki/Quartiere_Copped%C3%A8"},
            {"title": "Google Maps", "url": "https://www.google.it/maps/search/Quartiere+Copped%C3%A8+Roma"}
        ],
    },
}

def place_view(request, placeName): 
    place = Place(placeName)
    details = PLACE_DATA[placeName]

    context = {
        "name": place,
        "image": details["image"],
        "lat": details["lat"],
        "lon": details["lon"],
        "description_paragraphs": details["short_description"],
        "links": details["links"]
    }

    return render(request, "events/place.html", context)
