/* ==================================================================
   PANINI · FIFA WORLD CUP 26 — official 980-sticker album
   9 Intro foils + 11 FIFA Museum foils + 48 nations × 20 = 980.
   Per nation: #1 Team Logo (foil), #2–12 players, #13 Team Photo,
   #14–20 players. Names are from the official checklist.
   ================================================================== */

// Intro foils (00 + FWC1-FWC8)
const INTRO = [
  ["00","Panini Logo"],["FWC1","Official Emblem"],["FWC2","Official Emblem"],
  ["FWC3","Official Mascots"],["FWC4","Official Slogan"],["FWC5","Official Ball"],
  ["FWC6","Canada – Host"],["FWC7","Mexico – Host"],["FWC8","USA – Host"]
];
// FIFA Museum foils (FWC9-FWC19)
const MUSEUM = [
  ["FWC9","Italy 1934"],["FWC10","Uruguay 1950"],["FWC11","West Germany 1954"],
  ["FWC12","Brazil 1962"],["FWC13","West Germany 1974"],["FWC14","Argentina 1986"],
  ["FWC15","Brazil 1994"],["FWC16","Brazil 2002"],["FWC17","Spain 2010"],
  ["FWC18","Germany 2014"],["FWC19","Argentina 2022"]
];

/* Team data: [code, name, group, conf, flag, c1, c2, [18 player names]]
   Index 0-10 → sticker positions 2-12; Index 11-17 → positions 14-20 */
const TD = [
["MEX","Mexico","A","CONCACAF","🇲🇽","#006847","#CE1126",["Luis Malagón","Johan Vasquez","Jorge Sánchez","Cesar Montes","Jesus Gallardo","Israel Reyes","Diego Lainez","Carlos Rodriguez","Edson Álvarez","Orbelin Pineda","Marcel Ruiz","Érick Sánchez","Hirving Lozano","Santiago Giménez","Raúl Jiménez","Alexis Vega","Roberto Alvarado","Cesar Huerta"]],
["RSA","South Africa","A","CAF","🇿🇦","#007749","#FFB81C",["Ronwen Williams","Sipho Chaine","Aubrey Modiba","Samukele Kabini","Mbekezeli Mbokazi","Khulumani Ndamane","Siyabonga Ngezana","Khuliso Mudau","Nkosinathi Sibisi","Teboho Mokoena","Thalente Mbatha","Bathasi Aubaas","Yaya Sithole","Sipho Mbule","Lyle Foster","Iqraam Rayners","Mohau Nkota","Oswin Appollis"]],
["KOR","Korea Republic","A","AFC","🇰🇷","#0047A0","#CD2E3A",["Hyeon-woo Jo","Seung-Gyu Kim","Min-jae Kim","Yu-min Cho","Young-woo Seol","Han-beom Lee","Tae-seok Lee","Myung-jae Lee","Jae-sung Lee","In-beom Hwang","Kang-in Lee","Seung-ho Paik","Jens Castrop","Dongg-yeong Lee","Gue-sung Cho","Heung-min Son","Hee-chan Hwang","Hyeon-Gyu Oh"]],
["CZE","Czechia","A","UEFA","🇨🇿","#11457E","#D7141A",["Matej Kovar","Jindrich Stanek","Ladislav Krejci","Vladimir Coufal","Jaroslav Zeleny","Tomas Holes","David Zima","Michal Sadilek","Lukas Provod","Lukas Cerv","Tomas Soucek","Pavel Sulc","Matej Vydra","Vasil Kusej","Tomas Chory","Vaclav Cerny","Adam Hlozek","Patrik Schick"]],
["CAN","Canada","B","CONCACAF","🇨🇦","#D52B1E","#FFFFFF",["Dayne St.Clair","Alphonso Davies","Alistair Johnston","Samuel Adekugbe","Riche Larvea","Derek Cornelius","Moïse Bombito","Kamal Miller","Stephen Eustáquio","Ismaël Koné","Jonathan Osorio","Jacob Shaffelburg","Mathieu Choinière","Niko Sigur","Tajon Buchanan","Liam Millar","Cyle Larin","Jonathan David"]],
["BIH","Bosnia & Herzegovina","B","UEFA","🇧🇦","#002395","#FECB00",["Nikola Vasilj","Amer Dedic","Sead Kolasinac","Tarik Muharemovic","Nihad Mujakic","Nikola Katic","Amir Hadziahmetovic","Benjamin Tahirovic","Armin Gigovic","Ivan Sunjic","Ivan Basic","Dzenis Burnic","Esmir Bajraktarevic","Amar Memic","Ermedin Demirovic","Edin Džeko","Samed Bazdar","Haris Tabakovic"]],
["QAT","Qatar","B","AFC","🇶🇦","#8A1538","#FFFFFF",["Meshaal Barsham","Sultan Albrake","Lucas Mendes","Homam Ahmed","Boualem Khoukhi","Pedro Miguel","Tarek Salman","Mohamed Al-Mannai","Karim Boudiaf","Assim Madibo","Ahmed Fatehi","Mohammed Waad","Abdulaziz Hatem","Hassan Al-Haydos","Edmilson Junior","Akram Afif","Ahmed Al Ganehi","Almoez Ali"]],
["SUI","Switzerland","B","UEFA","🇨🇭","#D52B1E","#FFFFFF",["Gregor Kobel","Yvon Mvogo","Manuel Akanji","Ricardo Rodriguez","Nico Elvedi","Aurèle Amenda","Silvan Widmer","Granit Xhaka","Denis Zakaria","Remo Freuler","Fabian Rieder","Ardon Jashari","Johan Manzambi","Michel Aebischer","Breel Embolo","Ruben Vargas","Dan Ndoye","Zeki Amdouni"]],
["BRA","Brazil","C","CONMEBOL","🇧🇷","#FFDF00","#009739",["Alisson","Bento","Marquinhos","Éder Militão","Gabriel Magalhães","Danilo","Wesley","Lucas Paquetá","Casemiro","Bruno Guimarães","Luiz Henrique","Vinícius Júnior","Rodrygo","João Pedro","Matheus Cunha","Gabriel Martinelli","Raphinha","Estévão"]],
["MAR","Morocco","C","CAF","🇲🇦","#C1272D","#006233",["Yassine Bounou","Munir El Kajoui","Achraf Hakimi","Noussair Mazraoui","Nayef Aguerd","Roman Saiss","Jawad El Yamio","Adam Masina","Sofyan Amrabat","Azzedine Ounahi","Eliesse Ben Seghir","Bilal El Khannouss","Ismael Saibari","Youssef En-Nesyri","Abde Ezzalzouli","Soufiane Rahimi","Brahim Díaz","Ayoub El Kaabi"]],
["HAI","Haiti","C","CONCACAF","🇭🇹","#00209F","#D21034",["Johny Placide","Carlens Arcus","Martin Expérience","Jean-Kevin Duverne","Ricardo Adé","Duke Lacroix","Garven Metusala","Hannes Delcroix","Leverton Pierre","Danley Jean Jacques","Jean-Ricner Bellegarde","Christopher Attys","Derrick Etienne Jr","Josue Casimir","Ruben Providence","Duckens Nazon","Louicius Deedson","Frantzdy Pierrot"]],
["SCO","Scotland","C","UEFA","🏴󠁧󠁢󠁳󠁣󠁴󠁿","#0065BF","#FFFFFF",["Angus Gunn","Jack Hendry","Kieran Tierney","Aaron Hickey","Andrew Robertson","Scott McKenna","John Souttar","Anthony Ralston","Grant Hanley","Scott McTominay","Billy Gilmour","Lewis Ferguson","Ryan Christie","Kenny McLean","John McGinn","Lyndon Dykes","Che Adams","Ben Gannon-Doak"]],
["USA","United States","D","CONCACAF","🇺🇸","#0A3161","#B31942",["Matt Freese","Chris Richards","Tim Ream","Mark McKenzie","Alex Freeman","Antonee Robinson","Tyler Adams","Tanner Tessmann","Weston McKennie","Christian Roldan","Timothy Weah","Diego Luna","Malik Tillman","Christian Pulisic","Brenden Aaronson","Ricardo Pepi","Haji Wright","Folarin Balogun"]],
["PAR","Paraguay","D","CONMEBOL","🇵🇾","#0038A8","#D52B1E",["Roberto Fernandez","Orlando Gill","Gustavo Gomez","Fabián Balbuena","Juan José Cáceres","Omar Alderete","Junior Alonso","Mathías Villasanti","Diego Gomez","Damián Bobadilla","Andres Cubas","Matias Galarza Fonda","Julio Enciso","Alejandro Romero Gamarra","Miguel Almirón","Ramon Sosa","Angel Romero","Antonio Sanabria"]],
["AUS","Australia","D","AFC","🇦🇺","#00843D","#FFCD00",["Mathew Ryan","Joe Gauci","Harry Souttar","Alessandro Circati","Jordan Bos","Aziz Behich","Cameron Burgess","Lewis Miller","Milos Degenek","Jackson Irvine","Riley McGree","Aiden O'Neill","Connor Metcalfe","Patrick Yazbek","Craig Goodwin","Kusini Vengi","Nestory Irankunda","Mohamed Touré"]],
["TUR","Türkiye","D","UEFA","🇹🇷","#E30A17","#FFFFFF",["Ugurcan Cakir","Mert Muldur","Zeki Celik","Abdulkerim Bardakci","Caglar Soyuncu","Merih Demiral","Ferdi Kadioglu","Kaan Ayhan","Ismail Yuksek","Hakan Çalhanoğlu","Orkun Kokcu","Arda Güler","Irfan Can Kahveci","Yunus Akgun","Can Uzun","Baris Alper Yilmaz","Kerem Akturkoglu","Kenan Yildiz"]],
["GER","Germany","E","UEFA","🇩🇪","#000000","#DD0000",["Marc-André ter Stegen","Jonathan Tah","David Raum","Nico Schlotterbeck","Antonio Rüdiger","Waldemar Anton","Ridle Baku","Maximilian Mittelstadt","Joshua Kimmich","Florian Wirtz","Felix Nmecha","Leon Goretzka","Jamal Musiala","Serge Gnabry","Kai Havertz","Leroy Sane","Karim Adeyemi","Nick Woltemade"]],
["CUW","Curaçao","E","CONCACAF","🇨🇼","#002B7F","#F9E814",["Eloy Room","Armando Obispo","Sherel Floranus","Jurien Gaari","Joshua Brenet","Roshon Van Eijma","Shurandy Sambo","Livano Comenencia","Godfried Roemeratoe","Juninho Bacuna","Leandro Bacuna","Tahith Chong","Kenji Gorre","Jearl Margaritha","Jurgen Locadia","Jeremy Antonisse","Gervane Kastaneer","Sontje Hansen"]],
["CIV","Ivory Coast","E","CAF","🇨🇮","#F77F00","#009E60",["Yahia Fofana","Ghislain Konan","Wilfried Singo","Odilon Kossounou","Evan Ndicka","Willy Boly","Emmanuel Agbadou","Ousmane Diomande","Franck Kessié","Seko Fofana","Ibrahim Sangare","Jean-Philippe Gbamin","Amad Diallo","Sébastien Haller","Simon Adingra","Yan Diomande","Evann Guessand","Oumar Diakite"]],
["ECU","Ecuador","E","CONMEBOL","🇪🇨","#FFD100","#0072CE",["Hernán Galíndez","Gonzalo Valle","Piero Hincapié","Pervis Estupiñán","Willian Pacho","Ángelo Preciado","Joel Ordóñez","Moisés Caicedo","Alan Franco","Kendry Paez","Pedro Vite","John Veboah","Leonardo Campana","Gonzalo Plata","Nilson Angulo","Alan Minda","Kevin Rodriguez","Enner Valencia"]],
["NED","Netherlands","F","UEFA","🇳🇱","#AE1C28","#21468B",["Bart Verbruggen","Virgil van Dijk","Micky van de Ven","Jurrien Timber","Denzel Dumfries","Nathan Aké","Jeremie Frimpong","Jan Paul van Hecke","Tijjani Reijnders","Ryan Gravenberch","Teun Koopmeiners","Frenkie de Jong","Xavi Simons","Justin Kluivert","Memphis Depay","Donyell Malen","Wout Weghorst","Cody Gakpo"]],
["JPN","Japan","F","AFC","🇯🇵","#BC002D","#FFFFFF",["Zion Suzuki","Henry Mochizuki","Ayumu Seko","Junnosuke Suzuki","Shogo Taniguchi","Tsuyoshi Watanabe","Kaishu Sano","Yuki Soma","Ao Tanaka","Daichi Kamada","Takefusa Kubo","Ritsu Doan","Keito Nakamura","Takumi Minamino","Shuto Machino","Junya Ito","Koki Ogawa","Ayase Ueda"]],
["SWE","Sweden","F","UEFA","🇸🇪","#006AA7","#FECC00",["Victor Johansson","Isak Hien","Gabriel Gudmundsson","Emil Holm","Victor Nilsson Lindelöf","Gustaf Lagerbielke","Lucas Bergvall","Hugo Larsson","Jesper Karlström","Yasin Ayari","Mattias Svanberg","Daniel Svensson","Ken Sema","Roony Bardghji","Dejan Kulusevski","Anthony Elanga","Alexander Isak","Viktor Gyökeres"]],
["TUN","Tunisia","F","CAF","🇹🇳","#E70013","#FFFFFF",["Bechir Ben Said","Aymen Dahmen","Yan Valery","Montassar Talbi","Yassine Meriah","Ali Abdi","Dylan Bronn","Ellyes Skhiri","Aissa Laidouni","Ferjani Sassi","Mohamed Ali Ben Romdhane","Hannibal Mejbri","Elias Achouri","Elias Saad","Hazem Mastouri","Ismael Gharbi","Sayfallah Ltaief","Naim Sliti"]],
["BEL","Belgium","G","UEFA","🇧🇪","#E30613","#FDDA24",["Thibaut Courtois","Arthur Theate","Timothy Castagne","Zeno Debast","Brandon Mechele","Maxim De Cuyper","Thomas Meunier","Youri Tielemans","Amadou Onana","Nicolas Raskin","Alexis Saelemaekers","Hans Vanaken","Kevin De Bruyne","Jérémy Doku","Charles De Ketelaere","Leandro Trossard","Loïs Openda","Romelu Lukaku"]],
["EGY","Egypt","G","CAF","🇪🇬","#CE1126","#000000",["Mohamed El Shenawy","Mohamed Hany","Mohamed Hamdy","Yasser Ibrahim","Khaled Sobhi","Ramy Rabia","Hossam Abdelmaguid","Ahmed Fatouh","Marwan Attia","Zizo","Hamdy Fathy","Mohamed Lasheen","Emam Ashour","Osama Faisal","Mohamed Salah","Mostafa Mohamed","Trezeguet","Omar Marmoush"]],
["IRN","Iran","G","AFC","🇮🇷","#239F40","#DA0000",["Alireza Beiranvand","Morteza Pouraliganji","Ehsan Hajsafi","Milad Mohammadi","Shojae Khalilzadeh","Ramin Rezaeian","Hossein Kanaani","Sadegh Moharrami","Saleh Hardani","Saeed Ezatolahi","Saman Ghoddos","Omid Noorafkan","Roozbeh Cheshmi","Mohammad Mohebi","Sardar Azmoun","Mehdi Taremi","Alireza Jahanbakhsh","Ali Gholizadeh"]],
["NZL","New Zealand","G","OFC","🇳🇿","#00247D","#FFFFFF",["Max Crocombe Payne","Alex Paulsen","Michael Boxall","Liberato Cacace","Tim Payne","Tyler Bindon","Francis de Vries","Finn Surman","Joe Bell","Sarpreet Singh","Ryan Thomas","Matthew Garbett","Marko Stamenić","Ben Old","Chris Wood","Elijah Just","Callum McCowatt","Kosta Barbarouses"]],
["ESP","Spain","H","UEFA","🇪🇸","#AA151B","#F1BF00",["Unai Simon","Robin Le Normand","Aymeric Laporte","Dean Huijsen","Pedro Porro","Dani Carvajal","Marc Cucurella","Martín Zubimendi","Rodri","Pedri","Fabian Ruiz","Mikel Merino","Lamine Yamal","Dani Olmo","Nico Williams","Ferran Torres","Álvaro Morata","Mikel Oyarzabal"]],
["CPV","Cape Verde","H","CAF","🇨🇻","#003893","#CF2027",["Vozinha","Logan Costa","Pico","Diney","Steven Moreira","Wagner Pina","Joao Paulo","Yannick Semedo","Kevin Pina","Patrick Andrade","Jamiro Monteiro","Deroy Duarte","Garry Rodrigues","Jovane Cabral","Ryan Mendes","Dailon Livramento","Willy Semedo","Bebe"]],
["KSA","Saudi Arabia","H","AFC","🇸🇦","#006C35","#FFFFFF",["Nawaf Alaqidi","Abdulrahman Al-Sanbi","Saud Abdulhamid","Nawaf Bouwashl","Jihad Thakri","Moteb Al-Harbi","Hassan Altambakti","Musab Aljuwayr","Ziyad Aljohani","Abdullah Alkhaibari","Nasser Aldawsari","Saleh Abu Alshamat","Marwan Alsahafi","Salem Al-Dawsari","Abdulrahman Al-Aboud","Feras Akbrikan","Saleh Alshehri","Abdullah Al-Hamdan"]],
["URU","Uruguay","H","CONMEBOL","🇺🇾","#0038A8","#FFFFFF",["Sergio Rochet","Santiago Mele","Ronald Araujo","José María Giménez","Sebastian Caceres","Mathias Olivera","Guillermo Varela","Nahitan Nandez","Federico Valverde","Giorgian De Arrascaeta","Rodrigo Bentancur","Manuel Ugarte","Nicolás de la Cruz","Maxi Araujo","Darwin Núñez","Federico Viñas","Rodrigo Aguirre","Facundo Pellistri"]],
["FRA","France","I","UEFA","🇫🇷","#002395","#ED2939",["Mike Maignan","Theo Hernandez","William Saliba","Jules Kounde","Ibrahima Konate","Dayot Upamecano","Lucas Digne","Aurélien Tchouaméni","Eduardo Camavinga","Manu Kone","Adrien Rabiot","Michael Olise","Ousmane Dembele","Bradley Barcola","Désiré Doué","Kingsley Coman","Hugo Ekitike","Kylian Mbappé"]],
["SEN","Senegal","I","CAF","🇸🇳","#00853F","#FDEF42",["Edouard Mendy","Yehvann Diouf","Moussa Niakhaté","Abdoulaye Seck","Ismail Jakobs","El Hadji Malick Diouf","Kalidou Koulibaly","Idrissa Gana Gueye","Pape Matar Sarr","Pape Gueye","Habib Diarra","Lamine Camara","Sadio Mané","Ismaïla Sarr","Boulaye Dia","Iliman Ndiaye","Nicolas Jackson","Krepin Diatta"]],
["IRQ","Iraq","I","AFC","🇮🇶","#CE1126","#000000",["Jalal Hassan","Rebin Sulaka","Hussein Ali","Akam Hashem","Merchas Doski","Zaid Tahseen","Manaf Younis","Zidane Iqbal","Amir Al-Ammari","Ibrahim Bavesh","Ali Jasim","Youssef Amyn","Aimar Sher","Marko Farji","Osama Rashid","Ali Al-Hamadi","Aymen Hussein","Mohanad Ali"]],
["NOR","Norway","I","UEFA","🇳🇴","#BA0C2F","#00205B",["Orjan Nyland","Julian Ryerson","Leo Ostigård","Kristoffer Vassbakk Ajer","Marcus Holmgren Pedersen","David Møller Wolfe","Torbjørn Heggem","Morten Thorsby","Martin Ødegaard","Sander Berge","Andreas Schjelderup","Patrick Berg","Erling Haaland","Alexander Sørloth","Aron Dønnum","Jorgen Strand Larsen","Antonio Nusa","Oscar Bobb"]],
["ARG","Argentina","J","CONMEBOL","🇦🇷","#75AADB","#FFFFFF",["Emiliano Martínez","Nahuel Molina","Cristian Romero","Nicolas Otamendi","Nicolas Tagliafico","Leonardo Balerdi","Enzo Fernandez","Alexis Mac Allister","Rodrigo De Paul","Exequiel Palacios","Leandro Paredes","Nico Paz","Franco Mastantuono","Nico Gonzalez","Lionel Messi","Lautaro Martínez","Julián Álvarez","Giuliano Simeone"]],
["ALG","Algeria","J","CAF","🇩🇿","#007A3D","#D21034",["Alexis Guendouz","Ramy Bensebaini","Youcef Atal","Rayan Aït-Nouri","Mohamed Amine Tougai","Aïssa Mandi","Ismael Bennacer","Houssem Aouar","Hicham Boudaoui","Ramiz Zerrouki","Nabil Bentaleb","Farés Chaibi","Riyad Mahrez","Said Benrahma","Anis Hadj Moussa","Amine Gouiri","Baghdad Bounedjah","Mohammed Amoura"]],
["AUT","Austria","J","UEFA","🇦🇹","#ED2939","#FFFFFF",["Alexander Schlager","Patrick Pentz","David Alaba","Kevin Danso","Philipp Lienhart","Stefan Posch","Phillipp Mwene","Alexander Prass","Xaver Schlager","Marcel Sabitzer","Konrad Laimer","Florian Grillitsch","Nicolas Seiwald","Romano Schmid","Patrick Wimmer","Christoph Baumgartner","Michael Gregoritsch","Marko Arnautović"]],
["JOR","Jordan","J","AFC","🇯🇴","#007A3D","#CE1126",["Yazeed Abulaila","Ihsan Haddad","Mohammad Abu Hashish","Yazan Al-Arab","Abdallah Nasib","Saleem Obaid","Mohammad Abualnadi","Ibrahim Saadeh","Nizar Al-Rashdan","Noor Al-Rawabdeh","Mohannad Abu Taha","Amer Jamous","Musa Al-Taamari","Yazan Al-Naimat","Mahmoud Al-Mardi","Ali Olwan","Mohammad Abu Zrayq","Ibrahim Sabra"]],
["POR","Portugal","K","UEFA","🇵🇹","#006600","#FF0000",["Diogo Costa","Jose Sa","Ruben Dias","João Cancelo","Nuno Mendes","Gonçalo Inácio","Antonio Silva","Nelson Semedo","Bernardo Silva","Bruno Fernandes","Vitinha","João Neves","Pedro Neto","Francisco Conceição","Rafael Leão","Diogo Jota","Gonçalo Ramos","Cristiano Ronaldo"]],
["COD","DR Congo","K","CAF","🇨🇩","#007FFF","#F7D618",["Lionel Mpasi","Joris Kayembe","Chancel Mbemba","Arthur Masuaku","Dylan Batubinsika","Glody Ngonda","Djos Issama","Edo Kayembe","Samuel Bastien","Gaël Kakuta","Théo Bongonda","Meschack Elia","Yannick Bolasie","Silas Katompa","Cédric Bakambu","Fiston Mayele","Yoane Wissa","Jonathan Bamba"]],
["UZB","Uzbekistan","K","AFC","🇺🇿","#1EB53A","#0099B5",["Abduvakhid Nematov","Husniddin Aliqulov","Abdukodir Khusanov","Davron Khashimov","Nurillo Tukhtasinov","Abbas Akhmedov","Aziz Ganiev","Farrukh Sayfiyev","Jaloliddin Masharipov","Oston Urunov","Otabek Shukurov","Abbosbek Fayzullaev","Azizbek Turgunboev","Islom Kobilov","Ruslanbek Jiyanov","Ibrokhimkhalil Yuldoshev","Eldor Shomurodov","Ulugbek Khoshimov"]],
["COL","Colombia","K","CONMEBOL","🇨🇴","#FCD116","#003893",["Camilo Vargas","David Ospina","Davinson Sánchez","Yerry Mina","Johan Mojica","Daniel Muñoz","Jhon Lucumí","Carlos Cuesta","Jefferson Lerma","Matheus Uribe","Richard Rios","James Rodríguez","Juan Cuadrado","Jhon Arias","John Córdoba","Rafael Santos Borré","Luis Díaz","Jhon Durán"]],
["ENG","England","L","UEFA","🏴󠁧󠁢󠁥󠁮󠁧󠁿","#FFFFFF","#CF081F",["Jordan Pickford","Dean Henderson","John Stones","Marc Guehi","Kyle Walker","Luke Shaw","Trent Alexander-Arnold","Ezri Konsa","Declan Rice","Kobbie Mainoo","Cole Palmer","Bukayo Saka","Phil Foden","Anthony Gordon","Jude Bellingham","Jarrod Bowen","Ollie Watkins","Harry Kane"]],
["CRO","Croatia","L","UEFA","🇭🇷","#FF0000","#171796",["Dominik Livaković","Ivica Ivušić","Joško Gvardiol","Josip Stanišić","Domagoj Vida","Borna Sosa","Josip Juranović","Josip Šutalo","Luka Modrić","Marcelo Brozović","Mateo Kovačić","Lovro Majer","Mario Pašalić","Martin Baturina","Andrej Kramarić","Ante Budimir","Bruno Petković","Igor Matanović"]],
["GHA","Ghana","L","CAF","🇬🇭","#006B3F","#FCD116",["Lawrence Ati-Zigi","Abdul Manaf Nurudeen","Alexander Djiku","Tariq Lamptey","Gideon Mensah","Denis Odoi","Joseph Aidoo","Daniel Amartey","Thomas Partey","Salis Abdul Samed","Elisha Owusu","Ibrahim Sulemana","Abdul Fatawu Issahaku","Kamaldeen Sulemana","Mohammed Kudus","Andrew Ayew","Joseph Paintsil","Antoine Semenyo"]],
["PAN","Panama","L","CONCACAF","🇵🇦","#005293","#DA121A",["Orlando Mosquera","Luis Mejia","Fidel Escobar","Andres Andrade","Michael Amir Murillo","Eric Davis","Jose Cordoba","Cesar Blackman","Cristian Martinez","Aníbal Godoy","Adalberto Carrasquilla","Édgar Bárcenas","Carlos Harvey","Ismael Díaz","Jose Fajardo","Cecilio Waterman","Jose Luiz Rodriguez","Alberto Quintero"]],
];

/* Section colours cycle through the six Panini brand accents. */
const GROUP_CLR = { A:"--p2", B:"--p5", C:"--p1", D:"--p4", E:"--p3", F:"--p6",
                    G:"--p2", H:"--p5", I:"--p1", J:"--p4", K:"--p3", L:"--p6" };
const GROUP_IDS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

/* The 20-slot page every nation shares. */
const SLOT_TEMPLATE = [
  { kind: "emblem", label: "Team Logo", foil: true },
  ...Array.from({ length: 11 }, () => ({ kind: "player" })),
  { kind: "squad", label: "Team Photo" },
  ...Array.from({ length: 7 }, () => ({ kind: "player" })),
];

export default {
  id: "panini-wc26",
  publisher: "Panini",
  title: "FIFA World Cup 26",
  shortTitle: "ALBUM '26",
  slug: "wc26",
  kicker: "USA · CANADA · MEXICO 2026",
  tagline: "All 980 stickers across 48 nations.",
  year: 2026,
  sport: "football",
  category: "Football",
  total: 980,
  status: "official",
  slotTemplate: SLOT_TEMPLATE,
  vocab: { unit: "Nation", unitPlural: "Nations", section: "Group",
           sectionPlural: "Groups", meta: "Confederation" },
  // Specials are numbered first (#1–20) but shown last in the Album view.
  displayOrder: [...GROUP_IDS, "★"],
  sections: [
    {
      id: "★", label: "Specials", short: "★ SPECIALS", color: "--gold", special: true,
      units: [{
        code: "FWC", name: "FIFA", flag: "🏆", c1: "#C9982F", c2: "#F4C24A",
        meta: "FIFA", kind: "special", foil: true,
        stickers: [
          ...INTRO.map(([id, label]) => [id, label, { team: "Introduction", foil: true }]),
          ...MUSEUM.map(([id, label]) => [id, label, { team: "FIFA Museum", foil: true }]),
        ],
      }],
    },
    ...GROUP_IDS.map(g => ({
      id: g, label: `Group ${g}`, short: `GROUP ${g}`, color: GROUP_CLR[g],
      units: TD.filter(t => t[2] === g).map(([code, name, , conf, flag, c1, c2, roster]) =>
        ({ code, name, meta: conf, flag, c1, c2, roster })),
    })),
  ],
};
