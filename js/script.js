;(function($){
    var _image="";
	$.fullMark=function( zIndex ){
		var mark=$("<div></div>");
		zIndex = zIndex ? zIndex : 2 ;
		mark.css({
			"width" : "100%",
			"height" : "100%",
			"position" : "absolute",
			"background" : "rgba( 0,0,0,0.8 )",
			"left" : "0" ,
			"top" : "0",
			"z-index" : zIndex
		})
		mark.appendTo( $(".main>div").eq(0) );
		return mark;
	}
	$("#upfile").live("change",function(e){
		$("#canvas").remove();
		var file = e.target.files[0] ;
		var reader=new FileReader();
		reader.onload = function(e2) {
			var src = e2.target.result;
			var img = new Image();
			img.src = src;
			img.onload = function(){
                 //canvas( this.src )
                 _image=this
                 canvas( img )
			}

		}

		reader.readAsDataURL(file);
		$(this).parent().html( '<input type="file" id="upfile">' )
	})
	var changGray = (function (  ){

        function getGray(r,g,b){
          return 0.299*r + 0.578*g + 0.114*b;
        }

        return function( ctx ){
          var imgColorData = ctx.getImageData(17, 17, 600, 767);


          for( var i=0; i<imgColorData.data.length; i+=4 ){
            var r = imgColorData.data[i+0];
            var g = imgColorData.data[i+1];
            var b = imgColorData.data[i+2];
            var gray = getGray( r,g,b );

            imgColorData.data[i+0] = gray;
            imgColorData.data[i+1] = gray;
            imgColorData.data[i+2] = gray;
            imgColorData.data[i+3] = 255;
          }

          return imgColorData;
        }
    })();


    function upload(Pic,callback) {

			    Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "")

			    //console.log( Pic )
			    // Sending the image data to Server
			    $.ajax({

			        url: 'upload.php',
			        type: 'post',
			        data: {
			        	"img":Pic
			        },
			        //contentType: 'application/json; charset=utf-8',
			        //dataType: 'json',
			        success: function (res) {
			        	console.log( res )
                        //location.href = res.data.page_url;
			        },
	        	error:function(){
	        		alert( "请求失败" );
	        	}
			    });
			}
/*function upload(file){
		//console.log( file )
		$.ajax({
			url:"upload.php",
			type:"post",
			//dataType:"json",
        	data:{
        		"img":file
        	},
        	success:function(data){
        		console.log( data )
        	},
        	error:function(){
        		alert( "请求失败" );
        	}
        })
	}*/

	var mark=null;
	$("#small-img").on( "tap" ,"li" ,function(e){
		e.stopPropagation();
		mark=$.fullMark();
		$(".hide").show();
		$("#large-img").show();
		var mySwiper = new Swiper ('.swiper-container', {
			direction: 'horizontal',
			loop: true
		})
	} )
	$(document).on("tap",function(){
		if( mark ){
			$(".hide").on("tap",function(e){
				e.stopPropagation();
				$(".hide").hide();
				mark.remove();
				$("#large-img").hide();

			})
		}
	})

	$("#create-poster").on("tap",function(){
		$("#canvas").remove();
		var can = canvas( _image )[0];
    var imgData = can.toDataURL("image/png");
		upload( imgData );
		$("#uploadbox").removeClass("editimg");
		$(".tip").show();
		$(".img-info").hide();
		$("#back").parent().hide();
		$("#photoBall").parent().show();
		$("#input-start").parent().show();
		$(this).parent().hide();

	})
	$("#ok").on( "tap" ,function(){
		if(_image!=""){
			$("#canvas2").remove();
		$("#uploadbox").addClass("editimg");
		$('#upload-btn').parent().hide();
		$(".tip").hide();
		$(".img-info").show();
		$(this).parent().hide();
		$("#back").parent().show();
		$("#create-poster").parent().show();
		}


	} );
	$("#back").on( "tap" ,function(){
		$("#canvas2").remove();
		$(this).parent().show();
		$("#ok").parent().show();
		$("#upload-btn").parent().show();
		$("#back").parent().hide();
		$("#create-poster").parent().hide();
		$("#uploadbox").removeClass("editimg");
		$(".tip").show();
		$(".img-info").hide();
	} );

	$( "#font-color" ).on( "tap" , "span" , function(){
		$(this).addClass("on").siblings().removeClass("on")
	} )
	function canvas(imageData){
    if( imageData.width>imageData.height ){
      var ratio = (imageData.width / imageData.height),
          imgHeight=810;
          imgWidth = ratio*810;
    }else if(  imageData.width<imageData.height ){
      var ratio = (imageData.height/ imageData.width),
          imgWidth=640;
          imgHeight = ratio*640;
    }else{
      var imgWidth=810;
          imgHeight = 810;
    }

		$( "#uploadbox img" ).show();
		var canvas=$("<canvas id='canvas'></canvas>");
		$( "#uploadbox img" ).hide();
		canvas[0].width=640;
		canvas[0].height=810;

		ctxt=canvas[0].getContext("2d");
    ctxt.drawImage(imageData,(imgWidth-640)/2,(imgHeight-810)/2,imageData.width,imageData.height,0,0,imgWidth,imgHeight);

    grayImgCol = changGray( ctxt );
    ctxt.clearRect(0, 0, 640, 810);
    ctxt.putImageData( grayImgCol,17, 17 );
    drawFont( ctxt )
		canvas.appendTo( $("#uploadbox .my-photo") );
	  return canvas
	}


	function drawImage( cvs , h , w , src ){
		var newImage=new Image();
		newImage.onload=function(){
			cvs.drawImage(this,0,0,w,h);
			drawFont( cvs );
		}
		newImage.src=src;
	}
	function drawFont( cvs ){
		var font={
			h:{
				x:40,
				t:500,
				text:$("#my-msg h2").text(),
				fontsize:82
			},
			p1:{
				x:40,
				t:567,
				text:$("#my-msg p").eq(0).text(),
				fontsize:24
			},
			p2:{
				x:40,
				t:610,
				text:$("#my-msg p").eq(1).text(),
				fontsize:24
			},
			p3:{
				x:40,
				t:650,
				text:$("#my-msg p").eq(2).text(),
				fontsize:24
			},
			p4:{
				x:40,
				t:735,
				text:$("#my-msg p").eq(3).text(),
				fontsize:24
			}

		};
		cvs.fillStyle="#fd0c9f";
		$.each(font,function(x,k){
			cvs.font =k.fontsize+"px Courier New";
			cvs.fillText( k.text , k.x ,k.t);
		})
	}
})(Zepto)
