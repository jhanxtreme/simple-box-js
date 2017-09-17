/**
	Name: jhanweb-simple-box
	Description: A simple lightweight and responsive popup box.
	CreatedAt: 9/13/2017
	Author: Jhan Mateo
	Github: https://github.com/jhanxtreme/simple-box-js
**/
;(function($, window, document){
	$(document).ready(function(){
		$.fn.simpleBox = function(config){

			var targetElement = $(this);

			if(config.targetType == "images"){
				images();
			}else if(config.targetType == "modal"){
				modal();
			}else{
				console.log("Target type not found.")
			}


			function modal(){
				console.log('Simple-Box :: Loading modals');
				var settings = {
					attributes: {
						dataModalSource: "data-modal-source",
						dataModalTrigger: "data-modal-trigger"
					},
					modalSources : targetElement,
					triggerName: null,
					timeout: null,
					ms: 100,
					css: {
						width: config.width || '50%',
						height: config.height || '50%',
						borderRadius: config.borderRadius || '.5em',
						padding: config.padding || '1em'
					},
					classTarget: ".simple-box.modal"
				};

				var initClickEvents = function(){
					for(var i=0; i < settings.modalSources.length; i++){
						var sourceName = settings.modalSources[i].getAttribute(settings.attributes.dataModalSource);
						$("*["+settings.attributes.dataModalTrigger+"=" + sourceName + "]").click(function(e){
							settings.triggerName = $(this)[0].dataset.modalTrigger;
							$(settings.classTarget+ "[" +settings.attributes.dataModalSource+"=" + settings.triggerName + "]").addClass('show');
							if(settings.timeout){
								clearTimeout(settings.timeout);
							}

							timeout = setTimeout(function(){
								$(settings.classTarget+ "[" +settings.attributes.dataModalSource+"=" + settings.triggerName + "] .content")
									.css({ 'width': settings.css.width, 'height': settings.css.height, 'border-radius': settings.css.borderRadius, 'padding': settings.css.padding })
									.addClass('show');
							}, settings.ms);
						});
					}

					close();
				};

				var close = function(){
					$(".simple-box.modal").click(function(e){
						e.preventDefault();
						if(e.target === $(this)[0]){
							$(settings.classTarget+ "[" +settings.attributes.dataModalSource+"=" + settings.triggerName + "]").removeAttr('style').removeClass('show');
							$(settings.classTarget+ "[" +settings.attributes.dataModalSource+"=" + settings.triggerName + "] .content").removeAttr('style').removeClass('show');
						}
					});
				};

				initClickEvents();
			}


			function images(){
				console.log('Simple-Box :: Loading images');
				var settings = {
					config: {
						animation: {
							lib: 'default',
							classes: 'animate'
						},
						targetType: null,
					},
					availableTargetTypes: ['images','iframes','forms','html', 'modal'],
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
							fullWidthPadded90: { 'width': '90%', 'width' : 'calc(100% - 10%)', 'margin': '2em auto'},
							marginCenter2emAuto: {'margin': '2em auto'},
							autoWidth: { 'width' : 'auto'},
							fullHeight:  { 'height' : '100%'},
							autoHeight: { 'height' : 'auto'},
							vAlignCenter: { 'margin': 'auto', 'position': 'absolute', 'top': '0', 'left': '0','bottom': '0', 'right': '0' },
							modalOuterOverflow: { 'overflow-x': 'hidden', 'overflow-y': 'auto' },
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
						ms: 50
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
					$(settings.modal.ModalOuter).removeClass(settings.css.displayClassName).removeAttr('style');
					$(settings.modal.ModalInner).removeClass(settings.css.displayClassName).removeAttr('style');
					$('body').removeAttr('style');
				};

				var removeInlineStyles = function(){
					//reset inlinestyles
					$(settings.modal.ModalOuter).removeAttr('style');
					$(settings.modal.ModalInner).removeAttr('style');
					$(settings.modal.ModalTargetedInstance).removeAttr('style');
				};

				var showModal = function(){
					//remove loading from the screen
					$(settings.modal.ModalLoading).removeClass(settings.css.displayClassName);
					//show the inner content
					$(settings.modal.ModalInner).addClass(settings.css.displayClassName);
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

				var calcContentPosition = function(){

					var calcHorizontalCenter = function(){
						$(settings.modal.ModalInner).append(settings.modal.ModalTargetedInstance);
						var ModalInnerHeight = $(settings.modal.ModalInner).height();

						if(ModalInnerHeight <= window.innerHeight){
							$(settings.modal.ModalInner).css(settings.css.inline.vAlignCenter);
							$(settings.modal.ModalTargetedInstance).css(settings.css.inline.vAlignCenter);
						}
					};

					//window.width > target.width && window.height > target.height
					if(window.innerWidth > settings.target.dimensions.original.width &&
						window.innerHeight > settings.target.dimensions.original.height ){
						$(settings.modal.ModalTargetedInstance).css(settings.css.inline.vAlignCenter);
						$(settings.modal.ModalInner).css(settings.css.inline.vAlignCenter);
					}

					//window.width > target.width && window.height < target.height
					if(window.innerWidth > settings.target.dimensions.original.width &&
						window.innerHeight < settings.target.dimensions.original.height){
						$(settings.modal.ModalTargetedInstance).css(settings.css.inline.marginCenter2emAuto);
					}

					//window.width < target.width (for large sizes)
					if(window.innerWidth <= settings.target.dimensions.original.width){
						$(settings.modal.ModalTargetedInstance).css(settings.css.inline.fullWidthPadded90);
					}

					//calculate center
					calcHorizontalCenter();
			
				};

				
				var calibrateContent = function(){
					//reset inlinestyles
					removeInlineStyles();
					//calculate contenet position
					calcContentPosition();			
					//show the modal
					showModal();
				};

				var loadModalElements = function(){
					//check if parent modal has exists in the body
					if($(settings.modal.ModalOuter).length == 0){
						$('<div class="jw-simple-box images transparent" id="jw-simple-box"><div class="loading spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><div class="jw-simple-box-inner" id="jw-simple-box-inner"></div></div>').prependTo('body');

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

				var initImageInstance = function(elem){
					var imageInstance = elem.attr(settings.attributes.dataSource);
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
						calibrateContent();
					};
				}
					
				var listenClick = function(elem){
					elem.click(function(e){
						e.preventDefault();
						preLoadModal();
						initImageInstance($(this));
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
							calibrateContent();
						}
					});
				};

				overRideConfigurations(config);
				loadModalElements();
				responseWhenResize();
				listenClick(targetElement);
			}

			
		};
	});
})(jQuery, window, document);