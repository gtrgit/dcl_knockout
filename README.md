# dcl_knockout
14/08/2020

DCL KnockOut!
Mini-Games Creator Program, Matic & Decentraland Collaboration

‘Mediatonic’ have successfully distilled the best elements from Roblox and Dreams ‘Obby/Parkour’ games to create the extremely popular ‘Fall Guys’. I believe that ‘Fall Guys’ is at a Zeitgeist of multiplayer games. Finally a non violent ‘Battle Royale’ game enters mainstream adoption! This game taps into gamers desire to play a fun ‘Battle Royale’ without needing high-level ‘twitch’ skills that competitive shooting games require. As it is easy to play and fun to watch, the potential for this type of game could rival games like ‘Fortnite’ or ‘Call of Duty: Warzone’.

‘Surfs up’ time to catch the wave! 

‘Fall Guys’ success as a low poly game that mostly involves running and jumping presents a great opportunity for a similar game with the same qualities to be built in Decentraland. This new game could leverage this newfound interest with a new ‘platform battle Royale’ for Decentraland. Decentraland natively supports running and jumping actions with the added benefit of the ability to award winners greatly more significant rewards for playing. What gameplay elements decentraland currently lacks when compared to its peers can be made up with greater rewards that players can literally take to the bank in the form of NFT and cryptocurrency. No mainstream gaming platform can offer players this yet!

With the above ideas in mind I would like to propose DCL KnockOut!
A multiplayer obstacle course where players use speed, skill and  tactics to be the first to cross the finish line. There can only be one winner!

MVP Game loop 

Normally in a Battle Royal player will wait in a lobby until enough players are ready to start a match. How the lobby system will work in Decentraland will be similar to the start of a horse race. 
Each individual player will enter a series of gates lined up before the starting line. 
Each gate will only contain 1 player each. 
When all the gates are filled (or a timer runs out) after a short countdown the race will start.
At the end of each obstacle course there will be a series of Gates. Each gate will only allow one player and will close when the player runs through the gate. If all the gates are closed any players who have not passed through the gates will have to leave the race via an exit or use a power up (see ‘Second chance key’ below).
The number of gates will decrease by 1 after each obstacle course, the player who enters the last gate will be the winner of the race.
Once all the players have left the first stage obstacles a new race can start as races run in an asynchronous manner. NOTE there will be a buffer mechanism to ensure the races do not overlap. 
Having the gates after each obstacle will assist with the Starting Line gate being populated quickly by players that get disqualified from the current race. 

Fig 1) Game loop and lobby system 




Larger Scale games.

	DCL KnockOut’s game loop overview (Fig 2):

Later in the development life cycle larger courses could be built that utilize a matic ‘qualification token’ that will allow players who qualify to play a higher tier course. These qualification tokens will allow players to unlock new courses over multiple playing sessions. The overall idea uses the same ‘gates concept’, but there are only gates at the beginning and end of the race course.
	
Fig 2) Larger scale game loop and lobby system

Level Design.

At first this will be some simple levels to test out the POC with additional levels added in at a later date. From my experience with Roblox and Dreams I can think of a number of low hanging fruit levels for the poc. I also plan to utilize my experience with building the ‘Treasure Hunt’ game ‘Volcano’ as I have received a lot of feedback from making the obstacles too hard to navigate.

Game Items, Events and Matic
	
	‘DCL knockout’ is a race to the finish line that is determined mostly by skill, but players who are cunning can also utilize strategy in the form of ‘Power Ups’. The most well known ‘Power up’ would be items like the ‘banana skins’ in the racing game ‘Mario Karts’ that when deployed, caused the player following to spin out of control. To implement a similar mechanic, the Matic Network will be used to transfer power ups to players and to unlock events related to each power up. Players cannot directly affect other players' movement but they can trigger events in the environment that can assist or hinder players traversing the course.
Each ‘power up’ can trigger animation events on a compatible floor tiles. When a player is near a compatible tile the UI will highlight the appropriate ‘Power Up’ with the keyboard shortcut to activate it.



Power Up Key
Paired Floor Tile event
Oil slick
When deployed on a compatible tile will cause players who walk on the oil to be pushed off the tile in a random direction.
Invisible Brick
When deployed will cause an invisible collider to protrude from the floor, to proceed past this floor tile will require players to jump over the collider. Invisible bricks can also be used as a platform to jump from.
Hedge shears
Allows a player holding the shears to cut a rope bridge they are either standing on or next to.
Giant Pin
Can pop inflatable floor tiles such as the large balloon stepping stones. Causing it to shrink in size for a certain duration then it will inflate again.
Ice Bridge
Will create an ice bridge to form on the top of a water obstacle for a certain duration.




Other types of ‘Power Ups’ not related to floor tile events.

Qualifying Award: If the race courses are split up into larger individual courses then a player will be granted a Qualification Award token or NFT that will unlock more advanced race courses.

Second Chance Key: When all the gates are closed a slow player will still have a chance to reopen a closed gate by finding the ‘Second Chance Key’. This will unlock a gate and allow a player to proceed to the next obstacle course.

‘You are IT’: Players who are too far ahead can be tagged as ‘IT’ and people who are ‘IT’ cannot proceed to the next gate. This will force the player to find the closest players and try to tag them as ‘IT’ which will pass the ‘IT’ title to the tagged player. 



Other Potential Matic use cases

Queue Ticketing System: If the game is popular there may be an issue with too many players trying to access the Starting gate at the same time. A ticketing system that is similar to the ticketing system that a Deli uses to ensure that people get served in the order in which they arrive.

Pay to play and winners pot: If the game implements ‘pay to play’ and can be properly balanced and fair then Matic could be used to split the MANA paid between the game host and the winning player for a given race. 

Spectator Wagering: If this is hosted in Vega City parcel then players may want to wager a bet for the race that is about to start. This would require a pot splitting function to distribute the wagered funds. 

Winner Trophies: Trophies can be awarded to Winners in the form of NFT’s

Trophies Tally: A scoreboard can show players who have the highest Winner NFT counts.
Which raises the possibility for players to cash out of the scoreboard by selling their NFT’s. I don’t know if that is a good thing or not but it will be interesting to see how players react to that.



---------------------------

[EPIC] Gate System: 
There are a series of connected gates starting from the 'Starting Gates' and ending up at the 'Finishing Gates'. 
The number of gates per course will be added to an array with the count of the array used to determine how many gates should be available for each leg/obstacle of the race.
The starting gate will count the number of players lined up and each gate will only let 1 player though per race. 
Track which gates along the course the first and last (still contesting) player
Players who enter the exit side tunnels are no longer considered as contesting.
A new race can start when obstacle 1 and 2 are clear of contesting players.
A gate should
Test that a player has passed through the gate then broadcast this gates in now closed
Determine how many gates should be open for the start of the game for each stage in the race
