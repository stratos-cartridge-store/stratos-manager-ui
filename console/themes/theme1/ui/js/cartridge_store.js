var ajaxerror_handler='';
var cartridge_set;
var puppet_data;
var assets = '';
var asset='';
var sortassets={};
var offsetcount=8;
var offset= 8;
var start = 0;
var sortOrder = "DES";
var sortBy = "overview_createdtime";
var search_word=''; 
var deploy_json='';

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
	   		getassets(start, offset, sortOrder, sortBy);
	   	}, 500);
	    	
	   }

	    if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
	});


	 // scroll body to 0px on click
        $('#back-to-top').click(function () {
            $('#back-to-top').tooltip('hide');
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
        
        $('#back-to-top').tooltip('show');
        $('.sortaz').tooltip();



});

function getassets(start, offset, sortOrder, sortBy, search){
	//init base ajax call to get initial set
	var ustart= start || 0,
		ucount= offset || 8,
		usortOrder= sortOrder || "DES",
		usearch= search || '',
		usortBy = sortBy || "overview_createdtime";
	//add loading effect
	$('.loader').html("<img src='themes/theme1/ui/img/loading.gif' />");

	if(assets != '' && Object.keys(assets).length < offsetcount){
		$('.scroll-more').html('No More cartridges available');
		$('.scroll-more').removeClass( "alert-info" ).addClass( "alert-danger" );
		$('.loader').html('');
	}else{
		//get json from store
		$.ajax({
		  url: "cartridge_store/cartridgestore_search.jag?start="+ustart+"&count="+ucount+"&sortOrder="+usortOrder+"&sortBy="+usortBy+"&search="+usearch,
		}).done(function(result) {
			cartridge_set = $.parseJSON(result);
			if(cartridge_set.errorMessage != ''){
				
				$('.loader').html('');
				$('.scroll-more').hide();
				//track multiple errors
				$.each(cartridge_set, function(idx, obj) {
					$('.loader').append('<div class="alert alert-danger alert-empty-page">'+obj.errorMessage+'</div>');
				});
					
			}else{
				puppet_data = cartridge_set.puppet_data;
			    assets = cartridge_set.store_data;
			    if(Object.keys(sortassets).length >0 ){
			     	sortassets = $.merge(sortassets,assets)
			    }else{
			     	sortassets =  assets; 
			    }
			    
			    $('.cartridge-load').append(assetListHTML(assets, puppet_data));
			    $('.loader').html('');
			}
		   	
		   	
		});
	}
	

}

//generate assets list
function assetListHTML(assets, puppet_data){
	var html='', button_text='', filename ='', button_style='';
	//return html base on that
	if(assets){
		
	$.each(assets, function(idx, obj) {

		filename = obj.attributes.overview_deployableName;
		if ($.inArray( filename , puppet_data.installed) >= 0) {
          	button_text = 'Deploy';
          	button_style = 'btn-danger asset-done-btn';
        }else if($.inArray( filename , puppet_data.inprogress) >= 0){

        	button_text = 'Progressing';
          	button_style = 'btn-default asset-done-btn';
        }else if($.inArray( filename , puppet_data.error) >= 0){
        	
        	button_text = 'Re-install';
          	button_style = 'btn-primary asset-download-btn';
        }
        else{
        
        	button_text = 'Install';
        	button_style = 'btn-primary asset-download-btn';
        }
		
		html +='<div class="span3 asset">';
		html += 	'<a href="" id="'+obj.id+'" class="asset-img-hover">';
		html += 	'<div class="asset-icon">';
		html += 		'<img src="'+obj.attributes.images_thumbnail+'">';
		html +=		'</div></a>';
		html +=		'<div class="asset-details">';
		html += '<div class="status-refresh" data-name="'+obj.attributes.overview_deployableName
					+'"><img src="themes/theme1/ui/img/arrow-refresh.png" alt="Click to get Status" data-toggle="tooltip" data-placement="right" title="Click to get Status"/></div>';
		html +=			'<div class="asset-name"><a href=""> <h4>'+obj.attributes.overview_name+'</h4> </a></div>';
		html +=			'<div class="asset-rating"><div class="asset-rating-'+obj.rating.average+'star"></div></div>';
		html +=			'<div class="asset-author-category"><ul>';
		html +=				'<li><h4>Version</h4><a class="asset-version" href="#">'+obj.attributes.overview_version+'</a></li>';
		html +=				'<li><h4>Author</h4><a class="asset-author" href="#">'+obj.attributes.overview_provider+'</a></li>';
		html +=				'<li><button type="button" class="btn btn-default asset-detail-btn" id="'+obj.id+'" data-name="'+obj.attributes.overview_deployableName+'" > Details </button></li>';
		html +=				'<li><button type="button" class="btn '+button_style+' " id="'+obj.id+'" data-name="'+obj.attributes.overview_deployableName+'">'+button_text+'</button></li>';
		html +=			'</ul></div>';
		html +=		'</div></div>';
		html += '';
	});
	

	}

	if(html==''){
		$('.scroll-more').html('No Cartridge found');
		$('#searchtxt').val('');
		start = 0;
		offset =8;
		assets ='';
	}
	

	return html;
}

//generate single asset details view
function assetHTML(asset, puppet_data){
	var html='';
	if (asset) {
		if (puppet_data.Code == '11') {
          	button_text = 'Deploy';
          	button_style = 'btn-danger asset-done-btn';
        }else if(puppet_data.Code == '12'){

        	button_text = 'Progressing';
          	button_style = 'btn-default asset-done-btn';
        }else if(puppet_data.Code == '10'){
        	
        	button_text = 'Re-install';
          	button_style = 'btn-primary asset-download-btn';
        }
        else{
        
        	button_text = 'Install';
        	button_style = 'btn-primary asset-download-btn';
        }
		html += '<div class="asset-description">';
        html += '	<div class="asset-description-header">';
        html += '   	<div class="row">';
        html += '            <div class="span9">';
        html += '                <div class="asset-banner">';
        html += '                   <img src="'+asset.attributes.images_banner+'">';
        html += '               </div>';
        html += '               <div class="asset-introduction-box">';
        html += '                   <img src="'+asset.attributes.images_thumbnail+'" class="intro-img">';
        html += '                   <h3>'+asset.attributes.overview_name+'</h3>';
        html += '                   <small> Version : '+asset.attributes.overview_version+'</small>';
        html += '                   <small> Version : '+asset.attributes.overview_category+'</small>';
        html += '                   <small>  by :  '+asset.attributes.overview_provider+' </small>';	
        html += '			<div class="status-refresh" data-name="'+asset.attributes.overview_deployableName
							+'"><img src="themes/theme1/ui/img/arrow-refresh.png" title="Click to get Status"/></div>';
		html +=				'<div class="detail-install"><button type="button" class="btn '+button_style+'" style="position: relative;" id="'+asset.id
							+'" data-name="'+asset.attributes.overview_deployableName+'">'
							+button_text+'</button></div>';
        html += '                </div>';
		html += '			</div>';
		html += '		</div>';
        html += '    </div>';
        html += '<div class="assetp-properties">';
        html += '<ul class="nav nav-tabs">';
        html += '	<li class="active"><a href="#tab-properties" data-toggle="tab" data-type="basic">Description</a></li>';
        html += '        </ul>';
        html += '        <div class="tab-content">';
        html += '            <div class="tab-pane active" id="tab-properties">';
        html += '                <div class="content">';
		html += asset.attributes.overview_description;
        html += '                </div>';
        html += '            </div>';
        html += '        </div>';
        html += '</div>';
        html += '</div>';
	}

	return html;
}


//generating deployemnt view html
function assetDeployHTML(asset){
	var html='';
	if (asset) {
		html += '<div class="asset-description">';
        html += '	<div class="asset-description-header">';
        html += '   	<div class="row">';
        html += '            <div class="span9">';
        html += '                <div class="json-editor">';
        html += '               </div>';
        html += '               <div class="asset-introduction-box">';
        html += '                   <img src="'+asset.attributes.images_thumbnail+'">';
        html += '                   <h3>'+asset.attributes.overview_name+'</h3>';
        html += '                   <small> Version : '+asset.attributes.overview_version+'</small>';
        html += '                   <small> Version : '+asset.attributes.overview_category+'</small>';
        html += '                   <small>  by :  '+asset.attributes.overview_provider+' </small>';	
		html +=				'<small><button type="button" class="btn btn-danger asset-curl-btn" style="position: relative;" id="'+asset.id
							+'" data-name="'+asset.attributes.overview_deployableName+'"> Deploy </button></small>';
        html += '                </div>';
		html += '			</div>';
		html += '		</div>';
        html += '    </div>';
        html += '</div>';
	}

	return html;
}


//detect event on DOMModification 
$(document).bind("DOMSubtreeModified",function(){
	$('.asset').hover(function(){
	 	$(this).find('.asset-details').stop().animate({top:'0px'},'slow');
	},function(){
		$(this).find('.asset-details').stop().animate({top:'200px'},'slow');
	})
});


//close down popup asset details
$('.icons-circle-close').click(function(){
	$('#lightbox').fadeOut('slow');
	$("body").css("overflow", "auto");
});



//handling sorting functions

$('.sortbyname .atoz').click(function(){
	$('.sortbyname .atoz').css('display', 'none');
	$('.sortbyname .ztoa').css('display', 'block');
	$('.cartridge-load').html('');
	start = 0;
	offset =8;
	assets ='';
	sortOrder = "DES";
	sortBy = "overview_name";
	search_word = $('#searchtxt').val();
	$('.scroll-more').html('Scroll Down to load more...');
	$('.scroll-more').removeClass( "alert-danger" ).addClass( "alert-info" );
	getassets(start, offset, sortOrder, sortBy, search_word);
});

$('.sortbyname .ztoa').click(function(){
	$('.sortbyname .ztoa').css('display', 'none');
	$('.sortbyname .atoz').css('display', 'block');
	$('.cartridge-load').html('');
	start = 0;
	offset =8;
	assets ='';
	sortOrder = "ASC";
	sortBy = "overview_name";
	search_word = $('#searchtxt').val();
	$('.scroll-more').html('Scroll Down to load more...');
	$('.scroll-more').removeClass( "alert-danger" ).addClass( "alert-info" );
	getassets(start, offset, sortOrder, sortBy, search_word);
});


$('.sortbydate .atoz').click(function(){
	$('.sortbydate .atoz').css('display', 'none');
	$('.sortbydate .ztoa').css('display', 'block');
	$('.cartridge-load').html('');
	start = 0;
	offset =8;
	assets ='';
	sortOrder = "DES";
	sortBy = "overview_createdtime";
	search_word = $('#searchtxt').val();
	$('.scroll-more').html('Scroll Down to load more...');
	$('.scroll-more').removeClass( "alert-danger" ).addClass( "alert-info" );
	getassets(start, offset, sortOrder, sortBy, search_word);
});

$('.sortbydate .ztoa').click(function(){
	$('.sortbydate .ztoa').css('display', 'none');
	$('.sortbydate .atoz').css('display', 'block');
	$('.cartridge-load').html('');
	start = 0;
	offset =8;
	assets ='';
	sortOrder = "ASC";
	sortBy = "overview_createdtime";
	search_word = $('#searchtxt').val();
	$('.scroll-more').html('Scroll Down to load more...');
	$('.scroll-more').removeClass( "alert-danger" ).addClass( "alert-info" );
	getassets(start, offset, sortOrder, sortBy, search_word);
});



//search function
function searchcartridge(search_word){
	var resultfind;
	var notification ='';
	
	if(search_word ==''){
		$('.cartridge-load').html('');
		$('.scroll-more').html('Please Enter Cartridge Name on Search field');
		$('.scroll-more').removeClass( "alert-danger" ).addClass( "alert-warning" );	
	}else{
		start = 0;
		offset =8;
		assets ='';
		$('.cartridge-load').html('');
		$('.scroll-more').html('Scroll Down to load more...');
		$('.scroll-more').removeClass( "alert-danger" ).addClass( "alert-info" );
		getassets(start, offset, sortOrder, sortBy,search_word);
	}


}

//trigger enter key & click
$('#searchbtn').click(function(){
	var search_word = $('#searchtxt').val();
	searchcartridge(search_word);
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        var search_word = $('#searchtxt').val();
		searchcartridge(search_word);
    }
});

//to trigger install button
$(document).on('click', '.asset-download-btn', function () {
    var cid = $(this).attr('id');
    var name = $(this).data('name');
    $(this).html('Progressing');
    $(this).removeClass('btn-primary').addClass('btn-default');
    $(this).attr('disabled','disabled');
    $(this).parent().parent().parent().parent().parent().find('.status-refresh').css('display','block');

    $.ajax({
		  url: "cartridge_store/cartridgestore_install.jag?cid="+cid,
	}).done(function(result) {
		   var notification = $.parseJSON(result);
		   //handle error status
		   notyfy({text: notification.puppet_data.Message, layout: 'bottomRight', type: notification.notification_type, timeout:5000});
	});

});

//get status of current cartridge
$(document).on('click', '.status-refresh', function (event) {
	var name = $(this).data('name');
	$.ajax({
		url: "cartridge_store/cartridgestore_asset_status.jag?name="+name,
	}).done(function(result) {
		var notification = $.parseJSON(result);
		if(notification.puppet_data.Code == '10'){
			$(event.target).parent().parent().find('.asset-download-btn').removeAttr('disabled').removeClass('btn-default').addClass('btn-primary asset-download-btn').html('Re-install');
			$(event.target).parent().hide();
		}else if(notification.puppet_data.Code == '11'){
			$(event.target).parent().parent().find('.asset-download-btn').removeAttr('disabled').removeClass('btn-default asset-download-btn').addClass('btn-danger asset-done-btn').html('Deploy');
			$(event.target).parent().hide();			
		}
		
		notyfy({text: notification.puppet_data.Message, layout: 'bottomRight', type: notification.notification_type, timeout:5000});
	});
	
});

//handling deployment script details
$(document).on('click', '.asset-done-btn', function () {
	var cid = $(this).attr('id');
	var name = $(this).data('name');
	// click popup loader
    $('#lightbox').fadeIn('slow');
    $("body").css("overflow", "hidden");
    $.ajax({
		  url: "cartridge_store/cartridgestore_asset_deploy.jag?cid="+cid+"&name="+name,
	}).done(function(result) {
		var returndata = $.parseJSON(result);
		console.log(returndata);
		var opt = { 
		        change: function(data) { 
		        	console.log(data);
		         	deploy_json = data;
		     	},
		        propertyclick: function(path) { /* called when a property is clicked with the JS path to that property */ }
		};



		$('#asset-detail-box').html(assetDeployHTML(returndata.store_data) );

		if(returndata.puppet_data.Code == '404'){
			notyfy({text: returndata.puppet_data.Message, layout: 'bottomRight', type: 'error', timeout:5000});
		}else{
			deploy_json = returndata.puppet_data;
			$('.json-editor').jsonEditor(deploy_json, opt);
		}

	});
   

});



//to trigger asset details
$(document).on('click', '.asset-detail-btn', function () {
    // click handler code goes here
    $('#lightbox').fadeIn('slow');
    var cid = $(this).attr('id');
    var name = $(this).data('name');

    $.ajax({
		  url: "cartridge_store/cartridgestore_asset.jag?cid="+cid+"&name="+name,
		}).done(function(result) {
		    asset = $.parseJSON(result);
		    console.log(asset);
		    $('#asset-detail-box').html(assetHTML(asset.store_data, asset.puppet_data));
		});
});


//to trigger 	curl
$(document).on('click', '.asset-curl-btn', function () {
		
	$.ajax({
		url: "cartridge_store/cartridgestore_asset_json.jag",
		data: { djson: JSON.stringify(deploy_json)},
		type: 'POST',
		dataType: "json"
	}).done(function(result) {
		// asset = $.parseJSON(result);
		console.log(result);
	});

});
