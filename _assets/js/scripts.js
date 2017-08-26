// A $( document ).ready() block.
$( document ).ready(function() {

	var $siteNav = $('.site-nav');
		var $siteNavToggle = $('.site-nav-toggle');

	$siteNavToggle.click(function () {
		$siteNav.toggleClass('is-toggled');
	});

  $('.post-content a').not('[rel="footnote"], [rev="footnote"]').html(function(i, str) {
      return str.replace(/ /g,'&nbsp;');
  }).attr('target','_blank');

  $(".post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6").each(function(i, el) {
    var $el, icon, id;
    $el = $(el);
    id = $el.attr('id');
    icon = '#';
    if (id) {
      return $el.append($("<a />").addClass("header-link").attr("href", "#" + id).html(icon));
    }
  });

  // init smooth scroll
  $("a").smoothScroll({offset: -20});
});

