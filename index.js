const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//user inventory and stats. I also tried to make a function for what a players damage could be with items equipped but help is definitely needed
let PLAYER = {
  max_health: 30,
  health: 15,
  speed: 10,
  damage: 5,
  experience: 0,
  inventory: [],
  equipped_item: "",
  get_adjusted_damage: function () {
    if (this.equipped_item !== "") {
      console.log("player has an item equipped.");
      if (ITEMS[this.equipped_item].hasOwnProperty("damage")) {
        console.log("equipped item has damage");
        return this.damage + ITEMS[this.equipped_item].damage;
      }
    }
    return this.damage;
  },
  get_inventory_str: function () {
    if (this.inventory.length > 0) {
      inv_item_names = [];
      for (let i = 0; i < this.inventory.length; i++) {
        inv_item_names.push(ITEMS[this.inventory[i]].name);
      }
      return inv_item_names.join(", ");
    } else {
      return "";
    }
  },
};

//list of items
ITEMS = {
  rock: {
    name: "A Rock",
    damage: 8,
    description:
      "A light rock you find on the ground. Perhaps it could be used as a weapon...",
  },
  stick: {
    name: "A Stick",
    damage: 3,
    description:
      "A broken tree branch the size of a yardstick. You notice it's got some heft to it as you pick it up. There are several branch shoots sticking out along.",
  },
  sword: {
    name: "A Sword",
    damage: 20,
    description:
      "A rusty bronze sword you found in the sword room. With this you just might have what it takes to escape the dungeon!",
  },
  shield: {
    name: "A Shield",
    damage: 12,
    description:
      "A rusty bronze sword you found in the sword room. With this you just might have what it takes to escape the dungeon!",
  },
};

//a makeshift map of my `dungeon!!!!`
let map = [
  ["", "", "", "", "", "", ""],
  ["", "stick", "", "rock", "", "", ""],
  ["", "prelude", "walkway", "small", "reprieve", "", ""],
  ["", "", "shield", "", "sword", "", ""],
  ["", "", "", "", "large", "end", ""],
  ["", "", "", "", "", "", ""],
];

//location info specifically to run the state machine function
locations = {
  prelude: ["stick room", "walkway"],
  walkway: ["prelude", "shield room"],
  journeysEnd: ["large monster room"],
  swordRoom: ["large monster room", "room of reprieve"],
  shieldRoom: ["walkway"],
  smallMonsterRoom: ["rock room", "walkway"],
  largeMonsterRoom: ["sword room", "journey's end"],
  roomOfReprieve: ["small monster room", "sword room"],
  stickRoom: ["prelude"],
  rockRoom: ["small monster room"],
};
//in depth location information(descriptions, possible actions within areas)
locationData = {
  prelude: {
    description:
      "You wake up lying on a dimly lit path with no recollection of where you are and how you arrived here. As you start to move you feel your body ache all over.\nIt feels as if you had gotten into some kind of fight but the details elude you. As you examine your surroundings a singular urge begins to form. You want to leave this place as soon as possible.\nBefore you begin, try using the `choices` command to learn about what you can do! It is helpful to know that not all commands will work in each area. Try it out for yourself!",
    look: "You examine the area. Nothing seems interesting in this vicinity.",
    actions: {
      walk: function walk() {
        console.log(
          "You begin to walk along the path. In the corner of your eye you notice a sparkle"
        );
      },
    },
  },
  walkway: {
    description: "You tread down the dark corridor.",
    look: "There is nothing interesting in this vicinity.",
  },
  journeysEnd: {
    description: " ",
    look: "As you look around you hear some killer tunes playing in the distance.",
    actions: {
      dance: function dance() {
        console.log(
          "You can't resist the urge to boogie down with some sick dance moves."
        );
      },
    },
  },
  swordRoom: {
    description: "A room full of offensive weaponry. ",
    look: "You take note of your surroundings. Swords, staves and knives are strewn across the room. Maybe there's something you could use",
    items: ["sword"],
  },
  shieldRoom: {
    description: "A room full of items designed for defense. ",
    look: "You take note of your surroundings. Having an item for protection would only come in handy right?",
    items: ["shield"],
  },

  stickRoom: {
    description:
      "In here you find all sorts of shrubbery strewn along your path. ",
    look: "You take note of your surroundings. Perhaps there could be something useful here.",
    items: ["stick"],
  },
  rockRoom: {
    description:
      "You exploration takes you into an area seems a bit more mountainous than the others. Rocks and gravel of varying sizes and colors litter your path.",
    look: "You happen to spot a rock that catches your fancy. In the right hands it might make a decent weapon. Perhaps we should take it?",
    items: ["rock"],
  },
  smallMonsterRoom: {
    enemy: {
      name: "demigorgon",
      speed: 66,
      damage: 5,
      health: 12,
      experience: 20,

      isAlive: function isAlive() {
        return this.health > 0;
      },
    },
    description: function describ() {
      console.log(this);
      if (this.enemy.isAlive()) {
        return "As you enter the large room you're immediately filled with a sense of dread. Almost immediately you hear a shrill cry and are enveloped by an immense black fog.\nYou flail your hands around in a frenzy trying to dissippate the dark to no avail. It finally subsides after a time and you find yourself outside in an open field. It seems so real but something's telling you there's trickery afoot. ";
      } else {
        return "The dark creature is no more.";
      }
    },

    look: function look2() {
      console.log(this);
      if (this.enemy.isAlive()) {
        return "You walk along the field for a time. No more than a minute into your exploration you hear that now familiar cry!\nThe dark presence from the dungeon returns. This time in front of you to block your forward path. It begins to compress and twist; corporealizing into a new malevolent presence.\nYou take up arms and prepare to fight!";
      } else {
        return "You defeated the " + this.enemy.name + " here.";
      }
    },
  },

  largeMonsterRoom: {
    enemy: {
      name: "mind flayer",
      speed: 120,
      damage: 11,
      health: 50,
      experience: 20,

      isAlive: function isAlive() {
        return this.health > 0;
      },
    },
    description: function () {
      console.log(this);
      if (this.enemy.isAlive()) {
        return "As you enter the large room you're immediately filled with a sense of dread. Almost immediately you hear a shrill cry and are enveloped by an immense black fog.\nYou flail your hands around in a frenzy trying to dissippate the dark to no avail. It finally subsides after a time and you find yourself outside in an open field. It seems so real but something's telling you there's trickery afoot. ";
      } else {
        return "The dark creature is no more.";
      }
    },

    look: function () {
      console.log(this);
      if (this.enemy.isAlive()) {
        return "You walk along the field for a time. No more than a minute into your exploration you hear that now familiar cry!\nThe dark presence from the dungeon returns. This time in front of you to block your forward path. It begins to compress and twist; corporealizing into a new malevolent presence.\nYou take up arms and prepare to fight!";
      } else {
        return "You defeated the " + this.enemy.name + " here.";
      }
    },
  },

  roomOfReprieve: {
    description:
      "There is a large floating orb with glowing light towards the center of the room. As you head towards it..you notice a strange blue fluid pumping vibrantly out, spilling down to the floor. Yet, there's no sign of spillage on the floor.\n",
    look: "As you case upon the orb you feel a since of familiarity and calm. Perhaps this orb could be helpful.",
    actions: {
      examine: function examine() {
        console.log(
          "You take your hands and slide them under the stream jetting out of the orb . In an instant, you feel a renewed sense of calm. Your injuries have also seemed to recover."
        );
        PLAYER.health = PLAYER.max_health;
      },
    },
  },
};

//function to give user to select options
async function choices() {
  console.log(
    `In a given area, there are several options for you to choose from.\n You can "move", "look", "take", "attack", and "use". `
  );
  let tati = await ask("What would you like to do?");
  if (tati === "move") {
    move();
  } else if (tati === "look") {
    look();
  } else if (tati === "attack") {
    attack();
  } else if (tati === "take") {
    take();
  } else if (tati === "map") {
    map();
  } else if (tati === "equip") {
    equip();
  } else {
    console.log("I don't believe I got that right. Let's rewind a bit.");
    choices();
  }
}

//option to take specific item in area
function take() {
  if (locationdata.hasOwnProperty("items")) {
    console.log(locationdata["items"]);
    if (locationdata["items"].indexOf(item) >= 0) {
      output("Player took " + item);
      PLAYER.inventory.push(item);
      locationdata["items"].splice(locationdata["items"].indexOf(item), 1);
    } else {
      output("There is no " + item + " here.");
    }
  } else {
    output("There are no items in this area.");
  }
}

//option to attack should there be a monster present
function attack() {
  if (locationData.smallMonsterRoom.hasOwnProperty("enemy")) {
    if (locationData.smallMonsterRoom["enemy"].isAlive()) {
      if (locationData.smallMonsterRoom["enemy"]["speed"]) {
        PLAYER.health -= locationData.smallMonsterRoom["enemy"]["damage"];
        locationData.smallMonsterRoom["enemy"]["health"] -=
          PLAYER.get_adjusted_damage();
        output +=
          locationData.smallMonsterRoom["enemy"]["name"] +
          " hit player and did " +
          locationData.smallMonsterRoom["enemy"]["damage"] +
          " damage.\nPlayer struck back for " +
          PLAYER.get_adjusted_damage() +
          " damage.\n";
      } else {
        locationData.smallMonsterRoom["enemy"]["health"] -=
          PLAYER.get_adjusted_damage();
        output +=
          "Player hit " +
          locationData.smallMonsterRoom["enemy"]["name"] +
          " for " +
          PLAYER.get_adjusted_damage() +
          ".\n";
        if (locationData.smallMonsterRoom["enemy"].isAlive()) {
          PLAYER.health -= locationData.smallMonsterRoom["enemy"]["damage"];
          output +=
            locationData.smallMonsterRoom["enemy"]["name"] +
            " struck back for " +
            locationData.smallMonsterRoom["enemy"]["damage"] +
            ".\n";
        }
      }
      if (!locationData.smallMonsterRoom["enemy"].isAlive()) {
        PLAYER.experience +=
          locationData.smallMonsterRoom["enemy"]["experience"];
        fight +=
          locationData.smallMonsterRoom["enemy"]["name"] +
          " is defeated.\nPlayer gains " +
          locationData.smallMonsterRoom["enemy"]["experience"] +
          " experience.";
      } else {
        fight +=
          "Player Health: " +
          PLAYER.health +
          "\n" +
          "Enemy Health: " +
          locationData.smallMonsterRoom["enemy"]["health"];
      }
      output(fight);
    } else {
      output("Enemy was already defeated");
    }
  } else {
    output("There is no enemy here.");
  }
}

//option to display a map
function map() {
  console.log(map);
}
//option to equip found items
function equip() {
  if (PLAYER["inventory"].indexOf(item) >= 0) {
    output("Player equipped " + item);
    PLAYER.equipped_item = item;
  } else {
    output("You don't have " + item + ".");
  }
}
//

//Should the user select this choice, this will ask where they want to go; showing available places to go based off where they are
let currentLocation = "prelude";
async function move() {
  let hustle = await ask("Would you like to move to a different location?\n");
  if ((hustle = "yes")) {
    console.log("Good choice!" + "\n" + "Here are your options.\n");
  } else {
    console.log("Let's Rewind");
  }
  if ((currentLocation = "prelude")) {
    console.log("stick room", "walkway");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "stick room") {
      stickRoom();
    } else if (boogie === "walkway") {
      walkway();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "walkway")) {
    console.log("prelude", "shield room");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "prelude") {
      prelude2();
    } else if (boogie === "shield room") {
      shieldRoom();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "journey's end")) {
    console.log("large monster room");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "large monster room") {
      largeMonsterRoom();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "sword room")) {
    console.log("room of reprieve", "large monster room");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "room of reprieve") {
      roomOfReprieve();
    } else if (boogie === "large monster room") {
      largeMonsterRoom();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "shield room")) {
    console.log("walkway");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "walkway") {
      walkway();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "small monster room")) {
    console.log("rock room", "walkway");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "rock room") {
      rockRoom();
    } else if (boogie === "walkway") {
      walkway();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "large monster room")) {
    console.log("sword room", "journey's end");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "sword room") {
      swordRoom();
    } else if (boogie === "journey's end") {
      journeysEnd();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "stick room")) {
    console.log("prelude");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "prelude") {
      prelude2();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "room of reprieve")) {
    console.log("sword room", "small monster room");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "sword room") {
      swordRoom();
    } else if (boogie === "small monster room") {
      smallMonsterRoom();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else if ((currentLocation = "prelude2")) {
    console.log("stick room", "walkway");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "walkway") {
      walkway();
    } else if (boogie === "stick room") {
      stickRoom();
    } else {
      console.log("Lets Rewind");
      move();
    }
  } else if ((currentLocation = "rock room")) {
    console.log("small monster room");
    let boogie = await ask("Where would you like to go?\n");
    if (boogie === "small monster room") {
      smallMonsterRoom();
    } else {
      console.log("Let's Rewind");
      move();
    }
  } else {
    console.log("Unrelatable content. Let's try that again");
    move();
  }
}
//State machines for moving from place to place
function moveLocation(newLocation) {
  let validTransitions = locations[currentLocation];
  if (validTransitions.includes(newLocation)) {
    currentLocation = newLocation;
    console.log(newLocation);
  } else {
    throw "You can't go that way";
  }
}

//Functions to be laid out specifically for each room. The idea in theory would be a function for each room; each with all possible commands that can occur in said room with
//options to go to and from specific rooms.

//Prelude/Shield to Walkway
function walkway() {
  moveLocation("walkway");
  console.log(locationData.walkway.description);
}
//

//Prelude to Stick Room
function stickRoom() {
  moveLocation("stick room");
  console.log(locationData.stickRoom.description);
}
//

//Walkway to Shield Room
function shieldRoom() {
  moveLocation("shield room");
  console.log(locationData.shieldRoom.description);
}
//

//Large Monster Room to Journey's End
function journeysEnd() {
  moveLocation("journey's end");
  console.log(locationData.journeysEnd.description);
}
//

//Large Monster Room/Room of Reprieve to Sword Room
function swordRoom() {
  moveLocation("sword room");
  console.log(locationData.swordRoom.description);
}
//

//Walkway/Rock Room to Small Monster Room
function smallMonsterRoom() {
  moveLocation("small monster room");
  console.log(locationData.smallMonsterRoom.description);
  choices();
}
//

//Sword Room/Journey's End to Large Monster Room
function largeMonsterRoom() {
  moveLocation("large monster room");
  console.log(locationData.largeMonsterRoom.description);
}
//

//Small Monster Room/Sword Room to Room of Reprieve
function roomOfReprieve() {
  moveLocation("room of reprieve");
  console.log(locationData.largeMonsterRoom.description);
}

//Stick Room/Walkway to Prelude
function prelude2() {
  moveLocation("prelude");
}

//Small Monster Room to Rock Room
function rockRoom() {
  moveLocation("rock room");
  console.log(locationData.rockRoom.description);
}

