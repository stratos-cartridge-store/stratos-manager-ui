var assets;
var ajaxerror_handler='';
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

			$('.middle').html('<div class="col-lg-12"><div class="alert alert-danger alert-empty-page">'+ajaxerror_handler+'</div></div>');
		}
	});
});

//ajax call for base render
$(function(){
	console.log('its working');
	$('.loader').html("<img src='themes/theme1/ui/img/loading.gif' />");
	$('#searchbtn').attr('disabled','disabled');
	$.ajax({
	  url: "cartridge_store/cartridgestore_load.jag",
	}).done(function(result) {
	    assets = result;
	   //$('#myDiv').html("loading done" + result);
	  	$('.middle').html(assetHTML($.parseJSON(assets)));
	  	$('#searchbtn').removeAttr('disabled');

	});

});

//generate assets
function assetHTML(assets){

	//return html base on that
	if(assets){
		html = '<div id="assets-container"><div class="row-fluid">';

	$.each(assets, function(idx, obj) {
		html +='<div class="span3 asset">';
		html += 	'<a href="" id="'+obj.id+'" class="asset-img-hover">';
		html += 	'<div class="asset-icon">';
		html += 		'<img src="https://54.227.235.190:9448'+obj.attributes.images_thumbnail+'">';
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
	
		html += '</div></div>';
	}

	return html;
}

function getObjects(object, val) {
    var objects = [];
    $.each(object, function(idx, obj) {
			//if (obj.attributes.overview_name.toLowerCase() == val.toLowerCase()) {
		if (obj.attributes.overview_name.toLowerCase().indexOf(val.toLowerCase()) >= 0 ) {
             objects.push(obj);
        }
	});
    return objects;
}

//search function
function searchcartridge(assets){
	var resultfind;
	var notification ='';
	var assets2 = $.parseJSON(assets);
	var search_word = $('#searchtxt').val();

	if(search_word ==''){
		notification = '<div class="col-lg-12"><div class="alert alert-danger alert-empty-page">Please Enter Cartridge Name on Search field</div></div>';
		$('.middle').html(notification);
		resultfind = assets2;
		
	}else{
		resultfind = getObjects(assets2, search_word);
	}

	
	if(jQuery.isEmptyObject(resultfind)){
		notification = '<div class="col-lg-12"><div class="alert alert-warning alert-empty-page">No matched Cartridge. Re-try</div></div>';
		$('.middle').html(notification);
	}else{
		$('.middle').html(notification + assetHTML(resultfind));
	}

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
	
	var assets3 = $.parseJSON(assets);
	assets3.sort(SortByName).reverse();
	$('.middle').html( assetHTML(assets3));
});

$('.ztoa').click(function(){
	$('.ztoa').css('display', 'none');
	$('.atoz').css('display', 'block');
	
	var assets3 = $.parseJSON(assets);
	assets3.sort(SortByName);
	$('.middle').html( assetHTML(assets3));
});