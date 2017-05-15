// A $( document ).ready() block.
$( document ).ready(function() {

	var $siteNav = $('.site-nav');
		var $siteNavToggle = $('.site-nav-toggle');

	$siteNavToggle.click(function () {
		$siteNav.toggleClass('is-toggled');
	});

  // init smooth scroll
  $("a").smoothScroll({offset: -20});
});


