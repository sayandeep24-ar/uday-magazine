export interface Article {
  id: string;
  title: string;
  author: string;
  section: 'Hindol' | 'Deepak' | 'Megha' | 'Shri' | 'Photographs' | 'Artwork';
  genre: 'Poetry' | 'Prose' | 'Essay' | 'Short Story' | 'Review' | 'Philosophy' | 'Hindi Poetry' | 'Regional';
  pageNumber?: number;
  snippet: string;
  fullText: string;
  language?: 'English' | 'Hindi' | 'Marathi' | 'Bengali' | 'Multilingual';
  artCredit?: string;
  illustrationUrl?: string;
}

export interface Volume {
  id: string;
  volumeNumber: number;
  year: number;
  title: string;
  theme: string;
  coverImage: string;
  editorInChief: string;
  downloadUrl: string;
  isLatest: boolean;
  pagesCount: number;
}

export const PAST_VOLUMES: Volume[] = [
  {
    id: 'vol-11',
    volumeNumber: 11,
    year: 2024,
    title: 'The Ascent',
    theme: 'The Changing Seasons & Classical Indian Ragas (Hindol, Deepak, Megha, Shri)',
    coverImage: '/uday-logo.png',
    editorInChief: 'Aayush Anand',
    downloadUrl: '#',
    isLatest: true,
    pagesCount: 84
  },
  {
    id: 'vol-10',
    volumeNumber: 10,
    year: 2023,
    title: 'Metamorphosis',
    theme: 'Resilience, Scientific Renaissance & Post-Isolation Narratives',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    editorInChief: 'Editorial Board',
    downloadUrl: '#',
    isLatest: false,
    pagesCount: 76
  },
  {
    id: 'vol-9',
    volumeNumber: 9,
    year: 2022,
    title: 'Echoes of the Plateau',
    theme: 'Ecology, Solitude, and Campus Natural History',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    editorInChief: 'Editorial Board',
    downloadUrl: '#',
    isLatest: false,
    pagesCount: 68
  },
  {
    id: 'vol-8',
    volumeNumber: 8,
    year: 2021,
    title: 'Cosmic Horizons',
    theme: 'Astrophysics, Creative Inquiry & The Boundaries of Thought',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    editorInChief: 'Editorial Board',
    downloadUrl: '#',
    isLatest: false,
    pagesCount: 64
  }
];

export const EDITOR_LETTER = {
  title: "Letter from the Editor",
  author: "Aayush Anand",
  role: "Chief Editor, Uday 2024",
  text: `The journey was long, but we now finally arrive at the destination. Coursing its way through the different aspects of the magazine, the team put in prodigious amounts of efforts to bring to you this edition of Uday. I feel felicitous to being the Chief Editor of this beautiful edition that could harbour and reflect the creativity of the community members.

This edition indeed took more time than what was expected but I'm glad that the result turned out to be quite laudable. The final phase of the magazine proved the toughest, but here we still stand. I am sure all the efforts the people involved with this edition have put in, will get to the audience it deserves and shall make an impact. Magna est veritas et praevalebit. I would also like to express my gratitude towards Dr. Renny Thomas for his continued assistance and support throughout the process.

The theme of this year's edition was chosen as the changing seasons. This is quite evident with our cover page, thanks to Abhishek, for designing it. Having situated in the heart of the country, our campus experiences the best of all the seasons and we see how beautifully the canvas of the landscape transitions throughout the year, from colourful and fragrant flowers in spring and early summer to lush green trees in the monsoons to dry and gloomy in the winters. We have tried our best to bring this concept into paper through this edition. As you can see from the title page itself, stands a painting by Edward John Poynter from 1894 depicting the Horae or the goddesses of the seasons in ancient Greek mythology who depicted the natural portions of time. We have also named the sections based on the Ragas from our Indian Classical Music based on their prevalence and time of the year they are sung in.

Stamus contra malum.
Now, move on and go read some real stuff!

Cheers,
Aayush Anand`
};

export const SECTION_DETAILS = {
  Hindol: {
    ragaName: "Raga Hindol",
    season: "Spring / Early Summer",
    mood: "Young Love, Awakening, Blossoming",
    description: "To celebrate the coming of spring, Krishna sits on the swing with his beloved Radha as their companions, the cowherd boys and milkmaids, play music, dance, admire the idyllic couple, and keep their swing gently in motion. In Sanskrit, hindola means swing. Music played in the Hindola Raga elicits the fever of young love in springtime."
  },
  Deepak: {
    ragaName: "Raga Deepak",
    season: "Summer Nights & Fire",
    mood: "Passion, Intensity, Endurance",
    description: "The Deepak Raga is associated with night and is meant to evoke the mood of intimacy between lovers. Typically, depictions of this raga incorporate fire imagery, taking the form of women holding lamps in mapped architectural spaces."
  },
  Megha: {
    ragaName: "Raga Megha",
    season: "Monsoon",
    mood: "Thunder, Yearning, Introspection",
    description: "Megh is a Hindustani classical raga. The meaning of 'megh' in Sanskrit is 'cloud'. Hence this raga is sung or played in the monsoon season, echoing gathering storm clouds and the rhythm of falling rain."
  },
  Shri: {
    ragaName: "Raga Shri",
    season: "Late Autumn & Winter",
    mood: "Wisdom, Harvest, Contemplation",
    description: "Shri raga is conceived in sentiment, of whom all learned men sing praises. Poppies bloom in formal gardens below pure white terraces, echoed by oranges on windows at twilight."
  },
  Photographs: {
    ragaName: "Visual Chronicles",
    season: "All Seasons",
    mood: "Framed Reality, Light and Shadow",
    description: "Capturing the architectural nuances, birdlife, and sweeping plateau horizons of the IISER Bhopal campus through the sensitive lens of student photographers."
  },
  Artwork: {
    ragaName: "Color & Form",
    season: "Expressions",
    mood: "Surrealism, Traditional Ink, Watercolors",
    description: "A breathtaking gallery of student fine art, acrylics, traditional mandalas, and psychological portraiture reflecting the human spirit."
  }
};

export const FEATURED_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The Miracle of Birth',
    author: 'Nitika Chandra',
    section: 'Deepak',
    genre: 'Short Story',
    pageNumber: 27,
    language: 'English',
    snippet: 'Quite simply, this is the story of a tree. It was planted in the 19th century by a couple over the grave of their infant child, hoping that the plant would experience life...',
    fullText: `Quite simply, this is the story of a tree.
It was planted in the 19th century by a couple over the grave of their infant child, taken away from them before having a chance to understand and experience the world. They planted the sapling, hoping that the plant would experience life in a way their child never could.

They hoped to give their child the gift of life. And they succeeded, for the sapling grew inch by inch, every year, nourished by the decay. When its leaves wilted and drooped, with the soil around it cracked and dry, the child experienced what it felt like to be parched. When the rain finally comes down, the child experiences the sheer relief that could only come when his throat is dry, and the first drop of water eases the discomfort such that he cannot stop drinking until he has had his fill.

And when nature is not being kind. When rain refuses to come down, and the leaves are drooping and dejected, desperate with the need for water, a 5-year-old girl empties her bottle over the unfortunate plant in an innocent display of affection. It is then that the child experiences the kindness of a stranger.

He experiences what it means to be on the receiving end of small acts that seem of little consequence and are performed in the heat of the moment but are the most extensive display of love. He experiences the gift of friendship. The squirrels, the ants, the dogs, the bees, the butterflies, the birds. He understands, then, that one cannot survive in isolation.

Furthermore, the sapling grows. It grows until it blossoms into a beautiful tree with wide spreading branches, a thick, smooth trunk, and a far-reaching network of roots that run deep beneath the ground. It grew, as did the world around it...

As the years passed by, the scenery changed. A park developed around it. The trimmed grass with a bench erected underneath it, a neat row of flowers on either side. The shouts of children engrossed in play, the chatter of people. The honking of cars. The occasional drone of an aeroplane or the siren of an ambulance.

And still, the tree remained. And, it flourished. It was then that the child experienced and understood the importance of the transient nature of things as well as the permanence of others.`
  },
  {
    id: 'art-2',
    title: 'Science, Subjectivity and Sociology',
    author: 'Dipak Kr Chakraborty',
    section: 'Megha',
    genre: 'Essay',
    pageNumber: 52,
    language: 'English',
    snippet: 'How may one study the meaning and implications of scientific research or doing science? Bruno Latour pointed out that science studies scholars faced an "inescapable paradox"...',
    fullText: `How may one study the meaning and implications of scientific research or doing science? This has been one of the crucial questions that have intrigued science studies scholars for a long time. Since the publication of Thomas Kuhn's The Structure of Scientific Revolutions in the 1960s, contextualizing scientific discoveries within particular socio-political paradigms has become paramount.

However, science studies scholars, especially those from the sociology discipline, were not merely contented with the discussion of the social context of science research. Unlike their older compatriots, this new generation of sociologists believes that engaging with their daily experiences and processes of practicing science is essential to interpret how scientists do science. In other words, the older sociological tradition like that of Robert Merton's (1910-2003) was satisfied simply by considering the sociality of science containing particular ethos (like universalism, communism, disinterestedness, and organized skepticism) in their analysis.

On the other hand, the new sociological tradition (which arose during the 1960s–1970s) emphasized that to understand its social implications properly, one needs to consider both the content and context of scientific research. However, the issue of considering the content of science has its difficulty. Sociologists often do not necessarily possess the skill to understand various complexities associated with laboratory work vis-à-vis scientific research's technicalities.

For sociologists, studying science either as an 'insider' or an 'outsider' posed a unique challenge. As an 'insider', they were in danger of becoming too immersed in science to produce objective understanding in their analysis. On the other side, doing science studies as an 'outsider' could put them into perpetual ignorance about the actual operations of the scientists. Thus, as Bruno Latour pointed out, science studies scholars often faced an 'inescapable paradox': they had to balance going closer to and getting away from science. Latour argued that scientists were not necessarily unconscious of the context in which they were doing science.`
  },
  {
    id: 'art-3',
    title: 'In Appreciation of Soulsborne',
    author: 'Siddhant Patra',
    section: 'Shri',
    genre: 'Review',
    pageNumber: 64,
    language: 'English',
    snippet: 'Imagine you’re a character in an unknown world, governed by eccentric rules. Elden Ring and Dark Souls present an environmental storytelling that no traditional novel can rival...',
    fullText: `Imagine you’re a character in an unknown world, which is governed by a set of eccentric rules and ways. Stark unimaginable in all ways possible. I suppose that’s the typical fantasy setting. Now, let us say you are going to experience a series of events featuring massive depressions, struggles and victories, and somewhere, the fate of this universe is tied with you.

The main character of every fantasy is usually faced with such fodder tasks. But wait, shouldn’t you know about the immortal being sitting at the edge of time who has the key to beginning a new age of reformation for your broken world? Oh wait, you’re a soldier living the average soldier life. Ah, the all-knowing wizard! He’ll show up, he always does! He isn’t? You have to figure everything out?

Being a reader or consumer of fantasy media is an interesting business. As the consumer, we are given convenient hints, information and lore that would make the story barely comprehensible. However, it can’t be helped when one wonders, what do the characters feel like? Their scopes are small, knowledge meagre and goals uncertain.

And thus, the problem, is there no media in existence that realistically portrays our character’s experience? The answer is Soulsborne games. Yes, the weird video game. Soulsborne is a series of games produced by the company FromSoftware, typically known for their high difficulty. Elden Ring—published in 2022 after a significant dearth of releases—is possibly the FromSoftware game that most people are familiar with.

Environmental storytelling is less direct. Instead of explicitly describing events, environmental storytelling shows the final outcome of a sequence of events, then it invites players to make up their own stories about what happened to cause that outcome. Bloodborne, out of all the Soulsborne games, is said to epitomize Lovecraftian Horror. To claim that existence precedes essence is to assert that there is no such predetermined essence to be found in an individual, and that an individual's essence is defined by the individual.`
  },
  {
    id: 'art-4',
    title: 'Mother',
    author: 'Advait Kulkarni',
    section: 'Hindol',
    genre: 'Poetry',
    pageNumber: 22,
    language: 'English',
    snippet: 'It was my worst day, For all my fears had come true, For once in my life There was nothing but a dark hue...',
    fullText: `It was my worst day,
For all my fears had come true,
For once in my life
There was nothing but a dark hue.

I cried and cried,
Till I felt utter dejection,
With a lack of confidence,
And lack of conviction.

Before I almost gave up,
A sweet voice struck my ear.
Out of all the screams from the audience,
That voice was rather familiar.

It asked me just to keep going
And that I was doing great!
They were such simple words,
But they gave me a sudden, magical motivation.

That motivation remains in my mind
Those words so beautiful, so kind.
I know who it was: my amazing Mother!`
  },
  {
    id: 'art-5',
    title: 'परिवर्तन को अपनाना: जीवन में शरद ऋतु का दार्शनिक पक्ष',
    author: 'हिमालय मिश्रा',
    section: 'Hindol',
    genre: 'Hindi Poetry',
    pageNumber: 24,
    language: 'Hindi',
    snippet: 'शरद ऋतु, रंगों की अपनी शानदार श्रृंखला और पत्तियों के कोमल आगमन के साथ, जीवन की जटिल सुंदरता और अपरिहार्य परिवर्तनों के लिए एक गहन रूपक के रूप में कार्य करती है...',
    fullText: `शरद ऋतु, रंगों की अपनी शानदार श्रृंखला और पत्तियों के कोमल आगमन के साथ, जीवन की जटिल सुंदरता और अपरिहार्य परिवर्तनों के लिए एक गहन रूपक के रूप में कार्य करती है। इस ऋतु में प्रकृति अस्तित्व के बारे में गहरी दार्शनिक अंतर्दृष्टि प्रदान करती है। जैसे पेड़ खूबसूरती से अपने पत्ते छोड़ते हैं, हमें याद दिलाया जाता है कि परिवर्तन को प्रतिरोध के साथ नहीं बल्कि स्वीकृति की भावना के साथ स्वीकार करें, यह समझते हुए कि नश्वरता हमारे जीवन के ताने-बाने में बुनी हुई है।

शरद ऋतु का क्षणिक वैभव हमारे अपने अनुभवों की क्षणभंगुर प्रकृति को प्रतिबिंबित करता है। इसके जीवंत रंग, हालांकि क्षणिक हैं, हमें हर गुजरते पल का आनंद लेना सिखाते हैं, यह पहचानते हुए कि जीवन भी क्षणभंगुर अध्यायों की एक श्रृंखला है।

इसके अलावा, शरद ऋतु कृतज्ञता की भावना का प्रतीक है। यह फसल का मौसम है, धैर्य और परिश्रम से पोषित प्रकृति की प्रचुरता का उत्सव है। इसी तरह, जीवन का आशीर्वाद हमारे प्रयासों का परिणाम है, जो हमें उस समृद्धि के लिए आभार व्यक्त करने की याद दिलाता है जो हमारी यात्रा को सुशोभित करती है।`
  },
  {
    id: 'art-6',
    title: 'How a homeless teen created Louis Vuitton?',
    author: 'Anushika Singh',
    section: 'Deepak',
    genre: 'Essay',
    pageNumber: 33,
    language: 'English',
    snippet: 'In 1834, a 13-year-old kid left his home to seek his fortune. Unaware of the consequences ahead, the little boy walked 292 miles on foot to Paris...',
    fullText: `In 1834, a 13-year-old kid left his home to seek his fortune. Unaware of the consequences ahead and destiny’s plan, the little boy walked away to fulfill his dream for a better future. His heritage as a trunk maker preceded even the founding of a well-known luxury brand. He was none other than the founder of the iconic fashion house “LOUIS VUITTON”.

The story started on 4th August 1821 in Anchay, a small remote village in the mountainous region of eastern France, with the birth of Louis Vuitton. His father, Xavier Vuitton, was a farmer, and his mother, Coronne Vuitton, was a miller. In 1834, unhappy with his provincial life, he left home at the age of 13 to seek his fortune, travelling on foot towards Paris. On his way, he took odd jobs to support himself. He travelled 292 miles from his hometown to Paris, which took him more than two years.

In 1837, at the age of 16 he reached Paris. The Industrial Revolution was in full swing, and people were offered many professional growth opportunities. He decided to become a trunk master. In 1858, he introduced a rectangular shaped trunk with a flat lid for easier stacking on trains and steamships, replacing heavy leather with lightweight, waterproof Trianon canvas—revolutionizing global travel luxury.`
  },
  {
    id: 'art-7',
    title: 'A Letter from 2100',
    author: 'Athulya Gopi',
    section: 'Shri',
    genre: 'Prose',
    pageNumber: 58,
    language: 'English',
    snippet: 'Dusk has fallen. The tints of sky waved at me with a luring mysterious smile. These days are turning more obscure filled with frightless fights, strange silence...',
    fullText: `Dusk has fallen.
The tints of sky waved at me with a luring mysterious smile.
These days are turning more obscure filled with frightless fights, strange silence and alarming agonies.
Here I am, wretched and unaware of what awaits for me!
Panting through the fiery time of the day when the fireball is a real savage, I could feel those alarm bells from the past.
Last twenty years have witnessed quicker changes through flood, a drought, extreme snowfalls, cold waves, heatwaves being broken by thunderstorms and more of the same.

Pointing at me, once he told his son, “Don’t hold feelings for it, Beta.. It’s just a tree!” The kid was hugging me to save me from the teeth of the axe blade. He adored me for the delish fruits and I loved him back too.

It all started with my white blooms which turned into ruthless, smoky grey. Trailing through my way beneath the soil in quest of ‘drops of life’, I could sense the nearest dark future. Life without life is the worst misery one can ever go through.

Up in the sky, the miracles twinkled and the bird began to sing out loud in its melancholic voice –
“Behold! when the Sun peeks out
And throw light to break the shadow.
He'll see the vanishing meadow, Wrinkled land and steaming air.
Behold! He's your own heir!
With sweat and shiver He stands,
With fear and ill He stays!
Yes! He’s the future, He’s you!
Wait not for miracles’ drive,
For you to heed and thrive!”`
  },
  {
    id: 'art-8',
    title: 'कोपरा धरणारी मुलगी',
    author: 'चिन्मयी गोस्वामी',
    section: 'Hindol',
    genre: 'Regional',
    pageNumber: 17,
    language: 'Marathi',
    snippet: 'एक मोwidth मोठा दिवाणखाना, त्यातून जाणारा वेटोळा जिना, त्या जिन्याच्या एका कोपऱ्यात एक मुलगी बसलेली दिसतेय... मोठा गोल चष्मा, दोन झिट्टू...',
    fullText: `एक मोwidth मोठा दिवाणखाना, त्यातून जाणारा वेटोळा जिना, त्या जिन्याच्या एका कोपऱ्यात एक मुलगी बसलेली दिसतेय... मोठा गोल चष्मा, दोन झिट्टू, गोड फ्रॉक घातलेला.. नाकावर घसरणारा चष्मा आणि झिट्टूत न बसणारे आणि त्यामुळेच डोळ्यांवर येणारे केस सावरत ती वाचत बसलीय.. तहानभूक हरपून, वेळ काळाचं भान विसरून.. समांतर भिंतीवरच्या खिडकीतून येणारं ऊन जसं जसं सरकेल तसा तसा कोपरा बदलते ती - पुस्तकावरून नजरही न हटवता!!

हाका येतात आईच्या, "अगं, चल ताटं वाढलीयत".. शेवटी तिसऱ्या हाकेला, "अं.. हो येते एवढं प्रकरण संपवून" असं काहीसं तुटक पुटपुटते.. आईपर्यंत ते पोहचत सुद्धा नाही... अक्खं पुस्तक संपल्याशिवाय ही जागची हालणार नाही हे एव्हाना कळून चुकलेलं असतं.

प्रहर बदलतात, तशी आता ती हळूहळू पसरते पायरीवर तिथेच, जमेल तशी.. पुस्तक दोन हातांनी वर धरून वाचण्याचा प्रयत्न करते.. पान बदलेल तशी कूस बदलते.. आणि शेवटचं पान येतं: पुस्तक संपतं आणि टपोऱ्या डोळ्यातून टपोरे थेंब ओघळतात.. मुकपणे फ्रॉकच्या कड्याने ती ते टिपते आणि शांत डोळे मिटते!`
  },
  {
    id: 'art-9',
    title: 'The Unfortunate Divinity',
    author: 'Aayush Anand',
    section: 'Shri',
    genre: 'Short Story',
    pageNumber: 61,
    language: 'English',
    snippet: 'Smoke filled the room. Water kept dripping down from her eyes, but she maintained her pace to blow harder in the blowpipe to ignite the chulha...',
    fullText: `Smoke filled the room. Water kept dripping down from her eyes, but she maintained her pace to blow harder in the blowpipe to ignite the chulha. She heard a few coughs from the other side of the room, but the mother was helpless and had no other option. She was still busy investing her efforts at the blowpipe when the door opened, its hinges squeaking out loud their thirst for oil.

Completely inebriated, the man pretended to have control over his walk, which only lasted a few seconds until he tripped over the filled cooking pot, slipping a few cut pieces of okra out on the floor. The woman eyed him through the corner, ignoring every aspect of his presence.

"I need money!" he demanded.
"What for?" the woman asked though she had already predicted the response.
"I need to buy more drinks!"

For the first time since he arrived, his bloodshot eyes met the equally red ones of the other. The man hesitated a bit but then growled to assert authority and domination.
"We both have lost our jobs, and there's no source of income. We hardly have anything left to thrive on! We don't know how far we'll be able to go, and you want to squander off all we are left with on petty drinks?"

Her words had viciously hurt his male ego. The horror of what was going to happen filled the room. The three sets of eyes that had been staring down at their parents, now held each other closer.
Mixed with the gut-wrenching wailing of her children, she remembered what she had once been told: "Always treat your husband with dignity." But her heart recognized that what exited now through that door were the steps of the devil.`
  },
  {
    id: 'art-10',
    title: 'बचपन की यादें',
    author: 'महार्णब गोस्वामी',
    section: 'Hindol',
    genre: 'Hindi Poetry',
    pageNumber: 18,
    language: 'Hindi',
    snippet: 'वो कागज़ की कश्ती, वो बारिश का पानी, कुछ जी भरके जीए हुए पल, थोड़ी मायूस कहानी...',
    fullText: `वो कागज़ की कश्ती, वो बारिश का पानी,
कुछ जी भरके जीए हुए पल, थोड़ी मायूस कहानी।
ऐसा ही रहा होगा बचपन हम सभी का,
कुछ मीठे लम्हे, और थोड़ी शैतानी।

वो पापा के पीछे हर रोज़ दरवाज़े तक जाना,
जब वो ऑफिस जाते थे, तब मम्मी के साथ दिन बिताना।
वो निराश होकर कुछ तोड़ देना, फिर पापा की डाँट और मम्मी का सहलाना,
रात को सोते वक्त दादी की वो कहानियाँ, दिल में अब भी ताज़ी हैं।

वो पहली बार क्रिकेट की गेंद पकड़ना,
टीवी पर क्रिकेटर्स को देख के उनकी नकल करना,
दिनभर घरवालों को सताना, और फिर चुपके से सो जाना।

अब बचपन सिर्फ यादों में ही है
पर उसी उमंग के साथ सारी उम्र बितानी है,
कि यही तो जिंदगी है, और यही जिंदगी जीने का मज़ा भी है।`
  },
  {
    id: 'art-11',
    title: 'The Enigma',
    author: 'Prateek Sarangi',
    section: 'Deepak',
    genre: 'Poetry',
    pageNumber: 31,
    language: 'English',
    snippet: 'I tried to write of things divine, But fell short with every line, The sun and land, sky and sea, Mere mortals can\'t quite aptly see...',
    fullText: `I tried to write of things divine,
But fell short with every line,
The sun and land, sky and sea,
Mere mortals can't quite aptly see.

The music's beat and art's display,
I can't express in words today,
People, too, with tales untold,
Their mysteries I cannot unfold.

But even though my words fall flat,
I'll still write on, just like that,
For in these lines, though incomplete,
Myself, you may just happen to meet.

I'll try to capture thoughts unspoken,
And weave them into rhymes unbroken,
For in these words that I have penned,
A glimpse of me may just extend.

And maybe in these humble rhymes,
Some truths may still shine through the times,
For even though my words may falter,
My heart still beats with every letter.`
  },
  {
    id: 'art-12',
    title: 'मैं शून्य हूँ',
    author: 'वैष्णवी त्रिपाठी',
    section: 'Shri',
    genre: 'Hindi Poetry',
    pageNumber: 73,
    language: 'Hindi',
    snippet: 'जब समय भी न जन्मा था, सब कुछ शून्य में सिमटा था। जब शून्य था बिखरा, नया जीवन था निखरा...',
    fullText: `जब समय भी न जन्मा था, सब कुछ शून्य में सिमटा था।
जब शून्य था बिखरा, नया जीवन था निखरा।
अनंत से अनंत तक, था सब कुछ शून्य से ही उपजा

पूछते हैं जब लोग मुझसे, मैं कौन हूँ?
हौले से कहती हूँ, मैं शून्य हूँ।
कभी खुद ही खुद में सिमट के रहूँ,
कभी खुद ही खुद का विस्तार पा लूँ। मैं शून्य हूँ।
आगे साथ चल के पहचान बना न सकूँ,
पीछे साथ चलूँ तो नयी श्रृंखला बना दूँ।
मैं शून्य हूँ।`
  }
];

export interface FacultyAdvisor {
  name: string;
  designation: string;
  department: string;
  email: string;
  tenure?: string;
}

export interface PortalWebLead {
  name: string;
  role: string;
  email: string;
  bio?: string;
  notes?: string;
}

export interface LeadTeamMember {
  id?: string;
  name: string;
  role: string;
  major: string;
  bio: string;
}

export interface ContactDetails {
  officialEmail: string;
  contactPhone: string;
  campusLocation: string;
  officeRoom: string;
  consultationHours: string;
  copyrightNotice?: string;
}

export interface TeamAndContact {
  facultyAdvisor: FacultyAdvisor;
  portalWebLead: PortalWebLead;
  contactDetails: ContactDetails;
  leadTeam: LeadTeamMember[];
  editorialEnglish: string[];
  editorialHindi: string[];
  reporters: string[];
  designers: string[];
  studentAdvisors: string[];
  lastUpdated?: string;
}

export const EDITORIAL_BOARD: TeamAndContact = {
  facultyAdvisor: {
    name: "Dr. Renny Thomas",
    designation: "Faculty Advisor",
    department: "Assistant Professor, Department of Humanities and Social Sciences (HSS), IISER Bhopal",
    email: "renny@iiserb.ac.in",
    tenure: "Current"
  },
  portalWebLead: {
    name: "Souradip",
    role: "Portal & Web Lead",
    email: "sayandeep.biswas04@gmail.com",
    bio: "Oversees the web architecture, digital publications, and portal infrastructure for UDAY Magazine."
  },
  contactDetails: {
    officialEmail: "udaymagz@iiserb.ac.in",
    contactPhone: "+91 (0755) 269-2400",
    campusLocation: "Indian Institute of Science Education and Research (IISER) Bhopal, Bhopal Bypass Road, Bhauri, Bhopal - 462066, Madhya Pradesh, India",
    officeRoom: "Institute Magazine Office, SAC Building, IISER Bhopal",
    consultationHours: "Mon-Fri, 4:00 PM – 6:00 PM",
    copyrightNotice: "Designed & Developed by Souradip & Sayandeep. © 2024 UDAY Magazine. IISER Bhopal. All rights reserved."
  },
  leadTeam: [
    {
      id: "lead-1",
      name: "Aayush Anand",
      role: "Editor-in-Chief",
      major: "Chemistry Major",
      bio: "Although he is majoring in Chemistry, Aayush has a special fondness for languages and literature. If you don't find him reading a book, you will definitely find him adding one to his cart."
    },
    {
      id: "lead-2",
      name: "Anamika Singh",
      role: "Hindi Editor-in-Chief",
      major: "Economics Major",
      bio: "Her interests lie in contributing to solutions seeking empowerment of women and challenging social norms. She finds solace in poetry and verses capturing human triumph."
    },
    {
      id: "lead-3",
      name: "Maya Katti",
      role: "Head of Reports",
      major: "Biological Sciences Major",
      bio: "Will stop you every minute to look at a bird. Her knack for meticulous organization keeps her grounded, observing every nuance of campus life."
    },
    {
      id: "lead-4",
      name: "Geethanjli R",
      role: "PR and Social Media Head",
      major: "Student Ambassador",
      bio: "Can chat for hours with friends, bringing stories to life across institute portals and public dialogues."
    },
    {
      id: "lead-5",
      name: "Raj Mishra",
      role: "Design Head",
      major: "Physics Major",
      bio: "Highly interested in biophysics and cinema. Translates aesthetic balance and rhythm onto every printed page of Uday."
    },
    {
      id: "lead-6",
      name: "Souradip",
      role: "Portal & Web Lead",
      major: "Web & Systems Architect",
      bio: "Lead developer for the UDAY Magazine digital portal, archive databases, and online release platform."
    }
  ],
  editorialEnglish: ["Siddhant Patra", "Kaustubh Nyati", "Kshitij Dalal", "Kritika Pahilajani", "Sneha Shree", "Akshat Pandey", "Sreejit Bakshi"],
  editorialHindi: ["Himanshu Mishra", "Kshitij Dalal", "Vaishnavi Tripathi", "Ishita Borthakur", "Aadarsh"],
  reporters: ["Chirag Sharma", "Samba Siva Reddy", "Ilesha Ojha", "P S Rishi", "Aditya Pratap Singh"],
  designers: ["Neeshma K P", "Abhishek Thakur"],
  studentAdvisors: ["Hitaishi Desai", "Md Ishaque Khan"]
};
