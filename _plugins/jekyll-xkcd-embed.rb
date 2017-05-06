require 'rubygems'
require 'json'
require 'net/http'
require 'cgi'

module Jekyll

	class XkcdEmbed < Liquid::Tag
		def	initialize(tag_name, number, tokens)
			super
			@number = number.strip
		end
		
		def render(context)
			@env = Jekyll::env
			if @env != "production"
				return
			end
			url = "\"https://xkcd.com/" + @number + "\""
			jsonUrl = "https://xkcd.com/" + @number + "/info.0.json"
			resp = Net::HTTP.get_response(URI.parse(jsonUrl))			
			if resp.code == '404'
				"<span><a href=" + url + ">xkcd-" + @number + "</a></span>"
			else
				result = JSON.parse(resp.body)
				"<figure class=\"xkcd-embed\">
					<a href=" + url + ">" + 
						"<img" + 
							" src=\"" + result["img"] + "\"" + 
							" title=\"" + CGI::escapeHTML(result["alt"]) + "\"" + 
							" alt=" + url + 
						">" +
					"</a>" + 
					"<figcaption>" +
						"\"" + CGI::escapeHTML(result["title"]) + "\" - created by <a href=\"http://xkcd.com\">xkcd</a>" + 
					"</figcaption>" +
				"</figure>"
			end
		end
	end
end

Liquid::Template.register_tag('xkcd', Jekyll::XkcdEmbed)