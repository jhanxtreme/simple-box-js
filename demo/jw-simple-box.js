/**
	Name: jhanweb-simple-box
	Description: A simple lightweight and responsive popup box.
	CreatedAt: 9/13/2017
	Author: Jhan Mateo
	Github: https://github.com/jhanxtreme/simple-box-js
**/
$(document).ready(function(){
	$.fn.popBox = function(config){

		console.log('Simple Box Loaded.');

		var settings = {
			config: {
				animation: {
					lib: 'default',
					classes: 'animate'
				},
				targetType: null,
			},
			availableTargetTypes: ['images','iframes','forms','html'],
			modal: {
				ModalOuter: '.jw-simple-box',
				ModalInner: '.jw-simple-box-inner',
				ModalLoading: '.jw-simple-box .loading',
				ModalTargetedInstance: null,
				ModalTargetedInstanceName: '#targeted-element'
			},
			target: {
				dimensions: {
					current: {
						width: 0,
						height: 0
					},
					original: {
						width: 0,
						height: 0
					}
				},
				window:{
					width: 0,
					height: 0
				}
			},
			autoWidths : ['100%', 'auto'],
			css: {
				inline: {
					fullWidthPadded: { 'width': '80%', 'width' : 'calc(100% - 20%)', 'margin': '2em auto'},
					fullWidth:  { 'width' : '100%'},
					autoWidth: { 'width' : 'auto'},
					fullHeight:  { 'height' : '100%'},
					autoHeight: { 'height' : 'auto'},
					vAlignCenter: {
						'margin': 'auto',
						'position': 'absolute',
						'top': '0', 
						'left': '0',
						'bottom': '0',
						'right': '0'
					},
					modalOuterOverflow: {
						'overflow-x': 'hidden',
						'overflow-y': 'auto',
					},
					overflowHidden: {'overflow': 'hidden'}
				},
				displayClassName: "show",
			},
			attributes:{
				dataSource: 'data-source'
			},
			setVerticalAlignCenter: false,
			messages:{
				typeNotFound: "Target type not found"
			},
			timeout: {
				instance: null,
				ms: 100
			}
		};

		var overRideConfigurations = function(paramsObj){
			for(var name in paramsObj){
				settings.config[name] = paramsObj[name];
			}
		};

		var closeModal = function(){
			console.log('modal closed.');
			settings.setVerticalAlignCenter = false;
			settings.modal.ModalTargetedInstance = 0;
			if($(settings.modal.ModalOuter + ' ' + settings.modal.ModalTargetedInstanceName).length !== 0){
				$(settings.modal.ModalOuter + ' ' + settings.modal.ModalTargetedInstanceName).remove();
				settings.modal.ModalTargetedInstance = null;
			}
			$(settings.modal.ModalOuter).removeClass(settings.css.displayClassName);
			$(settings.modal.ModalInner).removeClass(settings.css.displayClassName).removeAttr('style');
			$('body').removeAttr('style');
		};

		var removeInlineStyles = function(){
			//reset inlinestyles
			$(settings.modal.ModalOuter).removeAttr('style');
			$(settings.modal.ModalInner).removeAttr('style');
			$(settings.modal.ModalTargetedInstance).removeAttr('style');
		};

		var renderModal = function(){
			//disable the body scrolling feature
			$('body').css(settings.css.inline.overflowHidden);

			//add css scroll 
			if(settings.timeout.instance){
				clearTimeout(settings.timeout);
			}

			//delay the display after the animation
			settings.timeout.instance = setTimeout(function(){
				$(settings.modal.ModalOuter).css(settings.css.inline.modalOuterOverflow);
			}, settings.timeout.ms);
		};

		var showBox = function(){

			//reset inlinestyles
			removeInlineStyles();

			//if window width is lesser than source width
			if(window.innerWidth < settings.target.dimensions.original.width){
				console.log('responsive activate width!');
				settings.target.dimensions.current.width = 'auto';
				$(settings.modal.ModalTargetedInstance).css(settings.css.inline.fullWidthPadded);
			}else{
				settings.target.dimensions.current.width = settings.target.dimensions.original.width + 'px';
				settings.target.dimensions.current.height = settings.target.dimensions.original.height + 'px';
			}

			//if window height is lesser than source height
			if(window.innerHeight < settings.target.dimensions.original.height){
				settings.target.dimensions.current.height = 'auto';
			}else{
				settings.target.dimensions.current.height = settings.target.dimensions.original.height + 'px';
				settings.setVerticalAlignCenter = true;
			}

			//if targeted elements height is lesser than the window height, then make it center
			if(settings.setVerticalAlignCenter){
				$(settings.modal.ModalTargetedInstance).css(settings.css.inline.vAlignCenter);
				$(settings.modal.ModalInner).css(settings.css.inline.vAlignCenter);
			}

			//apply the css styles 
			$(settings.modal.ModalInner)
				.append(settings.modal.ModalTargetedInstance)
				.css({ 'width' : settings.target.dimensions.current.width, 'height' : settings.target.dimensions.current.height})
				.addClass(settings.css.displayClassName);

			//remove loading from the screen
			$(settings.modal.ModalLoading).removeClass(settings.css.displayClassName);

			renderModal();
		
		};

		var loadModalElements = function(){
			//check if parent modal has exists in the body
			if($(settings.modal.ModalOuter).length == 0){
				$('<div class="jw-simple-box transparent" id="jw-simple-box"><div class="loading spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><div class="jw-simple-box-inner"></div></div>').prependTo('body');

				//apply css animations
				$(settings.modal.ModalInner).addClass(settings.config.animation.classes);

			}else{
				console.log('PopBox already loaded.');
			}
		};

		var preLoadModal = function(){
			//show the modal
			if(settings.availableTargetTypes.indexOf(settings.config.targetType) > -1){
				$(settings.modal.ModalOuter).addClass(settings.css.displayClassName);
				$(settings.modal.ModalLoading).addClass(settings.css.displayClassName);
			}else{
				console.log(settings.messages.typeNotFound);
			}
		};
			
		var listenClick = function(elem){
			elem.click(function(e){
				e.preventDefault();

				preLoadModal();

				if(settings.availableTargetTypes.indexOf(settings.config.targetType) > -1){
					var imageInstance = $(this).attr(settings.attributes.dataSource);
					settings.modal.ModalTargetedInstance = new Image();
					settings.modal.ModalTargetedInstance.src = imageInstance;
					settings.modal.ModalTargetedInstance.setAttribute('id', 'targeted-element');
					settings.modal.ModalTargetedInstance.onload = function(){
						//set current dimensions
						settings.target.dimensions.current.width = this.naturalWidth;
						settings.target.dimensions.current.height = this.naturalHeight;
						//store original dimensions
						settings.target.dimensions.original.width = settings.target.dimensions.current.width;
						settings.target.dimensions.original.height = settings.target.dimensions.current.height;
						//trigger the box
						showBox();
					};
				}else{
					console.log(settings.messages.typeNotFound);
				}

			});

			$(settings.modal.ModalOuter).on('click', function(e){
				console.log(e.target.id);
				if(e.target.id != "targeted-element"){
					closeModal();
				}
			});
		
		};

		var responseWhenResize = function(){
			$(window).on('resize', function(){

				//get window width
				settings.target.window.width = $(this).width();

				//get window height
				settings.target.window.height = $(this).height();

				//get current width of the targeted element				
				var elementWidth = (settings.autoWidths.indexOf(settings.target.dimensions.current.width) > -1 ) ? settings.target.dimensions.current.width : parseInt((settings.target.dimensions.current.width + "").replace(/px/,''));

				//check element is available
				if(elementWidth !== 0){

					//reset inline css styles
					removeInlineStyles();

					//if the targeted element's width is greater than the window, make the width 100%
					if(settings.target.dimensions.original.width > settings.target.window.width){
						$(settings.modal.ModalInner).css(settings.css.inline.fullWidthPadded);
						$(settings.modal.ModalTargetedInstance).css(settings.css.inline.fullWidth);
					}else{
						//reset all css styles to default
						$(settings.modal.ModalInner).css({ 'width' : settings.target.dimensions.original.width + 'px', 'margin': '0 auto !important'});
						$(settings.modal.ModalTargetedInstance).css(settings.css.inline.autoWidth);
					}

					//targeted element align to center of the screen
					if(settings.setVerticalAlignCenter){
						$(settings.modal.ModalTargetedInstance).css(settings.css.inline.vAlignCenter);
						$(settings.modal.ModalInner).css(settings.css.inline.vAlignCenter);
					}

					renderModal();

				}

			});
		};

		overRideConfigurations(config);
		loadModalElements();
		responseWhenResize();
		listenClick($(this));
	};
});