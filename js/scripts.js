$(document).ready(function(){
	// console.log("sanity check")

////////////////////////////
////////MAIN VARIABLES//////
////////////////////////////

	// a fresh, perfect deck of cards
	const freshDeck = createDeck();
	// we will keep all player cards in this array
	var playersHand = [];
	var dealersHand = [];
	var theDeck = freshDeck.slice();

/////////////////////////
//////EVENT HANDLERS/////
/////////////////////////

	$('.deal-button').click(function(){
		reset();
		// the deal stuff happens here...
		// here theDeck is still a copy of freshDeck
		// shuffleDeck();
		// here theDeck is shuffled no longer in order freshDeck

		// we have a shuffled deck, add the 1 and 3rd card to the playersHand
		playersHand.push(theDeck.shift()); //remove top card from the deck and give to player
		dealersHand.push(theDeck.shift());//remove next top card from the deck and give to dealer
		playersHand.push(theDeck.shift());//remove top card from the deck and give to player
		dealersHand.push(theDeck.shift()); //remove next top card from the deck and give to dealer

		// change the dom to add images
		// placeCard(dom name of who, card-X for slot, card value to send)
		placeCard('player',1,playersHand[0])
		placeCard('player',2,playersHand[1])

		placeCard('dealer',1,dealersHand[0])
		placeCard('dealer',2,dealersHand[1])

		calculateTotal(playersHand,'player')
		calculateTotal(dealersHand,'dealer')

	});

	$('.hit-button').click(function(){
		// hit functionality
		// player wnats a new card. this means 
		// 1. shift off of theDeck
		// 2. push on to playersHand
		// 3. run placeCard to put the new card in the dom
		// 4. run calculateTotal to find out the new hand total
		if(calculateTotal(playersHand,'player') < 21){
			playersHand.push(theDeck.shift()); //this covers 1 and 2
			var lastCardIndex = playersHand.length - 1;
			var slotForNewCard = playersHand.length;
			placeCard('player',slotForNewCard,playersHand[lastCardIndex]);//this covers 3
			calculateTotal(playersHand,'player')//this covers 4
		}
	});

	$('.stand-button').click(function(){
		// on click stand
		// player has given control over to the dealer
		// dealer MUST hit until dealer has 17 or more
		var dealerTotal = calculateTotal(dealersHand,'dealer')
		while(dealerTotal < 17){
			// hit works the same...
			// 1.push card from the top of deck onto dealers hand
			// 2.update dom (placeCard)
			// 3.update dealerTotal
			dealersHand.push(theDeck.shift());
			var lastCardIndex = dealersHand.length - 1;
			var slotForNewCard = dealersHand.length;
			placeCard('dealer',slotForNewCard,dealersHand[lastCardIndex]);
			dealerTotal = calculateTotal(dealersHand,'dealer')
		}
		checkWin();
	});

////////////////////////////
/////UTILITY FUNCTIONS//////
////////////////////////////

	function reset(){
		// in order to reset the game we need to...
		// 1. reset the deck
		theDeck = freshDeck.slice();
		shuffleDeck();
		// 2. reset the player and dealer hand arrays
		playersHand = [];
		dealersHand = [];
		// 3. reset the cards in the dom
		$('.card').html('');
		// 4. reset the totals for both players
		$('.dealer-total-number').html('0')
		$('.player-total-number').html('0')
		$('.message').html(" ");
	}

	function checkWin(){
		playerTotal = calculateTotal(playersHand,'player')
		dealerTotal = calculateTotal(dealersHand,'dealer')
		var winner = "";
		if(playerTotal > 21){
			winner = "You have busted. Dealer wins."			
		}else if (dealerTotal > 21){
			winner = "Dealer has busted. You win!"
		}else{
			if(playerTotal > dealerTotal){
				winner = "You beat the dealer!";
			}else if(playerTotal < dealerTotal){
				winner = "The dealer has bested you. Give us your money!"
			}else{
				winner = "It's a push!"
			}
		}
		$('.message').html(winner);
	}

	function calculateTotal(hand, who){
		// hand will be an array (either playersHand or dealersHand)
		// who will be aht the dom knows the player as (dealer or player)
		var totalHandValue = 0;
		var thisCardValue = 0;
		var hasAce = false;
		var totalAces = 0;
		for(let i = 0; i < hand.length; i++){
			thisCardValue = Number(hand[i].slice(0,-1));
			if(thisCardValue > 10){
				thisCardValue = 10;
			}else if(thisCardValue == 1){
				// this is an Ace
				hasAce = true;
				totalAces += 1;
				thisCardValue = 11;
			}

			totalHandValue += thisCardValue;
		}
		for(let i = 0; i < totalAces; i++){
			if(totalHandValue > 21){
				totalHandValue - 10;
			}
		}
		// we have the total, now update the dom
		var totalToUpdate = '.' + who +'-total-number';
		$(totalToUpdate).html(totalHandValue);
		return totalHandValue;
	}

	function placeCard(who,where,what){
		// find the dom element based on the args that we want to change
		// i.e. find the element that we want to put the image in 
		var slotForCard = '.' + who + '-cards .card-' + where;
		// console.log(slotForCard);
		imageTag = '<img src="cards/'+what+'.png">';
		if(who == 'dealer' && where == 2){
			imageTag = '<img src="images/backofcard.png">';
		}
		$(slotForCard).html(imageTag);
	}

	function createDeck(){
		var newDeck = [];
		// two loops, one for suit, one for card value
		var suits = ['h','s','d','c'];
		// outer loop which iterates the suit/letter...
		for(let s = 0; s < suits.length; s++){
			// inner loop which iterates the values/numbers
			for(let c = 1; c <= 13; c++){
				// push onto newDeck array, the value[c] + suits[s]
				newDeck.push(c+suits[s]);
			}
		}
		return newDeck;
	}

	function shuffleDeck(){
		// swap 2 elements in the array many, many times to shuffle.
		for(let i = 0; i < 14000; i++){
			var random1 = Math.floor(Math.random()*52);
			var random2 = Math.floor(Math.random()*52);
			// store in temp, the value at index random1, in array theDeck (for later)
			var temp = theDeck[random1];
			// overwrite whats at index number 1 
			theDeck[random1] = theDeck[random2];
			theDeck[random2] = temp;
		}
	}

});



