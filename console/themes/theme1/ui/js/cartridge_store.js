var ajaxerror_handler='';
var assets = '';
var sortassets;
var offsetcount=8;
var offset= 8;
var start = 0;
//ajax erorr handler
$(function() {
	$.ajaxSetup({
		error: function(jqXHR, exception) {
			if (jqXHR.status === 0) {
				ajaxerror_handler = 'Not connect.\n Verify Network.';
			} else if (jqXHR.status == 404) {
				ajaxerror_handler = 'Requested page not found. [404]';
			} else if (jqXHR.status == 500) {
				ajaxerror_handler = 'Internal Server Error [500].';
			} else if (exception === 'parsererror') {
				ajaxerror_handler = 'Requested JSON parse failed.';
			} else if (exception === 'timeout') {
				ajaxerror_handler = 'Time out error.';
			} else if (exception === 'abort') {
				ajaxerror_handler = 'Ajax request aborted.';
			} else {
				ajaxerror_handler = 'Uncaught Error.\n' + jqXHR.responseText;
			}

			$('.loader').html('<div class="alert alert-danger alert-empty-page">'+ajaxerror_handler+'</div>');
		}
	});

	//init call for get cartridges
	//init base ajax call to get initial set
	getassets();

});



$(document).ready(function(){
	
	$(window).scroll(function () { 
	   if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
	   	setTimeout(function(){
	   		start = offset;
	   		offset = offset+8;
	   		getassets(start, offset);
	   	}, 500);
	    	
	   }
	});


});

function getassets(start, offset){
	//init base ajax call to get initial set
		//add loading effect 
	var ustart= start || 0;
	var ucount= offset || 8;

	$('.loader').html("<img src='themes/theme1/ui/img/loading.gif' />");
	//disable search button to prevent 
	$('#searchbtn').attr('disabled','disabled');
	//console.log(Object.keys(jQuery.parseJSON(assets)).length);
	if(assets != '' && Object.keys(assets).length < offsetcount){
		$('.scroll-more').html('No More cartridge available');
		$('.scroll-more').removeClass( "alert-info" ).addClass( "alert-danger" )
		$('.loader').html('');
	}else{
		$.ajax({
		  url: "cartridge_store/cartridgestore_search.jag?start="+ustart+"&count="+ucount,
		}).done(function(result) {
		    assets = $.parseJSON(result);
		    sortassets = assets; 
		    $('.cartridge-load').append(assetHTML(assets));
		    $('.loader').html('');
		});
	}
	

}

//generate assets
function assetHTML(assets){
	var html='';
	//return html base on that
	if(assets){

	$.each(assets, function(idx, obj) {
		html +='<div class="span3 asset">';
		html += 	'<a href="" id="'+obj.id+'" class="asset-img-hover">';
		html += 	'<div class="asset-icon">';
		html += 		'<img src="'+obj.attributes.images_thumbnail+'">';
		html +=		'</div></a>';
		html +=		'<div class="asset-details">';
		html +=			'<div class="asset-name"><a href=""> <h4>'+obj.attributes.overview_name+'</h4> </a></div>';
		html +=			'<div class="asset-rating"><div class="asset-rating-'+obj.rating.average+'star"></div></div>';
		html +=			'<div class="asset-author-category"><ul>';
		html +=				'<li><h4>Version</h4><a class="asset-version" href="#">'+obj.attributes.overview_version+'</a></li>';
		//html +=				'<li><h4>Category</h4><a class="asset-category" href="#">'+obj.type+'</a></li>';
		html +=				'<li><h4>Author</h4><a class="asset-author" href="#">'+obj.attributes.overview_provider+'</a></li>';
		html +=				'<li><button type="button" class="btn btn-default asset-detail-btn" > Details </button></li>';
		html +=				'<li><button type="button" class="btn btn-primary asset-download-btn" > Install </button></li>';
		html +=			'</ul></div>';
		html +=		'</div></div>';
	});
	

	}

	return html;
}

//check after ajax load
$(document).bind("DOMSubtreeModified",function(){
  
	$('.asset').hover(function(){
	 	$(this).find('.asset-details').stop().animate({top:'0px'},'slow');
	},function(){
		$(this).find('.asset-details').stop().animate({top:'200px'},'slow');
	})

});


$(document).on('click', '.asset-detail-btn', function () {
    // click handler code goes here
    console.log('hari do');
    $('#lightbox').fadeIn('slow');
});


$('.icons-circle-close').click(function(){
	$('#lightbox').fadeOut('slow');
});


$('#searchbtn').click(function(){
	
	searchcartridge(assets);
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        searchcartridge(assets);
    }
});





//handling sorting functions
function SortByName(a, b){
  var aName = a.attributes.overview_name.toLowerCase();
  var bName = b.attributes.overview_name.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

$('.atoz').click(function(){
	$('.atoz').css('display', 'none');
	$('.ztoa').css('display', 'block');
	
	var assets3 = sortassets;
	assets3.sort(SortByName).reverse();
	$('.cartridge-load').html( assetHTML(assets3));
});

$('.ztoa').click(function(){
	$('.ztoa').css('display', 'none');
	$('.atoz').css('display', 'block');
	
	var assets3 = sortassets;
	assets3.sort(SortByName);
	$('.cartridge-load').html( assetHTML(assets3));
});