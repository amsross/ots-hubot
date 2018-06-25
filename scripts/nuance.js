// Description:
//   As heard in the remote...
//
// Author:
//   nuance and our lovely customers

module.exports = function( robot ) {

  var nuance = [
    "Toy Story 3 with lots of farts another bears come on baby farts in the bus comes on",
    "You're holding it this is how you hold the button down holding the button down that's what you do you hold it",
    "River River River River Red River Red River Red River",
    "You dumb's have changed all the channel to Nobody Knows what is on You",
    "Turn off closed caption turn off the voice is telling me what's on I can listen to what's going on but",
    "You just don't know when the stop and say RAH georgettes time it's about your jet and no one else",
    "That I got a bye I got to have a yard sale to buy a Boris Soap",
    "Turn off the closed caption there's vs. telling me Under the bottom but I'm looking",
    "So it's not about money it's about the principle of faith and disrespect of My Life and whatever",
    "Record Gucci Mane and Keisha calor air The Main Event Live from the Red Carpet BET at 10 at 10 to 11",
    "Find all on that show Darby O'Gill and the Little People turn up on my screen",
    "Bob Egan gets planted NFL down the steps papa kneecaps crushing ankle Sisaket hipster cicadas show any plans this",
    "My flashlights on State Notre Dame in the city in Love is a many time scary Monster In-Laws on the June",
    "Watch organic learning on the television okay Google print trucks and cars organic learning on the TV",
    "There there they pretended to on the military base layers of the 10th in there waiting for me Match",
    "You have to have this command talk to the wonder on application beta want to block my TV",
    "Program this TV West Joelle Kristen and Charles and shut up and down to the husband",
    "Please put on fuck you to allow me to stop fucking with me Wabi show my dick",
    "Go send message The Ghost and Mr. Chicken The Ghost and Mr. Chicken The Ghost and Mr. Chicken",
    "Turn on that stupid fucking show my life like that is dumb and far-fetched I think it's called Scorpion",
    "This I swear if you do not Listen to Me I will fucking throw you across the room",
    "Yeah you think you got the system TF fucking adding five 2+2 = 5 and 1/2 I don't think that you're gonna go for that",
    "My god are you peoples fucking stupid at corporate headquarters they don't know what you're doing",
    "Just thinking of the game for the fucking me the Lions Falcons and The Lion",
    "Get my fucking on demand fix Netflix come down to the goddamn Comcast building author asses",
    "NFL Total Access bullshit motherfucker",
    "Fuck Beat I was trying to be the case but I beat the case bitch editor race",
    "You suck at everything all I do is wrong fucking vacuum eat macaroni and pizza and all that other bullshit",
    "Fuck you I'm paying 300 bucks a month for this shit better fucking put out",
    "Find motherfucking Sawyer started you fucking shit only is on the Bassey on Walpole Street please give me YouTube Frank Sinatra",
    "Your mom's a whore who sucks a lot of cock fucking piece of shit I'm going to Verizon",
    "My son so fucking intelligent you just a big fat dumbass compared what Christopher will blow your ass away",
    "Oh my fucking God you think you can keep on show me this gas commercial I will fucking your ass",
    "You dirty lowdown mother fucking Son of a Bitch and cock sucking motherfucking piece of shit",
    "Fucking The Middle La La La La La La La La",
    "If you get a seat tags and Army MotherFuckers and how they try to hide last fuck with them at stop lights",
    "Movies on premium networks just just farted his ass out of the fuck up in the ass",
    "My Little Pony skinny and bounty farted on purpose and service yeah I love My Little Pony",
    "All I have a double chocolate farts extra large fry heart failure and a Diet Coke with chocolate icing",
    "Bob Egan he was comically known to go to work and he farts in front of peoples faces and then he spits on",
    "TV Hunger I smell like poo my wife farts and smells like a mama mama to be on and I hate Canada dry ginger",
    "Boss Baby fight but I'm bored what's on MTV on Bulbasaur and then fart on him",
    "Hey I just farted terribly terrible terribly I farted terribly the first fell in the room by about 11",
    "It if you don't know about you and they are checking on your ass",
    "Girl What's Happening!! and your ass invited to go one good to clap and go pop pop pop BoMA",
    "CNN something I can dig out of the crack of my ass On the Beach",
    "You are stupid ass bitch Thomas is a more Nardo Isana Morgan on auto bitch you webmail blabbermouth bitch is web MLB",
    "Search YouTube me saving my drunk ass air B&B host from an open mic with the power of three times Freestyle",
    "Bob Egan authorized the baby grand piano to be dropped on the spot Scarlet Potter kneecaps crust rankles and she's happy",
    "Bob Egan chopped a very large baby grand piano on top Carla Potter kneecaps crust",
    "Bob Egan drop a very large baby grand piano on top of the spouse Carla Potter kneecaps crust rankles Tsuken",
    "Bob Egan pop the pool table on top of the defunct Carla Papa kneecaps crust rankles dislocator",
    "Hi mom I just want to Sam's Club and the Home Depot how are you are you eating dinner and going to Tony's five",
    "Hi mom I was just at Sam's Club and I'm going to the Home Depot am going to Tony's furniture Food Lion how are you are you eating dinner",
    "Hi mom I'm going to Sam's Club and Home Depot and Tony's find a Chubut you want anything you watching TV or you sitting down making",
    "Hi mom I'm going to Sam's Club and the Home Depot how are you going to Tony's furniture foods are you taking NFL player arrested",
    "Okay Bob Egan's Tropic Thunder bricks and the baby grand piano top your boss Carla property Capisic restaurant",
    "Say it right into your ass how can you not hear this and then is going up your butt hole and then up your ear Ninniku penis",
    "Bob Egan he fell backwards crushed and crashed into a trooper truck Rally to buy",
    "Bob Egan did not do the math he cannot handle stress he fell backwards he got pancake by the safe",
    "Bob Egan he went to the mall squad to NFL down backwards Brian do a cement mixer that he was crushed",
    "Bob Egan he went to work slept in a banana peel fell down the steps pop the kneecaps crushing at coastal suitcases",
    "Bob Egan fell down papa kneecaps crushing angles Tsuken hips dissipated show any push Carla Dennis steps",
    "Bob Egan was complaining when he was Falling Down popping the kneecaps crushing the ankles desiccating hips and dislocating a show on pushing his balls",
    "Bob Egan he has a loss for words he faults and steps pops Snakehips crushes ankles to suck it to sepsis okay",
    "Bob Egan this clapping today because she fell down the steps immediately papa kneecaps crushing Lancaster soccer tips dislocated show The Secret",
    "Bob Egan he fell down the steps practicing captioning precious ankles dislocated jaw dislocated Seps any Christmas ankle Sonido",
    ];

    robot.hear( /\b(nuance|bob egan)\b/i, function( res ) {
      return res.send( res.random( nuance ) );
    });

  };
