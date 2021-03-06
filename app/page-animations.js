var current_loader_block = 1;
var max_loader_block = 3;
var loaded = false;

function showGame()
{
		$('#intro').animate({
			opacity:0.0,
			marginTop: '-50'
		}, 500, function(){
			$('#intro').hide();
			$('#gameplay').css('display','block');
			$('#gameplay').animate({
				opacity:1.0,
			}, 500);
		});
		loaded = true;
}

$(document).ready(function() {
	animate_loader_blocks();
});

function animate_loader_blocks() {
	$('#loader-box-'+current_loader_block).removeClass('loader-box-current');
	current_loader_block += 1;
	if(current_loader_block > max_loader_block)
		current_loader_block = 1;
	$('#loader-box-'+current_loader_block).addClass('loader-box-current');
	if (!loaded) setTimeout(animate_loader_blocks, 200);
}

function updateHealthBar(health) {
	$('#health_current').animate({
		width: health+'%'
	},1000);
	$('#health_value').html(health);
}

function updateScoreScreen(score) {
	var strings = ['Nice shot!', 'Awesome!', 'Got him!', 'Yeah, shoot that tank!', 'Boom headshot!'];
	var randomIndex = Math.floor(Math.random() * strings.length);
	var randomString = strings[randomIndex];
	
	$('#nice p').html(randomString);

	$('#nice p').animate({opacity: 1, fontSize: 100+'px'}, 200);
	setTimeout(function() {
		$('#nice p').animate({opacity: 0, fontSize: 50+'px'}, 200);
	}, 1000);
	$('#score_value').html(score);
}
